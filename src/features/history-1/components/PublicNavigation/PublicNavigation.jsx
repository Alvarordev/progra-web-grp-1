import { Link } from 'react-router'
import Header from '../../../../core/ui/Header/Header.jsx'
import Footer from '../../../../core/ui/Footer/Footer.jsx'
import AuthorNavigation from '../../../../core/ui/AuthorNavigation/AuthorNavigation.jsx'
import ReviewerNavigation from '../../../../core/ui/ReviewerNavigation/ReviewerNavigation.jsx'
import styles from './PublicNavigation.module.css'

function PublicNavigation({ children, estado, rutaBase = '/', participante = null, cargando = false, error = '', rutaActiva = '/' }) {
  const isReviewer = participante?.role === 'reviewer'
  const user = participante ? {
    nombre: participante.name,
    iniciales: `${participante.names.trim()[0]}${participante.surnames.trim()[0]}`.toUpperCase(),
    rol: participante.role === 'both' ? 'Rol: Autor y revisor' : isReviewer ? 'Rol: Revisor' : 'Rol: Autor',
  } : null

  return (
    <div className={styles.page}>
      <Header estado={estado ?? (isReviewer ? 'En revisión' : 'Recepción abierta')} />
      {cargando ? <p className={styles.sessionStatus} role="status">Cargando su sesión…</p> : error ? (
        <p className={styles.sessionStatus} role="alert">No se pudo cargar su sesión: {error}</p>
      ) : participante ? (
        isReviewer
          ? <ReviewerNavigation rutaActiva={rutaActiva} usuario={user} />
          : <AuthorNavigation rutaActiva={rutaActiva} rutaInicio="/" usuario={user} />
      ) : (
        <nav aria-label="Navegación principal" className={styles.navigation}>
          <div className={styles.links}>
            <Link aria-current={rutaActiva === '/' ? 'page' : undefined} className={rutaActiva === '/' ? styles.activeLink : undefined} to={rutaBase}>Inicio</Link>
            <Link aria-current={rutaActiva === '/bases' ? 'page' : undefined} className={rutaActiva === '/bases' ? styles.activeLink : undefined} to="/bases">Bases del congreso</Link>
            <Link to={`${rutaBase}#topics`}>Ejes temáticos</Link>
            <Link to="/programa">Programa</Link>
          </div>
          <div className={styles.actions}>
            <Link className={styles.secondaryAction} to="/iniciar-sesion">Iniciar sesión</Link>
            <Link className={styles.primaryAction} to="/registro">Crear cuenta</Link>
          </div>
        </nav>
      )}
      {children}
      <Footer />
    </div>
  )
}

export default PublicNavigation
