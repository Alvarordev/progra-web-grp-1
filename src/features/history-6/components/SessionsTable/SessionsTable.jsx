import { Link } from 'react-router'
import Button from '../../../../core/ui/Button/Button.jsx'
import { formatDate } from '../../utils/sessionSchedule.js'
import styles from './SessionsTable.module.css'

function SessionsTable({ alEditar, idsEnConflicto, sesiones }) {
  return (
    <div
      aria-label="Lista de sesiones del congreso"
      className={styles.tableViewport}
      role="region"
      tabIndex="0"
    >
      <table className={styles.table}>
        <caption className={styles.visuallyHidden}>
          Sesiones programadas para esta edición
        </caption>
        <thead>
          <tr>
            <th scope="col">Sesión</th>
            <th scope="col">Eje</th>
            <th scope="col">Fecha</th>
            <th scope="col">Hora</th>
            <th scope="col">Sala</th>
            <th scope="col">Moderador</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sesiones.map((sesion) => {
            const enConflicto = idsEnConflicto.has(sesion.id)

            return (
              <tr
                className={enConflicto ? styles.conflict : undefined}
                key={sesion.id}
              >
                <th className={styles.sessionName} scope="row">
                  {sesion.nombre}
                  {enConflicto && (
                    <span className={styles.visuallyHidden}>
                      {' '}
                      (solapamiento de sala)
                    </span>
                  )}
                </th>
                <td>{sesion.eje}</td>
                <td>{formatDate(sesion.fecha)}</td>
                <td className={enConflicto ? styles.conflictValue : undefined}>
                  {sesion.horaInicio} – {sesion.horaFin}
                </td>
                <td className={enConflicto ? styles.conflictValue : undefined}>
                  {sesion.sala}
                </td>
                <td>{sesion.moderador}</td>
                <td>
                  <div className={styles.actions}>
                    <Button
                      aria-label={`Editar ${sesion.nombre}`}
                      onClick={() => alEditar(sesion)}
                      size="small"
                      type="button"
                      variant="tertiary"
                    >
                      Editar
                    </Button>
                    <span aria-hidden="true">·</span>
                    <Link
                      aria-label={`Asignar trabajos a ${sesion.nombre}`}
                      className={styles.actionLink}
                      to={`/programa/asignar-trabajos?sesion=${sesion.id}`}
                    >
                      Trabajos
                    </Link>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default SessionsTable
