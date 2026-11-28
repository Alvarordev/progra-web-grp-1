import { crearCacheRemota, useCacheRemota } from './cacheRemota.js'
import { solicitarApi } from './clienteApi.js'

const vigenciaEdicion = 5 * 60_000
const limaTime = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Lima',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

function leerEdicionConfigurada() {
  const configured = import.meta.env.VITE_EDICION_ID?.trim()
  if (!configured) {
    return null
  }
  if (!/^[1-9]\d*$/.test(configured)) {
    throw new Error('VITE_EDICION_ID debe ser un ID de edición válido.')
  }
  return Number(configured)
}

export const edicionActual = crearCacheRemota(async () => {
  const configurada = leerEdicionConfigurada()
  if (configurada) {
    return solicitarApi(`/ediciones/${configurada}`)
  }
  const [vigente] = await solicitarApi('/ediciones')
  if (!vigente) {
    throw new Error('Configure una edición del congreso en el backend.')
  }
  return vigente
}, vigenciaEdicion)

export async function obtenerEdicionId() {
  return leerEdicionConfigurada() ?? (await edicionActual.leer()).id
}

async function getEditionPath() {
  return `/ediciones/${await obtenerEdicionId()}`
}

function formatLocalTime(value) {
  const parts = Object.fromEntries(
    limaTime.formatToParts(new Date(value)).map(({ type, value }) => [type, value])
  )
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`
}

const selectEdition = ({ nombre, anio, sede, descripcion }) => ({
  editionName: nombre,
  editionYear: String(anio),
  editionVenue: sede,
  editionDescription: descripcion,
})
const selectStatus = ({ estado }) => estado
const selectSchedule = ({ cierreRecepcion, cierreRevision, publicacion }) => ({
  reception: formatLocalTime(cierreRecepcion),
  review: formatLocalTime(cierreRevision),
  publication: formatLocalTime(publicacion),
})

function mapEdition(select, toPatch) {
  return {
    subscribe: edicionActual.suscribir,
    async get() {
      return select(await edicionActual.leer())
    },
    async save(value) {
      const updated = await solicitarApi(await getEditionPath(), {
        method: 'PATCH',
        body: toPatch(value),
      })
      return select(edicionActual.fijar(updated))
    },
    async remove() {
      throw new Error('La edición se administra desde el backend.')
    },
  }
}

function mapCatalog(resource, fields) {
  const endpoint = async () => `${await getEditionPath()}/${resource}`
  const payload = item => Object.fromEntries(fields.map(field => [field, item[field]]))
  const read = async () =>
    (await solicitarApi(await endpoint())).map(item => ({
      ...item,
      id: String(item.id),
    }))
  const cache = crearCacheRemota(read, vigenciaEdicion)

  return {
    get: cache.leer,
    subscribe: cache.suscribir,
    async save(value, previous) {
      const before = new Map((previous ?? (await cache.leer())).map(item => [item.id, item]))
      const after = new Map(value.map(item => [item.id, item]))
      const changes = []
      for (const [id, item] of after) {
        const oldItem = before.get(id)
        if (!oldItem) {
          changes.push({ method: 'POST', body: payload(item) })
        } else if (fields.some(field => item[field] !== oldItem[field])) {
          changes.push({ id, method: 'PUT', body: payload(item) })
        }
      }
      for (const id of before.keys()) {
        if (!after.has(id)) {
          changes.push({ id, method: 'DELETE' })
        }
      }

      if (changes.length > 1) {
        throw new Error('Guarde un cambio del catálogo a la vez.')
      }
      if (!changes.length) {
        return cache.leer()
      }
      const { id, method, body } = changes[0]
      const path = await endpoint()
      await solicitarApi(id ? `${path}/${encodeURIComponent(id)}` : path, {
        method,
        body,
      })
      return cache.fijar(await read())
    },
    async remove() {
      throw new Error('Elimine cada elemento del catálogo desde su pantalla.')
    },
  }
}

export function useEdicionActual() {
  const { valor, cargando, error } = useCacheRemota(edicionActual)
  return {
    edition: valor ? selectEdition(valor) : null,
    status: valor ? selectStatus(valor) : '',
    schedule: valor ? selectSchedule(valor) : {},
    loading: cargando,
    error,
  }
}

export const editionRepository = mapEdition(
  selectEdition,
  ({ editionName, editionYear, editionVenue, editionDescription }) => ({
    nombre: editionName,
    anio: Number(editionYear),
    sede: editionVenue,
    descripcion: editionDescription,
  })
)

export const editionStatusRepository = mapEdition(selectStatus, estado => ({ estado }))

export const scheduleRepository = mapEdition(
  selectSchedule,
  ({ reception, review, publication }) => ({
    cierreRecepcion: `${reception}:00-05:00`,
    cierreRevision: `${review}:00-05:00`,
    publicacion: `${publication}:00-05:00`,
  })
)

export const thematicAxesRepository = mapCatalog('ejes_tematicos', [
  'nombre',
  'descripcion',
  'responsable',
])
export const workTypesRepository = mapCatalog('tipos_trabajo', [
  'nombre',
  'extensionMaxima',
  'formatoEsperado',
  'admiteCoautores',
  'maxCoautores',
])
export const criteriaRepository = mapCatalog('criterios', [
  'nombre',
  'descripcion',
  'peso',
])
