export const WORK_MINUTES = 20

export function toMinutes(hora) {
  const [horas, minutos] = hora.split(':').map(Number)

  return horas * 60 + minutos
}

export function toTime(minutos) {
  const horas = String(Math.floor(minutos / 60)).padStart(2, '0')
  const resto = String(minutos % 60).padStart(2, '0')

  return `${horas}:${resto}`
}

export function formatDate(fecha) {
  const [anio, mes, dia] = fecha.split('-')

  return `${dia}/${mes}/${anio}`
}

export function formatWeekday(fecha) {
  const dia = new Date(`${fecha}T00:00:00`).toLocaleDateString('es-PE', {
    weekday: 'long',
  })

  return dia.charAt(0).toUpperCase() + dia.slice(1)
}

export function sessionsOverlap(primera, segunda) {
  return (
    primera.fecha === segunda.fecha &&
    primera.sala === segunda.sala &&
    toMinutes(primera.horaInicio) < toMinutes(segunda.horaFin) &&
    toMinutes(segunda.horaInicio) < toMinutes(primera.horaFin)
  )
}

export function findOverlaps(sesiones) {
  const conflictos = []

  sesiones.forEach((sesion, indice) => {
    sesiones.slice(indice + 1).forEach(otra => {
      if (sessionsOverlap(sesion, otra)) {
        conflictos.push([sesion, otra])
      }
    })
  })

  return conflictos
}

export function getOverlapRange(primera, segunda) {
  const inicio = Math.max(toMinutes(primera.horaInicio), toMinutes(segunda.horaInicio))
  const fin = Math.min(toMinutes(primera.horaFin), toMinutes(segunda.horaFin))

  return { horaInicio: toTime(inicio), horaFin: toTime(fin) }
}

export function getSessionCapacity(sesion) {
  const duracion = toMinutes(sesion.horaFin) - toMinutes(sesion.horaInicio)

  return Math.floor(duracion / WORK_MINUTES)
}

export function getSessionWorks(trabajos, sesionId) {
  return trabajos
    .filter(trabajo => trabajo.sesionId === sesionId)
    .sort((primero, segundo) => primero.orden - segundo.orden)
}

export function getWorkTimes(sesion, indice) {
  const inicio = toMinutes(sesion.horaInicio) + indice * WORK_MINUTES

  return { horaInicio: toTime(inicio), horaFin: toTime(inicio + WORK_MINUTES) }
}
