import { useId } from 'react'
import { formatDate, toMinutes } from '../../utils/sessionSchedule.js'
import styles from './RoomOccupancy.module.css'

const DEFAULT_START = toMinutes('09:00')
const DEFAULT_END = toMinutes('13:00')

/* El eje cubre al menos 09:00–13:00 y se amplía por horas completas si hay sesiones fuera. */
function getAxis(sesiones) {
  const inicios = sesiones.map(sesion => toMinutes(sesion.horaInicio))
  const fines = sesiones.map(sesion => toMinutes(sesion.horaFin))
  const inicio = Math.floor(Math.min(DEFAULT_START, ...inicios) / 60) * 60
  const fin = Math.ceil(Math.max(DEFAULT_END, ...fines) / 60) * 60

  return { inicio, rango: fin - inicio }
}

function getBarStyle(sesion, eje) {
  return {
    left: `${((toMinutes(sesion.horaInicio) - eje.inicio) / eje.rango) * 100}%`,
    width: `${((toMinutes(sesion.horaFin) - toMinutes(sesion.horaInicio)) / eje.rango) * 100}%`,
  }
}

function RoomOccupancy({ fecha, salas, sesiones }) {
  const titleId = useId()
  const sesionesDelDia = sesiones.filter(sesion => sesion.fecha === fecha)
  const eje = getAxis(sesionesDelDia)

  return (
    <section aria-labelledby={titleId} className={styles.panel}>
      <h2 className={styles.title} id={titleId}>
        Ocupación de salas · {formatDate(fecha)}
      </h2>
      <ul className={styles.list}>
        {salas.map(sala => {
          const sesionesDeSala = sesionesDelDia.filter(
            sesion => sesion.sala === sala.codigo
          )

          return (
            <li className={styles.row} key={sala.codigo}>
              <span className={styles.room}>{sala.codigo}</span>
              <span aria-hidden="true" className={styles.track}>
                {sesionesDeSala.map(sesion => (
                  <span
                    className={styles.bar}
                    key={sesion.id}
                    style={getBarStyle(sesion, eje)}
                  />
                ))}
              </span>
              <span className={styles.time}>
                {sesionesDeSala.length > 0
                  ? sesionesDeSala
                      .map(sesion => `${sesion.horaInicio}–${sesion.horaFin}`)
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
