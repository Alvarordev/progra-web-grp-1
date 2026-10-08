import { useState } from 'react'
import Header from '../../../core/ui/Header/Header.jsx'
import Footer from '../../../core/ui/Footer/Footer.jsx'
import ReviewerNavigation from '../../../core/ui/ReviewerNavigation/ReviewerNavigation.jsx'
import ReviewAssignmentCard from '../components/ReviewAssignmentCard/ReviewAssignmentCard.jsx'
import { getSubmittedReviews } from '../utils/reviewStorage.js'
import styles from './ReviewerInboxPage.module.css'

const initialAssignments = [
  {
    codigo: 'TRB-2026-042',
    titulo: 'Predicción de deserción universitaria mediante aprendizaje supervisado',
    eje: 'Inteligencia artificial y datos',
    tipoTrabajo: 'Artículo completo',
    estado: 'Revisión pendiente',
    tipoEstado: 'pendiente',
    fecha: 'Vence el 15/10/2026 · faltan 3 días',
    accion: 'Evaluar',
  },
  {
    codigo: 'TRB-2026-053',
    titulo: 'Bienestar emocional y rendimiento académico en primeros ciclos',
    eje: 'Salud y sociedad',
    tipoTrabajo: 'Póster',
    estado: 'Vencida',
    tipoEstado: 'vencida',
    fecha: 'Venció el 09/10/2026 · hace 3 días',
    accion: 'Evaluar ahora',
  },
  {
    codigo: 'TRB-2026-031',
    titulo: 'Refactorización guiada por métricas de deuda técnica',
    eje: 'Ingeniería de software',
    tipoTrabajo: 'Artículo completo',
    estado: 'Entregada',
    tipoEstado: 'entregada',
    fecha: 'Enviada el 06/10/2026 · aceptar con observaciones',
  },
  {
    codigo: 'TRB-2026-051',
    titulo: 'Evaluación del uso de agua reciclada en riego de áreas verdes del campus',
    eje: 'Sostenibilidad y ciudad',
    tipoTrabajo: 'Resumen extendido',
    estado: 'Entregada',
    tipoEstado: 'entregada',
    fecha: 'Enviada el 04/10/2026 · aceptar',
  },
  {
    codigo: 'TRB-2026-035',
    titulo: 'Pruebas automatizadas en proyectos universitarios de software',
    eje: 'Ingeniería de software',
    tipoTrabajo: 'Resumen extendido',
    estado: 'Entregada',
    tipoEstado: 'entregada',
    fecha: 'Enviada el 02/10/2026 · aceptar',
  },
  {
    codigo: 'TRB-2026-045',
    titulo: 'Detección de fraude en pagos móviles con modelos de árboles',
    eje: 'Economía y mercados',
    tipoTrabajo: 'Artículo completo',
    estado: 'Entregada',
    tipoEstado: 'entregada',
    fecha: 'Enviada el 30/09/2026 · rechazar',
  },
]

const filters = [
  { id: 'todas', label: 'Todas' },
  { id: 'pendientes', label: 'Pendientes' },
  { id: 'entregadas', label: 'Entregadas' },
  { id: 'vencidas', label: 'Vencidas', warning: true },
]

const recommendationLabels = {
  aceptar: 'aceptar',
  observaciones: 'aceptar con observaciones',
  rechazar: 'rechazar',
}

function loadAssignments(submittedReviews) {
  return initialAssignments.map((assignment) => {
    const review = submittedReviews[assignment.codigo]

    if (!review) return assignment

    const sentDate = new Intl.DateTimeFormat('es-PE').format(
      new Date(review.submittedAt),
    )
    const recommendation = recommendationLabels[review.recommendation] ?? 'enviada'

    return {
      ...assignment,
      estado: 'Entregada',
      tipoEstado: 'entregada',
      fecha: `Enviada el ${sentDate} · ${recommendation}`,
    }
  })
}

