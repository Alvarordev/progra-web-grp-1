export default function createSessionRepository({
  persistentRepository,
  tabRepository,
  preferencesRepository,
}) {
  async function remove() {
    await Promise.all([persistentRepository.remove(), tabRepository.remove()])
  }

  return {
    async get() {
      const tabSession = await tabRepository.get()
      return tabSession ?? (await persistentRepository.get())
    },
    async start(value, remember = false) {
      const [previousPersistent, previousTab, previousPreferences] = await Promise.all([
        persistentRepository.get(),
        tabRepository.get(),
        preferencesRepository.get(),
      ])
      const target = remember ? persistentRepository : tabRepository
      const other = remember ? tabRepository : persistentRepository
      try {
        await target.save(value)
        await other.remove()
        await preferencesRepository.save({ remember })
        return value
      } catch (cause) {
        // Restaurar la identidad previa si una escritura intermedia falla.
        const results = await Promise.allSettled([
          previousPersistent === null
            ? persistentRepository.remove()
            : persistentRepository.save(previousPersistent),
          previousTab === null ? tabRepository.remove() : tabRepository.save(previousTab),
          preferencesRepository.save(previousPreferences),
        ])
        if (results.some(result => result.status === 'rejected')) {
          throw new Error(
            'No se pudo completar el inicio de sesión. Revise el almacenamiento del navegador antes de continuar.',
            { cause }
          )
        }
        throw cause
      }
    },
    async save(value) {
      if (value === null) {
        await remove()
        return null
      }
      // Actualizar el perfil conserva la modalidad elegida al iniciar sesión.
      const currentTab = await tabRepository.get()
      if (currentTab !== null) {
        return await tabRepository.save(value)
      }
      const currentPersistent = await persistentRepository.get()
      return await (
        currentPersistent !== null ? persistentRepository : tabRepository
      ).save(value)
    },
    remove,
  }
}
