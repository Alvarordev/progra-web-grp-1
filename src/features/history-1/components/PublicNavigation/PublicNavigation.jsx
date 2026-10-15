import { Link } from 'react-router'
import Header from '../../../../core/ui/Header/Header.jsx'
import Footer from '../../../../core/ui/Footer/Footer.jsx'
import styles from './PublicNavigation.module.css'

function PublicNavigation({ children, estado = 'Recepción abierta', rutaBase = '/' }) {
  return (
    <div className={styles.page}>
      <Header estado={estado} />
      <nav aria-label="Navegación principal" className={styles.navigation}>
        <div className={styles.links}>
          <Link className={styles.activeLink} to={rutaBase}>Inicio</Link>
          <Link to={`${rutaBase}#deadlines`}>Bases del congreso</Link>
          <Link to={`${rutaBase}#topics`}>Ejes temáticos</Link>
          <Link to="/programa">Programa</Link>
        </div>
        <div className={styles.actions}>
          <Link className={styles.secondaryAction} to="/iniciar-sesion">Iniciar sesión</Link>
          <Link className={styles.primaryAction} to="/registro">Crear cuenta</Link>
        </div>
      </nav>
      {children}
      <Footer />
    </div>
  )
}

export default PublicNavigation
