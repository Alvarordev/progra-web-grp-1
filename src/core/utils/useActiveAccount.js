import { useCacheRemota } from './cacheRemota.js'
import { sesionActual } from './usuariosApi.js'

export default function useActiveAccount() {
  const { valor, cargando, error } = useCacheRemota(sesionActual)
  return { participant: valor ?? null, loading: cargando, error }
}
