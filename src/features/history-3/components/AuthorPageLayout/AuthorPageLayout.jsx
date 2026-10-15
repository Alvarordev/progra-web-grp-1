import Footer from '../../../../core/ui/Footer/Footer.jsx'
import AuthorNavigation from '../../../../core/ui/AuthorNavigation/AuthorNavigation.jsx'
import Header from '../../../../core/ui/Header/Header.jsx'
import { authorUser } from '../../data/works.js'
import styles from './AuthorPageLayout.module.css'

function AuthorPageLayout({ children, estado = 'Recepción abierta', rutaActiva }) {
  return (
    <div className={styles.page}>
      <Header estado={estado} />
      <AuthorNavigation rutaActiva={rutaActiva} usuario={authorUser} />
      <main className={styles.main}>
        <div className={styles.content}>{children}</div>
      </main>
      <Footer />
    </div>
  )
}

export default AuthorPageLayout
