function isJsonValue(value, ancestors = new Set()) {
  if (value === null) return true
  if (typeof value === 'number') return Number.isFinite(value)
  if (typeof value !== 'object') return ['string', 'boolean'].includes(typeof value)
  if (ancestors.has(value)) return false

  const prototype = Object.getPrototypeOf(value)
  if (!Array.isArray(value) && prototype !== Object.prototype && prototype !== null) return false
  if (Object.getOwnPropertySymbols(value).length > 0) return false

  ancestors.add(value)
  const values = Array.isArray(value) ? Array.from(value) : Object.values(value)
  const valid = values.every((item) => isJsonValue(item, ancestors))
  ancestors.delete(value)
  return valid
}

export default function createStateRepository({
  adapter,
  name,
  defaultValue,
  validate,
  version = 1,
}) {
  const key = `congress:${name}`

  function assertValid(value) {
    if (!isJsonValue(value)) {
      throw new Error('Los datos deben ser serializables como JSON.')
    }
    if (!validate(value)) {
      throw new Error('Los datos no tienen el formato esperado.')
    }
  }

  assertValid(defaultValue)

  return {
    async get() {
      const stored = await adapter.get(key)

      if (stored === null) {
        return structuredClone(defaultValue)
      }

      if (stored.version !== version) {
        throw new Error('La versión de los datos guardados no es compatible.')
      }

      assertValid(stored.data)
      return stored.data
    },
    async save(value) {
      assertValid(value)
      // Una copia evita que una mutación posterior cambie lo que se guarda.
      const data = structuredClone(value)
      await adapter.save(key, { version, data })
      return data
    },
    async remove() {
      await adapter.remove(key)
    },
  }
}
