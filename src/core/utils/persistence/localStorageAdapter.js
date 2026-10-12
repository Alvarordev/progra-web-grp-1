// El acceso al navegador ocurre al ejecutar cada operación, no al importar.
export function createLocalStorageAdapter(getStorage = () => window.localStorage) {
  return {
    async get(key) {
      try {
        const value = getStorage().getItem(key)
        return value === null ? null : JSON.parse(value)
      } catch (cause) {
        throw new Error('No se pudieron leer los datos guardados en este navegador.', { cause })
      }
    },
    async save(key, value) {
      try {
        getStorage().setItem(key, JSON.stringify(value))
      } catch (cause) {
        throw new Error('No se pudieron guardar los datos en este navegador.', { cause })
      }
    },
    async remove(key) {
      try {
        getStorage().removeItem(key)
      } catch (cause) {
        throw new Error('No se pudieron eliminar los datos de este navegador.', { cause })
      }
    },
  }
}
