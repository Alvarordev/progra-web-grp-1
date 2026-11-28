import styles from './ReviewFeedback.module.css'

function ReviewFeedback({ revisiones }) {
  return (
    <section aria-labelledby="feedback-title" className={styles.panel}>
      <h2 className={styles.title} id="feedback-title">
        Retroalimentación consolidada de los revisores
      </h2>
      <ol className={styles.list}>
        {revisiones.map((revision, indice) => (
          <li key={revision.comentario}>
            <p className={styles.label}>
              Revisor {indice + 1} · {revision.recomendacion}
            </p>
            <p className={styles.comment}>{revision.comentario}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default ReviewFeedback
