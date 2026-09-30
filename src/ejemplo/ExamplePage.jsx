import { Link } from 'react-router'
import Button from '../core/ui/Button/Button.jsx'
import styles from './ExamplePage.module.css'

const designColors = [
  { name: 'Primary', token: '--color-primary', value: '#7A2231' },
  { name: 'Primary dark', token: '--color-primary-dark', value: '#5C1925' },
  { name: 'Primary soft', token: '--color-primary-soft', value: '#F6E9EC' },
  { name: 'Accent', token: '--color-accent', value: '#A67C2E' },
  { name: 'Background', token: '--color-bg', value: '#FBFAF8' },
  { name: 'Surface', token: '--color-surface', value: '#FFFFFF' },
  { name: 'Border', token: '--color-border', value: '#E4DFDA' },
  { name: 'Text', token: '--color-text', value: '#1F1A1B' },
  { name: 'Text muted', token: '--color-text-muted', value: '#6F6663' },
  { name: 'Success', token: '--color-success', value: '#1E7F4D' },
  { name: 'Warning', token: '--color-warning', value: '#B7791F' },
  { name: 'Danger', token: '--color-danger', value: '#B4322B' },
]

const workStatuses = [
  { label: 'Borrador', className: 'draft' },
  { label: 'Enviado', className: 'submitted' },
  { label: 'En revisión', className: 'review' },
  { label: 'Aceptado', className: 'accepted' },
  { label: 'Rechazado', className: 'rejected' },
]

function ExamplePage() {
  return (
    <div className={styles.page}>
      <header className={styles.masthead}>
        <div className={styles.brand}>
          <span aria-hidden="true" className={styles.brandMark}>
            C
          </span>
          <span>
            <strong>Congreso Académico Estudiantil</strong>
            <small>Universidad de Lima · Edición 2026</small>
          </span>
        </div>
        <span className={styles.mastheadNote}>Guía de implementación</span>
      </header>

      <main className={styles.content}>
        <section aria-labelledby="page-title" className={styles.intro}>
          <p className={styles.eyebrow}>Ejemplo para el equipo</p>
          <h1 id="page-title">Una base compartida para todas las historias</h1>
          <p className={styles.lead}>
            Usa esta página como referencia para crear componentes React y sus
            estilos con CSS Modules, manteniendo los mismos tokens y componentes
            visuales en todo el proyecto.
          </p>
          <nav aria-label="Navegación de ejemplo" className={styles.navigation}>
            <Link aria-current="page" className={styles.navLink} to="/ejemplo">
              Ejemplo
            </Link>
            <Link className={styles.navLink} to="/history-2">
              Ir a History 2
            </Link>
          </nav>
          <p className={styles.routeNote}>
            Registra estas rutas en el router central antes de usar los enlaces.
          </p>
        </section>

        <section aria-labelledby="tokens-title" className={styles.section}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Fundamentos visuales</p>
              <h2 id="tokens-title">Tokens de color</h2>
            </div>
            <p className={styles.sectionDescription}>
              Los componentes consumen variables globales; evita repetir
              valores hexadecimales en las hojas de cada pantalla.
            </p>
          </div>
          <ul className={styles.colorGrid}>
            {designColors.map((color) => (
              <li className={styles.colorItem} key={color.token}>
                <span
                  aria-hidden="true"
                  className={styles.colorSwatch}
                  style={{ backgroundColor: `var(${color.token})` }}
                />
                <span className={styles.colorName}>{color.name}</span>
                <code>{color.value}</code>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="buttons-title" className={styles.section}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Componente compartido</p>
              <h2 id="buttons-title">Botones y variantes</h2>
            </div>
            <p className={styles.sectionDescription}>
              Usa <code>Button</code> para acciones. Para cambiar de página,
              utiliza <code>Link</code> del router.
            </p>
          </div>
          <div className={styles.buttonShowcase}>
            <Button variant="primary">Acción principal</Button>
            <Button variant="secondary">Secundario</Button>
            <Button variant="tertiary">Terciario</Button>
            <Button variant="destructive">Destructivo</Button>
            <Button disabled>Deshabilitado</Button>
            <Button loading>Enviando…</Button>
          </div>
        </section>

        <section aria-labelledby="statuses-title" className={styles.section}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Color y texto</p>
              <h2 id="statuses-title">Estados del trabajo</h2>
            </div>
            <p className={styles.sectionDescription}>
              El color ayuda a reconocer el estado, pero nunca es su único
              indicador.
            </p>
          </div>
          <ul className={styles.statusList}>
            {workStatuses.map((status) => (
              <li
                className={`${styles.status} ${styles[status.className]}`}
                key={status.label}
              >
                {status.label}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="card-title" className={styles.section}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Estructura React</p>
              <h2 id="card-title">Ejemplo de contenido de una pantalla</h2>
            </div>
            <p className={styles.sectionDescription}>
              Mantén el JSX legible y asigna las clases desde el CSS Module
              de esa pantalla.
            </p>
          </div>

          {/* Si este bloque se repite en varias pantallas, extráelo a un componente reutilizable, por ejemplo WorkCard. */}
          <article className={styles.workCard}>
            <div className={styles.workCardTopline}>
              <span className={styles.workCode}>TRB-2026-042</span>
              <span className={`${styles.status} ${styles.review}`}>
                En revisión
              </span>
            </div>
            <h3>Predicción de deserción universitaria mediante aprendizaje supervisado</h3>
            <p className={styles.authors}>
              Rosa Quispe Ttito, Diego Chávez Manrique
            </p>
            <div className={styles.workCardFooter}>
              <span>Inteligencia artificial y datos</span>
              <span>Artículo completo</span>
              <Link className={styles.textLink} to="/history-2">
                Ver detalle
              </Link>
            </div>
          </article>
        </section>

        <aside aria-labelledby="rules-title" className={styles.rules}>
          <h2 id="rules-title">Reglas rápidas para contribuir</h2>
          <ul>
            <li>Una carpeta por historia y una hoja CSS Module por pantalla.</li>
            <li>Usa los tokens globales para color, tipografía y espaciado.</li>
            <li>Usa Button para acciones y Link para navegación.</li>
            <li>Extrae a un componente los bloques que se repitan.</li>
          </ul>
        </aside>
      </main>

      <footer className={styles.footer}>
        Base visual del Congreso Académico Estudiantil · Interfaz de escritorio
      </footer>
    </div>
  )
}

export default ExamplePage
