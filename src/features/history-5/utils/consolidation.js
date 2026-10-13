import { calculateWeightedAverage } from './scoring.js'

// Trabaja en décimas (enteros) para que promedios y diferencias no arrastren errores de punto flotante.
function toTenths(value) {
  return Math.round(value * 10)
}

function roundedAverage(values) {
  return Math.round(values.reduce((total, value) => total + value, 0) * 10 / values.length) / 10
}

export function buildConsolidation(reviews) {
  const filas = reviews.map((review) => ({
    ...review,
    ponderado: calculateWeightedAverage(review.criterios),
  }))

  const ponderadosEnDecimas = filas
    .map((fila) => fila.ponderado)
    .filter((ponderado) => ponderado !== null)
    .map(toTenths)

  const criteriosPromedio = (reviews[0]?.criterios ?? []).map((criterio, index) => ({
    id: criterio.id,
    nombre: criterio.nombre,
    peso: criterio.peso,
    promedio: roundedAverage(reviews.map((review) => Number(review.criterios[index].puntaje))),
  }))

  const fechasEnvio = reviews.map((review) => new Date(review.enviadaEl))

  return {
    filas,
    criteriosPromedio,
    resumen: {
      promedioGeneral: ponderadosEnDecimas.length ? roundedAverage(ponderadosEnDecimas) / 10 : null,
      dispersion: ponderadosEnDecimas.length
        ? (Math.max(...ponderadosEnDecimas) - Math.min(...ponderadosEnDecimas)) / 10
        : null,
      totalRevisiones: reviews.length,
      recomiendanAceptar: reviews.filter((review) => review.recomendacion === 'aceptar').length,
      conObservaciones: reviews.filter((review) => review.recomendacion === 'observaciones').length,
      ultimaEntrega: fechasEnvio.length ? new Date(Math.max(...fechasEnvio)) : null,
    },
  }
}
