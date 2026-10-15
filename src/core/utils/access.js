export function hasRoleAccess(participant, allowedRoles) {
  return Boolean(participant && allowedRoles.includes(participant.role))
}

export function getRoleLabel(role) {
  return { author: 'autor', reviewer: 'revisor', both: 'autor y revisor', committee: 'comité' }[role] ?? role
}
