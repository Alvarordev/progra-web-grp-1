import { useState } from 'react'
import useStoredState from '../../../core/utils/useStoredState.js'
import { workTypesRepository } from '../../../core/utils/repositories.js'
import { initialWorkTypes } from '../../../core/utils/states/workTypesState.js'
import Button from '../../../core/ui/Button/Button.jsx'
import ConfigurationPageLayout from '../components/ConfigurationPageLayout/ConfigurationPageLayout.jsx'
import ConfigurationFeedback from '../components/ConfigurationFeedback/ConfigurationFeedback.jsx'
import ConfigurationTabs from '../components/ConfigurationTabs/ConfigurationTabs.jsx'
import WorkTypeModal from '../components/WorkTypeModal/WorkTypeModal.jsx'
import WorkTypesTable from '../components/WorkTypesTable/WorkTypesTable.jsx'
import styles from './WorkTypesPage.module.css'

function WorkTypesPage() {
  const {
    value: tiposTrabajo,
    loading,
    saving,
    error,
    save,
  } = useStoredState(workTypesRepository, initialWorkTypes)
  const [modal, setModal] = useState(null)
  const [feedback, setFeedback] = useState('')

  function handleCreate() {
    setFeedback('')
    setModal({ modo: 'create', tipoTrabajo: null })
  }

  function handleEdit(tipoTrabajo) {
    setFeedback('')
    setModal({ modo: 'edit', tipoTrabajo })
  }

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar este tipo de trabajo?')) {
      return
    }
    try {
      await save(tiposTrabajo.filter(item => item.id !== id))
      setFeedback('Tipo de trabajo eliminado correctamente.')
    } catch {
      setFeedback('')
    }
  }

  async function handleSave(updatedWorkType) {
    const nextTypes =
      modal.modo === 'edit'
        ? tiposTrabajo.map(item =>
            item.id === modal.tipoTrabajo.id ? { ...item, ...updatedWorkType } : item
          )
        : [...tiposTrabajo, { ...updatedWorkType, id: crypto.randomUUID() }]
    try {
      await save(nextTypes)
      setModal(null)
      setFeedback('Tipo de trabajo guardado correctamente.')
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
          <Button
            disabled={loading || saving}
            onClick={handleCreate}
            type="button"
            variant="primary"
          >
            Nuevo tipo de trabajo
          </Button>
        </header>

        <ConfigurationTabs />
        <ConfigurationFeedback
          cargando={loading ? 'Cargando tipos de trabajo…' : ''}
          error={modal ? '' : error}
          mensaje={feedback}
        />

        <section
          aria-label="Tipos de trabajo de la edición"
          className={styles.tableSection}
        >
          <WorkTypesTable
            alEditar={handleEdit}
            alEliminar={handleDelete}
            tiposTrabajo={tiposTrabajo}
            deshabilitado={loading || saving}
          />
        </section>

        <p className={styles.notice}>
          Los requisitos de cada tipo se muestran al registrar un trabajo. Revise la
          extensión y el máximo de coautores antes de guardar.
        </p>
      </div>

      {modal && (
        <WorkTypeModal
          alCerrar={() => {
            if (!saving) {
              setModal(null)
            }
          }}
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
