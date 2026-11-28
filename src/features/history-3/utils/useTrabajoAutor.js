import { useCallback, useEffect, useState } from 'react'
import { obtenerMisTrabajos, obtenerTrabajo } from '../../../core/utils/trabajosApi.js'

// Carga el detalle de un trabajo del autor a partir del código de la URL:
// 1) busca el id en GET /api/trabajos/mios
// 2) pide el detalle a GET /api/trabajos/:id
export default function useTrabajoAutor(codigo) {
  const [estado, setEstado] = useState({ trabajo: null, cargando: true, error: '' })
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let activo = true

    async function cargar() {
      setEstado(actual => ({ ...actual, cargando: true, error: '' }))
      try {
        const encontrado = (await obtenerMisTrabajos()).find(
          item => item.codigo === codigo
        )
        const detalle = encontrado ? await obtenerTrabajo(encontrado.id) : null
        if (activo) {
          setEstado({ trabajo: detalle, cargando: false, error: '' })
        }
      } catch (causa) {
        if (activo) {
          setEstado({ trabajo: null, cargando: false, error: causa.message })
        }
      }
    }
    cargar()
    return () => {
      activo = false
    }
  }, [codigo, version])

  const recargar = useCallback(() => setVersion(actual => actual + 1), [])

  return { ...estado, recargar }
}
