import { recommendationOptions } from '../../utils/recommendations.js'
import { formatSentAt } from '../../utils/sentDate.js'
import styles from './EvaluationSidebar.module.css'

// al editar, elegir la recomendación; al leer, la fecha de envío y el aviso.
function EvaluationSidebar({ soloLectura, recomendacion, alElegir, enviadaEl, fechaLimite }) {
  const envio = enviadaEl ? formatSentAt(enviadaEl) : null
  return (
    <aside className={styles.sidePanel}>
      {soloLectura ? (
        <dl className={styles.deliveryPanel} aria-label="Datos de la entrega">
          <div>
            <dt>Enviada</dt>
            <dd>{envio ? `${envio.fecha} · ${envio.hora}` : '—'}</dd>
          </div>
          <div>
            <dt>Fecha límite</dt>
            <dd>{fechaLimite ?? '—'}</dd>
          </div>
        </dl>
      ) : (
        <fieldset className={styles.recommendationPanel}>
          <legend>Recomendación *</legend>
          {recommendationOptions.map((option) => (
            <label
              className={`${styles.recommendationOption} ${recomendacion === option.value ? styles.selectedRecommendation : ''}`}
              key={option.value}
            >
              <input
                type="radio"
                name="recommendation"
                value={option.value}
                checked={recomendacion === option.value}
                onChange={(event) => alElegir(event.target.value)}
              />
              {option.label}
            </label>
          ))}
        </fieldset>
      )}
      <p className={styles.confidentialNote}>
        {soloLectura
          ? 'Los campos se muestran como texto: en modo lectura no hay controles de edición ni botón de envío.'
          : 'Los comentarios al autor se publican con el dictamen. Las observaciones al comité son confidenciales.'}
      </p>
    </aside>
  )
}

export default EvaluationSidebar
