import { useState } from 'react'
import Modal from '../../../../core/ui/Modal/Modal.jsx'
import Button from '../../../../core/ui/Button/Button.jsx'
import styles from './CloseReceptionModal.module.css'

function CloseReceptionModal({ alCerrar, alConfirmar, guardando, error }) {
  const [accepted, setAccepted] = useState(false)
  const [confirmation, setConfirmation] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    if (accepted && confirmation === 'CERRAR' && !guardando) alConfirmar()
  }

  return (
    <Modal alCerrar={alCerrar} titulo="Cerrar la recepción de trabajos">
      <form className={styles.form} onSubmit={handleSubmit}>
        <p className={styles.transition}>Recepción abierta → En revisión</p>
        <div className={styles.notice}>
          <strong>Esta acción cierra la recepción</strong>
          <p>La edición pasará a «En revisión». Confirme solo si desea cerrar la recepción de esta edición.</p>
        </div>
        <label className={styles.checkboxLabel}>
          <input type="checkbox" checked={accepted} disabled={guardando} onChange={(event) => setAccepted(event.target.checked)} />
          Entiendo que estoy cerrando la recepción de esta edición.
        </label>
        <div className={styles.field}>
          <label htmlFor="close-confirmation">Escriba CERRAR para confirmar</label>
          <input id="close-confirmation" autoComplete="off" disabled={guardando} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} />
        </div>
        {error && <p role="alert" className={styles.error}>{error}</p>}
        <footer className={styles.footer}>
          <Button variant="secondary" disabled={guardando} onClick={alCerrar}>Cancelar</Button>
          <Button variant="destructive" type="submit" loading={guardando} disabled={!accepted || confirmation !== 'CERRAR'}>Cerrar la recepción</Button>
        </footer>
      </form>
    </Modal>
  )
}

export default CloseReceptionModal
