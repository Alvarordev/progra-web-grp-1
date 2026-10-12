import { useId } from 'react'
import styles from './EmptyState.module.css'

function EmptyState({ accion, descripcion, icono = '▤', titulo }) {
  const titleId = useId()

  return (
    <section aria-labelledby={titleId} className={styles.emptyState}>
      <span aria-hidden="true" className={styles.icon}>
        {icono}
      </span>
      <h2 className={styles.title} id={titleId}>
        {titulo}
      </h2>
      <p className={styles.description}>{descripcion}</p>
      {accion && <div className={styles.action}>{accion}</div>}
    </section>
  )
}

export default EmptyState
