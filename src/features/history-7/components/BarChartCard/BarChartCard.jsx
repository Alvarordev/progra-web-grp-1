import styles from './BarChartCard.module.css'

/* Barras horizontales hechas con CSS: no requiere librerías. */
function BarChartCard({ datos, titulo }) {
  const max = Math.max(...datos.map((dato) => dato.value), 1)

  return (
    <article className={styles.card}>
      <h2>{titulo}</h2>
      <ul className={styles.list}>
        {datos.map((dato) => (
          <li className={styles.row} key={dato.label}>
            <span className={styles.label}>{dato.label}</span>
            <span aria-hidden="true" className={styles.track}>
              <span
                className={styles.fill}
                style={{ width: `${(dato.value / max) * 100}%` }}
              />
            </span>
            <span className={styles.value}>{dato.value}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

export default BarChartCard
