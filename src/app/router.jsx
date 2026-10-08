import { createBrowserRouter } from 'react-router'
import ExamplePage from '../ejemplo/ExamplePage.jsx'
import History1Page from '../features/history-1/pages/History1Page.jsx'
import LoginPage from '../features/history-1/pages/LoginPage.jsx'
import RegistrationPage from '../features/history-1/pages/RegistrationPage.jsx'
import EditionSettingsPage from '../features/history-2/pages/EditionSettingsPage.jsx'
import ThematicAxesPage from '../features/history-2/pages/ThematicAxesPage.jsx'
import WorkTypesPage from '../features/history-2/pages/WorkTypesPage.jsx'
import ReviewerInboxPage from '../features/history-5/pages/ReviewerInboxPage.jsx'

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
    path: '/iniciar-sesion',
    element: <LoginPage />,
  },
  {
    path: '/registro',
    element: <RegistrationPage />,
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
    path: '/bandeja-revision',
    element: <ReviewerInboxPage />,
  },
])

export default router;
