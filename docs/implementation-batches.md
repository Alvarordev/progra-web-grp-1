# Corrección de pantallas en tres batches

Referencia: `Tema6_Mockups_f.pdf`, páginas 4–55. Se conserva la ampliación del flujo 1.4 de recuperación (pantalla 12), incluido el código local de demostración.

1. **Navegación y base local:** rutas públicas y por rol, destinos del pie, identidades de demostración, estados compartidos de trabajos, decisiones y programa. Las claves existentes conservan su formato y los datos previos.
2. **Flujos conectados:** borradores y envíos, asignación, revisión, dictamen, programa, usuarios y métricas. Guardado asíncrono con recuperación al recargar.
3. **Fidelidad visual:** tamaños y estados de modales, composición y densidad del PDF, revisión de escritorio con Playwright y prevención de desbordamientos en anchos menores, sin un diseño móvil adicional.

## Cuentas de demostración

- Comité: `admin@aloe.ulima.edu.pe` / `Admin1234`.
- Autor: `rosa.quispe@aloe.ulima.edu.pe` / `Congreso2026`.
- Revisor: `luis.ramirez@ulima.edu.pe` / `Congreso2026`.

Las credenciales iniciales de las cuentas de ejemplo se derivan al usarlas por primera vez. Una credencial cambiada tiene prioridad. La identidad de sesión no guarda contraseñas. Los registros nuevos se conservan en el navegador actual.

## Verificación

Por batch: `npm run lint`, `npm run build`, `git diff --check` y recorridos puntuales de Playwright. Las comprobaciones no se conservan como archivos de tests en el repositorio.

## Batch 1 — completado

Rutas por rol y destinos públicos completos. Cuentas de demostración y repositorios de decisiones y programa. Validación: lint, build, diff sin errores y acceso por login del comité a Usuarios.

## Batch 2 — completado

- Borradores, coautores y envíos comparten `congress:works`; el comité y el autor leen el mismo registro.
- Bandeja, seguimiento, consolidado y métricas se calculan con trabajos, revisores y evaluaciones compartidos. Los ids antiguos de revisores conservan compatibilidad.
- Decisiones guardadas/publicadas, programas y orden de exposición persistidos. La publicación mantiene una instantánea pública.
- Bloqueo de cuentas efectivo en login; se conservan las evaluaciones entregadas y se liberan las asignaciones pendientes del revisor bloqueado.
- Descargas de listado CSV, reporte, programa PDF y calendario ICS. La versión final se adjunta mediante un enlace HTTPS persistido.
- Recordatorios registrados localmente. No se envían correos a servicios externos.

Playwright comprobó autor → borrador → recarga → coautores → envío → comité → asignación → revisor → evaluación → decisión → sesión. También confirmó publicación pública, descargas PDF/ICS, bloqueo de recepción y rechazo del login de una cuenta bloqueada. Lint, build y `git diff --check` correctos.

Las fechas iniciales reproducen el PDF de 2026: el comité debe actualizar el cronograma para abrir un plazo vigente. La ampliación 1.4 permanece sin cambios.

## Batch 3 — completado

- Referencia principal de escritorio, 1920 × 1080. Se ajustaron encabezado, navegación, columnas, jerarquía, formularios, tablas, tarjetas y pie. No se creó un diseño móvil adicional.
- Modales compartidos con anchos de 620, 640, 660, 820 y 880 px según su lámina; decisión con cuerpo, pie y estados seleccionados. Foco contenido y retorno al control de apertura.
- Consolidado con título en dos líneas, KPI con acentos por indicador, tabla compacta y comentarios en tres columnas.
- Paginación y filtros conectados con las colecciones actuales; errores de puntajes vacíos visibles. El registro valida al enviar para evitar que el primer clic solo desplace el formulario.
- Datos del encabezado sincronizados al guardar. Los cambios de correo conservan credenciales y trabajos. La instantánea pública del programa se conserva al editar un borrador, incluidos registros anteriores sin instantánea.
- Carga de pantallas por ruta; el JavaScript principal pasa a unos 233 kB antes de gzip. Se mantiene el aviso previo de PostCSS sobre `from`.

Playwright verificó 47 destinos únicos mediante 69 visitas por rol, estados vacíos y errores, guardado/recarga/reapertura, eliminación específica y rechazo de escrituras inválidas. Se repitió el recorrido autor–comité–revisor–decisión–programa, publicación, descargas PDF/ICS y bloqueo de cuentas. Los seis anchos de modales de las láminas 21, 25, 38, 39, 47 y 55 coinciden con las medidas de referencia. Se comprobaron 320 y 390 px únicamente para evitar el desbordamiento de Revisores.

Las capturas y scripts puntuales están fuera del repositorio, en `/tmp/congress-review/`. La galería compara estados de escritorio; los valores de ejemplo varían con los datos y no representa una comparación automática píxel a píxel. La pantalla 12 y los archivos de recuperación 1.4 se conservaron. Lint, build y `git diff --check` correctos.
