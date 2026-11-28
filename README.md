# Congreso Académico Estudiantil

Proyecto universitario desarrollado con React y Vite. Permite a los autores enviar
trabajos, a los revisores evaluarlos y al comité organizador configurar la edición,
asignar revisores y publicar resultados.

## Cómo ejecutarlo

Requisitos: Node.js 22.13 o superior, Docker y Docker Compose. El frontend
necesita el backend (API y PostgreSQL) para funcionar: todas las historias
consumen `/api`.

1. Backend (repositorio `progra-web-backend`, que se integra con este proyecto):
   copia `env.local` a `.env`, define `SESSION_SECRET` (aleatorio, 32 caracteres
   como mínimo) y `DEMO_PASSWORD` (12 caracteres como mínimo), y ejecuta:

   ```bash
   npm ci
   docker compose up -d --wait   # PostgreSQL y Mailpit
   npm run db:migrate
   npm run db:seed               # datos de ejemplo
   npm start                     # API en http://127.0.0.1:3000
   ```

2. Frontend:

   ```bash
   npm install
   npm run dev
   ```

Abre la dirección que muestra la terminal (normalmente `http://localhost:5173`)
e inicia sesión en `/iniciar-sesion`. Mailpit queda en `http://127.0.0.1:8025`.

## Cuentas de prueba

### Cuentas del backend

En el despliegue (https://progra-web-grp-1.vercel.app) todas las cuentas de
ejemplo usan la contraseña **`Democongreso2026`**. En local, la contraseña es el
`DEMO_PASSWORD` que configuraste al cargar los datos de ejemplo.
Registro, login, perfil, intereses y contraseñas se guardan en PostgreSQL.

Vite envía `/api` al backend en `http://127.0.0.1:3000` durante desarrollo y
previsualización. Puedes configurar `BACKEND_URL` en `.env.local` si el backend
usa otra dirección. Por defecto se usa la edición de mayor año. Si necesitas
otra, define su ID en `VITE_EDICION_ID` y reinicia Vite. El despliegue del build
debe servir `/api` desde el mismo origen que el frontend.

| Correo                          | Rol     |
| ------------------------------- | ------- |
| `rosa.quispe@aloe.ulima.edu.pe` | Autor   |
| `luis.ramirez@ulima.edu.pe`     | Revisor |
| `ana.salazar@ulima.edu.pe`      | Comité  |

Otras cuentas de ejemplo con la misma contraseña: autores
`diego.chavez@aloe.ulima.edu.pe`, `carlos.alarcon@aloe.ulima.edu.pe`,
`lucia.vargas@aloe.ulima.edu.pe` y `camila.ramos@aloe.ulima.edu.pe`; revisores
`carmen.effio@ulima.edu.pe`, `jorge.palomino@ulima.edu.pe`,
`milagros.yupanqui@ulima.edu.pe` y `patricia.zegarra@ulima.edu.pe`.

También puedes crear una cuenta nueva desde `/registro` como autor, revisor o
ambos. La contraseña necesita 8 caracteres, una mayúscula y un número, hasta
72 bytes UTF-8. Autor y Ambos requieren carrera/código; todos aceptan las bases.

## Recuperación y Mi cuenta

Levanta el servicio de correo de Compose junto con PostgreSQL. En desarrollo,
los códigos llegan a Mailpit en `http://127.0.0.1:8025`. La recuperación utiliza
un código de seis dígitos enviado por el servidor, con vencimiento, límite de
intentos y una prueba de uso único para guardar la nueva contraseña.

Mi cuenta guarda datos personales e intereses mediante `/api/usuarios/perfil`.
La actividad y la bandeja usan asignaciones de PostgreSQL. Las evaluaciones se
consultan/guardan con las rutas de revisión del backend y actualizan esa actividad.
Cambiar contraseña comprueba la actual y mantiene la sesión actual con una cookie
nueva; las otras sesiones se invalidan. Recuperarla cierra todas las sesiones.

## Datos y reinicio

Las cuentas, las sesiones, los perfiles, los intereses y la configuración de
ediciones se guardan en PostgreSQL mediante la API. La cookie HttpOnly
`congreso.sid` representa la sesión de cualquier rol. Sin Recordarme es temporal;
con Recordarme dura 7 días. La sesión del servidor también comprueba bloqueo y rol.

Limpiar localStorage no borra usuarios de PostgreSQL ni cambia sus permisos.
Solo la preferencia de Recordarme se conserva localmente para Historia 1.
Los registros locales de otras historias mantienen su alcance de demostración.

## Despliegue (Vercel + Dokploy)

El frontend se publica en Vercel y la API en Dokploy (ver el README del backend). `vercel.json`
hace dos cosas:

- **Reenvía `/api/*` al backend** con un `rewrite`. Así el navegador solo habla con el dominio de
  Vercel, la cookie de sesión (`HttpOnly`, `Secure`, `SameSite=Lax`) es de primer orden y no hay
  problemas de CORS ni de cookies de terceros. No se define `VITE_API_URL`. Si cambia el dominio
  del backend, edite el `destination` de `vercel.json`.
- **Devuelve `index.html` en cualquier otra ruta**, para que las rutas de React Router
  (`/programa`, `/autor/trabajos/...`) funcionen al recargar o abrirse desde un enlace.

Variables de entorno de Vercel (Project Settings → Environment Variables), todas opcionales:

| Variable          | Uso                                                                                 |
| ----------------- | ----------------------------------------------------------------------------------- |
| `VITE_EDICION_ID` | ID de la edición con la que trabaja la aplicación. Sin ella se usa la de mayor año. |

En el backend, `FRONTEND_ORIGINS` debe incluir el dominio de Vercel; de lo contrario la API
responde `403 Origen no permitido` a los envíos de formularios.

## Verificación

```bash
npm run lint
npm run format:check
npm run build
git diff --check
```

Para formatear el código automáticamente:

```bash
npm run format
```

## Convenciones

- [Normas de desarrollo](./AGENTS.md).
- [Capa de API, persistencia y estados locales](./src/core/utils/README.md).

## Integración

La fidelidad visual se contrasta con el mockup de escritorio. `clienteApi.js`
centraliza HTTP y cookies, `usuariosApi.js` expone las operaciones de cuentas y
`accounts.js` conserva aliases de integración. `revisionesApi.js` y
`decisionesApi.js` sirven a la revisión y el dictamen (Historia 5): las historias
no tienen su propio cliente HTTP. Las funciones nuevas y las rutas
del backend se nombran en español; los nombres de componentes existentes se
conservan para mantener sus imports. Usa el mismo host para frontend y API al
trabajar con cookies, o utiliza el proxy `/api` de Vite.
