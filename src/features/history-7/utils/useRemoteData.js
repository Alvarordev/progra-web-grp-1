import { useEffect, useState } from 'react'

/* Carga una vez los datos de un endpoint. `cargar` debe ser una función estable
   (por ejemplo, una función importada de core/utils/*Api.js). */
export default function useRemoteData(cargar) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    cargar()
      .then(resultado => {
        if (activo) {
          setData(resultado)
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
  }, [cargar])

  return { data, loading, error }
}
