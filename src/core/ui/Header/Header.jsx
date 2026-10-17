import useStoredState from '../../utils/useStoredState.js'
import { editionRepository, editionStatusRepository } from '../../utils/repositories.js'
import { initialEdition, initialEditionStatus } from '../../utils/states/editionState.js'
import styles from './Header.module.css'

function Header({ estado }) {
  const edition = useStoredState(editionRepository, initialEdition)
  const status = useStoredState(editionStatusRepository, initialEditionStatus)

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
            <span>{status.loading ? estado : status.value}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
