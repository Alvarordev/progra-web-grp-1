import { assignmentsByWork } from './reviewExamplesState.js'
export function getReviewKey(reviewerId, code) {
  return `${reviewerId}:${code}`
}

export function validateReviews(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.values(value).every(review => {
      if (
        !review ||
        !['draft', 'submitted'].includes(review.status) ||
        !['', 'aceptar', 'observaciones', 'rechazar'].includes(review.recommendation) ||
        typeof review.authorComment !== 'string' ||
        typeof review.committeeComment !== 'string' ||
        typeof review.updatedAt !== 'string' ||
        !Number.isFinite(Date.parse(review.updatedAt)) ||
        !Array.isArray(review.criteria)
      ) {
        return false
      }

      const validCriteria = review.criteria.every(
        item =>
          item &&
          typeof item.id === 'string' &&
          typeof item.nombre === 'string' &&
          Number.isFinite(item.peso) &&
          item.peso > 0 &&
          typeof item.comentario === 'string' &&
          (item.puntaje === '' ||
            (Number.isInteger(Number(item.puntaje)) &&
              Number(item.puntaje) >= 0 &&
              Number(item.puntaje) <= 20))
      )
      const complete =
        review.criteria.length > 0 &&
        review.criteria.every(item => item.puntaje !== '' && item.comentario.trim()) &&
        review.criteria.reduce((sum, item) => sum + item.peso, 0) === 100 &&
        Boolean(review.recommendation) &&
        Boolean(review.authorComment.trim())
      return validCriteria && (review.status === 'draft' || complete)
    })
  )
}

export const initialReviews = Object.fromEntries(
  Object.entries(assignmentsByWork).flatMap(([code, work]) =>
    work.revisores
      .filter(reviewer => reviewer.revisionDemo)
      .map(reviewer => [getReviewKey(reviewer.id, code), reviewer.revisionDemo])
  )
)
