import { requestConference } from './conferenceApi.js'

const editionReads = new Set()
const limaTime = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Lima',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

let editionIdRequest

/* ID de la edición con la que trabaja la aplicación: VITE_EDICION_ID o la de mayor año. */
export async function obtenerEdicionId() {
  const configured = import.meta.env.VITE_EDICION_ID?.trim()
  if (configured) {
    if (!/^[1-9]\d*$/.test(configured)) {
      throw new Error('VITE_EDICION_ID debe ser un ID de edición válido.')
    }
    return Number(configured)
  }

  editionIdRequest ??= requestConference('/ediciones')
    .then(editions => {
      if (!editions.length) {
        throw new Error('Configure una edición del congreso en el backend.')
      }
      return editions[0].id
    })
    .catch(cause => {
      editionIdRequest = undefined
      throw cause
    })
  return editionIdRequest
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

function mapEdition(select, toPatch) {
  return {
    subscribe(listener) {
      editionReads.add(listener)
      return () => editionReads.delete(listener)
    },
    async get() {
      return select(await requestConference(await getEditionPath()))
    },
    async save(value) {
      const updated = await requestConference(await getEditionPath(), {
        method: 'PATCH',
        body: toPatch(value),
      })
      editionReads.forEach(listener => listener())
      return select(updated)
    },
    async remove() {
      throw new Error('La edición se administra desde el backend.')
    },
  }
}

function mapCatalog(resource, fields) {
  const listeners = new Set()
  const endpoint = async () => `${await getEditionPath()}/${resource}`
  const payload = item => Object.fromEntries(fields.map(field => [field, item[field]]))
  const read = async () =>
    (await requestConference(await endpoint())).map(item => ({
      ...item,
      id: String(item.id),
    }))

  return {
    get: read,
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    async save(value, previous) {
      const before = new Map((previous ?? (await read())).map(item => [item.id, item]))
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
      if (changes.length) {
        const { id, method, body } = changes[0]
        const path = await endpoint()
        await requestConference(id ? `${path}/${encodeURIComponent(id)}` : path, {
          method,
          body,
        })
        listeners.forEach(listener => listener())
      }
      return read()
    },
    async remove() {
      throw new Error('Elimine cada elemento del catálogo desde su pantalla.')
    },
  }
}

export const editionRepository = mapEdition(
  ({ nombre, anio, sede, descripcion }) => ({
    editionName: nombre,
    editionYear: String(anio),
    editionVenue: sede,
    editionDescription: descripcion,
  }),
  ({ editionName, editionYear, editionVenue, editionDescription }) => ({
    nombre: editionName,
    anio: Number(editionYear),
    sede: editionVenue,
    descripcion: editionDescription,
  })
)

export const editionStatusRepository = mapEdition(
  ({ estado }) => estado,
  estado => ({ estado })
)

export const scheduleRepository = mapEdition(
  ({ cierreRecepcion, cierreRevision, publicacion }) => ({
    reception: formatLocalTime(cierreRecepcion),
    review: formatLocalTime(cierreRevision),
    publication: formatLocalTime(publicacion),
  }),
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
