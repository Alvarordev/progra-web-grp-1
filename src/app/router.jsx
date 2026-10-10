import { createBrowserRouter } from 'react-router'
import ExamplePage from '../ejemplo/ExamplePage.jsx'
import History1Page from '../features/history-1/History1Page.jsx'
import EditionSettingsPage from '../features/history-2/pages/EditionSettingsPage.jsx'
import ThematicAxesPage from '../features/history-2/pages/ThematicAxesPage.jsx'
import WorkTypesPage from '../features/history-2/pages/WorkTypesPage.jsx'
import ReviewerInboxPage from '../features/history-5/pages/ReviewerInboxPage.jsx'
import MetricsPage from '../features/history-7/pages/MetricsPage.jsx'
import ReviewerCompliancePage from '../features/history-7/pages/ReviewerCompliancePage.jsx'
import UsersPage from '../features/history-7/pages/UsersPage.jsx'

const router = createBrowserRouter([
    
    {
    path: '/tablero',
    element: <MetricsPage />,
  },
  {
    path: '/tablero/cumplimiento',
    element: <ReviewerCompliancePage />,
  },
  {
    path: '/usuarios',
    element: <UsersPage />,
  },

  {
    path: '/',
    element: <History1Page />,
  },
  {
    path: '/ejemplo',
    element: <ExamplePage />,
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
