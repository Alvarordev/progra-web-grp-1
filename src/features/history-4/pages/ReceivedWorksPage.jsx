import { useState as usarEstado, useMemo as usarMemo } from 'react'
import {
  Link as Enlace,
  useNavigate as usarNavegacion,
  useSearchParams as usarParametrosBusqueda,
} from 'react-router'
import Encabezado from '../../../core/ui/Header/Header.jsx'
import NavegacionComite from '../../../core/ui/CommitteeNavigation/CommitteeNavigation.jsx'
import PiePagina from '../../../core/ui/Footer/Footer.jsx'
import Boton from '../../../core/ui/Button/Button.jsx'
import EstadoVacio from '../../../core/ui/EmptyState/EmptyState.jsx'
import ModalAsignarRevisores from '../components/AssignReviewersModal/AssignReviewersModal.jsx'
import usarEstadoAlmacenado from '../../../core/utils/useStoredState.js'
import {
  worksRepository as repositorioTrabajos,
  reviewersRepository as repositorioRevisores,
} from '../../../core/utils/repositories.js'
import {
  trabajosIniciales,
  revisoresIniciales,
} from '../../../core/utils/states/worksAssignmentState.js'
import { assignmentsByWork as asignacionesPorTrabajo } from '../../history-5/data/assignmentsByWork.js'
import estilos from './ReceivedWorksPage.module.css'

const usuarioComite = {
  iniciales: 'AS',
  nombre: 'Dra. Ana Salazar Bermúdez',
  rol: 'Rol: Comité organizador',
}

