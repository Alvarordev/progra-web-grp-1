import BoardPageLayout from '../components/BoardPageLayout/BoardPageLayout.jsx'
import MetricsTabs from '../components/MetricsTabs/MetricsTabs.jsx'
import PageHeading from '../components/PageHeading/PageHeading.jsx'
import ReviewerComplianceTable from '../components/ReviewerComplianceTable/ReviewerComplianceTable.jsx'
import useConference from '../../../core/utils/useConference.js'
import { getPendingReviews, getReview } from '../../../core/utils/assignments.js'
import styles from './ReviewerCompliancePage.module.css'

const summaryToneClasses = {
  success: styles.success,
  danger: styles.danger,
}

function ReviewerCompliancePage() {
  const conference = useConference()
  const pending = getPendingReviews(conference.works, conference.reviewers, conference.reviews)
  const reviewers = conference.reviewers.map(reviewer => {
    const works = conference.works.filter(work => work.revisoresAsignados.includes(reviewer.id))
    const delivered = works.filter(work => getReview(conference.reviews, reviewer, work.codigo)?.status === 'submitted')
    const times = delivered.flatMap(work => work.assignedAt ? [(new Date(getReview(conference.reviews, reviewer, work.codigo).updatedAt) - new Date(work.assignedAt)) / 86400000] : [])
    return { ...reviewer, asignadas: works.length, entregadas: delivered.length, vencidas: pending.filter(item => item.revisorId === reviewer.id && item.esVencida).length, tiempo: times.length ? times.reduce((sum, time) => sum + Math.max(0, time), 0) / times.length : null }
  }).filter(reviewer => reviewer.asignadas).sort((a, b) => b.entregadas / b.asignadas - a.entregadas / a.asignadas)
  const assigned = reviewers.reduce((sum, reviewer) => sum + reviewer.asignadas, 0)
  const delivered = reviewers.reduce((sum, reviewer) => sum + reviewer.entregadas, 0)
  const complianceSummary = { asignadas: assigned, entregadas: delivered, tiempoPromedio: 'según entregas registradas', indicadores: [
    { etiqueta: 'Cumplimiento global', valor: `${assigned ? Math.round(delivered / assigned * 100) : 0} %`, tono: 'success' },
    { etiqueta: 'Revisiones pendientes', valor: String(pending.length) },
    { etiqueta: 'Revisores con vencidas', valor: `${reviewers.filter(reviewer => reviewer.vencidas).length} de ${conference.reviewers.length}`, tono: 'danger' },
  ] }

  return (
    <BoardPageLayout rutaActiva="/tablero">
      <PageHeading
        acciones={<MetricsTabs enEncabezado />}
        descripcion={`${complianceSummary.asignadas} revisiones asignadas · ${complianceSummary.entregadas} entregadas · tiempo promedio ${complianceSummary.tiempoPromedio}`}
        titulo="Cumplimiento por revisor"
      />
      {(conference.loading || conference.error) && <p role="status">{conference.error || 'Cargando cumplimiento…'}</p>}
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