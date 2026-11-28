import { useState } from 'react'
import Button from '../../../core/ui/Button/Button.jsx'
import EmptyState from '../../../core/ui/EmptyState/EmptyState.jsx'
import Footer from '../../../core/ui/Footer/Footer.jsx'
import Header from '../../../core/ui/Header/Header.jsx'
import VisitorNavigation from '../../../core/ui/VisitorNavigation/VisitorNavigation.jsx'
import { downloadPdf } from '../../../core/utils/downloads.js'
import { obtenerProgramaPublico } from '../../../core/utils/programaApi.js'
import useRemoteData from '../../../core/utils/useRemoteData.js'
import ProgramSession from '../components/ProgramSession/ProgramSession.jsx'
import { formatDate, formatWeekday, toMinutes } from '../utils/sessionSchedule.js'
import styles from './PublicProgramPage.module.css'

function PublicProgramPage() {
  const { data, loading, error } = useRemoteData(obtenerProgramaPublico)
  const sesiones = data?.sesiones ?? []
  const totalTrabajos = sesiones.reduce(
    (suma, sesion) => suma + sesion.trabajos.length,
    0
  )
  const programDays = [...new Set(sesiones.map(session => session.fecha))].sort()
  const axes = [...new Set(sesiones.map(session => session.eje))].sort()
  const rooms = [...new Set(sesiones.map(session => session.sala))].sort()
  const [selectedDay, setSelectedDay] = useState(null)
  const [ejeFiltro, setEjeFiltro] = useState('')
  const [exportError, setExportError] = useState('')
  const [exporting, setExporting] = useState(false)
  const dia = programDays.includes(selectedDay) ? selectedDay : programDays[0]

  async function exportProgram() {
    setExporting(true)
    setExportError('')
    try {
      await downloadPdf(
        'Programa del congreso',
        sesiones.flatMap(session => [
          session.nombre,
          `${formatDate(session.fecha)} · ${session.horaInicio}–${session.horaFin} · Sala ${session.sala}`,
          ...session.trabajos.map(
            work => `${work.horaInicio} · ${work.orden}. ${work.titulo} — ${work.autores}`
          ),
        ]),
        'programa-del-congreso.pdf'
      )
    } catch {
      setExportError('No se pudo generar el programa. Inténtelo nuevamente.')
    } finally {
      setExporting(false)
    }
  }

  const sesionesVisibles = sesiones
    .filter(sesion => sesion.fecha === dia && (!ejeFiltro || sesion.eje === ejeFiltro))
    .sort(
      (primera, segunda) => toMinutes(primera.horaInicio) - toMinutes(segunda.horaInicio)
    )

  return (
    <div className={styles.page}>
      <Header />
      <VisitorNavigation rutaActiva="/programa-publico" />

      <main className={styles.main}>
        <div className={styles.content}>
          <header className={styles.pageHeading}>
            <div>
              <h1>Programa del congreso</h1>
              {sesiones.length > 0 && (
                <p>
                  {totalTrabajos} {totalTrabajos === 1 ? 'trabajo' : 'trabajos'} ·{' '}
                  {sesiones.length} {sesiones.length === 1 ? 'sesión' : 'sesiones'} ·
                  Salas {rooms.join(', ')}
                </p>
              )}
            </div>
            <Button
              disabled={loading || !sesiones.length}
              loading={exporting}
              onClick={exportProgram}
              type="button"
              variant="secondary"
            >
              Descargar programa en PDF
            </Button>
          </header>

          {(error || exportError) && <p role="alert">{error || exportError}</p>}
          {loading && <p role="status">Cargando programa…</p>}

          {data && !sesiones.length && (
            <EmptyState
              descripcion={
                data.publicado
                  ? 'El programa publicado todavía no tiene sesiones.'
                  : 'El comité organizador publicará el programa cuando esté listo. Vuelva a consultar más adelante.'
              }
              icono="▤"
              titulo="El programa aún no está publicado"
            />
          )}

          {sesiones.length > 0 && (
            <>
              <div className={styles.toolbar}>
                <div aria-label="Días del congreso" className={styles.days} role="group">
                  {programDays.map(fecha => (
                    <button
                      aria-pressed={fecha === dia}
                      className={`${styles.day} ${fecha === dia ? styles.dayActive : ''}`}
                      key={fecha}
                      onClick={() => setSelectedDay(fecha)}
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
                    onChange={event => setEjeFiltro(event.target.value)}
                    value={ejeFiltro}
                  >
                    <option value="">Filtrar por eje: todos</option>
                    {axes.map(eje => (
                      <option key={eje} value={eje}>
                        {eje}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {sesionesVisibles.length > 0 ? (
                <div className={styles.sessions}>
                  {sesionesVisibles.map(sesion => (
                    <ProgramSession
                      key={sesion.id}
                      sesion={sesion}
                      trabajos={sesion.trabajos}
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
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default PublicProgramPage
