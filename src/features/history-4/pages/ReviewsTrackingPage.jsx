import { useState } from 'react'
import Header from '../../../core/ui/Header/Header.jsx'
import CommitteeNavigation from '../../../core/ui/CommitteeNavigation/CommitteeNavigation.jsx'
import Footer from '../../../core/ui/Footer/Footer.jsx'
import Button from '../../../core/ui/Button/Button.jsx'
import ReassignModal from '../components/ReassignModal/ReassignModal.jsx'
import { pendingReviewsRepository, reviewersRepository } from '../../../core/utils/repositories.js'
import styles from './ReviewsTrackingPage.module.css'

const committeeUser = {
  nombre: 'Dra. Ana Salazar Bermúdez',
  rol: 'Comité organizador',
  iniciales: 'AS',
}

export default function ReviewsTrackingPage() {
  const [pendingReviews, setPendingReviews] = useState(() => pendingReviewsRepository.get())
  const reviewers = reviewersRepository.get()
  const [filterOnlyOverdue, setFilterOnlyOverdue] = useState(false)
  const [notification, setNotification] = useState('')

  // Modal de reasignación
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false)
  const [selectedItemToReassign, setSelectedItemToReassign] = useState(null)

  const countOverdue = pendingReviews.filter((p) => p.esVencida).length
  const countInTime = pendingReviews.filter((p) => !p.esVencida).length
  const totalDelivered = 19
  const totalAssigned = 26

  const displayedList = filterOnlyOverdue
    ? pendingReviews.filter((p) => p.esVencida)
    : pendingReviews

  const handleRemindAll = () => {
    setNotification('Recordatorio enviado exitosamente por correo a todos los revisores con tareas pendientes.')
    setTimeout(() => setNotification(''), 5000)
  }

  const handleRemindSingle = (item) => {
    setNotification(`Recordatorio enviado al revisor ${item.revisor} para el trabajo ${item.codigo}.`)
    setTimeout(() => setNotification(''), 5000)
  }

  const handleOpenReassign = (item) => {
    setSelectedItemToReassign(item)
    setIsReassignModalOpen(true)
  }

  const handleConfirmReassignment = ({ pendingId, previousReviewer, newReviewerId, newReviewerName, reason }) => {
    const updated = pendingReviews.map((item) => {
      if (item.id === pendingId) {
        return {
          ...item,
          revisorId: newReviewerId,
          revisor: newReviewerName,
          estado: 'Pendiente · 7 días',
          esVencida: false,
          fechaLimite: '20/10/2026',
        }
      }
      return item
    })

    // Actualizar estados
    setPendingReviews(updated)
    pendingReviewsRepository.set(updated)

    setNotification(
      `Trabajo reasignado de ${previousReviewer} a ${newReviewerName}. Motivo registrado: "${reason}".`
    )
    setTimeout(() => setNotification(''), 6000)
  }

  return (
    <div className={styles.page}>
      <Header />
      <CommitteeNavigation rutaActiva="/seguimiento" usuario={committeeUser} />

      <main className={styles.mainContent}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>Seguimiento de revisiones</h1>
            <p className={styles.subtitle}>
              Pendientes ordenadas por fecha límite · cierre de la etapa: 20/10/2026
            </p>
          </div>
          <div>
            <Button variant="secundario" onClick={handleRemindAll}>
              Recordatorio a todos los pendientes
            </Button>
          </div>
        </div>

        {notification && (
          <div className={styles.notificationBanner}>
            <span>✓ {notification}</span>
          </div>
        )}

        {/* Alerta de vencidas */}
        {countOverdue > 0 && (
          <div className={styles.overdueAlertBox}>
            <div className={styles.alertLeft}>
              <span className={styles.alertIcon}>!</span>
              <span>
                <strong>{countOverdue} revisiones vencidas.</strong> Considere reasignar para no retrasar la publicación de resultados.
              </span>
            </div>
            <button
              className={styles.alertToggleBtn}
              onClick={() => setFilterOnlyOverdue(!filterOnlyOverdue)}
            >
              {filterOnlyOverdue ? 'Ver todas las pendientes' : 'Ver solo vencidas'}
            </button>
          </div>
        )}

        {/* Tabla de seguimiento */}
        <div className={styles.tableWrapper}>
          <table className={styles.trackingTable}>
            <thead>
              <tr>
                <th>CÓDIGO</th>
                <th>TRABAJO</th>
                <th>REVISOR</th>
                <th>FECHA LÍMITE</th>
                <th>ESTADO</th>
                <th style={{ textAlign: 'center' }}>ACCIÓN</th>
              </tr>
            </thead>
            <tbody>
              {displayedList.map((item) => (
                <tr key={item.id} className={item.esVencida ? styles.rowOverdue : ''}>
                  <td className={styles.codeCell}>{item.codigo}</td>
                  <td className={styles.titleCell}>
                    <strong>{item.trabajo}</strong>
                  </td>
                  <td className={styles.reviewerCell}>{item.revisor}</td>
                  <td className={styles.dateCell}>{item.fechaLimite}</td>
                  <td>
                    {item.esVencida ? (
                      <span className={styles.badgeOverdue}>{item.estado}</span>
                    ) : (
                      <span className={styles.badgePending}>{item.estado}</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {item.esVencida ? (
                      <button
                        className={styles.reassignBtn}
                        onClick={() => handleOpenReassign(item)}
                      >
                        Reasignar
                      </button>
                    ) : (
                      <button
                        className={styles.remindBtn}
                        onClick={() => handleRemindSingle(item)}
                      >
                        Recordar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Resumen inferior métrico */}
        <div className={styles.bottomStatsRow}>
          <div className={styles.bottomStat}>
            <span className={styles.bottomStatLabel}>Revisiones entregadas</span>
            <span className={styles.bottomStatValue}>
              <strong>{totalDelivered}</strong> de {totalAssigned}
            </span>
          </div>
          <div className={styles.bottomStat}>
            <span className={styles.bottomStatLabel}>Pendientes en plazo</span>
            <span className={styles.bottomStatValue}>
              <strong>{countInTime}</strong>
            </span>
          </div>
          <div className={styles.bottomStat}>
            <span className={styles.bottomStatLabel}>Vencidas</span>
            <span className={`${styles.bottomStatValue} ${styles.statDanger}`}>
              <strong>{countOverdue}</strong>
            </span>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal para reasignar revisor */}
      <ReassignModal
        isOpen={isReassignModalOpen}
        onClose={() => setIsReassignModalOpen(false)}
        pendingItem={selectedItemToReassign}
        reviewers={reviewers}
        onConfirmReassignment={handleConfirmReassignment}
      />
    </div>
  )
}
