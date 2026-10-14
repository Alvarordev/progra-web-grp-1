import { useState } from 'react'
import Modal from '../../../../core/ui/Modal/Modal.jsx'
import Button from '../../../../core/ui/Button/Button.jsx'
import styles from './ReassignModal.module.css'

export default function ReassignModal({
  isOpen,
  onClose,
  pendingItem,
  reviewers = [],
  onConfirmReassignment,
}) {
  const [selectedNewReviewerId, setSelectedNewReviewerId] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  if (!isOpen || !pendingItem) return null

  // Filtrar revisores candidatos excluyendo el revisor actual
  const candidateReviewers = reviewers.filter((r) => r.id !== pendingItem.revisorId)

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError('El motivo de la reasignación es obligatorio.')
      return
    }
    if (!selectedNewReviewerId) {
      setError('Debe seleccionar un nuevo revisor.')
      return
    }

    const newReviewer = reviewers.find((r) => r.id === selectedNewReviewerId)

    onConfirmReassignment({
      pendingId: pendingItem.id,
      codigo: pendingItem.codigo,
      previousReviewer: pendingItem.revisor,
      newReviewerId: selectedNewReviewerId,
      newReviewerName: newReviewer?.nombre || '',
      reason: reason.trim(),
    })

    setReason('')
    setSelectedNewReviewerId('')
    setError('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reasignar revisor">
      <div className={styles.modalBody}>
        <div className={styles.itemSummary}>
          <p className={styles.workTitle}>
            <strong>{pendingItem.codigo}</strong> · {pendingItem.trabajo}
          </p>
          <p className={styles.currentReviewer}>
            Revisor actual: <strong>{pendingItem.revisor}</strong>
            <span className={styles.badgeDanger}> ({pendingItem.estado})</span>
          </p>
        </div>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <div className={styles.formGroup}>
          <label className={styles.label}>
            SELECCIONAR NUEVO REVISOR *
            <select
              className={styles.select}
              value={selectedNewReviewerId}
              onChange={(e) => {
                setSelectedNewReviewerId(e.target.value)
                setError('')
              }}
            >
              <option value="">Seleccione un revisor disponible…</option>
              {candidateReviewers.map((rev) => (
                <option key={rev.id} value={rev.id}>
                  {rev.nombre} ({rev.institucion} — {rev.asignadas} revisiones asignadas)
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            MOTIVO DE LA REASIGNACIÓN *
            <textarea
              className={styles.textarea}
              rows={3}
              placeholder="Explique el motivo del cambio (ej. incumplimiento de plazo, sobrecarga o indisponibilidad)…"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                setError('')
              }}
            />
          </label>
          <span className={styles.helperText}>
            Este motivo quedará registrado en el historial de la edición.
          </span>
        </div>

        <div className={styles.actions}>
          <Button variant="secundario" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primario" onClick={handleSubmit}>
            Confirmar reasignación
          </Button>
        </div>
      </div>
    </Modal>
  )
}
