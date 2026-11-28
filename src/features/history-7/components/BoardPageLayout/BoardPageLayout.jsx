import CommitteeNavigation from '../../../../core/ui/CommitteeNavigation/CommitteeNavigation.jsx'
import Footer from '../../../../core/ui/Footer/Footer.jsx'
import Header from '../../../../core/ui/Header/Header.jsx'
import styles from './BoardPageLayout.module.css'

function BoardPageLayout({ children, rutaActiva }) {
  return (
    <div className={styles.page}>
      <Header />
      <CommitteeNavigation rutaActiva={rutaActiva} />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}

export default BoardPageLayout
