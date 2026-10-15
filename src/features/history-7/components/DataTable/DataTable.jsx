import styles from './DataTable.module.css'

/* Tabla accesible con scroll horizontal en pantallas pequeñas.
   Alinea celdas con data-align="right". */
function DataTable({ caption, children }) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <caption className={styles.srOnly}>{caption}</caption>
        {children}
      </table>
    </div>
  )
}

export default DataTable
