import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'
import Encabezado from '../../../core/ui/Header/Header.jsx'
import NavegacionComite from '../../../core/ui/CommitteeNavigation/CommitteeNavigation.jsx'
import PiePagina from '../../../core/ui/Footer/Footer.jsx'
import Pagination from '../../../core/ui/Pagination/Pagination.jsx'
import Boton from '../../../core/ui/Button/Button.jsx'
import ModalReasignar from '../components/ReassignModal/ReassignModal.jsx'
import {
  enviarRecordatorioRevision,
  enviarRecordatoriosPendientes,
  obtenerSeguimientoRevisiones,
  reasignarRevision,
  retirarRevision,
} from '../../../core/utils/asignacionesApi.js'
import estilos from './ReviewsTrackingPage.module.css'

const estadoInicial = {
  cierreEtapaRevisionTexto: null,
  alertaVencidas: { activa: false, cantidad: 0, mensaje: null },
  resumen: {
    totalAsignadas: 0,
    entregadas: 0,
    pendientesEnPlazo: 0,
    vencidas: 0,
  },
  pendientes: [],
}

export default function PaginaSeguimientoRevisiones() {
  const [datos, setDatos] = useState(estadoInicial)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [errorCarga, setErrorCarga] = useState('')
  const [errorModal, setErrorModal] = useState('')

  const [filtrarSoloVencidas, cambiarFiltrarSoloVencidas] = useState(false)
  const [pagina, setPagina] = useState(1)
  const [notificacion, cambiarNotificacion] = useState('')

  const [modalAbierto, cambiarModalAbierto] = useState(false)
  const [modoModal, cambiarModoModal] = useState('reasignar')
  const [itemSeleccionado, cambiarItemSeleccionado] = useState(null)

  const recargarSeguimiento = useCallback(async () => {
    const respuesta = await obtenerSeguimientoRevisiones()
    setDatos({
      cierreEtapaRevisionTexto: respuesta.cierreEtapaRevisionTexto ?? '—',
      alertaVencidas: respuesta.alertaVencidas ?? estadoInicial.alertaVencidas,
      resumen: respuesta.resumen ?? estadoInicial.resumen,
      pendientes: respuesta.pendientes ?? [],
    })
  }, [])

  useEffect(() => {
    let activo = true
    obtenerSeguimientoRevisiones()
      .then(respuesta => {
        if (activo) {
          setDatos({
            cierreEtapaRevisionTexto: respuesta.cierreEtapaRevisionTexto ?? '—',
            alertaVencidas: respuesta.alertaVencidas ?? estadoInicial.alertaVencidas,
            resumen: respuesta.resumen ?? estadoInicial.resumen,
            pendientes: respuesta.pendientes ?? [],
          })
        }
      })
      .catch(causa => {
        if (activo) {
          setErrorCarga(causa.message)
        }
      })
      .finally(() => {
        if (activo) {
          setCargando(false)
        }
      })
    return () => {
      activo = false
    }
  }, [])

  const ocupado = cargando || guardando
  const { resumen, alertaVencidas, pendientes } = datos

  const listaMostrada = filtrarSoloVencidas
    ? pendientes.filter(elemento => elemento.esVencida)
    : pendientes

  const porPagina = 6
  const paginaActual = Math.min(
    pagina,
    Math.max(1, Math.ceil(listaMostrada.length / porPagina))
  )
  const revisionesVisibles = listaMostrada.slice(
    (paginaActual - 1) * porPagina,
    paginaActual * porPagina
  )

  const mostrarAviso = texto => {
    cambiarNotificacion(texto)
    setTimeout(() => cambiarNotificacion(''), 5000)
  }

  const manejarRecordarTodos = async () => {
    if (ocupado || listaMostrada.length === 0) {
      return
    }
    setGuardando(true)
    setErrorCarga('')
    try {
      const respuesta = await enviarRecordatoriosPendientes(
        filtrarSoloVencidas ? { soloVencidas: true } : {}
      )
      await recargarSeguimiento()
      mostrarAviso(
        `${respuesta.totalEnviados} recordatorio(s) registrado(s) correctamente.`
      )
    } catch (causa) {
      setErrorCarga(causa.message)
    } finally {
      setGuardando(false)
    }
  }

  const manejarRecordarIndividual = async elemento => {
    if (ocupado) {
      return
    }
    setGuardando(true)
    setErrorCarga('')
    try {
      await enviarRecordatorioRevision(elemento.asignacionId)
      await recargarSeguimiento()
      mostrarAviso(`Recordatorio enviado a ${elemento.revisor} para ${elemento.codigo}.`)
    } catch (causa) {
      setErrorCarga(causa.message)
    } finally {
      setGuardando(false)
    }
  }

  const abrirModalAccion = (elemento, modo) => {
    setErrorModal('')
    cambiarModoModal(modo)
    cambiarItemSeleccionado(elemento)
    cambiarModalAbierto(true)
  }

  const manejarConfirmarReasignacion = async ({
    asignacionId,
    revisorAnterior,
    nuevoRevisorId,
    nuevoRevisorNombre,
    motivo,
    permitirMismaInstitucion,
    justificacion,
  }) => {
    if (ocupado) {
      return false
    }
    setGuardando(true)
    setErrorModal('')
    try {
      await reasignarRevision(asignacionId, {
        nuevoRevisorId,
        motivo,
        permitirMismaInstitucion,
        justificacion,
      })
      await recargarSeguimiento()
      mostrarAviso(
        `Trabajo reasignado de ${revisorAnterior} a ${nuevoRevisorNombre}. Motivo registrado: "${motivo}".`
      )
      return true
    } catch (causa) {
      setErrorModal(causa.message)
      return false
    } finally {
      setGuardando(false)
    }
  }

  const manejarConfirmarRetiro = async ({
    asignacionId,
    codigo,
    revisorAnterior,
    motivo,
  }) => {
    if (ocupado) {
      return false
    }
    setGuardando(true)
    setErrorModal('')
    try {
      await retirarRevision(asignacionId, motivo)
      await recargarSeguimiento()
      mostrarAviso(
        `Se retiró a ${revisorAnterior} del trabajo ${codigo}. Motivo registrado: "${motivo}".`
      )
      return true
    } catch (causa) {
      setErrorModal(causa.message)
      return false
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className={estilos.pagina}>
      <Encabezado />
      <NavegacionComite rutaActiva="/seguimiento" />

      <main className={estilos.contenidoPrincipal}>
        {errorCarga ? <p role="alert">{errorCarga}</p> : null}

        <fieldset className={estilos.grupoCampos} disabled={ocupado}>
          <div className={estilos.filaEncabezado}>
            <div>
              <h1 className={estilos.titulo}>Seguimiento de revisiones</h1>
              <p className={estilos.subtitulo}>
                {cargando
                  ? 'Cargando revisiones pendientes…'
                  : `Pendientes ordenadas por fecha límite · cierre de la etapa: ${datos.cierreEtapaRevisionTexto || '—'}`}
              </p>
            </div>
            <div>
              <Boton
                variant="secondary"
                type="button"
                disabled={ocupado || listaMostrada.length === 0}
                onClick={manejarRecordarTodos}
              >
                Recordatorio a todos los pendientes
              </Boton>
            </div>
          </div>

          {notificacion ? (
            <div className={estilos.bannerNotificacion} role="status">
              <span>✓ {notificacion}</span>
            </div>
          ) : null}

          {alertaVencidas.activa ? (
            <div className={estilos.cajaAlertaVencidas}>
              <div className={estilos.alertaIzquierda}>
                <span className={estilos.iconoAlerta} aria-hidden="true">
                  !
                </span>
                <span>
                  <strong>{alertaVencidas.cantidad} revisiones vencidas.</strong>{' '}
                  Considere reasignar para no retrasar la publicación de resultados.
                </span>
              </div>
              <button
                type="button"
                className={estilos.botonAlternarAlerta}
                onClick={() => {
                  cambiarFiltrarSoloVencidas(!filtrarSoloVencidas)
                  setPagina(1)
                }}
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
                {revisionesVisibles.map(elemento => (
                  <tr
                    key={elemento.asignacionId}
                    className={elemento.esVencida ? estilos.filaVencida : ''}
                  >
                    <td className={estilos.celdaCodigo}>{elemento.codigo}</td>
                    <td className={estilos.celdaTitulo}>
                      <Link
                        to={`/trabajos-recibidos/${encodeURIComponent(elemento.codigo)}/consolidado`}
                      >
                        <strong>{elemento.trabajo}</strong>
                      </Link>
                    </td>
                    <td className={estilos.celdaRevisor}>{elemento.revisor}</td>
                    <td
                      className={
                        elemento.esVencida
                          ? estilos.celdaFechaVencida
                          : estilos.celdaFechaNormal
                      }
                    >
                      {elemento.fechaLimiteTexto}
                    </td>
                    <td>
                      {elemento.esVencida ? (
                        <span className={estilos.insigniaVencida}>
                          {elemento.etiquetaEstado}
                        </span>
                      ) : (
                        <span className={estilos.insigniaPendiente}>
                          {elemento.etiquetaEstado}
                        </span>
                      )}
                    </td>
                    <td className={estilos.celdaAccion}>
                      <div className={estilos.accionesFila}>
                        {elemento.esVencida ? (
                          <button
                            type="button"
                            className={estilos.botonAccionTexto}
                            onClick={() => abrirModalAccion(elemento, 'reasignar')}
                          >
                            Reasignar
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              className={estilos.botonAccionTexto}
                              onClick={() => manejarRecordarIndividual(elemento)}
                            >
                              Recordar
                            </button>
                            <span aria-hidden="true" className={estilos.separadorAccion}>
                              ·
                            </span>
                            <button
                              type="button"
                              className={estilos.botonAccionTexto}
                              onClick={() => abrirModalAccion(elemento, 'reasignar')}
                            >
                              Reasignar
                            </button>
                          </>
                        )}
                        <span aria-hidden="true" className={estilos.separadorAccion}>
                          ·
                        </span>
                        <button
                          type="button"
                          className={estilos.botonAccionTexto}
                          onClick={() => abrirModalAccion(elemento, 'retirar')}
                        >
                          Retirar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            pagina={paginaActual}
            total={listaMostrada.length}
            porPagina={porPagina}
            alCambiar={setPagina}
          />

          <div className={estilos.cuadriculaResumenInferior}>
            <div className={estilos.tarjetaResumenInferior}>
              <span className={estilos.etiquetaResumen}>Revisiones entregadas</span>
              <span className={estilos.valorResumenExito}>
                {resumen.entregadas} de {resumen.totalAsignadas}
              </span>
            </div>
            <div className={estilos.tarjetaResumenInferior}>
              <span className={estilos.etiquetaResumen}>Pendientes en plazo</span>
              <span className={estilos.valorResumenAdvertencia}>
                {resumen.pendientesEnPlazo}
              </span>
            </div>
            <div className={estilos.tarjetaResumenInferior}>
              <span className={estilos.etiquetaResumen}>Vencidas</span>
              <span className={estilos.valorResumenPeligro}>{resumen.vencidas}</span>
            </div>
          </div>
        </fieldset>
      </main>

      <PiePagina />

      {modalAbierto && itemSeleccionado && (
        <ModalReasignar
          key={`${modoModal}:${itemSeleccionado.asignacionId}`}
          modo={modoModal}
          guardando={guardando}
          error={errorModal}
          abierto={modalAbierto}
          alCerrar={() => cambiarModalAbierto(false)}
          itemPendiente={itemSeleccionado}
          alConfirmarReasignacion={manejarConfirmarReasignacion}
          alConfirmarRetiro={manejarConfirmarRetiro}
        />
      )}
    </div>
  )
}
