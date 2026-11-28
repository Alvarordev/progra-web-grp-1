import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import './index.css'
import router from './app/router.jsx'
import { precargarPantallas } from './app/routePages.js'
import { edicionActual } from './core/utils/editionRepositories.js'

edicionActual.leer().catch(() => {})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<p role="status">Cargando pantalla…</p>}>
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>
)

const alDesocuparse = window.requestIdleCallback ?? (tarea => setTimeout(tarea, 1500))
alDesocuparse(precargarPantallas)
