import useConference from '../../../core/utils/useConference.js'
import { getProgramWorks } from '../../../core/utils/program.js'
import { useState } from 'react'
import Button from '../../../core/ui/Button/Button.jsx'
import CommitteeProgramLayout from '../components/CommitteeProgramLayout/CommitteeProgramLayout.jsx'
import ProgramSummary from '../components/ProgramSummary/ProgramSummary.jsx'
import RoomOccupancy from '../components/RoomOccupancy/RoomOccupancy.jsx'
import SessionModal from '../components/SessionModal/SessionModal.jsx'
import SessionsTable from '../components/SessionsTable/SessionsTable.jsx'
import { rooms } from '../data/program.js'
import { findOverlaps, formatDate, getOverlapRange } from '../utils/sessionSchedule.js'
import styles from './SessionBuilderPage.module.css'

const OCCUPANCY_DATE = '2026-11-12'
const SAVED_MESSAGE = 'Sesión guardada en este navegador.'

function SessionBuilderPage() {
  const conference = useConference()
  const sesiones = conference.program.sessions
  const acceptedWorks = getProgramWorks(conference.works, conference.program)
  const [modal, setModal] = useState(null)
  const [feedback, setFeedback] = useState({ mensaje: '', esError: false })

  const conflictos = findOverlaps(sesiones)
  const idsEnConflicto = new Set(
    conflictos.flatMap((pareja) => pareja.map((sesion) => sesion.id)),
  )
  const asignados = acceptedWorks.filter((trabajo) => trabajo.sesionId).length

  function handleCreate() {
    setModal({ modo: 'create', sesion: null })
  }

  function handleEdit(sesion) {
    setModal({ modo: 'edit', sesion })
  }

  async function handleSave(updated) {
    if (conference.busy) return
    const sessions = modal.modo === 'edit' ? sesiones.map(session => session.id === modal.sesion.id ? { ...session, ...updated, moderadorCompleto: updated.moderador } : session) : [...sesiones, { ...updated, id: crypto.randomUUID() }]
    if (findOverlaps(sessions).some(pair => pair.some(session => session.id === (modal.sesion?.id ?? sessions.at(-1).id)))) {
      setFeedback({ mensaje: 'La sala y la hora se superponen con otra sesión.', esError: true }); return
    }
    try { await conference.save('program', { ...conference.program, sessions }); setModal(null); setFeedback({ mensaje: SAVED_MESSAGE, esError: false }) } catch { /* el error permanece visible */ }
  }

  async function handlePublish() {
    if (conference.busy) return
    if (conflictos.length) { setFeedback({ mensaje: 'No se puede publicar el programa mientras existan solapamientos.', esError: true }); return }
    try {
      await conference.save('program', { ...conference.program, published: true, publishedSnapshot: { sessions: sesiones, assignments: conference.program.assignments } })
      setFeedback({ mensaje: 'Programa publicado. La versión pública ya está disponible.', esError: false })
    } catch { /* el error permanece visible */ }
  }

  return (
    <CommitteeProgramLayout estado="Resultados publicados">
      <div className={styles.content}>
        <header className={styles.pageHeading}>
          <div>
            <h1>Sesiones del congreso</h1>
            <p>
              {sesiones.length} sesiones · 12 y 13 de noviembre de 2026 ·
              Universidad de Lima
            </p>
          </div>
          <div className={styles.actions}>
            <Button disabled={conference.busy} onClick={handlePublish} type="button" variant="secondary">
              Publicar programa
            </Button>
            <Button disabled={conference.busy} onClick={handleCreate} type="button" variant="primary">
              Nueva sesión
            </Button>
          </div>
        </header>

        <p
          aria-live="polite"
          className={feedback.esError ? styles.feedbackError : styles.feedback}
        >
          {conference.loading ? 'Cargando programa…' : conference.error || feedback.mensaje}
        </p>

        {conflictos.length > 0 && (
          <div className={styles.alert} role="status">
            <span aria-hidden="true" className={styles.alertIcon}>
              !
            </span>
            <div>
              {conflictos.map(([primera, segunda]) => {
                const rango = getOverlapRange(primera, segunda)

                return (
                  <p key={`${primera.id}-${segunda.id}`}>
                    <strong>Solapamiento de sala:</strong> «{primera.nombre}» y
                    «{segunda.nombre}» usan la Sala {primera.sala} el{' '}
                    {formatDate(primera.fecha)} entre las {rango.horaInicio} y
                    las {rango.horaFin}. Ajuste la hora o la sala antes de
                    publicar.
                  </p>
                )
              })}
            </div>
          </div>
        )}

        <section aria-label="Sesiones del congreso" className={styles.tableSection}>
          <SessionsTable
            alEditar={handleEdit}
            idsEnConflicto={idsEnConflicto}
            sesiones={sesiones}
          />
        </section>

        <div className={styles.panels}>
          <RoomOccupancy
            fecha={OCCUPANCY_DATE}
            salas={rooms}
            sesiones={sesiones}
          />
          <ProgramSummary
            asignados={asignados}
            sinSesion={acceptedWorks.length - asignados}
            total={acceptedWorks.length}
          />
        </div>
      </div>

      {modal && (
        <SessionModal
          alCerrar={() => { if (!conference.saving) setModal(null) }}
          guardando={conference.saving}
          ejes={conference.axes.map(axis => axis.nombre)}
          alGuardar={handleSave}
          key={`${modal.modo}-${modal.sesion?.id ?? 'new'}`}
          modo={modal.modo}
          sesion={modal.sesion}
          sesiones={sesiones}
        />
      )}
    </CommitteeProgramLayout>
  )
}

export default SessionBuilderPage
