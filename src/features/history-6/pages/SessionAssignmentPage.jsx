import { useState } from 'react'
import { useSearchParams } from 'react-router'
import Button from '../../../core/ui/Button/Button.jsx'
import {
  asignarTrabajosSesion,
  obtenerGestionPrograma,
} from '../../../core/utils/programaApi.js'
import useRemoteData from '../../../core/utils/useRemoteData.js'
import CommitteeProgramLayout from '../components/CommitteeProgramLayout/CommitteeProgramLayout.jsx'
import PendingWorksPanel from '../components/PendingWorksPanel/PendingWorksPanel.jsx'
import SessionContentPanel from '../components/SessionContentPanel/SessionContentPanel.jsx'
import { formatDate } from '../utils/sessionSchedule.js'
import styles from './SessionAssignmentPage.module.css'

const UNSAVED_MESSAGE = 'Hay cambios sin guardar en esta sesión. ¿Descartarlos?'

/* Editor de una sola sesión. Se monta con `key` para no arrastrar cambios a otra sesión. */
function AssignmentEditor({ datos, sesion, alCambiarSesion, alGuardar }) {
  const [draft, setDraft] = useState(null)
  /* Códigos ya guardados en esta sesión; evita un parpadeo mientras se recarga el programa. */
  const [guardados, setGuardados] = useState(null)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState({ mensaje: '', esError: false })

  const contenido = draft ?? sesion.trabajos
  const codigos = contenido.map(trabajo => trabajo.codigo)
  const base = guardados ?? sesion.trabajos.map(trabajo => trabajo.codigo)
  const hayCambios = draft !== null && codigos.join('|') !== base.join('|')
  const capacidad = sesion.capacidad
  const hayEspacio = contenido.length < capacidad
  const pendientes = datos.trabajosAceptados.filter(
    trabajo =>
      (!trabajo.sesionId || trabajo.sesionId === sesion.id) &&
      !codigos.includes(trabajo.codigo)
  )
  const enOtras = datos.trabajosAceptados.filter(
    trabajo => trabajo.sesionId && trabajo.sesionId !== sesion.id
  ).length

  function change(next) {
    setDraft(next)
    setFeedback({ mensaje: '', esError: false })
  }

  function handleAdd(trabajo) {
    if (saving || !hayEspacio) {
      return
    }
    change([...contenido, trabajo])
  }

  function handleRemove(trabajo) {
    if (saving) {
      return
    }
    change(contenido.filter(item => item.codigo !== trabajo.codigo))
  }

  function handleMove(indice, desplazamiento) {
    const destino = indice + desplazamiento

    if (saving || destino < 0 || destino >= contenido.length) {
      return
    }
    const reordenados = [...contenido]
    const [movido] = reordenados.splice(indice, 1)

    reordenados.splice(destino, 0, movido)
    change(reordenados)
  }

  function handleSessionChange(event) {
    if (hayCambios && !window.confirm(UNSAVED_MESSAGE)) {
      return
    }
    alCambiarSesion(event.target.value)
  }

  async function handleSave() {
    if (saving || !hayCambios) {
      return
    }
    setSaving(true)
    try {
      await asignarTrabajosSesion(sesion.id, codigos)
      setGuardados(codigos)
      setFeedback({ mensaje: 'Sesión guardada.', esError: false })
      alGuardar()
    } catch (cause) {
      setFeedback({ mensaje: cause.message, esError: true })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.content}>
      <header className={styles.pageHeading}>
        <div>
          <h1>Asignar trabajos a la sesión</h1>
          <p>
            Sesión seleccionada: {sesion.nombre} · {formatDate(sesion.fecha)} ·{' '}
            {sesion.horaInicio}–{sesion.horaFin} · Sala {sesion.sala}
          </p>
          <label className={styles.sessionPicker}>
            Cambiar de sesión{' '}
            <select disabled={saving} onChange={handleSessionChange} value={sesion.id}>
              {datos.sesiones.map(item => (
                <option key={item.id} value={item.id}>
                  {`${item.nombre} · ${formatDate(item.fecha)} ${item.horaInicio}`}
                </option>
              ))}
            </select>
          </label>
        </div>
        <Button
          disabled={saving || !hayCambios}
          loading={saving}
          onClick={handleSave}
          type="button"
          variant="primary"
        >
          Guardar sesión
        </Button>
      </header>

      <p
        aria-live="polite"
        className={feedback.esError ? styles.feedbackError : styles.feedback}
      >
        {feedback.mensaje || (hayCambios ? 'Tiene cambios sin guardar.' : '')}
      </p>

      <div className={styles.columns}>
        <div className={styles.column}>
          <PendingWorksPanel
            alAgregar={handleAdd}
            hayEspacio={hayEspacio && !saving}
            trabajos={pendientes}
          />
          <p className={styles.accentNote}>
            El orden de la lista define el orden de exposición y la hora de cada trabajo
            dentro de la sesión.
            {enOtras > 0 &&
              ` Otros ${enOtras} trabajos ya están en otras sesiones; quítelos de allí para moverlos.`}
          </p>
        </div>
        <div className={styles.column}>
          <SessionContentPanel
            alBajar={indice => handleMove(indice, 1)}
            alQuitar={handleRemove}
            alSubir={indice => handleMove(indice, -1)}
            capacidad={capacidad}
            sesion={sesion}
            trabajos={contenido}
          />
          <p className={styles.note}>
            Solo los trabajos con decisión «aceptado» aparecen en la columna izquierda.
          </p>
        </div>
      </div>
    </div>
  )
}

function SessionAssignmentPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data, loading, error, recargar } = useRemoteData(obtenerGestionPrograma)
  const sesion =
    data?.sesiones.find(item => String(item.id) === searchParams.get('sesion')) ??
    data?.sesiones[0]

  if (!sesion) {
    return (
      <CommitteeProgramLayout>
        <h1>Asignar trabajos a la sesión</h1>
        <p role="status">
          {error ||
            (loading
              ? 'Cargando sesión…'
              : 'Cree una sesión desde Programa para asignarle trabajos.')}
        </p>
      </CommitteeProgramLayout>
    )
  }

  return (
    <CommitteeProgramLayout>
      <AssignmentEditor
        alCambiarSesion={id => setSearchParams({ sesion: id })}
        alGuardar={recargar}
        datos={data}
        key={sesion.id}
        sesion={sesion}
      />
    </CommitteeProgramLayout>
  )
}

export default SessionAssignmentPage
