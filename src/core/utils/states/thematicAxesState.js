export const thematicAxes = [
  {
    id: 'artificial-intelligence-data',
    nombre: 'Inteligencia artificial y datos',
    descripcion: 'Aprendizaje automático y ciencia de datos aplicada.',
    responsable: 'Dra. Ana Salazar',
    trabajos: 4,
  },
  {
    id: 'software-engineering',
    nombre: 'Ingeniería de software',
    descripcion: 'Arquitectura, calidad y procesos de desarrollo.',
    responsable: 'Mg. Luis Ramírez',
    trabajos: 3,
  },
  {
    id: 'sustainability-city',
    nombre: 'Sostenibilidad y ciudad',
    descripcion: 'Movilidad, gestión del agua y ciudades resilientes.',
    responsable: 'Mg. Carmen Effio',
    trabajos: 3,
  },
  {
    id: 'innovation-entrepreneurship',
    nombre: 'Innovación y emprendimiento',
    descripcion: 'Modelos de negocio y transferencia tecnológica.',
    responsable: 'Ing. Jorge Palomino',
    trabajos: 2,
  },
  {
    id: 'health-society',
    nombre: 'Salud y sociedad',
    descripcion: 'Salud pública y bienestar estudiantil.',
    responsable: 'Dra. Milagros Yupanqui',
    trabajos: 1,
  },
  {
    id: 'economics-markets',
    nombre: 'Economía y mercados',
    descripcion: 'Mercados financieros, comercio y desarrollo.',
    responsable: 'Mg. Renzo Bustamante',
    trabajos: 1,
  },
]

export function validateThematicAxes(value) {
  return (
    Array.isArray(value) &&
    value.every(
      item =>
        item !== null &&
        typeof item.id === 'string' &&
        ['nombre', 'descripcion', 'responsable'].every(
          field => typeof item[field] === 'string' && Boolean(item[field].trim())
        ) &&
        Number.isInteger(item.trabajos) &&
        item.trabajos >= 0
    ) &&
    new Set(value.map(item => item.id)).size === value.length
  )
}
