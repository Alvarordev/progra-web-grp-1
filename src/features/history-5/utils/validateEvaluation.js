import { isValidScore } from './scoring.js'

// mensajes que impiden enviar la evaluación; una lista vacía significa que se puede enviar.
export function validateEvaluation({ criteria, recommendation, authorComment }) {
  const errors = []
  const missing = criteria
    .filter((criterion) => criterion.puntaje === '' || !criterion.comentario.trim())
    .map((criterion) => criterion.nombre)
  if (criteria.some((item) => item.puntaje !== '' && !isValidScore(item.puntaje))) {
    errors.push('Los puntajes deben ser enteros entre 0 y 20.')
  }
  if (criteria.reduce((sum, item) => sum + item.peso, 0) !== 100) {
    errors.push('El comité debe configurar criterios cuyos pesos sumen 100 antes de enviar la evaluación.')
  }
  if (missing.length > 0) errors.push(`Completa el puntaje y comentario de: ${missing.join(', ')}.`)
  if (!recommendation) errors.push('Selecciona una recomendación.')
  if (!authorComment.trim()) errors.push('Escribe los comentarios dirigidos al autor.')
  return errors
}
