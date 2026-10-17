import styles from './WorkStatusBadge.module.css'

const statusLabels = {
  borrador: 'Borrador',
  enviado: 'Enviado',
  revision: 'En revisión',
  aceptado: 'Aceptado',
  rechazado: 'Rechazado',
}

function WorkStatusBadge({ estado }) {
  return (
    <span className={`${styles.badge} ${styles[estado]}`}>
      {statusLabels[estado]}
    </span>
  )
}

export default WorkStatusBadge
