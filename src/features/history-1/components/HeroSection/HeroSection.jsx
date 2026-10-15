import { Link } from 'react-router'
import styles from './HeroSection.module.css'

function HeroSection({ rol }) {
  const action = rol === 'reviewer'
    ? { to: '/mi-cuenta', label: 'Ir a mi cuenta' }
    : rol === 'author' || rol === 'both'
      ? { to: '/autor', label: 'Ir a mi área de autor' }
      : { to: '/iniciar-sesion', label: 'Enviar mi trabajo' }

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
          <Link className={styles.primaryAction} to={action.to}>
            {action.label}
          </Link>
          <a
            className={styles.secondaryAction}
            href="/Tema6_Mockups_f.pdf"
            download="Tema6_Mockups_f.pdf"
          >
            Descargar las bases
          </a>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
