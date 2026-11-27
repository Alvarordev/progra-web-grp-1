# Persistencia e integración con la API

Las pantallas consumen servicios y repositorios compartidos. Historia 1 utiliza
la API del backend y cookies de sesión; los datos locales de otras historias
mantienen sus repositorios de demostración.

## Archivos

- `clienteApi.js`: HTTP, cookies, JSON y errores de API.
- `usuariosApi.js`: registro, sesiones, perfil, contraseña y recuperación.
- `accounts.js`: coordinación de cuentas y aliases utilizados por otras pantallas.
- `useReviewerProfile.js`: carga/guardado del perfil y actividad de PostgreSQL.
- `revisionesApi.js`: lee `/revisiones`, adapta las evaluaciones al formato de las
  pantallas (`aRevisionLocal`) y guarda una evaluación por operación.
- `gestionUsuariosApi.js` y `metricasApi.js`: gestión de usuarios (listar, invitar,
  editar, bloquear, reactivar) y métricas del comité (Historia 7).
- `decisionesApi.js`: lee `/trabajos` y guarda el dictamen con
  `PUT /decisiones/:trabajoId` (`guardarDecision`, `aCuerpoDecision`, `aDecisionLocal`).
- `asignacionesApi.js`: consume las rutas de trabajos recibidos, candidatos,
  asignación individual/en lote, revisores, seguimiento y recordatorios (Historia 4).
- `conferenceApi.js`: aliases para la integración existente de ediciones.
- `editionRepositories.js`: edición, estado, fechas y catálogos mediante la API.
- `repositories.js`: composición de repositorios remotos y locales.
- `persistence/createStateRepository.js`: JSON local validado, usado por estados
  que todavía pertenecen a la demostración local.

## Cuentas y sesiones

```js
import {
  obtenerCuentaActiva,
  iniciarSesionCuenta,
  cerrarSesionCuenta,
} from './accounts.js'

const cuenta = await iniciarSesionCuenta(correo, contrasena, recordar)
const activa = await obtenerCuentaActiva()
await cerrarSesionCuenta()
```

El backend determina la identidad, el bloqueo y el rol. El navegador envía la
cookie HttpOnly con `credentials: 'include'`; no puede leerla con JavaScript.
Cambiar una identidad antigua en localStorage no autentica ni concede permisos.
`sessionRepository.get()` consulta la sesión remota y `remove()` la cierra. La
identidad no se guarda mediante `save()` en el navegador.

`sessionPreferencesRepository` conserva únicamente `{ remember: boolean }` para
precargar el checkbox. La cookie es temporal sin Recordarme y persistente durante
7 días con esa opción. El store de sesión tiene una duración temporal de 8 horas
de inactividad y se conserva entre reinicios del backend.

Los aliases `getActiveAccount`, `getAccountHome` y `endAccountSession` permiten
mantener imports existentes. Las funciones nuevas se nombran en español.

## Registro

RegistrationPage valida el formulario, envía `POST /api/usuarios` e inicia sesión
después con `POST /api/usuarios/sesiones`. El servidor verifica dominio, rol,
términos, campos académicos, confirmación y duplicados. Devuelve mensajes por
campo en `errores` y nunca devuelve la contraseña ni su hash.

Autor y Ambos van a `/autor`; Revisor a `/mi-cuenta`; Comité a `/configuracion`.
El registro público no permite crear un comité. `RegistrationNotice` consume
`accountCreated` del estado de navegación y muestra un aviso de cinco segundos.

## Perfil y actividad

`useReviewerProfile`, cuyo nombre de archivo se conserva por compatibilidad,
utiliza `usePerfilUsuario` para consumir `/api/usuarios/perfil`. Sirve para autor,
revisor y ambos. La edición usa un borrador local y se confirma solo tras esperar
la respuesta del servidor. No escribe el perfil en los repositorios de ejemplo.

