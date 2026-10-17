import { useState } from 'react'
import styles from './ReviewerCommentsPanel.module.css'

const pestanas = [
  { id: 'autor', etiqueta: 'Comentarios al autor reunidos' },
  { id: 'comite', etiqueta: 'Observaciones confidenciales' },
]

function ReviewerCommentsPanel({ revisiones }) {
  const [pestanaActiva, setPestanaActiva] = useState('autor')
  const esConfidencial = pestanaActiva === 'comite'

  return (
    <section className={styles.panel} aria-label="Comentarios de los revisores">
      <div className={styles.tabs} role="tablist">
        {pestanas.map((pestana) => (
          <button
            aria-controls="comentarios-revisores"
            aria-selected={pestanaActiva === pestana.id}
            className={`${styles.tab} ${pestanaActiva === pestana.id ? styles.tabActive : ''}`}
            id={`pestana-${pestana.id}`}
            key={pestana.id}
            onClick={() => setPestanaActiva(pestana.id)}
            role="tab"
            type="button"
          >
            {pestana.etiqueta}
          </button>
        ))}
      </div>

      <div
        aria-labelledby={`pestana-${pestanaActiva}`}
        className={styles.list}
        id="comentarios-revisores"
        role="tabpanel"
      >
        {esConfidencial && (
          <p className={styles.notice}>Estas observaciones solo las ve el comité.</p>
        )}
        {revisiones.map((revision) => {
          const texto = esConfidencial ? revision.comentarioComite : revision.comentarioAutor
          const mensaje = revision.pendiente
            ? 'Pendiente: el revisor todavía no envía su evaluación.'
            : texto || 'Sin observaciones.'

          return (
            <article className={styles.note} key={revision.revisor}>
              <h3>{revision.revisor}</h3>
              <p>{mensaje}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default ReviewerCommentsPanel
