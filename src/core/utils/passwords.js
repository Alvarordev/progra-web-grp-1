import { passwordIterations } from './states/demoCredentialsState.js'

export function getPasswordRequirements(password) {
  return [
    { label: 'Mínimo 8 caracteres', valid: Array.from(password).length >= 8 },
    { label: 'Al menos una mayúscula', valid: /\p{Lu}/u.test(password) },
    { label: 'Al menos un número', valid: /[0-9]/.test(password) },
  ]
}

function toHex(bytes) {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')
}

async function derivePassword(password, salt, iterations) {
  const key = await globalThis.crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'],
  )
  const bits = await globalThis.crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, key, 256,
  )
  return toHex(new Uint8Array(bits))
}

export async function createPasswordCredential(email, password) {
  if (!getPasswordRequirements(password).every(requirement => requirement.valid)) {
    throw new Error('La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.')
  }
  const salt = globalThis.crypto.getRandomValues(new Uint8Array(16))
  return {
    email: email.trim().toLowerCase(),
    salt: toHex(salt),
    hash: await derivePassword(password, salt, passwordIterations),
    iterations: passwordIterations,
    algorithm: 'PBKDF2-SHA-256',
  }
}

export async function verifyPasswordCredential(password, credential) {
  const salt = Uint8Array.from(credential.salt.match(/.{2}/g), byte => parseInt(byte, 16))
  return await derivePassword(password, salt, credential.iterations) === credential.hash
}
