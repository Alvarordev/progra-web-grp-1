import { Link } from 'react-router'
import WorkStatusBadge from '../WorkStatusBadge/WorkStatusBadge.jsx'
import styles from './WorkCard.module.css'

function getActionLabel(trabajo) {
  if (trabajo.soloLectura) return 'Ver en modo lectura'
  if (trabajo.dictamen) return 'Ver dictamen'
  return 'Ver detalle'
}

function WorkCard({ trabajo }) {
  const titleId = `work-${trabajo.codigo}`

  return (
    <article aria-labelledby={titleId} className={`${styles.card} ${styles[trabajo.estado]}`}>
      <div className={styles.cardHeading}>
        <span className={styles.code}>{trabajo.codigo}</span>
        <WorkStatusBadge estado={trabajo.estado} />
      </div>

      <h2 className={styles.title} id={titleId}>
        {trabajo.titulo}
      </h2>
      <p className={styles.authors}>
        {trabajo.autores.map((autor) => autor.nombre).join(', ')}
      </p>

      <div className={styles.metadata}>
        <span>{trabajo.eje}</span>
        <span>{trabajo.tipo}</span>
      </div>

      <div className={styles.cardFooter}>
        <span className={styles.date}>{trabajo.fecha}</span>
        <Link className={styles.actionLink} to={`/autor/trabajos/${trabajo.codigo}`}>
          {getActionLabel(trabajo)}
        </Link>
      </div>
    </article>
  )
}

export default WorkCard
