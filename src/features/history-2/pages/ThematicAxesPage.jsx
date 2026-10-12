import { useState } from 'react'
import { useSearchParams } from 'react-router'
import Button from '../../../core/ui/Button/Button.jsx'
import EmptyState from '../../../core/ui/EmptyState/EmptyState.jsx'
import ConfigurationPageLayout from '../components/ConfigurationPageLayout/ConfigurationPageLayout.jsx'
import ConfigurationTabs from '../components/ConfigurationTabs/ConfigurationTabs.jsx'
import ThematicAxesTable from '../components/ThematicAxesTable/ThematicAxesTable.jsx'
import ThematicAxisModal from '../components/ThematicAxisModal/ThematicAxisModal.jsx'
import styles from './ThematicAxesPage.module.css'

const thematicAxes = [
  {
    id: 'artificial-intelligence-data',
    nombre: 'Inteligencia artificial y datos',
    descripcion: 'Aprendizaje automático y ciencia de datos aplicada.',
    responsable: 'Dra. Ana Salazar',
    trabajos: 4,
  },
  {
    id: 'software-engineering',
    nombre: 'Ingeniería de software',
    descripcion: 'Arquitectura, calidad y procesos de desarrollo.',
    responsable: 'Mg. Luis Ramírez',
    trabajos: 3,
  },
  {
    id: 'sustainability-city',
    nombre: 'Sostenibilidad y ciudad',
    descripcion: 'Movilidad, gestión del agua y ciudades resilientes.',
    responsable: 'Mg. Carmen Effio',
    trabajos: 3,
  },
  {
    id: 'innovation-entrepreneurship',
    nombre: 'Innovación y emprendimiento',
    descripcion: 'Modelos de negocio y transferencia tecnológica.',
    responsable: 'Ing. Jorge Palomino',
    trabajos: 2,
  },
  {
    id: 'health-society',
    nombre: 'Salud y sociedad',
    descripcion: 'Salud pública y bienestar estudiantil.',
    responsable: 'Dra. Milagros Yupanqui',
    trabajos: 1,
  },
  {
    id: 'economics-markets',
    nombre: 'Economía y mercados',
    descripcion: 'Mercados financieros, comercio y desarrollo.',
    responsable: 'Mg. Renzo Bustamante',
    trabajos: 1,
  },
]

function ThematicAxesPage() {
  const [searchParams] = useSearchParams()
  const [ejes, setEjes] = useState(() =>
    searchParams.get('estado') === 'vacio' ? [] : thematicAxes,
  )
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

  function handleDelete(eje) {
    if (eje.trabajos > 0) {
      setFeedback('No se puede eliminar un eje que tiene trabajos asignados.')
      return
    }

    if (!window.confirm(`¿Eliminar el eje «${eje.nombre}»?`)) {
      return
    }

    setEjes((ejesActuales) => ejesActuales.filter((item) => item.id !== eje.id))
    setFeedback('Eje eliminado temporalmente.')
  }

  function handleSave(ejeActualizado) {
    if (modal.modo === 'edit') {
      setEjes((ejesActuales) =>
        ejesActuales.map((eje) =>
          eje.id === modal.eje.id ? { ...eje, ...ejeActualizado } : eje,
        ),
      )
    } else {
      setEjes((ejesActuales) => [
        ...ejesActuales,
        { ...ejeActualizado, id: `axis-${Date.now()}`, trabajos: 0 },
      ])
    }

    setModal(null)
    setFeedback('Cambios aplicados temporalmente. No se guardarán al recargar.')
  }

  return (
    <ConfigurationPageLayout
      estado={hasAxes ? 'Recepción abierta' : 'En preparación'}
    >
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
          <Button onClick={handleCreate} type="button" variant="primary">
            Nuevo eje temático
          </Button>
        </header>

        <ConfigurationTabs />

        <p aria-live="polite" className={styles.feedback}>{feedback}</p>

        {hasAxes ? (
          <section
            aria-label="Ejes temáticos de la edición"
            className={styles.tableSection}
          >
            <ThematicAxesTable alEditar={handleEdit} alEliminar={handleDelete} ejes={ejes} />
            <p className={styles.helperText}>
              Un eje con trabajos recibidos no puede eliminarse; primero
              reasigne los trabajos.
            </p>
          </section>
        ) : (
          <EmptyState
            accion={
              <Button onClick={handleCreate} type="button" variant="primary">
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
          alCerrar={() => setModal(null)}
          alGuardar={handleSave}
          eje={modal.eje}
          key={`${modal.modo}-${modal.eje?.id ?? 'new'}`}
          modo={modal.modo}
        />
      )}
    </ConfigurationPageLayout>
  )
}

export default ThematicAxesPage
