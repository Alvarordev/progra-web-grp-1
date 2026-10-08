import Header from '../../../core/ui/Header/Header.jsx'
import Footer from '../../../core/ui/Footer/Footer.jsx'
import ReviewerNavigation from '../../../core/ui/ReviewerNavigation/ReviewerNavigation.jsx'
import ReviewAssignmentCard from '../components/ReviewAssignmentCard/ReviewAssignmentCard.jsx'
import styles from './ReviewerInboxPage.module.css'

const assignments = [
  
]

const noHayAsignaciones = assignments.length === 0

const filters = [
  { label: 'Todas', count: '6', active: true },
  { label: 'Pendientes', count: '2' },
  { label: 'Entregadas', count: '4' },
  { label: 'Vencidas', count: '1', warning: true },
]

function ReviewerInboxPage() {
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
      <p className = {styles.emp}>Sin trabajos asignados por ahora</p>
    </div>

    <section className={styles.emptyState}>
      <div className={styles.emptyIcon}>✓</div>

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
          6 trabajos asignados · la etapa de revisión cierra el 20/10/2026
          a las 18:00
        </p>
      </div>

      <div aria-label="Resumen de revisiones" className={styles.stats}>
        <div className={`${styles.stat} ${styles.pendingStat}`}>
          <span>Pendientes</span>
          <strong>2</strong>
        </div>

        <div className={`${styles.stat} ${styles.completedStat}`}>
          <span>Entregadas</span>
          <strong>4</strong>
        </div>
      </div>
    </div>

    <nav aria-label="Filtrar revisiones" className={styles.filters}>
      {filters.map((filtro) => (
        <span
          aria-current={filtro.active ? 'true' : undefined}
          className={[
            styles.filter,
            filtro.active && styles.filterActive,
            filtro.warning && styles.filterWarning,
          ]
            .filter(Boolean)
            .join(' ')}
          key={filtro.label}
        >
          {filtro.label} · {filtro.count}
        </span>
      ))}
    </nav>

    <section
      aria-label="Trabajos asignados"
      className={styles.assignmentGrid}
    >
      {assignments.map((asignacion) => (
        <ReviewAssignmentCard
          asignacion={asignacion}
          key={asignacion.codigo}
        />
      ))}
    </section>
  </>
  )}
        </div>
      </main>
      <Footer />
    </div>
  )
} 

export default ReviewerInboxPage
