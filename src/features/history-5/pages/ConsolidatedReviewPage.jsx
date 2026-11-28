import { useState } from 'react'
import { Link, useParams } from 'react-router'
import Header from '../../../core/ui/Header/Header.jsx'
import Footer from '../../../core/ui/Footer/Footer.jsx'
import CommitteeNavigation from '../../../core/ui/CommitteeNavigation/CommitteeNavigation.jsx'
import Button from '../../../core/ui/Button/Button.jsx'

import ConsolidatedKpis from '../components/ConsolidatedKpis/ConsolidatedKpis.jsx'
import ConsolidatedScoreTable from '../components/ConsolidatedScoreTable/ConsolidatedScoreTable.jsx'
import ReviewerCommentsPanel from '../components/ReviewerCommentsPanel/ReviewerCommentsPanel.jsx'
import DecisionModal from '../components/DecisionModal/DecisionModal.jsx'

import useConsolidado from '../utils/useConsolidado.js'
import { aCuerpoDecision, guardarDecision } from '../../../core/utils/decisionesApi.js'
import styles from './ConsolidatedReviewPage.module.css'

function ConsolidatedReviewPage({ mostrarDecision = false }) {
  const { codigo } = useParams()
  const [decisionAbierta, setDecisionAbierta] = useState(mostrarDecision)
  const {
    cargando,
    error,
    trabajo: work,
    consolidado: datosConsolidado,
    recargar,
  } = useConsolidado(codigo)
  const trabajo = work
    ? {
        title: work.titulo,
        eje: work.eje,
        tipo: work.tipo,
        estado: work.estado,
        autores: work.autor?.nombre ?? '',
      }
    : null
  const consolidado = trabajo ? datosConsolidado : null

  async function registrarDecision(resultado, retroalimentacion, publicar) {
    await guardarDecision(
      work.id,
      aCuerpoDecision(resultado, retroalimentacion, publicar)
    )
    recargar()
  }

  return (
    <div className={styles.page}>
      <Header />
      <CommitteeNavigation rutaActiva="/trabajos-recibidos" />

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
          {error && <p role="alert">{error}</p>}

          {consolidado ? (
            <>
              <section className={styles.workHeader} aria-labelledby="titulo-trabajo">
                <div>
                  <div className={styles.tags}>
                    <span>{codigo}</span>
                    <span className={styles.status}>
                      {trabajo.estado} · {consolidado.resumen.entregadas} de{' '}
                      {consolidado.resumen.totalRevisiones} entregadas
                    </span>
                  </div>
                  <h1 id="titulo-trabajo">{trabajo.title}</h1>
                  <p className={styles.meta}>
                    {trabajo.eje} · {trabajo.tipo} · {trabajo.autores}
                  </p>
                </div>

                <div className={styles.actions}>
                  {work.documentUrl ? (
                    <a
                      className={styles.documentLink}
                      href={work.documentUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Ver documento
                    </a>
                  ) : (
                    <span className={styles.documentLink} aria-disabled="true">
                      Sin documento
                    </span>
                  )}
                  <Button
                    variant="primary"
                    type="button"
                    onClick={() => setDecisionAbierta(true)}
                  >
                    Registrar decisión final
                  </Button>
                </div>
              </section>

              <ConsolidatedKpis resumen={consolidado.resumen} />

              <section className={styles.block} aria-labelledby="titulo-puntajes">
                <h2 className={styles.visuallyHidden} id="titulo-puntajes">
                  Puntajes por revisor
                </h2>
                <ConsolidatedScoreTable
                  filas={consolidado.filas}
                  criteriosPromedio={consolidado.criteriosPromedio}
                  promedioGeneral={consolidado.resumen.promedioGeneral}
                />
              </section>

              <section className={styles.block} aria-labelledby="titulo-comentarios">
                <h2 className={styles.visuallyHidden} id="titulo-comentarios">
                  Comentarios de los revisores
                </h2>
                <ReviewerCommentsPanel revisiones={consolidado.filas} />
              </section>

              {decisionAbierta && (
                <DecisionModal
                  alCerrar={() => setDecisionAbierta(false)}
                  codigo={codigo}
                  alGuardar={registrarDecision}
                  decision={work.decision}
                  resumen={consolidado.resumen}
                  filas={consolidado.filas}
                />
              )}
            </>
          ) : (
            !cargando && (
              <section className={styles.emptyState}>
                <h1>Sin revisores asignados</h1>
                <p>
                  Cuando el comité asigne revisores a este trabajo, el consolidado
                  aparecerá aquí.
                </p>
                <Link to="/trabajos-recibidos">Volver a trabajos recibidos</Link>
              </section>
            )
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ConsolidatedReviewPage
