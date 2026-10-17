import { worksRepository } from './repositories.js'
import { receptionIsOpen } from './reception.js'

export { receptionIsOpen } from './reception.js'

const stateValues = { Borrador: 'borrador', Enviado: 'enviado', 'En revisión': 'revision', Aceptado: 'aceptado', Rechazado: 'rechazado' }
export const emptySubmission = { titulo: '', tipo: '', eje: '', resumen: '', palabrasClave: [], enlace: '', autores: [] }

export function getAuthorWorks(works, account, decisions = {}) {
  if (!account) return []
  return works.filter(work => work.ownerId === account.userId || work.ownerEmail === account.email || work.details?.autores?.some(author => author.correo === account.email)).map(work => toSubmission(work, decisions[work.codigo]))
}

export function toSubmission(work, decision) {
  const detail = work.details ?? {}
  const published = decision?.status === 'published'
  return {
    ...emptySubmission, ...detail, codigo: work.codigo, titulo: work.titulo, tipo: work.tipo, eje: work.eje,
    estado: published ? (decision.resultado === 'aceptar' ? 'aceptado' : 'rechazado') : stateValues[work.estado] ?? 'enviado',
    enlace: work.documentUrl || detail.enlace || '/Tema6_Mockups_f.pdf',
    autores: detail.autores ?? work.autores.map(nombre => ({ nombre, institucion: work.institucion, rol: 'Coautor' })),
    firmantes: work.autores.join(', '), fecha: detail.fecha ?? (work.estado === 'Borrador' ? 'No enviado' : 'Enviado al comité'),
    ...(published ? { dictamen: { resultado: decision.resultado === 'aceptar' ? 'aceptado' : 'rechazado', publicado: new Date(decision.updatedAt).toLocaleDateString('es-PE'), titulo: decision.resultado === 'aceptar' ? 'Trabajo aceptado para presentación oral' : 'Trabajo no aceptado en esta edición', detalle: decision.retroalimentacion, promedio: decision.promedio ?? '—', puntajes: decision.puntajes ?? [], revisiones: decision.revisiones ?? [] } } : {}),
  }
}

export async function saveSubmission({ account, submission, code, send = false, status, schedule }) {
  if (!account || !receptionIsOpen(status, schedule)) throw new Error('La recepción está cerrada. El trabajo solo admite consulta.')
  const works = await worksRepository.get()
  const existing = works.find(work => work.codigo === code && (work.ownerId === account.userId || work.ownerEmail === account.email))
  if (code && !existing) throw new Error('No se encontró el borrador de su cuenta.')
  if (existing && existing.estado !== 'Borrador') throw new Error('El trabajo ya fue enviado y no admite un nuevo envío.')
  if (send && works.some(work => work.codigo !== code && work.titulo.trim().toLowerCase() === submission.titulo.trim().toLowerCase() && work.estado !== 'Borrador')) throw new Error('Ya existe un trabajo enviado con ese título.')
  const nextCode = code ?? `TRB-2026-${String(Math.max(70, ...works.map(work => Number(work.codigo.split('-').at(-1)) || 0)) + 1).padStart(3, '0')}`
  const authors = submission.autores?.length ? submission.autores : [{ nombre: account.name, correo: account.email, institucion: account.institution, correspondencia: true, rol: 'Autor de correspondencia' }]
  const now = new Date()
  const details = { ...submission, autores: authors, enviado: send ? now.toLocaleDateString('es-PE') : '', hora: send ? now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }) : '', fecha: send ? `Enviado el ${now.toLocaleDateString('es-PE')}` : 'Borrador guardado', noEnviado: !send }
  const next = { ...existing, codigo: nextCode, ownerId: account.userId, ownerEmail: account.email, titulo: submission.titulo, tipo: submission.tipo, eje: submission.eje, estado: send ? 'Enviado' : 'Borrador', autores: authors.map(author => author.nombre), autorCorrespondencia: authors.find(author => author.correspondencia)?.nombre ?? account.name, institucion: account.institution, details, documentUrl: submission.enlace, revisoresAsignados: existing?.revisoresAsignados ?? [], entregadas: 0, updatedAt: now.toISOString() }
  await worksRepository.save(existing ? works.map(work => work.codigo === code ? next : work) : [next, ...works])
  return nextCode
}
