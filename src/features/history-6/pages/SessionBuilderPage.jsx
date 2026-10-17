import { useState } from 'react'
import Button from '../../../core/ui/Button/Button.jsx'
import CommitteeProgramLayout from '../components/CommitteeProgramLayout/CommitteeProgramLayout.jsx'
import ProgramSummary from '../components/ProgramSummary/ProgramSummary.jsx'
import RoomOccupancy from '../components/RoomOccupancy/RoomOccupancy.jsx'
import SessionModal from '../components/SessionModal/SessionModal.jsx'
import SessionsTable from '../components/SessionsTable/SessionsTable.jsx'
import { acceptedWorks, initialSessions, rooms } from '../data/program.js'
import { findOverlaps, formatDate, getOverlapRange } from '../utils/sessionSchedule.js'
import styles from './SessionBuilderPage.module.css'

const OCCUPANCY_DATE = '2026-11-12'
const TEMPORARY_CHANGES_MESSAGE =
  'Cambios aplicados temporalmente. No se guardarán al recargar.'

function SessionBuilderPage() {
  const [sesiones, setSesiones] = useState(initialSessions)
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

  function handleSave(sesionActualizada) {
    if (modal.modo === 'edit') {
      setSesiones((sesionesActuales) =>
        sesionesActuales.map((sesion) =>
          sesion.id === modal.sesion.id
            ? {
                ...sesion,
                ...sesionActualizada,
                moderadorCompleto:
                  sesionActualizada.moderador === sesion.moderador
                    ? sesion.moderadorCompleto
                    : undefined,
              }
            : sesion,
        ),
      )
    } else {
      setSesiones((sesionesActuales) => [
        ...sesionesActuales,
        { ...sesionActualizada, id: `session-${Date.now()}` },
      ])
    }

    setModal(null)
    setFeedback({ mensaje: TEMPORARY_CHANGES_MESSAGE, esError: false })
  }

  function handlePublish() {
    if (conflictos.length > 0) {
      setFeedback({
        mensaje: 'No se puede publicar el programa mientras existan solapamientos.',
        esError: true,
      })
      return
    }

    setFeedback({
      mensaje: 'Programa publicado temporalmente. No se guardará al recargar.',
      esError: false,
    })
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
            <Button onClick={handlePublish} type="button" variant="secondary">
              Publicar programa
            </Button>
            <Button onClick={handleCreate} type="button" variant="primary">
              Nueva sesión
            </Button>
          </div>
        </header>

        <p
          aria-live="polite"
          className={feedback.esError ? styles.feedbackError : styles.feedback}
        >
          {feedback.mensaje}
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
          alCerrar={() => setModal(null)}
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
