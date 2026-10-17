import { Link } from 'react-router'
import styles from './HeroSection.module.css'

function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.text}>
          <p className={styles.eyebrow}>
            CONVOCATORIA ABIERTA · LIMA, 12 Y 13 DE NOVIEMBRE DE 2026
          </p>
          <h1>VIII Congreso Académico Estudiantil</h1>
          <p className={styles.description}>
            Presenta tu investigación ante el comité y la comunidad universitaria.
            Recibimos artículos completos, resúmenes extendidos, pósteres y casos
            de estudio en seis ejes temáticos.
          </p>
        </div>

        <div className={styles.actions}>
          <Link className={styles.primaryAction} to="/iniciar-sesion">
            Enviar mi trabajo
          </Link>
          <a className={styles.secondaryAction} href="#deadlines">
            Descargar las bases
          </a>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
