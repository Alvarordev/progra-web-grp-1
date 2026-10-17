import { Navigate, useParams } from 'react-router'
import AuthorPageLayout from '../components/AuthorPageLayout/AuthorPageLayout.jsx'
import InfoPanel from '../components/InfoPanel/InfoPanel.jsx'
import WorkDataPanel from '../components/WorkDataPanel/WorkDataPanel.jsx'
import WorkHeading from '../components/WorkHeading/WorkHeading.jsx'
import { receptionIsOpen } from '../../../core/utils/submissions.js'
import { formatScheduleDate } from '../../../core/utils/states/scheduleState.js'
import useConference from '../../../core/utils/useConference.js'
import { getAuthorWorks } from '../../../core/utils/submissions.js'
import styles from './WorkDetailPage.module.css'

function getAuthorsLine(autores) {
  return autores
    .map(autor =>
      autor.correspondencia ? `${autor.nombre} (correspondencia)` : autor.nombre
    )
    .join(' · ')
}

function ReadOnlyWorkPage() {
  const { codigo } = useParams()
  const conference = useConference()
  const trabajo = getAuthorWorks(
    conference.works,
    conference.account,
    conference.decisions
  ).find(work => work.codigo === codigo)

  if (conference.loading || conference.error) {
    return (
      <AuthorPageLayout>
        <p role="status">{conference.error || 'Cargando trabajo…'}</p>
      </AuthorPageLayout>
    )
  }

  if (!trabajo) {
    return <Navigate replace to="/autor/trabajos" />
  }

  const enviado = trabajo.enviado
    ? [trabajo.enviado, trabajo.hora].filter(Boolean).join(' · ')
    : 'No enviado'

  return (
    <AuthorPageLayout estado="Recepción cerrada" rutaActiva="/autor/trabajos">
      <section className={styles.closedNotice} role="status">
        <span aria-hidden="true" className={styles.closedIcon}>
          !
        </span>
        <p>
          <strong>
            {receptionIsOpen(conference.status, conference.schedule)
              ? 'Vista de solo lectura.'
              : `La recepción cerró el ${formatScheduleDate(conference.schedule.reception ?? '')}.`}
          </strong>{' '}
          Este trabajo se muestra en modo lectura y ya no admite cambios. Si necesita
          corregir un dato, escriba al comité organizador.
        </p>
      </section>

      <WorkHeading
        acciones={
          <>
            <a
              className={styles.secondaryLink}
              href={trabajo.enlace}
              rel="noreferrer"
              target="_blank"
            >
              Ver documento
            </a>
            <button className={styles.disabledButton} disabled type="button">
              Editar (no disponible)
            </button>
          </>
        }
        estados={[trabajo.estadoLectura ?? trabajo.estado, 'lectura']}
        migaDePan={false}
        trabajo={trabajo}
      />

      <div className={styles.layout}>
        <WorkDataPanel enviado={enviado} trabajo={trabajo}>
          <h3 className={styles.fieldLabel}>Coautores</h3>
          <p className={styles.fieldValue}>{getAuthorsLine(trabajo.autores)}</p>
          <h3 className={styles.fieldLabel}>Enlace al documento</h3>
          <p className={styles.fieldValue}>
            <a
              className={styles.documentLink}
              href={trabajo.enlace}
              rel="noreferrer"
              target="_blank"
            >
              {trabajo.enlace}
            </a>
          </p>
        </WorkDataPanel>
        <aside className={styles.sideColumn}>
          <InfoPanel etiqueta="Campos bloqueados" tipo="muted">
            <p>
              Título, tipo, eje temático, resumen, palabras clave, coautores y enlace al
              documento.
            </p>
          </InfoPanel>
          <InfoPanel etiqueta="Qué sigue">
            <p>{trabajo.queSigue}</p>
          </InfoPanel>
        </aside>
      </div>
    </AuthorPageLayout>
  )
}

export default ReadOnlyWorkPage
