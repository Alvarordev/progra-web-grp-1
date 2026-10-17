import { useState } from 'react'
import { Link } from 'react-router'
import Button from '../../../../core/ui/Button/Button.jsx'
import { demoCredentialsRepository } from '../../../../core/utils/repositories.js'
import { createPasswordCredential, getPasswordRequirements, verifyPasswordCredential } from '../../../../core/utils/passwords.js'
import styles from '../AccountPanels/AccountPanels.module.css'

const initialFields = { currentPassword: '', password: '', confirmation: '' }

function ChangePasswordPanel({ correo, bloqueado, alCambiarEstado }) {
  const [fields, setFields] = useState(initialFields)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [needsRecovery, setNeedsRecovery] = useState(false)

  function handleChange(event) {
    setFields(current => ({ ...current, [event.target.name]: event.target.value }))
    setError('')
    setSuccess('')
    setNeedsRecovery(false)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (bloqueado || saving) return
    setError('')
    setSuccess('')
    if (!fields.currentPassword || !getPasswordRequirements(fields.password).every(item => item.valid) || fields.password !== fields.confirmation) {
      setError('Ingrese su contraseña actual y una nueva de al menos 8 caracteres, con una mayúscula y un número. La confirmación debe coincidir.')
      return
    }
    setSaving(true)
    alCambiarEstado(true)
    try {
      const credentials = await demoCredentialsRepository.get()
      const email = correo.trim().toLowerCase()
      const current = credentials.find(item => item.email === email)
      if (!current) {
        setNeedsRecovery(true)
        throw new Error('Primero establezca su contraseña local desde «Recuperar contraseña».')
      }
      if (!await verifyPasswordCredential(fields.currentPassword, current)) {
        throw new Error('La contraseña actual no es correcta.')
      }
      const next = await createPasswordCredential(email, fields.password)
      await demoCredentialsRepository.save([...credentials.filter(item => item.email !== email), next])
      setFields(initialFields)
      setSuccess('Contraseña actualizada en este navegador.')
    } catch (cause) {
      setError(cause.message)
    } finally {
      setSaving(false)
      alCambiarEstado(false)
    }
  }

  return (
    <section aria-labelledby="change-password-title" className={styles.panel}>
      <h2 id="change-password-title">Cambiar contraseña</h2>
      <form aria-busy={saving} className={styles.passwordForm} noValidate onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="account-current-password">Contraseña actual</label>
          <input autoComplete="current-password" disabled={bloqueado || saving} id="account-current-password" name="currentPassword" onChange={handleChange} required type="password" value={fields.currentPassword} />
        </div>
        <div className={styles.field}>
          <label htmlFor="account-new-password">Nueva contraseña</label>
          <input aria-describedby="account-password-help" autoComplete="new-password" disabled={bloqueado || saving} id="account-new-password" name="password" onChange={handleChange} required type="password" value={fields.password} />
          <p className={styles.help} id="account-password-help">Mínimo 8 caracteres, con una mayúscula y un número.</p>
        </div>
        <div className={styles.field}>
          <label htmlFor="account-confirm-password">Confirmar nueva contraseña</label>
          <input autoComplete="new-password" disabled={bloqueado || saving} id="account-confirm-password" name="confirmation" onChange={handleChange} required type="password" value={fields.confirmation} />
        </div>
        {error && <p className={styles.error} role="alert">{error}</p>}
        {needsRecovery && <Link state={{ recoveryEmail: correo }} to="/recuperar-contrasena">Recuperar contraseña</Link>}
        {success && <p className={styles.success} role="status">✓ {success}</p>}
        <Button disabled={bloqueado || saving} loading={saving} type="submit" variant="secondary">Actualizar contraseña</Button>
      </form>
    </section>
  )
}

export default ChangePasswordPanel
