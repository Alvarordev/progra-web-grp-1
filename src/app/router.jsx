import { createBrowserRouter } from 'react-router'
import ExamplePage from '../ejemplo/ExamplePage.jsx'
import History1Page from '../features/history-1/History1Page.jsx'
import EditionSettingsPage from '../features/history-2/pages/EditionSettingsPage.jsx'
import ThematicAxesPage from '../features/history-2/pages/ThematicAxesPage.jsx'
import WorkTypesPage from '../features/history-2/pages/WorkTypesPage.jsx'
import ReviewerInboxPage from '../features/history-5/pages/ReviewerInboxPage.jsx'
import MyPresentationPage from '../features/history-6/pages/MyPresentationPage.jsx'
import PublicProgramPage from '../features/history-6/pages/PublicProgramPage.jsx'
import SessionAssignmentPage from '../features/history-6/pages/SessionAssignmentPage.jsx'
import SessionBuilderPage from '../features/history-6/pages/SessionBuilderPage.jsx'

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
  {
    path: '/programa',
    element: <SessionBuilderPage />,
  },
  {
    path: '/programa/asignar-trabajos',
    element: <SessionAssignmentPage />,
  },
  {
    path: '/programa-publico',
    element: <PublicProgramPage />,
  },
  {
    path: '/mi-presentacion',
    element: <MyPresentationPage />,
  },
])

export default router
