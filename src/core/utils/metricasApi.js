import { solicitarApi } from './clienteApi.js'

export const obtenerMetricas = () => solicitarApi('/metricas')

export const obtenerCumplimientoRevisores = () =>
  solicitarApi('/metricas/cumplimiento_revisores')
