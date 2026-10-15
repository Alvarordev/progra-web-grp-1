export const initialCriteria = [
  { id: 'originality', nombre: 'Originalidad', descripcion: 'Aporte novedoso frente a la literatura consultada.', peso: 25 },
  { id: 'rigor', nombre: 'Rigor metodológico', descripcion: 'Coherencia del diseño, los datos y el análisis.', peso: 30 },
  { id: 'clarity', nombre: 'Claridad de la exposición', descripcion: 'Redacción, estructura y calidad de las figuras.', peso: 20 },
  { id: 'relevance', nombre: 'Relevancia y aporte', descripcion: 'Pertinencia para el eje temático y utilidad práctica.', peso: 25 },
]

// Una configuración incompleta puede guardarse; abrir la revisión exige 100.
export function validateCriteria(value) {
  return Array.isArray(value) && value.every((item) =>
    item !== null && typeof item.id === 'string' &&
    typeof item.nombre === 'string' && Boolean(item.nombre.trim()) &&
    typeof item.descripcion === 'string' && Boolean(item.descripcion.trim()) &&
    Number.isFinite(item.peso) && item.peso > 0 && item.peso <= 100,
  ) && new Set(value.map((item) => item.id)).size === value.length
}
