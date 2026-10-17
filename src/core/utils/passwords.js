export function getPasswordRequirements(password) {
  return [
    { label: 'Mínimo 8 caracteres', valid: Array.from(password).length >= 8 },
    { label: 'Al menos una mayúscula', valid: /\p{Lu}/u.test(password) },
    { label: 'Al menos un número', valid: /[0-9]/.test(password) },
  ]
}

export function createPasswordCredential(email, password) {
  if (!getPasswordRequirements(password).every(requirement => requirement.valid)) {
    throw new Error(
      'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.'
    )
  }
  return { email: email.trim().toLowerCase(), password }
}

export function verifyPasswordCredential(password, credential) {
  return password === credential.password
}
