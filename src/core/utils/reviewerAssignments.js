import { findReviewer, getReview } from './assignments.js'

// Asignaciones de demostración compartidas por la bandeja y Mi actividad.
export const initialAssignments = [
  {
    codigo: 'TRB-2026-042',
    titulo: 'Predicción de deserción universitaria mediante aprendizaje supervisado',
    eje: 'Inteligencia artificial y datos',
    tipoTrabajo: 'Artículo completo',
    estado: 'Revisión pendiente',
    tipoEstado: 'pendiente',
    fecha: 'Vence el 15/10/2026 · faltan 3 días',
    accion: 'Evaluar',
  },
  {
    codigo: 'TRB-2026-053',
    titulo: 'Bienestar emocional y rendimiento académico en primeros ciclos',
    eje: 'Salud y sociedad',
    tipoTrabajo: 'Póster',
    estado: 'Vencida',
    tipoEstado: 'vencida',
    fecha: 'Venció el 09/10/2026 · hace 3 días',
    accion: 'Evaluar ahora',
  },
  {
    codigo: 'TRB-2026-031',
    titulo: 'Refactorización guiada por métricas de deuda técnica',
    eje: 'Ingeniería de software',
    tipoTrabajo: 'Artículo completo',
    estado: 'Entregada',
    tipoEstado: 'entregada',
    fecha: 'Enviada el 06/10/2026 · aceptar con observaciones',
  },
  {
    codigo: 'TRB-2026-051',
    titulo: 'Evaluación del uso de agua reciclada en riego de áreas verdes del campus',
    eje: 'Sostenibilidad y ciudad',
    tipoTrabajo: 'Resumen extendido',
    estado: 'Entregada',
    tipoEstado: 'entregada',
    fecha: 'Enviada el 04/10/2026 · aceptar',
  },
  {
    codigo: 'TRB-2026-035',
    titulo: 'Pruebas automatizadas en proyectos universitarios de software',
    eje: 'Ingeniería de software',
    tipoTrabajo: 'Resumen extendido',
    estado: 'Entregada',
    tipoEstado: 'entregada',
    fecha: 'Enviada el 02/10/2026 · aceptar',
  },
  {
    codigo: 'TRB-2026-045',
    titulo: 'Detección de fraude en pagos móviles con modelos de árboles',
    eje: 'Economía y mercados',
    tipoTrabajo: 'Artículo completo',
    estado: 'Entregada',
    tipoEstado: 'entregada',
    fecha: 'Enviada el 30/09/2026 · rechazar',
  },
]

const recommendationLabels = {
  aceptar: 'aceptar',
  observaciones: 'aceptar con observaciones',
  rechazar: 'rechazar',
}

export function getReviewerAssignments(reviews, reviewerId, works = [], reviewers = []) {
  const reviewer = findReviewer(reviewers, reviewerId)
  if (!reviewer) {
    return []
  }
  return works
    .filter(work => work.revisoresAsignados?.includes(reviewer.id))
    .map(work => {
      const review = getReview(reviews, reviewer, work.codigo)
      const submitted = review?.status === 'submitted'
      const deadline =
        work.reviewDeadline ??
        (work.fechaLimite?.includes('/')
          ? work.fechaLimite.split('/').reverse().join('-')
          : work.fechaLimite) ??
        '2026-10-20'
      const overdue =
        !submitted && new Date(`${deadline}T23:59:59`).getTime() < Date.now()
      let estado = 'Revisión pendiente'
      let tipoEstado = 'pendiente'
      let accion = 'Evaluar'
      let fecha = `Vence el ${deadline.split('-').reverse().join('/')}`
      if (submitted) {
        const sentDate = new Date(review.updatedAt).toLocaleDateString('es-PE')
        estado = 'Entregada'
        tipoEstado = 'entregada'
        accion = undefined
        fecha = `Enviada el ${sentDate} · ${recommendationLabels[review.recommendation]}`
      } else if (overdue) {
        estado = 'Vencida'
        tipoEstado = 'vencida'
        accion = 'Evaluar ahora'
      }
      return {
        codigo: work.codigo,
        titulo: work.titulo,
        eje: work.eje,
        tipoTrabajo: work.tipo,
        estado,
        tipoEstado,
        fecha,
        accion,
      }
    })
}

export function getReviewActivity(assignments) {
  const completed = assignments.filter(item => item.tipoEstado === 'entregada').length
  return {
    assigned: assignments.length,
    completed,
    pending: assignments.length - completed,
    overdue: assignments.filter(item => item.tipoEstado === 'vencida').length,
  }
}
