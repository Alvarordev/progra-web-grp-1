import { solicitarApi } from './clienteApi.js'

export const obtenerMisTrabajos = () => solicitarApi('/trabajos/mios')

export const obtenerTrabajo = trabajoId => solicitarApi(`/trabajos/${trabajoId}`)

export const crearTrabajo = datos =>
  solicitarApi('/trabajos', { method: 'POST', body: datos })

export const guardarVersionFinal = (trabajoId, enlace) =>
  solicitarApi(`/trabajos/${trabajoId}/version_final`, {
    method: 'PUT',
    body: { enlace },
  })

export const actualizarTrabajo = (trabajoId, datos) =>
  solicitarApi(`/trabajos/${trabajoId}`, { method: 'PUT', body: datos })
