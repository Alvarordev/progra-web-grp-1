import { aRevisionLocal } from '../../../core/utils/revisionesApi.js'

function fechaCorta(fechaIso) {
  return fechaIso ? fechaIso.slice(0, 10).split('-').reverse().join('/') : '—'
}

export function aTrabajoEvaluacion(revision) {
  return {
    title: revision.trabajo.titulo,
    eje: revision.trabajo.eje,
    tipo: revision.trabajo.tipo,
    resumen:
      revision.trabajo.resumen ||
      'Consulte el documento del trabajo para realizar la evaluación.',
    fechaLimite: fechaCorta(revision.fechaLimite),
    documentUrl: revision.trabajo.documentUrl ?? null,
  }
}

export function aDatosConsolidado(revisiones, codigo) {
  const delTrabajo = revisiones.filter(revision => revision.trabajo.codigo === codigo)
  const revisionesLocales = delTrabajo.map(aRevisionLocal)
  const criterios = new Map()
  revisionesLocales.forEach(revision =>
    revision.criteria.forEach(criterio => criterios.set(criterio.id, criterio))
  )
  return {
    trabajo: delTrabajo[0]?.trabajo ?? null,
    revisores: delTrabajo.map(revision => ({
      id: revision.revisor.id,
      nombre: revision.revisor.nombre,
    })),
    reviews: Object.fromEntries(
      delTrabajo.map((revision, indice) => [
        `${revision.revisor.id}:${codigo}`,
        revisionesLocales[indice],
      ])
    ),
    criteria: [...criterios.values()].map(({ id, nombre, peso }) => ({
      id,
      nombre,
      peso,
    })),
  }
}
