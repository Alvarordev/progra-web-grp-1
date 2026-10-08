import { useState } from 'react'
import { Link } from 'react-router'
import Button from '../../../core/ui/Button/Button.jsx'
import PublicNavigation from '../components/PublicNavigation/PublicNavigation.jsx'
import styles from './LoginPage.module.css'

function LoginPage() {
  const [error, setError] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setError(true)
  }

  return (
    <PublicNavigation>
      <main className={styles.main}>
        <section aria-labelledby="login-title" className={styles.card}>
          <h1 id="login-title">Inicio de sesión</h1>
          <p className={styles.intro}>Ingrese con su correo institucional para enviar o revisar trabajos.</p>
          {error && (
            <div aria-live="polite" className={styles.error} role="alert">
              <strong>El correo o la contraseña no son correctos.</strong> Le quedan 3 intentos antes del bloqueo temporal.
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Correo institucional</label>
            <input defaultValue="rosa.quispe@aloe.ulima.edu.pe" id="email" name="email" required type="email" />
            {error && <span className={styles.fieldError}>Verifique su correo institucional.</span>}
            <label htmlFor="password">Contraseña</label>
            <div className={styles.passwordField}>
              <input defaultValue="congreso2026" id="password" name="password" required type="password" />
              <button type="button">Mostrar</button>
            </div>
            {error && <span className={styles.fieldError}>Verifique su contraseña.</span>}
            <div className={styles.options}>
              <label className={styles.remember}>
                <input type="checkbox" />
                Recordarme en este equipo
              </label>
              <Link to="/recuperar-contrasena">¿Olvidó su contraseña?</Link>
            </div>
            <Button className={styles.submit} type="submit">Ingresar</Button>
          </form>
          <p className={styles.register}>¿No tiene cuenta? <Link to="/registro">Registrarse como participante</Link></p>
        </section>
      </main>
    </PublicNavigation>
  )
}

export default LoginPage
