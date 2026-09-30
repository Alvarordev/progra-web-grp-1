import { createBrowserRouter, Navigate } from 'react-router'
import ExamplePage from '../ejemplo/ExamplePage.jsx'
import History1Page from '../features/history-1/History1Page.jsx'
import EditionSettingsPage from '../features/history-2/pages/EditionSettingsPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate replace to="/ejemplo" />,
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
    path: '/configuracion',
    element: <EditionSettingsPage />,
  },
])

export default router
