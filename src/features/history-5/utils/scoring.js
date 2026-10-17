export function isValidScore(puntaje) {
  if (puntaje === '') {
    return false
  }
  const value = Number(puntaje)
  return Number.isInteger(value) && value >= 0 && value <= 20
}

// Promedio ponderado redondeado a un decimal. Se calcula con enteros
// (puntaje × peso) para que el redondeo no dependa de errores de punto flotante.
export function calculateWeightedAverage(criteria) {
  const scoredCriteria = criteria.filter(criterion => isValidScore(criterion.puntaje))
  const totalWeight = scoredCriteria.reduce(
    (total, criterion) => total + criterion.peso,
    0
  )

  if (totalWeight === 0) {
    return null
  }

  const weightedSum = scoredCriteria.reduce(
    (total, criterion) => total + Number(criterion.puntaje) * criterion.peso,
    0
  )

  return Math.round((weightedSum * 10) / totalWeight) / 10
}

export function formatTenth(value) {
  return value === null ? '—' : value.toFixed(1)
}
