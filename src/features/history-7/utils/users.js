/* Helpers para el campo "Trabajos / Revisiones".
   En los datos se guarda como texto (p. ej. "4 trabajos", "5 revisiones · 2 vencidas");
   en los formularios se edita como un número. */

export function parseCount(actividad) {
  const match = /^\s*(\d+)/.exec(actividad ?? '')
  return match ? match[1] : ''
}

/* Conserva lo que haya después del número (p. ej. "· 2 vencidas") al editar. */
function getSuffix(actividad) {
  const index = (actividad ?? '').indexOf('·')
  return index === -1 ? '' : ` ${actividad.slice(index)}`
}

export function buildActivity(rol, cantidad, actividadAnterior = '') {
  if (rol === 'Comité') {
    return '—'
  }

  const total = Number(cantidad)
  let noun = total === 1 ? 'trabajo' : 'trabajos'
  if (rol !== 'Autor') {
    noun = total === 1 ? 'revisión' : 'revisiones'
  }

  return `${total} ${noun}${getSuffix(actividadAnterior)}`
}

/* El rol se muestra en femenino ("Autora", "Revisora") según este indicador. */
export function inferFeminine(nombre) {
  return /^\s*(dra|sra|srta|lic\.? a)\b/i.test(nombre)
}
