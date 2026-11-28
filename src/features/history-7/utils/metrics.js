const STATUS_COLORS = {
  Aceptado: 'var(--color-success)',
  Rechazado: 'var(--color-danger)',
  'En revisión': 'var(--color-warning)',
  Enviado: 'var(--color-info)',
  Borrador: 'var(--color-text-muted)',
}

export function toIndicators(indicadores) {
  return [
    {
      etiqueta: 'Trabajos recibidos',
      valor: String(indicadores.trabajosRecibidos),
      detalle: `${indicadores.enviados} enviados · ${indicadores.borradores} borradores`,
      tono: 'info',
    },
    {
      etiqueta: 'Trabajos aceptados',
      valor: String(indicadores.aceptados),
      detalle: `${indicadores.rechazados} rechazados`,
      tono: 'success',
    },
    {
      etiqueta: 'Tasa de aceptación',
      valor: `${indicadores.tasaAceptacion} %`,
      detalle: `sobre ${indicadores.evaluados} trabajos evaluados`,
      tono: 'accent',
    },
    {
      etiqueta: 'Revisiones pendientes',
      valor: String(indicadores.revisionesPendientes),
      detalle: `${indicadores.revisionesVencidas} vencidas`,
      tono: 'warning',
    },
  ]
}

export const toAxisData = trabajosPorEje =>
  trabajosPorEje.map(item => ({ label: item.eje, value: item.total }))

export const toStatusData = trabajosPorEstado =>
  trabajosPorEstado.map(item => ({
    label: item.estado,
    value: item.total,
    color: STATUS_COLORS[item.estado],
  }))

export function formatAverageDays(dias) {
  return dias === null ? 'sin entregas registradas' : `${dias.toFixed(1)} días`
}
