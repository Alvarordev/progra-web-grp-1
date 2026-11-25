import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import Button from '../../../../core/ui/Button/Button.jsx'
import { restablecerContrasena } from '../../../../core/utils/usuariosApi.js'
import { getPasswordRequirements } from '../../../../core/utils/passwords.js'
import styles from './NewPasswordForm.module.css'

function NewPasswordForm({ correo, token }) {
  const navigate = useNavigate()
  const titleRef = useRef(null)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [touched, setTouched] = useState({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const requirements = getPasswordRequirements(password)
  const passwordInvalid = !requirements.every(requirement => requirement.valid)
  const confirmationInvalid = !confirmation || password !== confirmation

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  async function guardarContrasena(event) {
    event.preventDefault()
    if (saving) {
      return
    }
    setTouched({ password: true, confirmation: true })
    if (passwordInvalid || confirmationInvalid) {
      setError('Revise los requisitos y confirme su nueva contraseña antes de continuar.')
      return
    }

    setSaving(true)
    setError('')
    setSaveError('')
    try {
      await restablecerContrasena(token, password, confirmation)
      navigate('/iniciar-sesion', {
        state: {
          recoveryEmail: correo.trim().toLowerCase(),
          recoveryMessage: 'Contraseña actualizada. Ingrese con su nueva contraseña.',
        },
        replace: true,
      })
    } catch (cause) {
      setSaveError(
        `No se pudo actualizar la contraseña. ${cause.errores?.password || cause.message}`
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <h1 id="recovery-title" ref={titleRef} tabIndex={-1}>
        Cree su nueva contraseña
      </h1>
      <p className={styles.intro}>
        La nueva contraseña reemplaza a la anterior de su cuenta.
      </p>
      <form
        aria-busy={saving}
        className={styles.form}
        noValidate
        onSubmit={guardarContrasena}
      >
        <label htmlFor="new-password">Nueva contraseña</label>
        <div className={styles.passwordField}>
          <input
            aria-describedby="new-password-help"
            aria-invalid={touched.password && passwordInvalid}
            autoComplete="new-password"
            id="new-password"
            minLength={8}
            name="password"
            disabled={saving}
            onBlur={() => setTouched(current => ({ ...current, password: true }))}
            onChange={event => {
              setPassword(event.target.value)
              setError('')
              setSaveError('')
            }}
            required
            title="Mínimo 8 caracteres, con una mayúscula y un número."
            type={showPassword ? 'text' : 'password'}
            value={password}
          />
          <button
            aria-controls="new-password"
            aria-pressed={showPassword}
            disabled={saving}
            onClick={() => setShowPassword(visible => !visible)}
            type="button"
          >
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
        <p className={styles.help} id="new-password-help">
          Mínimo 8 caracteres, con una mayúscula y un número.
        </p>
        <label htmlFor="confirm-password">Confirmar nueva contraseña</label>
        <input
          aria-describedby={touched.confirmation ? 'confirmation-help' : undefined}
          aria-invalid={touched.confirmation && confirmationInvalid}
          autoComplete="new-password"
          id="confirm-password"
          name="confirmation"
          disabled={saving}
          onBlur={() => setTouched(current => ({ ...current, confirmation: true }))}
          onChange={event => {
            setConfirmation(event.target.value)
            setError('')
            setSaveError('')
          }}
          required
          type="password"
          value={confirmation}
        />
        {touched.confirmation && (
          <p
            className={confirmationInvalid ? styles.error : styles.met}
            id="confirmation-help"
          >
            {confirmationInvalid
              ? 'Las contraseñas deben coincidir y no estar vacías.'
              : 'Las contraseñas coinciden.'}
          </p>
        )}
        {error && (
          <p className={styles.error} id="password-error" role="alert">
            {error}
          </p>
        )}
        {saveError && (
          <p className={styles.error} role="alert">
            {saveError}
          </p>
        )}
        <Button
          className={styles.submit}
          disabled={saving}
          loading={saving}
          size="small"
          type="submit"
        >
          {saving ? 'Guardando…' : 'Guardar y entrar'}
        </Button>
      </form>
    </>
  )
}

export default NewPasswordForm
