import useConference from '../../../core/utils/useConference.js'
import { formatScheduleDate } from '../../../core/utils/states/scheduleState.js'
import InfoSection from '../components/InfoSection/InfoSection.jsx'
import HeroSection from '../components/HeroSection/HeroSection.jsx'
import PublicNavigation from '../components/PublicNavigation/PublicNavigation.jsx'
import TopicsSection from '../components/TopicsSection/TopicsSection.jsx'
import styles from './History1Page.module.css'
import useActiveAccount from '../../../core/utils/useActiveAccount.js'

function History1Page() {
  const accountState = useActiveAccount()
  const conference = useConference()
  const deadlines = [
    [
      'Cierre de recepción de trabajos',
      formatScheduleDate(conference.schedule.reception ?? ''),
    ],
    [
      'Cierre de la etapa de revisión',
      formatScheduleDate(conference.schedule.review ?? ''),
    ],
    [
      'Publicación de resultados',
      formatScheduleDate(conference.schedule.publication ?? ''),
    ],
    ['Días del congreso', '12/11/2026 – 13/11/2026'],
  ]
  const criteria = conference.criteria.map(item => [item.nombre, `${item.peso} %`])

  return (
    <PublicNavigation
      cargando={accountState.loading}
      error={accountState.error}
      participante={accountState.participant}
      estado={conference.status}
      rutaBase="/history-1"
    >
      <main>
        {!accountState.loading && (
          <HeroSection
            edicion={conference.edition}
            rol={accountState.participant?.role}
          />
        )}
        <TopicsSection ejes={conference.axes} />
        <div className={styles.infoGrid}>
          <InfoSection
            className={styles.deadlines}
            id="deadlines"
            filas={deadlines}
            titulo="Fechas límite"
          />
          <InfoSection
            className={styles.criteria}
            id="criteria"
            filas={criteria}
            titulo="Criterios de evaluación"
          />
        </div>
      </main>
    </PublicNavigation>
  )
}

export default History1Page
