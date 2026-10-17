import { Link } from 'react-router'
import styles from './AccessMessage.module.css'

function AccessMessage({ codigo, titulo, descripcion, acciones, contexto }) {
  return (
    <main className={styles.main}>
      <section aria-labelledby="access-message-title" className={styles.content}>
        <div
          aria-hidden="true"
          className={codigo === 403 ? styles.deniedIcon : styles.notFoundCode}
        >
          {codigo === 403 ? '!' : '404'}
        </div>
        <h1 id="access-message-title">{titulo}</h1>
        <p className={styles.description}>{descripcion}</p>
        <div className={styles.actions}>
          {acciones.map(action =>
            action.href ? (
              <a
                className={
                  action.primaria ? styles.primaryAction : styles.secondaryAction
                }
                href={action.href}
                key={action.texto}
              >
                {action.texto}
              </a>
            ) : (
              <Link
                className={
                  action.primaria ? styles.primaryAction : styles.secondaryAction
                }
                key={action.texto}
                to={action.ruta}
              >
                {action.texto}
              </Link>
            )
          )}
        </div>
        {contexto && <p className={styles.context}>{contexto}</p>}
      </section>
    </main>
  )
}

export default AccessMessage
