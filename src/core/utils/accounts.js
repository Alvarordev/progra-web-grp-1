import {
  consultarSesion,
  iniciarSesion,
  cerrarSesion,
  registrarUsuario,
} from './usuariosApi.js'
import { sessionPreferencesRepository } from './repositories.js'

export const obtenerInicioCuenta = rol => {
  if (rol === 'committee') {
    return '/configuracion'
  }
  return rol === 'reviewer' ? '/mi-cuenta' : '/autor'
}

export const obtenerCuentaActiva = () => consultarSesion()

export const iniciarSesionCuenta = async (correo, contrasena, recordar = false) => {
  const cuenta = await iniciarSesion(correo, contrasena, recordar)
  if (cuenta) {
    await sessionPreferencesRepository.save({ remember: recordar })
  }
  return cuenta
}

export const registrarParticipante = datos => registrarUsuario(datos)
export const cerrarSesionCuenta = () => cerrarSesion()

export {
  obtenerInicioCuenta as getAccountHome,
  obtenerCuentaActiva as getActiveAccount,
  cerrarSesionCuenta as endAccountSession,
}
