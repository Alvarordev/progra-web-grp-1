import { useCallback, useEffect, useRef, useState } from 'react'
import { obtenerMisTrabajos } from '../../../core/utils/trabajosApi.js'

// Carga los trabajos del autor desde GET /api/trabajos/mios
export default function useMisTrabajos() {
  const [trabajos, setTrabajos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const montado = useRef(true)

  // Se usa luego de guardar, para ver los datos que quedaron en el backend.
  // Es una promesa para poder esperarla antes de navegar a otra pantalla.
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
