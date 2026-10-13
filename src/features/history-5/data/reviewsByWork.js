// Datos de prueba para el consolidado. Cuando el grupo acuerde el JSON semilla,
// estas revisiones deben venir de ese archivo.
const baseCriteria = [
  { id: 'originalidad', nombre: 'Originalidad', peso: 25 },
  { id: 'rigor', nombre: 'Rigor metodológico', peso: 30 },
  { id: 'claridad', nombre: 'Claridad de la exposición', peso: 20 },
  { id: 'relevancia', nombre: 'Relevancia y aporte', peso: 25 },
]

function scoreCriteria(puntajes) {
  return baseCriteria.map((criterion, index) => ({
    ...criterion,
    puntaje: String(puntajes[index]),
  }))
}

export const reviewsByWork = {
  'TRB-2026-042': {
    title: 'Predicción de deserción universitaria mediante aprendizaje supervisado',
    eje: 'Inteligencia artificial y datos',
    tipo: 'Artículo completo',
    autores: 'Rosa Quispe Ttito y 2 coautores',
    reviews: [
      {
        revisor: 'Mg. Luis Ramírez Cárdenas',
        recomendacion: 'observaciones',
        enviadaEl: '2026-10-06T11:05:00',
        criterios: scoreCriteria([17, 15, 18, 17]),
        comentarioAutor: 'Reforzar la validación del modelo y detallar el tratamiento de datos faltantes.',
        comentarioComite: 'Sugiero solicitar el repositorio de datos antes de la decisión final.',
      },
      {
        revisor: 'Dr. Óscar Nakamura',
        recomendacion: 'aceptar',
        enviadaEl: '2026-10-14T09:30:00',
        criterios: scoreCriteria([18, 17, 17, 18]),
        comentarioAutor: 'Trabajo bien fundamentado; conviene ampliar la discusión de resultados por cohorte.',
        comentarioComite: '',
      },
      {
        revisor: 'Mg. Carmen Efio',
        recomendacion: 'aceptar',
        enviadaEl: '2026-10-12T16:20:00',
        criterios: scoreCriteria([15, 14, 15, 14]),
        comentarioAutor: 'Precisar el período de los registros académicos y la política de privacidad aplicada.',
        comentarioComite: '',
      },
    ],
  },
}
