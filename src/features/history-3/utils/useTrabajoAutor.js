import { useEffect, useState } from 'react'
import { obtenerMisTrabajos, obtenerTrabajo } from '../../../core/utils/trabajosApi.js'

// Carga el detalle de un trabajo del autor a partir del codigo de la URL
// 1) Busca el id en GET /api/trabajos/mios 
//  2) Pide el detalle a GET /api/trabajos/:id
export default function useTrabajoAutor(codigo) {
  const [trabajo, setTrabajo] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true
    async function cargar() {
      try {
        const encontrado = (await obtenerMisTrabajos()).find(
          item => item.codigo === codigo
        )
        const detalle = encontrado ? await obtenerTrabajo(encontrado.id) : null
        if (activo) {
          setTrabajo(detalle)
        }
      } catch (causa) {
        if (activo) {
          setError(causa.message)
        }
      } finally {
        if (activo) {
          setCargando(false)
        }
      }
    }
    cargar()
    return () => {
      activo = false
    }
  }, [codigo])

  return { trabajo, cargando, error }
}
