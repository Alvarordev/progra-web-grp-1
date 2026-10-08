import { Link } from 'react-router'
import styles from './Footer.module.css'

const footerGroups = [
  {
    title: 'El congreso',
    links: [
      { label: 'Bases y requisitos', to: '/bases' },
      { label: 'Ejes temáticos', to: '/ejes-tematicos' },
      { label: 'Programa', to: '/programa' },
    ],
  },
  {
    title: 'Participantes',
    links: [
      { label: 'Guía para autores', to: '/guia-autores' },
      { label: 'Guía para revisores', to: '/guia-revisores' },
      { label: 'Preguntas frecuentes', to: '/preguntas-frecuentes' },
    ],
  },
]

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerMain}>
          <div className={styles.organization}>
            <h2>Congreso Académico Estudiantil</h2>
            <p>
              Facultad de Ingeniería · Universidad de Lima.
              <br />
              Av. Javier Prado Este 4600, Santiago de Surco, Lima.
            </p>
          </div>

          {footerGroups.map((group) => (
            <nav
              aria-label={group.title}
              className={styles.footerGroup}
              key={group.title}
            >
              <h3>{group.title}</h3>
              {group.links.map((link) => (
                <Link key={link.to} to={link.to}>
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}

          <div className={styles.footerGroup}>
            <h3>Contacto</h3>
            <a href="mailto:congreso@ulima.edu.pe">
              congreso@ulima.edu.pe
            </a>
            <a href="tel:+5114376767">(01) 437 6767 anexo 30450</a>
          </div>
        </div>

        <div className={styles.legal}>
          <span>© 2026 Universidad de Lima. Todos los derechos reservados.</span>
          <div>
            <Link to="/terminos">Términos de uso</Link>
            <Link to="/privacidad">Política de privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
