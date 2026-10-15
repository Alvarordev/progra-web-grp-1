import styles from './KpiList.module.css'

function KpiList({ indicadores }) {
  return (
    <ul className={styles.grid}>
      {indicadores.map((indicador) => (
        <li
          className={`${styles.kpi} ${styles[indicador.tono] ?? ''}`}
          key={indicador.etiqueta}
        >
          <span className={styles.label}>{indicador.etiqueta}</span>
          <strong className={styles.value}>{indicador.valor}</strong>
          <span className={styles.detail}>{indicador.detalle}</span>
        </li>
      ))}
    </ul>
  )
}

export default KpiList
