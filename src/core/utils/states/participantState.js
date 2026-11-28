export function requiresAcademicDetails(role) {
  return role === 'author' || role === 'both'
}

export function isInstitutionalEmail(email) {
  return /^[^\s@]+@(?:aloe\.)?ulima\.edu\.pe$/i.test(email.trim())
}
