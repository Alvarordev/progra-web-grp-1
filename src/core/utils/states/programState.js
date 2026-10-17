export const rooms = [
  { codigo: 'A-101', ubicacion: 'Edificio A, primer piso' },
  { codigo: 'B-201', ubicacion: 'Edificio B, segundo piso' },
  { codigo: 'C-305', ubicacion: 'Edificio C, tercer piso' },
]

export const thematicAxes = [
  'Inteligencia artificial y datos',
  'Ingeniería de software',
  'Sostenibilidad y ciudad',
  'Innovación y emprendimiento',
  'Salud y sociedad',
  'Economía y mercados',
]

export const initialSessions = [
  {
    id: 'applied-ai',
    nombre: 'Inteligencia artificial aplicada',
    eje: 'Inteligencia artificial y datos',
    fecha: '2026-11-12',
    horaInicio: '09:00',
    horaFin: '10:30',
    sala: 'A-101',
    moderador: 'Dra. Ana Salazar',
    moderadorCompleto: 'Dra. Ana Salazar Bermúdez',
    correoModerador: 'ana.salazar@ulima.edu.pe',
  },
  {
    id: 'sustainability-city',
    nombre: 'Sostenibilidad y ciudad',
    eje: 'Sostenibilidad y ciudad',
    fecha: '2026-11-12',
    horaInicio: '11:00',
    horaFin: '12:30',
    sala: 'B-201',
    moderador: 'Mg. Carmen Effio',
    moderadorCompleto: 'Mg. Carmen Effio Vargas',
    correoModerador: 'carmen.effio@ulima.edu.pe',
  },
  {
    id: 'innovation-entrepreneurship',
    nombre: 'Innovación y emprendimiento',
    eje: 'Innovación y emprendimiento',
    fecha: '2026-11-13',
    horaInicio: '11:00',
    horaFin: '12:30',
    sala: 'B-201',
    moderador: 'Ing. Jorge Palomino',
    moderadorCompleto: 'Ing. Jorge Palomino',
    correoModerador: 'jorge.palomino@ulima.edu.pe',
  },
  {
    id: 'health-society',
    nombre: 'Salud y sociedad',
    eje: 'Salud y sociedad',
    fecha: '2026-11-13',
    horaInicio: '11:00',
    horaFin: '12:30',
    sala: 'B-201',
    moderador: 'Dra. Milagros Yupanqui',
    moderadorCompleto: 'Dra. Milagros Yupanqui',
    correoModerador: 'milagros.yupanqui@ulima.edu.pe',
  },
]

export const acceptedWorks = [
  {
    codigo: 'TRB-2026-042',
    titulo: 'Predicción de deserción universitaria mediante aprendizaje supervisado',
    eje: 'Inteligencia artificial y datos',
    tipoTrabajo: 'Artículo completo',
    autores: 'R. Quispe y 2 más',
    sesionId: 'applied-ai',
    orden: 1,
  },
  {
    codigo: 'TRB-2026-047',
    titulo: 'Segmentación de estudiantes por hábitos de estudio',
    eje: 'Inteligencia artificial y datos',
    tipoTrabajo: 'Resumen extendido',
    autores: 'A. Cárdenas y 1 más',
    sesionId: 'applied-ai',
    orden: 2,
  },
  {
    codigo: 'TRB-2026-049',
    titulo: 'Reconocimiento de patrones en consumo eléctrico del campus',
    eje: 'Inteligencia artificial y datos',
    tipoTrabajo: 'Artículo completo',
    autores: 'M. Talledo',
    sesionId: 'applied-ai',
    orden: 3,
  },
  {
    codigo: 'TRB-2026-051',
    titulo: 'Evaluación del uso de agua reciclada en riego de áreas verdes del campus',
    eje: 'Sostenibilidad y ciudad',
    tipoTrabajo: 'Resumen extendido',
    autores: 'R. Quispe, S. Bustamante',
    sesionId: 'sustainability-city',
    orden: 1,
  },
  {
    codigo: 'TRB-2026-055',
    titulo: 'Movilidad en bicicleta y seguridad vial en Miraflores',
    eje: 'Sostenibilidad y ciudad',
    tipoTrabajo: 'Artículo completo',
    autores: 'J. Alcántara',
    sesionId: 'sustainability-city',
    orden: 2,
  },
  {
    codigo: 'TRB-2026-058',
    titulo: 'Huella hídrica de los comedores universitarios',
    eje: 'Sostenibilidad y ciudad',
    tipoTrabajo: 'Póster',
    autores: 'P. Huamán y 1 más',
    sesionId: 'sustainability-city',
    orden: 3,
  },
  {
    codigo: 'TRB-2026-045',
    titulo: 'Detección de fraude en pagos móviles con modelos de árboles',
    eje: 'Economía y mercados',
    tipoTrabajo: 'Artículo completo',
    autores: 'L. Paredes',
    sesionId: null,
    orden: null,
  },
  {
    codigo: 'TRB-2026-060',
    titulo: 'Clasificación de reclamos vecinales con procesamiento de lenguaje natural',
    eje: 'Inteligencia artificial y datos',
    tipoTrabajo: 'Póster',
    autores: 'D. Chávez',
    sesionId: null,
    orden: null,
  },
  {
    codigo: 'TRB-2026-062',
    titulo: 'Modelo de rotación docente en institutos de Lima Norte',
    eje: 'Salud y sociedad',
    tipoTrabajo: 'Resumen extendido',
    autores: 'K. Ramos',
    sesionId: null,
    orden: null,
  },
]


const initialAssignments = acceptedWorks.map(({ codigo, sesionId, orden }) => ({ codigo, sesionId, orden }))
export const initialProgram = {
  sessions: initialSessions,
  assignments: initialAssignments,
  published: true,
  publishedSnapshot: structuredClone({ sessions: initialSessions, assignments: initialAssignments }),
}

function validateProgramContent(value) {
  return Boolean(value && Array.isArray(value.sessions) && value.sessions.every(session =>
    typeof session.id === 'string' && typeof session.nombre === 'string' && typeof session.eje === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(session.fecha) && /^\d{2}:\d{2}$/.test(session.horaInicio) &&
    /^\d{2}:\d{2}$/.test(session.horaFin) && session.horaInicio < session.horaFin && typeof session.sala === 'string',
  ) && new Set(value.sessions.map(session => session.id)).size === value.sessions.length &&
    Array.isArray(value.assignments) && value.assignments.every(item => typeof item.codigo === 'string' &&
      (item.sesionId === null || value.sessions.some(session => session.id === item.sesionId)) &&
      (item.orden === null || Number.isInteger(item.orden) && item.orden > 0)) &&
    new Set(value.assignments.map(item => item.codigo)).size === value.assignments.length)
}

export function validateProgram(value) {
  return validateProgramContent(value) && typeof value.published === 'boolean' &&
    (value.publishedSnapshot === undefined || validateProgramContent(value.publishedSnapshot))
}
