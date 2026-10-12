import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import Button from '../../../core/ui/Button/Button.jsx'
import {
  participantRepository,
  sessionRepository,
} from '../../../core/utils/repositories.js'
import PublicNavigation from '../components/PublicNavigation/PublicNavigation.jsx'
import styles from './RegistrationPage.module.css'

const initialForm = {
  names: 'Rosa María',
  surnames: 'Quispe Ttito',
  email: 'rosa.quispe@aloe.ulima.edu.pe',
  institution: 'Universidad de Lima',
  password: 'Segura2026',
  confirmPassword: 'Segura2026',
  role: 'author',
}

const fieldNames = Object.keys(initialForm)

function validateForm(form) {
  const errors = {}

  if (!form.names.trim()) errors.names = 'Este campo es obligatorio.'
  if (!form.surnames.trim()) errors.surnames = 'Este campo es obligatorio.'
  if (!/^[^\s@]+@aloe\.ulima\.edu\.pe$/i.test(form.email)) {
    errors.email = 'Use un correo institucional válido (@aloe.ulima.edu.pe).'
  }
  if (!form.institution) errors.institution = 'Seleccione una institución.'
  if (form.password.length < 8 || !/[A-Z]/.test(form.password) || !/\d/.test(form.password)) {
    errors.password = 'Mínimo 8 caracteres, con una mayúscula y un número.'
  }
  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden.'
  }
  if (!form.role) errors.role = 'Seleccione un rol.'

  return errors
}

function getPasswordRequirements(form) {
  return [
    { label: 'Mínimo 8 caracteres', valid: form.password.length >= 8 },
    { label: 'Al menos una mayúscula', valid: /[A-Z]/.test(form.password) },
    { label: 'Al menos un número', valid: /\d/.test(form.password) },
    {
      label: 'La confirmación debe coincidir',
      valid: Boolean(form.confirmPassword) && form.password === form.confirmPassword,
    },
  ]
}

function RegistrationPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const errors = validateForm(form)
  const passwordRequirements = getPasswordRequirements(form)

  function handleChange(event) {
    const { checked, name, type, value } = event.target
    const nextValue = type === 'checkbox' ? checked : value

    setForm((currentForm) => ({ ...currentForm, [name]: nextValue }))
    setSaveError('')
  }

  function handleBlur(event) {
    const { name } = event.target
    setTouched((currentTouched) => ({ ...currentTouched, [name]: true }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (saving) return

    setSubmitted(true)
    setTouched(Object.fromEntries(fieldNames.map((fieldName) => [fieldName, true])))

    if (Object.keys(errors).length > 0) return

    const names = form.names.trim()
    const surnames = form.surnames.trim()
    const email = form.email.trim().toLowerCase()
    const name = `${names} ${surnames}`
    const userId = `participant:${email}`
    const participant = {
      userId,
      names,
      surnames,
      name,
      email,
      institution: form.institution,
      role: form.role,
    }

    setSaving(true)
    setSaveError('')

    try {
      await participantRepository.save(participant)
      await sessionRepository.save({ userId, name, role: form.role })
      navigate('/autor')
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
    if (shouldShowError(fieldName)) return styles.invalid
    if (fieldName === 'password' && shouldShowValid(fieldName)) return styles.valid
    return ''
  }

  return (
    <PublicNavigation>
      <main className={styles.main}>
        <section aria-labelledby="registration-title" className={styles.formCard}>
          <div>
            <h1 id="registration-title">Registro de participante</h1>
            <p className={styles.intro}>Los campos marcados con asterisco son obligatorios.</p>
            {submitted && Object.keys(errors).length > 0 && (
              <div aria-live="polite" className={styles.errorSummary} role="alert">
                Revise {Object.keys(errors).length} campos con errores antes de continuar.
              </div>
            )}
            {saveError && <p aria-live="polite" className={styles.saveError} role="alert">{saveError}</p>}
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
                {shouldShowError('names') && <span className={styles.fieldError} id="names-error">{errors.names}</span>}
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="surnames">Apellidos *</label>
                <input
                  aria-describedby={shouldShowError('surnames') ? 'surnames-error' : undefined}
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
                {shouldShowError('surnames') && <span className={styles.fieldError} id="surnames-error">{errors.surnames}</span>}
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="registration-email">Correo institucional *</label>
                <input
                  aria-describedby={shouldShowError('email') ? 'registration-email-error' : undefined}
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
                  <span className={styles.fieldError} id="registration-email-error">{errors.email}</span>
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
                {shouldShowError('institution') && <span className={styles.fieldError}>{errors.institution}</span>}
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="registration-password">Contraseña *</label>
                <input
                  aria-describedby={shouldShowError('password') ? 'password-error' : undefined}
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
                {shouldShowError('password') ? (
                  <span className={styles.fieldError} id="password-error">{errors.password}</span>
                ) : shouldShowValid('password') ? (
                  <span className={styles.validHint}>Contraseña segura.</span>
                ) : (
                  <span>Mínimo 8 caracteres, con una mayúscula y un número.</span>
                )}
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="confirm-password">Confirmar contraseña *</label>
                <input
                  aria-describedby={shouldShowError('confirmPassword') ? 'confirm-password-error' : undefined}
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
                {shouldShowError('confirmPassword') && <span className={styles.fieldError} id="confirm-password-error">{errors.confirmPassword}</span>}
              </div>
              <fieldset className={styles.roleField}>
                <legend>Deseo participar como *</legend>
                <label>
                  <input checked={form.role === 'author'} disabled={saving} name="role" onChange={handleChange} type="radio" value="author" />
                  <span className={styles.roleCopy}><strong>Autor</strong><small>Enviaré uno o más trabajos.</small></span>
                </label>
                <label>
                  <input checked={form.role === 'reviewer'} disabled={saving} name="role" onChange={handleChange} type="radio" value="reviewer" />
                  <span className={styles.roleCopy}><strong>Revisor</strong><small>Evaluaré trabajos asignados.</small></span>
                </label>
                <label>
                  <input checked={form.role === 'both'} disabled={saving} name="role" onChange={handleChange} type="radio" value="both" />
                  <span className={styles.roleCopy}><strong>Ambos</strong><small>Autor y revisor.</small></span>
                </label>
              </fieldset>
              <div className={styles.actions}>
                <Link className={styles.cancel} to="/">Cancelar</Link>
                <Button disabled={saving} loading={saving} type="submit">Crear mi cuenta</Button>
              </div>
            </form>
          </div>
          <aside className={styles.notice}>
            <h2>Requisitos de la contraseña</h2>
            <ul className={styles.requirements}>
              {passwordRequirements.map((requirement) => (
                <li className={requirement.valid ? styles.requirementMet : styles.requirementError} key={requirement.label}>
                  <span aria-hidden="true">{requirement.valid ? '✓' : '×'}</span>
                  {requirement.label}
                </li>
              ))}
            </ul>
          </aside>
        </section>
      </main>
    </PublicNavigation>
  )
}

export default RegistrationPage
