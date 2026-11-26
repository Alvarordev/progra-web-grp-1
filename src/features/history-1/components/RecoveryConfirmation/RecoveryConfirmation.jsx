import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import Button from '../../../../core/ui/Button/Button.jsx'
import {
  solicitarRecuperacion,
  verificarCodigo,
} from '../../../../core/utils/usuariosApi.js'
import styles from './RecoveryConfirmation.module.css'

function RecoveryConfirmation({ correo, alVerificar }) {
  const [segundos, setSegundos] = useState(120)
  const [reenvios, setReenvios] = useState(0)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const titulo = useRef(null)
  const campoCodigo = useRef(null)

  useEffect(() => {
    titulo.current?.focus()
  }, [])
  useEffect(() => {
    if (mostrarFormulario) {
      campoCodigo.current?.focus()
    }
  }, [mostrarFormulario])
  useEffect(() => {
    if (segundos === 0) {
      return
    }
    const temporizador = window.setTimeout(
      () => setSegundos(actual => Math.max(0, actual - 1)),
      1000
    )
    return () => window.clearTimeout(temporizador)
  }, [segundos])

  const reenviarCodigo = async () => {
    if (segundos > 0 || enviando) {
      return
    }
    setEnviando(true)
    setError('')
    try {
      await solicitarRecuperacion(correo)
      setReenvios(actual => actual + 1)
      setSegundos(120)
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  const comprobarCodigo = async event => {
    event.preventDefault()
    if (enviando) {
      return
    }
    const codigo = new FormData(event.currentTarget).get('code').trim()
    setEnviando(true)
    setError('')
    try {
      const resultado = await verificarCodigo(correo, codigo)
      alVerificar(resultado.token)
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  const contador = `${String(Math.floor(segundos / 60)).padStart(2, '0')}:${String(segundos % 60).padStart(2, '0')}`

  return (
    <div className={styles.content}>
      <div className={styles.notice} role="status">
        <span aria-hidden="true" className={styles.icon}>
          ✓
        </span>
        <p key={reenvios}>
          Si la cuenta existe, recibirá un código en{' '}
          <span className={styles.email}>{correo}</span>.
        </p>
      </div>
      <h1 id="recovery-title" ref={titulo} tabIndex={-1}>
        Revise su correo
      </h1>
      <p className={styles.description}>
        El código vence en 30 minutos. Revise también la carpeta de correo no deseado.
      </p>
      <div className={styles.resend}>
        <Button
          disabled={segundos > 0 || enviando}
          onClick={reenviarCodigo}
          size="small"
          type="button"
          variant="secondary"
        >
          Reenviar código
        </Button>
        <Button
          aria-controls="recovery-code-form"
          aria-expanded={mostrarFormulario}
          disabled={enviando}
          onClick={() => setMostrarFormulario(actual => !actual)}
          size="small"
          type="button"
          variant="secondary"
        >
          Continuar con código
        </Button>
        <span>
          {segundos > 0
            ? `Podrá reenviarlo en ${contador} min`
            : 'Ya puede solicitar un código nuevo.'}
        </span>
      </div>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      {mostrarFormulario && (
        <form
          className={styles.codeForm}
          id="recovery-code-form"
          onSubmit={comprobarCodigo}
          aria-busy={enviando}
        >
          <label htmlFor="recovery-code">Código de recuperación</label>
          <input
            aria-describedby="recovery-code-help"
            aria-invalid={Boolean(error)}
            autoComplete="one-time-code"
            id="recovery-code"
            inputMode="numeric"
            minLength={6}
            maxLength={6}
            name="code"
            pattern="[0-9]{6}"
            onChange={() => setError('')}
            ref={campoCodigo}
            required
            type="text"
            disabled={enviando}
          />
          <p className={styles.codeHelp} id="recovery-code-help">
            Ingrese los 6 dígitos recibidos por correo.
          </p>
          <Button size="small" type="submit" loading={enviando} disabled={enviando}>
            Verificar código
          </Button>
        </form>
      )}
      <Link className={styles.loginLink} to="/iniciar-sesion">
        Volver al inicio de sesión
      </Link>
    </div>
  )
}

export default RecoveryConfirmation
