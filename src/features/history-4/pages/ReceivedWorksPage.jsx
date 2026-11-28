import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import Encabezado from '../../../core/ui/Header/Header.jsx'
import NavegacionComite from '../../../core/ui/CommitteeNavigation/CommitteeNavigation.jsx'
import PiePagina from '../../../core/ui/Footer/Footer.jsx'
import Boton from '../../../core/ui/Button/Button.jsx'
import EstadoVacio from '../../../core/ui/EmptyState/EmptyState.jsx'
import ModalAsignarRevisores from '../components/AssignReviewersModal/AssignReviewersModal.jsx'
import { downloadFile } from '../../../core/utils/downloads.js'
import useStoredState from '../../../core/utils/useStoredState.js'
import { scheduleRepository } from '../../../core/utils/repositories.js'
import {
  formatScheduleDate,
  initialSchedule,
} from '../../../core/utils/states/scheduleState.js'
import {
  asignarRevisoresLote,
  asignarRevisoresTrabajo,
  obtenerTrabajosRecibidos,
} from '../../../core/utils/asignacionesApi.js'
import useUsuarioComite from '../../../core/utils/useUsuarioComite.js'
import estilos from './ReceivedWorksPage.module.css'

const ejesBase = [
  'Ingeniería de software',
  'Inteligencia artificial y datos',
  'Sostenibilidad y ciudad',
  'Innovación y emprendimiento',
  'Salud y sociedad',
  'Economía y mercados',
]

const tiposBase = ['Artículo completo', 'Resumen extendido', 'Póster', 'Caso de estudio']

const resumenVacio = {
  total: 0,
  enviados: 0,
  borradores: 0,
  enRevision: 0,
  sinRevisores: 0,
  conDecision: 0,
}

function esTrabajoAsignable(trabajo) {
  return (
    !['Aceptado', 'Rechazado'].includes(trabajo.estado) &&
    (trabajo.revisoresAsignados ?? 0) < 3
  )
}

