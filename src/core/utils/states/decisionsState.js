export function validateDecisions(value) {
  return Boolean(
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.values(value).every(
      item =>
        ['aceptar', 'rechazar'].includes(item.resultado) &&
        typeof item.retroalimentacion === 'string' &&
        ['draft', 'published'].includes(item.status) &&
        typeof item.updatedAt === 'string'
    )
  )
}
