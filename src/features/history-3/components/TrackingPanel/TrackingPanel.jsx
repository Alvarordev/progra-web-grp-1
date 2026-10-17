import InfoPanel from '../InfoPanel/InfoPanel.jsx'
import styles from './TrackingPanel.module.css'

function TrackingPanel({ pasos }) {
  return (
    <InfoPanel etiqueta="Seguimiento">
      <ol className={styles.steps}>
        {pasos.map((paso) => (
          <li className={styles[paso.estado]} key={paso.paso}>
            <span aria-hidden="true" className={styles.dot} />
            <div>
              <p className={styles.step}>{paso.paso}</p>
              <p className={styles.date}>{paso.fecha}</p>
            </div>
          </li>
        ))}
      </ol>
    </InfoPanel>
  )
}

export default TrackingPanel
