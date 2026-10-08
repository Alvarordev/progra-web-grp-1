import styles from './TopicsSection.module.css'

const topics = [
  {
    title: 'Inteligencia artificial y datos',
    description: 'Aprendizaje automático, analítica y ciencia de datos aplicada.',
  },
  {
    title: 'Ingeniería de software',
    description: 'Arquitectura, calidad, pruebas y procesos de desarrollo.',
  },
  {
    title: 'Sostenibilidad y ciudad',
    description: 'Movilidad, gestión del agua y ciudades resilientes.',
  },
  {
    title: 'Innovación y emprendimiento',
    description: 'Modelos de negocio, transferencia tecnológica y startups.',
  },
  {
    title: 'Salud y sociedad',
    description: 'Salud pública, bienestar estudiantil y política social.',
  },
  {
    title: 'Economía y mercados',
    description: 'Mercados financieros, comercio y desarrollo económico.',
  },
]

function TopicsSection() {
  return (
    <section aria-labelledby="topics-title" className={styles.section} id="topics">
      <div className={styles.header}>
        <h2 id="topics-title">Ejes temáticos</h2>
        <a href="#deadlines">Ver bases completas</a>
      </div>

      <div className={styles.grid}>
        {topics.map((topic) => (
          <article key={topic.title}>
            <h3>{topic.title}</h3>
            <p>{topic.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default TopicsSection
