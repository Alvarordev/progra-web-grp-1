import CommitteeNavigation from '../../../../core/ui/CommitteeNavigation/CommitteeNavigation.jsx'
import Footer from '../../../../core/ui/Footer/Footer.jsx'
import Header from '../../../../core/ui/Header/Header.jsx'
import useUsuarioComite from '../../../../core/utils/useUsuarioComite.js'
import styles from './CommitteeProgramLayout.module.css'

function CommitteeProgramLayout({ children }) {
  const usuario = useUsuarioComite()

  return (
    <div className={styles.page}>
      <Header />
      <CommitteeNavigation rutaActiva="/programa" usuario={usuario} />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}

export default CommitteeProgramLayout
