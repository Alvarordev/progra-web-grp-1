import { createBrowserRouter } from 'react-router'
import ExamplePage from '../ejemplo/ExamplePage.jsx'
import History1Page from '../features/history-1/History1Page.jsx'
import EditionSettingsPage from '../features/history-2/pages/EditionSettingsPage.jsx'
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
    path: '/configuracion',
    element: <EditionSettingsPage />,
  },
  {
    path: '/bandeja-revision',
    element: <ReviewerInboxPage />,
  },
  {
    path: '/form-evaluacion',
    element: <EvaluationPage />,
  },
])

export default router;
