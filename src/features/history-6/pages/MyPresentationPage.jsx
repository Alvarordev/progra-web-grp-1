import { Link, useSearchParams } from 'react-router'
import AuthorNavigation from '../../../core/ui/AuthorNavigation/AuthorNavigation.jsx'
import Button from '../../../core/ui/Button/Button.jsx'
import Footer from '../../../core/ui/Footer/Footer.jsx'
import Header from '../../../core/ui/Header/Header.jsx'
import { downloadCalendar } from '../../../core/utils/downloads.js'
import { obtenerMiPresentacion } from '../../../core/utils/programaApi.js'
import useActiveAccount from '../../../core/utils/useActiveAccount.js'
import useRemoteData from '../../../core/utils/useRemoteData.js'
import AuthorPageLayout from '../../history-3/components/AuthorPageLayout/AuthorPageLayout.jsx'
import { WORK_MINUTES, formatDate, formatWeekday } from '../utils/sessionSchedule.js'
import styles from './MyPresentationPage.module.css'

const speakerGuidelines = [
  'Preséntese en la sala 15 minutos antes del inicio de la sesión.',
  'La exposición dura 15 minutos y 5 minutos de preguntas.',
  'Cargue su presentación en el equipo de la sala antes de que comience la sesión.',
  'Formato recomendado: PDF o PPTX en proporción 16:9.',
]

function MyPresentationPage() {
  const { data, loading, error } = useRemoteData(obtenerMiPresentacion)
  const { participant } = useActiveAccount()
  const [params, setParams] = useSearchParams()
  const presentaciones = data?.presentaciones ?? []
  const presentacion =
    presentaciones.find(item => item.trabajo.codigo === params.get('trabajo')) ??
    presentaciones[0]

  if (loading || error || !presentacion) {
    return (
      <AuthorPageLayout rutaActiva="/autor/presentacion">
        <h1>Mi presentación</h1>
        <p role="status">
          {error ||
            (loading
              ? 'Cargando presentación…'
              : 'Todavía no tiene una presentación publicada. Consulte el dictamen y la asignación de sesión de sus trabajos aceptados.')}
        </p>
        <Link to="/autor/trabajos">Volver a mis trabajos</Link>
      </AuthorPageLayout>
    )
  }

  const { trabajo, sesion, horario, orden, totalTrabajos } = presentacion
  const authorUser = {
    nombre: participant?.name ?? '',
    iniciales: `${participant?.names?.[0] ?? ''}${participant?.surnames?.[0] ?? ''}`,
    rol: 'Rol: Autor',
  }

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
      detalle: sesion.ubicacionSala ?? sesion.sala,
    },
    {
      etiqueta: 'Orden en la sesión',
      valor: `${orden} de ${totalTrabajos}`,
      detalle: `Sesión: ${sesion.nombre}`,
    },
  ]

  return (
    <div className={styles.page}>
      <Header />
      <AuthorNavigation rutaActiva="/autor/presentacion" usuario={authorUser} />

      <main className={styles.main}>
        <div className={styles.content}>
          <header className={styles.pageHeading}>
            <h1>Mi presentación</h1>
            <p>Datos de su exposición en el congreso</p>
            {presentaciones.length > 1 && (
              <nav aria-label="Sus presentaciones" className={styles.picker}>
                {presentaciones.map(item => (
                  <button
                    aria-pressed={item.trabajo.codigo === trabajo.codigo}
                    key={item.trabajo.codigo}
                    onClick={() => setParams({ trabajo: item.trabajo.codigo })}
                    type="button"
                  >
                    {item.trabajo.codigo}
                  </button>
                ))}
              </nav>
            )}
          </header>

          <div className={styles.layout}>
            <article aria-labelledby="presentation-title" className={styles.workCard}>
              <div className={styles.workTopline}>
                <span className={styles.workCode}>{trabajo.codigo}</span>
                <span className={styles.status}>Aceptado</span>
              </div>
              <h2 id="presentation-title">{trabajo.titulo}</h2>

              <dl className={styles.details}>
                {presentationDetails.map(detalle => (
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
                  {sesion.moderador} ·{' '}
                  <a href={`mailto:${sesion.correoModerador}`}>
                    {sesion.correoModerador}
                  </a>
                </p>
              </div>
            </article>

            <aside className={styles.sideColumn}>
              <section aria-labelledby="guidelines-title" className={styles.guidelines}>
                <h2 id="guidelines-title">Indicaciones para el expositor</h2>
                <ul>
                  {speakerGuidelines.map(indicacion => (
                    <li key={indicacion}>{indicacion}</li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="actions-title" className={styles.actions}>
                <h2 id="actions-title">Acciones</h2>
                <Button
                  className={styles.fullWidth}
                  type="button"
                  variant="primary"
                  onClick={() => downloadCalendar(trabajo, sesion, horario)}
                >
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
