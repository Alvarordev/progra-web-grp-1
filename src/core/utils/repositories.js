import createStateRepository from './persistence/createStateRepository.js'
import { consultarSesion, cerrarSesion } from './usuariosApi.js'
import {
  initialSessionPreferences,
  validateSessionPreferences,
} from './states/sessionPreferencesState.js'

export const sessionPreferencesRepository = createStateRepository({
  name: 'session-preferences',
  defaultValue: initialSessionPreferences,
  validate: validateSessionPreferences,
})

export { repositorioRevisiones as reviewsRepository } from './revisionesApi.js'

export {
  criteriaRepository,
  editionRepository,
  editionStatusRepository,
  scheduleRepository,
  thematicAxesRepository,
  workTypesRepository,
} from './editionRepositories.js'

export const sessionRepository = { get: consultarSesion, remove: cerrarSesion }
