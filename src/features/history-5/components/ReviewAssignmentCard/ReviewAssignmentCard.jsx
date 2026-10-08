import { Link } from 'react-router'
import Button from '../../../../core/ui/Button/Button.jsx'
import styles from './ReviewAssignmentCard.module.css'

function ReviewAssignmentCard({ asignacion }) {
  const estaPendiente = asignacion.tipoEstado !== 'entregada'

  return (
    <article
      className={`${styles.card} ${styles[asignacion.tipoEstado]}`}
      aria-labelledby={`review-${asignacion.codigo}`}
    >
      <div className={styles.cardHeading}>
        <span className={styles.code}>{asignacion.codigo}</span>
        <span className={`${styles.badge} ${styles[`badge-${asignacion.tipoEstado}`]}`}>
          {asignacion.estado}
        </span>
      </div>

      <h2 className={styles.title} id={`review-${asignacion.codigo}`}>
        {asignacion.titulo}
      </h2>

      <div className={styles.metadata}>
        <span>{asignacion.eje}</span>
        <span>{asignacion.tipoTrabajo}</span>
      </div>

      <div className={styles.cardFooter}>
        <span className={`${styles.date} ${styles[`date-${asignacion.tipoEstado}`]}`}>
          {asignacion.fecha}
        </span>
        {estaPendiente ? (
          <Button size="small" variant="primary" type="button">
            {asignacion.accion}
          </Button>
        ) : (
          <Link className={styles.actionLink} to={`/evaluacion/${asignacion.codigo}`}>
            Ver evaluación
          </Link>
        )}
      </div>
    </article>
  )
}

export default ReviewAssignmentCard
