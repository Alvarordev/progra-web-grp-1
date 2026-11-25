import { solicitarApi } from './clienteApi.js'

export const registrarUsuario = datos =>
  solicitarApi('/usuarios', { method: 'POST', body: datos })

export const iniciarSesion = async (correo, contrasena, recordar = false) => {
  try {
    return await solicitarApi('/usuarios/sesiones', {
      method: 'POST',
      body: { correo, contrasena, recordar },
    })
  } catch (err) {
    if (err.status === 401) {
      return null
    }
    throw err
  }
}

export const consultarSesion = async () => {
  try {
    return await solicitarApi('/usuarios/sesiones')
  } catch (err) {
    if (err.status === 401) {
      return null
    }
    throw err
  }
}

export const cerrarSesion = () => solicitarApi('/usuarios/sesiones', { method: 'DELETE' })
export const consultarPerfil = () => solicitarApi('/usuarios/perfil')
export const guardarPerfil = datos =>
  solicitarApi('/usuarios/perfil', { method: 'PATCH', body: datos })
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
export const restablecerContrasena = (token, contrasena, confirmacion) =>
  solicitarApi('/usuarios/recuperaciones/contrasena', {
    method: 'POST',
    body: { token, contrasena, confirmacion },
  })
