import { useState } from 'react'
import Button from '../../../core/ui/Button/Button.jsx'
import ConfigurationPageLayout from '../components/ConfigurationPageLayout/ConfigurationPageLayout.jsx'
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

const initialEdition = {
  editionName: 'VIII Congreso Académico Estudiantil',
  editionYear: '2026',
  editionVenue: 'Auditorio Central, Universidad de Lima — Santiago de Surco',
  editionDescription:
    'Encuentro anual de investigación estudiantil. Se reciben artículos completos, resúmenes extendidos, pósteres y casos de estudio en seis ejes temáticos.',
}

function EditionSettingsPage() {
  const [edition, setEdition] = useState(initialEdition)
  const [estado, setEstado] = useState('Recepción abierta')
  const [feedback, setFeedback] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setEdition((edicionActual) => ({ ...edicionActual, [name]: value }))
    setFeedback('')
  }

  function handleSave(event) {
    event.preventDefault()
    setFeedback('Cambios aplicados temporalmente. No se guardarán al recargar.')
  }

  function handleToggleStatus() {
    const nuevoEstado =
      estado === 'Recepción abierta' ? 'En preparación' : 'Recepción abierta'
    setEstado(nuevoEstado)
    setFeedback(`Estado cambiado temporalmente a «${nuevoEstado}».`)
  }

  return (
    <ConfigurationPageLayout estado={estado}>
      <div className={styles.content}>
        <div className={styles.pageHeading}>
          <div>
            <h1>Configuración de la edición</h1>
            <p>
              Defina la edición vigente antes de abrir la recepción de trabajos.
            </p>
          </div>
          <div className={styles.actions}>
            <Button
              onClick={handleToggleStatus}
              type="button"
              variant="secondary"
            >
              Cambiar estado de la edición
            </Button>
            <Button form="edition-settings-form" type="submit" variant="primary">
              Guardar cambios
            </Button>
          </div>
        </div>

        <p aria-live="polite" className={styles.feedback}>
          {feedback}
        </p>

        <ConfigurationTabs />

        <div className={styles.dashboard}>
          <section
            aria-labelledby="general-title"
            className={`${styles.panel} ${styles.generalPanel}`}
          >
            <div className={styles.panelHeading}>
              <h2 id="general-title">Datos generales</h2>
              <span className={styles.editionStatus}>
                Estado: {estado.toLowerCase()}
              </span>
            </div>

            <form
              className={styles.formGrid}
              id="edition-settings-form"
              onSubmit={handleSave}
            >
              <div className={styles.field}>
                <label htmlFor="edition-name">Nombre de la edición</label>
                <input
                  id="edition-name"
                  name="editionName"
                  onChange={handleChange}
                  value={edition.editionName}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="edition-year">Año</label>
                <input
                  id="edition-year"
                  name="editionYear"
                  onChange={handleChange}
                  value={edition.editionYear}
                />
              </div>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label htmlFor="edition-venue">Sede</label>
                <input
                  id="edition-venue"
                  name="editionVenue"
                  onChange={handleChange}
                  value={edition.editionVenue}
                />
              </div>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label htmlFor="edition-description">Descripción pública</label>
                <textarea
                  id="edition-description"
                  name="editionDescription"
                  onChange={handleChange}
                  rows={4}
                  value={edition.editionDescription}
                  maxLength={400}
                />
                <span className={styles.helperText}>
                  Se muestra en la página pública del congreso. Máximo 400
                  caracteres ({edition.editionDescription.length}/400).
                </span>
              </div>
            </form>
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
              <h2 id="reception-title">{estado}</h2>
              <p>
                {estado === 'Recepción abierta'
                  ? 'Cierra el 30/09/2026 a las 23:59. Mientras esté abierta, los autores pueden editar sus trabajos.'
                  : 'La recepción está en preparación. Los autores no pueden enviar ni editar trabajos.'}
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
    </ConfigurationPageLayout>
  )
}

export default EditionSettingsPage
