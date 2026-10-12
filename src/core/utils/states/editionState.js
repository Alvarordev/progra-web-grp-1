export const initialEdition = {
  editionName: 'VIII Congreso Académico Estudiantil',
  editionYear: '2026',
  editionVenue: 'Auditorio Central, Universidad de Lima — Santiago de Surco',
  editionDescription:
    'Encuentro anual de investigación estudiantil. Se reciben artículos completos, resúmenes extendidos, pósteres y casos de estudio en seis ejes temáticos.',
}

export const initialEditionStatus = 'Recepción abierta'

export function validateEdition(value) {
  return value !== null && typeof value === 'object' &&
    Object.keys(initialEdition).every((field) => typeof value[field] === 'string')
}

export function validateEditionStatus(value) {
  return ['Recepción abierta', 'En preparación'].includes(value)
}
