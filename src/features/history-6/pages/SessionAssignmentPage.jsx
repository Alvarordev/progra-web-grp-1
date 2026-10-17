import { useState } from 'react'
import { useSearchParams } from 'react-router'
import Button from '../../../core/ui/Button/Button.jsx'
import CommitteeProgramLayout from '../components/CommitteeProgramLayout/CommitteeProgramLayout.jsx'
import PendingWorksPanel from '../components/PendingWorksPanel/PendingWorksPanel.jsx'
import SessionContentPanel from '../components/SessionContentPanel/SessionContentPanel.jsx'
import { acceptedWorks, initialSessions } from '../data/program.js'
import {
  formatDate,
  getSessionCapacity,
  getSessionWorks,
} from '../utils/sessionSchedule.js'
import styles from './SessionAssignmentPage.module.css'

function SessionAssignmentPage() {
  const [searchParams] = useSearchParams()
  const sesion =
    initialSessions.find((item) => item.id === searchParams.get('sesion')) ??
    initialSessions[0]
  const capacidad = getSessionCapacity(sesion)

  const [pendientes, setPendientes] = useState(() =>
    acceptedWorks.filter((trabajo) => !trabajo.sesionId),
  )
  const [contenido, setContenido] = useState(() =>
    getSessionWorks(acceptedWorks, sesion.id),
  )
  const [feedback, setFeedback] = useState('')
  const hayEspacio = contenido.length < capacidad

  function handleAdd(trabajo) {
    if (!hayEspacio) {
      return
    }

    setPendientes((actuales) =>
      actuales.filter((item) => item.codigo !== trabajo.codigo),
    )
    setContenido((actuales) => [...actuales, trabajo])
    setFeedback('')
  }

  function handleRemove(trabajo) {
    setContenido((actuales) =>
      actuales.filter((item) => item.codigo !== trabajo.codigo),
    )
    setPendientes((actuales) => [...actuales, trabajo])
    setFeedback('')
  }

  function handleMove(indice, desplazamiento) {
    const destino = indice + desplazamiento

    setContenido((actuales) => {
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

  function handleSave() {
    setFeedback('Sesión guardada temporalmente. No se guardará al recargar.')
  }

  return (
    <CommitteeProgramLayout estado="Resultados publicados">
      <div className={styles.content}>
        <header className={styles.pageHeading}>
          <div>
            <h1>Asignar trabajos a la sesión</h1>
            <p>
              Sesión seleccionada: {sesion.nombre} · {formatDate(sesion.fecha)}{' '}
              · {sesion.horaInicio}–{sesion.horaFin} · Sala {sesion.sala}
            </p>
          </div>
          <Button onClick={handleSave} type="button" variant="primary">
            Guardar sesión
          </Button>
        </header>

        <p aria-live="polite" className={styles.feedback}>
          {feedback}
        </p>

        <div className={styles.columns}>
          <div className={styles.column}>
            <PendingWorksPanel
              alAgregar={handleAdd}
              hayEspacio={hayEspacio}
              trabajos={pendientes}
            />
            <p className={styles.accentNote}>
              El orden de la lista define el orden de exposición y la hora de
              cada trabajo dentro de la sesión.
            </p>
          </div>
          <div className={styles.column}>
            <SessionContentPanel
              alBajar={(indice) => handleMove(indice, 1)}
              alQuitar={handleRemove}
              alSubir={(indice) => handleMove(indice, -1)}
              capacidad={capacidad}
              sesion={sesion}
              trabajos={contenido}
            />
            <p className={styles.note}>
              Solo los trabajos con decisión «aceptado» aparecen en la columna
              izquierda.
            </p>
          </div>
        </div>
      </div>
    </CommitteeProgramLayout>
  )
}

export default SessionAssignmentPage
