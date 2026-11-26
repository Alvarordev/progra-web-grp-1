import { getRoleLabel } from '../../../core/utils/access.js'
import { obtenerInicioCuenta } from '../../../core/utils/accounts.js'
import PublicNavigation from '../components/PublicNavigation/PublicNavigation.jsx'
import AccessMessage from '../components/AccessMessage/AccessMessage.jsx'

function AccessDeniedPage({ participante, motivo }) {
  const isAuthor = ['author', 'both'].includes(participante.role)
  let textoRegreso = 'Volver a mi cuenta'
  if (isAuthor) {
    textoRegreso = 'Volver a mi inicio'
  } else if (participante.role === 'committee') {
    textoRegreso = 'Volver a configuración'
  }
  const actions = [
    {
      texto: textoRegreso,
      ruta: obtenerInicioCuenta(participante.role),
      primaria: true,
    },
    { texto: 'Escribir al comité', href: 'mailto:congreso@ulima.edu.pe' },
  ]

  return (
    <PublicNavigation estado="En revisión" participante={participante} rutaActiva="">
      <AccessMessage
        acciones={actions}
        codigo={403}
        contexto={`Código de error: 403 · Sesión de ${participante.name} (rol ${getRoleLabel(participante.role)})`}
        descripcion={`${motivo} Si cree que debería tener acceso, solicite el cambio de rol al comité organizador.`}
        titulo="No tiene permiso para ver esta página"
      />
    </PublicNavigation>
  )
}

export default AccessDeniedPage
