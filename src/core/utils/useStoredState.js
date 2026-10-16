import { useEffect, useState } from 'react'

// Carga una vez por repositorio; solo persiste cuando se llama a save.
export default function useStoredState(repository, initialValue) {
  const [value, setValue] = useState(initialValue)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    repository.get().then((data) => {
      if (active) setValue(data)
    }).catch((cause) => {
      if (active) setError(cause.message)
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [repository])

  async function save(nextValue) {
    setSaving(true)
    setError('')
    try {
      const data = await repository.save(nextValue)
      setValue(data)
      return data
    } catch (cause) {
      setError(cause.message)
      throw cause
    } finally {
      setSaving(false)
    }
  }

  return { value, loading, saving, error, save }
}
