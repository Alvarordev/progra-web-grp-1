import ConfigurationFeedback from '../ConfigurationFeedback/ConfigurationFeedback.jsx'
import useActiveAccount from '../../../../core/utils/useActiveAccount.js'
import Footer from '../../../../core/ui/Footer/Footer.jsx'
import CommitteeNavigation from '../../../../core/ui/CommitteeNavigation/CommitteeNavigation.jsx'
import Header from '../../../../core/ui/Header/Header.jsx'
import styles from './ConfigurationPageLayout.module.css'
import useStoredState from '../../../../core/utils/useStoredState.js'
import { editionStatusRepository } from '../../../../core/utils/repositories.js'
import { initialEditionStatus } from '../../../../core/utils/states/editionState.js'

function ConfigurationPageLayout({ children }) {
  const accountState = useActiveAccount()
  const storedStatus = useStoredState(editionStatusRepository, initialEditionStatus)
  return (
    <div className={styles.page}>
      <Header />
      <CommitteeNavigation rutaActiva="/configuracion" />
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
