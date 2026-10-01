import Button from '../../../core/ui/Button/Button.jsx'
import CommitteeNavigation from '../../../core/ui/CommitteeNavigation/CommitteeNavigation.jsx'
import Footer from '../../../core/ui/Footer/Footer.jsx'
import Header from '../../../core/ui/Header/Header.jsx'
import ConfigurationTabs from '../components/ConfigurationTabs/ConfigurationTabs.jsx'
import styles from './EditionSettingsPage.module.css'

const configurationSummary = [
  { label: 'Ejes temáticos', value: '6', state: 'Listo', status: 'complete' },
  { label: 'Tipos de trabajo', value: '4', state: 'Listo', status: 'complete' },
  { label: 'Fechas límite', value: '3', state: 'Listo', status: 'complete' },
  {
    label: 'Criterios de evaluación',
    value: '',
    state: 'Pendiente: pesos suman 95',
    status: 'pending',
  },
]

function EditionSettingsPage() {
  return (
    <div className={styles.page}>
      <Header estado="Recepción abierta" />

      <CommitteeNavigation
        rutaActiva="/configuracion"
        usuario={{
          iniciales: 'AS',
          nombre: 'Dra. Ana Salazar Bermúdez',
          rol: 'Rol: Comité organizador',
        }}
      />

      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.pageHeading}>
            <div>
              <h1>Configuración de la edición</h1>
              <p>
                Defina la edición vigente antes de abrir la recepción de
                trabajos.
              </p>
            </div>
            <div className={styles.actions}>
              <Button variant="secondary">
                Cambiar estado de la edición
              </Button>
              <Button variant="primary">Guardar cambios</Button>
            </div>
          </div>

          <ConfigurationTabs />

          <div className={styles.dashboard}>
            <section
              aria-labelledby="general-title"
              className={`${styles.panel} ${styles.generalPanel}`}
            >
              <div className={styles.panelHeading}>
                <h2 id="general-title">Datos generales</h2>
                <span className={styles.editionStatus}>
                  Estado: recepción abierta
                </span>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label htmlFor="edition-name">Nombre de la edición</label>
                  <input
                    id="edition-name"
                    name="editionName"
                    readOnly
                    value="VIII Congreso Académico Estudiantil"
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="edition-year">Año</label>
                  <input
                    id="edition-year"
                    name="editionYear"
                    readOnly
                    value="2026"
                  />
                </div>
                <div className={`${styles.field} ${styles.fullWidth}`}>
                  <label htmlFor="edition-venue">Sede</label>
                  <input
                    id="edition-venue"
                    name="editionVenue"
                    readOnly
                    value="Auditorio Central, Universidad de Lima — Santiago de Surco"
                  />
                </div>
                <div className={`${styles.field} ${styles.fullWidth}`}>
                  <label htmlFor="edition-description">Descripción pública</label>
                  <textarea
                    id="edition-description"
                    name="editionDescription"
                    readOnly
                    rows={4}
                    value="Encuentro anual de investigación estudiantil. Se reciben artículos completos, resúmenes extendidos, pósteres y casos de estudio en seis ejes temáticos."
                  />
                  <span className={styles.helperText}>
                    Se muestra en la página pública del congreso. Máximo 400
                    caracteres.
                  </span>
                </div>
              </div>
            </section>

            <aside className={styles.sideColumn}>
              <section
                aria-labelledby="summary-title"
                className={`${styles.panel} ${styles.summaryPanel}`}
              >
                <h2 className={styles.panelEyebrow} id="summary-title">
                  Resumen de lo configurado
                </h2>
                <ul className={styles.summaryList}>
                  {configurationSummary.map((item) => (
                    <li className={styles.summaryRow} key={item.label}>
                      <span>{item.label}</span>
                      <span className={styles.summaryValue}>
                        {item.value && <span>{item.value} · </span>}
                        <span className={styles[item.status]}>{item.state}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <section
                aria-labelledby="reception-title"
                className={styles.receptionNotice}
              >
                <h2 id="reception-title">Recepción abierta</h2>
                <p>
                  Cierra el 30/09/2026 a las 23:59. Mientras esté abierta, los
                  autores pueden editar sus trabajos.
                </p>
              </section>

              <section
                aria-labelledby="activity-title"
                className={`${styles.panel} ${styles.activityPanel}`}
              >
                <h2 className={styles.panelEyebrow} id="activity-title">
                  Actividad
                </h2>
                <dl className={styles.activityList}>
                  <div>
                    <dt>Trabajos recibidos</dt>
                    <dd>14</dd>
                  </div>
                  <div>
                    <dt>Revisores registrados</dt>
                    <dd>9</dd>
                  </div>
                </dl>
              </section>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default EditionSettingsPage
