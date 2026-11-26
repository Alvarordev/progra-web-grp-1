import { redirect } from 'react-router'
import { obtenerCuentaActiva } from '../core/utils/accounts.js'
import { hasRoleAccess } from '../core/utils/access.js'
import {
  consultarAsignaciones,
  consultarAccesoTrabajo,
} from '../core/utils/usuariosApi.js'

export const crearCargadorAcceso =
  (roles, mensaje, requiereAsignacion = false) =>
  async ({ params }) => {
    const participant = await obtenerCuentaActiva()
    if (!participant) {
      return redirect('/iniciar-sesion')
    }
    let message = mensaje
    let allowed = hasRoleAccess(participant, roles)
    if (allowed && requiereAsignacion) {
      const asignaciones = await consultarAsignaciones()
      allowed = asignaciones.some(asignacion => asignacion.codigo === params.codigo)
      if (!allowed) {
        message =
          'Solo puede evaluar los trabajos que le han sido asignados como revisor.'
      }
    } else if (
      allowed &&
      params.codigo &&
      ['author', 'both'].includes(participant.role)
    ) {
      try {
        await consultarAccesoTrabajo(params.codigo)
      } catch (err) {
        if (err.status !== 403) {
          throw err
        }
        allowed = false
        message = 'Solo puede consultar sus propios trabajos.'
      }
    }
    return { participant, allowed, message }
  }

export { crearCargadorAcceso as createAccessLoader }
