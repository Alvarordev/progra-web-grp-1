// Trabajos y revisores asignados. Las revisiones de cada revisor se leen del
// repositorio de revisiones (localStorage): si no existen o no están enviadas,
// el consolidado las muestra como pendientes.
// Los ids de los revisores que todavía no usan la aplicación son provisionales.
export const assignmentsByWork = {
  'TRB-2026-042': {
    title: 'Predicción de deserción universitaria mediante aprendizaje supervisado',
    eje: 'Inteligencia artificial y datos',
    tipo: 'Artículo completo',
    autores: 'Rosa Quispe Ttito y 2 coautores',
    revisores: [
      { id: 'demo-reviewer', nombre: 'Mg. Luis Ramírez Cárdenas' },
      { id: 'reviewer-oscar', nombre: 'Dr. Óscar Nakamura' },
      { id: 'reviewer-carmen', nombre: 'Mg. Carmen Efio' },
    ],
  },
}
