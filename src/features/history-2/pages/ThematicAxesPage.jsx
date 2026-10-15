import { useState } from 'react'
import useStoredState from '../../../core/utils/useStoredState.js'
import { thematicAxesRepository } from '../../../core/utils/repositories.js'
import { thematicAxes } from '../../../core/utils/states/thematicAxesState.js'
import Button from '../../../core/ui/Button/Button.jsx'
import EmptyState from '../../../core/ui/EmptyState/EmptyState.jsx'
import ConfigurationPageLayout from '../components/ConfigurationPageLayout/ConfigurationPageLayout.jsx'
import ConfigurationTabs from '../components/ConfigurationTabs/ConfigurationTabs.jsx'
import ThematicAxesTable from '../components/ThematicAxesTable/ThematicAxesTable.jsx'
import ThematicAxisModal from '../components/ThematicAxisModal/ThematicAxisModal.jsx'
import styles from './ThematicAxesPage.module.css'

function ThematicAxesPage() {
  const { value: ejes, loading, saving, error, save } = useStoredState(thematicAxesRepository, thematicAxes)
  const [modal, setModal] = useState(null)
  const [feedback, setFeedback] = useState('')
  const hasAxes = ejes.length > 0
  const totalWorks = ejes.reduce((total, eje) => total + eje.trabajos, 0)

  function handleCreate() {
    setModal({ modo: 'create', eje: null })
  }

  function handleEdit(eje) {
    setModal({ modo: 'edit', eje })
  }

  async function handleDelete(eje) {
    if (eje.trabajos > 0) {
      setFeedback('No se puede eliminar un eje que tiene trabajos asignados.')
      return
    }

    if (!window.confirm(`¿Eliminar el eje «${eje.nombre}»?`)) {
      return
    }

    try {
      await save(ejes.filter((item) => item.id !== eje.id))
      setFeedback('Eje eliminado.')
    } catch { setFeedback('') }
  }

  async function handleSave(updatedAxis) {
    const nextAxes = modal.modo === 'edit'
      ? ejes.map((item) => item.id === modal.eje.id ? { ...item, ...updatedAxis } : item)
      : [...ejes, { ...updatedAxis, id: crypto.randomUUID(), trabajos: 0 }]
    try {
      await save(nextAxes)
      setModal(null)
      setFeedback('Eje guardado en este navegador.')
    } catch {
      setFeedback('')
    }
  }

  return (
    <ConfigurationPageLayout>
      <div className={styles.content}>
        <header className={styles.pageHeading}>
          <div>
            <h1>Ejes temáticos</h1>
            <p>
              {hasAxes
                ? `${ejes.length} ejes configurados · ${totalWorks} trabajos recibidos en total`
                : 'Sin ejes configurados'}
            </p>
          </div>
          <Button disabled={loading || saving} onClick={handleCreate} type="button" variant="primary">
            Nuevo eje temático
          </Button>
        </header>

        <ConfigurationTabs />

        <p aria-live="polite" className={styles.feedback}>{loading ? 'Cargando ejes…' : error || feedback}</p>

        {hasAxes ? (
          <section
            aria-label="Ejes temáticos de la edición"
            className={styles.tableSection}
          >
            <ThematicAxesTable alEditar={handleEdit} alEliminar={handleDelete} deshabilitado={loading || saving} ejes={ejes} />
            <p className={styles.helperText}>
              Un eje con trabajos recibidos no puede eliminarse; primero
              reasigne los trabajos.
            </p>
          </section>
        ) : (
          <EmptyState
            accion={
              <Button disabled={loading || saving} onClick={handleCreate} type="button" variant="primary">
                Crear el primer eje
              </Button>
            }
            descripcion="Los ejes organizan los trabajos y determinan a qué revisores se pueden asignar. Cree al menos uno antes de abrir la recepción."
            icono="▤"
            titulo="Todavía no hay ejes temáticos"
          />
        )}
      </div>
      {modal && (
        <ThematicAxisModal
          alCerrar={() => { if (!saving) setModal(null) }}
          alGuardar={handleSave}
          guardando={saving}
          errorGuardado={error}
          eje={modal.eje}
          key={`${modal.modo}-${modal.eje?.id ?? 'new'}`}
          modo={modal.modo}
        />
      )}
    </ConfigurationPageLayout>
  )
}

export default ThematicAxesPage
