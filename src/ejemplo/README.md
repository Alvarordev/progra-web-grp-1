# Ejemplo de React y CSS

Esta carpeta muestra la convención recomendada para las pantallas del proyecto.
Los nombres de archivos, componentes, variables y clases están en inglés; el
contenido de la interfaz y esta guía están en español.

## Estructura

- `ExamplePage.jsx`: markup semántico y composición de componentes.
- `ExamplePage.module.css`: estilos locales de esta pantalla.
- `../core/ui/Button/`: botón compartido por todas las historias.
- `../core/styles/tokens.css`: colores, tipografía, espaciado y medidas globales.

## Crear una pantalla

1. Coloca el archivo `.jsx` junto a su `.module.css`.
2. Importa el CSS Module y asigna sus clases con `className={styles.nombre}`.
3. Reutiliza los tokens CSS, por ejemplo `var(--color-primary)` y
   `var(--space-4)`, en vez de repetir valores.
4. Usa `Button` para ejecutar acciones y `Link` de React Router para navegar.
5. Si un bloque de JSX se repite en varias pantallas, extráelo a un componente
   reutilizable. Una tarjeta de trabajo (`WorkCard`) sería un buen ejemplo.

## Router central

El router central vive en `src/app/router.jsx` y se monta desde `src/main.jsx`
con `RouterProvider`. Para agregar una pantalla, importa su componente y añade
una entrada al arreglo de rutas. Por ejemplo:

```jsx
import { createBrowserRouter, Navigate } from 'react-router'
import ExamplePage from '../ejemplo/ExamplePage.jsx'

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/ejemplo" replace /> },
  { path: '/ejemplo', element: <ExamplePage /> },
  // Agrega aquí las rutas que pertenecen a cada historia.
])
```

Para enlazar páginas desde JSX, utiliza `Link` en vez de enlaces HTML que
recarguen el documento:

```jsx
import { Link } from 'react-router'

<Link to="/history-2">Ir a History 2</Link>
```

La ruta de destino debe existir en la configuración central antes de que el
enlace pueda mostrar una pantalla.

## Convención de `Button`

```jsx
<Button variant="primary">Guardar cambios</Button>
<Button variant="secondary">Cancelar</Button>
<Button variant="tertiary">Ver detalle</Button>
<Button variant="destructive">Eliminar</Button>
<Button disabled>Deshabilitado</Button>
<Button loading>Enviando…</Button>
```

`Button` es para acciones. Para navegación, conserva la semántica de un enlace
con `Link` y estilízalo como enlace o control de navegación.
