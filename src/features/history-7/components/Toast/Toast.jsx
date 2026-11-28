import { useEffect, useRef } from 'react'
import styles from './Toast.module.css'

/* Mensaje breve que se cierra solo. role="status" lo anuncia a lectores de pantalla. */
function Toast({ alCerrar, duracion = 3500, mensaje }) {
  /* Se guarda alCerrar en una ref para que el temporizador no se reinicie en cada render. */
  const closeRef = useRef(alCerrar)

  useEffect(() => {
    closeRef.current = alCerrar
  })

  useEffect(() => {
    const timer = setTimeout(() => closeRef.current(), duracion)
    return () => clearTimeout(timer)
  }, [duracion, mensaje])

  return (
    <div className={styles.toast} role="status">
      <span aria-hidden="true" className={styles.icon}>
        ✓
      </span>
      <span>{mensaje}</span>
      <button
        aria-label="Cerrar mensaje"
        className={styles.close}
        onClick={alCerrar}
        type="button"
      >
        ×
      </button>
    </div>
  )
}

export default Toast
