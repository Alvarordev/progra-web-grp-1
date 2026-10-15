import { useState } from 'react'
import { Link } from 'react-router'
import useStoredState from '../../../core/utils/useStoredState.js'
import { reviewsRepository } from '../../../core/utils/repositories.js'
import { getReviewerAssignments, getReviewActivity } from '../../../core/utils/reviewerAssignments.js'
import useReviewerProfile from '../../../core/utils/useReviewerProfile.js'
import { getReviewerUser } from '../../../core/utils/states/reviewerProfilesState.js'
import Header from '../../../core/ui/Header/Header.jsx'
import Footer from '../../../core/ui/Footer/Footer.jsx'
import ReviewerNavigation from '../../../core/ui/ReviewerNavigation/ReviewerNavigation.jsx'
import ReviewAssignmentCard from '../components/ReviewAssignmentCard/ReviewAssignmentCard.jsx'
import styles from './ReviewerInboxPage.module.css'

const filters = [
  { id: 'todas', label: 'Todas' },
  { id: 'pendientes', label: 'Pendientes' },
  { id: 'entregadas', label: 'Entregadas' },
  { id: 'vencidas', label: 'Vencidas', warning: true },
]

const initialReviews = {}
function matchesFilter(assignment, filterId) {
  if (filterId === 'todas') return true
  if (filterId === 'pendientes') return assignment.tipoEstado !== 'entregada'
  if (filterId === 'entregadas') return assignment.tipoEstado === 'entregada'
  return assignment.tipoEstado === 'vencida'
}

function ReviewerInboxPage() {
  const reviewsState = useStoredState(reviewsRepository, initialReviews)
  const profileState = useReviewerProfile()
  const assignments = getReviewerAssignments(reviewsState.value, profileState.reviewerId)
  const [selectedFilter, setSelectedFilter] = useState('todas')
  const { pending: pendingCount, completed: completedCount, overdue: overdueCount } = getReviewActivity(assignments)
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
        usuario={getReviewerUser(profileState.profile)}
      />

      <main className={styles.main}>
        <div className={styles.content}>
          {(reviewsState.loading || profileState.loading) && <p role="status">Cargando revisiones…</p>}
          {(reviewsState.error || profileState.error) && <p role="alert">{reviewsState.error || profileState.error}</p>}
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
                <Link className={styles.emptyAction} to="/mi-cuenta">
                  Actualizar mis líneas de interés
                </Link>
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
