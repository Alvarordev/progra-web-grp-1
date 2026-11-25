import styles from '../AccountPanels/AccountPanels.module.css'

function ReviewerActivity({ actividad }) {
  const rows = [
    { label: 'Revisiones asignadas', value: actividad?.asignadas ?? 0 },
    {
      label: 'Revisiones entregadas',
      value: actividad?.entregadas ?? 0,
      className: styles.completed,
    },
    { label: 'Pendientes', value: actividad?.pendientes ?? 0, className: styles.pending },
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
