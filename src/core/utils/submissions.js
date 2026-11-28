export { receptionIsOpen } from './reception.js'

const stateValues = {
  Borrador: 'borrador',
  Enviado: 'enviado',
  'En revisión': 'revision',
  Aceptado: 'aceptado',
  Rechazado: 'rechazado',
}
export const emptySubmission = {
  titulo: '',
  tipo: '',
  eje: '',
  resumen: '',
  palabrasClave: [],
  enlace: '',
  autores: [],
}

function getSubmissionState(work, decision) {
  if (decision?.status === 'published') {
    return decision.resultado === 'aceptar' ? 'aceptado' : 'rechazado'
  }
  return stateValues[work.estado] ?? 'enviado'
}

export function toSubmission(work, decision) {
  const detail = work.details ?? {}
  const published = decision?.status === 'published'
  return {
    ...emptySubmission,
    ...detail,
    codigo: work.codigo,
    titulo: work.titulo,
    tipo: work.tipo,
    eje: work.eje,
    estado: getSubmissionState(work, decision),
    enlace: work.documentUrl || detail.enlace || '',
    autores:
      detail.autores ??
      work.autores.map(nombre => ({
        nombre,
        institucion: work.institucion,
        rol: 'Coautor',
      })),
    firmantes: work.autores.join(', '),
    fecha:
      detail.fecha ?? (work.estado === 'Borrador' ? 'No enviado' : 'Enviado al comité'),
    ...(published
      ? {
          dictamen: {
            resultado: decision.resultado === 'aceptar' ? 'aceptado' : 'rechazado',
            publicado: new Date(decision.updatedAt).toLocaleDateString('es-PE'),
            titulo:
              decision.resultado === 'aceptar'
                ? 'Trabajo aceptado para presentación oral'
                : 'Trabajo no aceptado en esta edición',
            detalle: decision.retroalimentacion,
            promedio: decision.promedio ?? '—',
            puntajes: decision.puntajes ?? [],
            revisiones: decision.revisiones ?? [],
          },
        }
      : {}),
  }
}
