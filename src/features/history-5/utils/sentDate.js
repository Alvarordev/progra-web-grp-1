// fecha y hora de envío en formato peruano, y el aviso que muestra la evaluación.
export function formatSentAt(sentAt) {
  const fecha = sentAt.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const hora = sentAt.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false })
  return { fecha, hora }
}

export function sentNotice(sentAt) {
  const cierre = 'Ya no admite cambios; si necesita corregirla, solicite al comité.'
  if (!sentAt) return `Evaluación enviada. ${cierre}`
  const { fecha, hora } = formatSentAt(sentAt)
  return `Evaluación enviada el ${fecha} a las ${hora}. ${cierre}`
}
