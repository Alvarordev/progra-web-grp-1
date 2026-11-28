import { useCallback, useEffect, useRef, useState } from 'react'
import { obtenerMisTrabajos } from '../../../core/utils/trabajosApi.js'

export default function useMisTrabajos() {
  const [trabajos, setTrabajos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const montado = useRef(true)

  const recargar = useCallback(async () => {
    const actuales = await obtenerMisTrabajos()
    if (montado.current) {
      setTrabajos(actuales)
    }
  }, [])

  useEffect(() => {
    montado.current = true
    obtenerMisTrabajos()
      .then(actuales => montado.current && setTrabajos(actuales))
      .catch(causa => montado.current && setError(causa.message))
      .finally(() => montado.current && setCargando(false))
    return () => {
      montado.current = false
    }
  }, [])

  return { trabajos, cargando, error, recargar }
}
