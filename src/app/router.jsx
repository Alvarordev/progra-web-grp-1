import { createBrowserRouter } from 'react-router'
import ExamplePage from '../ejemplo/ExamplePage.jsx'
import AuthorHomePage from '../features/history-1/pages/AuthorHomePage.jsx'
import History1Page from '../features/history-1/pages/History1Page.jsx'
import CongressRulesPage from '../features/history-1/pages/CongressRulesPage.jsx'
import LoginPage from '../features/history-1/pages/LoginPage.jsx'
import PasswordRecoveryPage from '../features/history-1/pages/PasswordRecoveryPage.jsx'
import RegistrationPage from '../features/history-1/pages/RegistrationPage.jsx'
import AccountPage from '../features/history-1/pages/AccountPage.jsx'
import NotFoundPage from '../features/history-1/pages/NotFoundPage.jsx'
import RoleAccess from '../features/history-1/components/RoleAccess/RoleAccess.jsx'
import RoleAccessError from '../features/history-1/components/RoleAccess/RoleAccessError.jsx'
import { createAccessLoader } from './access.js'
import EditionSettingsPage from '../features/history-2/pages/EditionSettingsPage.jsx'
import ThematicAxesPage from '../features/history-2/pages/ThematicAxesPage.jsx'
import WorkTypesPage from '../features/history-2/pages/WorkTypesPage.jsx'
import SchedulePage from '../features/history-2/pages/SchedulePage.jsx'
import CriteriaPage from '../features/history-2/pages/CriteriaPage.jsx'
import ReviewerInboxPage from '../features/history-5/pages/ReviewerInboxPage.jsx'
import EvaluationPage from '../features/history-5/pages/EvaluationPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <History1Page />,
  },
  {
    path: '/ejemplo',
    element: <ExamplePage />,
  },
  {
    path: '/history-1',
    element: <History1Page />,
  },
  {
    path: '/bases',
    element: <CongressRulesPage />,
  },
  {
    path: '/iniciar-sesion',
    element: <LoginPage />,
  },
  {
    path: '/recuperar-contrasena',
    element: <PasswordRecoveryPage />,
  },
  {
    path: '/registro',
    element: <RegistrationPage />,
  },
  {
    element: <RoleAccess />,
    loader: createAccessLoader(['author', 'both'], 'El área del autor es exclusiva de participantes con rol autor.'),
    errorElement: <RoleAccessError />,
    children: [{ path: '/autor', element: <AuthorHomePage /> }],
  },
  {
    path: '/configuracion',
    element: <EditionSettingsPage />,
  },
  {
    path: '/configuracion/ejes-tematicos',
    element: <ThematicAxesPage />,
  },
  {
    path: '/configuracion/tipos-trabajo',
    element: <WorkTypesPage />,
  },
  {
    path: '/configuracion/fechas',
    element: <SchedulePage />,
  },
  {
    path: '/configuracion/criterios',
    element: <CriteriaPage />,
  },
  {
    element: <RoleAccess />,
    loader: createAccessLoader(['author', 'reviewer', 'both'], 'Esta sección requiere una cuenta de participante.'),
    errorElement: <RoleAccessError />,
    children: [
      { path: '/mi-cuenta', element: <AccountPage /> },
      { path: '/autor/cuenta', element: <AccountPage /> },
    ],
  },
  {
    element: <RoleAccess />,
    loader: createAccessLoader(['reviewer', 'both'], 'La bandeja de revisión es exclusiva del rol revisor.'),
    errorElement: <RoleAccessError />,
    children: [{ path: '/bandeja-revision', element: <ReviewerInboxPage /> }],
  },
  {
    element: <RoleAccess />,
    loader: createAccessLoader(['reviewer', 'both'], 'La evaluación de trabajos es exclusiva del rol revisor.', true),
    errorElement: <RoleAccessError />,
    children: [{ path: '/evaluacion/:codigo', element: <EvaluationPage /> }],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default router;
