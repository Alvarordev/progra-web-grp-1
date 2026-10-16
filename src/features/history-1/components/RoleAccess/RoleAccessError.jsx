import { Link, useRouteError } from 'react-router'
import PublicNavigation from '../PublicNavigation/PublicNavigation.jsx'
import styles from '../AccessMessage/AccessMessage.module.css'

function RoleAccessError() {
  const error = useRouteError()
  return (
    <PublicNavigation rutaActiva="">
      <main className={styles.main}>
        <div className={styles.content}>
          <h1>No se pudo comprobar su sesión</h1>
          <p className={styles.description} role="alert">{error?.message || 'Intente recargar la página.'}</p>
          <Link className={styles.primaryAction} to="/">Volver al inicio</Link>
        </div>
      </main>
    </PublicNavigation>
  )
}

export default RoleAccessError
