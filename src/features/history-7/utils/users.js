/* Traduce entre las filas de /api/gestion_usuarios y los datos que muestra la pantalla. */

export const roleLabels = {
  author: 'Autor',
  reviewer: 'Revisor',
  both: 'Ambos',
  committee: 'Comité',
}

const roleValues = Object.fromEntries(
  Object.entries(roleLabels).map(([value, label]) => [label, value])
)

export const toUser = fila => ({
  id: fila.id,
  nombres: fila.nombres,
  apellidos: fila.apellidos,
  nombre: fila.nombre,
  correo: fila.correo,
  rol: roleLabels[fila.rol],
  femenino: fila.femenino,
  institucion: fila.institucion,
  actividad: fila.actividad,
  bloqueado: fila.bloqueado,
  motivoBloqueo: fila.motivoBloqueo,
})

export const toUserBody = datos => ({
  nombres: datos.nombres,
  apellidos: datos.apellidos,
  correo: datos.correo,
  rol: roleValues[datos.rol],
  institucion: datos.institucion,
})
