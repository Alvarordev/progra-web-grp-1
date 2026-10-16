import Footer from '../../../../core/ui/Footer/Footer.jsx'
import CommitteeNavigation from '../../../../core/ui/CommitteeNavigation/CommitteeNavigation.jsx'
import Header from '../../../../core/ui/Header/Header.jsx'
import styles from './ConfigurationPageLayout.module.css'
import useStoredState from '../../../../core/utils/useStoredState.js'
import { editionStatusRepository } from '../../../../core/utils/repositories.js'
import { initialEditionStatus } from '../../../../core/utils/states/editionState.js'

const committeeUser = {
  iniciales: 'AS',
  nombre: 'Dra. Ana Salazar Bermúdez',
  rol: 'Rol: Comité organizador',
}

function ConfigurationPageLayout({ children, estado }) {
  const storedStatus = useStoredState(editionStatusRepository, initialEditionStatus)
  return (
    <div className={styles.page}>
      <Header estado={estado ?? storedStatus.value} />
      {storedStatus.error && <p role="alert">{storedStatus.error}</p>}
      <CommitteeNavigation rutaActiva="/configuracion" usuario={committeeUser} />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}

export default ConfigurationPageLayout
