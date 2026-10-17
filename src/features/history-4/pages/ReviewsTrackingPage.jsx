import { useState } from 'react'
import Header from '../../../core/ui/Header/Header.jsx'
import CommitteeNavigation from '../../../core/ui/CommitteeNavigation/CommitteeNavigation.jsx'
import Footer from '../../../core/ui/Footer/Footer.jsx'
import Button from '../../../core/ui/Button/Button.jsx'
import ReassignModal from '../components/ReassignModal/ReassignModal.jsx'
import useStoredState from '../../../core/utils/useStoredState.js'
import { pendingReviewsRepository, reviewersRepository } from '../../../core/utils/repositories.js'
import { initialPendingReviews, initialReviewers } from '../../../core/utils/states/worksAssignmentState.js'
import styles from './ReviewsTrackingPage.module.css'

const usuarioComite = {
  nombre: 'Dra. Ana Salazar Bermúdez',
  rol: 'Rol: Comité organizador',
  iniciales: 'AS',
}

export default function ReviewsTrackingPage() {
  const estadoPendientes = useStoredState(pendingReviewsRepository, initialPendingReviews)
  const revisionesPendientes = estadoPendientes.value
  const estadoRevisores = useStoredState(reviewersRepository, initialReviewers)
  const listaRevisores = estadoRevisores.value

  const ocupado = [estadoPendientes, estadoRevisores].some((estado) => estado.loading || estado.saving)
  const errorAlmacenamiento = [estadoPendientes, estadoRevisores].find((estado) => estado.error)?.error

  const [filtrarSoloVencidas, establecerFiltrarSoloVencidas] = useState(false)
  const [notificacion, establecerNotificacion] = useState('')

  const [modalReasignarAbierto, establecerModalReasignarAbierto] = useState(false)
  const [itemSeleccionadoReasignar, establecerItemSeleccionadoReasignar] = useState(null)

  const cantidadVencidas = revisionesPendientes.filter((item) => item.esVencida).length
  const cantidadEnPlazo = revisionesPendientes.filter((item) => !item.esVencida).length
  const totalEntregadas = 19
  const totalAsignadas = 26

  const listaMostrada = filtrarSoloVencidas
    ? revisionesPendientes.filter((item) => item.esVencida)
    : revisionesPendientes

  const manejarRecordarTodos = () => {
    establecerNotificacion(
      'Recordatorio enviado exitosamente por correo a todos los revisores con tareas pendientes.'
    )
    setTimeout(() => establecerNotificacion(''), 5000)
  }

  const manejarRecordarIndividual = (item) => {
    establecerNotificacion(
      `Recordatorio enviado al revisor ${item.revisor} para el trabajo ${item.codigo}.`
    )
    setTimeout(() => establecerNotificacion(''), 5000)
  }

  const manejarAbrirReasignacion = (item) => {
    establecerItemSeleccionadoReasignar(item)
    establecerModalReasignarAbierto(true)
  }

  const manejarConfirmarReasignacion = async ({
    pendienteId,
    revisorAnterior,
    nuevoRevisorId,
    nuevoRevisorNombre,
    motivo,
  }) => {
    if (ocupado || errorAlmacenamiento) return false

    const actualizadas = revisionesPendientes.map((item) => {
      if (item.id === pendienteId) {
        return {
          ...item,
          revisorId: nuevoRevisorId,
          revisor: nuevoRevisorNombre,
          estado: 'Pendiente · 8 días',
          esVencida: false,
          fechaLimite: '20/10/2026',
        }
      }
      return item
    })

    const guardado = await estadoPendientes.save(actualizadas).catch(() => false)
    if (!guardado) return false

    establecerNotificacion(
      `Trabajo reasignado de ${revisorAnterior} a ${nuevoRevisorNombre}. Motivo registrado: "${motivo}".`
    )
    setTimeout(() => establecerNotificacion(''), 6000)
    return true
  }

  return (
    <div className={styles.pagina}>
      <Header estado="En revisión" />
      <CommitteeNavigation rutaActiva="/seguimiento" usuario={usuarioComite} />

      <main className={styles.contenidoPrincipal}>
        {errorAlmacenamiento ? <p role="alert">{errorAlmacenamiento}</p> : null}

        <fieldset className={styles.grupoCampos} disabled={ocupado || Boolean(errorAlmacenamiento)}>
          <div className={styles.filaEncabezado}>
            <div>
              <h1 className={styles.titulo}>Seguimiento de revisiones</h1>
              <p className={styles.subtitulo}>
                Pendientes ordenadas por fecha límite · cierre de la etapa: 20/10/2026
              </p>
            </div>
            <div>
              <Button variant="secondary" type="button" onClick={manejarRecordarTodos}>
                Recordatorio a todos los pendientes
              </Button>
            </div>
          </div>

          {notificacion ? (
            <div className={styles.bannerNotificacion}>
              <span>✓ {notificacion}</span>
            </div>
          ) : null}

          {cantidadVencidas > 0 ? (
            <div className={styles.cajaAlertaVencidas}>
              <div className={styles.alertaIzquierda}>
                <span className={styles.iconoAlerta} aria-hidden="true">!</span>
                <span>
                  <strong>{cantidadVencidas} revisiones vencidas.</strong> Considere reasignar para no retrasar la publicación de resultados.
                </span>
              </div>
              <button
                type="button"
                className={styles.botonAlternarAlerta}
                onClick={() => establecerFiltrarSoloVencidas(!filtrarSoloVencidas)}
              >
                {filtrarSoloVencidas ? 'Ver todas las pendientes' : 'Ver solo vencidas'}
              </button>
            </div>
          ) : null}

          <div className={styles.contenedorTabla}>
            <table className={styles.tablaSeguimiento}>
              <thead>
                <tr>
                  <th>CÓDIGO</th>
                  <th>TRABAJO</th>
                  <th>REVISOR</th>
                  <th>FECHA LÍMITE</th>
                  <th>ESTADO</th>
                  <th className={styles.columnaAccion}>ACCIÓN</th>
                </tr>
              </thead>
              <tbody>
                {listaMostrada.map((item) => (
                  <tr key={item.id} className={item.esVencida ? styles.filaVencida : ''}>
                    <td className={styles.celdaCodigo}>{item.codigo}</td>
                    <td className={styles.celdaTitulo}>
                      <strong>{item.trabajo}</strong>
                    </td>
                    <td className={styles.celdaRevisor}>{item.revisor}</td>
                    <td className={item.esVencida ? styles.celdaFechaVencida : styles.celdaFechaNormal}>
                      {item.fechaLimite}
                    </td>
                    <td>
                      {item.esVencida ? (
                        <span className={styles.insigniaVencida}>{item.estado}</span>
                      ) : (
                        <span className={styles.insigniaPendiente}>{item.estado}</span>
                      )}
                    </td>
                    <td className={styles.celdaAccion}>
                      {item.esVencida ? (
                        <button
                          type="button"
                          className={styles.botonAccionTexto}
                          onClick={() => manejarAbrirReasignacion(item)}
                        >
                          Reasignar
                        </button>
                      ) : (
                        <button
                          type="button"
                          className={styles.botonAccionTexto}
                          onClick={() => manejarRecordarIndividual(item)}
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

          <div className={styles.cuadriculaResumenInferior}>
            <div className={styles.tarjetaResumenInferior}>
              <span className={styles.etiquetaResumen}>Revisiones entregadas</span>
              <span className={styles.valorResumenExito}>
                {totalEntregadas} de {totalAsignadas}
              </span>
            </div>
            <div className={styles.tarjetaResumenInferior}>
              <span className={styles.etiquetaResumen}>Pendientes en plazo</span>
              <span className={styles.valorResumenAdvertencia}>{cantidadEnPlazo}</span>
            </div>
            <div className={styles.tarjetaResumenInferior}>
              <span className={styles.etiquetaResumen}>Vencidas</span>
              <span className={styles.valorResumenPeligro}>{cantidadVencidas}</span>
            </div>
          </div>
        </fieldset>
      </main>

      <Footer />

      <ReassignModal
        guardando={ocupado}
        error={errorAlmacenamiento}
        abierto={modalReasignarAbierto}
        alCerrar={() => establecerModalReasignarAbierto(false)}
        itemPendiente={itemSeleccionadoReasignar}
        revisores={listaRevisores}
        alConfirmarReasignacion={manejarConfirmarReasignacion}
      />
    </div>
  )
}
