import { getReviewKey } from './states/reviewsState.js'
import { demoReviewerId } from './states/reviewerProfilesState.js'

// Asignaciones de demostración compartidas por la bandeja y Mi actividad.
export const initialAssignments = [
  { codigo: 'TRB-2026-042', titulo: 'Predicción de deserción universitaria mediante aprendizaje supervisado', eje: 'Inteligencia artificial y datos', tipoTrabajo: 'Artículo completo', estado: 'Revisión pendiente', tipoEstado: 'pendiente', fecha: 'Vence el 15/10/2026 · faltan 3 días', accion: 'Evaluar' },
  { codigo: 'TRB-2026-053', titulo: 'Bienestar emocional y rendimiento académico en primeros ciclos', eje: 'Salud y sociedad', tipoTrabajo: 'Póster', estado: 'Vencida', tipoEstado: 'vencida', fecha: 'Venció el 09/10/2026 · hace 3 días', accion: 'Evaluar ahora' },
  { codigo: 'TRB-2026-031', titulo: 'Refactorización guiada por métricas de deuda técnica', eje: 'Ingeniería de software', tipoTrabajo: 'Artículo completo', estado: 'Entregada', tipoEstado: 'entregada', fecha: 'Enviada el 06/10/2026 · aceptar con observaciones' },
  { codigo: 'TRB-2026-051', titulo: 'Evaluación del uso de agua reciclada en riego de áreas verdes del campus', eje: 'Sostenibilidad y ciudad', tipoTrabajo: 'Resumen extendido', estado: 'Entregada', tipoEstado: 'entregada', fecha: 'Enviada el 04/10/2026 · aceptar' },
  { codigo: 'TRB-2026-035', titulo: 'Pruebas automatizadas en proyectos universitarios de software', eje: 'Ingeniería de software', tipoTrabajo: 'Resumen extendido', estado: 'Entregada', tipoEstado: 'entregada', fecha: 'Enviada el 02/10/2026 · aceptar' },
  { codigo: 'TRB-2026-045', titulo: 'Detección de fraude en pagos móviles con modelos de árboles', eje: 'Economía y mercados', tipoTrabajo: 'Artículo completo', estado: 'Entregada', tipoEstado: 'entregada', fecha: 'Enviada el 30/09/2026 · rechazar' },
]

const recommendationLabels = {
  aceptar: 'aceptar', observaciones: 'aceptar con observaciones', rechazar: 'rechazar',
}

export function getReviewerAssignments(reviews, reviewerId) {
  // El PDF asigna estos seis trabajos a Luis; un revisor nuevo aún no tiene asignaciones.
  if (![demoReviewerId, 'participant:luis.ramirez@ulima.edu.pe'].includes(reviewerId)) return []
  return initialAssignments.map(item => {
    const review = reviews[getReviewKey(reviewerId, item.codigo)]
    return review?.status === 'submitted'
      ? { ...item, estado: 'Entregada', tipoEstado: 'entregada', accion: undefined, fecha: `Enviada el ${new Date(review.updatedAt).toLocaleDateString('es-PE')} · ${recommendationLabels[review.recommendation]}` }
      : item
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
