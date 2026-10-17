import { useState } from 'react'
import Button from '../../../core/ui/Button/Button.jsx'
import useStoredState from '../../../core/utils/useStoredState.js'
import { scheduleRepository } from '../../../core/utils/repositories.js'
import { initialSchedule, getScheduleErrors, formatScheduleDate } from '../../../core/utils/states/scheduleState.js'
import ConfigurationPageLayout from '../components/ConfigurationPageLayout/ConfigurationPageLayout.jsx'
import ConfigurationFeedback from '../components/ConfigurationFeedback/ConfigurationFeedback.jsx'
import ConfigurationTabs from '../components/ConfigurationTabs/ConfigurationTabs.jsx'
import styles from './SchedulePage.module.css'

const scheduleFields = [
  { name: 'reception', label: 'Cierre de recepción de trabajos', preview: 'Recepción' },
  { name: 'review', label: 'Cierre de la etapa de revisión', preview: 'Revisión' },
  { name: 'publication', label: 'Publicación de resultados', preview: 'Resultados' },
]

function SchedulePage() {
  const { value, loading, saving, error, save } = useStoredState(scheduleRepository, initialSchedule)
  const [draft, setDraft] = useState(null)
  const [feedback, setFeedback] = useState('')
  const schedule = draft ?? value
  const errors = getScheduleErrors(schedule)
  const invalid = Object.keys(errors).length > 0

  function handleChange(name, part, nextValue) {
    const [date, time] = schedule[name].split('T')
    const nextDate = part === 'date' ? nextValue : date
    const nextTime = part === 'time' ? nextValue : time
    setDraft({ ...schedule, [name]: `${nextDate}T${nextTime}` })
    setFeedback('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (invalid || loading || saving) return
    try {
      await save(schedule)
      setDraft(null)
      setFeedback('Cronograma guardado correctamente.')
    } catch { setFeedback('') }
  }

  return (
    <ConfigurationPageLayout>
      <div className={styles.content}>
        <header className={styles.pageHeading}>
          <div>
            <h1>Fechas límite</h1>
            <p>Las fechas deben ser consecutivas: recepción, revisión y publicación.</p>
          </div>
          <Button form="schedule-form" type="submit" disabled={loading || invalid} loading={saving}>
            Guardar cronograma
          </Button>
        </header>
        <ConfigurationTabs />
        <ConfigurationFeedback cargando={loading ? 'Cargando cronograma…' : ''} error={error} mensaje={feedback} />
        <ConfigurationFeedback error={!loading && !error && invalid ? 'El cronograma no es válido. Corrija las fechas y horas marcadas para guardar.' : ''} />
        <div className={styles.dashboard}>
          <form id="schedule-form" onSubmit={handleSubmit} className={styles.panel}>
            <fieldset className={styles.fields} disabled={loading || saving}>
              <legend className={styles.visuallyHidden}>Fechas y horas del cronograma</legend>
              {scheduleFields.map((field) => (
                <div key={field.name}>
                  <div className={styles.dateRow}>
                    <div className={styles.field}>
                      <label htmlFor={`${field.name}-date`}>{field.label} *</label>
                      <input id={`${field.name}-date`} type="date" required
                        value={schedule[field.name].split('T')[0]}
                        aria-invalid={Boolean(errors[field.name])}
                        aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
                        onChange={(event) => handleChange(field.name, 'date', event.target.value)} />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor={`${field.name}-time`}>Hora *</label>
                      <input id={`${field.name}-time`} type="time" required
                        value={schedule[field.name].split('T')[1] ?? ''}
                        aria-invalid={Boolean(errors[field.name])}
                        aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
                        onChange={(event) => handleChange(field.name, 'time', event.target.value)} />
                    </div>
                  </div>
                  {errors[field.name] && <p id={`${field.name}-error`} className={styles.fieldError}>{errors[field.name]}</p>}
                </div>
              ))}
            </fieldset>
            {!loading && !error && !invalid && <ConfigurationFeedback mensaje="Cronograma válido: las tres fechas son consecutivas." />}
          </form>
          <aside className={styles.panel} aria-labelledby="schedule-preview">
            <h2 id="schedule-preview">Vista previa pública</h2>
            <dl className={styles.preview}>
              {scheduleFields.map((field) => (
                <div key={field.name}>
                  <dt>{field.preview}</dt>
                  <dd>{errors[field.name] ? 'Fecha pendiente' : `${formatScheduleDate(schedule[field.name])} · ${schedule[field.name].slice(11)}`}</dd>
                </div>
              ))}
            </dl>
            <p className={styles.helperText}>Al guardar, se actualiza el aviso de recepción en la configuración de la edición. Horario local del congreso (Lima).</p>
          </aside>
        </div>
      </div>
    </ConfigurationPageLayout>
  )
}

export default SchedulePage
