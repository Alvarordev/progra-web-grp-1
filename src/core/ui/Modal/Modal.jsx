import { useEffect, useId, useRef } from 'react'
import Button from '../Button/Button.jsx'
import styles from './Modal.module.css'

function Modal({ alCerrar, children, titulo }) {
  const dialogId = useId()
  const dialogRef = useRef(null)
  const closeHandlerRef = useRef(alCerrar)

  useEffect(() => {
    closeHandlerRef.current = alCerrar
  }, [alCerrar])

  useEffect(() => {
    const dialogElement = dialogRef.current
    const elementoAnterior = document.activeElement
    const overflowAnterior = document.body.style.overflow

    document.body.style.overflow = 'hidden'
    dialogElement?.focus()

    return () => {
      document.body.style.overflow = overflowAnterior

      if (elementoAnterior instanceof HTMLElement) {
        elementoAnterior.focus()
      }
    }
  }, [])

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeHandlerRef.current()
      return
    }

    if (event.key !== 'Tab' || !dialogRef.current) {
      return
    }

    const elementosEnfocables = dialogRef.current.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    const primero = elementosEnfocables[0]
    const ultimo = elementosEnfocables[elementosEnfocables.length - 1]

    if (!primero || !ultimo) {
      event.preventDefault()
      dialogRef.current.focus()
      return
    }

    if (event.shiftKey && document.activeElement === primero) {
      event.preventDefault()
      ultimo.focus()
    } else if (!event.shiftKey && document.activeElement === ultimo) {
      event.preventDefault()
      primero.focus()
    } else if (document.activeElement === dialogRef.current) {
      event.preventDefault()
      const elementoDestino = event.shiftKey ? ultimo : primero
      elementoDestino.focus()
    }
  }

  function handleBackdropMouseDown(event) {
    if (event.target === event.currentTarget) {
      alCerrar()
    }
  }

  return (
    <div
      className={styles.backdrop}
      onMouseDown={handleBackdropMouseDown}
      role="presentation"
    >
      <section
        aria-labelledby={dialogId}
        aria-modal="true"
        className={styles.dialog}
        onKeyDown={handleKeyDown}
        ref={dialogRef}
        role="dialog"
        tabIndex="-1"
      >
        <header className={styles.header}>
          <h2 className={styles.title} id={dialogId}>
            {titulo}
          </h2>
          <Button
            aria-label="Cerrar ventana"
            className={styles.closeButton}
            onClick={alCerrar}
            size="small"
            type="button"
            variant="tertiary"
          >
            <span aria-hidden="true">×</span>
          </Button>
        </header>
        {children}
      </section>
    </div>
  )
}

export default Modal
