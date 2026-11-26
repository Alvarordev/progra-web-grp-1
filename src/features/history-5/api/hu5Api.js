import { requestConference } from '../../../core/utils/conferenceApi.js'

export function obtenerRevisiones() {
  return requestConference('/revisiones')
}

export function obtenerTrabajos() {
  return requestConference('/trabajos')
}

export function guardarRevision(id, datos) {
  return requestConference(`/revisiones/${id}`, { method: 'PUT', body: datos })
}

export function guardarDecision(trabajoId, datos) {
  return requestConference(`/decisiones/${trabajoId}`, { method: 'PUT', body: datos })
}
