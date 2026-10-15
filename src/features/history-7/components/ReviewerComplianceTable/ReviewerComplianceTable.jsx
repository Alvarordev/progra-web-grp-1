import DataTable from '../DataTable/DataTable.jsx'
import styles from './ReviewerComplianceTable.module.css'

function getCompliance(revisor) {
  return Math.round((revisor.entregadas / revisor.asignadas) * 100)
}

function getComplianceTone(porcentaje) {
  if (porcentaje >= 100) return styles.fillSuccess
  if (porcentaje >= 60) return styles.fillWarning
  return styles.fillDanger
}

function ReviewerComplianceTable({ revisores }) {
  return (
    <DataTable caption="Cumplimiento por revisor">
      <thead>
        <tr>
          <th scope="col">Revisor</th>
          <th data-align="right" scope="col">Asignadas</th>
          <th data-align="right" scope="col">Entregadas</th>
          <th data-align="right" scope="col">Vencidas</th>
          <th data-align="right" scope="col">Tiempo prom.</th>
          <th scope="col">Cumplimiento</th>
        </tr>
      </thead>
      <tbody>
        {revisores.map((revisor) => {
          const porcentaje = getCompliance(revisor)

          return (
            <tr key={revisor.id}>
              <th scope="row">{revisor.nombre}</th>
              <td data-align="right">{revisor.asignadas}</td>
              <td className={styles.delivered} data-align="right">
                {revisor.entregadas}
              </td>
              <td
                className={revisor.vencidas > 0 ? styles.overdue : ''}
                data-align="right"
              >
                {revisor.vencidas}
              </td>
              <td data-align="right">{revisor.tiempo.toFixed(1)} días</td>
              <td>
                <div className={styles.progress}>
                  <span aria-hidden="true" className={styles.track}>
                    <span
                      className={`${styles.fill} ${getComplianceTone(porcentaje)}`}
                      style={{ width: `${porcentaje}%` }}
                    />
                  </span>
                  <span className={styles.value}>{porcentaje} %</span>
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </DataTable>
  )
}

export default ReviewerComplianceTable
