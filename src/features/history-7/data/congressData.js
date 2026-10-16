/* Datos de ejemplo. Reemplaza estas constantes por la llamada al backend / servicio cuando esté disponible. */

/* 7.1 Tablero de métricas */
export const metricIndicators = [
  { etiqueta: 'Trabajos recibidos', valor: '14', detalle: '12 enviados · 2 borradores', tono: 'info' },
  { etiqueta: 'Trabajos aceptados', valor: '9', detalle: '3 rechazados', tono: 'success' },
  { etiqueta: 'Tasa de aceptación', valor: '75 %', detalle: 'sobre 12 trabajos evaluados', tono: 'accent' },
  { etiqueta: 'Revisiones pendientes', valor: '7', detalle: '3 vencidas', tono: 'warning' },
]

export const worksByAxis = [
  { label: 'Inteligencia artificial y datos', value: 4 },
  { label: 'Ingeniería de software', value: 3 },
  { label: 'Sostenibilidad y ciudad', value: 3 },
  { label: 'Innovación y emprendimiento', value: 2 },
  { label: 'Salud y sociedad', value: 1 },
  { label: 'Economía y mercados', value: 1 },
]

export const worksByStatus = [
  { label: 'Aceptado', value: 9, color: 'var(--color-success)' },
  { label: 'Rechazado', value: 3, color: 'var(--color-danger)' },
  { label: 'En revisión', value: 1, color: 'var(--color-warning)' },
  { label: 'Borrador', value: 1, color: 'var(--color-text-muted)' },
]

/* 7.2 Cumplimiento por revisor (ordenado por cumplimiento descendente) */
export const reviewers = [
  { id: 1, nombre: 'Mg. Carmen Effio Vargas', asignadas: 4, entregadas: 4, vencidas: 0, tiempo: 3.2 },
  { id: 2, nombre: 'Dra. Milagros Yupanqui Ríos', asignadas: 3, entregadas: 3, vencidas: 0, tiempo: 4.0 },
  { id: 3, nombre: 'Dr. Óscar Nakamura Trigoso', asignadas: 2, entregadas: 2, vencidas: 0, tiempo: 5.5 },
  { id: 4, nombre: 'Mg. Luis Ramírez Cárdenas', asignadas: 6, entregadas: 4, vencidas: 1, tiempo: 6.8 },
  { id: 5, nombre: 'Mg. Renzo Bustamante Loayza', asignadas: 3, entregadas: 2, vencidas: 0, tiempo: 7.1 },
  { id: 6, nombre: 'Mg. Patricia Zegarra Coronado', asignadas: 2, entregadas: 1, vencidas: 1, tiempo: 9.0 },
  { id: 7, nombre: 'Ing. Jorge Palomino Ávila', asignadas: 5, entregadas: 2, vencidas: 2, tiempo: 10.4 },
]

export const complianceSummary = {
  asignadas: 26,
  entregadas: 19,
  tiempoPromedio: '5.4 días',
  indicadores: [
    { etiqueta: 'Cumplimiento global', valor: '73 %', tono: 'success' },
    { etiqueta: 'Tiempo promedio de entrega', valor: '5.4 días' },
    { etiqueta: 'Revisores con vencidas', valor: '3 de 9', tono: 'danger' },
  ],
}

/* 7.3 Gestión de usuarios */
export const initialUsers = [
  { id: 1, nombre: 'Rosa María Quispe Ttito', correo: 'rosa.quispe@aloe.ulima.edu.pe', rol: 'Autor', femenino: true, institucion: 'Universidad de Lima', actividad: '4 trabajos', bloqueado: false },
  { id: 2, nombre: 'Mg. Luis Ramírez Cárdenas', correo: 'luis.ramirez@ulima.edu.pe', rol: 'Revisor', femenino: false, institucion: 'Universidad de Lima', actividad: '6 revisiones', bloqueado: false },
  { id: 3, nombre: 'Dra. Ana Salazar Bermúdez', correo: 'ana.salazar@ulima.edu.pe', rol: 'Comité', femenino: true, institucion: 'Universidad de Lima', actividad: '—', bloqueado: false },
  { id: 4, nombre: 'Diego Alonso Chávez Manrique', correo: 'diego.chavez@aloe.ulima.edu.pe', rol: 'Autor', femenino: false, institucion: 'Universidad de Lima', actividad: '2 trabajos', bloqueado: false },
  { id: 5, nombre: 'Dr. Óscar Nakamura Trigoso', correo: 'onakamura@pucp.edu.pe', rol: 'Revisor', femenino: false, institucion: 'Pontificia Universidad Católica', actividad: '2 revisiones', bloqueado: false },
  { id: 6, nombre: 'Ing. Jorge Palomino Ávila', correo: 'jorge.palomino@ulima.edu.pe', rol: 'Revisor', femenino: false, institucion: 'Universidad de Lima', actividad: '5 revisiones · 2 vencidas', bloqueado: true },
  { id: 7, nombre: 'Sofía Bustamante León', correo: 'sofia.bustamante@aloe.ulima.edu.pe', rol: 'Autor', femenino: true, institucion: 'Universidad de Lima', actividad: '1 trabajo', bloqueado: false },
  { id: 8, nombre: 'Mg. Carmen Effio Vargas', correo: 'carmen.effio@ulima.edu.pe', rol: 'Revisor', femenino: true, institucion: 'Universidad de Lima', actividad: '4 revisiones', bloqueado: false },
  { id: 9, nombre: 'Mg. Renzo Bustamante Loayza', correo: 'renzo.bustamante@up.edu.pe', rol: 'Revisor', femenino: false, institucion: 'Universidad del Pacífico', actividad: '3 revisiones', bloqueado: false },
  { id: 10, nombre: 'Dra. Milagros Yupanqui Ríos', correo: 'milagros.yupanqui@ulima.edu.pe', rol: 'Revisor', femenino: true, institucion: 'Universidad de Lima', actividad: '3 revisiones', bloqueado: false },
]

export const roles = ['Autor', 'Revisor', 'Comité']

export const statusOptions = [
  { value: 'activos', label: 'Activos' },
  { value: 'bloqueados', label: 'Bloqueados' },
]
