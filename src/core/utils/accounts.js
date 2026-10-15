import {
  demoCredentialsRepository,
  participantRepository,
  participantsRepository,
  sessionRepository,
} from './repositories.js'
import { createPasswordCredential, verifyPasswordCredential } from './passwords.js'
import { isInstitutionalEmail, validateRegistrationDetails } from './states/participantState.js'

export function getAccountHome(role) {
  return role === 'reviewer' ? '/mi-cuenta' : '/autor'
}

export async function getActiveAccount() {
  const session = await sessionRepository.get()
  if (!session) return null
  const accounts = await getParticipantAccounts()
  const participant = accounts.find(account => account.userId === session.userId)
  if (!participant) throw new Error('No se encontró la cuenta de la sesión activa.')
  return participant
}

// Migración aditiva: conserva la ficha anterior y las cuentas ya registradas.
export async function getParticipantAccounts() {
  const [accounts, legacy] = await Promise.all([
    participantsRepository.get(), participantRepository.get(),
  ])
  if (legacy && !accounts.some(account => account.userId === legacy.userId || account.email.toLowerCase() === legacy.email.toLowerCase())) {
    return await participantsRepository.save([...accounts, legacy])
  }
  return accounts
}

export async function startAccountSession(participant, remember = false) {
  const { userId, name, role } = participant
  // Se mantiene la ficha activa para los consumidores existentes.
  await participantRepository.save(participant)
  await sessionRepository.start({ userId, name, role }, remember)
}

export async function registerParticipant(participant, password) {
  if (!validateRegistrationDetails(participant) || !isInstitutionalEmail(participant.email)) {
    throw new Error('Complete los datos obligatorios de su rol y acepte las bases y el tratamiento de datos.')
  }
  const accounts = await getParticipantAccounts()
  const email = participant.email.trim().toLowerCase()
  if (accounts.some(account => account.email.trim().toLowerCase() === email)) {
    throw new Error('Ya existe una cuenta con este correo. Inicie sesión o recupere su contraseña.')
  }
  const credential = await createPasswordCredential(email, password)
  const credentials = await demoCredentialsRepository.get()
  await demoCredentialsRepository.save([...credentials.filter(item => item.email !== email), credential])
  await participantsRepository.save([...accounts, { ...participant, email }])
}

export async function authenticateParticipant(email, password) {
  const normalizedEmail = email.trim().toLowerCase()
  const accounts = await getParticipantAccounts()
  const participant = accounts.find(account => account.email.trim().toLowerCase() === normalizedEmail)
  if (!participant) return null
  const credentials = await demoCredentialsRepository.get()
  const credential = credentials.find(item => item.email === normalizedEmail)
  if (!credential || !await verifyPasswordCredential(password, credential)) return null
  return participant
}
