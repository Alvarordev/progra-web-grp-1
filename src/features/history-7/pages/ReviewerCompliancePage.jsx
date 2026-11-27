import BoardPageLayout from '../components/BoardPageLayout/BoardPageLayout.jsx'
import MetricsTabs from '../components/MetricsTabs/MetricsTabs.jsx'
import PageHeading from '../components/PageHeading/PageHeading.jsx'
import ReviewerComplianceTable from '../components/ReviewerComplianceTable/ReviewerComplianceTable.jsx'
import { obtenerCumplimientoRevisores } from '../../../core/utils/metricasApi.js'
import { formatAverageDays } from '../utils/metrics.js'
import useRemoteData from '../utils/useRemoteData.js'
import styles from './ReviewerCompliancePage.module.css'

const summaryToneClasses = {
  success: styles.success,
  danger: styles.danger,
}

function buildSummaryIndicators(resumen) {
  return [
    {
      etiqueta: 'Cumplimiento global',
      valor: `${resumen.cumplimientoGlobal} %`,
      tono: 'success',
    },
    {
      etiqueta: 'Tiempo promedio de entrega',
      valor: formatAverageDays(resumen.tiempoPromedioDias),
    },
    {
      etiqueta: 'Revisores con vencidas',
      valor: `${resumen.revisoresConVencidas} de ${resumen.totalRevisores}`,
      tono: 'danger',
    },
  ]
}

function ReviewerCompliancePage() {
  const { data, loading, error } = useRemoteData(obtenerCumplimientoRevisores)
  const resumen = data?.resumen
  const description = resumen
    ? `${resumen.asignadas} revisiones asignadas · ${resumen.entregadas} entregadas · tiempo promedio ${formatAverageDays(resumen.tiempoPromedioDias)}`
    : ''

  return (
    <BoardPageLayout rutaActiva="/tablero">
      <PageHeading
        acciones={<MetricsTabs enEncabezado />}
        descripcion={description}
        titulo="Cumplimiento por revisor"
      />
      {(loading || error) && <p role="status">{error || 'Cargando cumplimiento…'}</p>}
      {data && (
        <>
          <ReviewerComplianceTable revisores={data.revisores} />
          <ul className={styles.summary}>
            {buildSummaryIndicators(resumen).map(indicador => (
              <li className={styles.item} key={indicador.etiqueta}>
                <span className={styles.label}>{indicador.etiqueta}</span>
                <strong className={summaryToneClasses[indicador.tono]}>
                  {indicador.valor}
                </strong>
              </li>
            ))}
          </ul>
        </>
      )}
    </BoardPageLayout>
  )
}

export default ReviewerCompliancePage
