import styles from './DecisionBanner.module.css'

function DecisionBanner({ dictamen }) {
  return (
    <section className={`${styles.banner} ${styles[dictamen.resultado]}`}>
      <p className={styles.label}>Resultado publicado el {dictamen.publicado}</p>
      <h2 className={styles.title}>{dictamen.titulo}</h2>
      <p className={styles.detail}>{dictamen.detalle}</p>
    </section>
  )
}

export default DecisionBanner
