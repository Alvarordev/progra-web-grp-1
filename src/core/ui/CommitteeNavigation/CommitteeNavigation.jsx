import { NavLink } from 'react-router'
import UserProfile from '../UserProfile/UserProfile.jsx'
import styles from './CommitteeNavigation.module.css'

const navigationItems = [
  { label: 'Configuración', to: '/configuracion' },
  { label: 'Trabajos recibidos', to: '/trabajos-recibidos' },
  { label: 'Revisores', to: '/revisores' },
  { label: 'Seguimiento', to: '/seguimiento' },
  { label: 'Programa', to: '/programa' },
  { label: 'Tablero', to: '/tablero' },
  { label: 'Usuarios', to: '/usuarios' },
]

function CommitteeNavigation({
  rutaActiva = '/configuracion',
  usuario,
}) {
  return (
    <div className={styles.navigationBar}>
      <div className={styles.navigationContent}>
        <nav aria-label="Navegación del comité" className={styles.navigation}>
          {navigationItems.map((elemento) => {
            const esConfiguracion = elemento.to === '/configuracion'
            const esRutaActiva =
              elemento.to === rutaActiva ||
              (esConfiguracion && rutaActiva.startsWith('/configuracion/'))

            return (
              <NavLink
                aria-current={esRutaActiva ? 'page' : undefined}
                className={({ isActive: estaActiva }) =>
                  `${styles.link} ${estaActiva ? styles.active : ''}`
                }
                end={!esConfiguracion}
                key={elemento.to}
                to={elemento.to}
              >
                {elemento.label}
              </NavLink>
            )
          })}
        </nav>
        <UserProfile {...usuario} />
      </div>
    </div>
  )
}

export default CommitteeNavigation
