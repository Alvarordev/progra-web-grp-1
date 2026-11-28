import ConfigurationFeedback from '../ConfigurationFeedback/ConfigurationFeedback.jsx'
import useActiveAccount from '../../../../core/utils/useActiveAccount.js'
import Footer from '../../../../core/ui/Footer/Footer.jsx'
import CommitteeNavigation from '../../../../core/ui/CommitteeNavigation/CommitteeNavigation.jsx'
import Header from '../../../../core/ui/Header/Header.jsx'
import styles from './ConfigurationPageLayout.module.css'
import { useEdicionActual } from '../../../../core/utils/editionRepositories.js'

function ConfigurationPageLayout({ children }) {
  const accountState = useActiveAccount()
  const edicion = useEdicionActual()
  const error = edicion.error || accountState.error
  return (
    <div className={styles.page}>
      <Header />
      <CommitteeNavigation rutaActiva="/configuracion" />
      <main className={styles.main}>
        {error && (
          <div className={styles.feedbackContainer}>
            <ConfigurationFeedback error={error} />
          </div>
        )}
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default ConfigurationPageLayout
