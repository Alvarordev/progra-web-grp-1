export const initialWorkTypes = [
  {
    id: 'full-article',
    nombre: 'Artículo completo',
    extensionMaxima: '8 000 palabras',
    formatoEsperado: 'PDF · plantilla IEEE',
    admiteCoautores: true,
    maxCoautores: 4,
  },
  {
    id: 'extended-abstract',
    nombre: 'Resumen extendido',
    extensionMaxima: '2 500 palabras',
    formatoEsperado: 'PDF',
    admiteCoautores: true,
    maxCoautores: 3,
  },
  {
    id: 'poster',
    nombre: 'Póster',
    extensionMaxima: '1 lámina A1',
    formatoEsperado: 'PDF · orientación vertical',
    admiteCoautores: true,
    maxCoautores: 5,
  },
  {
    id: 'case-study',
    nombre: 'Caso de estudio',
    extensionMaxima: '5 000 palabras',
    formatoEsperado: 'PDF',
    admiteCoautores: false,
    maxCoautores: null,
  },
]

export function validateWorkTypes(value) {
  return Array.isArray(value) && value.every((item) =>
    item !== null && typeof item.id === 'string' &&
    typeof item.nombre === 'string' && Boolean(item.nombre.trim()) &&
    typeof item.extensionMaxima === 'string' &&
    Number.parseFloat(item.extensionMaxima.replace(/\s/g, '').replace(',', '.')) > 0 &&
    ['PDF', 'PDF · plantilla IEEE', 'PDF · orientación vertical'].includes(item.formatoEsperado) &&
    typeof item.admiteCoautores === 'boolean' &&
    (item.admiteCoautores ? Number.isInteger(item.maxCoautores) && item.maxCoautores > 0 : item.maxCoautores === null),
  ) && new Set(value.map((item) => item.id)).size === value.length
}
