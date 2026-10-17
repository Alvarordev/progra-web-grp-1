import Footer from '../../../../core/ui/Footer/Footer.jsx'
import CommitteeNavigation from '../../../../core/ui/CommitteeNavigation/CommitteeNavigation.jsx'
import Header from '../../../../core/ui/Header/Header.jsx'
import styles from './ConfigurationPageLayout.module.css'

const committeeUser = {
  iniciales: 'AS',
  nombre: 'Dra. Ana Salazar Bermúdez',
  rol: 'Rol: Comité organizador',
}

function ConfigurationPageLayout({ children, estado }) {
  return (
    <div className={styles.page}>
      <Header estado={estado} />
      <CommitteeNavigation rutaActiva="/configuracion" usuario={committeeUser} />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}

export default ConfigurationPageLayout
