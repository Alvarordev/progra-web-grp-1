import { NavLink } from 'react-router'
import styles from './ConfigurationTabs.module.css'

const tabs = [
  { label: 'Edición', to: '/configuracion', end: true },
  { label: 'Ejes temáticos', to: '/configuracion/ejes-tematicos' },
  { label: 'Tipos de trabajo', to: '/configuracion/tipos-trabajo' },
  { label: 'Fechas límite', to: '/configuracion/fechas' },
  { label: 'Criterios de evaluación', to: '/configuracion/criterios' },
]

function ConfigurationTabs() {
  return (
    <nav aria-label="Configuración de la edición" className={styles.tabs}>
      {tabs.map((tab) => (
        <NavLink
          aria-current={tab.end ? 'page' : undefined}
          className={({ isActive }) =>
            `${styles.tab} ${isActive ? styles.active : ''}`
          }
          end={tab.end}
          key={tab.to}
          to={tab.to}
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default ConfigurationTabs
