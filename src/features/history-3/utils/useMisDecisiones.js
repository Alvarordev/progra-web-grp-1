import {
  aDecisionAutor,
  obtenerMisDecisiones,
} from '../../../core/utils/decisionesApi.js'
import useRemoteData from '../../../core/utils/useRemoteData.js'

const cargar = async () =>
  Object.fromEntries(
    (await obtenerMisDecisiones()).map(decision => [
      decision.trabajo.codigo,
      aDecisionAutor(decision),
    ])
  )

/* Dictámenes publicados de los trabajos del autor, indexados por código de trabajo. */
export default function useMisDecisiones() {
  const { data, loading, error } = useRemoteData(cargar)

  return { decisiones: data ?? {}, cargando: loading, error }
}
