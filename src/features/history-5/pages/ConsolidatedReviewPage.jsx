import { useState } from 'react'
import { Link, useParams } from 'react-router'
import Header from '../../../core/ui/Header/Header.jsx'
import Footer from '../../../core/ui/Footer/Footer.jsx'
import CommitteeNavigation from '../../../core/ui/CommitteeNavigation/CommitteeNavigation.jsx'
import Button from '../../../core/ui/Button/Button.jsx'
import useStoredState from '../../../core/utils/useStoredState.js'
import { criteriaRepository, decisionsRepository, reviewsRepository } from '../../../core/utils/repositories.js'
import ConsolidatedKpis from '../components/ConsolidatedKpis/ConsolidatedKpis.jsx'
import ConsolidatedScoreTable from '../components/ConsolidatedScoreTable/ConsolidatedScoreTable.jsx'
import ReviewerCommentsPanel from '../components/ReviewerCommentsPanel/ReviewerCommentsPanel.jsx'
import DecisionModal from '../components/DecisionModal/DecisionModal.jsx'
import { assignmentsByWork } from '../data/assignmentsByWork.js'
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
  const trabajo = assignmentsByWork[codigo]
  const reviewsState = useStoredState(reviewsRepository, {})
  const criteriaState = useStoredState(criteriaRepository, [])
  const decisionsState = useStoredState(decisionsRepository, {})
  const cargando = reviewsState.loading || criteriaState.loading || decisionsState.loading
  const decisionGuardada = decisionsState.value[codigo] ?? null
  const decisionPublicada = decisionGuardada?.status === 'published'
  const etiquetaDecision = { aceptar: 'Aceptado', rechazar: 'Rechazado' }[decisionGuardada?.decision] ?? ''
  const estadoDecision = decisionPublicada
    ? `Decisión publicada: ${etiquetaDecision}`
    : decisionGuardada ? 'Borrador de decisión' : 'Decisión pendiente'

  // Guarda un borrador o la decisión publicada, y la pantalla se actualiza al terminar el guardado.
  async function guardarDecision({ decision, feedback, status }) {
    await decisionsState.save({
      ...decisionsState.value,
      [codigo]: { decision, feedback, status, updatedAt: new Date().toISOString() },
    })
  }
  const consolidado = trabajo && !cargando
    ? buildConsolidation({
        codigo,
        revisores: trabajo.revisores,
        reviews: reviewsState.value,
        criteria: criteriaState.value,
      })
    : null

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

          {consolidado ? (
            <>
              <section className={styles.workHeader} aria-labelledby="titulo-trabajo">
                <div>
                  <div className={styles.tags}>
                    <span>{codigo}</span>
                    <span className={styles.status}>
                      En revisión · {consolidado.resumen.entregadas} de {consolidado.resumen.totalRevisiones} entregadas · {estadoDecision}
                    </span>
                  </div>
                  <h1 id="titulo-trabajo">{trabajo.title}</h1>
                  <p className={styles.meta}>
                    {trabajo.eje} · {trabajo.tipo} · {trabajo.autores}
                  </p>
                </div>

                <div className={styles.actions}>
                  <Button variant="secondary" type="button">
                    Ver documento
                  </Button>
                  <Button variant="primary" type="button" onClick={() => setDecisionAbierta(true)}>
                    {decisionPublicada ? 'Ver decisión final' : 'Registrar decisión final'}
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
                <h2 id="titulo-comentarios">Comentarios al autor reunidos</h2>
                <ReviewerCommentsPanel revisiones={consolidado.filas} />
              </section>

              {decisionAbierta && (
                <DecisionModal
                  alCerrar={() => setDecisionAbierta(false)}
                  alGuardar={guardarDecision}
                  decisionGuardada={decisionGuardada}
                  codigo={codigo}
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
