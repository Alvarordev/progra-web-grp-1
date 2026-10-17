export const demoReviewerId = 'demo-reviewer'

export const initialReviewerProfile = {
  names: 'Luis Fernando',
  surnames: 'Ramírez Cárdenas',
  email: 'luis.ramirez@ulima.edu.pe',
  institution: 'Universidad de Lima',
  interestIds: [
    'artificial-intelligence-data',
    'software-engineering',
    'innovation-entrepreneurship',
  ],
}

export function validateReviewerProfiles(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.entries(value).every(
      ([id, profile]) =>
        id.trim() &&
        profile &&
        typeof profile === 'object' &&
        Object.keys(profile).length === 5 &&
        ['names', 'surnames', 'email', 'institution'].every(
          key => typeof profile[key] === 'string' && profile[key].trim()
        ) &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email) &&
        Array.isArray(profile.interestIds) &&
        profile.interestIds.every(id => typeof id === 'string' && id.trim()) &&
        new Set(profile.interestIds).size === profile.interestIds.length
    )
  )
}

export function getReviewerProfile(profiles, session, participant) {
  const reviewerId = session?.userId ?? demoReviewerId
  if (profiles[reviewerId]) {
    return profiles[reviewerId]
  }
  if (participant && participant.userId === reviewerId) {
    return {
      names: participant.names,
      surnames: participant.surnames,
      email: participant.email,
      institution: participant.institution,
      interestIds:
        participant.email.toLowerCase() === initialReviewerProfile.email
          ? [...initialReviewerProfile.interestIds]
          : [],
    }
  }
  return structuredClone(initialReviewerProfile)
}

export function getReviewerUser(profile) {
  return {
    nombre: `${profile.names} ${profile.surnames}`,
    iniciales: `${profile.names.trim()[0]}${profile.surnames.trim()[0]}`.toUpperCase(),
    rol: 'Rol: Revisor',
  }
}
