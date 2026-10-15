import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import Button from '../../../core/ui/Button/Button.jsx'
import { authenticateParticipant, getAccountHome, startAccountSession } from '../../../core/utils/accounts.js'
import { sessionPreferencesRepository } from '../../../core/utils/repositories.js'
import useStoredState from '../../../core/utils/useStoredState.js'
import { initialSessionPreferences } from '../../../core/utils/states/sessionPreferencesState.js'
import PublicNavigation from '../components/PublicNavigation/PublicNavigation.jsx'
import styles from './LoginPage.module.css'

function LoginPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [error, setError] = useState(false)
  const [storageError, setStorageError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const preferences = useStoredState(sessionPreferencesRepository, initialSessionPreferences)
  const [rememberOverride, setRememberOverride] = useState(null)
  const remember = rememberOverride ?? preferences.value.remember
  const busy = loading || preferences.loading

  async function handleSubmit(event) {
    event.preventDefault()
    if (busy || preferences.error) return
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email').trim().toLowerCase()
    const password = formData.get('password')
    setLoading(true)
    setError(false)
    setStorageError('')

    try {
      const participant = await authenticateParticipant(email, password)
      if (!participant) {
        setError(true)
        return
      }

      await startAccountSession(participant, remember)
      navigate(getAccountHome(participant.role))
    } catch (cause) {
      setStorageError(cause.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PublicNavigation>
      <main className={styles.main}>
        <section aria-labelledby="login-title" className={styles.card}>
          <h1 id="login-title">Inicio de sesión</h1>
          {location.state?.recoveryMessage && (
            <p className={styles.success} role="status">✓ {location.state.recoveryMessage}</p>
          )}
          <p className={styles.intro}>Ingrese con su correo institucional para enviar o revisar trabajos.</p>
          {error && (
            <div aria-live="polite" className={styles.error} role="alert">
              <strong>El correo o la contraseña no son correctos.</strong> Verifique sus datos e intente nuevamente.
            </div>
          )}
          {preferences.loading && <p role="status">Cargando preferencias de acceso…</p>}
          {(storageError || preferences.error) && <p className={styles.error} role="alert">{storageError || preferences.error}</p>}
          <form aria-busy={busy} onSubmit={handleSubmit}>
            <label htmlFor="email">Correo institucional</label>
            <input aria-describedby={error ? 'login-email-error' : undefined} aria-invalid={error || undefined} autoComplete="username" defaultValue={location.state?.recoveryEmail || 'rosa.quispe@aloe.ulima.edu.pe'} disabled={busy} id="email" name="email" required type="email" />
            {error && <span className={styles.fieldError} id="login-email-error">Verifique su correo institucional.</span>}
            <label htmlFor="password">Contraseña</label>
            <div className={styles.passwordField}>
              <input aria-describedby={error ? 'login-password-error' : undefined} aria-invalid={error || undefined} autoComplete="current-password" disabled={busy} id="password" name="password" required type={showPassword ? 'text' : 'password'} />
              <button aria-controls="password" aria-pressed={showPassword} disabled={busy} onClick={() => setShowPassword(visible => !visible)} type="button">{showPassword ? 'Ocultar' : 'Mostrar'}</button>
            </div>
            {error && <span className={styles.fieldError} id="login-password-error">Verifique su contraseña.</span>}
            <div className={styles.options}>
              <label className={styles.remember}>
                <input checked={remember} disabled={busy} name="remember" onChange={event => setRememberOverride(event.target.checked)} type="checkbox" />
                Recordarme en este equipo
              </label>
              <Link to="/recuperar-contrasena">¿Olvidó su contraseña?</Link>
            </div>
            <Button className={styles.submit} disabled={busy || Boolean(preferences.error)} loading={loading} type="submit">{loading ? 'Ingresando…' : 'Ingresar'}</Button>
          </form>
          <p className={styles.register}>¿No tiene cuenta? <Link to="/registro">Registrarse como participante</Link></p>
        </section>
      </main>
    </PublicNavigation>
  )
}

export default LoginPage
