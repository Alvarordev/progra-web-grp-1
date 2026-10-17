import styles from './EvaluationComments.module.css'

// comentarios al autor (se publican) y al comité (confidenciales).
function EvaluationComments({ comentarioAutor, comentarioComite, soloLectura, alCambiarAutor, alCambiarComite }) {
  return (
    <div className={styles.commentsLayout}>
      <label className={styles.field}>
        <span>Comentarios al autor *</span>
        <textarea
          rows="4"
          value={comentarioAutor}
          disabled={soloLectura}
          onChange={(event) => alCambiarAutor(event.target.value)}
          placeholder="Escriba la retroalimentación que podrá consultar el autor..."
        />
      </label>
      <label className={styles.field}>
        <span>Observaciones al comité (confidencial)</span>
        <textarea
          rows="4"
          value={comentarioComite}
          disabled={soloLectura}
          onChange={(event) => alCambiarComite(event.target.value)}
          placeholder="Estas observaciones solo las verá el comité..."
        />
      </label>
    </div>
  )
}

export default EvaluationComments
