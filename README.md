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

Estas cuentas ya existen al abrir la aplicación por primera vez.

### Comité organizador

| Correo                    | Contraseña  | Al ingresar           |
| ------------------------- | ----------- | --------------------- |
| `admin@aloe.ulima.edu.pe` | `Admin1234` | Abre `/configuracion` |

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
| Dra. Ana Salazar Bermúdez    | `ana.salazar@ulima.edu.pe`           | Comité              |
| Ing. Jorge Palomino Ávila    | `jorge.palomino@ulima.edu.pe`        | Revisor (bloqueado) |

- La cuenta de Jorge Palomino está bloqueada a propósito, para probar ese caso: no
  puede iniciar sesión.
- La cuenta de Rosa Quispe es la más completa: tiene trabajos en borrador, en revisión,
  aceptado y rechazado.
- También puedes crear una cuenta nueva desde `/registro` (autor, revisor o ambos). La
  contraseña necesita 8 caracteres, una mayúscula y un número.

## Datos y reinicio

No hay backend: todo se guarda en el `localStorage` del navegador, con claves que
empiezan por `congress:`. Las contraseñas se guardan sin cifrar porque es solo una
demostración local, no una autenticación real.

Para volver al estado inicial, borra los datos del sitio desde las herramientas del
navegador (Aplicación → Almacenamiento local) y recarga la página.

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

La fidelidad visual se contrasta con el mockup de escritorio. Los datos de negocio se guardan en el navegador mediante los repositorios compartidos.
