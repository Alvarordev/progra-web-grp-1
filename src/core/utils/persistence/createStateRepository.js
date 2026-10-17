// Cada repositorio guarda un estado bajo una clave propia del navegador.
export default function createStateRepository({
  name,
  defaultValue,
  validate,
  storage = 'localStorage',
}) {
  const key = `congress:${name}`

  function assertValid(value) {
    if (!validate(value)) {
      throw new Error('Los datos no tienen el formato esperado.')
    }
  }

  return {
    async get() {
      let stored
      try {
        const text = window[storage].getItem(key)
        if (text === null) return structuredClone(defaultValue)
        stored = JSON.parse(text)
      } catch (cause) {
        throw new Error('No se pudieron leer los datos guardados en este navegador.', { cause })
      }

      // Conservamos el formato existente para recuperar los datos ya guardados.
      if (stored?.version !== 1) {
        throw new Error('La versión de los datos guardados no es compatible.')
      }
      assertValid(stored.data)
      return stored.data
    },
    async save(value) {
      assertValid(value)
      try {
        const text = JSON.stringify({ version: 1, data: value })
        const stored = JSON.parse(text)
        assertValid(stored.data)
        window[storage].setItem(key, text)
        return stored.data
      } catch (cause) {
        throw new Error('No se pudieron guardar los datos en este navegador.', { cause })
      }
    },
    async remove() {
      try {
        window[storage].removeItem(key)
      } catch (cause) {
        throw new Error('No se pudieron eliminar los datos de este navegador.', { cause })
      }
    },
  }
}
