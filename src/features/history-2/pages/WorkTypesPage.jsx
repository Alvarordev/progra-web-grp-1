import { useState } from 'react'
import Button from '../../../core/ui/Button/Button.jsx'
import ConfigurationPageLayout from '../components/ConfigurationPageLayout/ConfigurationPageLayout.jsx'
import ConfigurationTabs from '../components/ConfigurationTabs/ConfigurationTabs.jsx'
import WorkTypeModal from '../components/WorkTypeModal/WorkTypeModal.jsx'
import WorkTypesTable from '../components/WorkTypesTable/WorkTypesTable.jsx'
import styles from './WorkTypesPage.module.css'

const initialWorkTypes = [
  {
    id: 'full-article',
    nombre: 'Artículo completo',
    extensionMaxima: '8 000 palabras',
    formatoEsperado: 'PDF · plantilla IEEE',
    admiteCoautores: true,
    maxCoautores: 4,
  },
  {
    id: 'extended-abstract',
    nombre: 'Resumen extendido',
    extensionMaxima: '2 500 palabras',
    formatoEsperado: 'PDF',
    admiteCoautores: true,
    maxCoautores: 3,
  },
  {
    id: 'poster',
    nombre: 'Póster',
    extensionMaxima: '1 lámina A1',
    formatoEsperado: 'PDF · orientación vertical',
    admiteCoautores: true,
    maxCoautores: 5,
  },
  {
    id: 'case-study',
    nombre: 'Caso de estudio',
    extensionMaxima: '5 000 palabras',
    formatoEsperado: 'PDF',
    admiteCoautores: false,
    maxCoautores: null,
  },
]

function WorkTypesPage() {
  const [tiposTrabajo, setTiposTrabajo] = useState(initialWorkTypes)
  const [modal, setModal] = useState(null)

  function handleCreate() {
    setModal({ modo: 'create', tipoTrabajo: null })
  }

  function handleEdit(tipoTrabajo) {
    setModal({ modo: 'edit', tipoTrabajo })
  }

  function handleDelete(id) {
    setTiposTrabajo((tiposActuales) =>
      tiposActuales.filter((tipoTrabajo) => tipoTrabajo.id !== id),
    )
  }

  function handleSave(tipoTrabajoActualizado) {
    if (modal.modo === 'edit') {
      setTiposTrabajo((tiposActuales) =>
        tiposActuales.map((tipoTrabajo) =>
          tipoTrabajo.id === modal.tipoTrabajo.id
            ? { ...tipoTrabajo, ...tipoTrabajoActualizado }
            : tipoTrabajo,
        ),
      )
    } else {
      setTiposTrabajo((tiposActuales) => [
        ...tiposActuales,
        {
          ...tipoTrabajoActualizado,
          id: `work-type-${Date.now()}`,
        },
      ])
    }

    setModal(null)
  }

  return (
    <ConfigurationPageLayout estado="Recepción abierta">
      <div className={styles.content}>
        <header className={styles.pageHeading}>
          <div>
            <h1>Tipos de trabajo</h1>
            <p>{tiposTrabajo.length} tipos habilitados para esta edición</p>
          </div>
          <Button onClick={handleCreate} type="button" variant="primary">
            Nuevo tipo de trabajo
          </Button>
        </header>

        <ConfigurationTabs />

        <section aria-label="Tipos de trabajo de la edición" className={styles.tableSection}>
          <WorkTypesTable
            alEditar={handleEdit}
            alEliminar={handleDelete}
            tiposTrabajo={tiposTrabajo}
          />
        </section>

        <p className={styles.notice}>
          El alta y la edición de un tipo de trabajo se realizan en modal, con
          los mismos campos de la tabla y validación de extensión mayor a cero.
        </p>
      </div>

      {modal && (
        <WorkTypeModal
          alCerrar={() => setModal(null)}
          alGuardar={handleSave}
          key={`${modal.modo}-${modal.tipoTrabajo?.id ?? 'new'}`}
          modo={modal.modo}
          tipoTrabajo={modal.tipoTrabajo}
        />
      )}
    </ConfigurationPageLayout>
  )
}

export default WorkTypesPage
