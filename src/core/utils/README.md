# Persistencia de estados

Las pantallas consumen repositorios de `repositories.js`. No deben llamar a
`localStorage` directamente. La primera entrega usa el almacenamiento del
navegador; el contrato asíncrono permite sustituirlo por una API.

## Organización

- `persistence/createStateRepository.js`: lectura, escritura y eliminación de JSON
  en el navegador, con una clave y un validador por estado.
- `persistence/createSessionRepository.js`: elección entre sesión de pestaña y
  sesión persistente para «Recordarme».
- `states/`: valores iniciales y validadores de cada estado persistente.
- `repositories.js`: composición y exportación de los repositorios disponibles.

## Contrato común

Todos los métodos devuelven una promesa:

| Método | Resultado |
| --- | --- |
| `get()` | Datos guardados o una copia del valor inicial si no existen. |
| `save(value)` | Datos guardados después de validar y completar la escritura. |
| `remove()` | Elimina únicamente los datos de ese repositorio. |

Las operaciones fallidas rechazan la promesa. La pantalla debe mostrar el error
y anunciar éxito únicamente después de `await save(...)`. Durante la carga o
el guardado debe impedir cambios que puedan sobrescribirse. No persistir
modales, mensajes, errores ni otros estados transitorios de la interfaz.

`EditionSettingsPage` muestra una integración completa. Los datos generales se
guardan con «Guardar cambios» y el estado con «Cambiar estado de la edición».
Cambiar el estado no guarda las ediciones pendientes del formulario.

La configuración cuenta con repositorios de ejes, tipos de trabajo, cronograma
y criterios. Ejes, tipos y criterios se guardan al confirmar su modal; sus
eliminaciones también se guardan inmediatamente después de confirmar. Fechas
se guardan con su botón principal. Cancelar un modal no modifica los datos
guardados. Una lista guardada
vacía se conserva como tal y no se reemplaza por los datos de ejemplo.

`useStoredState` evita repetir la carga y el guardado en cada pantalla. Devuelve
`value`, `loading`, `saving`, `error` y `save(value)`; no guarda automáticamente
al escribir. Los formularios conservan su borrador local hasta guardar.

El cronograma usa cadenas `AAAA-MM-DDTHH:mm` en horario de Lima y exige recepción
anterior a revisión y revisión anterior a publicación. Los criterios pueden
guardarse con una suma pendiente; cerrar la recepción y pasar a «En revisión»
exige una suma de 100. El cierre requiere aceptar la casilla y escribir `CERRAR`.
Por ahora se guarda el estado: los efectos sobre envíos se conectarán cuando
exista esa historia.

Las evaluaciones se guardan en `reviewsRepository`, identificadas por usuario
y código de trabajo. Sin login se utiliza el revisor `demo-reviewer`. El borrador
admite campos incompletos; el envío requiere puntajes enteros de 0 a 20,
comentarios obligatorios, recomendación y pesos que sumen 100. Una evaluación
enviada se recupera en modo lectura y actualiza la bandeja. Se conservan los
ejemplos de revisiones entregadas del mockup para la demostración.
Al recuperar un borrador se utilizan los criterios actuales, conservando los
puntajes y comentarios de los identificadores que sigan presentes. Una
evaluación enviada conserva su copia de los criterios y pesos usados al enviar.

## Sesión de demostración

El registro y el inicio de sesión utilizan una identidad local de demostración:

```js
import { sessionRepository } from './repositories.js'

await sessionRepository.save({
  userId: 'user-1',
  name: 'Ana Salazar',
  role: 'committee',
})
const session = await sessionRepository.get() // null si no hay sesión
await sessionRepository.remove() // cierre de sesión
```

Esta identidad local sirve para la demostración y no autentica usuarios ni
autoriza operaciones. El validador admite únicamente `userId`, `name` y `role`;
no guardar contraseñas ni tokens en este estado. Cuando exista el backend,
la autenticación y los permisos se comprobarán en el servidor.

