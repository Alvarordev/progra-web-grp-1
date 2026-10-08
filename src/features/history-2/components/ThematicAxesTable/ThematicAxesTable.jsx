import Button from '../../../../core/ui/Button/Button.jsx'
import styles from './ThematicAxesTable.module.css'

function ThematicAxesTable({ alEditar, alEliminar, ejes }) {
  return (
    <div
      aria-label="Lista de ejes temáticos"
      className={styles.tableViewport}
      role="region"
      tabIndex="0"
    >
      <table className={styles.table}>
        <caption className={styles.visuallyHidden}>
          Ejes temáticos configurados para esta edición
        </caption>
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Descripción</th>
            <th scope="col">Responsable</th>
            <th scope="col">Trabajos</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ejes.map((eje) => (
            <tr key={eje.id}>
              <th className={styles.axisName} scope="row">
                {eje.nombre}
              </th>
              <td className={styles.description}>{eje.descripcion}</td>
              <td className={styles.owner}>{eje.responsable}</td>
              <td className={styles.workCount}>{eje.trabajos}</td>
              <td>
                <div className={styles.actions}>
                  <Button
                    aria-label={`Editar ${eje.nombre}`}
                    onClick={() => alEditar(eje)}
                    size="small"
                    type="button"
                    variant="tertiary"
                  >
                    Editar
                  </Button>
                  <span aria-hidden="true">·</span>
                  <Button
                    aria-label={`Eliminar ${eje.nombre}`}
                    className={styles.deleteAction}
                    onClick={() => alEliminar(eje)}
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

export default ThematicAxesTable
