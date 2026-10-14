import { useState, useMemo } from 'react'
import Header from '../../../core/ui/Header/Header.jsx'
import CommitteeNavigation from '../../../core/ui/CommitteeNavigation/CommitteeNavigation.jsx'
import Footer from '../../../core/ui/Footer/Footer.jsx'
import Button from '../../../core/ui/Button/Button.jsx'
import Modal from '../../../core/ui/Modal/Modal.jsx'
import { reviewersRepository } from '../../../core/utils/repositories.js'
import styles from './ReviewersListPage.module.css'

const committeeUser = {
  nombre: 'Dra. Ana Salazar Bermúdez',
  rol: 'Comité organizador',
  iniciales: 'AS',
}

export default function ReviewersListPage() {
  const [reviewers, setReviewers] = useState(() => reviewersRepository.get())
  const [selectedLinea, setSelectedLinea] = useState('todas')
  const [selectedInstitucion, setSelectedInstitucion] = useState('todas')
  const [onlyOverdue, setOnlyOverdue] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Modal de invitar revisor
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [inviteForm, setInviteForm] = useState({
    nombre: '',
    correo: '',
    institucion: 'Universidad de Lima',
    lineasInteres: '',
  })
  const [inviteSuccess, setInviteSuccess] = useState('')

  // Totales
  const totalAsignadas = reviewers.reduce((sum, r) => sum + r.asignadas, 0)
  const totalVencidas = reviewers.reduce((sum, r) => sum + r.vencidas, 0)
  const countWithOverdue = reviewers.filter((r) => r.vencidas > 0).length

  // Filtrado
  const filteredReviewers = useMemo(() => {
    return reviewers.filter((r) => {
      if (onlyOverdue && r.vencidas === 0) return false
      if (selectedLinea !== 'todas' && !r.lineasInteres.includes(selectedLinea)) return false
      if (selectedInstitucion !== 'todas' && r.institucion !== selectedInstitucion) return false
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchesName = r.nombre.toLowerCase().includes(query)
        const matchesInst = r.institucion.toLowerCase().includes(query)
        const matchesLine = r.lineasInteres.some((l) => l.toLowerCase().includes(query))
        if (!matchesName && !matchesInst && !matchesLine) return false
      }
      return true
    })
  }, [reviewers, onlyOverdue, selectedLinea, selectedInstitucion, searchQuery])

  // Paginación
  const totalPages = Math.max(1, Math.ceil(filteredReviewers.length / itemsPerPage))
  const paginatedReviewers = filteredReviewers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSendInvite = (e) => {
    e.preventDefault()
    if (!inviteForm.nombre.trim() || !inviteForm.correo.trim()) return

    const newRev = {
      id: `rev-${Date.now()}`,
      nombre: inviteForm.nombre.trim(),
      institucion: inviteForm.institucion,
      lineasInteres: inviteForm.lineasInteres.split(',').map((s) => s.trim()).filter(Boolean),
      asignadas: 0,
      entregadas: 0,
      vencidas: 0,
    }

    const updated = [...reviewers, newRev]
    setReviewers(updated)
    reviewersRepository.set(updated)

    setIsInviteModalOpen(false)
    setInviteForm({
      nombre: '',
      correo: '',
      institucion: 'Universidad de Lima',
      lineasInteres: '',
    })
    setInviteSuccess(`Invitación enviada exitosamente a ${newRev.nombre}.`)
    setTimeout(() => setInviteSuccess(''), 5000)
  }

  return (
    <div className={styles.page}>
      <Header />
      <CommitteeNavigation rutaActiva="/revisores" usuario={committeeUser} />

      <main className={styles.mainContent}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>Revisores</h1>
            <p className={styles.subtitle}>
              {reviewers.length} revisores registrados · {totalAsignadas} revisiones asignadas · {totalVencidas} vencidas
            </p>
          </div>
          <div>
            <Button variant="primario" onClick={() => setIsInviteModalOpen(true)}>
              Invitar revisor
            </Button>
          </div>
        </div>

        {inviteSuccess && (
          <div className={styles.notificationSuccess}>
            <span>✓ {inviteSuccess}</span>
          </div>
        )}

        {/* Barra de filtros */}
        <div className={styles.filterBar}>
          <div className={styles.filterControls}>
            <label className={styles.selectLabel}>
              Línea:
              <select
                className={styles.filterSelect}
                value={selectedLinea}
                onChange={(e) => {
                  setSelectedLinea(e.target.value)
                  setCurrentPage(1)
                }}
              >
                <option value="todas">todas</option>
                <option value="Ingeniería de software">Ingeniería de software</option>
                <option value="Inteligencia artificial y datos">Inteligencia artificial y datos</option>
                <option value="Sostenibilidad y ciudad">Sostenibilidad y ciudad</option>
                <option value="Innovación y emprendimiento">Innovación y emprendimiento</option>
                <option value="Salud y sociedad">Salud y sociedad</option>
                <option value="Economía y mercados">Economía y mercados</option>
              </select>
            </label>

            <label className={styles.selectLabel}>
              Institución:
              <select
                className={styles.filterSelect}
                value={selectedInstitucion}
                onChange={(e) => {
                  setSelectedInstitucion(e.target.value)
                  setCurrentPage(1)
                }}
              >
                <option value="todas">todas</option>
                <option value="Universidad de Lima">Universidad de Lima</option>
                <option value="Pontificia Universidad Católica">Pontificia Universidad Católica</option>
                <option value="Universidad del Pacífico">Universidad del Pacífico</option>
                <option value="Universidad Nacional de Ingeniería">Universidad Nacional de Ingeniería</option>
                <option value="Universidad Nacional Mayor de San Marcos">Universidad Nacional Mayor de San Marcos</option>
              </select>
            </label>

            <button
              type="button"
              className={`${styles.overdueFilterBtn} ${onlyOverdue ? styles.overdueActive : ''}`}
              onClick={() => {
                setOnlyOverdue(!onlyOverdue)
                setCurrentPage(1)
              }}
            >
              Con revisiones vencidas · {countWithOverdue}
            </button>
          </div>

          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Buscar revisor…"
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>
        </div>

        {/* Tabla de revisores */}
        <div className={styles.tableWrapper}>
          <table className={styles.reviewersTable}>
            <thead>
              <tr>
                <th>REVISOR</th>
                <th>INSTITUCIÓN</th>
                <th>LÍNEAS DE INTERÉS</th>
                <th style={{ textAlign: 'center' }}>ASIGNADAS</th>
                <th style={{ textAlign: 'center' }}>ENTREGADAS</th>
                <th style={{ textAlign: 'center' }}>VENCIDAS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReviewers.map((rev) => (
                <tr key={rev.id}>
                  <td className={styles.nameCell}>
                    <strong>{rev.nombre}</strong>
                  </td>
                  <td className={styles.instCell}>{rev.institucion}</td>
                  <td className={styles.linesCell}>
                    {rev.lineasInteres.join(' · ')}
                  </td>
                  <td style={{ textAlign: 'center' }}>{rev.asignadas}</td>
                  <td style={{ textAlign: 'center' }}>{rev.entregadas}</td>
                  <td style={{ textAlign: 'center' }}>
                    {rev.vencidas > 0 ? (
                      <span className={styles.overdueBadge}>{rev.vencidas}</span>
                    ) : (
                      <span className={styles.zeroBadge}>0</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className={styles.paginationRow}>
          <span className={styles.paginationInfo}>
            Mostrando {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredReviewers.length)} de {filteredReviewers.length} revisores
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
      </main>

      <Footer />

      {/* Modal invitar revisor */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invitar revisor al congreso"
      >
        <form onSubmit={handleSendInvite} className={styles.inviteForm}>
          <label className={styles.modalLabel}>
            NOMBRES Y APELLIDOS *
            <input
              type="text"
              required
              className={styles.modalInput}
              value={inviteForm.nombre}
              placeholder="Ej. Dr. Mario Vargas Llosa"
              onChange={(e) => setInviteForm({ ...inviteForm, nombre: e.target.value })}
            />
          </label>

          <label className={styles.modalLabel}>
            CORREO ELECTRÓNICO *
            <input
              type="email"
              required
              className={styles.modalInput}
              value={inviteForm.correo}
              placeholder="revisor@universidad.edu.pe"
              onChange={(e) => setInviteForm({ ...inviteForm, correo: e.target.value })}
            />
          </label>

          <label className={styles.modalLabel}>
            INSTITUCIÓN *
            <input
              type="text"
              required
              className={styles.modalInput}
              value={inviteForm.institucion}
              onChange={(e) => setInviteForm({ ...inviteForm, institucion: e.target.value })}
            />
          </label>

          <label className={styles.modalLabel}>
            LÍNEAS DE INTERÉS (SEPARADAS POR COMA)
            <input
              type="text"
              className={styles.modalInput}
              value={inviteForm.lineasInteres}
              placeholder="Ingeniería de software, IA y datos"
              onChange={(e) => setInviteForm({ ...inviteForm, lineasInteres: e.target.value })}
            />
          </label>

          <div className={styles.modalActions}>
            <Button variant="secundario" type="button" onClick={() => setIsInviteModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primario" type="submit">
              Enviar invitación
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
