import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router'
import Header from '../../../core/ui/Header/Header.jsx'
import CommitteeNavigation from '../../../core/ui/CommitteeNavigation/CommitteeNavigation.jsx'
import Footer from '../../../core/ui/Footer/Footer.jsx'
import Button from '../../../core/ui/Button/Button.jsx'
import EmptyState from '../../../core/ui/EmptyState/EmptyState.jsx'
import AssignReviewersModal from '../components/AssignReviewersModal/AssignReviewersModal.jsx'
import useStoredState from '../../../core/utils/useStoredState.js'
import { worksRepository, reviewersRepository } from '../../../core/utils/repositories.js'
import { initialWorks, initialReviewers } from '../../../core/utils/states/worksAssignmentState.js'
import { assignmentsByWork } from '../../history-5/data/assignmentsByWork.js'
import styles from './ReceivedWorksPage.module.css'

const usuarioComite = {
  iniciales: 'AS',
  nombre: 'Dra. Ana Salazar Bermúdez',
  rol: 'Rol: Comité organizador',
}

export default function ReceivedWorksPage() {
  const navegar = useNavigate()
  const estadoTrabajos = useStoredState(worksRepository, initialWorks)
  const estadoRevisores = useStoredState(reviewersRepository, initialReviewers)
  const trabajos = estadoTrabajos.value
  const revisores = estadoRevisores.value

  const ocupado = estadoTrabajos.saving || estadoRevisores.saving
  const errorAlmacenamiento = estadoTrabajos.error || estadoRevisores.error

  const [ejeSeleccionado, setEjeSeleccionado] = useState('Ingeniería de software')
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('Enviado')
  const [tipoSeleccionado, setTipoSeleccionado] = useState('todos')
  const [consultaBusqueda, setConsultaBusqueda] = useState('')
  const [filtroManualActivo, setFiltroManualActivo] = useState(false)

  const [codigosSeleccionados, setCodigosSeleccionados] = useState([
    'TRB-2026-031',
    'TRB-2026-035',
    'TRB-2026-040',
  ])
  const [paginaActual, setPaginaActual] = useState(1)
  const elementosPorPagina = 8

  const [modalAsignarAbierto, setModalAsignarAbierto] = useState(false)
  const [trabajosParaModal, setTrabajosParaModal] = useState([])
  const [notificacion, setNotificacion] = useState('')

  const trabajosSinBorrador = useMemo(
    () => trabajos.filter((t) => t.estado !== 'Borrador'),
    [trabajos]
  )

  const trabajosFiltrados = useMemo(() => {
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

  const seleccionarTodosPagina = (e) => {
    if (e.target.checked) {
      const codigosPagina = trabajosPaginados.map((t) => t.codigo)
      setCodigosSeleccionados(Array.from(new Set([...codigosSeleccionados, ...codigosPagina])))
    } else {
      const conjuntoPagina = new Set(trabajosPaginados.map((t) => t.codigo))
      setCodigosSeleccionados(codigosSeleccionados.filter((c) => !conjuntoPagina.has(c)))
    }
  }

  const alternarSeleccionTrabajo = (codigo) => {
    if (codigosSeleccionados.includes(codigo)) {
      setCodigosSeleccionados(codigosSeleccionados.filter((c) => c !== codigo))
    } else {
      setCodigosSeleccionados([...codigosSeleccionados, codigo])
    }
  }

  const abrirAsignacionLote = () => {
    const seleccionados = trabajos.filter((t) => codigosSeleccionados.includes(t.codigo))
    if (seleccionados.length === 0) return
    setTrabajosParaModal(seleccionados)
    setModalAsignarAbierto(true)
  }

  const abrirAsignacionIndividual = (trabajo) => {
    setTrabajosParaModal([trabajo])
    setModalAsignarAbierto(true)
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

    if (!await estadoTrabajos.save(trabajosActualizados).catch(() => false)) return false
    if (!await estadoRevisores.save(revisoresActualizados).catch(() => false)) return false

    setNotificacion(`Revisores asignados correctamente a ${codigosTrabajo.length} trabajo(s).`)
    setTimeout(() => setNotificacion(''), 4000)
    return true
  }

  const limpiarFiltros = () => {
    setFiltroManualActivo(true)
    setEjeSeleccionado('todos')
    setEstadoSeleccionado('todos')
    setTipoSeleccionado('todos')
    setConsultaBusqueda('')
    setPaginaActual(1)
  }

  const quitarFiltroEje = () => {
    setFiltroManualActivo(true)
    setEjeSeleccionado('todos')
    if (estadoSeleccionado === 'Enviado' && !filtroManualActivo) {
      setEstadoSeleccionado('todos')
    }
    setPaginaActual(1)
  }

  const quitarFiltroEstado = () => {
    setFiltroManualActivo(true)
    setEstadoSeleccionado('todos')
    if (ejeSeleccionado === 'Ingeniería de software' && !filtroManualActivo) {
      setEjeSeleccionado('todos')
    }
    setPaginaActual(1)
  }

  const todosMarcadosEnPagina =
    trabajosPaginados.length > 0 &&
    trabajosPaginados.every((t) => codigosSeleccionados.includes(t.codigo))

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
      const cantEntregadas = trabajo.entregadas || 0
      const palabraEntregada = cantEntregadas === 1 ? 'entregada' : 'entregadas'
      return `${trabajo.revisoresAsignados.length} asignados · ${cantEntregadas} ${palabraEntregada}`
    }
    return null
  }

  return (
    <div className={styles.pagina}>
      <Header estado={sinTrabajos ? 'Recepción abierta' : 'En revisión'} />
      <CommitteeNavigation rutaActiva="/trabajos-recibidos" usuario={usuarioComite} />

      <main className={styles.principal}>
        <fieldset className={styles.contenedorCampos} disabled={ocupado || Boolean(errorAlmacenamiento)}>
          <div className={styles.contenido}>
            {errorAlmacenamiento && <p className={styles.alertaError} role="alert">{errorAlmacenamiento}</p>}

            <header className={styles.encabezadoPagina}>
              <div>
                <h1 className={styles.titulo}>Trabajos recibidos</h1>
                <p className={styles.subtitulo}>
                  {sinTrabajos
                    ? 'Sin trabajos enviados por el momento'
                    : '14 trabajos · 12 enviados · 2 borradores fuera de proceso'}
                </p>
              </div>
              {!sinTrabajos && (
                <div className={styles.accionesSuperiores}>
                  <Button variant="secondary" type="button">
                    Exportar listado
                  </Button>
                  <Button
                    variant="primary"
                    type="button"
                    disabled={codigosSeleccionados.length === 0}
                    onClick={abrirAsignacionLote}
                  >
                    Asignar revisores ({codigosSeleccionados.length} seleccionados)
                  </Button>
                </div>
              )}
            </header>

            {notificacion && (
              <div className={styles.avisoExito} role="status">
                <span>✓ {notificacion}</span>
              </div>
            )}

            {!sinTrabajos && (
              <section aria-label="Resumen de trabajos" className={styles.rejillaMetricas}>
                <div className={`${styles.tarjetaMetrica} ${styles.bordeAzul}`}>
                  <span className={styles.etiquetaMetrica}>ENVIADOS</span>
                  <span className={styles.valorMetrica}>12</span>
                </div>
                <div className={`${styles.tarjetaMetrica} ${styles.bordeAmbar}`}>
                  <span className={styles.etiquetaMetrica}>EN REVISIÓN</span>
                  <span className={styles.valorMetrica}>7</span>
                </div>
                <div className={`${styles.tarjetaMetrica} ${styles.bordeRojo}`}>
                  <span className={styles.etiquetaMetrica}>SIN REVISORES</span>
                  <span className={styles.valorMetrica}>3</span>
                </div>
                <div className={`${styles.tarjetaMetrica} ${styles.bordeVerde}`}>
                  <span className={styles.etiquetaMetrica}>CON DECISIÓN</span>
                  <span className={styles.valorMetrica}>2</span>
                </div>
              </section>
            )}

            <section aria-label="Filtros de trabajos" className={styles.seccionFiltros}>
              <div className={styles.filaControlesFiltro}>
                <div className={styles.grupoSelectores}>
                  <select
                    aria-label="Filtrar por eje temático"
                    className={styles.selectorFiltro}
                    value={ejeSeleccionado}
                    onChange={(e) => {
                      setFiltroManualActivo(true)
                      setEjeSeleccionado(e.target.value)
                      setPaginaActual(1)
                    }}
                  >
                    <option value="todos">Eje: todos</option>
                    <option value="Ingeniería de software">Eje: Ingeniería de software</option>
                    <option value="Inteligencia artificial y datos">Eje: Inteligencia artificial y datos</option>
                    <option value="Sostenibilidad y ciudad">Eje: Sostenibilidad y ciudad</option>
                    <option value="Innovación y emprendimiento">Eje: Innovación y emprendimiento</option>
                    <option value="Salud y sociedad">Eje: Salud y sociedad</option>
                    <option value="Economía y mercados">Eje: Economía y mercados</option>
                  </select>

                  <select
                    aria-label="Filtrar por estado"
                    className={styles.selectorFiltro}
                    value={estadoSeleccionado}
                    onChange={(e) => {
                      setFiltroManualActivo(true)
                      setEstadoSeleccionado(e.target.value)
                      setPaginaActual(1)
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
                      className={styles.selectorFiltro}
                      value={tipoSeleccionado}
                      onChange={(e) => {
                        setFiltroManualActivo(true)
                        setTipoSeleccionado(e.target.value)
                        setPaginaActual(1)
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

                <div className={styles.contenedorBuscador}>
                  <input
                    type="text"
                    placeholder="Buscar por código, título o autor…"
                    className={styles.campoBuscador}
                    value={consultaBusqueda}
                    onChange={(e) => {
                      setFiltroManualActivo(true)
                      setConsultaBusqueda(e.target.value)
                      setPaginaActual(1)
                    }}
                  />
                </div>
              </div>

              {!sinTrabajos && tieneFiltrosActivos && (
                <div className={styles.filaFiltrosActivos}>
                  <span className={styles.etiquetaFiltrosActivos}>Filtros activos:</span>
                  {ejeSeleccionado !== 'todos' && (
                    <span className={styles.etiquetaChip}>
                      Eje: {ejeSeleccionado}
                      <button type="button" onClick={quitarFiltroEje} aria-label="Quitar filtro de eje">
                        ✕
                      </button>
                    </span>
                  )}
                  {estadoSeleccionado !== 'todos' && (
                    <span className={styles.etiquetaChip}>
                      Estado: {estadoSeleccionado}
                      <button type="button" onClick={quitarFiltroEstado} aria-label="Quitar filtro de estado">
                        ✕
                      </button>
                    </span>
                  )}
                  {tipoSeleccionado !== 'todos' && (
                    <span className={styles.etiquetaChip}>
                      Tipo: {tipoSeleccionado}
                      <button
                        type="button"
                        onClick={() => {
                          setFiltroManualActivo(true)
                          setTipoSeleccionado('todos')
                          setPaginaActual(1)
                        }}
                        aria-label="Quitar filtro de tipo"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                  {consultaBusqueda.trim() && (
                    <span className={styles.etiquetaChip}>
                      Búsqueda: {consultaBusqueda}
                      <button
                        type="button"
                        onClick={() => {
                          setFiltroManualActivo(true)
                          setConsultaBusqueda('')
                          setPaginaActual(1)
                        }}
                        aria-label="Quitar filtro de búsqueda"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                  <button
                    type="button"
                    className={styles.botonLimpiar}
                    onClick={limpiarFiltros}
                  >
                    Limpiar todo
                  </button>
                </div>
              )}
            </section>

            {sinTrabajos ? (
              <div className={styles.contenedorVacio}>
                <EmptyState
                  icono="▤"
                  titulo="Todavía no hay trabajos enviados"
                  descripcion="La recepción está abierta hasta el 30/09/2026. Cuando los autores envíen sus trabajos aparecerán aquí para asignar revisores."
                  accion={
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={() => navegar('/configuracion')}
                    >
                      Revisar la configuración de la edición
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className={styles.tarjetaTabla}>
                <div className={styles.marcoTabla}>
                  <table className={styles.tablaTrabajos}>
                    <thead>
                      <tr>
                        <th style={{ width: 42 }}>
                          <input
                            type="checkbox"
                            className={styles.casilla}
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
                        const tieneConsolidado = Object.hasOwn(assignmentsByWork, trabajo.codigo)
                        const rutaConsolidado = `/trabajos-recibidos/${encodeURIComponent(trabajo.codigo)}/consolidado`
                        const estaSeleccionado = codigosSeleccionados.includes(trabajo.codigo)
                        const textoRevisores = obtenerTextoRevisores(trabajo)

                        return (
                          <tr
                            key={trabajo.codigo}
                            className={estaSeleccionado ? styles.filaSeleccionada : ''}
                          >
                            <td>
                              <input
                                type="checkbox"
                                className={styles.casilla}
                                checked={estaSeleccionado}
                                onChange={() => alternarSeleccionTrabajo(trabajo.codigo)}
                                aria-label={`Seleccionar ${trabajo.codigo}`}
                              />
                            </td>
                            <td className={styles.celdaCodigo}>{trabajo.codigo}</td>
                            <td className={styles.celdaTitulo}>
                              {tieneConsolidado ? (
                                <Link className={styles.enlaceTitulo} to={rutaConsolidado}>
                                  {trabajo.titulo}
                                </Link>
                              ) : (
                                <span>{trabajo.titulo}</span>
                              )}
                            </td>
                            <td className={styles.celdaSecundaria}>{trabajo.eje}</td>
                            <td className={styles.celdaSecundaria}>{trabajo.tipo}</td>
                            <td>
                              <button
                                type="button"
                                className={
                                  textoRevisores
                                    ? styles.botonCeldaAsignados
                                    : styles.botonCeldaSinAsignar
                                }
                                onClick={() => abrirAsignacionIndividual(trabajo)}
                              >
                                {textoRevisores || 'Sin asignar'}
                              </button>
                            </td>
                            <td>
                              <span
                                className={`${styles.insigniaEstado} ${
                                  styles['estado_' + trabajo.estado.replace(/\s+/g, '')]
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

                <div className={styles.filaPaginacion}>
                  <span className={styles.infoPaginacion}>
                    Mostrando {(paginaActual - 1) * elementosPorPagina + 1}–
                    {!filtroManualActivo && paginaActual === 1
                      ? 8
                      : Math.min(paginaActual * elementosPorPagina, trabajosFiltrados.length)}{' '}
                    de {!filtroManualActivo ? 14 : trabajosFiltrados.length} trabajos
                    {codigosSeleccionados.length > 0 && ` · ${codigosSeleccionados.length} seleccionados`}
                  </span>
                  <div className={styles.botonesPaginacion}>
                    <button
                      type="button"
                      className={styles.botonPagina}
                      disabled={paginaActual === 1}
                      onClick={() => setPaginaActual((p) => p - 1)}
                    >
                      Anterior
                    </button>
                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
                      <button
                        key={numero}
                        type="button"
                        className={`${styles.botonNumeroPagina} ${
                          paginaActual === numero ? styles.paginaActiva : ''
                        }`}
                        onClick={() => setPaginaActual(numero)}
                      >
                        {numero}
                      </button>
                    ))}
                    <button
                      type="button"
                      className={styles.botonPagina}
                      disabled={paginaActual === totalPaginas}
                      onClick={() => setPaginaActual((p) => p + 1)}
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

      <Footer />

      <AssignReviewersModal
        guardando={ocupado}
        error={errorAlmacenamiento}
        abierto={modalAsignarAbierto}
        alCerrar={() => setModalAsignarAbierto(false)}
        trabajosObjetivo={trabajosParaModal}
        revisores={revisores}
        alConfirmarAsignacion={confirmarAsignacion}
      />
    </div>
  )
}
