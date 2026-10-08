import styles from './InfoSection.module.css'

function InfoSection({ id, titulo, filas, className = '' }) {
  return (
    <section
      aria-labelledby={`${id}-title`}
      className={`${styles.section} ${className}`}
      id={id}
    >
      <h2 id={`${id}-title`}>{titulo}</h2>
      {filas.map(([label, value]) => (
        <div className={styles.row} key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </section>
  )
}

export default InfoSection
