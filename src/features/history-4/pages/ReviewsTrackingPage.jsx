import { remindersRepository } from '../../../core/utils/repositories.js'
import { useState as usarEstado } from 'react'
import Encabezado from '../../../core/ui/Header/Header.jsx'
import NavegacionComite from '../../../core/ui/CommitteeNavigation/CommitteeNavigation.jsx'
import PiePagina from '../../../core/ui/Footer/Footer.jsx'
import Pagination from '../../../core/ui/Pagination/Pagination.jsx'
import { formatScheduleDate } from '../../../core/utils/states/scheduleState.js'
import Boton from '../../../core/ui/Button/Button.jsx'
import ModalReasignar from '../components/ReassignModal/ReassignModal.jsx'
import { Link } from 'react-router'
import useConference from '../../../core/utils/useConference.js'
import { getPendingReviews, getReview } from '../../../core/utils/assignments.js'
import estilos from './ReviewsTrackingPage.module.css'

const usuarioComite = {
  nombre: 'Dra. Ana Salazar Bermúdez',
  rol: 'Rol: Comité organizador',
  iniciales: 'AS',
}

export default function PaginaSeguimientoRevisiones() {
  const conference = useConference()
  const revisionesPendientes = getPendingReviews(conference.works, conference.reviewers, conference.reviews)
  const listaRevisores = conference.reviewers.filter(reviewer => !reviewer.bloqueado)
  const ocupado = conference.busy
  const errorAlmacenamiento = conference.error

  const [filtrarSoloVencidas, cambiarFiltrarSoloVencidas] = usarEstado(false)
  const [page, setPage] = usarEstado(1)
  const [notificacion, cambiarNotificacion] = usarEstado('')

  const [modalReasignarAbierto, cambiarModalReasignarAbierto] = usarEstado(false)
  const [elementoSeleccionadoReasignar, cambiarElementoSeleccionadoReasignar] = usarEstado(null)

  const cantidadVencidas = revisionesPendientes.filter((elemento) => elemento.esVencida).length
  const cantidadEnPlazo = revisionesPendientes.filter((elemento) => !elemento.esVencida).length
  const totalAsignadas = conference.works.reduce((sum, work) => sum + work.revisoresAsignados.length, 0)
  const totalEntregadas = conference.works.reduce((sum, work) => sum + work.revisoresAsignados.filter(id => { const reviewer = conference.reviewers.find(item => item.id === id); return reviewer && getReview(conference.reviews, reviewer, work.codigo)?.status === 'submitted' }).length, 0)

  const listaMostrada = filtrarSoloVencidas
    ? revisionesPendientes.filter((elemento) => elemento.esVencida)
    : revisionesPendientes

  const pageSize = 6
  const currentPage = Math.min(page, Math.max(1, Math.ceil(listaMostrada.length / pageSize)))
  const visibleReviews = listaMostrada.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  async function recordReminders(items) {
    if (ocupado) return
    try {
      const existing = await remindersRepository.get()
      await remindersRepository.save([...existing, ...items.map(item => ({ id: crypto.randomUUID(), codigo: item.codigo, revisorId: item.revisorId, createdAt: new Date().toISOString() }))])
      cambiarNotificacion(`${items.length} recordatorio(s) registrado(s) en este navegador.`)
    } catch (cause) { cambiarNotificacion(cause.message) }
  }
  const manejarRecordarTodos = () => recordReminders(revisionesPendientes)
  const manejarRecordarIndividual = item => recordReminders([item])

  const manejarAbrirReasignacion = (elemento) => {
    cambiarElementoSeleccionadoReasignar(elemento)
    cambiarModalReasignarAbierto(true)
  }

  const manejarConfirmarReasignacion = async ({
    pendienteId,
    revisorAnterior,
    nuevoRevisorId,
    nuevoRevisorNombre,
    motivo,
  }) => {
    if (ocupado || errorAlmacenamiento) return false

    const pending = revisionesPendientes.find(item => item.id === pendienteId)
    if (!pending) return false
    const candidate = listaRevisores.find(reviewer => reviewer.id === nuevoRevisorId)
    const work = conference.works.find(item => item.codigo === pending.codigo)
    if (!candidate || work.revisoresAsignados.includes(candidate.id) || work.details?.autores?.some(author => author.correo === candidate.email)) return false
    try {
      await conference.save('works', conference.works.map(item => item.codigo === pending.codigo ? { ...item, revisoresAsignados: item.revisoresAsignados.map(id => id === pending.revisorId ? nuevoRevisorId : id), reassignmentReason: motivo, assignedAt: new Date().toISOString() } : item))
    } catch { return false }

    cambiarNotificacion(
      `Trabajo reasignado de ${revisorAnterior} a ${nuevoRevisorNombre}. Motivo registrado: "${motivo}".`
    )
    setTimeout(() => cambiarNotificacion(''), 6000)
    return true
  }

  return (
    <div className={estilos.pagina}>
      <Encabezado estado="En revisión" />
      <NavegacionComite rutaActiva="/seguimiento" usuario={usuarioComite} />

      <main className={estilos.contenidoPrincipal}>
        {errorAlmacenamiento ? <p role="alert">{errorAlmacenamiento}</p> : null}

        <fieldset
          className={estilos.grupoCampos}
          disabled={ocupado || Boolean(errorAlmacenamiento)}
        >
          <div className={estilos.filaEncabezado}>
            <div>
              <h1 className={estilos.titulo}>Seguimiento de revisiones</h1>
              <p className={estilos.subtitulo}>
                Pendientes ordenadas por fecha límite · cierre de la etapa: {formatScheduleDate(conference.schedule.review ?? '')}
              </p>
            </div>
            <div>
              <Boton variant="secondary" type="button" onClick={manejarRecordarTodos}>
                Recordatorio a todos los pendientes
              </Boton>
            </div>
          </div>

          {notificacion ? (
            <div className={estilos.bannerNotificacion}>
              <span>✓ {notificacion}</span>
            </div>
          ) : null}

          {cantidadVencidas > 0 ? (
            <div className={estilos.cajaAlertaVencidas}>
              <div className={estilos.alertaIzquierda}>
                <span className={estilos.iconoAlerta} aria-hidden="true">
                  !
                </span>
                <span>
                  <strong>{cantidadVencidas} revisiones vencidas.</strong> Considere reasignar para no retrasar la publicación de resultados.
                </span>
              </div>
              <button
                type="button"
                className={estilos.botonAlternarAlerta}
                onClick={() => cambiarFiltrarSoloVencidas(!filtrarSoloVencidas)}
              >
                {filtrarSoloVencidas ? 'Ver todas las pendientes' : 'Ver solo vencidas'}
              </button>
            </div>
          ) : null}

          <div className={estilos.contenedorTabla}>
            <table className={estilos.tablaSeguimiento}>
              <thead>
                <tr>
                  <th>CÓDIGO</th>
                  <th>TRABAJO</th>
                  <th>REVISOR</th>
                  <th>FECHA LÍMITE</th>
                  <th>ESTADO</th>
                  <th className={estilos.columnaAccion}>ACCIÓN</th>
                </tr>
              </thead>
              <tbody>
                {visibleReviews.map((elemento) => (
                  <tr
                    key={elemento.id}
                    className={elemento.esVencida ? estilos.filaVencida : ''}
                  >
                    <td className={estilos.celdaCodigo}>{elemento.codigo}</td>
                    <td className={estilos.celdaTitulo}>
                      <Link to={`/trabajos-recibidos/${elemento.codigo}/consolidado`}><strong>{elemento.trabajo}</strong></Link>
                    </td>
                    <td className={estilos.celdaRevisor}>{elemento.revisor}</td>
                    <td
                      className={
                        elemento.esVencida
                          ? estilos.celdaFechaVencida
                          : estilos.celdaFechaNormal
                      }
                    >
                      {elemento.fechaLimite}
                    </td>
                    <td>
                      {elemento.esVencida ? (
                        <span className={estilos.insigniaVencida}>{elemento.estado}</span>
                      ) : (
                        <span className={estilos.insigniaPendiente}>{elemento.estado}</span>
                      )}
                    </td>
                    <td className={estilos.celdaAccion}>
                      {elemento.esVencida ? (
                        <button
                          type="button"
                          className={estilos.botonAccionTexto}
                          onClick={() => manejarAbrirReasignacion(elemento)}
                        >
                          Reasignar
                        </button>
                      ) : (
                        <button
                          type="button"
                          className={estilos.botonAccionTexto}
                          onClick={() => manejarRecordarIndividual(elemento)}
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

          <Pagination pagina={currentPage} total={listaMostrada.length} porPagina={pageSize} alCambiar={setPage} />

          <div className={estilos.cuadriculaResumenInferior}>
            <div className={estilos.tarjetaResumenInferior}>
              <span className={estilos.etiquetaResumen}>Revisiones entregadas</span>
              <span className={estilos.valorResumenExito}>
                {totalEntregadas} de {totalAsignadas}
              </span>
            </div>
            <div className={estilos.tarjetaResumenInferior}>
              <span className={estilos.etiquetaResumen}>Pendientes en plazo</span>
              <span className={estilos.valorResumenAdvertencia}>{cantidadEnPlazo}</span>
            </div>
            <div className={estilos.tarjetaResumenInferior}>
              <span className={estilos.etiquetaResumen}>Vencidas</span>
              <span className={estilos.valorResumenPeligro}>{cantidadVencidas}</span>
            </div>
          </div>
        </fieldset>
      </main>

      <PiePagina />

      <ModalReasignar
        guardando={ocupado}
        error={errorAlmacenamiento}
        abierto={modalReasignarAbierto}
        alCerrar={() => cambiarModalReasignarAbierto(false)}
        itemPendiente={elementoSeleccionadoReasignar}
        revisores={listaRevisores}
        alConfirmarReasignacion={manejarConfirmarReasignacion}
      />
    </div>
  )
}
