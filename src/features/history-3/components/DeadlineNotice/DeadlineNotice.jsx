import styles from './DeadlineNotice.module.css'

function DeadlineNotice({ children, restante, tipo = 'info' }) {
  return (
    <section aria-label="Aviso de fecha límite" className={`${styles.notice} ${styles[tipo]}`}>
      <p>{children}</p>
      {restante && <strong>{restante}</strong>}
    </section>
  )
}

export default DeadlineNotice
