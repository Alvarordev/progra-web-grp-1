import { useState as usarEstado } from 'react'
import Encabezado from '../../../core/ui/Header/Header.jsx'
import NavegacionComite from '../../../core/ui/CommitteeNavigation/CommitteeNavigation.jsx'
import PiePagina from '../../../core/ui/Footer/Footer.jsx'
import Boton from '../../../core/ui/Button/Button.jsx'
import ModalReasignar from '../components/ReassignModal/ReassignModal.jsx'
import usarEstadoAlmacenado from '../../../core/utils/useStoredState.js'
import {
  pendingReviewsRepository as repositorioRevisionesPendientes,
  reviewersRepository as repositorioRevisores,
} from '../../../core/utils/repositories.js'
import {
  revisionesPendientesIniciales,
  revisoresIniciales,
} from '../../../core/utils/states/worksAssignmentState.js'
import estilos from './ReviewsTrackingPage.module.css'

const usuarioComite = {
  nombre: 'Dra. Ana Salazar Bermúdez',
  rol: 'Rol: Comité organizador',
  iniciales: 'AS',
}

export default function PaginaSeguimientoRevisiones() {
  const estadoPendientes = usarEstadoAlmacenado(
    repositorioRevisionesPendientes,
    revisionesPendientesIniciales
  )
  const revisionesPendientes = estadoPendientes.value
  const estadoRevisores = usarEstadoAlmacenado(repositorioRevisores, revisoresIniciales)
  const listaRevisores = estadoRevisores.value

  const ocupado = [estadoPendientes, estadoRevisores].some(
    (estado) => estado.loading || estado.saving
  )
  const errorAlmacenamiento = [estadoPendientes, estadoRevisores].find(
    (estado) => estado.error
  )?.error

  const [filtrarSoloVencidas, cambiarFiltrarSoloVencidas] = usarEstado(false)
  const [notificacion, cambiarNotificacion] = usarEstado('')

  const [modalReasignarAbierto, cambiarModalReasignarAbierto] = usarEstado(false)
  const [elementoSeleccionadoReasignar, cambiarElementoSeleccionadoReasignar] = usarEstado(null)

  const cantidadVencidas = revisionesPendientes.filter((elemento) => elemento.esVencida).length
  const cantidadEnPlazo = revisionesPendientes.filter((elemento) => !elemento.esVencida).length
  const totalEntregadas = 19
  const totalAsignadas = 26

  const listaMostrada = filtrarSoloVencidas
    ? revisionesPendientes.filter((elemento) => elemento.esVencida)
    : revisionesPendientes

  const manejarRecordarTodos = () => {
    cambiarNotificacion(
      'Recordatorio enviado exitosamente por correo a todos los revisores con tareas pendientes.'
    )
    setTimeout(() => cambiarNotificacion(''), 5000)
  }

  const manejarRecordarIndividual = (elemento) => {
    cambiarNotificacion(
      `Recordatorio enviado al revisor ${elemento.revisor} para el trabajo ${elemento.codigo}.`
    )
    setTimeout(() => cambiarNotificacion(''), 5000)
  }

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

    const actualizadas = revisionesPendientes.map((elemento) => {
      if (elemento.id === pendienteId) {
        return {
          ...elemento,
          revisorId: nuevoRevisorId,
          revisor: nuevoRevisorNombre,
          estado: 'Pendiente · 8 días',
          esVencida: false,
          fechaLimite: '20/10/2026',
        }
      }
      return elemento
    })

    const guardado = await estadoPendientes.save(actualizadas).catch(() => false)
    if (!guardado) return false

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
                Pendientes ordenadas por fecha límite · cierre de la etapa: 20/10/2026
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
                {listaMostrada.map((elemento) => (
                  <tr
                    key={elemento.id}
                    className={elemento.esVencida ? estilos.filaVencida : ''}
                  >
                    <td className={estilos.celdaCodigo}>{elemento.codigo}</td>
                    <td className={estilos.celdaTitulo}>
                      <strong>{elemento.trabajo}</strong>
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
