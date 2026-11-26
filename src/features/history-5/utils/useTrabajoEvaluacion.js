import { useEffect, useState } from 'react'
import { aTrabajoEvaluacion } from './adaptadores.js'
import { obtenerRevisiones } from '../../../core/utils/revisionesApi.js'

const trabajoPendiente = { title: 'Trabajo asignado' }

export default function useTrabajoEvaluacion(codigo) {
  const [trabajo, setTrabajo] = useState(trabajoPendiente)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true
    obtenerRevisiones()
      .then(revisiones => {
        const revision = revisiones.find(item => item.trabajo.codigo === codigo)
        if (activo) {
          setTrabajo(revision ? aTrabajoEvaluacion(revision) : trabajoPendiente)
          setError('')
        }
      })
      .catch(causa => {
        if (activo) {
          setError(causa.message)
        }
      })
    return () => {
      activo = false
    }
  }, [codigo])

  return { trabajo, error }
}
