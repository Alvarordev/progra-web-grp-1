import styles from './DonutChartCard.module.css'

/* Dona hecha con conic-gradient. La leyenda repite cada valor en texto. */
function DonutChartCard({ datos, nota, titulo }) {
    const total = datos.reduce((suma, dato) => suma + dato.value, 0)
  const tramos = datos.map((dato, indice) => {
    const anterior = datos
      .slice(0, indice)
      .reduce((suma, otro) => suma + otro.value, 0)
    const inicio = (anterior / total) * 100
    const fin = ((anterior + dato.value) / total) * 100
    return `${dato.color} ${inicio}% ${fin}%`
  })

  return (
    <article className={styles.card}>
      <h2>{titulo}</h2>
      <div className={styles.content}>
        <div
          aria-hidden="true"
          className={styles.donut}
          style={{ background: `conic-gradient(${tramos.join(', ')})` }}
        >
          <span className={styles.center}>
            <strong>{total}</strong>
            <span>trabajos</span>
          </span>
        </div>
        <ul className={styles.legend}>
          {datos.map((dato) => (
            <li key={dato.label}>
              <span
                aria-hidden="true"
                className={styles.swatch}
                style={{ background: dato.color }}
              />
              {dato.label} · {dato.value}
            </li>
          ))}
        </ul>
      </div>
      <p className={styles.note}>{nota}</p>
    </article>
  )
}

export default DonutChartCard
