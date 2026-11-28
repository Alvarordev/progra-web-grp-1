import { NavLink } from 'react-router'
import UserProfile from '../UserProfile/UserProfile.jsx'
import styles from './AuthorNavigation.module.css'

const navigationItems = [
  { label: 'Inicio', to: '/autor' },
  { label: 'Nuevo trabajo', to: '/autor/nuevo-trabajo' },
  { label: 'Mis trabajos', to: '/autor/trabajos' },
  { label: 'Mi presentación', to: '/autor/presentacion' },
  { label: 'Mi cuenta', to: '/autor/cuenta' },
]

function AuthorNavigation({ rutaActiva = '/autor', rutaInicio = '/autor', usuario }) {
  const items = navigationItems.map(item =>
    item.to === '/autor' ? { ...item, to: rutaInicio } : item
  )

  return (
    <div className={styles.navigationBar}>
      <div className={styles.navigationContent}>
        <nav aria-label="Navegación del autor" className={styles.navigation}>
          {items.map(elemento => (
            <NavLink
              aria-current={elemento.to === rutaActiva ? 'page' : undefined}
              className={({ isActive: estaActiva }) =>
                `${styles.link} ${estaActiva || elemento.to === rutaActiva ? styles.active : ''}`
              }
              end
              key={elemento.to}
              to={elemento.to}
            >
              {elemento.label}
            </NavLink>
          ))}
        </nav>
        <UserProfile {...usuario} permitirCerrarSesion />
      </div>
    </div>
  )
}

export default AuthorNavigation
