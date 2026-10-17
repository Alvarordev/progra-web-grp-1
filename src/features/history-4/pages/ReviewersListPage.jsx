import useConference from '../../../core/utils/useConference.js'
import { getPendingReviews, getReview } from '../../../core/utils/assignments.js'
import { useState as usarEstado, useMemo as usarMemo } from 'react'
import Encabezado from '../../../core/ui/Header/Header.jsx'
import NavegacionComite from '../../../core/ui/CommitteeNavigation/CommitteeNavigation.jsx'
import PiePagina from '../../../core/ui/Footer/Footer.jsx'
import Boton from '../../../core/ui/Button/Button.jsx'
import ModalBase from '../../../core/ui/Modal/Modal.jsx'
import usarEstadoAlmacenado from '../../../core/utils/useStoredState.js'
import { reviewersRepository as repositorioRevisores } from '../../../core/utils/repositories.js'
import { revisoresIniciales } from '../../../core/utils/states/worksAssignmentState.js'
import estilos from './ReviewersListPage.module.css'

const usuarioComite = {
  nombre: 'Dra. Ana Salazar Bermúdez',
  rol: 'Rol: Comité organizador',
  iniciales: 'AS',
}

export default function PaginaListaRevisores() {
  const estadoRevisores = usarEstadoAlmacenado(repositorioRevisores, revisoresIniciales)
  const conference = useConference()
  const pending = getPendingReviews(conference.works, conference.reviewers, conference.reviews)
  const listaRevisores = estadoRevisores.value.map(reviewer => {
    const works = conference.works.filter(work => work.revisoresAsignados.includes(reviewer.id))
    return { ...reviewer, asignadas: works.length, entregadas: works.filter(work => getReview(conference.reviews, reviewer, work.codigo)?.status === 'submitted').length, vencidas: pending.filter(item => item.revisorId === reviewer.id && item.esVencida).length }
  })
  const ocupado = estadoRevisores.loading || estadoRevisores.saving
  const errorAlmacenamiento = estadoRevisores.error

  const [lineaSeleccionada, cambiarLineaSeleccionada] = usarEstado('todas')
  const [institucionSeleccionada, cambiarInstitucionSeleccionada] = usarEstado('todas')
  const [soloVencidas, cambiarSoloVencidas] = usarEstado(false)
  const [textoBusqueda, cambiarTextoBusqueda] = usarEstado('')
  const [paginaActual, cambiarPaginaActual] = usarEstado(1)
  const elementosPorPagina = 8

  const [modalInvitarAbierto, cambiarModalInvitarAbierto] = usarEstado(false)
  const [formularioInvitacion, cambiarFormularioInvitacion] = usarEstado({
    nombre: '',
    correo: '',
    institucion: 'Universidad de Lima',
    lineasInteres: '',
  })
  const [mensajeExito, cambiarMensajeExito] = usarEstado('')

  const totalAsignadas = listaRevisores.reduce((suma, revisor) => suma + revisor.asignadas, 0)
  const totalVencidas = listaRevisores.reduce((suma, revisor) => suma + revisor.vencidas, 0)
  const cantidadConVencidas = listaRevisores.filter((revisor) => revisor.vencidas > 0).length

  const revisoresFiltrados = usarMemo(() => {
    return listaRevisores.filter((revisor) => {
      if (soloVencidas && revisor.vencidas === 0) return false
      if (
        lineaSeleccionada !== 'todas' &&
        !revisor.lineasInteres.includes(lineaSeleccionada)
      ) {
        return false
      }
      if (
        institucionSeleccionada !== 'todas' &&
        revisor.institucion !== institucionSeleccionada
      ) {
        return false
      }
      if (textoBusqueda.trim()) {
        const consulta = textoBusqueda.toLowerCase()
        const coincideNombre = revisor.nombre.toLowerCase().includes(consulta)
        const coincideInstitucion = revisor.institucion.toLowerCase().includes(consulta)
        const coincideLinea = revisor.lineasInteres.some((linea) =>
          linea.toLowerCase().includes(consulta)
        )
        if (!coincideNombre && !coincideInstitucion && !coincideLinea) return false
      }
      return true
    })
  }, [
    listaRevisores,
    soloVencidas,
    lineaSeleccionada,
    institucionSeleccionada,
    textoBusqueda,
  ])

  const totalPaginas = Math.max(1, Math.ceil(revisoresFiltrados.length / elementosPorPagina))
  const revisoresPaginados = revisoresFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  )

  const manejarEnvioInvitacion = async (evento) => {
    evento.preventDefault()
    if (ocupado || errorAlmacenamiento) return
    if (!formularioInvitacion.nombre.trim() || !formularioInvitacion.correo.trim()) return

    const nuevoRevisor = {
      id: `rev-${Date.now()}`,
      email: formularioInvitacion.correo.trim().toLowerCase(),
      userId: `participant:${formularioInvitacion.correo.trim().toLowerCase()}`,
      nombre: formularioInvitacion.nombre.trim(),
      institucion: formularioInvitacion.institucion,
      lineasInteres: formularioInvitacion.lineasInteres
        .split(',')
        .map((elemento) => elemento.trim())
        .filter(Boolean),
      asignadas: 0,
      entregadas: 0,
      vencidas: 0,
    }

    const actualizados = [...listaRevisores, nuevoRevisor]
    const guardado = await estadoRevisores.save(actualizados).catch(() => false)
    if (!guardado) return

    cambiarModalInvitarAbierto(false)
    cambiarFormularioInvitacion({
      nombre: '',
      correo: '',
      institucion: 'Universidad de Lima',
      lineasInteres: '',
    })
    cambiarMensajeExito(`Invitación registrada para ${nuevoRevisor.nombre}.`)
    setTimeout(() => cambiarMensajeExito(''), 5000)
  }

  return (
    <div className={estilos.pagina}>
      <Encabezado estado="En revisión" />
      <NavegacionComite rutaActiva="/revisores" usuario={usuarioComite} />

      <main className={estilos.contenidoPrincipal}>
        {errorAlmacenamiento ? <p role="alert">{errorAlmacenamiento}</p> : null}

        <fieldset
          className={estilos.grupoCampos}
          disabled={ocupado || Boolean(errorAlmacenamiento)}
        >
          <div className={estilos.filaEncabezado}>
            <div>
              <h1 className={estilos.titulo}>Revisores</h1>
              <p className={estilos.subtitulo}>
                {listaRevisores.length} revisores registrados · {totalAsignadas} revisiones asignadas · {totalVencidas} vencidas
              </p>
            </div>
            <div>
              <Boton
                variant="secondary"
                type="button"
                onClick={() => cambiarModalInvitarAbierto(true)}
              >
                Invitar revisor
              </Boton>
            </div>
          </div>

          {mensajeExito ? (
            <div className={estilos.notificacionExito}>
              <span>✓ {mensajeExito}</span>
            </div>
          ) : null}

          <div className={estilos.barraFiltros}>
            <div className={estilos.controlesFiltro}>
              <select
                aria-label="Filtrar por línea de interés"
                className={estilos.selectorFiltro}
                value={lineaSeleccionada}
                onChange={(evento) => {
                  cambiarLineaSeleccionada(evento.target.value)
                  cambiarPaginaActual(1)
                }}
              >
                <option value="todas">Línea: todas</option>
                <option value="Ingeniería de software">Línea: Ingeniería de software</option>
                <option value="IA y datos">Línea: IA y datos</option>
                <option value="Sostenibilidad y ciudad">Línea: Sostenibilidad y ciudad</option>
                <option value="Innovación">Línea: Innovación</option>
                <option value="Innovación y emprendimiento">
                  Línea: Innovación y emprendimiento
                </option>
                <option value="Salud y sociedad">Línea: Salud y sociedad</option>
                <option value="Economía y mercados">Línea: Economía y mercados</option>
              </select>

              <select
                aria-label="Filtrar por institución"
                className={estilos.selectorFiltro}
                value={institucionSeleccionada}
                onChange={(evento) => {
                  cambiarInstitucionSeleccionada(evento.target.value)
                  cambiarPaginaActual(1)
                }}
              >
                <option value="todas">Institución: todas</option>
                <option value="Universidad de Lima">Institución: Universidad de Lima</option>
                <option value="Pontificia Universidad Católica">
                  Institución: Pontificia Universidad Católica
                </option>
                <option value="Universidad del Pacífico">
                  Institución: Universidad del Pacífico
                </option>
                <option value="Universidad Nacional de Ingeniería">
                  Institución: Universidad Nacional de Ingeniería
                </option>
                <option value="Universidad Nacional Mayor de San Marcos">
                  Institución: Universidad Nacional Mayor de San Marcos
                </option>
              </select>

              <button
                type="button"
                className={`${estilos.botonFiltroVencidas} ${
                  soloVencidas ? estilos.filtroVencidasActivo : ''
                }`}
                onClick={() => {
                  cambiarSoloVencidas(!soloVencidas)
                  cambiarPaginaActual(1)
                }}
              >
                Con revisiones vencidas · {cantidadConVencidas}
              </button>
            </div>

            <div className={estilos.contenedorBusqueda}>
              <input
                type="text"
                placeholder="Buscar revisor..."
                aria-label="Buscar revisor"
                className={estilos.campoBusqueda}
                value={textoBusqueda}
                onChange={(evento) => {
                  cambiarTextoBusqueda(evento.target.value)
                  cambiarPaginaActual(1)
                }}
              />
            </div>
          </div>

          <div className={estilos.contenedorTabla}>
            <table className={estilos.tablaRevisores}>
              <thead>
                <tr>
                  <th>REVISOR</th>
                  <th>INSTITUCIÓN</th>
                  <th>LÍNEAS DE INTERÉS</th>
                  <th className={estilos.columnaDerecha}>ASIGNADAS</th>
                  <th className={estilos.columnaDerecha}>ENTREGADAS</th>
                  <th className={estilos.columnaDerecha}>VENCIDAS</th>
                </tr>
              </thead>
              <tbody>
                {revisoresPaginados.map((revisor) => (
                  <tr key={revisor.id}>
                    <td className={estilos.celdaNombre}>
                      <strong>{revisor.nombre}</strong>
                    </td>
                    <td className={estilos.celdaInstitucion}>{revisor.institucion}</td>
                    <td className={estilos.celdaLineas}>
                      {revisor.lineasInteres.join(' · ')}
                    </td>
                    <td className={estilos.celdaNumero}>{revisor.asignadas}</td>
                    <td className={estilos.celdaEntregadas}>{revisor.entregadas}</td>
                    <td className={estilos.celdaVencidas}>
                      {revisor.vencidas > 0 ? (
                        <span className={estilos.valorVencidasAlerta}>{revisor.vencidas}</span>
                      ) : (
                        <span className={estilos.valorCero}>0</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={estilos.filaPaginacion}>
            <span className={estilos.infoPaginacion}>
              Mostrando{' '}
              {revisoresFiltrados.length === 0
                ? 0
                : (paginaActual - 1) * elementosPorPagina + 1}
              –{Math.min(paginaActual * elementosPorPagina, revisoresFiltrados.length)} de{' '}
              {revisoresFiltrados.length} revisores
            </span>
            <div className={estilos.botonesPaginacion}>
              <button
                type="button"
                className={estilos.botonPagina}
                disabled={paginaActual === 1}
                onClick={() => cambiarPaginaActual((pagina) => pagina - 1)}
              >
                Anterior
              </button>
              {Array.from({ length: totalPaginas }, (_, indice) => indice + 1).map(
                (numeroPagina) => (
                  <button
                    key={numeroPagina}
                    type="button"
                    className={`${estilos.botonNumeroPagina} ${
                      paginaActual === numeroPagina ? estilos.paginaActiva : ''
                    }`}
                    onClick={() => cambiarPaginaActual(numeroPagina)}
                  >
                    {numeroPagina}
                  </button>
                )
              )}
              <button
                type="button"
                className={estilos.botonPagina}
                disabled={paginaActual === totalPaginas}
                onClick={() => cambiarPaginaActual((pagina) => pagina + 1)}
              >
                Siguiente
              </button>
            </div>
          </div>
        </fieldset>
      </main>

      <PiePagina />

      {modalInvitarAbierto ? (
        <ModalBase
          alCerrar={() => {
            if (!ocupado) cambiarModalInvitarAbierto(false)
          }}
          titulo="Invitar revisor al congreso"
        >
          <form onSubmit={manejarEnvioInvitacion} className={estilos.formularioInvitacion}>
            {errorAlmacenamiento ? <p role="alert">{errorAlmacenamiento}</p> : null}
            <fieldset className={estilos.grupoCampos} disabled={ocupado}>
              <label className={estilos.etiquetaModal}>
                NOMBRES Y APELLIDOS *
                <input
                  type="text"
                  required
                  className={estilos.campoModal}
                  value={formularioInvitacion.nombre}
                  placeholder="Ej. Dr. Mario Vargas Llosa"
                  onChange={(evento) =>
                    cambiarFormularioInvitacion({
                      ...formularioInvitacion,
                      nombre: evento.target.value,
                    })
                  }
                />
              </label>

              <label className={estilos.etiquetaModal}>
                CORREO ELECTRÓNICO *
                <input
                  type="email"
                  required
                  className={estilos.campoModal}
                  value={formularioInvitacion.correo}
                  placeholder="revisor@universidad.edu.pe"
                  onChange={(evento) =>
                    cambiarFormularioInvitacion({
                      ...formularioInvitacion,
                      correo: evento.target.value,
                    })
                  }
                />
              </label>

              <label className={estilos.etiquetaModal}>
                INSTITUCIÓN *
                <input
                  type="text"
                  required
                  className={estilos.campoModal}
                  value={formularioInvitacion.institucion}
                  onChange={(evento) =>
                    cambiarFormularioInvitacion({
                      ...formularioInvitacion,
                      institucion: evento.target.value,
                    })
                  }
                />
              </label>

              <label className={estilos.etiquetaModal}>
                LÍNEAS DE INTERÉS (SEPARADAS POR COMA)
                <input
                  type="text"
                  className={estilos.campoModal}
                  value={formularioInvitacion.lineasInteres}
                  placeholder="Ingeniería de software, IA y datos"
                  onChange={(evento) =>
                    cambiarFormularioInvitacion({
                      ...formularioInvitacion,
                      lineasInteres: evento.target.value,
                    })
                  }
                />
              </label>

              <div className={estilos.accionesModal}>
                <Boton
                  variant="secondary"
                  type="button"
                  onClick={() => cambiarModalInvitarAbierto(false)}
                >
                  Cancelar
                </Boton>
                <Boton variant="primary" type="submit">
                  Enviar invitación
                </Boton>
              </div>
            </fieldset>
          </form>
        </ModalBase>
      ) : null}
    </div>
  )
}
