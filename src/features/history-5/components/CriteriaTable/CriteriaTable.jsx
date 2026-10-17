import { isValidScore } from '../../utils/scoring.js'
import styles from './CriteriaTable.module.css'

// tabla de criterios; en modo lectura los campos se ven como texto.
function CriteriaTable({ criterios, promedio, puntuados, soloLectura, alCambiar }) {
  return (
    <section className={`${styles.criteriaPanel} ${soloLectura ? styles.readOnlyTable : ''}`} aria-labelledby="criteria-title">
      <h2 id="criteria-title" className={styles.visuallyHidden}>Evaluación por criterios</h2>
      <div className={styles.tableHeader}>
        <span>Criterio</span>
        <span>Peso</span>
        <span>Puntaje (0–20)</span>
        <span>Comentario del criterio</span>
      </div>

      {criterios.map((criterio) => {
        const invalido = criterio.puntaje !== '' && !isValidScore(criterio.puntaje)
        return (
          <div className={styles.criterionRow} key={criterio.id}>
            <strong>{criterio.nombre}</strong>
            <span className={styles.weight}>{criterio.peso} %</span>
            <label className={styles.visuallyHidden} htmlFor={`score-${criterio.id}`}>
              Puntaje para {criterio.nombre}, de 0 a 20
            </label>
            <div className={styles.scoreField}>
              <input
                id={`score-${criterio.id}`}
                className={styles.scoreInput}
                type="number"
                min="0"
                max="20"
                step="1"
                value={criterio.puntaje}
                disabled={soloLectura}
                aria-invalid={invalido}
                aria-describedby={`score-error-${criterio.id}`}
                onChange={(event) => alCambiar(criterio.id, 'puntaje', event.target.value)}
              />
              {invalido && (
                <small className={styles.fieldError} id={`score-error-${criterio.id}`}>
                  Ingrese un puntaje entre 0 y 20.
                </small>
              )}
            </div>
            <label className={styles.visuallyHidden} htmlFor={`comment-${criterio.id}`}>
              Comentario para {criterio.nombre}
            </label>
            <textarea
              id={`comment-${criterio.id}`}
              className={styles.criterionComment}
              rows="2"
              placeholder="Escriba su comentario..."
              value={criterio.comentario}
              disabled={soloLectura}
              onChange={(event) => alCambiar(criterio.id, 'comentario', event.target.value)}
            />
          </div>
        )
      })}

      <div className={styles.averageRow}>
        <span>{soloLectura ? 'Promedio ponderado' : `Promedio ponderado provisional (${puntuados} de ${criterios.length} criterios)`}</span>
        <strong>{promedio}</strong>
      </div>
    </section>
  )
}

export default CriteriaTable
