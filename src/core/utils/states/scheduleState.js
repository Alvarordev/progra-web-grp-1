export const initialSchedule = {
  reception: '2026-12-15T23:59',
  review: '2026-12-20T18:00',
  publication: '2026-12-28T12:00',
}

export function getScheduleErrors(value) {
  const errors = {}
  for (const field of Object.keys(initialSchedule)) {
    const parsed = new Date(value[field])
    const parts =
      typeof value[field] === 'string' ? value[field].split(/[-T:]/).map(Number) : []
    if (
      typeof value[field] !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value[field]) ||
      !Number.isFinite(parsed.getTime()) ||
      parsed.getFullYear() !== parts[0] ||
      parsed.getMonth() + 1 !== parts[1] ||
      parsed.getDate() !== parts[2] ||
      parsed.getHours() !== parts[3] ||
      parsed.getMinutes() !== parts[4]
    ) {
      errors[field] = 'Seleccione una fecha y hora válidas.'
    }
  }
  if (!errors.reception && !errors.review && value.review <= value.reception) {
    errors.review = 'Debe ser posterior al cierre de la recepción.'
  }
  if (
    Number.isFinite(Date.parse(value.review)) &&
    !errors.publication &&
    value.publication <= value.review
  ) {
    errors.publication = 'Debe ser posterior al cierre de la revisión.'
  }
  return errors
}

export function validateSchedule(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    Object.keys(getScheduleErrors(value)).length === 0
  )
}

export function formatScheduleDate(value) {
  const [year, month, day] = value.slice(0, 10).split('-')
  return `${day}/${month}/${year}`
}
