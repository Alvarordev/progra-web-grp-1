import { useId } from 'react'
import { formatDate, toMinutes } from '../../utils/sessionSchedule.js'
import styles from './RoomOccupancy.module.css'

const AXIS_START = toMinutes('09:00')
const AXIS_END = toMinutes('13:00')
const AXIS_RANGE = AXIS_END - AXIS_START

function getBarStyle(sesion) {
  const inicio = Math.max(toMinutes(sesion.horaInicio), AXIS_START)
  const fin = Math.min(toMinutes(sesion.horaFin), AXIS_END)

  return {
    left: `${((inicio - AXIS_START) / AXIS_RANGE) * 100}%`,
    width: `${((fin - inicio) / AXIS_RANGE) * 100}%`,
  }
}

function RoomOccupancy({ fecha, salas, sesiones }) {
  const titleId = useId()
  const sesionesDelDia = sesiones.filter((sesion) => sesion.fecha === fecha)

  return (
    <section aria-labelledby={titleId} className={styles.panel}>
      <h2 className={styles.title} id={titleId}>
        Ocupación de salas · {formatDate(fecha)}
      </h2>
      <ul className={styles.list}>
        {salas.map((sala) => {
          const sesionesDeSala = sesionesDelDia.filter(
            (sesion) => sesion.sala === sala.codigo,
          )

          return (
            <li className={styles.row} key={sala.codigo}>
              <span className={styles.room}>{sala.codigo}</span>
              <span aria-hidden="true" className={styles.track}>
                {sesionesDeSala.map((sesion) => (
                  <span
                    className={styles.bar}
                    key={sesion.id}
                    style={getBarStyle(sesion)}
                  />
                ))}
              </span>
              <span className={styles.time}>
                {sesionesDeSala.length > 0
                  ? sesionesDeSala
                      .map((sesion) => `${sesion.horaInicio}–${sesion.horaFin}`)
                      .join(', ')
                  : 'Libre'}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default RoomOccupancy
