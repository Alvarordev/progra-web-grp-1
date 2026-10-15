import CommitteeNavigation from '../../../../core/ui/CommitteeNavigation/CommitteeNavigation.jsx'
import Footer from '../../../../core/ui/Footer/Footer.jsx'
import Header from '../../../../core/ui/Header/Header.jsx'
import styles from './BoardPageLayout.module.css'

const committeeUser = {
  iniciales: 'AS',
  nombre: 'Dra. Ana Salazar Bermúdez',
  rol: 'Rol: Comité organizador',
}

function BoardPageLayout({ children, rutaActiva }) {
  return (
    <div className={styles.page}>
      <Header estado="Resultados publicados" />
      <CommitteeNavigation rutaActiva={rutaActiva} usuario={committeeUser} />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}

export default BoardPageLayout