function matchesFilter(assignment, filterId) {
  if (filterId === 'todas') return true
  if (filterId === 'pendientes') return assignment.tipoEstado !== 'entregada'
  if (filterId === 'entregadas') return assignment.tipoEstado === 'entregada'
  return assignment.tipoEstado === 'vencida'
}

function ReviewerInboxPage() {
  const [assignments] = useState(() => loadAssignments(getSubmittedReviews()))
  const [selectedFilter, setSelectedFilter] = useState('todas')
  const pendingCount = assignments.filter(
    (assignment) => assignment.tipoEstado !== 'entregada',
  ).length
  const completedCount = assignments.filter(
    (assignment) => assignment.tipoEstado === 'entregada',
  ).length
  const overdueCount = assignments.filter(
    (assignment) => assignment.tipoEstado === 'vencida',
  ).length
  const visibleAssignments = assignments.filter((assignment) =>
    matchesFilter(assignment, selectedFilter),
  )
  const noHayAsignaciones = assignments.length === 0

  function getFilterCount(filterId) {
    if (filterId === 'todas') return assignments.length
    if (filterId === 'pendientes') return pendingCount
    if (filterId === 'entregadas') return completedCount
    return overdueCount
  }

  return (
    <div className={styles.page}>
      <Header estado="En revisión" />
      <ReviewerNavigation
        rutaActiva="/bandeja-revision"
        usuario={{
          iniciales: 'LR',
          nombre: 'Mg. Luis Ramírez Cárdenas',
          rol: 'Rol: Revisor',
        }}
      />

      <main className={styles.main}>
        <div className={styles.content}>
          {noHayAsignaciones ? (
            <>
              <div className={styles.emptyHeading}>
                <h1>Mi bandeja de revisión</h1>
                <p>Sin trabajos asignados por ahora</p>
              </div>

              <section className={styles.emptyState} aria-label="Sin revisiones asignadas">
                <div className={styles.emptyIcon} aria-hidden="true">✓</div>
                <h2>No tiene revisiones asignadas</h2>
                <p>
                  El comité asigna los trabajos cuando cierra la recepción, el 30/09/2026.
                  <br />
                  Mantenga sus líneas de interés actualizadas para recibir trabajos afines.
                </p>
                <button className={styles.emptyAction} type="button">
                  Actualizar mis líneas de interés
                </button>
              </section>
            </>
          ) : (
            <>
              <div className={styles.headingRow}>
                <div>
                  <h1>Mi bandeja de revisión</h1>
                  <p>
                    {assignments.length} trabajos asignados · la etapa de revisión cierra el 20/10/2026 a las 18:00
                  </p>
                </div>

                <div aria-label="Resumen de revisiones" className={styles.stats}>
                  <div className={`${styles.stat} ${styles.pendingStat}`}>
                    <span>Pendientes</span>
                    <strong>{pendingCount}</strong>
                  </div>
                  <div className={`${styles.stat} ${styles.completedStat}`}>
                    <span>Entregadas</span>
                    <strong>{completedCount}</strong>
                  </div>
                </div>
              </div>

              <nav aria-label="Filtrar revisiones" className={styles.filters}>
                {filters.map((filter) => (
                  <button
                    aria-pressed={selectedFilter === filter.id}
                    className={[
                      styles.filter,
                      selectedFilter === filter.id && styles.filterActive,
                      filter.warning && styles.filterWarning,
                    ].filter(Boolean).join(' ')}
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    type="button"
                  >
                    {filter.label} · {getFilterCount(filter.id)}
                  </button>
                ))}
              </nav>

              {visibleAssignments.length > 0 ? (
                <section aria-label="Trabajos asignados" className={styles.assignmentGrid}>
                  {visibleAssignments.map((assignment) => (
                    <ReviewAssignmentCard asignacion={assignment} key={assignment.codigo} />
                  ))}
                </section>
              ) : (
                <section className={styles.filteredEmpty} aria-live="polite">
                  <h2>No hay revisiones en esta categoría</h2>
                  <p>Pruebe con otro filtro para ver sus trabajos asignados.</p>
                </section>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ReviewerInboxPage
