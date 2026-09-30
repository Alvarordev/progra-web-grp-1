import { createBrowserRouter, Navigate } from 'react-router'
import ExamplePage from '../ejemplo/ExamplePage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate replace to="/ejemplo" />,
  },
  {
    path: '/ejemplo',
    element: <ExamplePage />,
  },
])

export default router
