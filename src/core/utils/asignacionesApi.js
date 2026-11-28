import { solicitarApi } from './clienteApi.js'

const armarQuery = parametros => {
  const busqueda = new URLSearchParams()
  Object.entries(parametros).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== '') {
      busqueda.set(clave, String(valor))
    }
  })
  const texto = busqueda.toString()
  return texto ? `?${texto}` : ''
}

export const obtenerTrabajosRecibidos = (filtros = {}) =>
  solicitarApi(`/trabajos${armarQuery({ vista: 'recibidos', ...filtros })}`)

export const obtenerCandidatosAsignacion = ({ codigos = [], busqueda = '' } = {}) =>
  solicitarApi(
    `/asignaciones_revision/usuarios${armarQuery({
      codigos: codigos.join(','),
      busqueda,
    })}`
  )

export const asignarRevisoresTrabajo = (trabajoId, datos) =>
  solicitarApi(`/trabajos/${encodeURIComponent(trabajoId)}/asignaciones_revision`, {
    method: 'POST',
    body: datos,
  })

export const asignarRevisoresLote = datos =>
  solicitarApi('/asignaciones_revision', { method: 'POST', body: datos })

export const obtenerRevisores = (filtros = {}) =>
  solicitarApi(`/usuarios${armarQuery(filtros)}`)

export const obtenerSeguimientoRevisiones = (filtros = {}) =>
  solicitarApi(`/asignaciones_revision${armarQuery(filtros)}`)

export const reasignarRevision = (asignacionId, datos) =>
  solicitarApi(`/asignaciones_revision/${asignacionId}`, {
    method: 'PUT',
    body: datos,
  })

export const retirarRevision = (asignacionId, motivo) =>
  solicitarApi(`/asignaciones_revision/${asignacionId}`, {
    method: 'DELETE',
    body: { motivo },
  })

export const enviarRecordatorioRevision = asignacionId =>
  solicitarApi(`/asignaciones_revision/${asignacionId}/recordatorios_revision`, {
    method: 'POST',
  })

export const enviarRecordatoriosPendientes = (datos = {}) =>
  solicitarApi('/recordatorios_revision', { method: 'POST', body: datos })
