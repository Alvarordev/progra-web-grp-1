import { solicitarApi } from './clienteApi.js'

export const obtenerTrabajos = () => solicitarApi('/trabajos')

export const guardarDecision = (trabajoId, datos) =>
  solicitarApi(`/decisiones/${trabajoId}`, { method: 'PUT', body: datos })

export const aDecisionLocal = decision =>
  decision && {
    resultado: decision.resultado,
    retroalimentacion: decision.retroalimentacion,
    status: decision.estado === 'publicada' ? 'published' : 'draft',
  }

export const aCuerpoDecision = (resultado, retroalimentacion, publicar) => ({
  resultado,
  retroalimentacion,
  estado: publicar ? 'publicada' : 'borrador',
})
