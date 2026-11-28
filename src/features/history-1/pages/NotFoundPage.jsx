import useActiveAccount from '../../../core/utils/useActiveAccount.js'
import PublicNavigation from '../components/PublicNavigation/PublicNavigation.jsx'
import AccessMessage from '../components/AccessMessage/AccessMessage.jsx'

const actions = [
  { texto: 'Ir al inicio', ruta: '/', primaria: true },
  { texto: 'Ver el programa', ruta: '/programa-publico' },
]

function NotFoundPage() {
  const account = useActiveAccount()
  return (
    <PublicNavigation
      cargando={account.loading}
      error={account.error}
      participante={account.participant}
      rutaActiva=""
    >
      <AccessMessage
        acciones={actions}
        codigo={404}
        descripcion="El enlace pudo cambiar o el trabajo ya no está publicado. Puede volver al inicio o consultar el programa del congreso."
        titulo="No encontramos la página que busca"
      />
    </PublicNavigation>
  )
}

export default NotFoundPage
