import BoardPageLayout from '../components/BoardPageLayout/BoardPageLayout.jsx'
import MetricsTabs from '../components/MetricsTabs/MetricsTabs.jsx'
import PageHeading from '../components/PageHeading/PageHeading.jsx'
import ReviewerComplianceTable from '../components/ReviewerComplianceTable/ReviewerComplianceTable.jsx'
import { complianceSummary, reviewers } from '../data/congressData.js'
import styles from './ReviewerCompliancePage.module.css'

const summaryToneClasses = {
  success: styles.success,
  danger: styles.danger,
}

function ReviewerCompliancePage() {
  return (
    <BoardPageLayout rutaActiva="/tablero">
      <PageHeading
        descripcion={`${complianceSummary.asignadas} revisiones asignadas · ${complianceSummary.entregadas} entregadas · tiempo promedio ${complianceSummary.tiempoPromedio}`}
        titulo="Cumplimiento por revisor"
      />
      <MetricsTabs />
      <ReviewerComplianceTable revisores={reviewers} />
      <ul className={styles.summary}>
        {complianceSummary.indicadores.map((indicador) => (
          <li className={styles.item} key={indicador.etiqueta}>
            <span className={styles.label}>{indicador.etiqueta}</span>
            <strong className={summaryToneClasses[indicador.tono]}>
              {indicador.valor}
            </strong>
          </li>
        ))}
      </ul>
    </BoardPageLayout>
  )
}

export default ReviewerCompliancePage
