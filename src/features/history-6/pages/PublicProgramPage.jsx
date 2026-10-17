import { useState } from 'react'
import Button from '../../../core/ui/Button/Button.jsx'
import EmptyState from '../../../core/ui/EmptyState/EmptyState.jsx'
import Footer from '../../../core/ui/Footer/Footer.jsx'
import Header from '../../../core/ui/Header/Header.jsx'
import VisitorNavigation from '../../../core/ui/VisitorNavigation/VisitorNavigation.jsx'
import ProgramSession from '../components/ProgramSession/ProgramSession.jsx'
import useConference from '../../../core/utils/useConference.js'
import { getProgramWorks, publicProgram } from '../../../core/utils/program.js'
import { downloadPdf } from '../../../core/utils/downloads.js'
import {
  formatDate,
  formatWeekday,
  getSessionWorks,
  toMinutes,
} from '../utils/sessionSchedule.js'
import styles from './PublicProgramPage.module.css'


function PublicProgramPage() {
  const conference = useConference()
  const published = publicProgram(conference.program)
  const initialSessions = published.sessions
  const acceptedWorks = getProgramWorks(conference.works, published)
  const thematicAxes = conference.axes.map(axis => axis.nombre)
  const programDays = [...new Set(initialSessions.map(session => session.fecha))].sort()
  const [selectedDay, setDia] = useState(null)
  const dia = selectedDay ?? programDays[0]
  const [exportError, setExportError] = useState('')
  const [exporting, setExporting] = useState(false)
  async function exportProgram() {
    setExporting(true)
    try { await downloadPdf('Programa del congreso', initialSessions.flatMap(session => [session.nombre, `${formatDate(session.fecha)} · ${session.horaInicio}–${session.horaFin} · ${session.sala}`, ...getSessionWorks(acceptedWorks, session.id).map(work => `${work.orden}. ${work.titulo} — ${work.autores}`)]), 'programa-del-congreso.pdf') } catch { setExportError('No se pudo generar el programa. Inténtelo nuevamente.') } finally { setExporting(false) }
  }
  const [ejeFiltro, setEjeFiltro] = useState('')

  const sesionesVisibles = initialSessions
    .filter(
      (sesion) =>
        sesion.fecha === dia && (!ejeFiltro || sesion.eje === ejeFiltro),
    )
    .sort(
      (primera, segunda) =>
        toMinutes(primera.horaInicio) - toMinutes(segunda.horaInicio),
    )

  return (
    <div className={styles.page}>
      <Header estado="Programa publicado" />
      <VisitorNavigation rutaActiva="/programa-publico" />

      <main className={styles.main}>
        <div className={styles.content}>
          <header className={styles.pageHeading}>
            <div>
              <h1>Programa del congreso</h1>
              <p>
                {acceptedWorks.length} trabajos aceptados ·{' '}
                {initialSessions.length} sesiones · Auditorio Central y aulas A
                y B
              </p>
            </div>
            <Button disabled={conference.busy || !initialSessions.length} loading={exporting} onClick={exportProgram} type="button" variant="secondary">
              Descargar programa en PDF
            </Button>
          </header>

          {(conference.error || exportError) && <p role="alert">{conference.error || exportError}</p>}
          {conference.loading && <p role="status">Cargando programa…</p>}
          <div className={styles.toolbar}>
            <div aria-label="Días del congreso" className={styles.days} role="group">
              {programDays.map((fecha) => (
                <button
                  aria-pressed={fecha === dia}
                  className={`${styles.day} ${fecha === dia ? styles.dayActive : ''}`}
                  key={fecha}
                  onClick={() => setDia(fecha)}
                  type="button"
                >
                  {formatWeekday(fecha)} {formatDate(fecha)}
                </button>
              ))}
            </div>
            <div className={styles.filter}>
              <label className={styles.visuallyHidden} htmlFor="axis-filter">
                Filtrar por eje temático
              </label>
              <select
                className={styles.select}
                id="axis-filter"
                onChange={(event) => setEjeFiltro(event.target.value)}
                value={ejeFiltro}
              >
                <option value="">Filtrar por eje: todos</option>
                {thematicAxes.map((eje) => (
                  <option key={eje} value={eje}>
                    {eje}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {sesionesVisibles.length > 0 ? (
            <div className={styles.sessions}>
              {sesionesVisibles.map((sesion) => (
                <ProgramSession
                  key={sesion.id}
                  sesion={sesion}
                  trabajos={getSessionWorks(acceptedWorks, sesion.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              descripcion="Pruebe con otro día o quite el filtro de eje temático para ver más sesiones."
              icono="▤"
              titulo="No hay sesiones para esta selección"
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default PublicProgramPage
