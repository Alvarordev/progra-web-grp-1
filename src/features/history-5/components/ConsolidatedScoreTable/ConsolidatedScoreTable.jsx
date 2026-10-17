import { formatTenth } from '../../utils/scoring.js'
import { getRecommendationLabel } from '../../utils/recommendations.js'
import styles from './ConsolidatedScoreTable.module.css'

const shortLabels = { 'Rigor metodológico': 'Rigor', 'Claridad de la exposición': 'Claridad', 'Relevancia y aporte': 'Relevancia' }

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
              <th scope="col" key={criterio.id} title={criterio.nombre}>
                {shortLabels[criterio.nombre] ?? criterio.nombre} <span className={styles.weight}>{criterio.peso} %</span>
              </th>
            ))}
            <th scope="col">Ponderado</th>
            <th scope="col">Recomendación</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => {
            const estado = fila.pendiente ? 'pendiente' : fila.recomendacion

            return (
              <tr key={fila.revisor}>
                <th scope="row">{fila.revisor}</th>
                {fila.criterios.map((criterio) => (
                  <td key={criterio.id}>{fila.pendiente ? '—' : criterio.puntaje}</td>
                ))}
                <td className={styles.strong}>{fila.pendiente ? '—' : formatTenth(fila.ponderado)}</td>
                <td>
                  <span className={`${styles.badge} ${styles[estado]}`}>
                    {fila.pendiente ? 'Pendiente' : getRecommendationLabel(fila.recomendacion)}
                  </span>
                </td>
              </tr>
            )
          })}
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
