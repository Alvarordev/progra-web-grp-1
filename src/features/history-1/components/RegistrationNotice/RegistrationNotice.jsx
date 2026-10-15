import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import styles from './RegistrationNotice.module.css'

function RegistrationNotice() {
  const location = useLocation()
  const navigate = useNavigate()
  const [visible, setVisible] = useState(() => Boolean(location.state?.accountCreated))

  useEffect(() => {
    if (!location.state?.accountCreated) return
    const state = { ...location.state }
    delete state.accountCreated
    navigate(`${location.pathname}${location.search}${location.hash}`, { replace: true, state })
  }, [location, navigate])

  useEffect(() => {
    if (!visible) return
    const timeout = window.setTimeout(() => setVisible(false), 5000)
    return () => window.clearTimeout(timeout)
  }, [visible])

  if (!visible) return null
  return (
    <p className={styles.notice} role="status">
      <span aria-hidden="true">✓</span> Cuenta creada correctamente. Su sesión se inició con el rol elegido.
    </p>
  )
}

export default RegistrationNotice
