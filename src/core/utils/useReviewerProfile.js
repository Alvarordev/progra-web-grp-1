import { useEffect, useState } from 'react'
import { participantRepository, participantsRepository, reviewerProfilesRepository, sessionRepository, thematicAxesRepository, reviewersRepository, usersRepository } from './repositories.js'
import { getParticipantAccounts } from './accounts.js'
import { demoReviewerId, getReviewerProfile, initialReviewerProfile } from './states/reviewerProfilesState.js'

export default function useReviewerProfile() {
  const [profile, setProfile] = useState(initialReviewerProfile)
  const [reviewerId, setReviewerId] = useState(demoReviewerId)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [session, setSession] = useState(null)

  useEffect(() => {
    let active = true
    Promise.all([reviewerProfilesRepository.get(), sessionRepository.get(), getParticipantAccounts()])
      .then(([profiles, session, accounts]) => {
        if (!active) return
        const participant = accounts.find(account => account.userId === session?.userId)
        setSession(participant ? { ...session, role: participant.role } : null)
        setReviewerId(session?.userId ?? demoReviewerId)
        setProfile(getReviewerProfile(profiles, session, participant))
      })
      .catch(cause => { if (active) setError(cause.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  async function save(nextProfile) {
    if (loading || saving || error) throw new Error('No se pudo cargar el perfil para guardarlo.')
    setSaving(true)
    try {
      const profiles = await reviewerProfilesRepository.get()
      await reviewerProfilesRepository.save({ ...profiles, [reviewerId]: nextProfile })
      const accounts = await getParticipantAccounts()
      const participant = accounts.find(account => account.userId === reviewerId)
      if (participant) {
        const updated = {
          ...participant,
          names: nextProfile.names,
          surnames: nextProfile.surnames,
          name: `${nextProfile.names} ${nextProfile.surnames}`,
          institution: nextProfile.institution,
        }
        await participantsRepository.save(accounts.map(account => account.userId === reviewerId ? updated : account))
        await participantRepository.save(updated)
        const [users, reviewers, axes] = await Promise.all([usersRepository.get(), reviewersRepository.get(), thematicAxesRepository.get()])
        await usersRepository.save(users.map(user => user.correo.toLowerCase() === updated.email.toLowerCase() ? { ...user, nombre: updated.name, institucion: updated.institution } : user))
        await reviewersRepository.save(reviewers.map(reviewer => reviewer.userId === reviewerId ? { ...reviewer, nombre: updated.name, institucion: updated.institution, lineasInteres: axes.filter(axis => nextProfile.interestIds.includes(axis.id)).map(axis => axis.nombre) } : reviewer))
        await sessionRepository.save({ userId: reviewerId, name: updated.name, role: updated.role })
      }
      setProfile(nextProfile)
    } finally {
      setSaving(false)
    }
  }

  return { profile, reviewerId, session, loading, saving, error, save }
}
