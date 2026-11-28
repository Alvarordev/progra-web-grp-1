// Identidad para la demostración; no contiene contraseñas ni credenciales.
export function validateSession(value) {
  return (
    value === null ||
    (typeof value === 'object' &&
      Object.keys(value).every(field => ['userId', 'name', 'role'].includes(field)) &&
      typeof value.userId === 'string' &&
      value.userId.length > 0 &&
      typeof value.name === 'string' &&
      value.name.length > 0 &&
      typeof value.role === 'string' &&
      value.role.length > 0)
  )
}
