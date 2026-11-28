import { useEffect, useSyncExternalStore } from 'react'

export function crearCacheRemota(cargar, vigenciaMs = Infinity) {
  let estado = { valor: undefined, cargado: false, error: '' }
  let cargadoEn = 0
  let generacion = 0
  let pendiente
  const oyentes = new Set()

  function publicar(siguiente) {
    estado = siguiente
    oyentes.forEach(oyente => oyente())
  }

  const cache = {
    estado: () => estado,
    suscribir(oyente) {
      oyentes.add(oyente)
      return () => oyentes.delete(oyente)
    },
    fijar(valor) {
      generacion += 1
      cargadoEn = Date.now()
      publicar({ valor, cargado: true, error: '' })
      return valor
    },
    invalidar() {
      generacion += 1
      cargadoEn = 0
      pendiente = undefined
    },
    leer() {
      if (cargadoEn && Date.now() - cargadoEn < vigenciaMs) {
        return Promise.resolve(estado.valor)
      }
      if (!pendiente) {
        const propia = generacion
        const solicitud = cargar()
          .then(valor => (propia === generacion ? cache.fijar(valor) : cache.leer()))
          .catch(causa => {
            if (propia === generacion) {
              publicar({ ...estado, error: causa.message })
            }
            throw causa
          })
          .finally(() => {
            if (pendiente === solicitud) {
              pendiente = undefined
            }
          })
        pendiente = solicitud
      }
      return pendiente
    },
  }
  return cache
}

export function useCacheRemota(cache, activo = true) {
  const estado = useSyncExternalStore(cache.suscribir, cache.estado)
  useEffect(() => {
    if (activo) {
      cache.leer().catch(() => {})
    }
  }, [cache, activo])
  return {
    valor: estado.valor,
    cargando: activo && !estado.cargado && !estado.error,
    error: estado.error,
  }
}
