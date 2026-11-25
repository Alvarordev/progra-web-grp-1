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

### Comité organizador

Levanta PostgreSQL y la API del repositorio `progra-web-backend`, ejecuta
`npm run db:migrate` y carga los datos de ejemplo con `npm run db:seed`.
Entra con `ana.salazar@ulima.edu.pe` y la contraseña `DEMO_PASSWORD` que
configuraste al cargar los datos.

Vite envía `/api` al backend en `http://127.0.0.1:3000` durante desarrollo y
previsualización. Puedes configurar `BACKEND_URL` en `.env.local` si el backend
usa otra dirección. Por defecto se usa la edición de mayor año. Si necesitas
otra, define su ID en `VITE_EDICION_ID` y reinicia Vite. El despliegue del build
debe servir `/api` desde el mismo origen que el frontend.

### Perfiles precreados

Todos usan la contraseña **`Congreso2026`**.

| Nombre                       | Correo                               | Rol                 |
| ---------------------------- | ------------------------------------ | ------------------- |
| Rosa María Quispe Ttito      | `rosa.quispe@aloe.ulima.edu.pe`      | Autor               |
| Diego Alonso Chávez Manrique | `diego.chavez@aloe.ulima.edu.pe`     | Autor               |
| Sofía Bustamante León        | `sofia.bustamante@aloe.ulima.edu.pe` | Autor               |
| Mg. Luis Ramírez Cárdenas    | `luis.ramirez@ulima.edu.pe`          | Revisor             |
| Dr. Óscar Nakamura Trigoso   | `onakamura@pucp.edu.pe`              | Revisor             |
| Mg. Carmen Effio Vargas      | `carmen.effio@ulima.edu.pe`          | Revisor             |
| Mg. Renzo Bustamante Loayza  | `renzo.bustamante@up.edu.pe`         | Revisor             |
| Dra. Milagros Yupanqui Ríos  | `milagros.yupanqui@ulima.edu.pe`     | Revisor             |
| Ing. Jorge Palomino Ávila    | `jorge.palomino@ulima.edu.pe`        | Revisor (bloqueado) |

- La cuenta de Jorge Palomino está bloqueada a propósito, para probar ese caso: no
  puede iniciar sesión.
- La cuenta de Rosa Quispe es la más completa: tiene trabajos en borrador, en revisión,
  aceptado y rechazado.
- También puedes crear una cuenta nueva desde `/registro` (autor, revisor o ambos). La
  contraseña necesita 8 caracteres, una mayúscula y un número.

## Datos y reinicio

La configuración de ediciones se guarda en PostgreSQL mediante la API. Limpiar
los datos del navegador reinicia los estados locales de demostración de las demás
historias. La sesión del comité usa una cookie HTTP-only del backend.

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

La fidelidad visual se contrasta con el mockup de escritorio. Los repositorios compartidos conectan la configuración de la edición con la API y mantienen los datos de demostración de las demás historias.
