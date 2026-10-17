import styles from './ConfigurationFeedback.module.css'

function ConfigurationFeedback({
  cargando,
  error,
  mensaje,
  tipo = 'success',
  compacto = false,
}) {
  if (cargando) {
    return (
      <p className={styles.loading} role="status">
        {cargando}
      </p>
    )
  }

  const text = error || mensaje
  if (!text) {
    return null
  }

  const variant = error ? 'error' : tipo
  return (
    <p
      className={`${styles.notice} ${styles[variant]} ${compacto ? styles.compact : ''}`}
      role={variant === 'error' || variant === 'warning' ? 'alert' : 'status'}
    >
      {text}
    </p>
  )
}

export default ConfigurationFeedback
