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

export function getSessionCapacity(sesion) {
  const duracion = toMinutes(sesion.horaFin) - toMinutes(sesion.horaInicio)

  return Math.floor(duracion / WORK_MINUTES)
}

export function getWorkTimes(sesion, indice) {
  const inicio = toMinutes(sesion.horaInicio) + indice * WORK_MINUTES

  return { horaInicio: toTime(inicio), horaFin: toTime(inicio + WORK_MINUTES) }
}

const longDate = new Intl.DateTimeFormat('es-PE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

/* «10 y 11 de marzo de 2027»; entre meses distintos, «10 de marzo de 2027 al 2 de abril de 2027». */
export function formatDateRange(fechas) {
  const dias = [...new Set(fechas)].sort()

  if (dias.length === 0) {
    return ''
  }

  const fecha = dia => new Date(`${dia}T00:00:00Z`)

  if (new Set(dias.map(dia => dia.slice(0, 7))).size > 1) {
    return `${longDate.format(fecha(dias[0]))} al ${longDate.format(fecha(dias.at(-1)))}`
  }

  const partes = longDate.formatToParts(fecha(dias[0]))
  const mes = partes.find(parte => parte.type === 'month').value
  const año = partes.find(parte => parte.type === 'year').value
  const numeros = dias.map(dia => String(Number(dia.slice(8))))
  const lista =
    numeros.length === 1
      ? numeros[0]
      : `${numeros.slice(0, -1).join(', ')} y ${numeros.at(-1)}`

  return `${lista} de ${mes} de ${año}`
}
