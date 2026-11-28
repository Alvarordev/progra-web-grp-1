import { useCallback, useEffect, useState } from 'react'
import { obtenerRevisiones } from '../../../core/utils/revisionesApi.js'
import { aDecisionLocal, obtenerTrabajos } from '../../../core/utils/decisionesApi.js'
import { buildConsolidation } from './consolidation.js'
import { aDatosConsolidado } from './adaptadores.js'

const estadoInicial = { cargando: true, error: '', trabajo: null, consolidado: null }

export default function useConsolidado(codigo) {
  const [estado, setEstado] = useState(estadoInicial)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let activo = true
    Promise.all([obtenerRevisiones(), obtenerTrabajos()])
      .then(([revisiones, trabajos]) => {
        if (!activo) {
          return
        }
        const trabajo = trabajos.find(item => item.codigo === codigo) ?? null
        const datos = aDatosConsolidado(revisiones, codigo)
        setEstado({
          cargando: false,
          error: '',
          trabajo: trabajo && { ...trabajo, decision: aDecisionLocal(trabajo.decision) },
          consolidado: datos.revisores.length
            ? buildConsolidation({ codigo, ...datos })
            : null,
        })
      })
      .catch(causa => {
        if (activo) {
          setEstado({ ...estadoInicial, cargando: false, error: causa.message })
        }
      })
    return () => {
      activo = false
    }
  }, [codigo, version])

  const recargar = useCallback(() => setVersion(actual => actual + 1), [])

  return { ...estado, recargar }
}
