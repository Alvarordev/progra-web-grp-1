import Button from '../../../core/ui/Button/Button.jsx'
import BarChartCard from '../components/BarChartCard/BarChartCard.jsx'
import BoardPageLayout from '../components/BoardPageLayout/BoardPageLayout.jsx'
import DonutChartCard from '../components/DonutChartCard/DonutChartCard.jsx'
import KpiList from '../components/KpiList/KpiList.jsx'
import MetricsTabs from '../components/MetricsTabs/MetricsTabs.jsx'
import PageHeading from '../components/PageHeading/PageHeading.jsx'
import {
  metricIndicators,
  worksByAxis,
  worksByStatus,
} from '../data/congressData.js'
import styles from './MetricsPage.module.css'

function MetricsPage() {
  return (
    <BoardPageLayout rutaActiva="/tablero">
      <PageHeading
        acciones={
          <Button type="button" variant="secondary">
            Exportar reporte
          </Button>
        }
        descripcion="Edición 2026 · datos al 28/10/2026"
        titulo="Tablero de métricas"
      />
      <MetricsTabs />
      <KpiList indicadores={metricIndicators} />
      <div className={styles.charts}>
        <BarChartCard datos={worksByAxis} titulo="Trabajos por eje temático" />
        <DonutChartCard
          datos={worksByStatus}
          nota="Cada segmento indica también su valor numérico: el color nunca es el único portador de la información."
          titulo="Trabajos por estado"
        />
      </div>
    </BoardPageLayout>
  )
}

export default MetricsPage
