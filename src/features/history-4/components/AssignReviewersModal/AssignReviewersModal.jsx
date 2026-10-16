import { useState, useMemo } from 'react'
import Modal from '../../../../core/ui/Modal/Modal.jsx'
import Button from '../../../../core/ui/Button/Button.jsx'
import styles from './AssignReviewersModal.module.css'

export default function AssignReviewersModal({
  guardando = false,
  error: storageError = '',
  abierto: isOpen,
  alCerrar: onClose,
  trabajosObjetivo: targetWorks = [],
  revisores: reviewers = [],
  alConfirmarAsignacion: onConfirmAssignment,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedReviewerIds, setSelectedReviewerIds] = useState([])
  const [allowInstitutionConflict, setAllowInstitutionConflict] = useState(false)
  const [deadline, setDeadline] = useState('2026-10-20')

  // Detectar conflictos por revisor
  const reviewerConflictMap = useMemo(() => {
    const map = {}
    reviewers.forEach((rev) => {
      // Coautoría: si el revisor aparece en la lista de autores de algún trabajo objetivo
      const isCoauthor = targetWorks.some((w) =>
        w.autores?.some((a) => rev.nombre.toLowerCase().includes(a.toLowerCase()) || a.toLowerCase().includes(rev.nombre.toLowerCase()))
      )
      // Misma institución: si coincide con la institución del autor de correspondencia
      const isSameInstitution = targetWorks.some((w) =>
        w.institucion && rev.institucion && w.institucion.toLowerCase() === rev.institucion.toLowerCase()
      )

      if (isCoauthor) {
        map[rev.id] = { type: 'coauthor', label: 'Coautor(a) del trabajo', blocking: true }
      } else if (isSameInstitution) {
        map[rev.id] = { type: 'institution', label: 'Misma institución', blocking: false }
      } else {
        map[rev.id] = { type: 'none', label: 'Sin conflicto', blocking: false }
      }
    })
    return map
  }, [reviewers, targetWorks])

  // Filtrado de revisores por término de búsqueda
  const filteredReviewers = useMemo(() => {
    const term = searchTerm.toLowerCase().trim()
    if (!term) return reviewers
    return reviewers.filter((r) =>
      r.nombre.toLowerCase().includes(term) ||
      r.institucion.toLowerCase().includes(term) ||
      r.lineasInteres.some((l) => l.toLowerCase().includes(term))
    )
  }, [reviewers, searchTerm])

  if (!isOpen || targetWorks.length === 0) return null

  const isBulk = targetWorks.length > 1
  const firstWork = targetWorks[0]

  const toggleSelectReviewer = (revId) => {
    const conflict = reviewerConflictMap[revId]
    if (conflict?.blocking) return // No permitir seleccionar coautor

    if (selectedReviewerIds.includes(revId)) {
      setSelectedReviewerIds(selectedReviewerIds.filter((id) => id !== revId))
    } else {
      if (selectedReviewerIds.length >= 3) return // Máximo 3 revisores
      setSelectedReviewerIds([...selectedReviewerIds, revId])
    }
  }

  // Verificaciones de validación
  const hasSelectedInstitutionConflict = selectedReviewerIds.some(
    (id) => reviewerConflictMap[id]?.type === 'institution'
  )

  const hasAnyConflictInList = reviewers.some((r) => reviewerConflictMap[r.id]?.type !== 'none')

  const countValid = selectedReviewerIds.length
  const isValidCount = countValid >= 2 && countValid <= 3
  const isBlockedByInstitution = hasSelectedInstitutionConflict && !allowInstitutionConflict
  const canSubmit = isValidCount && !isBlockedByInstitution

  const handleSave = async () => {
    if (guardando) return
    if (!canSubmit) return
    const saved = await onConfirmAssignment({
      targetWorkCodes: targetWorks.map((w) => w.codigo),
      reviewerIds: selectedReviewerIds,
      deadline,
    })
    if (!saved) return
    setSelectedReviewerIds([])
    setAllowInstitutionConflict(false)
    onClose()
  }

  return (
    <Modal alCerrar={() => { if (!guardando) onClose() }} titulo="Asignar revisores">
      <fieldset className={styles.modalBody} disabled={guardando}>
        {storageError && <p role="alert">{storageError}</p>}
        <div className={styles.workReference}>
          {isBulk ? (
            <p className={styles.subtitle}>
              Asignación por lote para <strong>{targetWorks.length} trabajos seleccionados</strong>
            </p>
          ) : (
            <p className={styles.subtitle}>
              <strong>{firstWork.codigo}</strong> · {firstWork.titulo} · <em>{firstWork.eje}</em>
            </p>
          )}
        </div>

        {hasAnyConflictInList && (
          <div className={styles.conflictBanner}>
            <span className={styles.warningIcon}>!</span>
            <div>
              <strong>Conflicto detectado:</strong> 1 revisor es coautor del trabajo y otro pertenece a la misma institución del autor de correspondencia. <strong>No es posible asignar a un coautor.</strong>
            </div>
          </div>
        )}

        <div className={styles.searchRow}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar revisor por nombre, institución o línea de interés…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className={styles.ruleNotice}>Mínimo 2 · máximo 3 revisores</span>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                <th>REVISOR</th>
                <th>LÍNEAS DE INTERÉS</th>
                <th>CARGA ACTUAL</th>
                <th>CONFLICTO</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviewers.map((rev) => {
                const conflict = reviewerConflictMap[rev.id]
                const isSelected = selectedReviewerIds.includes(rev.id)
                const isCoauthor = conflict?.blocking

                return (
                  <tr
                    key={rev.id}
                    className={`${isSelected ? styles.rowSelected : ''} ${isCoauthor ? styles.rowDisabled : ''}`}
                    onClick={() => !isCoauthor && toggleSelectReviewer(rev.id)}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={isCoauthor}
                        onChange={() => toggleSelectReviewer(rev.id)}
                      />
                    </td>
                    <td className={styles.reviewerName}>{rev.nombre}</td>
                    <td className={styles.reviewerLines}>
                      {rev.lineasInteres.join(' · ')}
                    </td>
                    <td>{rev.asignadas} revisiones</td>
                    <td>
                      {conflict?.type === 'coauthor' && (
                        <span className={`${styles.badge} ${styles.badgeDanger}`}>
                          {conflict.label}
                        </span>
                      )}
                      {conflict?.type === 'institution' && (
                        <span className={`${styles.badge} ${styles.badgeWarning}`}>
                          {conflict.label}
                        </span>
                      )}
                      {conflict?.type === 'none' && (
                        <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                          Sin conflicto
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {hasSelectedInstitutionConflict && (
          <div className={styles.justificationBox}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={allowInstitutionConflict}
                onChange={(e) => setAllowInstitutionConflict(e.target.checked)}
              />
              <span>
                Asignar de todos modos al revisor de la misma institución (requiere justificación del comité).
              </span>
            </label>
          </div>
        )}

        <div className={styles.deadlineContainer}>
          <label className={styles.label}>
            FECHA LÍMITE DE LA REVISIÓN
            <input
              type="date"
              className={styles.dateInput}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </label>
        </div>

        <div className={styles.footerRow}>
          <div className={styles.selectionCount}>
            {countValid < 2 ? (
              <span className={styles.mutedWarning}>Seleccione al menos 2 revisores sin conflicto</span>
            ) : (
              <span><strong>{countValid}</strong> revisores seleccionados</span>
            )}
          </div>
          <div className={styles.actions}>
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              disabled={!canSubmit}
              onClick={handleSave}
            >
              Asignar y notificar
            </Button>
          </div>
        </div>
      </fieldset>
    </Modal>
  )
}
