import { NavLink } from 'react-router'
import styles from './MetricsTabs.module.css'

const tabs = [
  { label: 'Métricas generales', to: '/tablero' },
  { label: 'Cumplimiento', to: '/tablero/cumplimiento' },
  { label: 'Usuarios', to: '/usuarios' },
]

function MetricsTabs() {
  return (
    <nav aria-label="Secciones del tablero" className={styles.tabs}>
      {tabs.map((tab) => (
        <NavLink
          className={({ isActive }) =>
            `${styles.tab} ${isActive ? styles.active : ''}`
          }
          end
          key={tab.to}
          to={tab.to}
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default MetricsTabs
