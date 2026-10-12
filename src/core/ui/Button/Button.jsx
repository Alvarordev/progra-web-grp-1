import styles from './Button.module.css'

function Button({
  children,
  className = '',
  disabled = false,
  loading = false,
  size = 'medium',
  type = 'button',
  variant = 'primary',
  ...props
}) {
  const variantClass = styles[variant] ?? styles.primary
  const sizeClass = styles[size] ?? styles.medium
  const buttonClassName = [styles.button, variantClass, sizeClass, className]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      {...props}
      aria-busy={loading || undefined}
      className={buttonClassName}
      disabled={disabled || loading}
      type={type}
    >
      {loading && <span aria-hidden="true" className={styles.spinner} />}
      <span>{children}</span>
    </button>
  )
}

export default Button
