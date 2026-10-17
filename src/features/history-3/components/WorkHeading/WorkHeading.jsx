import { Link } from 'react-router'
import WorkStatusBadge from '../WorkStatusBadge/WorkStatusBadge.jsx'
import styles from './WorkHeading.module.css'

function WorkHeading({ acciones, estados, migaDePan = true, trabajo }) {
  return (
    <>
      {migaDePan && (
        <nav aria-label="Ruta de navegación" className={styles.breadcrumb}>
          <Link to="/autor/trabajos">Mis trabajos</Link>
          <span aria-hidden="true"> › </span>
          <span aria-current="page">{trabajo.codigo}</span>
        </nav>
      )}
      <div className={styles.heading}>
        <div>
          <p className={styles.meta}>
            <span className={styles.code}>{trabajo.codigo}</span>
            {estados.map((estado) => (
              <WorkStatusBadge estado={estado} key={estado} />
            ))}
          </p>
          <h1 className={styles.title}>{trabajo.titulo}</h1>
        </div>
        <div className={styles.actions}>{acciones}</div>
      </div>
    </>
  )
}

export default WorkHeading
