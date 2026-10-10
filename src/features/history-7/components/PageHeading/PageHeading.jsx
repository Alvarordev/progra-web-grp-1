import styles from './PageHeading.module.css'

function PageHeading({ acciones, descripcion, titulo }) {
  return (
    <div className={styles.heading}>
      <div>
        <h1>{titulo}</h1>
        <p className={styles.description}>{descripcion}</p>
      </div>
      {acciones}
    </div>
  )
}

export default PageHeading
