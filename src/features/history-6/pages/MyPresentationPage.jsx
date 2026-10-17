import { useSearchParams } from 'react-router'
import useConference from '../../../core/utils/useConference.js'
import { getProgramWorks, publicProgram } from '../../../core/utils/program.js'
import { downloadCalendar } from '../../../core/utils/downloads.js'
import AuthorPageLayout from '../../history-3/components/AuthorPageLayout/AuthorPageLayout.jsx'
import { Link } from 'react-router'
import AuthorNavigation from '../../../core/ui/AuthorNavigation/AuthorNavigation.jsx'
import Button from '../../../core/ui/Button/Button.jsx'
import Footer from '../../../core/ui/Footer/Footer.jsx'
import Header from '../../../core/ui/Header/Header.jsx'
import { rooms } from '../data/program.js'
import {
  WORK_MINUTES,
  formatDate,
  formatWeekday,
  getSessionWorks,
  getWorkTimes,
} from '../utils/sessionSchedule.js'
import styles from './MyPresentationPage.module.css'

const speakerGuidelines = [
  'Preséntese en la sala 15 minutos antes del inicio de la sesión.',
  'La exposición dura 15 minutos y 5 minutos de preguntas.',
  'Cargue su presentación en el equipo de la sala antes de que comience la sesión.',
  'Formato recomendado: PDF o PPTX en proporción 16:9.',
]

function MyPresentationPage() {
  const conference = useConference()
  const [params] = useSearchParams()
  const published = publicProgram(conference.program)
  const acceptedWorks = getProgramWorks(conference.works, published)
  const ownWorks = acceptedWorks.filter(work => work.ownerId === conference.account?.userId || work.ownerEmail === conference.account?.email)
  const trabajo = ownWorks.find(work => work.codigo === params.get('trabajo')) ?? ownWorks.find(work => work.sesionId)
  const sesion = published.sessions.find(session => session.id === trabajo?.sesionId)
  if (conference.loading || conference.error || !trabajo || !sesion) return <AuthorPageLayout rutaActiva="/autor/presentacion"><h1>Mi presentación</h1><p role="status">{conference.error || (conference.loading ? 'Cargando presentación…' : 'Todavía no tiene una presentación publicada. Consulte el dictamen y la asignación de sesión de sus trabajos aceptados.')}</p><Link to="/autor/trabajos">Volver a mis trabajos</Link></AuthorPageLayout>
  const authorUser = { nombre: conference.account.name, iniciales: `${conference.account.names[0]}${conference.account.surnames[0]}`, rol: 'Rol: Autor' }
const trabajosDeLaSesion = getSessionWorks(acceptedWorks, sesion.id)
const indiceEnSesion = trabajosDeLaSesion.findIndex(
  (item) => item.codigo === trabajo.codigo,
)
const horario = getWorkTimes(sesion, indiceEnSesion)
const sala = rooms.find((item) => item.codigo === sesion.sala)

const presentationDetails = [
  {
    etiqueta: 'Fecha',
    valor: formatDate(sesion.fecha),
    detalle: formatWeekday(sesion.fecha),
  },
  {
    etiqueta: 'Hora',
    valor: `${horario.horaInicio} – ${horario.horaFin}`,
    detalle: `${WORK_MINUTES} minutos`,
  },
  {
    etiqueta: 'Sala',
    valor: sesion.sala,
    detalle: sala?.ubicacion ?? sesion.sala,
  },
  {
    etiqueta: 'Orden en la sesión',
    valor: `${indiceEnSesion + 1} de ${trabajosDeLaSesion.length}`,
    detalle: `Sesión: ${sesion.nombre}`,
  },
]


  return (
    <div className={styles.page}>
      <Header estado="Programa publicado" />
      <AuthorNavigation rutaActiva="/autor/presentacion" usuario={authorUser} />

      <main className={styles.main}>
        <div className={styles.content}>
          <header className={styles.pageHeading}>
            <h1>Mi presentación</h1>
            <p>Datos de su exposición en el congreso</p>
          </header>

          <div className={styles.layout}>
            <article
              aria-labelledby="presentation-title"
              className={styles.workCard}
            >
              <div className={styles.workTopline}>
                <span className={styles.workCode}>{trabajo.codigo}</span>
                <span className={styles.status}>Aceptado</span>
              </div>
              <h2 id="presentation-title">{trabajo.titulo}</h2>

              <dl className={styles.details}>
                {presentationDetails.map((detalle) => (
                  <div className={styles.detail} key={detalle.etiqueta}>
                    <dt>{detalle.etiqueta}</dt>
                    <dd className={styles.detailValue}>{detalle.valor}</dd>
                    <dd className={styles.detailNote}>{detalle.detalle}</dd>
                  </div>
                ))}
              </dl>

              <div className={styles.moderator}>
                <h3>Moderación de la sesión</h3>
                <p>
                  {sesion.moderadorCompleto} ·{' '}
                  <a href={`mailto:${sesion.correoModerador}`}>
                    {sesion.correoModerador}
                  </a>
                </p>
              </div>
            </article>

            <aside className={styles.sideColumn}>
              <section
                aria-labelledby="guidelines-title"
                className={styles.guidelines}
              >
                <h2 id="guidelines-title">Indicaciones para el expositor</h2>
                <ul>
                  {speakerGuidelines.map((indicacion) => (
                    <li key={indicacion}>{indicacion}</li>
                  ))}
                </ul>
              </section>

              <section
                aria-labelledby="actions-title"
                className={styles.actions}
              >
                <h2 id="actions-title">Acciones</h2>
                <Button className={styles.fullWidth} type="button" variant="primary" onClick={() => downloadCalendar(trabajo, sesion, horario)}>
                  Agregar a mi calendario
                </Button>
                <Link className={styles.secondaryLink} to="/programa-publico">
                  Ver el programa completo
                </Link>
                <p>
                  Si no puede exponer, avise al comité con al menos 48 horas de
                  anticipación.
                </p>
              </section>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default MyPresentationPage
