import { useId } from 'react'
import styles from './ProgramSummary.module.css'

function ProgramSummary({ asignados, sinSesion, total }) {
  const titleId = useId()

  return (
    <section aria-labelledby={titleId} className={styles.panel}>
      <h2 className={styles.title} id={titleId}>
        Resumen del programa
      </h2>
      <dl className={styles.list}>
        <div>
          <dt>Trabajos aceptados</dt>
          <dd>{total}</dd>
        </div>
        <div>
          <dt>Asignados a una sesión</dt>
          <dd className={styles.assigned}>{asignados}</dd>
        </div>
        <div>
          <dt>Sin sesión</dt>
          <dd className={styles.unassigned}>{sinSesion}</dd>
        </div>
      </dl>
      <p className={styles.note}>
        El servidor valida que no se solapen la sala ni la persona moderadora de dos
        sesiones.
      </p>
    </section>
  )
}

export default ProgramSummary
