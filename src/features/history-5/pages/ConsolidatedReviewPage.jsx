import { Link, useParams } from 'react-router'
import Header from '../../../core/ui/Header/Header.jsx'
import Footer from '../../../core/ui/Footer/Footer.jsx'
import CommitteeNavigation from '../../../core/ui/CommitteeNavigation/CommitteeNavigation.jsx'
import Button from '../../../core/ui/Button/Button.jsx'
import ConsolidatedKpis from '../components/ConsolidatedKpis/ConsolidatedKpis.jsx'
import ConsolidatedScoreTable from '../components/ConsolidatedScoreTable/ConsolidatedScoreTable.jsx'
import ReviewerCommentsPanel from '../components/ReviewerCommentsPanel/ReviewerCommentsPanel.jsx'
import { reviewsByWork } from '../data/reviewsByWork.js'
import { buildConsolidation } from '../utils/consolidation.js'
import styles from './ConsolidatedReviewPage.module.css'

const committeeUser = {
  iniciales: 'AS',
  nombre: 'Dra. Ana Salazar Bermúdez',
  rol: 'Rol: Comité organizador',
}

function ConsolidatedReviewPage() {
  const { codigo } = useParams()
  const trabajo = reviewsByWork[codigo]
  const consolidado = trabajo ? buildConsolidation(trabajo.reviews) : null

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

          {consolidado ? (
            <>
              <section className={styles.workHeader} aria-labelledby="titulo-trabajo">
                <div>
                  <div className={styles.tags}>
                    <span>{codigo}</span>
                    <span className={styles.status}>
                      En revisión · {consolidado.resumen.totalRevisiones} de {consolidado.resumen.totalRevisiones} entregadas
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
                  <Button variant="primary" type="button">
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
            </>
          ) : (
            <section className={styles.emptyState}>
              <h1>Sin revisiones para este trabajo</h1>
              <p>Cuando los revisores envíen sus evaluaciones, el consolidado aparecerá aquí.</p>
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
