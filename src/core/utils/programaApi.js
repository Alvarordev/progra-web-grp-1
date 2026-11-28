import { solicitarApi } from './clienteApi.js'
import { obtenerEdicionId } from './editionRepositories.js'

const conEdicion = async ruta => `${ruta}?edicionId=${await obtenerEdicionId()}`

export const obtenerProgramaPublico = async () =>
  solicitarApi(await conEdicion('/programa'))

export const obtenerGestionPrograma = async () =>
  solicitarApi(await conEdicion('/programa/gestion'))

export const obtenerMiPresentacion = async () =>
  solicitarApi(await conEdicion('/programa/mi_presentacion'))

export const crearSesion = async datos =>
  solicitarApi('/programa/sesiones', {
    method: 'POST',
    body: { ...datos, edicionId: await obtenerEdicionId() },
  })

export const actualizarSesion = (id, datos) =>
  solicitarApi(`/programa/sesiones/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: datos,
  })

export const eliminarSesion = id =>
  solicitarApi(`/programa/sesiones/${encodeURIComponent(id)}`, { method: 'DELETE' })

export const asignarTrabajosSesion = (id, codigos) =>
  solicitarApi(`/programa/sesiones/${encodeURIComponent(id)}/trabajos`, {
    method: 'PUT',
    body: { trabajos: codigos },
  })

export const publicarPrograma = async () =>
  solicitarApi('/programa/publicacion', {
    method: 'POST',
    body: { edicionId: await obtenerEdicionId() },
  })
