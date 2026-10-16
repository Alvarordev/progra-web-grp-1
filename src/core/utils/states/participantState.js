const participantRoles = ['author', 'reviewer', 'both']

export function requiresAcademicDetails(role) {
  return role === 'author' || role === 'both'
}

export function validateRegistrationDetails(participant) {
  return Boolean(participant && validateParticipant(participant) && participant.acceptedTerms === true && (
    !requiresAcademicDetails(participant.role) ||
    (Boolean(participant.degree?.trim()) && /^[0-9]+$/.test(participant.studentCode ?? ''))
  ))
}

export function isInstitutionalEmail(email) {
  return /^[^\s@]+@(?:aloe\.)?ulima\.edu\.pe$/i.test(email.trim())
}

export function validateParticipants(value) {
  return Array.isArray(value) && value.every(item => item !== null && validateParticipant(item)) &&
    new Set(value.map(item => item.userId)).size === value.length &&
    new Set(value.map(item => item.email.trim().toLowerCase())).size === value.length
}

export const initialParticipant = null

export function validateParticipant(value) {
  if (value === null) return true

  const requiredFields = [
    'userId',
    'names',
    'surnames',
    'name',
    'email',
    'institution',
    'role',
  ]
  // Los campos nuevos son opcionales al leer fichas antiguas; el registro los exige según el rol.
  const allowedFields = new Set([...requiredFields, 'degree', 'studentCode', 'acceptedTerms'])

  return Boolean(
    value &&
      typeof value === 'object' &&
      Object.keys(value).every((field) => allowedFields.has(field)) &&
      requiredFields.every((field) => typeof value[field] === 'string' && value[field].trim()) &&
      ['degree', 'studentCode'].every(field => value[field] === undefined || typeof value[field] === 'string') &&
      (value.acceptedTerms === undefined || typeof value.acceptedTerms === 'boolean') &&
      participantRoles.includes(value.role),
  )
}
