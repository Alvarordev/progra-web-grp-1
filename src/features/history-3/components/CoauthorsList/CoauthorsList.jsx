import styles from './CoauthorsList.module.css'

function CoauthorsList({ autores }) {
  return (
    <section aria-labelledby="coauthors-title" className={styles.panel}>
      <h2 className={styles.title} id="coauthors-title">
        Coautores
      </h2>
      <ul className={styles.list}>
        {autores.map(autor => (
          <li key={autor.nombre}>
            <span>
              {autor.nombre} · {autor.institucion}
            </span>
            <span className={autor.correspondencia ? styles.mainRole : styles.role}>
              {autor.rol}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default CoauthorsList
