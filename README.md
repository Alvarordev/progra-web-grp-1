# Congreso Académico Estudiantil

Proyecto universitario desarrollado con React y Vite. Permite a los autores enviar
trabajos, a los revisores evaluarlos y al comité organizador configurar la edición,
asignar revisores y publicar resultados.

## Cómo ejecutarlo

Requisitos: Node.js 20.19 o superior, o bien 22.13 o superior.

```bash
npm install
npm run dev
```

Luego abre la dirección que muestra la terminal (normalmente `http://localhost:5173`)
e inicia sesión en `/iniciar-sesion`.

## Cuentas de prueba

### Cuentas del backend

Levanta PostgreSQL y la API del repositorio `progra-web-backend`, ejecuta
`npm run db:migrate` y carga los datos de ejemplo con `npm run db:seed`.
Entra con la contraseña `DEMO_PASSWORD` que configuraste al cargar los datos.
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
- [Referencia de pantallas](./src/ejemplo/README.md).
- [Persistencia de estados y futura migración a una API](./src/core/utils/README.md).

## Integración

La fidelidad visual se contrasta con el mockup de escritorio. `clienteApi.js`
centraliza HTTP y cookies, `usuariosApi.js` expone las operaciones de cuentas y
`accounts.js` conserva aliases de integración. Las funciones nuevas y las rutas
del backend se nombran en español; los nombres de componentes existentes se
conservan para mantener sus imports. Usa el mismo host para frontend y API al
trabajar con cookies, o utiliza el proxy `/api` de Vite.
