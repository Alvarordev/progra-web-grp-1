import { useId } from 'react'
import { Link } from 'react-router'
import styles from './InboxEmptyState.module.css'

// Tarjeta de la bandeja sin trabajos, como la maqueta 5.1. La acción es opcional.
function InboxEmptyState({ accion, descripcion, titulo }) {
  const tituloId = useId()

  return (
    <section aria-labelledby={tituloId} aria-live="polite" className={styles.emptyState}>
      <div aria-hidden="true" className={styles.icon}>✓</div>
      <h2 id={tituloId}>{titulo}</h2>
      <p>{descripcion}</p>
      {accion && (
        <Link className={styles.action} to={accion.ruta}>
          {accion.texto}
        </Link>
      )}
    </section>
  )
}

export default InboxEmptyState
