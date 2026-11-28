export const recommendationOptions = [
  { value: 'aceptar', label: 'Aceptar' },
  { value: 'observaciones', label: 'Aceptar con observaciones' },
  { value: 'rechazar', label: 'Rechazar' },
]

export function getRecommendationLabel(value) {
  return recommendationOptions.find(option => option.value === value)?.label ?? ''
}
