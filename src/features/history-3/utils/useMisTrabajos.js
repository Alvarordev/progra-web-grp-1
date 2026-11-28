import { useCallback, useEffect, useState } from 'react'
import { obtenerMisTrabajos } from '../../../core/utils/trabajosApi.js'

// Carga los trabajos del autor desde GET /api/trabajos/mios
export default function useMisTrabajos() {
  const [trabajos, setTrabajos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // Se usa luego de guardar, para ver los datos que quedaron en el backen
  const recargar = useCallback(async () => {
    setTrabajos(await obtenerMisTrabajos())
  }, [])

  useEffect(() => {
    obtenerMisTrabajos()
      .then(setTrabajos)
      .catch(causa => setError(causa.message))
      .finally(() => setCargando(false))
  }, [])

  return { trabajos, cargando, error, recargar }
}
