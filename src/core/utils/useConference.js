import { useCacheRemota } from './cacheRemota.js'
import {
  criteriaRepository,
  thematicAxesRepository,
  useEdicionActual,
  workTypesRepository,
} from './editionRepositories.js'
import useActiveAccount from './useActiveAccount.js'

const catalogos = {
  axes: thematicAxesRepository,
  types: workTypesRepository,
  criteria: criteriaRepository,
}

function useCatalogo(nombre, solicitados) {
  return useCacheRemota(catalogos[nombre].cache, solicitados.includes(nombre))
}

export default function useConference(...solicitados) {
  const edicion = useEdicionActual()
  const cuenta = useActiveAccount()
  const axes = useCatalogo('axes', solicitados)
  const types = useCatalogo('types', solicitados)
  const criteria = useCatalogo('criteria', solicitados)
  const loading =
    edicion.loading ||
    cuenta.loading ||
    [axes, types, criteria].some(item => item.cargando)
  const error = [
    edicion.error,
    cuenta.error,
    axes.error,
    types.error,
    criteria.error,
  ].find(Boolean)

  return {
    edition: edicion.edition ?? {},
    status: edicion.status,
    schedule: edicion.schedule,
    account: cuenta.participant,
    axes: axes.valor ?? [],
    types: types.valor ?? [],
    criteria: criteria.valor ?? [],
    loading,
    error: error ?? '',
    busy: loading || Boolean(error),
  }
}
