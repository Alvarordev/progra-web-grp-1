import styles from './WorkDataPanel.module.css'

function WorkDataPanel({ children, enviado, trabajo }) {
  return (
    <section aria-labelledby="work-data-title" className={styles.panel}>
      <h2 className={styles.title} id="work-data-title">
        Datos del trabajo
      </h2>
      <dl className={styles.facts}>
        <div>
          <dt>Tipo</dt>
          <dd>{trabajo.tipo}</dd>
        </div>
        <div>
          <dt>Eje temático</dt>
          <dd>{trabajo.eje}</dd>
        </div>
        <div>
          <dt>Enviado</dt>
          <dd>{enviado}</dd>
        </div>
      </dl>
      <h3 className={styles.label}>Resumen</h3>
      <p className={styles.summary}>{trabajo.resumen}</p>
      {children}
    </section>
  )
}

export default WorkDataPanel
