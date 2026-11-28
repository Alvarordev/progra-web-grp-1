import { useState } from 'react'
import { useNavigate } from 'react-router'
import Button from '../Button/Button.jsx'
import { endAccountSession } from '../../utils/accounts.js'
import useUsuarioSesion from '../../utils/useUsuarioSesion.js'
import styles from './UserProfile.module.css'

function UserProfile() {
  const usuario = useUsuarioSesion()
  const navigate = useNavigate()
  const [closing, setClosing] = useState(false)
  const [error, setError] = useState('')

  async function handleLogout() {
    if (closing) {
      return
    }
    setClosing(true)
    setError('')
    try {
      await endAccountSession()
      navigate('/iniciar-sesion', { replace: true })
    } catch (cause) {
      setError(cause.message)
    } finally {
      setClosing(false)
    }
  }
  return (
    <div className={styles.profile}>
      <div className={styles.identity}>
        <span className={styles.name}>{usuario?.nombre}</span>
        <span className={styles.role}>{usuario?.rol}</span>
      </div>
      <span aria-hidden="true" className={styles.initials}>
        {usuario?.iniciales}
      </span>
      <Button
        disabled={closing || !usuario}
        loading={closing}
        onClick={handleLogout}
        size="small"
        type="button"
        variant="tertiary"
      >
        Cerrar sesión
      </Button>
      {error && (
        <span className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}

export default UserProfile
