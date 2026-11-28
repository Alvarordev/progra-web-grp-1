import { useEdicionActual } from '../../utils/editionRepositories.js'
import { getEditionStatusLabel } from '../../utils/reception.js'
import styles from './Header.module.css'

function Header() {
  const { edition, status, schedule, loading, error } = useEdicionActual()
  let stateLabel = getEditionStatusLabel(status, schedule)
  if (loading) {
    stateLabel = 'Cargando…'
  } else if (error) {
    stateLabel = 'No disponible'
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSide}>
          <div className={styles.avatar} aria-hidden="true">
            C
          </div>
          <div className={styles.leftSideText}>
            <p className={styles.title}>Congreso Académico Estudiantil</p>
            <p className={styles.description}>
              Universidad de Lima - Edición{' '}
              <span className={styles.year}>{edition?.editionYear}</span>
            </p>
          </div>
        </div>
        <div className={styles.rightSide}>
          <p>Estado de la edición</p>
          <div className={styles.state} aria-busy={loading}>
            <div aria-hidden="true" />
            <span>{stateLabel}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
