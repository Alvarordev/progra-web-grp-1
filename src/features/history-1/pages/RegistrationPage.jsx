import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import Button from '../../../core/ui/Button/Button.jsx'
import {
  getAccountHome,
  registerParticipant,
  startAccountSession,
} from '../../../core/utils/accounts.js'
import { requiresAcademicDetails } from '../../../core/utils/states/participantState.js'
import {
  initialRegistrationForm,
  validateRegistrationForm,
  getRegistrationPasswordRequirements,
  getRegistrationParticipant,
} from '../utils/registrationForm.js'
import PublicNavigation from '../components/PublicNavigation/PublicNavigation.jsx'
import AcademicFields from '../components/AcademicFields/AcademicFields.jsx'
import styles from './RegistrationPage.module.css'

const fieldNames = Object.keys(initialRegistrationForm)

function RegistrationPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialRegistrationForm)
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const errors = validateRegistrationForm(form)
  const passwordRequirements = getRegistrationPasswordRequirements(form)

  function handleChange(event) {
    const { checked, name, type, value } = event.target
    const nextValue = type === 'checkbox' ? checked : value

    setForm(currentForm => ({
      ...currentForm,
      [name]: nextValue,
      ...(name === 'role' && value === 'reviewer' ? { degree: '', studentCode: '' } : {}),
    }))
    setSaveError('')
  }

  function handleBlur(event) {
    if (!submitted) {
      return
    }
    const { name } = event.target
    setTouched(currentTouched => ({ ...currentTouched, [name]: true }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (saving) {
      return
    }

    setSubmitted(true)
    setTouched(Object.fromEntries(fieldNames.map(fieldName => [fieldName, true])))

    if (Object.keys(errors).length > 0) {
      return
    }

    const participant = getRegistrationParticipant(form)

    setSaving(true)
    setSaveError('')

    try {
      await registerParticipant(participant, form.password)
      await startAccountSession(participant)
      navigate(getAccountHome(form.role), { state: { accountCreated: true } })
    } catch (error) {
      setSaveError(error.message)
    } finally {
      setSaving(false)
    }
  }

  function shouldShowError(fieldName) {
    return Boolean(errors[fieldName] && (submitted || touched[fieldName]))
  }

  function shouldShowValid(fieldName) {
    return Boolean(!errors[fieldName] && (submitted || touched[fieldName]))
  }

  function getControlClassName(fieldName) {
    if (shouldShowError(fieldName)) {
      return styles.invalid
    }
    if (fieldName === 'password' && shouldShowValid(fieldName)) {
      return styles.valid
    }
    return ''
  }

  function renderPasswordHint() {
    if (shouldShowError('password')) {
      return (
        <span className={styles.fieldError} id="password-error">
          {errors.password}
        </span>
      )
    }
    if (shouldShowValid('password')) {
      return <span className={styles.validHint}>Contraseña segura.</span>
    }
    return <span>Mínimo 8 caracteres, con una mayúscula y un número.</span>
  }

  return (
    <PublicNavigation>
      <main className={styles.main}>
        <section aria-labelledby="registration-title" className={styles.formCard}>
          <div>
            <h1 id="registration-title">Registro de participante</h1>
            <p className={styles.intro}>
              Los campos marcados con asterisco son obligatorios.
            </p>
            {submitted && Object.keys(errors).length > 0 && (
              <div aria-live="polite" className={styles.errorSummary} role="alert">
                Revise {Object.keys(errors).length} campos con errores antes de continuar.
              </div>
            )}
            {saveError && (
              <p aria-live="polite" className={styles.saveError} role="alert">
                {saveError}
              </p>
            )}
            <form aria-busy={saving} noValidate onSubmit={handleSubmit}>
              <div className={styles.fieldGroup}>
                <label htmlFor="names">Nombres *</label>
                <input
                  aria-describedby={shouldShowError('names') ? 'names-error' : undefined}
                  aria-invalid={shouldShowError('names') || undefined}
                  className={getControlClassName('names')}
                  id="names"
                  name="names"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={saving}
                  required
                  value={form.names}
                />
                {shouldShowError('names') && (
                  <span className={styles.fieldError} id="names-error">
                    {errors.names}
                  </span>
                )}
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="surnames">Apellidos *</label>
                <input
                  aria-describedby={
                    shouldShowError('surnames') ? 'surnames-error' : undefined
                  }
                  aria-invalid={shouldShowError('surnames') || undefined}
                  className={getControlClassName('surnames')}
                  id="surnames"
                  name="surnames"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={saving}
                  required
                  value={form.surnames}
                />
                {shouldShowError('surnames') && (
                  <span className={styles.fieldError} id="surnames-error">
                    {errors.surnames}
                  </span>
                )}
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="registration-email">Correo institucional *</label>
                <input
                  aria-describedby={
                    shouldShowError('email') ? 'registration-email-error' : undefined
                  }
                  aria-invalid={shouldShowError('email') || undefined}
                  className={getControlClassName('email')}
                  id="registration-email"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={saving}
                  required
                  type="email"
                  value={form.email}
                />
                {shouldShowError('email') ? (
                  <span className={styles.fieldError} id="registration-email-error">
                    {errors.email}
                  </span>
                ) : (
                  <span>Se usará para todas las notificaciones.</span>
                )}
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="institution">Institución *</label>
                <select
                  aria-invalid={shouldShowError('institution') || undefined}
                  className={getControlClassName('institution')}
                  id="institution"
                  name="institution"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={saving}
                  required
                  value={form.institution}
                >
                  <option>Universidad de Lima</option>
                  <option>Pontificia Universidad Católica del Perú</option>
                  <option>Universidad Nacional de Ingeniería</option>
                </select>
                {shouldShowError('institution') && (
                  <span className={styles.fieldError}>{errors.institution}</span>
                )}
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="registration-password">Contraseña *</label>
                <input
                  aria-describedby={
                    shouldShowError('password') ? 'password-error' : undefined
                  }
                  aria-invalid={shouldShowError('password') || undefined}
                  className={getControlClassName('password')}
                  id="registration-password"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={saving}
                  required
                  type="password"
                  value={form.password}
                />
                {renderPasswordHint()}
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="confirm-password">Confirmar contraseña *</label>
                <input
                  aria-describedby={
                    shouldShowError('confirmPassword')
                      ? 'confirm-password-error'
                      : undefined
                  }
                  aria-invalid={shouldShowError('confirmPassword') || undefined}
                  className={getControlClassName('confirmPassword')}
                  id="confirm-password"
                  name="confirmPassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={saving}
                  required
                  type="password"
                  value={form.confirmPassword}
                />
                {shouldShowError('confirmPassword') && (
                  <span className={styles.fieldError} id="confirm-password-error">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
              {requiresAcademicDetails(form.role) && (
                <AcademicFields
                  alCambiar={handleChange}
                  alSalir={handleBlur}
                  bloqueado={saving}
                  campos={form}
                  conErrores={shouldShowError}
                  errores={errors}
                />
              )}
              <fieldset className={styles.roleField}>
                <legend>Deseo participar como *</legend>
                <label>
                  <input
                    checked={form.role === 'author'}
                    disabled={saving}
                    name="role"
                    onChange={handleChange}
                    type="radio"
                    value="author"
                  />
                  <span className={styles.roleCopy}>
                    <strong>Autor</strong>
                    <small>Enviaré uno o más trabajos.</small>
                  </span>
                </label>
                <label>
                  <input
                    checked={form.role === 'reviewer'}
                    disabled={saving}
                    name="role"
                    onChange={handleChange}
                    type="radio"
                    value="reviewer"
                  />
                  <span className={styles.roleCopy}>
                    <strong>Revisor</strong>
                    <small>Evaluaré trabajos asignados.</small>
                  </span>
                </label>
                <label>
                  <input
                    checked={form.role === 'both'}
                    disabled={saving}
                    name="role"
                    onChange={handleChange}
                    type="radio"
                    value="both"
                  />
                  <span className={styles.roleCopy}>
                    <strong>Ambos</strong>
                    <small>Autor y revisor.</small>
                  </span>
                </label>
              </fieldset>
              <div className={styles.actions}>
                <div className={styles.agreement}>
                  <label>
                    <input
                      aria-describedby={
                        shouldShowError('acceptedTerms') ? 'terms-error' : undefined
                      }
                      aria-invalid={shouldShowError('acceptedTerms') || undefined}
                      checked={form.acceptedTerms}
                      disabled={saving}
                      name="acceptedTerms"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      required
                      type="checkbox"
                    />
                    <span>
                      Acepto las{' '}
                      <Link rel="noreferrer" target="_blank" to="/bases">
                        bases del congreso y el tratamiento de mis datos
                      </Link>
                      . *
                    </span>
                  </label>
                  {shouldShowError('acceptedTerms') && (
                    <span className={styles.fieldError} id="terms-error">
                      {errors.acceptedTerms}
                    </span>
                  )}
                </div>
                <Link className={styles.cancel} to="/">
                  Cancelar
                </Link>
                <Button disabled={saving} loading={saving} type="submit">
                  Crear mi cuenta
                </Button>
              </div>
            </form>
          </div>
          <aside className={styles.notice}>
            {submitted || Object.values(touched).some(Boolean) ? (
              <>
                <h2>Requisitos de la contraseña</h2>
                <ul className={styles.requirements}>
                  {passwordRequirements.map(requirement => (
                    <li
                      className={
                        requirement.valid
                          ? styles.requirementMet
                          : styles.requirementError
                      }
                      key={requirement.label}
                    >
                      <span aria-hidden="true">{requirement.valid ? '✓' : '×'}</span>
                      {requirement.label}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <h2>Antes de registrarse</h2>
                <p>
                  La recepción de trabajos cierra el 15/12/2026 a las 23:59. Después de
                  esa fecha no será posible editar los envíos.
                </p>
                <p>
                  Si participa como revisor, deberá declarar sus líneas de interés para
                  recibir asignaciones sin conflicto.
                </p>
              </>
            )}
          </aside>
        </section>
      </main>
    </PublicNavigation>
  )
}

export default RegistrationPage
