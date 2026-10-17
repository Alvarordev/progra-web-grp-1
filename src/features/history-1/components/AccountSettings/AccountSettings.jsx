import { useState } from 'react'
import Button from '../../../../core/ui/Button/Button.jsx'
import styles from '../AccountPanels/AccountPanels.module.css'

function AccountSettings({
  perfil,
  ejes,
  bloqueado,
  alGuardar,
  mostrarIntereses = true,
}) {
  const [draft, setDraft] = useState(perfil)
  const [error, setError] = useState('')
  const availableIds = new Set(ejes.map(axis => axis.id))
  const selectedIds = draft.interestIds.filter(id => availableIds.has(id))

  function handleChange(event) {
    const { name, value } = event.target
    setDraft(current => ({ ...current, [name]: value }))
    setError('')
  }

  function toggleInterest(id) {
    setDraft(current => ({
      ...current,
      interestIds: current.interestIds.includes(id)
        ? current.interestIds.filter(item => item !== id)
        : [...current.interestIds, id],
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (bloqueado) {
      return
    }
    if (!draft.names.trim() || !draft.surnames.trim() || !draft.institution.trim()) {
      setError('Complete nombres, apellidos e institución antes de guardar.')
      return
    }
    alGuardar({
      ...draft,
      names: draft.names.trim(),
      surnames: draft.surnames.trim(),
      institution: draft.institution.trim(),
      interestIds: mostrarIntereses ? selectedIds : draft.interestIds,
    })
  }

  return (
    <form
      className={styles.stack}
      id="account-settings-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <section aria-labelledby="personal-details-title" className={styles.panel}>
        <h2 id="personal-details-title">Datos personales</h2>
        <div className={styles.fields}>
          <div className={styles.field}>
            <label htmlFor="reviewer-names">Nombres</label>
            <input
              autoComplete="given-name"
              disabled={bloqueado}
              id="reviewer-names"
              name="names"
              onChange={handleChange}
              required
              value={draft.names}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="reviewer-surnames">Apellidos</label>
            <input
              autoComplete="family-name"
              disabled={bloqueado}
              id="reviewer-surnames"
              name="surnames"
              onChange={handleChange}
              required
              value={draft.surnames}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="reviewer-email">Correo institucional</label>
            <input
              aria-describedby="reviewer-email-help"
              id="reviewer-email"
              readOnly
              type="email"
              value={draft.email}
            />
            <p className={styles.help} id="reviewer-email-help">
              Para cambiarlo, escriba al comité organizador.
            </p>
          </div>
          <div className={styles.field}>
            <label htmlFor="reviewer-institution">Institución</label>
            <input
              autoComplete="organization"
              disabled={bloqueado}
              id="reviewer-institution"
              name="institution"
              onChange={handleChange}
              required
              value={draft.institution}
            />
          </div>
        </div>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
      </section>

      {mostrarIntereses && (
        <section aria-labelledby="reviewer-interests-title" className={styles.panel}>
          <div className={styles.panelHeading}>
            <h2 id="reviewer-interests-title">Líneas de interés como revisor</h2>
            <span className={styles.help}>
              {selectedIds.length} de {ejes.length} seleccionadas
            </span>
          </div>
          <p className={styles.description}>
            Las asignaciones priorizan sus líneas declaradas.
          </p>
          <div aria-label="Líneas de interés" className={styles.interestOptions}>
            {ejes.map(axis => {
              const selected = selectedIds.includes(axis.id)
              return (
                <Button
                  aria-pressed={selected}
                  className={`${styles.interest} ${selected ? styles.selected : ''}`}
                  disabled={bloqueado}
                  key={axis.id}
                  onClick={() => toggleInterest(axis.id)}
                  size="small"
                  type="button"
                  variant="secondary"
                >
                  {axis.nombre}
                  {selected && <span aria-hidden="true"> ✓</span>}
                </Button>
              )
            })}
          </div>
          {ejes.length === 0 && (
            <p className={styles.help}>
              El comité todavía no ha configurado ejes temáticos.
            </p>
          )}
        </section>
      )}
    </form>
  )
}

export default AccountSettings
