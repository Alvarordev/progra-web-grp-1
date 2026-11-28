import Footer from '../../../../core/ui/Footer/Footer.jsx'
import AuthorNavigation from '../../../../core/ui/AuthorNavigation/AuthorNavigation.jsx'
import Header from '../../../../core/ui/Header/Header.jsx'
import styles from './AuthorPageLayout.module.css'

function AuthorPageLayout({ children, rutaActiva }) {
  return (
    <div className={styles.page}>
      <Header />
      <AuthorNavigation rutaActiva={rutaActiva} />
      <main className={styles.main}>
        <div className={styles.content}>{children}</div>
      </main>
      <Footer />
    </div>
  )
}

export default AuthorPageLayout
