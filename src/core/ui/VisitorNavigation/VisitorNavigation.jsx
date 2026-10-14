import { NavLink } from 'react-router'
import Button from '../Button/Button.jsx'
import styles from './VisitorNavigation.module.css'

const navigationItems = [
  { label: 'Inicio', to: '/' },
  { label: 'Bases del congreso', to: '/bases' },
  { label: 'Ejes temáticos', to: '/ejes-tematicos' },
  { label: 'Programa', to: '/programa-publico' },
]

function VisitorNavigation({ rutaActiva = '/programa-publico' }) {
  return (
    <div className={styles.navigationBar}>
      <div className={styles.navigationContent}>
        <nav aria-label="Navegación principal" className={styles.navigation}>
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
        <div className={styles.actions}>
          <Button size="small" type="button" variant="secondary">
            Iniciar sesión
          </Button>
          <Button size="small" type="button" variant="primary">
            Crear cuenta
          </Button>
        </div>
      </div>
    </div>
  )
}

export default VisitorNavigation
