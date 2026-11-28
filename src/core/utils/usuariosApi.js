import { crearCacheRemota } from './cacheRemota.js'
import { solicitarApi } from './clienteApi.js'

export const registrarUsuario = datos =>
  solicitarApi('/usuarios', { method: 'POST', body: datos })

const nuloSiNoAutorizado = err => {
  if (err.status === 401) {
    return null
  }
  throw err
}

export const sesionActual = crearCacheRemota(
  () => solicitarApi('/usuarios/sesiones').catch(nuloSiNoAutorizado),
  60_000
)

export const iniciarSesion = async (correo, contrasena, recordar = false) => {
  const cuenta = await solicitarApi('/usuarios/sesiones', {
    method: 'POST',
    body: { correo, contrasena, recordar },
  }).catch(nuloSiNoAutorizado)
  if (cuenta) {
    sesionActual.fijar(cuenta)
  }
  return cuenta
}

export const consultarSesion = () => sesionActual.leer()

export const cerrarSesion = async () => {
  await solicitarApi('/usuarios/sesiones', { method: 'DELETE' })
  sesionActual.fijar(null)
}
export const consultarPerfil = () => solicitarApi('/usuarios/perfil')
export const guardarPerfil = async datos => {
  const perfil = await solicitarApi('/usuarios/perfil', { method: 'PATCH', body: datos })
  sesionActual.invalidar()
  return perfil
}
export const cambiarContrasena = (contrasenaActual, contrasena, confirmacion) =>
  solicitarApi('/usuarios/contrasena', {
    method: 'PUT',
    body: { contrasenaActual, contrasena, confirmacion },
  })
export const consultarAsignaciones = () => solicitarApi('/usuarios/asignaciones')
export const consultarAccesoTrabajo = codigo =>
  solicitarApi(`/usuarios/trabajos/${encodeURIComponent(codigo)}/acceso`)
export const solicitarRecuperacion = correo =>
  solicitarApi('/usuarios/recuperaciones', { method: 'POST', body: { correo } })
export const verificarCodigo = (correo, codigo) =>
  solicitarApi('/usuarios/recuperaciones/verificacion', {
    method: 'POST',
    body: { correo, codigo },
  })
export const restablecerContrasena = async (token, contrasena, confirmacion) => {
  await solicitarApi('/usuarios/recuperaciones/contrasena', {
    method: 'POST',
    body: { token, contrasena, confirmacion },
  })
  sesionActual.fijar(null)
}
