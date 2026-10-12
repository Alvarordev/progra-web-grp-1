const participantRoles = ['author', 'reviewer', 'both']

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
  const allowedFields = new Set(requiredFields)

  return Boolean(
    value &&
      typeof value === 'object' &&
      Object.keys(value).every((field) => allowedFields.has(field)) &&
      requiredFields.every((field) => typeof value[field] === 'string' && value[field].trim()) &&
      participantRoles.includes(value.role),
  )
}
