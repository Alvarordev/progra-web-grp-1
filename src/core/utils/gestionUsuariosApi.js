import { solicitarApi } from './clienteApi.js'

const rutaUsuario = id => `/gestion_usuarios/${encodeURIComponent(id)}`

export const listarUsuarios = (filtros = {}) => {
  const consulta = new URLSearchParams(
    Object.entries(filtros).filter(([, valor]) => valor)
  ).toString()
  return solicitarApi(`/gestion_usuarios${consulta ? `?${consulta}` : ''}`)
}

export const invitarUsuario = datos =>
  solicitarApi('/gestion_usuarios', { method: 'POST', body: datos })

export const actualizarUsuario = (id, datos) =>
  solicitarApi(rutaUsuario(id), { method: 'PUT', body: datos })

export const bloquearUsuario = (id, motivo, notificar) =>
  solicitarApi(`${rutaUsuario(id)}/bloqueo`, {
    method: 'PUT',
    body: { motivo, notificar },
  })

export const reactivarUsuario = id =>
  solicitarApi(`${rutaUsuario(id)}/bloqueo`, { method: 'DELETE' })
