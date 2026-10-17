import { useState } from 'react'
import { useSearchParams } from 'react-router'
import Button from '../../../core/ui/Button/Button.jsx'
import CommitteeProgramLayout from '../components/CommitteeProgramLayout/CommitteeProgramLayout.jsx'
import PendingWorksPanel from '../components/PendingWorksPanel/PendingWorksPanel.jsx'
import SessionContentPanel from '../components/SessionContentPanel/SessionContentPanel.jsx'
import useConference from '../../../core/utils/useConference.js'
import { getProgramWorks } from '../../../core/utils/program.js'
import {
  formatDate,
  getSessionCapacity,
  getSessionWorks,
} from '../utils/sessionSchedule.js'
import styles from './SessionAssignmentPage.module.css'

function SessionAssignmentPage() {
  const [searchParams] = useSearchParams()
  const conference = useConference()
  const initialSessions = conference.program.sessions
  const acceptedWorks = getProgramWorks(conference.works, conference.program)
  const sesion =
    initialSessions.find(item => item.id === searchParams.get('sesion')) ??
    initialSessions[0]
  const capacidad = sesion ? getSessionCapacity(sesion) : 0

  const [draft, setContenido] = useState(null)
  const contenido = draft ?? (sesion ? getSessionWorks(acceptedWorks, sesion.id) : [])
  const pendientes = acceptedWorks.filter(
    work => !work.sesionId && !contenido.some(item => item.codigo === work.codigo)
  )
  const [feedback, setFeedback] = useState('')
  const hayEspacio = contenido.length < capacidad

  function handleAdd(trabajo) {
    if (conference.busy) {
      return
    }
    if (!hayEspacio) {
      return
    }

    setContenido([...contenido, trabajo])
    setFeedback('')
  }

  function handleRemove(trabajo) {
    if (conference.busy) {
      return
    }
    setContenido(contenido.filter(item => item.codigo !== trabajo.codigo))
    setFeedback('')
  }

  function handleMove(indice, desplazamiento) {
    if (conference.busy) {
      return
    }
    const destino = indice + desplazamiento

    setContenido(() => {
      const actuales = contenido
      if (destino < 0 || destino >= actuales.length) {
        return actuales
      }

      const reordenados = [...actuales]
      const [movido] = reordenados.splice(indice, 1)

      reordenados.splice(destino, 0, movido)

      return reordenados
    })
    setFeedback('')
  }

  async function handleSave() {
    if (conference.busy || !sesion) {
      return
    }
    const assignments = conference.program.assignments.filter(
      item =>
        item.sesionId !== sesion.id &&
        !contenido.some(work => work.codigo === item.codigo)
    )
    const next = {
      ...conference.program,
      assignments: [
        ...assignments,
        ...contenido.map((work, index) => ({
          codigo: work.codigo,
          sesionId: sesion.id,
          orden: index + 1,
        })),
      ],
    }
    try {
      await conference.save('program', next)
      setContenido(null)
      setFeedback('Sesión guardada en este navegador.')
    } catch {
      /* error visible */
    }
  }

  if (!sesion) {
    return (
      <CommitteeProgramLayout>
        <h1>Asignar trabajos a la sesión</h1>
        <p role="status">
          {conference.error ||
            (conference.loading
              ? 'Cargando sesión…'
              : 'Cree una sesión desde Programa para asignarle trabajos.')}
        </p>
      </CommitteeProgramLayout>
    )
  }

  return (
    <CommitteeProgramLayout estado="Resultados publicados">
      <div className={styles.content}>
        <header className={styles.pageHeading}>
          <div>
            <h1>Asignar trabajos a la sesión</h1>
            <p>
              Sesión seleccionada: {sesion.nombre} · {formatDate(sesion.fecha)} ·{' '}
              {sesion.horaInicio}–{sesion.horaFin} · Sala {sesion.sala}
            </p>
          </div>
          <Button
            disabled={conference.busy}
            onClick={handleSave}
            type="button"
            variant="primary"
          >
            Guardar sesión
          </Button>
        </header>

        <p aria-live="polite" className={styles.feedback}>
          {conference.error || feedback}
        </p>

        <div className={styles.columns}>
          <div className={styles.column}>
            <PendingWorksPanel
              alAgregar={handleAdd}
              hayEspacio={hayEspacio && !conference.busy}
              trabajos={pendientes}
            />
            <p className={styles.accentNote}>
              El orden de la lista define el orden de exposición y la hora de cada trabajo
              dentro de la sesión.
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
    </CommitteeProgramLayout>
  )
}

export default SessionAssignmentPage
