import styles from './FormField.module.css'

function FormField({ ayuda, children, error, etiqueta, htmlFor }) {
  return (
    <div className={`${styles.field} ${error ? styles.hasError : ''}`}>
      <label htmlFor={htmlFor}>{etiqueta}</label>
      {children}
      {ayuda && !error && <span className={styles.help}>{ayuda}</span>}
      {error && (
        <span className={styles.error} id={`${htmlFor}-error`}>
          {error}
        </span>
      )}
    </div>
  )
}

export default FormField