`participantsRepository` (`congress:participants`) conserva varias fichas,
identificadas por `userId` y correo único. Cada una incluye `userId`, `names`,
`surnames`, `name`, `email`, `institution` y `role`, sin la contraseña. Las fichas
nuevas incluyen además `degree`, `studentCode` y `acceptedTerms`. Autor y Ambos
exigen carrera y código numérico; Revisor oculta esos controles y guarda cadenas
vacías. Todos los roles deben aceptar las bases y el tratamiento de datos.
Estos campos son una ampliación compatible del formato: las fichas antiguas
pueden seguir sin ellos, sin inventar datos ni una aceptación previa. Los
requisitos adicionales se comprueban al crear una cuenta nueva.
`participantRepository` conserva una copia de la ficha activa para compatibilidad.

`getParticipantAccounts()` realiza una migración explícita y aditiva: incorpora
la ficha antigua si aún no figura en la colección. No cambia su versión ni borra
datos. Si ya existe esa cuenta, prevalece la colección. Antes de cambiar de
cuenta, registro y login ejecutan esta lectura, preservando la ficha anterior.

`registerParticipant()` admite `@ulima.edu.pe` y `@aloe.ulima.edu.pe`, rechaza
correos duplicados y guarda una credencial derivada por cuenta.
`authenticateParticipant()` requiere tanto ficha como credencial coincidente;
`startAccountSession()` guarda la ficha activa y la identidad después de verificar.
Las fichas antiguas sin credencial deben establecerla mediante recuperación.
Solo se navega al terminar las escrituras: autor a `/autor`, revisor a
`/mi-cuenta` (Historia 1.5), ambos a `/autor` con enlace a la cuenta de revisor.
### Recordarme en este equipo

`startAccountSession(participant, remember)` inicia la identidad mediante
`sessionRepository.start(value, remember)`. Si `remember` es `true`, utiliza
`localStorage`; si es `false` (incluido el registro), utiliza `sessionStorage`
de la pestaña. En ambos casos se conserva el formato versionado y la clave
`congress:session`, en el almacenamiento correspondiente. Al elegir una modalidad
se elimina la identidad de la otra; si falla una escritura intermedia, se intenta
restaurar la sesión anterior y se informa del error.

`get()` prioriza la sesión de pestaña y recupera también las sesiones persistentes
antiguas sin borrarlas ni cambiar su versión. `save(value)` conserva la modalidad
activa, de modo que editar el perfil no convierte una sesión temporal en permanente.
`remove()` elimina solo `congress:session` de ambos almacenamientos. Cuentas,
perfiles, credenciales y datos del congreso se conservan al cerrar sesión.

`sessionPreferencesRepository` guarda únicamente `{ remember: boolean }` en
`congress:session-preferences` para recuperar la elección del control del login.
La preferencia se confirma después de un inicio de sesión correcto, no al fallar
las credenciales. La sesión de pestaña desaparece al cerrar esa pestaña; las
cuentas y las credenciales permanecen disponibles para volver a entrar.

### Aviso de registro

`RegistrationNotice` muestra la confirmación solo si la navegación posterior al
registro incluye `accountCreated`. Consume esa señal mediante un reemplazo del
estado de navegación, sin persistir mensajes. La notificación desaparece a los
cinco segundos con una transición final; respeta `prefers-reduced-motion` y limpia
el temporizador al salir. No aparece al iniciar sesión, recargar o volver al inicio.

La portada (`/` y `/history-1`) recupera la cuenta mediante `getActiveAccount()`.
Con una sesión muestra la navegación y el perfil del rol activo, incluidos
«Mi cuenta» y «Cerrar sesión», y evita ofrecer otro inicio de sesión desde su
acción principal. Sin sesión conserva la navegación pública. Visitar «Inicio»
solo consulta la identidad: no elimina ni reemplaza la sesión guardada.

## Bases públicas (1.1)

`/bases` pertenece a Historia 1. Consulta, sin editar, los repositorios de edición,
estado, ejes, tipos de trabajo, cronograma y criterios. Muestra requisitos de
participación, límites por tipo, fechas y pesos configurados. Si los criterios
todavía no suman 100 %, informa de que están en preparación; no modifica la
configuración para ocultar la inconsistencia.

«Ver bases completas», «Bases del congreso», «Bases y requisitos» y el enlace de
aceptación del registro llevan a esta página. El acceso a ejes desde el pie lleva
a `/bases#rules-axes`. La descarga de la portada continúa entregando exclusivamente
`Tema6_Mockups_f.pdf`, según el requisito del entregable.

## Mi cuenta y actividad

`AccountPage` reproduce la vista 1.5 y su variante de autor. `/mi-cuenta` y
`/autor/cuenta` muestran la cuenta del participante activo. Los autores tienen
datos personales y cambio de contraseña; `reviewer` y `both` ven además líneas
de interés y actividad. La variante de autor no carga ejes ni evaluaciones.
`reviewerProfilesRepository` conserva por compatibilidad su nombre y guarda
los datos personales de ambas variantes y los
identificadores de las líneas de interés por usuario en
`congress:reviewer-profiles`. La pantalla exige una sesión local con ficha de
participante; sin sesión vuelve al login.
La identidad de ejemplo `demo-reviewer` se conserva como referencia para los
consumidores existentes de la bandeja; no inicia una sesión en Mi cuenta.
Con una ficha registrada se usan sus datos. El correo es de
solo lectura. La selección se construye con `thematicAxesRepository`, incluyendo
los nombres y el total de ejes vigentes, y se persiste con «Guardar cambios».
Los ejes eliminados no se cuentan y se retiran de la selección al guardar.

`reviewerAssignments.js` centraliza las seis asignaciones de Luis del mockup 5.1,
también presentes en los resúmenes 1.5 y 4.3. Son datos de demostración, no
asignaciones creadas por un comité. Un revisor recién registrado tiene cero
asignaciones. Tanto la bandeja como «Mi actividad» combinan esta misma lista con
las evaluaciones de `reviewsRepository` del usuario actual. Inicialmente Luis
tiene seis asignadas, cuatro entregadas y dos pendientes; las vencidas también
son pendientes. Un borrador no cuenta como entrega y enviar una evaluación
incrementa las entregadas sin incrementar las asignadas. Las líneas de interés
no crean ni eliminan asignaciones existentes.

Para la selección inicial se sigue 1.5 (IA y datos, Ingeniería de software e
Innovación), aunque el listado ilustrativo 4.3 muestra solo dos líneas para Luis.
Las vistas 4.2 y 4.3 son las que consumirán estas preferencias al implementar la
asignación del comité. «Cambiar contraseña» comprueba la contraseña local actual
y utiliza el mismo repositorio de credenciales que la recuperación y el login;
si todavía no existe una credencial, ofrece acceder a la recuperación.

## Acceso denegado y página no encontrada (1.6)

Las comprobaciones se declaran en `src/app/router.jsx` con loaders de
`src/app/access.js`. Sin sesión se redirige al login. Una sesión con rol
incompatible muestra `AccessDeniedPage`, conservando su nombre y navegación,
sin eliminar ni sustituir su identidad. La bandeja y las evaluaciones requieren
rol `reviewer` o `both`; evaluar requiere además que el código pertenezca a sus
asignaciones. El inicio del autor permite `author` o `both`. Mi cuenta admite
ambos perfiles. Los fallos al leer la persistencia tienen su propio mensaje,
sin presentarse como una falta de permisos.

La ruta comodín muestra `NotFoundPage` (404) con la navegación del participante
activo o la pública. Los errores reutilizan `AccessMessage` y el sistema visual.
El retorno del 403 de autor lleva a `/autor`, ya que «Mis trabajos» pertenece a
Historia 3. «Ver el programa» conserva el destino `/programa` previsto para
Historia 6, cuya pantalla aún no está registrada en este router.

## Contraseñas locales de demostración

La recuperación actualiza `demoCredentialsRepository` (`congress:demo-credentials`)
por correo normalizado. Se guardan una sal aleatoria y una derivación
PBKDF2-SHA-256 de 210 000 iteraciones, sin la contraseña original. Este estado
está separado de la ficha y de la sesión, y no constituye autenticación real.
El inicio de sesión verifica esta derivación contra la ficha del mismo correo
en la colección de participantes y recupera su identidad y rol. Una derivación
aislada, sin ficha registrada, no inicia una sesión. Registro, recuperación y
cambio de contraseña utilizan el mismo repositorio de credenciales.

El formulario exige 8 caracteres, una mayúscula, un número y confirmación
coincidente. Solo redirige tras completar `await save(...)`; un fallo conserva el
formulario y muestra el error. Los cambios se conservan al recargar en el mismo
navegador. `await demoCredentialsRepository.remove()` elimina únicamente las
credenciales de demostración. La sustitución por una API trasladará la
recuperación y la verificación al backend.

## Agregar otro estado

1. Definir su valor inicial y validador en `states/`, con nombres en inglés.
2. Registrar un repositorio en `repositories.js` con un `name` único y estable.
3. Importar ese repositorio en la feature y usar `await get/save/remove`.
4. Manejar carga, errores y confirmación de guardado en la pantalla.

Ejemplo de registro:

```js
export const preferencesRepository = createStateRepository({
  name: 'preferences',
  defaultValue: { theme: 'light' },
  validate: (value) => ['light', 'dark'].includes(value?.theme),
})
```

Guarda objetos, arreglos, cadenas, números, booleanos o `null`. Representa las
fechas como cadenas; no guardes funciones, archivos ni referencias circulares.
El validador de cada estado comprueba los datos al leer y antes de guardar.

La implementación usa directamente `getItem`, `setItem`, `removeItem`,
`JSON.parse` y `JSON.stringify` en una única función compartida. No necesita
adaptadores ni validación JSON recursiva. Por defecto usa `localStorage`;
la opción `storage: 'sessionStorage'` se reserva para la sesión de pestaña.
El acceso a `window` ocurre al llamar los métodos, no al importar el módulo.

Las claves conservan el prefijo `congress:` y el formato `{ version: 1, data }`
para recuperar los datos existentes. No hay un sistema configurable de versiones:
si en el futuro cambia el formato, habrá que migrar los datos explícitamente.
Un JSON inválido, un formato incompatible o un bloqueo del navegador producen
un error sin borrar los datos. `remove()` elimina solo la clave del repositorio.

## Migración a SQL mediante una API

SQL se accederá desde el backend. Implementar repositorios de API que expongan
el mismo contrato `get()`, `save(value)` y `remove()`, conservando las estructuras
de datos o mapeando las respuestas del servidor. Sustituir las exportaciones
en `repositories.js`; las pantallas seguirán esperando promesas y manejando
sus errores. La API no necesita conocer las claves ni el envoltorio de
localStorage. La importación de datos locales al servidor, si se necesita,
será un proceso separado; no ocurre automáticamente al cambiar repositorios.

Esta primera versión guarda datos solo en el navegador y origen actuales.
No sincroniza dispositivos ni pestañas; entre escrituras prevalece la última.

## Verificación

Ejecutar `npm run lint`, `npm run build` y `git diff --check`.
Verificar de forma puntual el guardado, la recuperación después de recargar y
la eliminación de datos. No conservar archivos de tests ni infraestructura
de pruebas en el repositorio.

## Cuenta predeterminada del comité organizador

La aplicación incluye `admin@aloe.ulima.edu.pe`, con contraseña inicial
`Admin1234` y rol `committee` («Comité organizador»). Al iniciar sesión abre
`/configuracion`, desde donde se accede a las pantallas de Historia 2.
`states/defaultCommitteeState.js` contiene la ficha y la credencial derivada
con PBKDF2, sin almacenar la contraseña en la sesión.

`getParticipantAccounts()` incorpora la ficha reservada a las cuentas existentes
sin eliminar los demás participantes. El registro público solo admite autor,
revisor o ambos y no permite registrar este correo nuevamente. El login usa la
credencial incluida cuando no hay una credencial guardada para ese correo;
una contraseña cambiada mediante recuperación tiene prioridad. Al eliminar
las credenciales locales vuelve a estar disponible la contraseña inicial.
Cerrar sesión elimina solo la identidad activa, conservando las demás cuentas.
Esta cuenta forma parte de la demostración local; los permisos reales
corresponderán al backend.
