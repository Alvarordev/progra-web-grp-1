import { initialProgram, validateProgram } from './states/programState.js'
import { validateDecisions } from './states/decisionsState.js'
import { initialUsers, validateUsers } from './states/usersState.js'
import { initialWorks, initialReviewers, initialPendingReviews, validateWorks, validateReviewers, validatePendingReviews } from './states/worksAssignmentState.js'
import createStateRepository from './persistence/createStateRepository.js'
import createSessionRepository from './persistence/createSessionRepository.js'
import {
  initialEdition,
  initialEditionStatus,
  validateEdition,
  validateEditionStatus,
} from './states/editionState.js'
import { validateSession } from './states/sessionState.js'
import { initialSessionPreferences, validateSessionPreferences } from './states/sessionPreferencesState.js'
import { initialParticipant, validateParticipant, validateParticipants } from './states/participantState.js'
import { initialWorkTypes, validateWorkTypes } from './states/workTypesState.js'
import { thematicAxes, validateThematicAxes } from './states/thematicAxesState.js'
import { initialSchedule, validateSchedule } from './states/scheduleState.js'
import { initialCriteria, validateCriteria } from './states/criteriaState.js'
import { validateReviews } from './states/reviewsState.js'
import { validateDemoCredentials } from './states/demoCredentialsState.js'
import { validateReviewerProfiles } from './states/reviewerProfilesState.js'

export const sessionPreferencesRepository = createStateRepository({
  name: 'session-preferences', defaultValue: initialSessionPreferences, validate: validateSessionPreferences,
})

export const participantsRepository = createStateRepository({
  name: 'participants', defaultValue: [], validate: validateParticipants,
})

export const reviewerProfilesRepository = createStateRepository({
  name: 'reviewer-profiles', defaultValue: {}, validate: validateReviewerProfiles,
})

export const demoCredentialsRepository = createStateRepository({
  name: 'demo-credentials', defaultValue: [], validate: validateDemoCredentials,
})

export const reviewsRepository = createStateRepository({
  name: 'reviews', defaultValue: {}, validate: validateReviews,
})

export const workTypesRepository = createStateRepository({
  name: 'work-types', defaultValue: initialWorkTypes, validate: validateWorkTypes,
})

export const thematicAxesRepository = createStateRepository({
  name: 'thematic-axes', defaultValue: thematicAxes, validate: validateThematicAxes,
})

export const scheduleRepository = createStateRepository({
  name: 'schedule', defaultValue: initialSchedule, validate: validateSchedule,
})

export const criteriaRepository = createStateRepository({
  name: 'criteria', defaultValue: initialCriteria, validate: validateCriteria,
})

// Punto de composición: aquí se sustituirán los repositorios por los de la API.
export const editionRepository = createStateRepository({
  name: 'edition',
  defaultValue: initialEdition,
  validate: validateEdition,
})

export const editionStatusRepository = createStateRepository({
  name: 'edition-status',
  defaultValue: initialEditionStatus,
  validate: validateEditionStatus,
})

const persistentSessionRepository = createStateRepository({
  name: 'session',
  defaultValue: null,
  validate: validateSession,
})

const tabSessionRepository = createStateRepository({
  storage: 'sessionStorage', name: 'session', defaultValue: null, validate: validateSession,
})

export const sessionRepository = createSessionRepository({
  persistentRepository: persistentSessionRepository,
  tabRepository: tabSessionRepository,
  preferencesRepository: sessionPreferencesRepository,
})

export const participantRepository = createStateRepository({
  name: 'participant',
  defaultValue: initialParticipant,
  validate: validateParticipant,
})

export const worksRepository = createStateRepository({
  name: 'works', defaultValue: initialWorks, validate: validateWorks,
})

export const reviewersRepository = createStateRepository({
  name: 'reviewers', defaultValue: initialReviewers, validate: validateReviewers,
})

export const pendingReviewsRepository = createStateRepository({
  name: 'pending-reviews', defaultValue: initialPendingReviews, validate: validatePendingReviews,
})

export const usersRepository = createStateRepository({
  name: 'users', defaultValue: initialUsers, validate: validateUsers,
})

export const programRepository = createStateRepository({
  name: 'program', defaultValue: initialProgram, validate: validateProgram,
})

export const decisionsRepository = createStateRepository({
  name: 'decisions', defaultValue: {}, validate: validateDecisions,
})
