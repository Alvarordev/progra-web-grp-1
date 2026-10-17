import InfoPanel from '../InfoPanel/InfoPanel.jsx'
import styles from './ScorePanel.module.css'

function ScorePanel({ dictamen }) {
  return (
    <InfoPanel etiqueta="Puntaje por criterio">
      <dl className={styles.scores}>
        {dictamen.puntajes.map((puntaje) => (
          <div key={puntaje.criterio}>
            <dt>{puntaje.criterio}</dt>
            <dd>{puntaje.nota}</dd>
          </div>
        ))}
        <div className={styles.average}>
          <dt>Promedio ponderado</dt>
          <dd className={styles[dictamen.resultado]}>{dictamen.promedio}</dd>
        </div>
      </dl>
    </InfoPanel>
  )
}

export default ScorePanel
