import { solicitarApi } from './clienteApi.js'

export const obtenerTrabajos = () => solicitarApi('/trabajos')

/* Dictámenes publicados de los trabajos del autor, con puntaje y comentarios. */
export const obtenerMisDecisiones = () => solicitarApi('/decisiones')

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

/* Dictamen publicado de un autor en el formato de las pantallas de la Historia 3. */
export const aDecisionAutor = decision => ({
  resultado: decision.resultado,
  retroalimentacion: decision.retroalimentacion,
  status: decision.estado === 'publicada' ? 'published' : 'draft',
  updatedAt: decision.fechaPublicacion,
  promedio: decision.detalle?.promedio ?? '—',
  puntajes: decision.detalle?.puntajes ?? [],
  revisiones: decision.detalle?.revisiones ?? [],
})
