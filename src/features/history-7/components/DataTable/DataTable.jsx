import styles from './DataTable.module.css'

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
