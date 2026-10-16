import { formatTenth } from '../../utils/scoring.js'
import styles from './ConsolidatedKpis.module.css'

function formatDay(fecha) {
  return fecha.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit' })
}

function ConsolidatedKpis({ resumen }) {
  const indicadores = [
    {
      etiqueta: 'Puntaje promedio',
      valor: formatTenth(resumen.promedioGeneral),
      detalle: 'de 20',
    },
    {
      etiqueta: 'Dispersión',
      valor: formatTenth(resumen.dispersion),
      detalle: 'diferencia máx.',
    },
    {
      etiqueta: 'Recomiendan aceptar',
      valor: `${resumen.recomiendanAceptar} de ${resumen.totalRevisiones}`,
      detalle: `${resumen.conObservaciones} con observaciones`,
    },
    {
      etiqueta: 'Última entrega',
      valor: resumen.ultimaEntrega ? formatDay(resumen.ultimaEntrega) : '—',
      detalle: resumen.ultimaEntrega ? String(resumen.ultimaEntrega.getFullYear()) : '',
    },
  ]

  return (
    <section className={styles.kpis} aria-label="Indicadores de la revisión">
      {indicadores.map((indicador) => (
        <div className={styles.kpi} key={indicador.etiqueta}>
          <span className={styles.label}>{indicador.etiqueta}</span>
          <strong>{indicador.valor}</strong>
          <small>{indicador.detalle}</small>
        </div>
      ))}
    </section>
  )
}

export default ConsolidatedKpis
