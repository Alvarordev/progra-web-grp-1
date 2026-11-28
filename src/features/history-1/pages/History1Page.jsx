import useConference from '../../../core/utils/useConference.js'
import { formatScheduleDate } from '../../../core/utils/states/scheduleState.js'
import InfoSection from '../components/InfoSection/InfoSection.jsx'
import HeroSection from '../components/HeroSection/HeroSection.jsx'
import PublicNavigation from '../components/PublicNavigation/PublicNavigation.jsx'
import TopicsSection from '../components/TopicsSection/TopicsSection.jsx'
import styles from './History1Page.module.css'
import useActiveAccount from '../../../core/utils/useActiveAccount.js'
import useRemoteData from '../../../core/utils/useRemoteData.js'
import { obtenerProgramaPublico } from '../../../core/utils/programaApi.js'

function getCongressDays(programa) {
  const fechas = (programa?.sesiones ?? []).map(sesion => sesion.fecha).sort()
  if (!fechas.length) {
    return 'Por definir'
  }
  const [primera, ultima] = [fechas[0], fechas.at(-1)]
  return primera === ultima
    ? formatScheduleDate(primera)
    : `${formatScheduleDate(primera)} – ${formatScheduleDate(ultima)}`
}

function History1Page() {
  const accountState = useActiveAccount()
  const conference = useConference('axes', 'criteria')
  const programa = useRemoteData(obtenerProgramaPublico)
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
    ['Días del congreso', programa.loading ? '…' : getCongressDays(programa.data)],
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
        <HeroSection edicion={conference.edition} rol={accountState.participant?.role} />
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
