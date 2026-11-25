import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import Button from '../../../core/ui/Button/Button.jsx'
import { solicitarRecuperacion } from '../../../core/utils/usuariosApi.js'
import RecoveryConfirmation from '../components/RecoveryConfirmation/RecoveryConfirmation.jsx'
import NewPasswordForm from '../components/NewPasswordForm/NewPasswordForm.jsx'
import PublicNavigation from '../components/PublicNavigation/PublicNavigation.jsx'
import styles from './PasswordRecoveryPage.module.css'

function PasswordRecoveryPage() {
  const location = useLocation()
  const [correoEnviado, setCorreoEnviado] = useState('')
  const [token, setToken] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  let pasoActual = 1
  if (token) {
    pasoActual = 3
  } else if (correoEnviado) {
    pasoActual = 2
  }
  const obtenerClasePaso = paso => {
    if (pasoActual === paso) {
      return styles.activeStep
    }
    if (pasoActual > paso) {
      return styles.completedStep
    }
    return undefined
  }

  const enviarCorreo = async event => {
    event.preventDefault()
    if (enviando) {
      return
    }
    const correo = new FormData(event.currentTarget).get('email').trim()
    setEnviando(true)
    setError('')
    try {
      await solicitarRecuperacion(correo)
      setCorreoEnviado(correo)
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <PublicNavigation>
      <main className={styles.main}>
        <section aria-labelledby="recovery-title" className={styles.card}>
          <ol aria-label="Pasos para recuperar la contraseña" className={styles.steps}>
            {['Correo', 'Envío', 'Nueva contraseña'].map((etiqueta, indice) => (
              <li
                key={etiqueta}
                aria-current={pasoActual === indice + 1 ? 'step' : undefined}
                className={obtenerClasePaso(indice + 1)}
              >
                {indice + 1}. {etiqueta}
              </li>
            ))}
          </ol>
          {token && <NewPasswordForm correo={correoEnviado} token={token} />}
          {!token && correoEnviado && (
            <RecoveryConfirmation correo={correoEnviado} alVerificar={setToken} />
          )}
          {pasoActual === 1 && (
            <>
              <h1 id="recovery-title">Recuperar contraseña</h1>
              <p className={styles.intro}>
                Ingrese el correo de su cuenta. Le enviaremos un código para crear una
                nueva contraseña.
              </p>
              {error && <p role="alert">{error}</p>}
              <form onSubmit={enviarCorreo} aria-busy={enviando}>
                <label htmlFor="recovery-email">Correo institucional</label>
                <input
                  autoComplete="email"
                  aria-describedby="recovery-help"
                  defaultValue={location.state?.recoveryEmail || ''}
                  disabled={enviando}
                  id="recovery-email"
                  name="email"
                  required
                  type="email"
                />
                <p className={styles.helpText} id="recovery-help">
                  El código vence en 30 minutos.
                </p>
                <div className={styles.actions}>
                  <Button
                    className={styles.submit}
                    type="submit"
                    loading={enviando}
                    disabled={enviando}
                  >
                    Enviar código
                  </Button>
                  <Link className={styles.back} to="/iniciar-sesion">
                    Volver
                  </Link>
                </div>
              </form>
            </>
          )}
        </section>
      </main>
    </PublicNavigation>
  )
}

export default PasswordRecoveryPage
