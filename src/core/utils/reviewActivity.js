export function getReviewActivity(assignments) {
  const completed = assignments.filter(item => item.tipoEstado === 'entregada').length
  return {
    assigned: assignments.length,
    completed,
    pending: assignments.length - completed,
    overdue: assignments.filter(item => item.tipoEstado === 'vencida').length,
  }
}
