// texto sugerido: la decisión y, numeradas, las observaciones de cada revisor.
export function buildFeedbackText(decision, enviados) {
  const frases = []
  if (decision === 'aceptar') frases.push('El comité acepta el trabajo para presentación oral.')
  if (decision === 'rechazar') frases.push('El comité no acepta el trabajo en esta edición.')
  if (enviados.length) {
    const inicio = decision === 'rechazar'
      ? 'Las observaciones de los revisores son:'
      : 'Antes de la versión final, atienda las siguientes observaciones:'
    const observaciones = enviados.map(
      (fila, indice) => `${indice + 1}. ${fila.comentarioAutor.trim().replace(/\.$/, '')}.`,
    )
    frases.push([inicio, ...observaciones].join('\n'))
  }
  return frases.join(' ')
}

// nota bajo el texto: dice de dónde sale y qué hacer. publicada no pide nada.
export function feedbackNote({ publicada, feedback, enviados, cantidadTexto }) {
  if (publicada) return ''
  if (feedback.trim()) return `Precargado con los comentarios al autor de ${cantidadTexto}. Puede editarlo antes de publicar.`
  if (enviados.length) return `Pulse «Restaurar texto de los revisores» para cargar los comentarios de ${cantidadTexto}.`
  return 'Pendiente: los revisores todavía no envían sus comentarios.'
}
