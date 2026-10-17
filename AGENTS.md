# Normas de desarrollo

Estas normas aplican a todo el repositorio. Usa `src/ejemplo/` como referencia
visual y de estructura, y sigue el patrón de composición de
`src/features/history-2/` para las nuevas historias.

## Principios

- Revisa primero si ya existe en `src/core/` un componente o estilo que resuelva
  la necesidad; reutilízalo antes de crear otra versión.
- Mantén cada historia independiente y compón sus pantallas con componentes
  pequeños, claros y reutilizables.
- Evita archivos extensos con varias responsabilidades. Extrae secciones de UI,
  lógica o datos cuando eso haga que la página sea más fácil de entender y
  mantener. No extraigas envoltorios triviales que no aporten reutilización ni
  claridad.
- No agregues dependencias si la funcionalidad puede resolverse con las
  herramientas que ya usa el proyecto.

## Idioma y nombres

- El texto visible de la interfaz y la documentación del proyecto se escriben
  en español.
- Escribe en inglés los nombres de archivos, componentes, funciones, variables y
  clases CSS. Usa `PascalCase` para componentes, `camelCase` para funciones,
  variables y clases de CSS Modules, y `kebab-case` para variables CSS.
- Escribe en español los nombres de props personalizadas de los componentes,
  como `estado`, `rutaActiva`, `usuario` o `asignacion`.
- Conserva en inglés las props estándar de React/HTML y la API estandarizada de
  `Button` (`variant`, `size`, `disabled`, `loading`, `type`, `className`). No
  traduzcas nombres de APIs conocidas.
- Sigue el formato usado en el código del proyecto: indentación de dos
  espacios, comillas simples en JavaScript y sin punto y coma.

## Organización del código

```text
src/
├── app/
│   └── router.jsx                 # Configuración central de rutas
├── core/
│   ├── styles/                    # Tokens y estilos globales
│   └── ui/                        # Componentes compartidos entre historias
└── features/
    └── history-n/
        ├── pages/                 # Pantallas de la historia
        └── components/            # Componentes propios de la historia
```

- Mantén los componentes de uso transversal en `src/core/ui/`. Por ejemplo,
  antes de crear otro encabezado, pie de página, navegación, perfil o botón,
  comprueba los componentes existentes.
- Mantén dentro de `src/features/history-n/` los componentes que solo pertenecen
  a esa historia. Si un componente empieza a ser útil para varias historias,
  considera moverlo a `core`.
- Coloca cada pantalla en `pages/` y los componentes específicos de la historia
  en `components/`. Para cada componente, usa una carpeta con su nombre y
  coloca juntos el JSX y su hoja de estilos, por ejemplo:

  ```text
  components/ConfigurationTabs/
  ├── ConfigurationTabs.jsx
  └── ConfigurationTabs.module.css
  ```

- Mantén el router en `src/app/router.jsx`. Al agregar una pantalla navegable,
  registra allí la ruta; no implementes routers paralelos dentro de una feature.

## React y componentes

- Usa componentes funcionales con un nombre descriptivo y exportación por
  defecto, de acuerdo con el patrón actual.
- Haz que las páginas compongan la pantalla y deleguen bloques con una
  responsabilidad clara a componentes. Cuando un bloque visual o de JSX se
  repita, extráelo en lugar de copiarlo.
- Coloca los datos estáticos de una pantalla fuera del cuerpo del componente y
  renderiza colecciones con `map` y una `key` estable, como en
  `EditionSettingsPage` y `ConfigurationTabs`.
- Mantén las props explícitas y con nombres claros. Evita componentes que
  dependan de datos globales implícitos cuando esos datos pueden pasarse por
  props.
- Usa HTML semántico (`header`, `nav`, `main`, `section`, `article`, `footer`)
  según el propósito del contenido. Asocia cada control de formulario con su
  `label` y evita elementos no interactivos como sustitutos de botones o
  enlaces.
- Usa `Button` para ejecutar acciones y `Link` o `NavLink` de `react-router`
  para navegar. Mantén la configuración de rutas centralizada.
- Cuando una acción no envíe un formulario, especifica `type="button"` en los
  botones HTML. Para controles compartidos, respeta la API existente de
  `Button`.
- Añade atributos ARIA cuando aporten contexto o nombre accesible. Los estados
  no deben comunicarse únicamente mediante color; acompaña el color con texto o
  una señal accesible.

## Estilos y sistema visual

- Usa CSS Modules por pantalla o componente (`*.module.css`) e importa el
  módulo localmente. Aplica clases con `styles.nombre`; evita estilos globales
  desde las hojas de una feature.
- Usa los tokens de `src/core/styles/tokens.css` para colores, tipografía,
  espaciado, radios, tamaños de texto y ancho de contenido. No repitas valores
  visuales que ya tengan un token.
- Conserva el sistema visual existente: tipografías `Inter` y `Source Serif 4`,
  espaciado en múltiplos de 4 px, radios pequeños y la paleta del congreso.
- Si un valor visual nuevo se repite o representa una decisión del sistema de
  diseño, agrégalo como token en `core/styles/tokens.css` en vez de duplicarlo
  en varias hojas. Reserva valores literales para necesidades locales sin un
  token apropiado.
- Usa `src/core/styles/global.css` solo para reglas verdaderamente globales.
  Conserva sus estilos de foco visible y respeto por `prefers-reduced-motion`.
- Diseña las pantallas para distintos anchos de viewport. Reorganiza columnas,
  acciones y navegación cuando sea necesario y evita desbordamientos
  horizontales; toma como referencia el comportamiento adaptable de
  `EditionSettingsPage.module.css`.

## Commits y verificación

- Mantén los commits pequeños, atómicos y enfocados en una sola feature o
  cambio coherente. No mezcles historias distintas ni cambios ajenos al trabajo.
- Usa mensajes breves y descriptivos que indiquen qué se agregó o corrigió.
- Antes de dar por terminada una implementación, ejecuta las comprobaciones
  disponibles que correspondan:

  ```bash
  npm run lint
  npm run build
  git diff --check
  ```

- No des por válida una pantalla solo porque compila: revisa también que use los
  componentes y tokens compartidos, mantenga la semántica y se adapte a
  pantallas pequeñas.
