import Button from '../../../../core/ui/Button/Button.jsx'
import DataTable from '../DataTable/DataTable.jsx'
import styles from './UsersTable.module.css'

const roleClasses = {
  Autor: styles.roleAuthor,
  Revisor: styles.roleReviewer,
  Comité: styles.roleCommittee,
}

function getRoleLabel(usuario) {
  return usuario.femenino && usuario.rol !== 'Comité'
    ? `${usuario.rol}a`
    : usuario.rol
}

function getStatusLabel(usuario) {
  if (usuario.bloqueado) return 'Bloqueado'
  return usuario.femenino ? 'Activa' : 'Activo'
}

function UsersTable({ alBloquear, alReactivar, usuarios }) {
  return (
    <DataTable caption="Listado de usuarios">
      <thead>
        <tr>
          <th scope="col">Usuario</th>
          <th scope="col">Rol</th>
          <th scope="col">Institución</th>
          <th scope="col">Trabajos / Revisiones</th>
          <th scope="col">Estado</th>
          <th data-align="right" scope="col">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.length === 0 && (
          <tr>
            <td colSpan={6}>
              <p className={styles.empty}>
                No se encontraron usuarios con esos filtros.
              </p>
            </td>
          </tr>
        )}
        {usuarios.map((usuario) => (
          <tr className={usuario.bloqueado ? styles.blocked : ''} key={usuario.id}>
            <th scope="row">
              <span className={styles.userName}>{usuario.nombre}</span>
              <span className={styles.userMail}>{usuario.correo}</span>
            </th>
            <td>
              <span className={`${styles.roleTag} ${roleClasses[usuario.rol]}`}>
                {getRoleLabel(usuario)}
              </span>
            </td>
            <td>{usuario.institucion}</td>
            <td>{usuario.actividad}</td>
            <td
              className={usuario.bloqueado ? styles.statusBlocked : styles.statusActive}
            >
              {getStatusLabel(usuario)}
            </td>
            <td data-align="right">
              <div className={styles.actions}>
                <Button size="small" type="button" variant="tertiary">
                  Editar
                </Button>
                {usuario.rol !== 'Comité' &&
                  (usuario.bloqueado ? (
                    <Button
                      onClick={() => alReactivar(usuario)}
                      size="small"
                      type="button"
                      variant="tertiary"
                    >
                      Reactivar
                    </Button>
                  ) : (
                    <Button
                      onClick={() => alBloquear(usuario)}
                      size="small"
                      type="button"
                      variant="tertiary"
                    >
                      Bloquear
                    </Button>
                  ))}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  )
}

export default UsersTable
