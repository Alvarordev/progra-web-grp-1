import { NavLink } from 'react-router'
import UserProfile from '../UserProfile/UserProfile.jsx'
import styles from './ReviewerNavigation.module.css'

const navigationItems = [
  { label: 'Inicio', to: '/' },
  { label: 'Mi bandeja', to: '/bandeja-revision' },
  { label: 'Mi cuenta', to: '/mi-cuenta' },
]

function ReviewerNavigation({ rutaActiva = '/bandeja-revision', usuario }) {
  return (
    <div className={styles.navigationBar}>
      <div className={styles.navigationContent}>
        <nav aria-label="Navegación del revisor" className={styles.navigation}>
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

export default ReviewerNavigation
