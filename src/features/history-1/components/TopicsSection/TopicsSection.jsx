import styles from './TopicsSection.module.css'

function TopicsSection({ ejes = [] }) {
  return (
    <section aria-labelledby="topics-title" className={styles.section} id="topics">
      <div className={styles.header}>
        <h2 id="topics-title">Ejes temáticos</h2>
        <Link to="/bases">Ver bases completas</Link>
      </div>

      <div className={styles.grid}>
        {ejes.map((topic) => (
          <article key={topic.nombre}>
            <h3>{topic.nombre}</h3>
            <p>{topic.descripcion}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default TopicsSection
import { Link } from 'react-router'
