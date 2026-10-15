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
  const [draft, setDraft] = useState(null)
  const [modal, setModal] = useState(null)
  const [feedback, setFeedback] = useState('')
  const criteria = draft ?? value
  const total = criteria.reduce((sum, item) => sum + item.peso, 0)

  function handleApply(updatedCriterion) {
    const nextCriteria = modal.criterio
      ? criteria.map((item) => item.id === modal.criterio.id ? { ...item, ...updatedCriterion } : item)
      : [...criteria, { ...updatedCriterion, id: crypto.randomUUID() }]
    setDraft(nextCriteria)
    setModal(null)
    setFeedback('Cambios pendientes. Pulse «Guardar criterios» para conservarlos.')
  }

  function handleDelete(id) {
    if (!window.confirm('¿Eliminar este criterio?')) return
    setDraft(criteria.filter((item) => item.id !== id))
    setFeedback('Cambios pendientes. Pulse «Guardar criterios» para conservarlos.')
  }

  async function handleSave() {
    try {
      await save(criteria)
      setDraft(null)
      setFeedback('Criterios guardados en este navegador.')
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
        <p role="status" className={styles.feedback}>{loading ? 'Cargando criterios…' : error || feedback}</p>
        <p className={total === 100 ? styles.successNotice : styles.warningNotice} role="status">
          {total === 100 ? 'Configuración válida: los pesos suman 100.' : `Los pesos suman ${total} de 100. ${total < 100 ? `Faltan ${100 - total}` : `Sobran ${total - 100}`} puntos. Ajuste los criterios antes de abrir la revisión.`}
        </p>
        {criteria.length > 0 ? (
          <CriteriaTable criterios={criteria} deshabilitado={loading || saving} alEditar={(item) => setModal({ criterio: item })} alEliminar={handleDelete} />
        ) : <p>No hay criterios configurados. Agregue el primer criterio.</p>}
        <p className={styles.helperText}>Puede guardar una configuración pendiente. Para abrir la revisión, los pesos deben sumar 100.</p>
      </div>
      {modal && <CriterionModal criterio={modal.criterio} alCerrar={() => setModal(null)} alGuardar={handleApply} />}
    </ConfigurationPageLayout>
  )
}

export default CriteriaPage
