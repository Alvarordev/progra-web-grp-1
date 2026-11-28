import { Link } from 'react-router'
import WorkStatusBadge from '../WorkStatusBadge/WorkStatusBadge.jsx'
import styles from './WorkCard.module.css'

function getAction(trabajo, recepcionAbierta) {
  if (trabajo.estado === 'borrador' && recepcionAbierta) {
    return {
      label: 'Seguir editando',
      to: `/autor/nuevo-trabajo?borrador=${trabajo.codigo}`,
    }
  }
  if (trabajo.estado === 'borrador' || trabajo.modoLectura) {
    return {
      label: 'Ver en modo lectura',
      to: `/autor/trabajos/${trabajo.codigo}/lectura`,
    }
  }
  if (trabajo.estado === 'aceptado' || trabajo.estado === 'rechazado') {
    return { label: 'Ver dictamen', to: `/autor/trabajos/${trabajo.codigo}` }
  }
  return { label: 'Ver detalle', to: `/autor/trabajos/${trabajo.codigo}` }
}

function WorkCard({ trabajo, recepcionAbierta }) {
  const titleId = `work-${trabajo.codigo}`
  const accion = getAction(trabajo, recepcionAbierta)

  return (
    <article aria-labelledby={titleId} className={styles.card}>
      <div className={styles.cardHeading}>
        <span className={styles.code}>{trabajo.codigo}</span>
        <WorkStatusBadge estado={trabajo.estado} />
      </div>

      <h2 className={styles.title} id={titleId}>
        {trabajo.titulo}
      </h2>
      <p className={styles.authors}>{trabajo.firmantes}</p>

      <div className={styles.metadata}>
        <span className={styles.axis}>{trabajo.eje}</span>
        <span className={styles.type}>{trabajo.tipo}</span>
      </div>

      <div className={styles.cardFooter}>
        <span className={trabajo.noEnviado ? styles.dateAlert : styles.date}>
          {trabajo.estado === 'borrador' && recepcionAbierta
            ? 'No enviado · borrador'
            : trabajo.fecha}
        </span>
        <Link className={styles.actionLink} to={accion.to}>
          {accion.label}
        </Link>
      </div>
    </article>
  )
}

export default WorkCard