Los intereses guardan IDs de ejes vigentes. El backend modifica solo la cuenta de
la sesión, conserva el correo y evita editar roles o bloqueos desde Mi cuenta.
La actividad se deriva de asignaciones y evaluaciones: un borrador no es una
entrega y las vencidas siguen pendientes. La bandeja consume esas asignaciones.

`revisionesApi` consulta las evaluaciones autorizadas de PostgreSQL y traduce su
estado, criterios y comentarios. Guarda una evaluación por operación y conserva
la protección de lectura de las ya enviadas. Los criterios del borrador provienen
de la edición del trabajo, no de una edición arbitraria del navegador.

## Contraseñas y recuperación

El backend usa bcrypt para las cuentas nuevas y acepta las credenciales scrypt
preexistentes, actualizándolas al autenticar. Las contraseñas de Historia 1 no se
escriben en `congress:credentials` ni en el estado persistente del navegador.

La recuperación solicita un código al servidor. En desarrollo los correos se
consultan en Mailpit, puerto 8025. Verificar el código devuelve una prueba que
permanece solo en memoria React hasta guardar la nueva contraseña. El servidor
comprueba vencimiento y uso único también al guardar e invalida las sesiones.

El cambio desde Mi cuenta exige la contraseña actual. Conserva la sesión actual
con una cookie nueva e invalida las otras. Registro, login, cambio y recuperación
utilizan la misma cuenta en PostgreSQL.

## Rutas y acceso

Los loaders consultan la sesión remota. Sin sesión redirigen al login; un rol
incompatible muestra 403. Evaluación comprueba una asignación real y los detalles
de autor comprueban propiedad del trabajo. Esas pantallas no sustituyen los
middlewares de autenticación/autorización de cada operación del backend.

404 corresponde al comodín de URL. Los fallos de lectura/conexión tienen su
mensaje separado. Volver al inicio o ver un 403 no borra una sesión válida.

## Ediciones y bases

Los repositorios de edición, cronograma, ejes, tipos y criterios consumen
`/api/ediciones`. Sus `get/save/remove` son asíncronos y los catálogos traducen
un cambio de la pantalla a POST/PUT/DELETE del elemento correspondiente.
La publicación pública de bases utiliza esas lecturas sin modificar datos.

El cronograma se representa como `AAAA-MM-DDTHH:mm` en Lima. `reception.js`
combina estado y plazo para indicar si la recepción está abierta. Las fechas
viajan a la API con zona horaria. Guardar borradores de configuración no publica
automáticamente cambios de etapa o programación.

## Revisión y dictamen (Historia 5)

El consolidado del comité y la pantalla de evaluación leen `/revisiones` y
`/trabajos` mediante `revisionesApi` y `decisionesApi`. El dictamen se guarda o
publica con `PUT /api/decisiones/:trabajoId` y ya no usa localStorage. Los hooks
`useConsolidado` y `useTrabajoEvaluacion` y los adaptadores que dependen de la
pantalla están en `features/history-5/utils/`; no contienen llamadas HTTP.

## Estados locales de otras historias

`createStateRepository` mantiene `{ version: 1, data }` y claves `congress:*`.
`get/save/remove` devuelven promesas y `subscribe` permite refrescar consumidores
del mismo repositorio. Se conserva una colección guardada vacía y los datos
incompatibles producen un error sin borrado automático.

`worksRepository`, los datos de directorio, decisiones, recordatorios y programa
mantienen los adaptadores que utiliza su historia. Editar un directorio local no
modifica la identidad, credenciales o permisos reales del backend. Importar esos
datos a SQL requiere la integración explícita de la historia correspondiente.

Los formularios conservan borradores locales hasta guardar. Los mensajes,
modales, errores y flags de carga no se persisten como datos de negocio.

## Verificación

Ejecutar `npm run lint`, `npm run format:check`, `npm run build` y
`git diff --check`. Comprobar registro, sesión al recargar, cierre, permisos,
perfil e intereses, cambio de contraseña y recuperación por correo. Las pruebas
puntuales no agregan infraestructura de tests al repositorio.
