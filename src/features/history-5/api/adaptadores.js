import { getRecommendationLabel } from '../utils/recommendations.js'

function fechaCorta(fechaIso) {
  return fechaIso ? fechaIso.slice(0, 10).split('-').reverse().join('/') : '—'
}

function estaVencida(fechaLimite) {
  return (
    Boolean(fechaLimite) && new Date(`${fechaLimite}T23:59:59`).getTime() < Date.now()
  )
}

export function aRevisionLocal(revision) {
  return {
    status: revision.estado === 'enviada' ? 'submitted' : 'draft',
    recommendation: revision.recomendacion ?? '',
    authorComment: revision.comentarioAutor ?? '',
    committeeComment: revision.comentarioComite ?? '',
    updatedAt: revision.actualizadaEn ?? null,
    criteria: revision.criterios.map(nota => ({
      id: String(nota.criterioId),
      nombre: nota.criterio.nombre,
      peso: nota.criterio.peso,
      puntaje: nota.puntaje === null ? '' : String(nota.puntaje),
      comentario: nota.comentario ?? '',
    })),
  }
}

export function aAsignacion(revision) {
  const enviada = revision.estado === 'enviada'
  const vencida = !enviada && estaVencida(revision.fechaLimite)
  const etiqueta = getRecommendationLabel(revision.recomendacion).toLowerCase()
  let estado = 'Revisión pendiente'
  let tipoEstado = 'pendiente'
  let accion = 'Evaluar'
  let fecha = `Vence el ${fechaCorta(revision.fechaLimite)}`
  if (enviada) {
    estado = 'Entregada'
    tipoEstado = 'entregada'
    accion = undefined
    fecha = revision.actualizadaEn
      ? `Enviada el ${fechaCorta(revision.actualizadaEn)} · ${etiqueta}`
      : `Enviada · ${etiqueta}`
  } else if (vencida) {
    estado = 'Vencida'
    tipoEstado = 'vencida'
    accion = 'Evaluar ahora'
  }
  return {
    revisionId: revision.id,
    codigo: revision.trabajo.codigo,
    titulo: revision.trabajo.titulo,
    eje: revision.trabajo.eje,
    tipoTrabajo: revision.trabajo.tipo,
    fechaLimite: fechaCorta(revision.fechaLimite),
    estado,
    tipoEstado,
    fecha,
    accion,
  }
}

export function aCuerpoRevision(evaluacion, estado) {
  return {
    estado: estado === 'submitted' ? 'enviada' : 'borrador',
    recomendacion: evaluacion.recommendation,
    comentarioAutor: evaluacion.authorComment,
    comentarioComite: evaluacion.committeeComment,
    criterios: evaluacion.criteria.map(criterio => ({
      criterioId: Number(criterio.id),
      puntaje: criterio.puntaje === '' ? null : Number(criterio.puntaje),
      comentario: criterio.comentario,
    })),
  }
}

export function aDatosConsolidado(revisiones, codigo) {
  const delTrabajo = revisiones.filter(revision => revision.trabajo.codigo === codigo)
  const criterios = new Map()
  delTrabajo.forEach(revision =>
    revision.criterios.forEach(nota =>
      criterios.set(String(nota.criterioId), {
        id: String(nota.criterioId),
        nombre: nota.criterio.nombre,
        peso: nota.criterio.peso,
      })
    )
  )
  return {
    trabajo: delTrabajo[0]?.trabajo ?? null,
    revisores: delTrabajo.map(revision => ({
      id: revision.revisor.id,
      nombre: revision.revisor.nombre,
    })),
    reviews: Object.fromEntries(
      delTrabajo.map(revision => [
        `${revision.revisor.id}:${codigo}`,
        aRevisionLocal(revision),
      ])
    ),
    criteria: [...criterios.values()],
  }
}

export function aDecisionLocal(decision) {
  if (!decision) {
    return null
  }
  return {
    resultado: decision.resultado,
    retroalimentacion: decision.retroalimentacion,
    status: decision.estado === 'publicada' ? 'published' : 'draft',
  }
}

export function aCuerpoDecision(resultado, retroalimentacion, publicar) {
  return {
    resultado,
    retroalimentacion,
    estado: publicar ? 'publicada' : 'borrador',
  }
}
