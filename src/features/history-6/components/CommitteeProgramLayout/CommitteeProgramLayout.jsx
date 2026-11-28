import CommitteeNavigation from '../../../../core/ui/CommitteeNavigation/CommitteeNavigation.jsx'
import Footer from '../../../../core/ui/Footer/Footer.jsx'
import Header from '../../../../core/ui/Header/Header.jsx'
import styles from './CommitteeProgramLayout.module.css'

function CommitteeProgramLayout({ children }) {
  return (
    <div className={styles.page}>
      <Header />
      <CommitteeNavigation rutaActiva="/programa" />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}

export default CommitteeProgramLayout
