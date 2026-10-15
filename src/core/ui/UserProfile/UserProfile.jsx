import { useState } from 'react'
import { useNavigate } from 'react-router'
import Button from '../Button/Button.jsx'
import { sessionRepository } from '../../utils/repositories.js'
import styles from './UserProfile.module.css'

function UserProfile({ iniciales, nombre, rol, permitirCerrarSesion = false }) {
  const navigate = useNavigate()
  const [closing, setClosing] = useState(false)
  const [error, setError] = useState('')

  async function handleLogout() {
    if (closing) return
    setClosing(true)
    setError('')
    try {
      await sessionRepository.remove()
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
        <span className={styles.name}>{nombre}</span>
        <span className={styles.role}>{rol}</span>
      </div>
      <span aria-hidden="true" className={styles.initials}>
        {iniciales}
      </span>
      {permitirCerrarSesion && <Button disabled={closing} loading={closing} onClick={handleLogout} size="small" type="button" variant="tertiary">Cerrar sesión</Button>}
      {error && <span className={styles.error} role="alert">{error}</span>}
    </div>
  )
}

export default UserProfile
