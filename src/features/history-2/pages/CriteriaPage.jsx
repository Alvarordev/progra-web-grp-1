import { useState } from 'react'
import Button from '../../../core/ui/Button/Button.jsx'
import useStoredState from '../../../core/utils/useStoredState.js'
import { criteriaRepository } from '../../../core/utils/repositories.js'
import { initialCriteria } from '../../../core/utils/states/criteriaState.js'
import ConfigurationPageLayout from '../components/ConfigurationPageLayout/ConfigurationPageLayout.jsx'
import ConfigurationTabs from '../components/ConfigurationTabs/ConfigurationTabs.jsx'
import CriteriaTable from '../components/CriteriaTable/CriteriaTable.jsx'
import CriterionModal from '../components/CriterionModal/CriterionModal.jsx'
import styles from './CriteriaPage.module.css'

function CriteriaPage() {
  const { value, loading, saving, error, save } = useStoredState(criteriaRepository, initialCriteria)
  const [modal, setModal] = useState(null)
  const [feedback, setFeedback] = useState('')
  const criteria = value
  const total = criteria.reduce((sum, item) => sum + item.peso, 0)

  async function handleApply(updatedCriterion) {
    if (loading || saving) return
    const nextCriteria = modal.criterio
      ? criteria.map((item) => item.id === modal.criterio.id ? { ...item, ...updatedCriterion } : item)
      : [...criteria, { ...updatedCriterion, id: crypto.randomUUID() }]
    try {
      await save(nextCriteria)
      setModal(null)
      setFeedback('Criterio guardado correctamente.')
    } catch {
      setFeedback('')
    }
  }

  async function handleDelete(id) {
    if (loading || saving) return
    if (!window.confirm('¿Eliminar este criterio?')) return
    try {
      await save(criteria.filter((item) => item.id !== id))
      setFeedback('Criterio eliminado correctamente.')
    } catch {
      setFeedback('')
    }
  }

  async function handleSave() {
    if (loading || saving) return
    try {
      await save(criteria)
      setFeedback('Criterios guardados correctamente.')
    } catch { setFeedback('') }
  }

  return (
    <ConfigurationPageLayout>
      <div className={styles.content}>
        <header className={styles.pageHeading}>
          <div><h1>Criterios de evaluación</h1><p>Los pesos de todos los criterios deben sumar 100.</p></div>
          <div className={styles.actions}>
            <Button variant="secondary" disabled={loading || saving} onClick={() => setModal({ criterio: null })}>Nuevo criterio</Button>
            <Button disabled={loading} loading={saving} onClick={handleSave}>Guardar criterios</Button>
          </div>
        </header>
        <ConfigurationTabs />
        {loading && <p role="status" className={styles.loading}>Cargando criterios…</p>}
        {error ? (
          <p role="alert" className={styles.errorNotice}>{error}</p>
        ) : feedback && (
          <p role="status" className={styles.feedback}>{feedback}</p>
        )}
        <p className={total === 100 ? styles.successNotice : styles.warningNotice} role="status">
          {total === 100 ? 'Configuración válida: los pesos suman 100.' : `Los pesos suman ${total} de 100. ${total < 100 ? `Faltan ${100 - total}` : `Sobran ${total - 100}`} puntos. Ajuste los criterios antes de abrir la revisión.`}
        </p>
        {criteria.length > 0 ? (
          <CriteriaTable criterios={criteria} deshabilitado={loading || saving} alEditar={(item) => setModal({ criterio: item })} alEliminar={handleDelete} />
        ) : <p>No hay criterios configurados. Agregue el primer criterio.</p>}
        <p className={styles.helperText}>Cada criterio se guarda al confirmar su formulario. Para abrir la revisión, los pesos deben sumar 100.</p>
      </div>
      {modal && (
        <CriterionModal
          criterio={modal.criterio}
          guardando={saving}
          errorGuardado={error}
          alCerrar={() => { if (!saving) setModal(null) }}
          alGuardar={handleApply}
        />
      )}
    </ConfigurationPageLayout>
  )
}

export default CriteriaPage
