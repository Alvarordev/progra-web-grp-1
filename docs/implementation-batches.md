# Corrección de pantallas en tres batches

Referencia: `Tema6_Mockups_f.pdf`, páginas 4–55. Se conserva la ampliación del flujo 1.4 de recuperación (pantalla 12), incluido el código local de demostración.

1. **Navegación y base local:** rutas públicas y por rol, destinos del pie, identidades de demostración, estados compartidos de trabajos, decisiones y programa. Las claves existentes conservan su formato y los datos previos.
2. **Flujos conectados:** borradores y envíos, asignación, revisión, dictamen, programa, usuarios y métricas. Guardado asíncrono con recuperación al recargar.
3. **Fidelidad visual:** tamaños y estados de modales, composición y densidad del PDF, adaptación y revisión completa con Playwright.

## Cuentas de demostración

- Comité: `admin@aloe.ulima.edu.pe` / `Admin1234`.
- Autor: `rosa.quispe@aloe.ulima.edu.pe` / `Congreso2026`.
- Revisor: `luis.ramirez@ulima.edu.pe` / `Congreso2026`.

Las credenciales iniciales de las cuentas de ejemplo se derivan al usarlas por primera vez. Una credencial cambiada tiene prioridad. La identidad de sesión no guarda contraseñas. Los registros nuevos se conservan en el navegador actual.

## Verificación

Por batch: `npm run lint`, `npm run build`, `git diff --check` y recorridos puntuales de Playwright. Las comprobaciones no se conservan como archivos de tests en el repositorio.