export default function PaginaTrabajosRecibidos() {
  const navegar = usarNavegacion()
  const [parametrosBusqueda] = usarParametrosBusqueda()
  const estadoTrabajos = usarEstadoAlmacenado(repositorioTrabajos, trabajosIniciales)
  const estadoRevisores = usarEstadoAlmacenado(repositorioRevisores, revisoresIniciales)
  const trabajos = estadoTrabajos.value
  const revisores = estadoRevisores.value

  const ocupado = estadoTrabajos.saving || estadoRevisores.saving
  const errorAlmacenamiento = estadoTrabajos.error || estadoRevisores.error

  const [vistaVaciaActiva, cambiarVistaVaciaActiva] = usarEstado(
    () => parametrosBusqueda.get('vacio') === '1'
  )
  const [ejeSeleccionado, cambiarEjeSeleccionado] = usarEstado('Ingeniería de software')
  const [estadoSeleccionado, cambiarEstadoSeleccionado] = usarEstado('Enviado')
  const [tipoSeleccionado, cambiarTipoSeleccionado] = usarEstado('todos')
  const [consultaBusqueda, cambiarConsultaBusqueda] = usarEstado('')
  const [filtroManualActivo, cambiarFiltroManualActivo] = usarEstado(false)

  const [codigosSeleccionados, cambiarCodigosSeleccionados] = usarEstado([
    'TRB-2026-031',
    'TRB-2026-035',
    'TRB-2026-040',
  ])
  const [paginaActual, cambiarPaginaActual] = usarEstado(1)
  const elementosPorPagina = 8

  const [modalAsignarAbierto, cambiarModalAsignarAbierto] = usarEstado(false)
  const [trabajosParaModal, cambiarTrabajosParaModal] = usarEstado([])
  const [notificacion, cambiarNotificacion] = usarEstado('')

  const trabajosSinBorrador = usarMemo(
    () => trabajos.filter((trabajo) => trabajo.estado !== 'Borrador'),
    [trabajos]
  )

  const trabajosFiltrados = usarMemo(() => {
    if (vistaVaciaActiva) {
      return []
    }
    if (!filtroManualActivo) {
      return trabajosSinBorrador
    }
    return trabajosSinBorrador.filter((trabajo) => {
      if (ejeSeleccionado !== 'todos' && trabajo.eje !== ejeSeleccionado) return false
      if (estadoSeleccionado !== 'todos' && trabajo.estado !== estadoSeleccionado) return false
      if (tipoSeleccionado !== 'todos' && trabajo.tipo !== tipoSeleccionado) return false
      if (consultaBusqueda.trim()) {
        const termino = consultaBusqueda.toLowerCase().trim()
        const coincideCodigo = trabajo.codigo.toLowerCase().includes(termino)
        const coincideTitulo = trabajo.titulo.toLowerCase().includes(termino)
        const coincideAutor = trabajo.autores?.some((autor) =>
          autor.toLowerCase().includes(termino)
        )
        if (!coincideCodigo && !coincideTitulo && !coincideAutor) return false
      }
      return true
    })
  }, [
    vistaVaciaActiva,
    trabajosSinBorrador,
    filtroManualActivo,
    ejeSeleccionado,
    estadoSeleccionado,
    tipoSeleccionado,
    consultaBusqueda,
  ])

  const totalPaginas = !filtroManualActivo
    ? 2
    : Math.max(1, Math.ceil(trabajosFiltrados.length / elementosPorPagina))

  const trabajosPaginados = trabajosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  )

  const seleccionarTodosPagina = (evento) => {
    if (evento.target.checked) {
      const codigosPagina = trabajosPaginados.map((trabajo) => trabajo.codigo)
      cambiarCodigosSeleccionados(
        Array.from(new Set([...codigosSeleccionados, ...codigosPagina]))
      )
    } else {
      const conjuntoPagina = new Set(trabajosPaginados.map((trabajo) => trabajo.codigo))
      cambiarCodigosSeleccionados(
        codigosSeleccionados.filter((codigo) => !conjuntoPagina.has(codigo))
      )
    }
  }

  const alternarSeleccionTrabajo = (codigo) => {
    if (codigosSeleccionados.includes(codigo)) {
      cambiarCodigosSeleccionados(
        codigosSeleccionados.filter((codigoActual) => codigoActual !== codigo)
      )
    } else {
      cambiarCodigosSeleccionados([...codigosSeleccionados, codigo])
    }
  }

  const abrirAsignacionLote = () => {
    const seleccionados = trabajos.filter((trabajo) =>
      codigosSeleccionados.includes(trabajo.codigo)
    )
    if (seleccionados.length === 0) return
    cambiarTrabajosParaModal(seleccionados)
    cambiarModalAsignarAbierto(true)
  }

  const abrirAsignacionIndividual = (trabajo) => {
    cambiarTrabajosParaModal([trabajo])
    cambiarModalAsignarAbierto(true)
  }

  const confirmarAsignacion = async ({ codigosTrabajo, idsRevisores, fechaLimite }) => {
    if (ocupado || errorAlmacenamiento) return false
    const trabajosActualizados = trabajos.map((trabajo) => {
      if (codigosTrabajo.includes(trabajo.codigo)) {
        const entregadasPrevias = trabajo.entregadas || 0
        return {
          ...trabajo,
          estado: 'En revisión',
          revisoresAsignados: idsRevisores,
          revisores: `${idsRevisores.length} asignados · ${entregadasPrevias} entregadas`,
          fechaLimite,
        }
      }
      return trabajo
    })

    const revisoresActualizados = revisores.map((revisor) => {
      if (idsRevisores.includes(revisor.id)) {
        return {
          ...revisor,
          asignadas: revisor.asignadas + codigosTrabajo.length,
        }
      }
      return revisor
    })

    if (!(await estadoTrabajos.save(trabajosActualizados).catch(() => false))) return false
    if (!(await estadoRevisores.save(revisoresActualizados).catch(() => false))) return false

    cambiarNotificacion(`Revisores asignados correctamente a ${codigosTrabajo.length} trabajo(s).`)
    setTimeout(() => cambiarNotificacion(''), 4000)
    return true
  }

  const limpiarFiltros = () => {
    cambiarVistaVaciaActiva(false)
    cambiarFiltroManualActivo(true)
    cambiarEjeSeleccionado('todos')
    cambiarEstadoSeleccionado('todos')
    cambiarTipoSeleccionado('todos')
    cambiarConsultaBusqueda('')
    cambiarPaginaActual(1)
  }

  const quitarFiltroEje = () => {
    cambiarFiltroManualActivo(true)
    cambiarEjeSeleccionado('todos')
    if (estadoSeleccionado === 'Enviado' && !filtroManualActivo) {
      cambiarEstadoSeleccionado('todos')
    }
    cambiarPaginaActual(1)
  }

  const quitarFiltroEstado = () => {
    cambiarFiltroManualActivo(true)
    cambiarEstadoSeleccionado('todos')
    if (ejeSeleccionado === 'Ingeniería de software' && !filtroManualActivo) {
      cambiarEjeSeleccionado('todos')
    }
    cambiarPaginaActual(1)
  }

  const alternarVistaVacia = () => {
    if (!vistaVaciaActiva) {
      cambiarVistaVaciaActiva(true)
      cambiarEjeSeleccionado('todos')
      cambiarEstadoSeleccionado('todos')
      cambiarTipoSeleccionado('todos')
      cambiarConsultaBusqueda('')
    } else {
      cambiarVistaVaciaActiva(false)
      cambiarFiltroManualActivo(false)
      cambiarEjeSeleccionado('Ingeniería de software')
      cambiarEstadoSeleccionado('Enviado')
      cambiarTipoSeleccionado('todos')
      cambiarConsultaBusqueda('')
    }
  }

  const todosMarcadosEnPagina =
    trabajosPaginados.length > 0 &&
    trabajosPaginados.every((trabajo) => codigosSeleccionados.includes(trabajo.codigo))

  const sinTrabajos = trabajosFiltrados.length === 0
  const tieneFiltrosActivos =
    ejeSeleccionado !== 'todos' ||
    estadoSeleccionado !== 'todos' ||
    tipoSeleccionado !== 'todos' ||
    Boolean(consultaBusqueda.trim())

  const obtenerTextoRevisores = (trabajo) => {
    if (trabajo.revisores && trabajo.revisores !== 'Sin asignar') {
      return trabajo.revisores
    }
    if (trabajo.revisoresAsignados && trabajo.revisoresAsignados.length > 0) {
      const cantidadEntregadas = trabajo.entregadas || 0
      const palabraEntregada = cantidadEntregadas === 1 ? 'entregada' : 'entregadas'
      return `${trabajo.revisoresAsignados.length} asignados · ${cantidadEntregadas} ${palabraEntregada}`
    }
    return null
  }

  return (
    <div className={estilos.pagina}>
      <Encabezado estado={sinTrabajos ? 'Recepción abierta' : 'En revisión'} />
      <NavegacionComite rutaActiva="/trabajos-recibidos" usuario={usuarioComite} />

      <main className={estilos.principal}>
        <fieldset
          className={estilos.contenedorCampos}
          disabled={ocupado || Boolean(errorAlmacenamiento)}
        >
          <div className={estilos.contenido}>
            {errorAlmacenamiento && (
              <p className={estilos.alertaError} role="alert">
                {errorAlmacenamiento}
              </p>
            )}

            <header className={estilos.encabezadoPagina}>
              <div>
                <h1 className={estilos.titulo}>Trabajos recibidos</h1>
                <p className={estilos.subtitulo} onClick={alternarVistaVacia}>
                  {sinTrabajos
                    ? 'Sin trabajos enviados por el momento'
                    : '14 trabajos · 12 enviados · 2 borradores fuera de proceso'}
                </p>
              </div>
              {!sinTrabajos && (
                <div className={estilos.accionesSuperiores}>
                  <Boton variant="secondary" type="button">
                    Exportar listado
                  </Boton>
                  <Boton
                    variant="primary"
                    type="button"
                    disabled={codigosSeleccionados.length === 0}
                    onClick={abrirAsignacionLote}
                  >
                    Asignar revisores ({codigosSeleccionados.length} seleccionados)
                  </Boton>
                </div>
              )}
            </header>

            {notificacion && (
              <div className={estilos.avisoExito} role="status">
                <span>✓ {notificacion}</span>
              </div>
            )}

            {!sinTrabajos && (
              <section aria-label="Resumen de trabajos" className={estilos.rejillaMetricas}>
                <div className={`${estilos.tarjetaMetrica} ${estilos.bordeAzul}`}>
                  <span className={estilos.etiquetaMetrica}>ENVIADOS</span>
                  <span className={estilos.valorMetrica}>12</span>
                </div>
                <div className={`${estilos.tarjetaMetrica} ${estilos.bordeAmbar}`}>
                  <span className={estilos.etiquetaMetrica}>EN REVISIÓN</span>
                  <span className={estilos.valorMetrica}>7</span>
                </div>
                <div className={`${estilos.tarjetaMetrica} ${estilos.bordeRojo}`}>
                  <span className={estilos.etiquetaMetrica}>SIN REVISORES</span>
                  <span className={estilos.valorMetrica}>3</span>
                </div>
                <div className={`${estilos.tarjetaMetrica} ${estilos.bordeVerde}`}>
                  <span className={estilos.etiquetaMetrica}>CON DECISIÓN</span>
                  <span className={estilos.valorMetrica}>2</span>
                </div>
              </section>
            )}

            <section aria-label="Filtros de trabajos" className={estilos.seccionFiltros}>
              <div className={estilos.filaControlesFiltro}>
                <div className={estilos.grupoSelectores}>
                  <select
                    aria-label="Filtrar por eje temático"
                    className={estilos.selectorFiltro}
                    value={ejeSeleccionado}
                    onChange={(evento) => {
                      cambiarVistaVaciaActiva(false)
                      cambiarFiltroManualActivo(true)
                      cambiarEjeSeleccionado(evento.target.value)
                      cambiarPaginaActual(1)
                    }}
                  >
                    <option value="todos">Eje: todos</option>
                    <option value="Ingeniería de software">Eje: Ingeniería de software</option>
                    <option value="Inteligencia artificial y datos">
                      Eje: Inteligencia artificial y datos
                    </option>
                    <option value="Sostenibilidad y ciudad">Eje: Sostenibilidad y ciudad</option>
                    <option value="Innovación y emprendimiento">
                      Eje: Innovación y emprendimiento
                    </option>
                    <option value="Salud y sociedad">Eje: Salud y sociedad</option>
                    <option value="Economía y mercados">Eje: Economía y mercados</option>
                  </select>

                  <select
                    aria-label="Filtrar por estado"
                    className={estilos.selectorFiltro}
                    value={estadoSeleccionado}
                    onChange={(evento) => {
                      cambiarVistaVaciaActiva(false)
                      cambiarFiltroManualActivo(true)
                      cambiarEstadoSeleccionado(evento.target.value)
                      cambiarPaginaActual(1)
                    }}
                  >
                    <option value="todos">Estado: todos</option>
                    <option value="Enviado">Estado: Enviado</option>
                    <option value="En revisión">Estado: En revisión</option>
                    <option value="Aceptado">Estado: Aceptado</option>
                    <option value="Rechazado">Estado: Rechazado</option>
                  </select>

                  {!sinTrabajos && (
                    <select
                      aria-label="Filtrar por tipo de trabajo"
                      className={estilos.selectorFiltro}
                      value={tipoSeleccionado}
                      onChange={(evento) => {
                        cambiarVistaVaciaActiva(false)
                        cambiarFiltroManualActivo(true)
                        cambiarTipoSeleccionado(evento.target.value)
                        cambiarPaginaActual(1)
                      }}
                    >
                      <option value="todos">Tipo: todos</option>
                      <option value="Artículo completo">Tipo: Artículo completo</option>
                      <option value="Resumen extendido">Tipo: Resumen extendido</option>
                      <option value="Póster">Tipo: Póster</option>
                      <option value="Caso de estudio">Tipo: Caso de estudio</option>
                    </select>
                  )}
                </div>

                <div className={estilos.contenedorBuscador}>
                  <input
                    type="text"
                    placeholder="Buscar por código, título o autor…"
                    className={estilos.campoBuscador}
                    value={consultaBusqueda}
                    onChange={(evento) => {
                      cambiarVistaVaciaActiva(false)
                      cambiarFiltroManualActivo(true)
                      cambiarConsultaBusqueda(evento.target.value)
                      cambiarPaginaActual(1)
                    }}
                  />
                </div>
              </div>

              {!sinTrabajos && tieneFiltrosActivos && (
                <div className={estilos.filaFiltrosActivos}>
                  <span className={estilos.etiquetaFiltrosActivos}>Filtros activos:</span>
                  {ejeSeleccionado !== 'todos' && (
                    <span className={estilos.etiquetaFiltro}>
                      Eje: {ejeSeleccionado}
                      <button
                        type="button"
                        onClick={quitarFiltroEje}
                        aria-label="Quitar filtro de eje"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                  {estadoSeleccionado !== 'todos' && (
                    <span className={estilos.etiquetaFiltro}>
                      Estado: {estadoSeleccionado}
                      <button
                        type="button"
                        onClick={quitarFiltroEstado}
                        aria-label="Quitar filtro de estado"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                  {tipoSeleccionado !== 'todos' && (
                    <span className={estilos.etiquetaFiltro}>
                      Tipo: {tipoSeleccionado}
                      <button
                        type="button"
                        onClick={() => {
                          cambiarFiltroManualActivo(true)
                          cambiarTipoSeleccionado('todos')
                          cambiarPaginaActual(1)
                        }}
                        aria-label="Quitar filtro de tipo"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                  {consultaBusqueda.trim() && (
                    <span className={estilos.etiquetaFiltro}>
                      Búsqueda: {consultaBusqueda}
                      <button
                        type="button"
                        onClick={() => {
                          cambiarFiltroManualActivo(true)
                          cambiarConsultaBusqueda('')
                          cambiarPaginaActual(1)
                        }}
                        aria-label="Quitar filtro de búsqueda"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                  <button
                    type="button"
                    className={estilos.botonLimpiar}
                    onClick={limpiarFiltros}
                  >
                    Limpiar todo
                  </button>
                </div>
              )}
            </section>

            {sinTrabajos ? (
              <div className={estilos.contenedorVacio}>
                <EstadoVacio
                  icono="▤"
                  titulo="Todavía no hay trabajos enviados"
                  descripcion="La recepción está abierta hasta el 30/09/2026. Cuando los autores envíen sus trabajos aparecerán aquí para asignar revisores."
                  accion={
                    <Boton
                      variant="secondary"
                      type="button"
                      onClick={() => navegar('/configuracion')}
                    >
                      Revisar la configuración de la edición
                    </Boton>
                  }
                />
              </div>
            ) : (
              <div className={estilos.tarjetaTabla}>
                <div className={estilos.marcoTabla}>
                  <table className={estilos.tablaTrabajos}>
                    <thead>
                      <tr>
                        <th style={{ width: 42 }}>
                          <input
                            type="checkbox"
                            className={estilos.casilla}
                            checked={todosMarcadosEnPagina}
                            onChange={seleccionarTodosPagina}
                            aria-label="Seleccionar todos los trabajos visibles"
                          />
                        </th>
                        <th style={{ width: 128 }}>CÓDIGO</th>
                        <th>TÍTULO</th>
                        <th style={{ width: 190 }}>EJE</th>
                        <th style={{ width: 155 }}>TIPO</th>
                        <th style={{ width: 150 }}>REVISORES</th>
                        <th style={{ width: 115 }}>ESTADO</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trabajosPaginados.map((trabajo) => {
                        const tieneConsolidado = Object.hasOwn(
                          asignacionesPorTrabajo,
                          trabajo.codigo
                        )
                        const rutaConsolidado = `/trabajos-recibidos/${encodeURIComponent(
                          trabajo.codigo
                        )}/consolidado`
                        const estaSeleccionado = codigosSeleccionados.includes(trabajo.codigo)
                        const textoRevisores = obtenerTextoRevisores(trabajo)

                        return (
                          <tr
                            key={trabajo.codigo}
                            className={estaSeleccionado ? estilos.filaSeleccionada : ''}
                          >
                            <td>
                              <input
                                type="checkbox"
                                className={estilos.casilla}
                                checked={estaSeleccionado}
                                onChange={() => alternarSeleccionTrabajo(trabajo.codigo)}
                                aria-label={`Seleccionar ${trabajo.codigo}`}
                              />
                            </td>
                            <td className={estilos.celdaCodigo}>{trabajo.codigo}</td>
                            <td className={estilos.celdaTitulo}>
                              {tieneConsolidado ? (
                                <Enlace className={estilos.enlaceTitulo} to={rutaConsolidado}>
                                  {trabajo.titulo}
                                </Enlace>
                              ) : (
                                <span>{trabajo.titulo}</span>
                              )}
                            </td>
                            <td className={estilos.celdaSecundaria}>{trabajo.eje}</td>
                            <td className={estilos.celdaSecundaria}>{trabajo.tipo}</td>
                            <td>
                              <button
                                type="button"
                                className={
                                  textoRevisores
                                    ? estilos.botonCeldaAsignados
                                    : estilos.botonCeldaSinAsignar
                                }
                                onClick={() => abrirAsignacionIndividual(trabajo)}
                              >
                                {textoRevisores || 'Sin asignar'}
                              </button>
                            </td>
                            <td>
                              <span
                                className={`${estilos.insigniaEstado} ${
                                  estilos['estado_' + trabajo.estado.replace(/\s+/g, '')]
                                }`}
                              >
                                {trabajo.estado}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <div className={estilos.filaPaginacion}>
                  <span className={estilos.infoPaginacion}>
                    Mostrando {(paginaActual - 1) * elementosPorPagina + 1}–
                    {!filtroManualActivo && paginaActual === 1
                      ? 8
                      : Math.min(
                          paginaActual * elementosPorPagina,
                          trabajosFiltrados.length
                        )}{' '}
                    de {!filtroManualActivo ? 14 : trabajosFiltrados.length} trabajos
                    {codigosSeleccionados.length > 0 &&
                      ` · ${codigosSeleccionados.length} seleccionados`}
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
                      (numero) => (
                        <button
                          key={numero}
                          type="button"
                          className={`${estilos.botonNumeroPagina} ${
                            paginaActual === numero ? estilos.paginaActiva : ''
                          }`}
                          onClick={() => cambiarPaginaActual(numero)}
                        >
                          {numero}
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
              </div>
            )}
          </div>
        </fieldset>
      </main>

      <PiePagina />

      <ModalAsignarRevisores
        key={trabajosParaModal.map((trabajo) => trabajo.codigo).join(',')}
        guardando={ocupado}
        error={errorAlmacenamiento}
        abierto={modalAsignarAbierto}
        alCerrar={() => cambiarModalAsignarAbierto(false)}
        trabajosObjetivo={trabajosParaModal}
        revisores={revisores}
        alConfirmarAsignacion={confirmarAsignacion}
      />
    </div>
  )
}
