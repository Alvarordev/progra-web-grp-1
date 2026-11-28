import { useId } from 'react'
import { getWorkTimes } from '../../utils/sessionSchedule.js'
import styles from './ProgramSession.module.css'

function ProgramSession({ sesion, trabajos }) {
  const titleId = useId()

  return (
    <article aria-labelledby={titleId} className={styles.session}>
      <header className={styles.heading}>
        <div>
          <h2 className={styles.title} id={titleId}>
            {sesion.nombre}
          </h2>
          <p className={styles.moderator}>
            Moderación: {sesion.moderadorCompleto ?? sesion.moderador}
          </p>
        </div>
        <div className={styles.badges}>
          <span className={styles.time}>
            {sesion.horaInicio} – {sesion.horaFin}
          </span>
          <span className={styles.room}>Sala {sesion.sala}</span>
        </div>
      </header>

      {trabajos.length === 0 ? (
        <p className={styles.empty}>Esta sesión aún no tiene trabajos asignados.</p>
      ) : (
        <ol className={styles.list} role="list">
          {trabajos.map((trabajo, indice) => (
            <li className={styles.row} key={trabajo.codigo}>
              <span className={styles.hour}>
                {getWorkTimes(sesion, indice).horaInicio}
              </span>
              <span className={styles.workTitle}>{trabajo.titulo}</span>
              <span className={styles.authors}>{trabajo.autores}</span>
            </li>
          ))}
        </ol>
      )}
    </article>
  )
}

export default ProgramSession
