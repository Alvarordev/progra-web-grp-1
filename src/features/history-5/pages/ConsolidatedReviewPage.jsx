import { useState } from 'react'
import { Link, useParams } from 'react-router'
import Header from '../../../core/ui/Header/Header.jsx'
import Footer from '../../../core/ui/Footer/Footer.jsx'
import CommitteeNavigation from '../../../core/ui/CommitteeNavigation/CommitteeNavigation.jsx'
import Button from '../../../core/ui/Button/Button.jsx'
import useConference from '../../../core/utils/useConference.js'
import { getReview, getWorkReviewers, reviewerIdentity } from '../../../core/utils/assignments.js'

import ConsolidatedKpis from '../components/ConsolidatedKpis/ConsolidatedKpis.jsx'
import ConsolidatedScoreTable from '../components/ConsolidatedScoreTable/ConsolidatedScoreTable.jsx'
import ReviewerCommentsPanel from '../components/ReviewerCommentsPanel/ReviewerCommentsPanel.jsx'
import DecisionModal from '../components/DecisionModal/DecisionModal.jsx'

import { buildConsolidation } from '../utils/consolidation.js'
import styles from './ConsolidatedReviewPage.module.css'

const committeeUser = {
  iniciales: 'AS',
  nombre: 'Dra. Ana Salazar Bermúdez',
  rol: 'Rol: Comité organizador',
}

function ConsolidatedReviewPage({ mostrarDecision = false }) {
  const { codigo } = useParams()
  const [decisionAbierta, setDecisionAbierta] = useState(mostrarDecision)
  const conference = useConference()
  const work = conference.works.find(item => item.codigo === codigo)
  const trabajo = work ? { title: work.titulo, eje: work.eje, tipo: work.tipo, autores: work.autores.join(', ') } : null
  const cargando = conference.loading
  const assigned = work ? getWorkReviewers(work, conference.reviewers) : []
  const normalizedReviews = Object.fromEntries(assigned.flatMap(reviewer => {
    const review = getReview(conference.reviews, reviewer, codigo)
    return review ? [[`${reviewerIdentity(reviewer)}:${codigo}`, review]] : []
  }))
  const consolidado = trabajo && !cargando ? buildConsolidation({ codigo, revisores: assigned.map(reviewer => ({ ...reviewer, id: reviewerIdentity(reviewer) })), reviews: normalizedReviews, criteria: conference.criteria }) : null

  return (
    <div className={styles.page}>
      <Header estado="En revisión" />
      <CommitteeNavigation rutaActiva="/trabajos-recibidos" usuario={committeeUser} />

      <main className={styles.main}>
        <div className={styles.content}>
          <nav aria-label="Ruta de navegación" className={styles.breadcrumb}>
            <Link to="/trabajos-recibidos">Trabajos recibidos</Link>
            <span aria-hidden="true">›</span>
            <span>{codigo}</span>
            <span aria-hidden="true">›</span>
            <span>Consolidado</span>
          </nav>

          {cargando && <p role="status">Cargando consolidado…</p>}
          {conference.error && <p role="alert">{conference.error}</p>}

          {consolidado ? (
            <>
              <section className={styles.workHeader} aria-labelledby="titulo-trabajo">
                <div>
                  <div className={styles.tags}>
                    <span>{codigo}</span>
                    <span className={styles.status}>
                      En revisión · {consolidado.resumen.entregadas} de {consolidado.resumen.totalRevisiones} entregadas
                    </span>
                  </div>
                  <h1 id="titulo-trabajo">{trabajo.title}</h1>
                  <p className={styles.meta}>
                    {trabajo.eje} · {trabajo.tipo} · {trabajo.autores}
                  </p>
                </div>

                <div className={styles.actions}>
                  <a className={styles.documentLink} href={work.documentUrl || '/Tema6_Mockups_f.pdf'} target="_blank" rel="noreferrer">Ver documento</a>
                  <Button variant="primary" type="button" onClick={() => setDecisionAbierta(true)}>
                    Registrar decisión final
                  </Button>
                </div>
              </section>

              <ConsolidatedKpis resumen={consolidado.resumen} />

              <section className={styles.block} aria-labelledby="titulo-puntajes">
                <h2 id="titulo-puntajes">Puntajes por revisor</h2>
                <ConsolidatedScoreTable
                  filas={consolidado.filas}
                  criteriosPromedio={consolidado.criteriosPromedio}
                  promedioGeneral={consolidado.resumen.promedioGeneral}
                />
              </section>

              <section className={styles.block} aria-labelledby="titulo-comentarios">
                <h2 id="titulo-comentarios">Comentarios de los revisores</h2>
                <ReviewerCommentsPanel revisiones={consolidado.filas} />
              </section>

              {decisionAbierta && (
                <DecisionModal
                  alCerrar={() => setDecisionAbierta(false)}
                  codigo={codigo}
                  datos={conference}
                  decision={conference.decisions[codigo]}
                  resumen={consolidado.resumen}
                  filas={consolidado.filas}
                />
              )}
            </>
          ) : !cargando && (
            <section className={styles.emptyState}>
              <h1>Sin revisores asignados</h1>
              <p>Cuando el comité asigne revisores a este trabajo, el consolidado aparecerá aquí.</p>
              <Link to="/trabajos-recibidos">Volver a trabajos recibidos</Link>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ConsolidatedReviewPage
