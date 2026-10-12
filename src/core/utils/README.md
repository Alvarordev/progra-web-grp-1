# Persistencia de estados

Las pantallas consumen repositorios de `repositories.js`. No deben llamar a
`localStorage` directamente. La primera entrega usa el almacenamiento del
navegador; el contrato asíncrono permite sustituirlo por una API.

## Organización

- `persistence/localStorageAdapter.js`: acceso al navegador y serialización JSON.
- `persistence/createStateRepository.js`: claves, versiones y validación.
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
y criterios. Ejes y tipos se guardan al confirmar su modal. Fechas y criterios
se guardan con su botón principal; las modificaciones pendientes de criterios
no se guardan al cancelar un modal o abandonar la pantalla. Una lista guardada
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

El repositorio de sesión está preparado para el futuro formulario de login:

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

## Agregar otro estado

1. Definir su valor inicial y validador en `states/`, con nombres en inglés.
2. Registrar un repositorio en `repositories.js` con un `name` único y estable.
3. Importar ese repositorio en la feature y usar `await get/save/remove`.
4. Manejar carga, errores y confirmación de guardado en la pantalla.

Ejemplo de registro, reutilizando el adaptador común:

```js
export const preferencesRepository = createStateRepository({
  adapter,
  name: 'preferences',
  defaultValue: { theme: 'light' },
  validate: (value) => ['light', 'dark'].includes(value?.theme),
})
```

Solo se admiten datos serializables como JSON: objetos simples, arreglos,
cadenas, números finitos, booleanos y `null`. Representar fechas como cadenas
ISO; no guardar funciones, archivos, `Date`, `Map` ni referencias circulares.
El validador de cada estado debe comprobar su estructura completa.

Las claves usan el prefijo `congress:` y guardan `{ version: 1, data: ... }`.
No usar `localStorage.clear()`, porque eliminaría datos ajenos. Si el JSON es
inválido, falla la validación, cambia la versión o el navegador bloquea el
almacenamiento, se informa el error sin borrar automáticamente los datos. Un
guardado explícito válido puede reemplazar datos incompatibles. Una nueva
versión del formato requiere una migración explícita o un restablecimiento
deliberado con `remove()`; cambiar el número por sí solo no migra los datos.

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
