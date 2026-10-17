import useConference from '../../../core/utils/useConference.js'
import { getEditionStatusLabel, getReceptionNotice } from '../../../core/utils/reception.js'
import { useEffect, useState } from 'react'
import { editionRepository, editionStatusRepository, thematicAxesRepository, workTypesRepository, scheduleRepository, criteriaRepository } from '../../../core/utils/repositories.js'
import { initialEdition, initialEditionStatus } from '../../../core/utils/states/editionState.js'
import useStoredState from '../../../core/utils/useStoredState.js'
import { thematicAxes } from '../../../core/utils/states/thematicAxesState.js'
import { initialWorkTypes } from '../../../core/utils/states/workTypesState.js'
import { initialSchedule } from '../../../core/utils/states/scheduleState.js'
import { initialCriteria } from '../../../core/utils/states/criteriaState.js'
import Button from '../../../core/ui/Button/Button.jsx'
import ConfigurationPageLayout from '../components/ConfigurationPageLayout/ConfigurationPageLayout.jsx'
import ConfigurationTabs from '../components/ConfigurationTabs/ConfigurationTabs.jsx'
import CloseReceptionModal from '../components/CloseReceptionModal/CloseReceptionModal.jsx'
import styles from './EditionSettingsPage.module.css'

function EditionSettingsPage() {
  const conference = useConference()
  const [edition, setEdition] = useState(initialEdition)
  const [estado, setEstado] = useState(initialEditionStatus)
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [closeModal, setCloseModal] = useState(false)
  const [closeError, setCloseError] = useState('')
  const axesState = useStoredState(thematicAxesRepository, thematicAxes)
  const typesState = useStoredState(workTypesRepository, initialWorkTypes)
  const scheduleState = useStoredState(scheduleRepository, initialSchedule)
  const criteriaState = useStoredState(criteriaRepository, initialCriteria)
  const totalWeight = criteriaState.value.reduce((sum, item) => sum + item.peso, 0)
  const configurationLoading = [axesState, typesState, scheduleState, criteriaState].some((item) => item.loading)
  const configurationError = [axesState, typesState, scheduleState, criteriaState].find((item) => item.error)?.error
  const configurationSummary = [
    { label: 'Ejes temáticos', value: axesState.value.length, state: axesState.value.length ? 'Listo' : 'Pendiente', status: axesState.value.length ? 'complete' : 'pending' },
    { label: 'Tipos de trabajo', value: typesState.value.length, state: typesState.value.length ? 'Listo' : 'Pendiente', status: typesState.value.length ? 'complete' : 'pending' },
    { label: 'Fechas límite', value: 3, state: scheduleState.error ? 'Pendiente' : 'Listo', status: scheduleState.error ? 'pending' : 'complete' },
    { label: 'Criterios de evaluación', value: criteriaState.value.length, state: totalWeight === 100 ? 'Listo: pesos suman 100' : `Pendiente: pesos suman ${totalWeight}`, status: totalWeight === 100 ? 'complete' : 'pending' },
  ]

  useEffect(() => {
    let active = true

    async function loadSettings() {
      const results = await Promise.allSettled([
        editionRepository.get(),
        editionStatusRepository.get(),
      ])

      if (!active) return

      const [editionResult, statusResult] = results
      if (editionResult.status === 'fulfilled') setEdition(editionResult.value)
      if (statusResult.status === 'fulfilled') setEstado(statusResult.value)

      const failure = results.find((result) => result.status === 'rejected')
      if (failure) setFeedback(failure.reason.message)
      setLoading(false)
    }

    loadSettings()
    return () => { active = false }
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setEdition((edicionActual) => ({ ...edicionActual, [name]: value }))
    setFeedback('')
  }

  async function handleSave(event) {
    event.preventDefault()
    if (loading || saving) return
    if (!edition.editionName.trim() || !edition.editionVenue.trim() || !/^\d{4}$/.test(edition.editionYear) || edition.editionDescription.length > 400) {
      setFeedback('Ingrese un nombre, una sede y un año de cuatro dígitos. La descripción admite hasta 400 caracteres.')
      return
    }
    setSaving(true)
    try {
      await editionRepository.save(edition)
      setFeedback('Cambios guardados en este navegador.')
    } catch (error) {
      setFeedback(error.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleStatus() {
    if (loading || saving || configurationLoading || configurationError) return
    if (!axesState.value.length || !typesState.value.length) {
      setFeedback('Configure al menos un eje temático y un tipo de trabajo antes de abrir o cerrar la recepción.')
      return
    }
    if (estado === 'Recepción abierta') {
      if (totalWeight !== 100) {
        setFeedback('Los criterios deben sumar 100 antes de abrir la etapa de revisión. Ajústelos en «Criterios de evaluación».')
        return
      }
      setCloseError('')
      setCloseModal(true)
      return
    }
    if (estado !== 'En preparación') return
    setSaving(true)
    try {
      await editionStatusRepository.save('Recepción abierta')
      setEstado('Recepción abierta')
      setFeedback('Recepción abierta. Estado guardado en este navegador.')
    } catch (error) {
      setFeedback(error.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleCloseReception() {
    setSaving(true)
    try {
      await editionStatusRepository.save('En revisión')
      setEstado('En revisión')
      setCloseModal(false)
      setFeedback('Recepción cerrada. La edición está en revisión.')
    } catch (error) {
      setCloseError(error.message)
    } finally {
      setSaving(false)
    }
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
              disabled={loading || saving || configurationLoading || Boolean(configurationError) || estado === 'En revisión'}
              type="button"
              variant="secondary"
            >
              {estado === 'En preparación' ? 'Abrir recepción' : estado === 'En revisión' ? 'Recepción cerrada' : 'Cambiar estado de la edición'}
            </Button>
            <Button disabled={loading || saving} form="edition-settings-form" type="submit" variant="primary">
              Guardar cambios
            </Button>
          </div>
        </div>

        <p aria-live="polite" className={styles.feedback}>
          {loading || configurationLoading ? 'Cargando configuración…' : configurationError || feedback}
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
                Estado: {getEditionStatusLabel(estado, scheduleState.value).toLowerCase()}
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
                  disabled={loading || saving}
                  name="editionName"
                  required
                  pattern=".*\S.*"
                  onChange={handleChange}
                  value={edition.editionName}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="edition-year">Año</label>
                <input
                  id="edition-year"
                  disabled={loading || saving}
                  name="editionYear"
                  required
                  pattern="[0-9]{4}"
                  inputMode="numeric"
                  maxLength={4}
                  onChange={handleChange}
                  value={edition.editionYear}
                />
              </div>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label htmlFor="edition-venue">Sede</label>
                <input
                  id="edition-venue"
                  disabled={loading || saving}
                  name="editionVenue"
                  required
                  pattern=".*\S.*"
                  onChange={handleChange}
                  value={edition.editionVenue}
                />
              </div>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label htmlFor="edition-description">Descripción pública</label>
                <textarea
                  id="edition-description"
                  disabled={loading || saving}
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
                      <span>{item.value} · </span>
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
              <h2 id="reception-title">{getEditionStatusLabel(estado, scheduleState.value)}</h2>
              <p>
                {getReceptionNotice(estado, scheduleState.value)}
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
                  <dd>{conference.works.length}</dd>
                </div>
                <div>
                  <dt>Revisores de demostración</dt>
                  <dd>{conference.reviewers.length}</dd>
                </div>
              </dl>
            </section>
          </aside>
        </div>
      </div>
      {closeModal && <CloseReceptionModal alCerrar={() => { if (!saving) setCloseModal(false) }} alConfirmar={handleCloseReception} guardando={saving} error={closeError} />}
    </ConfigurationPageLayout>
  )
}

export default EditionSettingsPage
