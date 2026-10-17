// Decisión final de cada trabajo. El borrador se puede cambiar; la decisión publicada no.
export const decisionOptions = ['aceptar', 'rechazar']

export function validateDecisions(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value) &&
    Object.values(value).every((item) => {
      if (!item || typeof item !== 'object') return false
      const basic = ['draft', 'published'].includes(item.status) &&
        ['', ...decisionOptions].includes(item.decision) &&
        typeof item.feedback === 'string' &&
        typeof item.updatedAt === 'string' && Number.isFinite(Date.parse(item.updatedAt))
      return basic && (item.status === 'draft' || (item.decision !== '' && item.feedback.trim() !== ''))
    })
}
