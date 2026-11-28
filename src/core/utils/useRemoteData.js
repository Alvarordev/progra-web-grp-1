import { useCallback, useEffect, useState } from 'react'

/* Carga los datos de un endpoint y permite volver a pedirlos con `recargar`.
   `cargar` debe ser una función estable (por ejemplo, una importada de
   core/utils/*Api.js). Mientras se recarga se conservan los datos anteriores. */
export default function useRemoteData(cargar) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let activo = true

    cargar()
      .then(resultado => {
        if (activo) {
          setData(resultado)
          setError('')
        }
      })
      .catch(causa => {
        if (activo) {
          setError(causa.message)
        }
      })
      .finally(() => {
        if (activo) {
          setLoading(false)
        }
      })

    return () => {
      activo = false
    }
  }, [cargar, version])

  const recargar = useCallback(() => setVersion(actual => actual + 1), [])

  return { data, loading, error, recargar }
}
