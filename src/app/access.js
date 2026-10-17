import { worksRepository, reviewersRepository } from '../core/utils/repositories.js'
import { redirect } from 'react-router'
import { getActiveAccount } from '../core/utils/accounts.js'
import { hasRoleAccess } from '../core/utils/access.js'
import { getReviewerAssignments } from '../core/utils/reviewerAssignments.js'

export function createAccessLoader(roles, message, requireAssignment = false) {
  return async ({ params }) => {
    const participant = await getActiveAccount()
    if (!participant) return redirect('/iniciar-sesion')
    const hasAssignment = !requireAssignment || getReviewerAssignments({}, participant.userId, await worksRepository.get(), await reviewersRepository.get()).some(item => item.codigo === params.codigo)
    const allowed = hasRoleAccess(participant, roles) && hasAssignment
    return {
      participant,
      allowed,
      message: hasRoleAccess(participant, roles) && !hasAssignment
        ? 'Solo puede evaluar los trabajos que le han sido asignados como revisor.'
        : message,
    }
  }
}
