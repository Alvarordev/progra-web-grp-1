import styles from './InfoPanel.module.css'

function InfoPanel({ children, etiqueta, tipo = 'default' }) {
  return (
    <section className={`${styles.panel} ${styles[tipo]}`}>
      <h2 className={styles.label}>{etiqueta}</h2>
      {children}
    </section>
  )
}

export default InfoPanel
