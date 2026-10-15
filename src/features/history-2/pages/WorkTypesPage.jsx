import { useState } from 'react'
import useStoredState from '../../../core/utils/useStoredState.js'
import { workTypesRepository } from '../../../core/utils/repositories.js'
import { initialWorkTypes } from '../../../core/utils/states/workTypesState.js'
import Button from '../../../core/ui/Button/Button.jsx'
import ConfigurationPageLayout from '../components/ConfigurationPageLayout/ConfigurationPageLayout.jsx'
import ConfigurationTabs from '../components/ConfigurationTabs/ConfigurationTabs.jsx'
import WorkTypeModal from '../components/WorkTypeModal/WorkTypeModal.jsx'
import WorkTypesTable from '../components/WorkTypesTable/WorkTypesTable.jsx'
import styles from './WorkTypesPage.module.css'

function WorkTypesPage() {
  const { value: tiposTrabajo, loading, saving, error, save } = useStoredState(workTypesRepository, initialWorkTypes)
  const [modal, setModal] = useState(null)
  const [feedback, setFeedback] = useState('')

  function handleCreate() {
    setModal({ modo: 'create', tipoTrabajo: null })
  }

  function handleEdit(tipoTrabajo) {
    setModal({ modo: 'edit', tipoTrabajo })
  }

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar este tipo de trabajo?')) return
    try {
      await save(tiposTrabajo.filter((item) => item.id !== id))
      setFeedback('Tipo de trabajo eliminado.')
    } catch { setFeedback('') }
  }

  async function handleSave(updatedWorkType) {
    const nextTypes = modal.modo === 'edit'
      ? tiposTrabajo.map((item) => item.id === modal.tipoTrabajo.id ? { ...item, ...updatedWorkType } : item)
      : [...tiposTrabajo, { ...updatedWorkType, id: crypto.randomUUID() }]
    try {
      await save(nextTypes)
      setModal(null)
      setFeedback('Tipo de trabajo guardado en este navegador.')
    } catch {
      setFeedback('')
    }
  }

  return (
    <ConfigurationPageLayout>
      <div className={styles.content}>
        <header className={styles.pageHeading}>
          <div>
            <h1>Tipos de trabajo</h1>
            <p>{tiposTrabajo.length} tipos habilitados para esta edición</p>
          </div>
          <Button disabled={loading || saving} onClick={handleCreate} type="button" variant="primary">
            Nuevo tipo de trabajo
          </Button>
        </header>

        <ConfigurationTabs />
        <p role="status">{loading ? 'Cargando tipos de trabajo…' : error || feedback}</p>

        <section aria-label="Tipos de trabajo de la edición" className={styles.tableSection}>
          <WorkTypesTable
            alEditar={handleEdit}
            alEliminar={handleDelete}
            tiposTrabajo={tiposTrabajo}
            deshabilitado={loading || saving}
          />
        </section>

        <p className={styles.notice}>
          El alta y la edición de un tipo de trabajo se realizan en modal, con
          los mismos campos de la tabla y validación de extensión mayor a cero.
        </p>
      </div>

      {modal && (
        <WorkTypeModal
          alCerrar={() => { if (!saving) setModal(null) }}
          alGuardar={handleSave}
          guardando={saving}
          errorGuardado={error}
          key={`${modal.modo}-${modal.tipoTrabajo?.id ?? 'new'}`}
          modo={modal.modo}
          tipoTrabajo={modal.tipoTrabajo}
        />
      )}
    </ConfigurationPageLayout>
  )
}

export default WorkTypesPage
