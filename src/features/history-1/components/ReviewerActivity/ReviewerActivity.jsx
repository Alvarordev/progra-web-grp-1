import { getReviewActivity } from '../../../../core/utils/reviewerAssignments.js'
import styles from '../AccountPanels/AccountPanels.module.css'

function ReviewerActivity({ asignaciones }) {
  const activity = getReviewActivity(asignaciones)
  const rows = [
    { label: 'Revisiones asignadas', value: activity.assigned },
    {
      label: 'Revisiones entregadas',
      value: activity.completed,
      className: styles.completed,
    },
    { label: 'Pendientes', value: activity.pending, className: styles.pending },
  ]

  return (
    <section aria-labelledby="reviewer-activity-title" className={styles.panel}>
      <h2 className={styles.eyebrow} id="reviewer-activity-title">
        Mi actividad
      </h2>
      <dl className={styles.activity}>
        {rows.map(row => (
          <div key={row.label}>
            <dt>{row.label}</dt>
            <dd className={row.className}>{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export default ReviewerActivity
