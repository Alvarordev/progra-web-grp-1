import { useState } from 'react'
import Button from '../../../core/ui/Button/Button.jsx'
import BarChartCard from '../components/BarChartCard/BarChartCard.jsx'
import BoardPageLayout from '../components/BoardPageLayout/BoardPageLayout.jsx'
import DonutChartCard from '../components/DonutChartCard/DonutChartCard.jsx'
import KpiList from '../components/KpiList/KpiList.jsx'
import MetricsTabs from '../components/MetricsTabs/MetricsTabs.jsx'
import PageHeading from '../components/PageHeading/PageHeading.jsx'
import { obtenerMetricas } from '../../../core/utils/metricasApi.js'
import { exportMetricsPdf } from '../utils/exportMetricsPdf.js'
import { toAxisData, toIndicators, toStatusData } from '../utils/metrics.js'
import useRemoteData from '../../../core/utils/useRemoteData.js'
import styles from './MetricsPage.module.css'

const TITLE = 'Tablero de métricas'
const AXIS_TITLE = 'Trabajos por eje temático'
const STATUS_TITLE = 'Trabajos por estado'
const STATUS_NOTE =
  'Cada segmento indica también su valor numérico: el color nunca es el único portador de la información.'

function MetricsPage() {
  const { data, loading, error } = useRemoteData(obtenerMetricas)
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState('')

  const description = data
    ? `Edición ${data.edicion.anio} · datos al ${new Date(data.generadoEn).toLocaleDateString('es-PE')}`
    : ''
  const metricIndicators = data ? toIndicators(data.indicadores) : []
  const worksByAxis = data ? toAxisData(data.trabajosPorEje) : []
  const worksByStatus = data ? toStatusData(data.trabajosPorEstado) : []

  async function handleExport() {
    setExporting(true)
    setExportError('')

    try {
      await exportMetricsPdf({
        anio: data.edicion.anio,
        descripcion: description,
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
            disabled={exporting || !data}
            onClick={handleExport}
            type="button"
            variant="secondary"
          >
            {exporting ? 'Generando PDF…' : 'Exportar reporte'}
          </Button>
        }
        descripcion={description}
        titulo={TITLE}
      />
      {exportError && (
        <p className={styles.exportError} role="alert">
          {exportError}
        </p>
      )}
      {(loading || error) && <p role="status">{error || 'Cargando métricas…'}</p>}
      <MetricsTabs />
      {data && (
        <>
          <KpiList indicadores={metricIndicators} />
          <div className={styles.charts}>
            <BarChartCard datos={worksByAxis} titulo={AXIS_TITLE} />
            <DonutChartCard
              datos={worksByStatus}
              nota={STATUS_NOTE}
              titulo={STATUS_TITLE}
            />
          </div>
        </>
      )}
    </BoardPageLayout>
  )
}

export default MetricsPage
