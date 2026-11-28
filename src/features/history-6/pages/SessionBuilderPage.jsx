import { useState } from 'react'
import Button from '../../../core/ui/Button/Button.jsx'
import Modal from '../../../core/ui/Modal/Modal.jsx'
import {
  actualizarSesion,
  crearSesion,
  eliminarSesion,
  obtenerGestionPrograma,
  publicarPrograma,
} from '../../../core/utils/programaApi.js'
import useRemoteData from '../../../core/utils/useRemoteData.js'
import CommitteeProgramLayout from '../components/CommitteeProgramLayout/CommitteeProgramLayout.jsx'
import ProgramSummary from '../components/ProgramSummary/ProgramSummary.jsx'
import RoomOccupancy from '../components/RoomOccupancy/RoomOccupancy.jsx'
import SessionModal from '../components/SessionModal/SessionModal.jsx'
import SessionsTable from '../components/SessionsTable/SessionsTable.jsx'
import { formatDate, formatDateRange } from '../utils/sessionSchedule.js'
import styles from './SessionBuilderPage.module.css'

const conflictLabels = {
  sala: 'Solapamiento de sala',
  moderador: 'Solapamiento de moderación',
}

function formatPublishedAt(valor) {
  return new Date(valor).toLocaleString('es-PE', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

function SessionBuilderPage() {
  const { data, loading, error, recargar } = useRemoteData(obtenerGestionPrograma)
  const [modal, setModal] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState({ mensaje: '', campos: {} })
  const [feedback, setFeedback] = useState({ mensaje: '', esError: false })
  const [selectedDay, setSelectedDay] = useState('')

  const sesiones = data?.sesiones ?? []
  const conflictos = data?.conflictos ?? []
  const aceptados = data?.trabajosAceptados ?? []
  const asignados = aceptados.filter(trabajo => trabajo.sesionId).length
  const idsEnConflicto = new Set(conflictos.flatMap(conflicto => conflicto.sesionIds))
  const days = [...new Set(sesiones.map(sesion => sesion.fecha))].sort()
  const occupancyDay = days.includes(selectedDay) ? selectedDay : days[0]
  const busy = loading || saving

  function openModal(nuevo) {
    setFormError({ mensaje: '', campos: {} })
    setModal(nuevo)
  }

  /* Ejecuta una operación del servidor y vuelve a leer el programa si salió bien. */
  async function run(operation, onError) {
    setSaving(true)
    setFeedback({ mensaje: '', esError: false })
    try {
      const result = await operation()
      recargar()
      return result
    } catch (cause) {
      onError(cause)
      return undefined
    } finally {
      setSaving(false)
    }
  }

  async function handleSave(valores) {
    if (busy) {
      return
    }
    const editing = modal.modo === 'edit'
    const result = await run(
      () => (editing ? actualizarSesion(modal.sesion.id, valores) : crearSesion(valores)),
      cause => {
        const campos = cause.errores ?? {}

        /* Si el servidor señala el campo, el mensaje general sería repetido. */
        setFormError({ mensaje: Object.keys(campos).length ? '' : cause.message, campos })
      }
    )
    if (result) {
      setModal(null)
      setFeedback({
        mensaje: editing ? 'Sesión actualizada.' : 'Sesión creada.',
        esError: false,
      })
    }
  }

  async function handleDelete() {
    if (busy) {
      return
    }
    const sesion = toDelete
    const result = await run(
      () => eliminarSesion(sesion.id),
      cause => setFeedback({ mensaje: cause.message, esError: true })
    )
    setToDelete(null)
    if (result) {
      setFeedback({
        mensaje: result.trabajosLiberados
          ? `Sesión eliminada. ${result.trabajosLiberados} ${result.trabajosLiberados === 1 ? 'trabajo quedó' : 'trabajos quedaron'} sin sesión.`
          : 'Sesión eliminada.',
        esError: false,
      })
    }
  }

  async function handlePublish() {
    if (busy) {
      return
    }
    if (conflictos.length) {
      setFeedback({
        mensaje: 'No se puede publicar el programa mientras existan solapamientos.',
        esError: true,
      })
      return
    }
    const result = await run(publicarPrograma, cause =>
      setFeedback({ mensaje: cause.message, esError: true })
    )
    if (result) {
      setFeedback({
        mensaje: 'Programa publicado. La versión pública ya está disponible.',
        esError: false,
      })
    }
  }

  const upToDate = data?.publicado && !data.cambiosSinPublicar
  let publication = 'Aún no se ha publicado el programa.'
  if (data?.publicado) {
    publication = data.cambiosSinPublicar
      ? `Publicado el ${formatPublishedAt(data.publicadoEn)}. Hay cambios sin publicar: el público sigue viendo la versión anterior.`
      : `Publicado el ${formatPublishedAt(data.publicadoEn)}. El público ve la versión actual.`
  }

  return (
    <CommitteeProgramLayout>
      <div className={styles.content}>
        <header className={styles.pageHeading}>
          <div>
            <h1>Sesiones del congreso</h1>
            <p>
              {sesiones.length} {sesiones.length === 1 ? 'sesión' : 'sesiones'}
              {days.length > 0 && ` · ${formatDateRange(days)}`}
              {data && ` · ${data.edicion.sede}`}
            </p>
          </div>
          <div className={styles.actions}>
            <Button
              disabled={busy || !data || upToDate || !sesiones.length}
              onClick={handlePublish}
              type="button"
              variant="secondary"
            >
              {upToDate ? 'Programa publicado' : 'Publicar programa'}
            </Button>
            <Button
              disabled={busy || !data}
              onClick={() => openModal({ modo: 'create', sesion: null })}
              type="button"
              variant="primary"
            >
              Nueva sesión
            </Button>
          </div>
        </header>

        <p
          aria-live="polite"
          className={feedback.esError || error ? styles.feedbackError : styles.feedback}
        >
          {loading && !data ? 'Cargando programa…' : error || feedback.mensaje}
        </p>
        {data && <p className={styles.feedback}>{publication}</p>}

        {conflictos.length > 0 && (
          <div className={styles.alert} role="status">
            <span aria-hidden="true" className={styles.alertIcon}>
              !
            </span>
            <div>
              {conflictos.map(conflicto => (
                <p key={`${conflicto.tipo}-${conflicto.sesionIds.join('-')}`}>
                  <strong>{conflictLabels[conflicto.tipo]}:</strong> {conflicto.mensaje}{' '}
                  Ajuste la hora o{' '}
                  {conflicto.tipo === 'sala' ? 'la sala' : 'la moderación'} antes de
                  publicar.
                </p>
              ))}
            </div>
          </div>
        )}

        <section aria-label="Sesiones del congreso" className={styles.tableSection}>
          <SessionsTable
            alEditar={sesion => openModal({ modo: 'edit', sesion })}
            alEliminar={setToDelete}
            deshabilitado={busy}
            idsEnConflicto={idsEnConflicto}
            sesiones={sesiones}
          />
        </section>

        {data && (
          <div className={styles.panels}>
            {occupancyDay && (
              <div>
                {days.length > 1 && (
                  <select
                    aria-label="Día de la ocupación de salas"
                    className={styles.daySelect}
                    onChange={event => setSelectedDay(event.target.value)}
                    value={occupancyDay}
                  >
                    {days.map(day => (
                      <option key={day} value={day}>
                        {formatDate(day)}
                      </option>
                    ))}
                  </select>
                )}
                <RoomOccupancy
                  fecha={occupancyDay}
                  salas={data.salas}
                  sesiones={sesiones}
                />
              </div>
            )}
            <ProgramSummary
              asignados={asignados}
              sinSesion={aceptados.length - asignados}
              total={aceptados.length}
            />
          </div>
        )}
      </div>

      {modal && (
        <SessionModal
          alCerrar={() => {
            if (!saving) {
              setModal(null)
            }
          }}
          alGuardar={handleSave}
          ejes={data.ejes}
          errorGuardado={formError.mensaje}
          erroresServidor={formError.campos}
          guardando={saving}
          key={`${modal.modo}-${modal.sesion?.id ?? 'new'}`}
          moderadores={data.moderadores}
          modo={modal.modo}
          salas={data.salas}
          sesion={modal.sesion}
        />
      )}

      {toDelete && (
        <Modal
          alCerrar={() => {
            if (!saving) {
              setToDelete(null)
            }
          }}
          titulo="Eliminar sesión"
        >
          <p>
            ¿Eliminar «{toDelete.nombre}»?{' '}
            {toDelete.trabajos.length > 0
              ? `Sus ${toDelete.trabajos.length} trabajos no se borran: quedarán sin sesión para asignarlos de nuevo.`
              : 'La sesión no tiene trabajos asignados.'}
          </p>
          <div className={styles.confirmActions}>
            <Button
              disabled={saving}
              onClick={() => setToDelete(null)}
              type="button"
              variant="secondary"
            >
              Cancelar
            </Button>
            <Button
              loading={saving}
              onClick={handleDelete}
              type="button"
              variant="primary"
            >
              Eliminar sesión
            </Button>
          </div>
        </Modal>
      )}
    </CommitteeProgramLayout>
  )
}

export default SessionBuilderPage
