import styles from './UserProfile.module.css'

function UserProfile({ iniciales, nombre, rol }) {
  return (
    <div className={styles.profile}>
      <div className={styles.identity}>
        <span className={styles.name}>{nombre}</span>
        <span className={styles.role}>{rol}</span>
      </div>
      <span aria-hidden="true" className={styles.initials}>
        {iniciales}
      </span>
    </div>
  )
}

export default UserProfile
