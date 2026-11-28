import { solicitarApi } from './clienteApi.js'

// Historia 3 --> Trabajos del autor en el backend (rutas de routes/trabajos.js)

// GET /api/trabajos/mios  --> lista los trabajos que registró el autor de la sesión
export const obtenerMisTrabajos = () => solicitarApi('/trabajos/mios')

// GET /api/trabajos/:trabajoId --> detalle de un trabajo propio, con el campo `editable`
export const obtenerTrabajo = trabajoId => solicitarApi(`/trabajos/${trabajoId}`)

// POST /api/trabajos --> crea un trabajo nuevo como borrador o enviado
export const crearTrabajo = datos =>
  solicitarApi('/trabajos', { method: 'POST', body: datos })

// PUT /api/trabajos/:trabajoId/version_final --> enlace de la versión final de un trabajo aceptado
export const guardarVersionFinal = (trabajoId, enlace) =>
  solicitarApi(`/trabajos/${trabajoId}/version_final`, {
    method: 'PUT',
    body: { enlace },
  })

// PUT /api/trabajos/:trabajoId --> edita un borrador (datos, coautores) o lo envía al comité
export const actualizarTrabajo = (trabajoId, datos) =>
  solicitarApi(`/trabajos/${trabajoId}`, { method: 'PUT', body: datos })
