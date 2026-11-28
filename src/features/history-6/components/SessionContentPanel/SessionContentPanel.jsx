import { useId } from 'react'
import Button from '../../../../core/ui/Button/Button.jsx'
import { WORK_MINUTES, getWorkTimes } from '../../utils/sessionSchedule.js'
import styles from './SessionContentPanel.module.css'

function SessionContentPanel({
  alBajar,
  alQuitar,
  alSubir,
  capacidad,
  sesion,
  trabajos,
}) {
  const titleId = useId()
  const siguienteHorario = getWorkTimes(sesion, trabajos.length)
  const hayEspacio = trabajos.length < capacidad

  return (
    <section aria-labelledby={titleId} className={styles.panel}>
      <header className={styles.heading}>
        <h2 className={styles.title} id={titleId}>
          Contenido de la sesión
        </h2>
        <span className={styles.count}>
          {trabajos.length} de {capacidad} espacios · {WORK_MINUTES} min por trabajo
        </span>
      </header>

      <ol className={styles.list} role="list">
        {trabajos.map((trabajo, indice) => {
          const horario = getWorkTimes(sesion, indice)

          return (
            <li className={styles.item} key={trabajo.codigo}>
              <span aria-hidden="true" className={styles.position}>
                {indice + 1}
              </span>
              <div className={styles.details}>
                <h3 className={styles.workTitle}>{trabajo.titulo}</h3>
                <span className={styles.meta}>
                  {trabajo.codigo} · {horario.horaInicio} – {horario.horaFin}
                </span>
              </div>
              <div className={styles.controls}>
                <div className={styles.moveControls}>
                  <Button
                    aria-label={`Subir ${trabajo.titulo}`}
                    disabled={indice === 0}
                    onClick={() => alSubir(indice)}
                    size="small"
                    type="button"
                    variant="tertiary"
                  >
                    <span aria-hidden="true">▲ </span>Subir
                  </Button>
                  <Button
                    aria-label={`Bajar ${trabajo.titulo}`}
                    disabled={indice === trabajos.length - 1}
                    onClick={() => alBajar(indice)}
                    size="small"
                    type="button"
                    variant="tertiary"
                  >
                    <span aria-hidden="true">▼ </span>Bajar
                  </Button>
                </div>
                <Button
                  aria-label={`Quitar ${trabajo.titulo} de la sesión`}
                  onClick={() => alQuitar(trabajo)}
                  size="small"
                  type="button"
                  variant="tertiary"
                >
                  Quitar
                </Button>
              </div>
            </li>
          )
        })}
      </ol>

      {hayEspacio && (
        <div className={styles.freeSlot}>
          <p className={styles.freeSlotTitle}>
            Espacio disponible · {siguienteHorario.horaInicio} –{' '}
            {siguienteHorario.horaFin}
          </p>
          <p className={styles.freeSlotHint}>
            Agregue un trabajo desde la lista de la izquierda
          </p>
        </div>
      )}
    </section>
  )
}

export default SessionContentPanel
