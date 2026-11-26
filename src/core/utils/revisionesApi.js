import { solicitarApi } from './clienteApi.js'
import { consultarSesion } from './usuariosApi.js'

const suscriptores = new Set()

export const obtenerRevisiones = () => solicitarApi('/revisiones')

export const aRevisionLocal = fila => ({
  criteria: fila.criterios.map(nota => ({
    id: String(nota.criterioId ?? `nota-${nota.id}`),
    nombre: nota.criterio.nombre,
    peso: nota.criterio.peso,
    puntaje: nota.puntaje ?? '',
    comentario: nota.comentario,
  })),
  recommendation: fila.recomendacion,
  authorComment: fila.comentarioAutor,
  committeeComment: fila.comentarioComite,
  status: fila.estado === 'enviada' ? 'submitted' : 'draft',
  updatedAt: fila.actualizadaEn,
})

const leerRevisiones = async () => {
  const cuenta = await consultarSesion()
  if (!cuenta || !['reviewer', 'both', 'committee'].includes(cuenta.role)) {
    return { filas: [], datos: {} }
  }
  const filas = await obtenerRevisiones()
  const datos = {}
  for (const fila of filas) {
    datos[`${fila.revisorId}:${fila.trabajo.codigo}`] = aRevisionLocal(fila)
  }
  return { filas, datos }
}

const guardarRevisiones = async siguientes => {
  const { filas, datos } = await leerRevisiones()
  const cambios = Object.entries(siguientes).filter(
    ([clave, valor]) => JSON.stringify(valor) !== JSON.stringify(datos[clave])
  )
  if (cambios.length !== 1) {
    throw new Error('Guarde una evaluación a la vez.')
  }
  const [clave, revision] = cambios[0]
  const fila = filas.find(item => `${item.revisorId}:${item.trabajo.codigo}` === clave)
  if (!fila) {
    throw new Error('No se encontró una evaluación asignada en el backend.')
  }
  await solicitarApi(`/revisiones/${fila.id}`, {
    method: 'PUT',
    body: {
      estado: revision.status === 'submitted' ? 'enviada' : 'borrador',
      recomendacion: revision.recommendation,
      comentarioAutor: revision.authorComment,
      comentarioComite: revision.committeeComment,
      criterios: revision.criteria.map(criterio => ({
        criterioId: Number(criterio.id),
        puntaje: criterio.puntaje === '' ? null : Number(criterio.puntaje),
        comentario: criterio.comentario,
      })),
    },
  })
  suscriptores.forEach(suscriptor => suscriptor())
  return (await leerRevisiones()).datos
}

export const repositorioRevisiones = {
  get: async () => (await leerRevisiones()).datos,
  save: guardarRevisiones,
  subscribe(suscriptor) {
    suscriptores.add(suscriptor)
    return () => suscriptores.delete(suscriptor)
  },
}
