import Header from '../../../core/ui/Header/Header.jsx'
import Footer from '../../../core/ui/Footer/Footer.jsx'
import ReviewerNavigation from '../../../core/ui/ReviewerNavigation/ReviewerNavigation.jsx'
import ReviewAssignmentCard from '../components/ReviewAssignmentCard/ReviewAssignmentCard.jsx'
import styles from './ReviewerInboxPage.module.css'

const assignments = [
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

          <section aria-label="Trabajos asignados" className={styles.assignmentGrid}>
            {assignments.map((asignacion) => (
              <ReviewAssignmentCard
                asignacion={asignacion}
                key={asignacion.codigo}
              />
            ))}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ReviewerInboxPage
