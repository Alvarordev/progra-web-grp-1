import { NavLink } from 'react-router'
import UserProfile from '../UserProfile/UserProfile.jsx'
import styles from './AuthorNavigation.module.css'

const navigationItems = [
  { label: 'Inicio', to: '/' },
  { label: 'Nuevo trabajo', to: '/nuevo-trabajo' },
  { label: 'Mis trabajos', to: '/mis-trabajos' },
  { label: 'Mi presentación', to: '/mi-presentacion' },
  { label: 'Mi cuenta', to: '/mi-cuenta' },
]

function AuthorNavigation({ rutaActiva = '/mi-presentacion', usuario }) {
  return (
    <div className={styles.navigationBar}>
      <div className={styles.navigationContent}>
        <nav aria-label="Navegación del autor" className={styles.navigation}>
          {navigationItems.map((elemento) => (
            <NavLink
              aria-current={elemento.to === rutaActiva ? 'page' : undefined}
              className={({ isActive: estaActiva }) =>
                `${styles.link} ${estaActiva ? styles.active : ''}`
              }
              end
              key={elemento.to}
              to={elemento.to}
            >
              {elemento.label}
            </NavLink>
          ))}
        </nav>
        <UserProfile {...usuario} />
      </div>
    </div>
  )
}

export default AuthorNavigation
