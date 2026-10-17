import { splitAccountName } from './accountNames.js'
import { getReview } from './assignments.js'
import { participantsRepository, usersRepository, reviewersRepository, worksRepository, reviewsRepository, demoCredentialsRepository } from './repositories.js'

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
  const [previous, participants, reviewers, credentials, works, reviews] = await Promise.all([usersRepository.get(), participantsRepository.get(), reviewersRepository.get(), demoCredentialsRepository.get(), worksRepository.get(), reviewsRepository.get()])
  const nextParticipants = participants.map(participant => {
    const user = users.find(item => item.userId === participant.userId || item.correo.toLowerCase() === participant.email.toLowerCase())
    if (!user) return participant
    return { ...participant, name: user.nombre, ...(user.nombre === participant.name ? {} : splitAccountName(user.nombre)), email: user.correo, institution: user.institucion, role: roleValues[user.rol] }
  })
  await usersRepository.save(users)
  try {
    await participantsRepository.save(nextParticipants)
    const emailChanges = participants.flatMap(participant => {
      const next = nextParticipants.find(item => item.userId === participant.userId)
      return next.email === participant.email ? [] : [[participant.email, next.email]]
    })
    const emailMap = new Map(emailChanges)
    await demoCredentialsRepository.save(credentials.map(credential => ({ ...credential, email: emailMap.get(credential.email) ?? credential.email })))
    const nextReviewers = reviewers.map(reviewer => {
      const participant = participants.find(item => item.userId === reviewer.userId)
      const user = users.find(item => item.userId === reviewer.userId || item.correo === (reviewer.email ?? participant?.email))
      return user ? { ...reviewer, nombre: user.nombre, email: user.correo, institucion: user.institucion, bloqueado: user.bloqueado } : reviewer
    })
    await reviewersRepository.save(nextReviewers)
    await worksRepository.save(works.map(work => ({ ...work, ownerEmail: emailMap.get(work.ownerEmail) ?? work.ownerEmail, ...(work.details?.autores ? { details: { ...work.details, autores: work.details.autores.map(author => ({ ...author, correo: emailMap.get(author.correo) ?? author.correo })) } } : {}), revisoresAsignados: work.revisoresAsignados.filter(id => { const reviewer = nextReviewers.find(item => item.id === id); return !reviewer?.bloqueado || getReview(reviews, reviewer, work.codigo)?.status === 'submitted' }) })))
  } catch (error) {
    await usersRepository.save(previous)
    await participantsRepository.save(participants)
    await reviewersRepository.save(reviewers)
    await demoCredentialsRepository.save(credentials)
    await worksRepository.save(works)
    throw error
  }
  return users
}

export const directoryRepository = { get: getDirectory, save: saveDirectory, remove: () => usersRepository.remove() }
