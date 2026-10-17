import { participantsRepository, usersRepository, reviewersRepository } from './repositories.js'

export const roleLabels = { author: 'Autor', reviewer: 'Revisor', both: 'Ambos', committee: 'Comité' }
export const roleValues = { Autor: 'author', Revisor: 'reviewer', Ambos: 'both', Comité: 'committee' }

export async function getDirectory() {
  const [users, participants] = await Promise.all([usersRepository.get(), participantsRepository.get()])
  const result = [...users]
  for (const participant of participants) {
    const found = result.find(user => user.correo.toLowerCase() === participant.email.toLowerCase())
    if (found) {
      Object.assign(found, { userId: participant.userId })
    } else {
      result.push({ id: Math.max(0, ...result.map(user => user.id)) + 1, userId: participant.userId, nombre: participant.name, correo: participant.email, institucion: participant.institution, rol: roleLabels[participant.role], femenino: false, actividad: '—', bloqueado: false })
    }
  }
  return result
}

export async function saveDirectory(users) {
  const [previous, participants, reviewers] = await Promise.all([usersRepository.get(), participantsRepository.get(), reviewersRepository.get()])
  const nextParticipants = participants.map(participant => {
    const user = users.find(item => item.userId === participant.userId || item.correo.toLowerCase() === participant.email.toLowerCase())
    if (!user) return participant
    return { ...participant, name: user.nombre, names: user.nombre.split(' ')[0], surnames: user.nombre.split(' ').slice(1).join(' ') || user.nombre, email: user.correo, institution: user.institucion, role: roleValues[user.rol] }
  })
  await usersRepository.save(users)
  try {
    await participantsRepository.save(nextParticipants)
    await reviewersRepository.save(reviewers.map(reviewer => {
      const participant = participants.find(item => item.userId === reviewer.userId)
      const user = users.find(item => item.userId === reviewer.userId || item.correo === (reviewer.email ?? participant?.email))
      return user ? { ...reviewer, nombre: user.nombre, institucion: user.institucion, bloqueado: user.bloqueado } : reviewer
    }))
  } catch (error) {
    await usersRepository.save(previous)
    await participantsRepository.save(participants)
    throw error
  }
  return users
}

export const directoryRepository = { get: getDirectory, save: saveDirectory, remove: () => usersRepository.remove() }
