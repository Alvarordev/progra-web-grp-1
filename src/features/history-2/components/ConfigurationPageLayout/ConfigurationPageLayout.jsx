import ConfigurationFeedback from '../ConfigurationFeedback/ConfigurationFeedback.jsx'
import useActiveAccount from '../../../../core/utils/useActiveAccount.js'
import Footer from '../../../../core/ui/Footer/Footer.jsx'
import CommitteeNavigation from '../../../../core/ui/CommitteeNavigation/CommitteeNavigation.jsx'
import Header from '../../../../core/ui/Header/Header.jsx'
import styles from './ConfigurationPageLayout.module.css'
import useStoredState from '../../../../core/utils/useStoredState.js'
import { editionStatusRepository } from '../../../../core/utils/repositories.js'
import { initialEditionStatus } from '../../../../core/utils/states/editionState.js'

function ConfigurationPageLayout({ children, estado }) {
  const accountState = useActiveAccount()
  const participant = accountState.participant
  const committeeUser =
    participant?.role === 'committee'
      ? {
          iniciales:
            `${participant.names.trim()[0]}${participant.surnames.trim()[0]}`.toUpperCase(),
          nombre: participant.name,
          rol: 'Rol: Comité organizador',
        }
      : { iniciales: 'CO', nombre: 'Comité organizador', rol: 'Rol: Comité organizador' }
  const storedStatus = useStoredState(editionStatusRepository, initialEditionStatus)
  return (
    <div className={styles.page}>
      <Header estado={estado ?? storedStatus.value} />
      <CommitteeNavigation rutaActiva="/configuracion" usuario={committeeUser} />
      <main className={styles.main}>
        {(storedStatus.error || accountState.error) && (
          <div className={styles.feedbackContainer}>
            <ConfigurationFeedback error={storedStatus.error || accountState.error} />
          </div>
        )}
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default ConfigurationPageLayout
