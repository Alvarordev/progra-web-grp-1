import { formatTenth } from '../../utils/scoring.js'
import { getRecommendationLabel } from '../../utils/recommendations.js'
import styles from './ConsolidatedScoreTable.module.css'

function ConsolidatedScoreTable({ filas, criteriosPromedio, promedioGeneral }) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <caption className={styles.visuallyHidden}>
          Puntajes de cada revisor por criterio, con su promedio ponderado y su recomendación
        </caption>
        <thead>
          <tr>
            <th scope="col">Revisor</th>
            {criteriosPromedio.map((criterio) => (
              <th scope="col" key={criterio.id}>
                {criterio.nombre} <span className={styles.weight}>{criterio.peso} %</span>
              </th>
            ))}
            <th scope="col">Ponderado</th>
            <th scope="col">Recomendación</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={fila.revisor}>
              <th scope="row">{fila.revisor}</th>
              {fila.criterios.map((criterio) => (
                <td key={criterio.id}>{criterio.puntaje}</td>
              ))}
              <td className={styles.strong}>{formatTenth(fila.ponderado)}</td>
              <td>
                <span className={`${styles.badge} ${styles[fila.recomendacion]}`}>
                  {getRecommendationLabel(fila.recomendacion)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">Promedio por criterio</th>
            {criteriosPromedio.map((criterio) => (
              <td key={criterio.id}>{formatTenth(criterio.promedio)}</td>
            ))}
            <td className={styles.strong}>{formatTenth(promedioGeneral)}</td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default ConsolidatedScoreTable
