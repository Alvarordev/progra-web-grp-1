import { calculateWeightedAverage } from './scoring.js'
import { getReviewKey } from '../../../core/utils/states/reviewsState.js'

// Promedio de una lista de números, redondeado a un decimal con enteros
// (décimas) para no arrastrar errores de punto flotante.
function average(values) {
  if (values.length === 0) {
    return null
  }
  return (
    Math.round((values.reduce((total, value) => total + value, 0) * 10) / values.length) /
    10
  )
}

function pendingRow(revisor, criteria) {
  return {
    revisor: revisor.nombre,
    pendiente: true,
    criterios: criteria.map(criterio => ({ id: criterio.id, puntaje: '' })),
    ponderado: null,
    recomendacion: '',
    comentarioAutor: '',
    comentarioComite: '',
    enviadaEl: null,
  }
}

function submittedRow(revisor, review, criteria) {
  return {
    revisor: revisor.nombre,
    pendiente: false,
    criterios: criteria.map(criterio => ({
      id: criterio.id,
      puntaje: review.criteria.find(item => item.id === criterio.id)?.puntaje ?? '',
    })),
    ponderado: calculateWeightedAverage(review.criteria),
    recomendacion: review.recommendation,
    comentarioAutor: review.authorComment,
    comentarioComite: review.committeeComment,
    enviadaEl: review.updatedAt,
  }
}

// Solo cuentan las revisiones enviadas. Un revisor sin envío aparece como pendiente.
export function buildConsolidation({ codigo, revisores, reviews, criteria }) {
  const filas = revisores.map(revisor => {
    // Una revisión guardada en el navegador tiene prioridad sobre la de demostración.
    const review = reviews[getReviewKey(revisor.id, codigo)] ?? revisor.revisionDemo
    return review?.status === 'submitted'
      ? submittedRow(revisor, review, criteria)
      : pendingRow(revisor, criteria)
  })

  const entregadas = filas.filter(fila => !fila.pendiente)
  const ponderadosEnDecimas = entregadas
    .map(fila => fila.ponderado)
    .filter(ponderado => ponderado !== null)
    .map(ponderado => Math.round(ponderado * 10))

  const criteriosPromedio = criteria.map((criterio, index) => ({
    id: criterio.id,
    nombre: criterio.nombre,
    peso: criterio.peso,
    promedio: average(
      entregadas
        .map(fila => fila.criterios[index].puntaje)
        .filter(puntaje => puntaje !== '')
        .map(Number)
    ),
  }))

  const fechasEnvio = entregadas.map(fila => new Date(fila.enviadaEl))

  return {
    filas,
    criteriosPromedio,
    resumen: {
      promedioGeneral: ponderadosEnDecimas.length
        ? average(ponderadosEnDecimas) / 10
        : null,
      dispersion: ponderadosEnDecimas.length
        ? (Math.max(...ponderadosEnDecimas) - Math.min(...ponderadosEnDecimas)) / 10
        : null,
      totalRevisiones: revisores.length,
      entregadas: entregadas.length,
      recomiendanAceptar: entregadas.filter(fila => fila.recomendacion === 'aceptar')
        .length,
      conObservaciones: entregadas.filter(fila => fila.recomendacion === 'observaciones')
        .length,
      ultimaEntrega: fechasEnvio.length ? new Date(Math.max(...fechasEnvio)) : null,
    },
  }
}
