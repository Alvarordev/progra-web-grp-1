import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import Button from '../../../core/ui/Button/Button.jsx'
import RecoveryConfirmation from '../components/RecoveryConfirmation/RecoveryConfirmation.jsx'
import NewPasswordForm from '../components/NewPasswordForm/NewPasswordForm.jsx'
import PublicNavigation from '../components/PublicNavigation/PublicNavigation.jsx'
import styles from './PasswordRecoveryPage.module.css'

function PasswordRecoveryPage() {
  const location = useLocation()
  const [sentEmail, setSentEmail] = useState('')
  const [isCodeVerified, setIsCodeVerified] = useState(false)
  let currentStep = 1
  if (isCodeVerified) {
    currentStep = 3
  } else if (sentEmail) {
    currentStep = 2
  }

  function getStepClass(step) {
    if (currentStep === step) {
      return styles.activeStep
    }
    if (currentStep > step) {
      return styles.completedStep
    }
    return undefined
  }

  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setSentEmail(formData.get('email').trim())
  }

  return (
    <PublicNavigation>
      <main className={styles.main}>
        <section aria-labelledby="recovery-title" className={styles.card}>
          <ol aria-label="Pasos para recuperar la contraseña" className={styles.steps}>
            {['Correo', 'Envío', 'Nueva contraseña'].map((label, index) => (
              <li
                aria-current={currentStep === index + 1 ? 'step' : undefined}
                className={getStepClass(index + 1)}
                key={label}
              >
                {index + 1}. {label}
              </li>
            ))}
          </ol>

          {isCodeVerified && <NewPasswordForm correo={sentEmail} />}

          {!isCodeVerified && sentEmail && (
            <RecoveryConfirmation
              alVerificar={() => setIsCodeVerified(true)}
              correo={sentEmail}
            />
          )}

          {currentStep === 1 && (
            <>
              <h1 id="recovery-title">Recuperar contraseña</h1>
              <p className={styles.intro}>
                Ingrese el correo con el que se registró. Le enviaremos un enlace para
                crear una nueva contraseña.
              </p>

              <form onSubmit={handleSubmit}>
                <label htmlFor="recovery-email">Correo institucional</label>
                <input
                  autoComplete="email"
                  aria-describedby="recovery-help"
                  defaultValue={
                    location.state?.recoveryEmail || 'rosa.quispe@aloe.ulima.edu.pe'
                  }
                  id="recovery-email"
                  name="email"
                  required
                  type="email"
                />
                <p className={styles.helpText} id="recovery-help">
                  El enlace vence en 30 minutos.
                </p>

                <div className={styles.actions}>
                  <Button className={styles.submit} type="submit">
                    Enviar enlace
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
