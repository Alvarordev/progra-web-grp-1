import styles from './DeadlineNotice.module.css'

function DeadlineNotice({ children, restante, tipo = 'info', titulo }) {
  return (
    <section aria-label="Aviso de fecha límite" className={`${styles.notice} ${styles[tipo]}`}>
      <p>
        {titulo && <strong className={styles.title}>{titulo}</strong>} {children}
      </p>
      {restante && <strong className={styles.remaining}>{restante}</strong>}
    </section>
  )
}

export default DeadlineNotice
