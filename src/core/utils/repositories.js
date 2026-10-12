import { createLocalStorageAdapter } from './persistence/localStorageAdapter.js'
import createStateRepository from './persistence/createStateRepository.js'
import {
  initialEdition,
  initialEditionStatus,
  validateEdition,
  validateEditionStatus,
} from './states/editionState.js'
import { validateSession } from './states/sessionState.js'

const adapter = createLocalStorageAdapter()

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
