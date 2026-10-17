import { Outlet, useLoaderData } from 'react-router'
import AccessDeniedPage from '../../pages/AccessDeniedPage.jsx'

function RoleAccess() {
  const { participant, allowed, message } = useLoaderData()
  return allowed ? (
    <Outlet context={participant} />
  ) : (
    <AccessDeniedPage motivo={message} participante={participant} />
  )
}

export default RoleAccess
