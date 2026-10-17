import { useState } from 'react'
import Button from '../../../core/ui/Button/Button.jsx'
import BarChartCard from '../components/BarChartCard/BarChartCard.jsx'
import BoardPageLayout from '../components/BoardPageLayout/BoardPageLayout.jsx'
import DonutChartCard from '../components/DonutChartCard/DonutChartCard.jsx'
import KpiList from '../components/KpiList/KpiList.jsx'
import MetricsTabs from '../components/MetricsTabs/MetricsTabs.jsx'
import PageHeading from '../components/PageHeading/PageHeading.jsx'
import useConference from '../../../core/utils/useConference.js'
import { getPendingReviews } from '../../../core/utils/assignments.js'
import { exportMetricsPdf } from '../utils/exportMetricsPdf.js'
import styles from './MetricsPage.module.css'

const TITLE = 'Tablero de métricas'
const AXIS_TITLE = 'Trabajos por eje temático'
const STATUS_TITLE = 'Trabajos por estado'
const STATUS_NOTE =
  'Cada segmento indica también su valor numérico: el color nunca es el único portador de la información.'

function MetricsPage() {
  const conference = useConference()
  const DESCRIPTION = `Edición 2026 · datos al ${new Date().toLocaleDateString('es-PE')}`
  const accepted = conference.works.filter(work => work.estado === 'Aceptado').length
  const rejected = conference.works.filter(work => work.estado === 'Rechazado').length
  const drafts = conference.works.filter(work => work.estado === 'Borrador').length
  const pending = getPendingReviews(
    conference.works,
    conference.reviewers,
    conference.reviews
  )
  const metricIndicators = [
    {
      etiqueta: 'Trabajos recibidos',
      valor: String(conference.works.length),
      detalle: `${conference.works.length - drafts} enviados · ${drafts} borradores`,
      tono: 'info',
    },
    {
      etiqueta: 'Trabajos aceptados',
      valor: String(accepted),
      detalle: `${rejected} rechazados`,
      tono: 'success',
    },
    {
      etiqueta: 'Tasa de aceptación',
      valor: `${accepted + rejected ? Math.round((accepted / (accepted + rejected)) * 100) : 0} %`,
      detalle: `sobre ${accepted + rejected} trabajos evaluados`,
      tono: 'accent',
    },
    {
      etiqueta: 'Revisiones pendientes',
      valor: String(pending.length),
      detalle: `${pending.filter(item => item.esVencida).length} vencidas`,
      tono: 'warning',
    },
  ]
  const worksByAxis = conference.axes.map(axis => ({
    label: axis.nombre,
    value: conference.works.filter(work => work.eje === axis.nombre).length,
  }))
  const worksByStatus = [
    'Aceptado',
    'Rechazado',
    'En revisión',
    'Enviado',
    'Borrador',
  ].map((status, index) => ({
    label: status,
    value: conference.works.filter(work => work.estado === status).length,
    color: [
      'var(--color-success)',
      'var(--color-danger)',
      'var(--color-warning)',
      'var(--color-info)',
      'var(--color-text-muted)',
    ][index],
  }))

  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState('')

  async function handleExport() {
    setExporting(true)
    setExportError('')

    try {
      await exportMetricsPdf({
        descripcion: DESCRIPTION,
        indicadores: metricIndicators,
        notaEstados: STATUS_NOTE,
        titulo: TITLE,
        tituloEjes: AXIS_TITLE,
        tituloEstados: STATUS_TITLE,
        trabajosPorEje: worksByAxis,
        trabajosPorEstado: worksByStatus,
      })
    } catch {
      setExportError('No se pudo generar el PDF. Inténtelo nuevamente.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <BoardPageLayout rutaActiva="/tablero">
      <PageHeading
        acciones={
          <Button
            disabled={exporting || conference.busy}
            onClick={handleExport}
            type="button"
            variant="secondary"
          >
            {exporting ? 'Generando PDF…' : 'Exportar reporte'}
          </Button>
        }
        descripcion={DESCRIPTION}
        titulo={TITLE}
      />
      {exportError && (
        <p className={styles.exportError} role="alert">
          {exportError}
        </p>
      )}
      {(conference.loading || conference.error) && (
        <p role="status">{conference.error || 'Cargando métricas…'}</p>
      )}
      <MetricsTabs />
      <KpiList indicadores={metricIndicators} />
      <div className={styles.charts}>
        <BarChartCard datos={worksByAxis} titulo={AXIS_TITLE} />
        <DonutChartCard datos={worksByStatus} nota={STATUS_NOTE} titulo={STATUS_TITLE} />
      </div>
    </BoardPageLayout>
  )
}

export default MetricsPage
