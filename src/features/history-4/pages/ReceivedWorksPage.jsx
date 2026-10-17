import { Link } from 'react-router'
import { assignmentsByWork } from '../../history-5/data/assignmentsByWork.js'
import useStoredState from '../../../core/utils/useStoredState.js'
import { useState, useMemo } from 'react'
import Header from '../../../core/ui/Header/Header.jsx'
import CommitteeNavigation from '../../../core/ui/CommitteeNavigation/CommitteeNavigation.jsx'
import Footer from '../../../core/ui/Footer/Footer.jsx'
import Button from '../../../core/ui/Button/Button.jsx'
import EmptyState from '../../../core/ui/EmptyState/EmptyState.jsx'
import AssignReviewersModal from '../components/AssignReviewersModal/AssignReviewersModal.jsx'
import { worksRepository, reviewersRepository } from '../../../core/utils/repositories.js'
import styles from './ReceivedWorksPage.module.css'

const committeeUser = {
  nombre: 'Dra. Ana Salazar Bermúdez',
  rol: 'Comité organizador',
  iniciales: 'AS',
}

export default function ReceivedWorksPage() {
  const worksState = useStoredState(worksRepository, [])
  const works = worksState.value
  const reviewersState = useStoredState(reviewersRepository, [])
  const reviewers = reviewersState.value

  const busy = [worksState, reviewersState].some((state) => state.loading || state.saving)
  const storageError = [worksState, reviewersState].find((state) => state.error)?.error

  // Filtros
  const [selectedEje, setSelectedEje] = useState('todos')
  const [selectedEstado, setSelectedEstado] = useState('todos')
  const [selectedTipo, setSelectedTipo] = useState('todos')
  const [searchQuery, setSearchQuery] = useState('')

  // Selección múltiple
  const [selectedCodes, setSelectedCodes] = useState(['TRB-2026-031', 'TRB-2026-035', 'TRB-2026-040'])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Modal de asignación
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [targetWorksForModal, setTargetWorksForModal] = useState([])
  const [notification, setNotification] = useState('')

  // Métricas globales
  const totalEnviados = works.filter((w) => w.estado === 'Enviado').length
  const totalEnRevision = works.filter((w) => w.estado === 'En revisión').length
  const totalSinRevisores = works.filter((w) => w.revisoresAsignados?.length === 0 && w.estado !== 'Borrador').length
  const totalConDecision = works.filter((w) => w.estado === 'Aceptado' || w.estado === 'Rechazado').length

  // Filtrado de trabajos
  const filteredWorks = useMemo(() => {
    return works.filter((w) => {
      // Ignorar borradores fuera de proceso en el listado principal activo
      if (w.estado === 'Borrador' && selectedEstado !== 'Borrador' && selectedEstado !== 'todos') {
        return false
      }
      if (selectedEje !== 'todos' && w.eje !== selectedEje) return false
      if (selectedEstado !== 'todos' && w.estado !== selectedEstado) return false
      if (selectedTipo !== 'todos' && w.tipo !== selectedTipo) return false
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchesCode = w.codigo.toLowerCase().includes(query)
        const matchesTitle = w.titulo.toLowerCase().includes(query)
        const matchesAuthor = w.autores?.some((a) => a.toLowerCase().includes(query))
        if (!matchesCode && !matchesTitle && !matchesAuthor) return false
      }
      return true
    })
  }, [works, selectedEje, selectedEstado, selectedTipo, searchQuery])

  // Paginación
  const totalPages = Math.max(1, Math.ceil(filteredWorks.length / itemsPerPage))
  const paginatedWorks = filteredWorks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSelectAllCurrent = (e) => {
    if (e.target.checked) {
      const currentCodes = paginatedWorks.map((w) => w.codigo)
      setSelectedCodes(Array.from(new Set([...selectedCodes, ...currentCodes])))
    } else {
      const currentCodes = new Set(paginatedWorks.map((w) => w.codigo))
      setSelectedCodes(selectedCodes.filter((code) => !currentCodes.has(code)))
    }
  }

  const toggleSelectWork = (codigo) => {
    if (selectedCodes.includes(codigo)) {
      setSelectedCodes(selectedCodes.filter((c) => c !== codigo))
    } else {
      setSelectedCodes([...selectedCodes, codigo])
    }
  }

  const handleOpenBulkAssign = () => {
    const selectedObj = works.filter((w) => selectedCodes.includes(w.codigo))
    if (selectedObj.length === 0) return
    setTargetWorksForModal(selectedObj)
    setIsAssignModalOpen(true)
  }

  const handleOpenSingleAssign = (work) => {
    setTargetWorksForModal([work])
    setIsAssignModalOpen(true)
  }

  const handleConfirmAssignment = async ({ targetWorkCodes, reviewerIds, deadline }) => {
    if (busy || storageError) return false
    const updatedWorks = works.map((w) => {
      if (targetWorkCodes.includes(w.codigo)) {
        return {
          ...w,
          estado: 'En revisión',
          revisoresAsignados: reviewerIds,
          fechaLimite: deadline,
        }
      }
      return w
    })

    // Actualizar carga de revisores
    const updatedReviewers = reviewers.map((r) => {
      if (reviewerIds.includes(r.id)) {
        return {
          ...r,
          asignadas: r.asignadas + targetWorkCodes.length,
        }
      }
      return r
    })

    if (!await worksState.save(updatedWorks).catch(() => false)) return false
    if (!await reviewersState.save(updatedReviewers).catch(() => false)) return false

    setNotification(`Revisores asignados correctamente a ${targetWorkCodes.length} trabajo(s).`)
    setSelectedCodes([])
    setTimeout(() => setNotification(''), 5000)
    return true
  }

  const handleClearFilters = () => {
    setSelectedEje('todos')
    setSelectedEstado('todos')
    setSelectedTipo('todos')
    setSearchQuery('')
    setCurrentPage(1)
  }

  const allPageSelected = paginatedWorks.length > 0 && paginatedWorks.every((w) => selectedCodes.includes(w.codigo))

  return (
    <div className={styles.page}>
      <Header />
      <CommitteeNavigation rutaActiva="/trabajos-recibidos" usuario={committeeUser} />

      <main className={styles.mainContent}>
        {busy && <p role="status">Cargando o guardando datos…</p>}
        {storageError && <p role="alert">{storageError}</p>}
        <fieldset className={styles.contentFields} disabled={busy || Boolean(storageError)}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>Trabajos recibidos</h1>
            <p className={styles.subtitle}>
              {works.length} trabajos · {totalEnviados + totalEnRevision + totalConDecision} enviados · 2 borradores fuera de proceso
            </p>
          </div>
          <div className={styles.topActions}>
            <Button variant="secondary">Exportar listado</Button>
            <Button
              variant="primary"
              disabled={selectedCodes.length === 0}
              onClick={handleOpenBulkAssign}
            >
              Asignar revisores ({selectedCodes.length} seleccionados)
            </Button>
          </div>
        </div>

        {notification && (
          <div className={styles.notificationSuccess}>
            <span>✓ {notification}</span>
          </div>
        )}

        {/* Tarjetas de métricas superiores */}
        <section className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>ENVIADOS</span>
            <span className={styles.statValue}>{totalEnviados}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>EN REVISIÓN</span>
            <span className={styles.statValue}>{totalEnRevision}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>SIN REVISORES</span>
            <span className={styles.statValue}>{totalSinRevisores}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>CON DECISIÓN</span>
            <span className={styles.statValue}>{totalConDecision}</span>
          </div>
        </section>

        {/* Filtros y búsqueda */}
        <div className={styles.filterBar}>
          <div className={styles.filterControls}>
            <label className={styles.selectLabel}>
              Eje:
              <select
                className={styles.filterSelect}
                value={selectedEje}
                onChange={(e) => {
                  setSelectedEje(e.target.value)
                  setCurrentPage(1)
                }}
              >
                <option value="todos">todos</option>
                <option value="Ingeniería de software">Ingeniería de software</option>
                <option value="Inteligencia artificial y datos">Inteligencia artificial y datos</option>
                <option value="Sostenibilidad y ciudad">Sostenibilidad y ciudad</option>
                <option value="Innovación y emprendimiento">Innovación y emprendimiento</option>
                <option value="Salud y sociedad">Salud y sociedad</option>
                <option value="Economía y mercados">Economía y mercados</option>
              </select>
            </label>

            <label className={styles.selectLabel}>
              Estado:
              <select
                className={styles.filterSelect}
                value={selectedEstado}
                onChange={(e) => {
                  setSelectedEstado(e.target.value)
                  setCurrentPage(1)
                }}
              >
                <option value="todos">todos</option>
                <option value="Enviado">Enviado</option>
                <option value="En revisión">En revisión</option>
                <option value="Aceptado">Aceptado</option>
                <option value="Rechazado">Rechazado</option>
              </select>
            </label>

            <label className={styles.selectLabel}>
              Tipo:
              <select
                className={styles.filterSelect}
                value={selectedTipo}
                onChange={(e) => {
                  setSelectedTipo(e.target.value)
                  setCurrentPage(1)
                }}
              >
                <option value="todos">todos</option>
                <option value="Artículo completo">Artículo completo</option>
                <option value="Resumen extendido">Resumen extendido</option>
                <option value="Póster">Póster</option>
                <option value="Caso de estudio">Caso de estudio</option>
              </select>
            </label>
          </div>

          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Buscar por código, título o autor…"
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>
        </div>

        {/* Chips de filtros activos */}
        {(selectedEje !== 'todos' || selectedEstado !== 'todos' || selectedTipo !== 'todos' || searchQuery) && (
          <div className={styles.activeFiltersRow}>
            <span className={styles.activeFiltersLabel}>Filtros activos:</span>
            {selectedEje !== 'todos' && (
              <span className={styles.filterChip}>
                Eje: {selectedEje} <button onClick={() => setSelectedEje('todos')}>✕</button>
              </span>
            )}
            {selectedEstado !== 'todos' && (
              <span className={styles.filterChip}>
                Estado: {selectedEstado} <button onClick={() => setSelectedEstado('todos')}>✕</button>
              </span>
            )}
            {selectedTipo !== 'todos' && (
              <span className={styles.filterChip}>
                Tipo: {selectedTipo} <button onClick={() => setSelectedTipo('todos')}>✕</button>
              </span>
            )}
            {searchQuery && (
              <span className={styles.filterChip}>
                Búsqueda: &quot;{searchQuery}&quot; <button onClick={() => setSearchQuery('')}>✕</button>
              </span>
            )}
            <button className={styles.clearFiltersBtn} onClick={handleClearFilters}>
              Limpiar todo
            </button>
          </div>
        )}

        {/* Contenido principal o estado vacío */}
        {filteredWorks.length === 0 ? (
          <div className={styles.emptyContainer}>
            <EmptyState
              title="Todavía no hay trabajos enviados"
              description="La recepción está abierta hasta el 30/09/2026. Cuando los autores envíen sus trabajos aparecerán aquí para asignar revisores."
              actionLabel="Revisar la configuración de la edición"
              onAction={() => window.location.href = '/configuracion'}
            />
          </div>
        ) : (
          <>
            <div className={styles.tableWrapper}>
              <table className={styles.worksTable}>
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>
                      <input
                        type="checkbox"
                        checked={allPageSelected}
                        onChange={handleSelectAllCurrent}
                      />
                    </th>
                    <th>CÓDIGO</th>
                    <th>TÍTULO</th>
                    <th>EJE</th>
                    <th>TIPO</th>
                    <th>REVISORES</th>
                    <th>ESTADO</th>
                    <th>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedWorks.map((work) => {
                    const hasConsolidation = Object.hasOwn(assignmentsByWork, work.codigo)
                    const consolidationPath = `/trabajos-recibidos/${encodeURIComponent(work.codigo)}/consolidado`
                    const isSelected = selectedCodes.includes(work.codigo)
                    const hasReviewers = work.revisoresAsignados && work.revisoresAsignados.length > 0

                    return (
                      <tr
                        key={work.codigo}
                        className={isSelected ? styles.rowSelected : ''}
                      >
                        <td>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectWork(work.codigo)}
                          />
                        </td>
                        <td className={styles.codeCell}>{work.codigo}</td>
                        <td className={styles.titleCell}>
                          <strong>
                            {hasConsolidation ? (
                              <Link className={styles.consolidationLink} to={consolidationPath} aria-label={`Ver consolidado de ${work.codigo}: ${work.titulo}`}>
                                {work.titulo}
                              </Link>
                            ) : work.titulo}
                          </strong>
                          <div className={styles.authorsSub}>
                            {work.autores?.join(', ')}
                          </div>
                        </td>
                        <td className={styles.mutedCell}>{work.eje}</td>
                        <td className={styles.mutedCell}>{work.tipo}</td>
                        <td>
                          {hasReviewers ? (
                            <span>
                              {work.revisoresAsignados.length} asignados · {work.entregadas || 0} entregadas
                            </span>
                          ) : (
                            <span className={styles.unassignedText}>Sin asignar</span>
                          )}
                        </td>
                        <td>
                          <span className={`${styles.statusBadge} ${styles['status_' + work.estado.replace(/\s+/g, '')]}`}>
                            {work.estado}
                          </span>
                        </td>
                        <td>
                          <div className={styles.rowActions}>
                            {hasConsolidation && (
                              <Link className={styles.consolidationLink} to={consolidationPath} aria-label={`Ver consolidado de ${work.codigo}`}>
                                Ver consolidado
                              </Link>
                            )}
                            <Button
                              variant="secondary"
                              size="small"
                              type="button"
                              onClick={() => handleOpenSingleAssign(work)}
                            >
                              Asignar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className={styles.paginationRow}>
              <span className={styles.paginationInfo}>
                Mostrando {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredWorks.length)} de {filteredWorks.length} trabajos
                {selectedCodes.length > 0 && ` · ${selectedCodes.length} seleccionados`}
              </span>
              <div className={styles.paginationButtons}>
                <button
                  className={styles.pageBtn}
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Anterior
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`${styles.pageNumberBtn} ${currentPage === pageNum ? styles.activePage : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  className={styles.pageBtn}
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
        )}
        </fieldset>
      </main>

      <Footer />

      {/* Modal de asignación de revisores */}
      <AssignReviewersModal
        guardando={busy}
        error={storageError}
        abierto={isAssignModalOpen}
        alCerrar={() => setIsAssignModalOpen(false)}
        trabajosObjetivo={targetWorksForModal}
        revisores={reviewers}
        alConfirmarAsignacion={handleConfirmAssignment}
      />
    </div>
  )
}
