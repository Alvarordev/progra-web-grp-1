import { useId, useState } from 'react'
import Button from '../../../../core/ui/Button/Button.jsx'
import Modal from '../../../../core/ui/Modal/Modal.jsx'
import styles from './BlockUserModal.module.css'

function BlockUserModal({ guardando = false, errorGuardado = '', alCerrar, alConfirmar, usuario }) {
  const reasonId = useId()
  const errorId = useId()
  const [motivo, setMotivo] = useState('')
  const [notificar, setNotificar] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    if (guardando) return

    if (!motivo.trim()) {
      setError('Ingrese el motivo del bloqueo.')
      return
    }

    alConfirmar(usuario, { motivo: motivo.trim(), notificar })
  }

  return (
    <Modal tamano="compact" alCerrar={alCerrar} titulo="Bloquear usuario">
      <form className={styles.form} noValidate onSubmit={handleSubmit}>
        <fieldset className={styles.body} disabled={guardando}>
          <div className={styles.summary}>
            <strong>{usuario.nombre}</strong>
            <span>
              {usuario.rol} · {usuario.institucion} · {usuario.actividad}
            </span>
          </div>

          <div className={styles.effects} role="note">
            <strong>Efectos del bloqueo</strong>
            <p>
              El usuario no podrá iniciar sesión. Si tiene revisiones
              pendientes, quedarán sin responsable y deberán reasignarse desde
              el seguimiento.
            </p>
          </div>

          <div className={styles.field}>
            <label htmlFor={reasonId}>Motivo del bloqueo *</label>
            <textarea
              aria-describedby={error ? errorId : undefined}
              aria-invalid={error ? 'true' : undefined}
              id={reasonId}
              onChange={(event) => {
                setMotivo(event.target.value)
                setError('')
              }}
              rows={3}
              value={motivo}
            />
            {error && (
              <p className={styles.error} id={errorId}>
                {error}
              </p>
            )}
          </div>

          <label className={styles.checkbox}>
            <input
              checked={notificar}
              onChange={(event) => setNotificar(event.target.checked)}
              type="checkbox"
            />
            Notificar al usuario por correo electrónico.
          </label>
        </fieldset>

        {errorGuardado && <p role="alert">{errorGuardado}</p>}
        <div className={styles.footer}>
          <Button disabled={guardando} onClick={alCerrar} type="button" variant="secondary">
            Cancelar
          </Button>
          <Button loading={guardando} type="submit" variant="destructive">
            Bloquear usuario
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default BlockUserModal
