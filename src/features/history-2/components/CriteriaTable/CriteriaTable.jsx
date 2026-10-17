import Button from '../../../../core/ui/Button/Button.jsx'
import styles from './CriteriaTable.module.css'

function CriteriaTable({ criterios, alEditar, alEliminar, deshabilitado }) {
  const total = criterios.reduce((sum, item) => sum + item.peso, 0)
  return (
    <div
      className={styles.tableViewport}
      role="region"
      aria-label="Criterios de evaluación"
      tabIndex="0"
    >
      <table className={styles.table}>
        <caption className={styles.visuallyHidden}>
          Criterios y pesos de la evaluación
        </caption>
        <thead>
          <tr>
            <th scope="col">Criterio</th>
            <th scope="col">Descripción</th>
            <th scope="col">Peso</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {criterios.map(item => (
            <tr key={item.id}>
              <th scope="row">{item.nombre}</th>
              <td>{item.descripcion}</td>
              <td>{item.peso} %</td>
              <td>
                <div className={styles.actions}>
                  <Button
                    variant="tertiary"
                    size="small"
                    disabled={deshabilitado}
                    aria-label={`Editar ${item.nombre}`}
                    onClick={() => alEditar(item)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="tertiary"
                    size="small"
                    disabled={deshabilitado}
                    aria-label={`Eliminar ${item.nombre}`}
                    onClick={() => alEliminar(item.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" colSpan={2}>
              Total
            </th>
            <td>{total} %</td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default CriteriaTable
