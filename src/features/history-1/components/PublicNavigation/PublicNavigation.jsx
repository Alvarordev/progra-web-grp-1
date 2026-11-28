import { Link } from 'react-router'
import Header from '../../../../core/ui/Header/Header.jsx'
import Footer from '../../../../core/ui/Footer/Footer.jsx'
import AuthorNavigation from '../../../../core/ui/AuthorNavigation/AuthorNavigation.jsx'
import CommitteeNavigation from '../../../../core/ui/CommitteeNavigation/CommitteeNavigation.jsx'
import ReviewerNavigation from '../../../../core/ui/ReviewerNavigation/ReviewerNavigation.jsx'
import styles from './PublicNavigation.module.css'

function PublicNavigation({
  children,
  rutaBase = '/',
  participante = null,
  cargando = false,
  error = '',
  rutaActiva = '/',
}) {
  const isCommittee = participante?.role === 'committee'
  const isReviewer = participante?.role === 'reviewer'

  function renderPublicNavigation() {
    return (
      <nav aria-label="Navegación principal" className={styles.navigation}>
        <div className={styles.links}>
          <Link
            aria-current={rutaActiva === '/' ? 'page' : undefined}
            className={rutaActiva === '/' ? styles.activeLink : undefined}
            to={rutaBase}
          >
            Inicio
          </Link>
          <Link
            aria-current={rutaActiva === '/bases' ? 'page' : undefined}
            className={rutaActiva === '/bases' ? styles.activeLink : undefined}
            to="/bases"
          >
            Bases del congreso
          </Link>
          <Link to={`${rutaBase}#topics`}>Ejes temáticos</Link>
          <Link to="/programa-publico">Programa</Link>
        </div>
        <div className={styles.actions}>
          <Link className={styles.secondaryAction} to="/iniciar-sesion">
            Iniciar sesión
          </Link>
          <Link className={styles.primaryAction} to="/registro">
            Crear cuenta
          </Link>
        </div>
      </nav>
    )
  }

  function renderNavigation() {
    if (cargando) {
      return (
        <div className={styles.navigation}>
          <p className={styles.sessionStatus} role="status">
            Cargando su sesión…
          </p>
        </div>
      )
    }
    if (error) {
      return (
        <p className={styles.sessionStatus} role="alert">
          No se pudo cargar su sesión: {error}
        </p>
      )
    }
    if (!participante) {
      return renderPublicNavigation()
    }
    if (isCommittee) {
      return <CommitteeNavigation rutaActiva={rutaActiva} />
    }
    if (isReviewer) {
      return <ReviewerNavigation rutaActiva={rutaActiva} />
    }
    return <AuthorNavigation rutaActiva={rutaActiva} rutaInicio="/" />
  }

  return (
    <div className={styles.page}>
      <Header />
      {renderNavigation()}
      {children}
      <Footer />
    </div>
  )
}

export default PublicNavigation
