import { formatScheduleDate } from './states/scheduleState.js'

export function receptionIsOpen(status, schedule, now = Date.now()) {
  // El cronograma se registra en horario de Lima (UTC−5).
  const deadline = schedule.reception ? Date.parse(`${schedule.reception}:00-05:00`) : NaN
  return status === 'Recepción abierta' && Number.isFinite(deadline) && now <= deadline
}

export function getEditionStatusLabel(status, schedule) {
  return status === 'Recepción abierta' && !receptionIsOpen(status, schedule)
    ? 'Recepción cerrada'
    : status
}

export function getReceptionNotice(status, schedule) {
  if (status === 'En preparación') return 'La recepción todavía no se ha abierto.'
  if (status === 'En revisión') return 'La edición está en revisión. Consulte el dictamen y las fechas vigentes en las bases.'
  if (!schedule.reception) return 'Consulte el cronograma vigente en las bases del congreso.'
  const deadline = `${formatScheduleDate(schedule.reception)} a las ${schedule.reception.slice(11)} (Lima)`
  return receptionIsOpen(status, schedule)
    ? `Cierra el ${deadline}.`
    : `El plazo de recepción venció el ${deadline}.`
}
