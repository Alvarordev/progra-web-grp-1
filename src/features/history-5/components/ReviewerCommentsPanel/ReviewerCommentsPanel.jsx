import styles from './ReviewerCommentsPanel.module.css'

// Comentarios al autor de cada revisor, uno por columna, como en la maqueta.
function ReviewerCommentsPanel({ revisiones }) {
  return (
    <div className={styles.lista}>
      {revisiones.map((revision, index) => (
        <article className={styles.nota} key={revision.revisor}>
          <h3 className={styles.etiqueta}>Revisor {index + 1}</h3>
          <p className={styles.texto}>
            {revision.pendiente
              ? 'Pendiente: el revisor todavía no envía su evaluación.'
              : revision.comentarioAutor || 'Sin observaciones.'}
          </p>
        </article>
      ))}
    </div>
  )
}

export default ReviewerCommentsPanel
