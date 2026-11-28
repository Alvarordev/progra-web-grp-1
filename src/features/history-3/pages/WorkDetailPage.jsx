import { useState } from 'react'
import FinalVersionModal from '../components/FinalVersionModal/FinalVersionModal.jsx'
import { Link, Navigate, useParams } from 'react-router'
import Button from '../../../core/ui/Button/Button.jsx'
import EmptyState from '../../../core/ui/EmptyState/EmptyState.jsx'
import AuthorPageLayout from '../components/AuthorPageLayout/AuthorPageLayout.jsx'
import CoauthorsList from '../components/CoauthorsList/CoauthorsList.jsx'
import DecisionBanner from '../components/DecisionBanner/DecisionBanner.jsx'
import InfoPanel from '../components/InfoPanel/InfoPanel.jsx'
import ReviewFeedback from '../components/ReviewFeedback/ReviewFeedback.jsx'
import ScorePanel from '../components/ScorePanel/ScorePanel.jsx'
import TrackingPanel from '../components/TrackingPanel/TrackingPanel.jsx'
import WorkDataPanel from '../components/WorkDataPanel/WorkDataPanel.jsx'
import WorkHeading from '../components/WorkHeading/WorkHeading.jsx'
import useConference from '../../../core/utils/useConference.js'
import { aTrabajoLocal } from '../utils/adaptadores.js'
import { guardarVersionFinal } from '../../../core/utils/trabajosApi.js'
import { formatScheduleDate } from '../../../core/utils/states/scheduleState.js'
import useMisDecisiones from '../utils/useMisDecisiones.js'
import useTrabajoAutor from '../utils/useTrabajoAutor.js'
import styles from './WorkDetailPage.module.css'

function WorkDetailPage() {
  const { codigo } = useParams()
  const conference = useConference()
  const detalle = useTrabajoAutor(codigo)
  const misDecisiones = useMisDecisiones()
  const trabajo = detalle.trabajo
    ? aTrabajoLocal(detalle.trabajo, misDecisiones.decisiones[codigo])
    : null

  const [finalModal, setFinalModal] = useState(false)
  const [finalNotice, setFinalNotice] = useState('')
  const [finalSaving, setFinalSaving] = useState(false)
  const [finalError, setFinalError] = useState('')
  async function saveFinal(url) {
    setFinalSaving(true)
    setFinalError('')
    try {
      await guardarVersionFinal(detalle.trabajo.id, url)
      detalle.recargar()
      setFinalModal(false)
      setFinalNotice('Versión final guardada.')
    } catch (cause) {
      setFinalError(cause.message)
    } finally {
      setFinalSaving(false)
    }
  }

  const errorCarga = conference.error || detalle.error || misDecisiones.error
  if (conference.loading || detalle.cargando || misDecisiones.cargando || errorCarga) {
    return (
      <AuthorPageLayout>
        <p role="status">{errorCarga || 'Cargando trabajo…'}</p>
      </AuthorPageLayout>
    )
  }

  if (!trabajo) {
    return (
      <AuthorPageLayout estado="En revisión" rutaActiva="/autor/trabajos">
        <EmptyState
          accion={
            <Link className={styles.secondaryLink} to="/autor/trabajos">
              Volver a mis trabajos
            </Link>
          }
          descripcion={`No encontramos el trabajo ${codigo} entre sus trabajos registrados.`}
          titulo="Trabajo no encontrado"
        />
      </AuthorPageLayout>
    )
  }

  if (trabajo.estado === 'borrador' || trabajo.modoLectura) {
    return <Navigate replace to={`/autor/trabajos/${trabajo.codigo}/lectura`} />
  }

  const { dictamen } = trabajo
  const verDocumento = (
    <>
      {trabajo.enlace && (
        <a
          className={styles.secondaryLink}
          href={trabajo.enlace}
          rel="noreferrer"
          target="_blank"
        >
          Ver documento
        </a>
      )}
      {trabajo.enlaceFinal && (
        <a
          className={styles.secondaryLink}
          href={trabajo.enlaceFinal}
          rel="noreferrer"
          target="_blank"
        >
          Ver versión final
        </a>
      )}
    </>
  )

  if (!dictamen) {
    return (
      <AuthorPageLayout estado="En revisión" rutaActiva="/autor/trabajos">
        <WorkHeading
          acciones={verDocumento}
          estados={[trabajo.estado]}
          trabajo={trabajo}
        />
        <div className={styles.layout}>
          <div className={styles.mainColumn}>
            <WorkDataPanel enviado={trabajo.enviado} trabajo={trabajo}>
              <ul aria-label="Palabras clave" className={styles.keywords}>
                {trabajo.palabrasClave.map(palabra => (
                  <li key={palabra}>{palabra}</li>
                ))}
              </ul>
            </WorkDataPanel>
            <CoauthorsList autores={trabajo.autores} />
          </div>
          <aside className={styles.sideColumn}>
            <InfoPanel etiqueta="Dictamen" tipo="warning">
              <h3 className={styles.pendingTitle}>En revisión</h3>
              <p>
                La retroalimentación se mostrará aquí cuando el comité publique la
                decisión
                {conference.schedule.publication &&
                  `, el ${formatScheduleDate(conference.schedule.publication)} a las ${conference.schedule.publication.slice(11, 16)}`}
                .
              </p>
            </InfoPanel>
            {trabajo.seguimiento && <TrackingPanel pasos={trabajo.seguimiento} />}
          </aside>
        </div>
      </AuthorPageLayout>
    )
  }

  const aceptado = dictamen.resultado === 'aceptado'

  return (
    <AuthorPageLayout estado="Resultados publicados" rutaActiva="/autor/trabajos">
      <WorkHeading
        acciones={
          <>
            {verDocumento}
            {aceptado && (
              <Link
                className={styles.primaryLink}
                to={`/autor/presentacion?trabajo=${codigo}`}
              >
                Ver mi presentación
              </Link>
            )}
          </>
        }
        estados={[dictamen.resultado]}
        trabajo={trabajo}
      />
      <div className={styles.layout}>
        <div className={styles.mainColumn}>
          <DecisionBanner dictamen={dictamen} />
          <ReviewFeedback revisiones={dictamen.revisiones} />
        </div>
        <aside className={styles.sideColumn}>
          <ScorePanel dictamen={dictamen} />
          {aceptado ? (
            <InfoPanel etiqueta="Siguiente paso">
              <p>Envíe la versión final con las observaciones atendidas.</p>
              <Button
                className={styles.fullButton}
                variant="primary"
                type="button"
                onClick={() => setFinalModal(true)}
              >
                Subir versión final
              </Button>
            </InfoPanel>
          ) : (
            <InfoPanel etiqueta="¿Tiene dudas?">
              <p>
                Puede solicitar una aclaración al comité organizador dentro de los 5 días
                siguientes a la publicación.
              </p>
              <a
                className={`${styles.secondaryLink} ${styles.fullButton}`}
                href="mailto:congreso@ulima.edu.pe"
              >
                Escribir al comité
              </a>
            </InfoPanel>
          )}
        </aside>
      </div>
      {finalNotice && <p role="status">{finalNotice}</p>}
      {finalModal && (
        <FinalVersionModal
          alCerrar={() => {
            if (!finalSaving) {
              setFinalModal(false)
            }
          }}
          alGuardar={saveFinal}
          guardando={finalSaving}
          error={finalError}
        />
      )}
    </AuthorPageLayout>
  )
}

export default WorkDetailPage
