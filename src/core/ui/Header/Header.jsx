import useStoredState from '../../utils/useStoredState.js'
import { editionRepository, editionStatusRepository, scheduleRepository } from '../../utils/repositories.js'
import { initialEdition, initialEditionStatus } from '../../utils/states/editionState.js'
import { initialSchedule } from '../../utils/states/scheduleState.js'
import { getEditionStatusLabel } from '../../utils/reception.js'
import styles from './Header.module.css'

function Header() {
  const edition = useStoredState(editionRepository, initialEdition)
  const status = useStoredState(editionStatusRepository, initialEditionStatus)
  const schedule = useStoredState(scheduleRepository, initialSchedule)
  const stateLabel = status.loading || schedule.loading
    ? 'Cargando estado…'
    : status.error || schedule.error
      ? 'Estado no disponible'
      : getEditionStatusLabel(status.value, schedule.value)

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSide}>
          <div className={styles.avatar} aria-hidden="true">C</div>
          <div className={styles.leftSideText}>
            <p className={styles.title}>Congreso Académico Estudiantil</p>
            <p className={styles.description}>Universidad de Lima - Edición {edition.value.editionYear}</p>
          </div>
        </div>
        <div className={styles.rightSide}>
          <p>Estado de la edición</p>
          <div className={styles.state}>
            <div aria-hidden="true" />
            <span>{stateLabel}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
