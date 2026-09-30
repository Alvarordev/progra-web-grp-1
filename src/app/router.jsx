import { createBrowserRouter, Navigate } from 'react-router'
import ExamplePage from '../ejemplo/ExamplePage.jsx'
import History1Page from '../features/history-1/History1Page.jsx'

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
])

export default router
