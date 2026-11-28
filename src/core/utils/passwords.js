export function getPasswordRequirements(password) {
  return [
    { label: 'Mínimo 8 caracteres', valid: Array.from(password).length >= 8 },
    { label: 'Al menos una mayúscula', valid: /\p{Lu}/u.test(password) },
    { label: 'Al menos un número', valid: /[0-9]/.test(password) },
    {
      label: 'Máximo 72 bytes UTF-8',
      valid: new TextEncoder().encode(password).length <= 72,
    },
  ]
}
