import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import Button from '../../../../core/ui/Button/Button.jsx'
import styles from './RecoveryConfirmation.module.css'

const resendDelay = 120

function RecoveryConfirmation({ correo, alVerificar }) {
  const [remainingSeconds, setRemainingSeconds] = useState(resendDelay)
  const [resendCount, setResendCount] = useState(0)
  const [recoveryCode, setRecoveryCode] = useState(createRecoveryCode)
  const [showCodeForm, setShowCodeForm] = useState(false)
  const [codeError, setCodeError] = useState('')
  const [copyMessage, setCopyMessage] = useState('')
  const [expiresAt, setExpiresAt] = useState(() => Date.now() + 30 * 60 * 1000)
  const titleRef = useRef(null)
  const codeRef = useRef(null)

  useEffect(() => {
    if (showCodeForm) codeRef.current?.focus()
  }, [showCodeForm])

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  useEffect(() => {
    if (remainingSeconds === 0) return

    const timeout = window.setTimeout(() => {
      setRemainingSeconds(seconds => Math.max(0, seconds - 1))
    }, 1000)

    return () => window.clearTimeout(timeout)
  }, [remainingSeconds])

  function handleResend() {
    if (remainingSeconds > 0) return
    setResendCount(count => count + 1)
    setRemainingSeconds(resendDelay)
    setRecoveryCode(createRecoveryCode())
    setExpiresAt(Date.now() + 30 * 60 * 1000)
    setCodeError('')
    setCopyMessage('')
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(recoveryCode)
      setCopyMessage('Código copiado.')
    } catch {
      setCopyMessage('No se pudo copiar. Seleccione el código y cópielo manualmente.')
    }
  }

  function handleVerify(event) {
    event.preventDefault()
    const code = new FormData(event.currentTarget).get('code').trim()
    if (Date.now() >= expiresAt) {
      setCodeError('El código venció. Solicite uno nuevo con «Reenviar enlace».')
    } else if (code !== recoveryCode) {
      setCodeError('El código no es correcto. Ingrese el código mostrado en el aviso.')
    } else {
      alVerificar()
    }
  }

  const countdown = `${String(Math.floor(remainingSeconds / 60)).padStart(2, '0')}:${String(remainingSeconds % 60).padStart(2, '0')}`

  return (
    <div className={styles.content}>
      <div className={styles.notice} role="status">
        <span aria-hidden="true" className={styles.icon}>✓</span>
        <div className={styles.noticeContent}>
          <p key={resendCount}>
            {resendCount > 0 ? 'Reenviamos' : 'Enviamos'} el enlace de recuperación a{' '}
            <span className={styles.email}>{correo}</span>.
          </p>
          <div className={styles.codeRow}>
            <span>Código de demostración: <strong className={styles.code}>{recoveryCode}</strong></span>
            <Button onClick={handleCopy} size="small" type="button" variant="secondary">Copiar código</Button>
          </div>
          {copyMessage && <p>{copyMessage}</p>}
        </div>
      </div>

      <h1 id="recovery-title" ref={titleRef} tabIndex={-1}>Revise su correo</h1>
      <p className={styles.description}>
        El enlace vence en 30 minutos. Si no lo encuentra, revise la carpeta de correo no deseado antes de solicitar uno nuevo.
      </p>

      <div className={styles.resend}>
        <Button
          aria-describedby="resend-help"
          disabled={remainingSeconds > 0}
          onClick={handleResend}
          size="small"
          type="button"
          variant="secondary"
        >
          Reenviar enlace
        </Button>
        <Button
          aria-controls="recovery-code-form"
          aria-expanded={showCodeForm}
          onClick={() => setShowCodeForm(visible => !visible)}
          size="small"
          type="button"
          variant="secondary"
        >
          Continuar con código
        </Button>
        <span id="resend-help">
          {remainingSeconds > 0 ? `Podrá reenviarlo en ${countdown} min` : 'Ya puede solicitar un nuevo enlace.'}
        </span>
      </div>

      {showCodeForm && (
        <form className={styles.codeForm} id="recovery-code-form" onSubmit={handleVerify}>
          <label htmlFor="recovery-code">Código de recuperación</label>
          <input
            aria-describedby={codeError ? 'recovery-code-error' : 'recovery-code-help'}
            aria-invalid={Boolean(codeError)}
            autoComplete="one-time-code"
            id="recovery-code"
            inputMode="numeric"
            maxLength={6}
            minLength={6}
            name="code"
            onChange={() => setCodeError('')}
            pattern="[0-9]{6}"
            ref={codeRef}
            required
            type="text"
          />
          <p className={styles.codeHelp} id="recovery-code-help">Ingrese los 6 dígitos del aviso. El código vence en 30 minutos.</p>
          {codeError && <p className={styles.error} id="recovery-code-error" role="alert">{codeError}</p>}
          <Button size="small" type="submit">Verificar código</Button>
        </form>
      )}

      <Link className={styles.loginLink} to="/iniciar-sesion">Volver al inicio de sesión</Link>
    </div>
  )
}

function createRecoveryCode() {
  const values = new Uint32Array(1)
  globalThis.crypto.getRandomValues(values)
  return String(100000 + values[0] % 900000)
}

export default RecoveryConfirmation
