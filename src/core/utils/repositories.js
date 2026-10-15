import { createLocalStorageAdapter } from './persistence/localStorageAdapter.js'
import createStateRepository from './persistence/createStateRepository.js'
import {
  initialEdition,
  initialEditionStatus,
  validateEdition,
  validateEditionStatus,
} from './states/editionState.js'
import { validateSession } from './states/sessionState.js'
import { initialParticipant, validateParticipant } from './states/participantState.js'
import { initialWorkTypes, validateWorkTypes } from './states/workTypesState.js'
import { thematicAxes, validateThematicAxes } from './states/thematicAxesState.js'
import { initialSchedule, validateSchedule } from './states/scheduleState.js'
import { initialCriteria, validateCriteria } from './states/criteriaState.js'
import { validateReviews } from './states/reviewsState.js'
import {
  initialWorks,
  initialReviewers,
  initialPendingReviews,
  validateWorks,
  validateReviewers,
  validatePendingReviews,
} from './states/worksAssignmentState.js'

const adapter = createLocalStorageAdapter()

export const reviewsRepository = createStateRepository({
  adapter, name: 'reviews', defaultValue: {}, validate: validateReviews,
})

export const workTypesRepository = createStateRepository({
  adapter, name: 'work-types', defaultValue: initialWorkTypes, validate: validateWorkTypes,
})

export const thematicAxesRepository = createStateRepository({
  adapter, name: 'thematic-axes', defaultValue: thematicAxes, validate: validateThematicAxes,
})

export const scheduleRepository = createStateRepository({
  adapter, name: 'schedule', defaultValue: initialSchedule, validate: validateSchedule,
})

export const criteriaRepository = createStateRepository({
  adapter, name: 'criteria', defaultValue: initialCriteria, validate: validateCriteria,
})

// Punto de composición: aquí se sustituirán los repositorios por los de la API.
export const editionRepository = createStateRepository({
  adapter,
  name: 'edition',
  defaultValue: initialEdition,
  validate: validateEdition,
})

export const editionStatusRepository = createStateRepository({
  adapter,
  name: 'edition-status',
  defaultValue: initialEditionStatus,
  validate: validateEditionStatus,
})

export const sessionRepository = createStateRepository({
  adapter,
  name: 'session',
  defaultValue: null,
  validate: validateSession,
})

export const participantRepository = createStateRepository({
  adapter,
  name: 'participant',
  defaultValue: initialParticipant,
  validate: validateParticipant,
})

export const worksRepository = createStateRepository({
  adapter,
  name: 'works',
  defaultValue: initialWorks,
  validate: validateWorks,
})

export const reviewersRepository = createStateRepository({
  adapter,
  name: 'reviewers',
  defaultValue: initialReviewers,
  validate: validateReviewers,
})

export const pendingReviewsRepository = createStateRepository({
  adapter,
  name: 'pending-reviews',
  defaultValue: initialPendingReviews,
  validate: validatePendingReviews,
})
