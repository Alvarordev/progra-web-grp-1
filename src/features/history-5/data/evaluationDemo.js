// datos de demostración de la evaluación: trabajos, criterios y revisiones de ejemplo.

export const works = {
  'TRB-2026-042': {
    title: 'Predicción de deserción universitaria mediante aprendizaje supervisado',
    eje: 'Inteligencia artificial y datos',
    tipo: 'Artículo completo',
    fechaLimite: '15/10/2026',
    resumen:
      'Se evalúan tres modelos supervisados para anticipar el abandono de estudios en una universidad privada de Lima, usando registros de cinco cohortes.',
  },
  'TRB-2026-053': {
    title: 'Bienestar emocional y rendimiento académico en primeros ciclos',
    eje: 'Salud y sociedad',
    tipo: 'Póster',
    fechaLimite: '09/10/2026',
    resumen:
      'Estudio sobre la relación entre bienestar emocional, adaptación universitaria y rendimiento académico en estudiantes de primeros ciclos.',
  },
  'TRB-2026-031': {
    title: 'Refactorización guiada por métricas de deuda técnica',
    eje: 'Ingeniería de software',
    tipo: 'Artículo completo',
    fechaLimite: '18/10/2026',
    resumen:
      'La propuesta adapta métricas de deuda técnica al contexto universitario y evalúa su uso en proyectos de software.',
  },
}

export const initialCriteria = [
  {
    id: 'originalidad',
    nombre: 'Originalidad',
    peso: 25,
    puntaje: '17',
    comentario: 'Aporte claro frente a trabajos previos del área.',
  },
  {
    id: 'rigor',
    nombre: 'Rigor metodológico',
    peso: 30,
    puntaje: '15',
    comentario: 'Falta validación cruzada y control del desbalance de clases.',
  },
  {
    id: 'claridad',
    nombre: 'Claridad de la exposición',
    peso: 20,
    puntaje: '18',
    comentario: 'Redacción ordenada; mejorar la leyenda de la figura 3.',
  },
  {
    id: 'relevancia',
    nombre: 'Relevancia y aporte',
    peso: 25,
    puntaje: '',
    comentario: '',
  },
]

export const readOnlyReviewExamples = {
  'TRB-2026-031': {
    status: 'submitted',
    updatedAt: '2026-10-06T11:05:00',
    criteria: [
      { id: 'originalidad', nombre: 'Originalidad', peso: 25, puntaje: '16', comentario: 'La propuesta adapta métricas conocidas a un contexto universitario.' },
      { id: 'rigor', nombre: 'Rigor metodológico', peso: 30, puntaje: '15', comentario: 'El tamaño de la muestra de repositorios debería justificarse.' },
      { id: 'claridad', nombre: 'Claridad de la exposición', peso: 20, puntaje: '18', comentario: 'Buena estructura y tablas legibles.' },
      { id: 'relevancia', nombre: 'Relevancia y aporte', peso: 25, puntaje: '17', comentario: 'Aplicable a los cursos de proyectos de la carrera.' },
    ],
    recommendation: 'observaciones',
    authorComment:
      'El trabajo es sólido en su exposición. Recomiendo justificar la selección de repositorios y añadir una comparación con una línea base sin refactorización.',
    committeeComment:
      'Puede aceptarse si los autores atienden la observación metodológica antes de la versión final.',
  },
}

// puntajes y comentarios que aparecen al abrir la evaluación por primera vez.
export const valoresIniciales = {
  originality: { puntaje: '17', comentario: 'Aporte claro frente a trabajos previos del área.' },
  rigor: { puntaje: '15', comentario: 'Falta validación cruzada y control del desbalance de clases.' },
  clarity: { puntaje: '18', comentario: 'Redacción ordenada; mejorar la leyenda de la figura 3.' },
  relevance: { puntaje: '17', comentario: '' },
}

// recomendación y comentario al autor precargados.
export const formularioInicial = {
  recommendation: 'observaciones',
  authorComment: 'Reforzar la validación del modelo y detallar el tratamiento de datos faltantes.',
}
