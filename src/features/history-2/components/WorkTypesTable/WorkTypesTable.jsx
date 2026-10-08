import Button from '../../../../core/ui/Button/Button.jsx'
import styles from './WorkTypesTable.module.css'

function WorkTypesTable({ alEditar, alEliminar, tiposTrabajo }) {
  return (
    <div
      aria-label="Lista de tipos de trabajo"
      className={styles.tableViewport}
      role="region"
      tabIndex="0"
    >
      <table className={styles.table}>
        <caption className={styles.visuallyHidden}>
          Tipos de trabajo habilitados para esta edición
        </caption>
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Extensión máxima</th>
            <th scope="col">Formato esperado</th>
            <th scope="col">Admite coautores</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tiposTrabajo.map((tipoTrabajo) => (
            <tr key={tipoTrabajo.id}>
              <th className={styles.typeName} scope="row">
                {tipoTrabajo.nombre}
              </th>
              <td>{tipoTrabajo.extensionMaxima}</td>
              <td>{tipoTrabajo.formatoEsperado}</td>
              <td>
                <span
                  className={
                    tipoTrabajo.admiteCoautores
                      ? styles.coauthorsAllowed
                      : styles.coauthorsNotAllowed
                  }
                >
                  {tipoTrabajo.admiteCoautores
                    ? `Sí · hasta ${tipoTrabajo.maxCoautores}`
                    : 'No'}
                </span>
              </td>
              <td>
                <div className={styles.actions}>
                  <Button
                    aria-label={`Editar ${tipoTrabajo.nombre}`}
                    onClick={() => alEditar(tipoTrabajo)}
                    size="small"
                    type="button"
                    variant="tertiary"
                  >
                    Editar
                  </Button>
                  <span aria-hidden="true">·</span>
                  <Button
                    aria-label={`Eliminar ${tipoTrabajo.nombre}`}
                    className={styles.deleteAction}
                    onClick={() => alEliminar(tipoTrabajo.id)}
                    size="small"
                    type="button"
                    variant="tertiary"
                  >
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default WorkTypesTable
