import { Link } from 'react-router'
import styles from './HeroSection.module.css'

function HeroSection({ rol, edicion }) {
  const action = rol === 'committee'
    ? { to: '/configuracion', label: 'Ir a la configuración del congreso' }
    : rol === 'reviewer'
    ? { to: '/mi-cuenta', label: 'Ir a mi cuenta' }
    : rol === 'author' || rol === 'both'
      ? { to: '/autor', label: 'Ir a mi área de autor' }
      : { to: '/iniciar-sesion', label: 'Enviar mi trabajo' }

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.text}>
          <p className={styles.eyebrow}>
            CONGRESO ACADÉMICO · LIMA · EDICIÓN {edicion?.editionYear}
          </p>
          <h1>{edicion?.editionName ?? 'VIII Congreso Académico Estudiantil'}</h1>
          <p className={styles.description}>
            {edicion?.editionDescription}
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
