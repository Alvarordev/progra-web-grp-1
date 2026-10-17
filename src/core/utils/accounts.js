import { splitAccountName } from './accountNames.js'
import { initialUsers } from './states/usersState.js'
import { roleValues } from './directory.js'
import {
  demoCredentialsRepository,
  participantRepository,
  participantsRepository,
  sessionRepository,
  usersRepository,
  reviewersRepository,
} from './repositories.js'
import { createPasswordCredential, verifyPasswordCredential } from './passwords.js'
import { isInstitutionalEmail, validateRegistrationDetails } from './states/participantState.js'

import { defaultCommitteeAccount, defaultCommitteeCredential } from './states/defaultCommitteeState.js'

export function getAccountHome(role) {
  if (role === 'committee') return '/configuracion'
  return role === 'reviewer' ? '/mi-cuenta' : '/autor'
}

export async function getActiveAccount() {
  const session = await sessionRepository.get()
  if (!session) return null
  const accounts = await getParticipantAccounts()
  const participant = accounts.find(account => account.userId === session.userId)
  if (!participant) throw new Error('No se encontró la cuenta de la sesión activa.')
  const users = await usersRepository.get()
  const managed = users.find(user => user.correo.toLowerCase() === participant.email.toLowerCase())
  if (managed?.bloqueado) return null
  return managed ? { ...participant, name: managed.nombre, role: roleValues[managed.rol] } : participant
}

// Migración aditiva: conserva la ficha anterior y las cuentas ya registradas.
export async function getParticipantAccounts() {
  const [storedAccounts, legacy] = await Promise.all([
    participantsRepository.get(), participantRepository.get(),
  ])
  const accounts = storedAccounts.filter(account =>
    account.userId !== defaultCommitteeAccount.userId &&
    account.email.trim().toLowerCase() !== defaultCommitteeAccount.email,
  )
  accounts.push(storedAccounts.find(account => account.userId === defaultCommitteeAccount.userId) ?? { ...defaultCommitteeAccount })
  for (const user of initialUsers) {
    const seeded = accounts.find(account => account.userId === `participant:${user.correo}` && account.name === user.nombre)
    if (seeded && seeded.names === user.nombre.split(' ')[0] && seeded.surnames === user.nombre.split(' ').slice(1).join(' ')) Object.assign(seeded, splitAccountName(user.nombre))
    if (!accounts.some(account => account.userId === `participant:${user.correo}` || account.email.toLowerCase() === user.correo.toLowerCase())) {
      accounts.push({ userId: `participant:${user.correo}`, ...splitAccountName(user.nombre), name: user.nombre, email: user.correo, institution: user.institucion, role: roleValues[user.rol] })
    }
  }
  if (legacy && !accounts.some(account => account.userId === legacy.userId || account.email.toLowerCase() === legacy.email.toLowerCase())) {
    accounts.push(legacy)
  }
  const reviewers = await reviewersRepository.get()
  const nextReviewers = reviewers.map(reviewer => {
    const account = accounts.find(item => item.role !== 'author' && item.name.replace(/^(Mg\.|Dra?\.|Ing\.)\s*/, '').split(' ').some(part => part.length > 3 && reviewer.nombre.includes(part)) && item.institution === reviewer.institucion)
    return reviewer.userId || !account ? reviewer : { ...reviewer, userId: account.userId, email: account.email }
  })
  for (const account of accounts.filter(item => ['reviewer', 'both'].includes(item.role))) {
    if (!nextReviewers.some(item => item.userId === account.userId)) nextReviewers.push({ id: `reviewer:${account.userId}`, userId: account.userId, email: account.email, nombre: account.name, institucion: account.institution, lineasInteres: [], asignadas: 0, entregadas: 0, vencidas: 0 })
  }
  if (JSON.stringify(reviewers) !== JSON.stringify(nextReviewers)) await reviewersRepository.save(nextReviewers)
  return JSON.stringify(accounts) === JSON.stringify(storedAccounts)
    ? accounts
    : await participantsRepository.save(accounts)
}

export async function startAccountSession(participant, remember = false) {
  const { userId, name, role } = participant
  // Se mantiene la ficha activa para los consumidores existentes.
  await participantRepository.save(participant)
  await sessionRepository.start({ userId, name, role }, remember)
}

export async function registerParticipant(participant, password) {
  if (!['author', 'reviewer', 'both'].includes(participant?.role) || !validateRegistrationDetails(participant) || !isInstitutionalEmail(participant.email)) {
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
  const credential = credentials.find(item => item.email === normalizedEmail) ??
    (normalizedEmail === defaultCommitteeAccount.email ? defaultCommitteeCredential : null)
  const managed = (await usersRepository.get()).find(user => user.correo.toLowerCase() === normalizedEmail)
  if (managed?.bloqueado) return null
  if (credential) {
    if (!await verifyPasswordCredential(password, credential)) return null
  } else {
    if (!initialUsers.some(user => user.correo.toLowerCase() === normalizedEmail) || password !== 'Congreso2026') return null
    const created = await createPasswordCredential(normalizedEmail, password)
    await demoCredentialsRepository.save([...credentials, created])
  }
  return managed ? { ...participant, role: roleValues[managed.rol] } : participant
}
