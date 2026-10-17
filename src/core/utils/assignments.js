import { getReviewKey } from './states/reviewsState.js'

export function reviewerIdentity(reviewer) {
  return reviewer.userId ?? ({ 'rev-1': 'demo-reviewer', 'rev-5': 'reviewer-oscar', 'rev-2': 'reviewer-carmen' })[reviewer.id] ?? reviewer.id
}

export function findReviewer(reviewers, userId) {
  return reviewers.find(reviewer => reviewer.userId === userId || reviewer.id === userId || userId === 'demo-reviewer' && reviewer.id === 'rev-1')
}

export function getReview(reviews, reviewer, code) {
  const aliases = [reviewerIdentity(reviewer), reviewer.id]
  if (reviewer.id === 'rev-1') aliases.push('demo-reviewer', 'participant:luis.ramirez@ulima.edu.pe')
  if (reviewer.id === 'rev-5') aliases.push('reviewer-oscar')
  if (reviewer.id === 'rev-2') aliases.push('reviewer-carmen')
  return aliases.map(id => reviews[getReviewKey(id, code)]).find(Boolean)
}

export function getWorkReviewers(work, reviewers) {
  return (work.revisoresAsignados ?? []).map(id => reviewers.find(reviewer => reviewer.id === id)).filter(Boolean)
}

export function getPendingReviews(works, reviewers, reviews) {
  return works.flatMap(work => getWorkReviewers(work, reviewers).filter(reviewer => !reviewer.bloqueado && getReview(reviews, reviewer, work.codigo)?.status !== 'submitted').map(reviewer => {
    const date = work.reviewDeadline ?? (work.fechaLimite?.includes('/') ? work.fechaLimite.split('/').reverse().join('-') : work.fechaLimite) ?? '2026-10-20'
    const overdue = new Date(`${date}T23:59:59`).getTime() < Date.now()
    return { id: `${work.codigo}:${reviewer.id}`, codigo: work.codigo, trabajo: work.titulo, revisorId: reviewer.id, revisor: reviewer.nombre, fechaLimite: date.split('-').reverse().join('/'), estado: overdue ? 'Vencida' : 'Pendiente', esVencida: overdue }
  }))
}
