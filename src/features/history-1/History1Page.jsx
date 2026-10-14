import { Link } from 'react-router'
import Button from '../../core/ui/Button/Button.jsx'
import styles from './History1Page.module.css'

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

const deadlines = [
  ['Cierre de recepción de trabajos', '30/09/2026'],
  ['Cierre de la etapa de revisión', '20/10/2026'],
  ['Publicación de resultados', '28/10/2026'],
  ['Días del congreso', '12/11/2026 – 13/11/2026'],
]

const criteria = [
  ['Originalidad', '25 %'],
  ['Rigor metodológico', '30 %'],
  ['Claridad de la exposición', '20 %'],
  ['Relevancia y aporte', '25 %'],
]

function Header() {
  return (
    <>
      <header className={styles.headerPrincipal}>
        <div className={styles.headerIzquierda}>
          <h2>Congreso Académico Estudiantil</h2>
          <p>UNIVERSIDAD DE LIMA · EDICIÓN 2026</p>
        </div>

        <div className={styles.headerDerecha}>
          <p>ESTADO DE LA EDICIÓN</p>
          <span>Recepción abierta</span>
        </div>
      </header>

      <nav aria-label="Navegación principal" className={styles.barraNavegacion}>
        <div className={styles.navIzquierda}>
          <Link className={styles.navLink} to="/history-1">
            Inicio
          </Link>
          <Link className={styles.navLink} to="/history-1#deadlines">
            Bases del congreso
          </Link>
          <Link className={styles.navLink} to="/history-1#topics">
            Ejes temáticos
          </Link>
          <Link className={styles.navLink} to="/history-1#footer">
            Programa
          </Link>
        </div>

        <div className={styles.navDerecha}>
          <Button size="small" variant="secondary">
            Iniciar sesión
          </Button>
          <Button size="small" variant="primary">
            Crear cuenta
          </Button>
        </div>
      </nav>
    </>
  )
}

function Hero() {
  return (
    <section className={styles.heroPrincipal}>
      <div className={styles.heroContenido}>
        <div className={styles.heroTexto}>
          <p className={styles.heroEtiqueta}>
            CONVOCATORIA ABIERTA · LIMA, 12 Y 13 DE NOVIEMBRE DE 2026
          </p>

          <h1>VIII Congreso Académico Estudiantil</h1>

          <p className={styles.heroDescripcion}>
            Presenta tu investigación ante el comité y la comunidad universitaria.
            Recibimos artículos completos, resúmenes extendidos, pósteres y casos
            de estudio en seis ejes temáticos.
          </p>
        </div>

        <div className={styles.heroBotones}>
          <Button className={styles.botonPrincipal} variant="primary">
            Enviar mi trabajo
          </Button>
          <Button className={styles.botonSecundario} variant="secondary">
            Descargar las bases
          </Button>
        </div>
      </div>
    </section>
  )
}

function Topics() {
  return (
    <section
      aria-labelledby="topics-title"
      className={styles.topics}
      id="topics"
    >
      <div className={styles.topicsHeader}>
        <h2 id="topics-title">Ejes temáticos</h2>
        <a href="#deadlines">Ver bases completas</a>
      </div>

      <div className={styles.topicsGrid}>
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

function InfoSection({ id, title, rows, className }) {
  return (
    <section aria-labelledby={`${id}-title`} className={className} id={id}>
      <h2 id={`${id}-title`}>{title}</h2>
      {rows.map(([label, value]) => (
        <div className={styles.infoRow} key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </section>
  )
}

function Footer() {
  return (
    <footer className={styles.footerPrincipal} id="footer">
      <div className={styles.footerContenido}>
        <div className={styles.footerColumna}>
          <h3>Congreso Académico Estudiantil</h3>
          <p>
            Facultad de Ingeniería · Universidad de Lima.
            <br />
            Av. Javier Prado Este 4600, Santiago de Surco, Lima.
          </p>
        </div>

        <div className={styles.footerColumna}>
          <h4>EL CONGRESO</h4>
          <p>Bases y requisitos</p>
          <p>Ejes temáticos</p>
          <p>Programa</p>
        </div>

        <div className={styles.footerColumna}>
          <h4>PARTICIPANTES</h4>
          <p>Guía para autores</p>
          <p>Guía para revisores</p>
          <p>Preguntas frecuentes</p>
        </div>

        <div className={styles.footerColumna}>
          <h4>CONTACTO</h4>
          <p>congreso@ulima.edu.pe</p>
          <p>(01) 437 6767 anexo 30450</p>
        </div>
      </div>

      <div className={styles.footerInferior}>
        <span>© 2026 Universidad de Lima. Todos los derechos reservados.</span>
        <div>
          <span>Términos de uso</span>
          <span>Política de privacidad</span>
        </div>
      </div>
    </footer>
  )
}

function History1Page() {
  return (
    <div className={styles.page}>
      <Header />
      <main>
        <Hero />
        <Topics />
        <div className={styles.infoGrid}>
          <InfoSection
            className={styles.deadlines}
            id="deadlines"
            rows={deadlines}
            title="Fechas límite"
          />
          <InfoSection
            className={styles.criteria}
            id="criteria"
            rows={criteria}
            title="Criterios de evaluación"
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default History1Page
