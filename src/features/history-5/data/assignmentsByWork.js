// Trabajos y revisores asignados. Las revisiones de cada revisor se leen del
// repositorio de revisiones (localStorage): si no existen o no están enviadas,
// el consolidado las muestra como pendientes.
// Los ids de los revisores que todavía no usan la aplicación son provisionales.
// revisionDemo son evaluaciones de demostración (datos de ejemplo). Solo se usan
// si el revisor no tiene una revisión guardada en este navegador.
export const assignmentsByWork = {
  'TRB-2026-042': {
    title: 'Predicción de deserción universitaria mediante aprendizaje supervisado',
    eje: 'Inteligencia artificial y datos',
    tipo: 'Artículo completo',
    autores: 'Rosa Quispe Ttito y 2 coautores',
    revisores: [
      {
        id: 'demo-reviewer',
        ids: ['demo-reviewer', 'participant:luis.ramirez@ulima.edu.pe'],
        nombre: 'Mg. Luis Ramírez Cárdenas',
      },
      {
        id: 'reviewer-oscar',
        nombre: 'Dr. Óscar Nakamura',
        revisionDemo: {
          status: 'submitted',
          recommendation: 'aceptar',
          criteria: [
            { id: 'originality', nombre: 'Originalidad', peso: 25, puntaje: '18', comentario: 'Aporte claro frente a trabajos previos del área.' },
            { id: 'rigor', nombre: 'Rigor metodológico', peso: 30, puntaje: '17', comentario: 'Diseño coherente; conviene detallar la validación.' },
            { id: 'clarity', nombre: 'Claridad de la exposición', peso: 20, puntaje: '17', comentario: 'Redacción ordenada; mejorar la leyenda de la figura 3.' },
            { id: 'relevance', nombre: 'Relevancia y aporte', peso: 25, puntaje: '18', comentario: 'Pertinente para el eje temático y útil para el sector.' },
          ],
          authorComment: 'Trabajo bien fundamentado; conviene ampliar la discusión de resultados por cohorte.',
          committeeComment: '',
          updatedAt: '2026-10-14T16:40:00',
        },
      },
      {
        id: 'reviewer-carmen',
        nombre: 'Mg. Carmen Efio',
        revisionDemo: {
          status: 'submitted',
          recommendation: 'aceptar',
          criteria: [
            { id: 'originality', nombre: 'Originalidad', peso: 25, puntaje: '15', comentario: 'Idea nueva dentro del tema, aunque parecida a trabajos previos.' },
            { id: 'rigor', nombre: 'Rigor metodológico', peso: 30, puntaje: '14', comentario: 'Faltan detalles del preprocesamiento de datos.' },
            { id: 'clarity', nombre: 'Claridad de la exposición', peso: 20, puntaje: '15', comentario: 'Estructura clara; las tablas necesitan unidades.' },
            { id: 'relevance', nombre: 'Relevancia y aporte', peso: 25, puntaje: '14', comentario: 'Útil para la gestión académica de la universidad.' },
          ],
          authorComment: 'Precisar el periodo de los registros académicos y la política de privacidad aplicada.',
          committeeComment: '',
          updatedAt: '2026-10-13T11:15:00',
        },
      },
    ],
  },
}
