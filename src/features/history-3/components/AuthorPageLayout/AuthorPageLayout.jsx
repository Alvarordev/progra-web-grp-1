import Footer from '../../../../core/ui/Footer/Footer.jsx'
import AuthorNavigation from '../../../../core/ui/AuthorNavigation/AuthorNavigation.jsx'
import Header from '../../../../core/ui/Header/Header.jsx'
import useActiveAccount from '../../../../core/utils/useActiveAccount.js'
import styles from './AuthorPageLayout.module.css'

function AuthorPageLayout({ children, estado = 'Recepción abierta', rutaActiva }) {
  const { participant } = useActiveAccount()
  const authorUser = participant
    ? {
        nombre: participant.name,
        iniciales: `${participant.names[0]}${participant.surnames[0]}`.toUpperCase(),
        rol: 'Rol: Autor',
      }
    : undefined
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
