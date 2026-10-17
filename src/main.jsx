import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import './index.css'
import router from './app/router.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<p role="status">Cargando pantalla…</p>}>
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>,
)
