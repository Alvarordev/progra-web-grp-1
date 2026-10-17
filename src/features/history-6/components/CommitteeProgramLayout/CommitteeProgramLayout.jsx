import CommitteeNavigation from '../../../../core/ui/CommitteeNavigation/CommitteeNavigation.jsx'
import Footer from '../../../../core/ui/Footer/Footer.jsx'
import Header from '../../../../core/ui/Header/Header.jsx'
import styles from './CommitteeProgramLayout.module.css'

const committeeUser = {
  iniciales: 'AS',
  nombre: 'Dra. Ana Salazar Bermúdez',
  rol: 'Rol: Comité organizador',
}

function CommitteeProgramLayout({ children, estado }) {
  return (
    <div className={styles.page}>
      <Header estado={estado} />
      <CommitteeNavigation rutaActiva="/programa" usuario={committeeUser} />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}

export default CommitteeProgramLayout
