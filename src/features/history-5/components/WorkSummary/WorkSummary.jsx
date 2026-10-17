import Button from '../../../../core/ui/Button/Button.jsx'
import { workDocumentUrl } from '../../data/workDocument.js'
import { getRecommendationLabel } from '../../utils/recommendations.js'
import styles from './WorkSummary.module.css'

// datos del trabajo; con evaluación enviada muestra también la recomendación.
function WorkSummary({ codigo, trabajo, enviada, recomendacion }) {
  const etiqueta = getRecommendationLabel(recomendacion).toLowerCase()
  return (
    <section className={styles.workPanel} aria-labelledby="work-title">
      <div className={styles.workDetails}>
        <div className={styles.workTags}>
          <span>{codigo}</span>
          <span>{trabajo.eje}</span>
          <span>{trabajo.tipo}</span>
          {enviada && <span className={styles.readOnlyTag}>Solo lectura</span>}
          {enviada && etiqueta && <span className={styles.recommendationTag}>Recomendación: {etiqueta}</span>}
        </div>
        <h1 id="work-title">{trabajo.title}</h1>
        <p>{trabajo.resumen}</p>
        <small>Revisión ciega: no verá los nombres de los autores.</small>
      </div>
      <div className={styles.workActions}>
        <Button variant="secondary" type="button" onClick={() => window.open(workDocumentUrl, '_blank', 'noopener')}>
          Abrir documento
        </Button>
        <p>Vence el {trabajo.fechaLimite ?? '—'}</p>
      </div>
    </section>
  )
}

export default WorkSummary