export default function PaginaTrabajosRecibidos() {
  const navegar = useNavigate()
  const [parametrosBusqueda] = useSearchParams()
  const usuarioComite = useUsuarioComite()
  const cronograma = useStoredState(scheduleRepository, initialSchedule)

  const [datos, setDatos] = useState({ resumen: resumenVacio, trabajos: [] })
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [errorCarga, setErrorCarga] = useState('')
  const [errorModal, setErrorModal] = useState('')

  const [vistaVaciaActiva, cambiarVistaVaciaActiva] = useState(
    () => parametrosBusqueda.get('vacio') === '1'
  )
  const [ejeSeleccionado, cambiarEjeSeleccionado] = useState('todos')
  const [estadoSeleccionado, cambiarEstadoSeleccionado] = useState('todos')
  const [tipoSeleccionado, cambiarTipoSeleccionado] = useState('todos')
  const [consultaBusqueda, cambiarConsultaBusqueda] = useState('')

  const [codigosSeleccionados, cambiarCodigosSeleccionados] = useState([])
  const [paginaActual, cambiarPaginaActual] = useState(1)
  const elementosPorPagina = 8

  const [modalAsignarAbierto, cambiarModalAsignarAbierto] = useState(false)
  const [trabajosParaModal, cambiarTrabajosParaModal] = useState([])
  const [notificacion, cambiarNotificacion] = useState('')

  const recargarTrabajos = useCallback(async () => {
    const respuesta = await obtenerTrabajosRecibidos()
    setDatos({
      resumen: respuesta.resumen ?? resumenVacio,
      trabajos: respuesta.trabajos ?? [],
    })
  }, [])

  useEffect(() => {
    let activo = true
    obtenerTrabajosRecibidos()
      .then(respuesta => {
        if (activo) {
          setDatos({
            resumen: respuesta.resumen ?? resumenVacio,
            trabajos: respuesta.trabajos ?? [],
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

  const trabajos = datos.trabajos
  const resumen = datos.resumen
  const ocupado = cargando || guardando

  const opcionesEjes = useMemo(
    () => [...new Set([...ejesBase, ...trabajos.map(t => t.eje).filter(Boolean)])],
    [trabajos]
  )
  const opcionesTipos = useMemo(
    () => [...new Set([...tiposBase, ...trabajos.map(t => t.tipo).filter(Boolean)])],
    [trabajos]
  )

  const trabajosFiltrados = useMemo(() => {
    if (vistaVaciaActiva) {
      return []
    }
    return trabajos.filter(trabajo => {
      if (ejeSeleccionado !== 'todos' && trabajo.eje !== ejeSeleccionado) {
        return false
      }
      if (estadoSeleccionado !== 'todos' && trabajo.estado !== estadoSeleccionado) {
        return false
      }
      if (tipoSeleccionado !== 'todos' && trabajo.tipo !== tipoSeleccionado) {
        return false
      }
      if (consultaBusqueda.trim()) {
        const termino = consultaBusqueda.toLowerCase().trim()
        const coincideCodigo = trabajo.codigo.toLowerCase().includes(termino)
        const coincideTitulo = trabajo.titulo.toLowerCase().includes(termino)
        const coincideAutor = trabajo.autores?.some(autor =>
          autor.toLowerCase().includes(termino)
        )
        if (!coincideCodigo && !coincideTitulo && !coincideAutor) {
          return false
        }
      }
      return true
    })
  }, [
    vistaVaciaActiva,
    trabajos,
    ejeSeleccionado,
    estadoSeleccionado,
    tipoSeleccionado,
    consultaBusqueda,
  ])

  const totalPaginas = Math.max(
    1,
    Math.ceil(trabajosFiltrados.length / elementosPorPagina)
  )
  const paginaSegura = Math.min(paginaActual, totalPaginas)
  const trabajosPaginados = trabajosFiltrados.slice(
    (paginaSegura - 1) * elementosPorPagina,
    paginaSegura * elementosPorPagina
  )
  const asignablesEnPagina = trabajosPaginados.filter(esTrabajoAsignable)

  const seleccionarTodosPagina = evento => {
    if (evento.target.checked) {
      const codigosPagina = asignablesEnPagina.map(trabajo => trabajo.codigo)
      cambiarCodigosSeleccionados(
        Array.from(new Set([...codigosSeleccionados, ...codigosPagina]))
      )
    } else {
      const conjuntoPagina = new Set(asignablesEnPagina.map(trabajo => trabajo.codigo))
      cambiarCodigosSeleccionados(
        codigosSeleccionados.filter(codigo => !conjuntoPagina.has(codigo))
      )
    }
  }

  const alternarSeleccionTrabajo = codigo => {
    if (codigosSeleccionados.includes(codigo)) {
      cambiarCodigosSeleccionados(
        codigosSeleccionados.filter(codigoActual => codigoActual !== codigo)
      )
    } else {
      cambiarCodigosSeleccionados([...codigosSeleccionados, codigo])
    }
  }

  const abrirAsignacionLote = () => {
    const seleccionados = trabajos.filter(
      trabajo =>
        codigosSeleccionados.includes(trabajo.codigo) && esTrabajoAsignable(trabajo)
    )
    if (seleccionados.length === 0) {
      return
    }
    setErrorModal('')
    cambiarTrabajosParaModal(seleccionados)
    cambiarModalAsignarAbierto(true)
  }

  const abrirAsignacionIndividual = trabajo => {
    setErrorModal('')
    cambiarTrabajosParaModal([trabajo])
    cambiarModalAsignarAbierto(true)
  }

  const confirmarAsignacion = async ({
    trabajosSeleccionados,
    idsRevisores,
    fechaLimite,
    permitirMismaInstitucion,
    justificacion,
  }) => {
    if (ocupado) {
      return false
    }
    setGuardando(true)
    setErrorModal('')
    try {
      const cuerpoBase = {
        revisorIds: idsRevisores,
        fechaLimite,
        permitirMismaInstitucion,
        justificacion,
      }
      if (trabajosSeleccionados.length === 1) {
        const objetivo = trabajosSeleccionados[0]
        await asignarRevisoresTrabajo(objetivo.id ?? objetivo.codigo, cuerpoBase)
      } else {
        await asignarRevisoresLote({
          codigosTrabajo: trabajosSeleccionados.map(trabajo => trabajo.codigo),
          ...cuerpoBase,
        })
      }
      await recargarTrabajos()
      cambiarCodigosSeleccionados([])
      cambiarNotificacion(
        `Revisores asignados correctamente a ${trabajosSeleccionados.length} trabajo(s).`
      )
      setTimeout(() => cambiarNotificacion(''), 4000)
      return true
    } catch (causa) {
      setErrorModal(causa.message)
      return false
    } finally {
      setGuardando(false)
    }
  }

  const limpiarFiltros = () => {
    cambiarVistaVaciaActiva(false)
    cambiarEjeSeleccionado('todos')
    cambiarEstadoSeleccionado('todos')
    cambiarTipoSeleccionado('todos')
    cambiarConsultaBusqueda('')
    cambiarPaginaActual(1)
  }

  const todosMarcadosEnPagina =
    asignablesEnPagina.length > 0 &&
    asignablesEnPagina.every(trabajo => codigosSeleccionados.includes(trabajo.codigo))

  const sinTrabajos = !cargando && trabajosFiltrados.length === 0
  const tieneFiltrosActivos =
    ejeSeleccionado !== 'todos' ||
    estadoSeleccionado !== 'todos' ||
    tipoSeleccionado !== 'todos' ||
    Boolean(consultaBusqueda.trim())

  const fechaCierreRevision = formatScheduleDate(cronograma.value?.review ?? '')
  const fechaSugeridaRevision =
    fechaCierreRevision !== '—' ? fechaCierreRevision : '20/10/2026'
  const fechaCierreRecepcion = formatScheduleDate(cronograma.value?.reception ?? '')

  let subtituloPagina = `${resumen.total} trabajos · ${resumen.enviados} enviados · ${resumen.borradores} borradores fuera de proceso`
  if (cargando) {
    subtituloPagina = 'Cargando trabajos recibidos…'
  } else if (sinTrabajos && resumen.enviados === 0) {
    subtituloPagina = 'Sin trabajos enviados por el momento'
  }

  return (
    <div className={estilos.pagina}>
      <Encabezado />
      <NavegacionComite rutaActiva="/trabajos-recibidos" usuario={usuarioComite} />

      <main className={estilos.principal}>
        <fieldset className={estilos.contenedorCampos} disabled={ocupado}>
          <div className={estilos.contenido}>
            {errorCarga && (
              <p className={estilos.alertaError} role="alert">
                {errorCarga}
              </p>
            )}

            <header className={estilos.encabezadoPagina}>
              <div>
                <h1 className={estilos.titulo}>Trabajos recibidos</h1>
                <p className={estilos.subtitulo}>{subtituloPagina}</p>
              </div>
              {!sinTrabajos && !cargando && (
                <div className={estilos.accionesSuperiores}>
                  <Boton
                    variant="secondary"
                    type="button"
                    onClick={() => {
                      const quote = value => `"${String(value).replaceAll('"', '""')}"`
                      const rows = [
                        ['Código', 'Título', 'Eje', 'Tipo', 'Revisores', 'Estado'],
                        ...trabajosFiltrados.map(work => [
                          work.codigo,
                          work.titulo,
                          work.eje,
                          work.tipo,
                          work.revisores,
                          work.estado,
                        ]),
                      ]
                      downloadFile(
                        'trabajos-recibidos.csv',
                        '\uFEFF' + rows.map(row => row.map(quote).join(',')).join('\r\n'),
                        'text/csv;charset=utf-8'
                      )
                    }}
                  >
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

            {!sinTrabajos && !cargando && (
              <section
                aria-label="Resumen de trabajos"
                className={estilos.rejillaMetricas}
              >
                <div className={`${estilos.tarjetaMetrica} ${estilos.bordeAzul}`}>
                  <span className={estilos.etiquetaMetrica}>ENVIADOS</span>
                  <span className={estilos.valorMetrica}>{resumen.enviados}</span>
                </div>
                <div className={`${estilos.tarjetaMetrica} ${estilos.bordeAmbar}`}>
                  <span className={estilos.etiquetaMetrica}>EN REVISIÓN</span>
                  <span className={estilos.valorMetrica}>{resumen.enRevision}</span>
                </div>
                <div className={`${estilos.tarjetaMetrica} ${estilos.bordeRojo}`}>
                  <span className={estilos.etiquetaMetrica}>SIN REVISORES</span>
                  <span className={estilos.valorMetrica}>{resumen.sinRevisores}</span>
                </div>
                <div className={`${estilos.tarjetaMetrica} ${estilos.bordeVerde}`}>
                  <span className={estilos.etiquetaMetrica}>CON DECISIÓN</span>
                  <span className={estilos.valorMetrica}>{resumen.conDecision}</span>
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
                    onChange={evento => {
                      cambiarVistaVaciaActiva(false)
                      cambiarEjeSeleccionado(evento.target.value)
                      cambiarPaginaActual(1)
                    }}
                  >
                    <option value="todos">Eje: todos</option>
                    {opcionesEjes.map(eje => (
                      <option key={eje} value={eje}>
                        Eje: {eje}
                      </option>
                    ))}
                  </select>

                  <select
                    aria-label="Filtrar por estado"
                    className={estilos.selectorFiltro}
                    value={estadoSeleccionado}
                    onChange={evento => {
                      cambiarVistaVaciaActiva(false)
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
                      onChange={evento => {
                        cambiarVistaVaciaActiva(false)
                        cambiarTipoSeleccionado(evento.target.value)
                        cambiarPaginaActual(1)
                      }}
                    >
                      <option value="todos">Tipo: todos</option>
                      {opcionesTipos.map(tipo => (
                        <option key={tipo} value={tipo}>
                          Tipo: {tipo}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className={estilos.contenedorBuscador}>
                  <input
                    type="text"
                    aria-label="Buscar trabajo por código, título o autor"
                    placeholder="Buscar por código, título o autor…"
                    className={estilos.campoBuscador}
                    value={consultaBusqueda}
                    onChange={evento => {
                      cambiarVistaVaciaActiva(false)
                      cambiarConsultaBusqueda(evento.target.value)
                      cambiarPaginaActual(1)
                    }}
                  />
                </div>
              </div>

              {tieneFiltrosActivos && (
                <div className={estilos.filaFiltrosActivos}>
                  <span className={estilos.etiquetaFiltrosActivos}>Filtros activos:</span>
                  {ejeSeleccionado !== 'todos' && (
                    <span className={estilos.etiquetaFiltro}>
                      Eje: {ejeSeleccionado}
                      <button
                        type="button"
                        onClick={() => {
                          cambiarEjeSeleccionado('todos')
                          cambiarPaginaActual(1)
                        }}
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
                        onClick={() => {
                          cambiarEstadoSeleccionado('todos')
                          cambiarPaginaActual(1)
                        }}
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
                  descripcion={
                    tieneFiltrosActivos
                      ? 'No se encontraron trabajos con los filtros seleccionados.'
                      : `La recepción está abierta${fechaCierreRecepcion !== '—' ? ` hasta el ${fechaCierreRecepcion}` : ''}. Cuando los autores envíen sus trabajos aparecerán aquí para asignar revisores.`
                  }
                  accion={
                    tieneFiltrosActivos ? (
                      <Boton variant="secondary" type="button" onClick={limpiarFiltros}>
                        Limpiar filtros
                      </Boton>
                    ) : (
                      <Boton
                        variant="secondary"
                        type="button"
                        onClick={() => navegar('/configuracion')}
                      >
                        Revisar la configuración de la edición
                      </Boton>
                    )
                  }
                />
              </div>
            ) : (
              !cargando && (
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
                              disabled={asignablesEnPagina.length === 0}
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
                        {trabajosPaginados.map(trabajo => {
                          const rutaConsolidado = `/trabajos-recibidos/${encodeURIComponent(
                            trabajo.codigo
                          )}/consolidado`
                          const asignable = esTrabajoAsignable(trabajo)
                          const estaSeleccionado = codigosSeleccionados.includes(
                            trabajo.codigo
                          )
                          const tieneRevisores = (trabajo.revisoresAsignados ?? 0) > 0

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
                                  disabled={!asignable}
                                  onChange={() =>
                                    alternarSeleccionTrabajo(trabajo.codigo)
                                  }
                                  aria-label={`Seleccionar ${trabajo.codigo}`}
                                />
                              </td>
                              <td className={estilos.celdaCodigo}>{trabajo.codigo}</td>
                              <td className={estilos.celdaTitulo}>
                                <Link
                                  className={estilos.enlaceTitulo}
                                  to={rutaConsolidado}
                                >
                                  {trabajo.titulo}
                                </Link>
                              </td>
                              <td className={estilos.celdaSecundaria}>{trabajo.eje}</td>
                              <td className={estilos.celdaSecundaria}>{trabajo.tipo}</td>
                              <td>
                                {asignable ? (
                                  <button
                                    type="button"
                                    className={
                                      tieneRevisores
                                        ? estilos.botonCeldaAsignados
                                        : estilos.botonCeldaSinAsignar
                                    }
                                    onClick={() => abrirAsignacionIndividual(trabajo)}
                                  >
                                    {tieneRevisores ? trabajo.revisores : 'Sin asignar'}
                                  </button>
                                ) : (
                                  <span className={estilos.celdaSecundaria}>
                                    {tieneRevisores ? trabajo.revisores : 'Sin asignar'}
                                  </span>
                                )}
                              </td>
                              <td>
                                <span
                                  className={`${estilos.insigniaEstado} ${
                                    estilos[
                                      'estado_' + trabajo.estado.replace(/\s+/g, '')
                                    ]
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
                      Mostrando {(paginaSegura - 1) * elementosPorPagina + 1}–
                      {Math.min(
                        paginaSegura * elementosPorPagina,
                        trabajosFiltrados.length
                      )}{' '}
                      de {trabajosFiltrados.length} trabajos
                      {codigosSeleccionados.length > 0 &&
                        ` · ${codigosSeleccionados.length} seleccionados`}
                    </span>
                    <div className={estilos.botonesPaginacion}>
                      <button
                        type="button"
                        className={estilos.botonPagina}
                        disabled={paginaSegura === 1}
                        onClick={() => cambiarPaginaActual(paginaSegura - 1)}
                      >
                        Anterior
                      </button>
                      {Array.from(
                        { length: totalPaginas },
                        (_, indice) => indice + 1
                      ).map(numero => (
                        <button
                          key={numero}
                          type="button"
                          className={`${estilos.botonNumeroPagina} ${
                            paginaSegura === numero ? estilos.paginaActiva : ''
                          }`}
                          onClick={() => cambiarPaginaActual(numero)}
                        >
                          {numero}
                        </button>
                      ))}
                      <button
                        type="button"
                        className={estilos.botonPagina}
                        disabled={paginaSegura === totalPaginas}
                        onClick={() => cambiarPaginaActual(paginaSegura + 1)}
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </fieldset>
      </main>

      <PiePagina />

      {modalAsignarAbierto && (
        <ModalAsignarRevisores
          key={trabajosParaModal.map(trabajo => trabajo.codigo).join(',')}
          guardando={guardando}
          error={errorModal}
          abierto={modalAsignarAbierto}
          alCerrar={() => cambiarModalAsignarAbierto(false)}
          trabajosObjetivo={trabajosParaModal}
          fechaLimiteInicial={fechaSugeridaRevision}
          alConfirmarAsignacion={confirmarAsignacion}
        />
      )}
    </div>
  )
}
