import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import Encabezado from '../../../core/ui/Header/Header.jsx'
import NavegacionComite from '../../../core/ui/CommitteeNavigation/CommitteeNavigation.jsx'
import PiePagina from '../../../core/ui/Footer/Footer.jsx'
import Boton from '../../../core/ui/Button/Button.jsx'
import { obtenerRevisores } from '../../../core/utils/asignacionesApi.js'
import estilos from './ReviewersListPage.module.css'

const lineasBase = [
  'Inteligencia artificial y datos',
  'Ingeniería de software',
  'Sostenibilidad y ciudad',
  'Innovación y emprendimiento',
  'Salud y sociedad',
  'Economía y mercados',
]

const institucionesBase = [
  'Universidad de Lima',
  'Pontificia Universidad Católica',
  'Universidad del Pacífico',
  'Universidad Nacional de Ingeniería',
  'Universidad Nacional Mayor de San Marcos',
]

const resumenVacio = {
  totalRevisores: 0,
  totalAsignadas: 0,
  totalEntregadas: 0,
  totalVencidas: 0,
  revisoresConVencidas: 0,
}

export default function PaginaListaRevisores() {
  const navegar = useNavigate()

  const [datos, setDatos] = useState({ resumen: resumenVacio, revisores: [] })
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')

  const [lineaSeleccionada, cambiarLineaSeleccionada] = useState('todas')
  const [institucionSeleccionada, cambiarInstitucionSeleccionada] = useState('todas')
  const [soloVencidas, cambiarSoloVencidas] = useState(false)
  const [textoBusqueda, cambiarTextoBusqueda] = useState('')
  const [paginaActual, cambiarPaginaActual] = useState(1)
  const elementosPorPagina = 8

  useEffect(() => {
    let activo = true
    obtenerRevisores()
      .then(respuesta => {
        if (activo) {
          setDatos({
            resumen: respuesta.resumen ?? resumenVacio,
            revisores: respuesta.revisores ?? [],
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

  const listaRevisores = datos.revisores
  const resumen = datos.resumen

  const opcionesLineas = useMemo(
    () => [
      ...new Set([
        ...lineasBase,
        ...listaRevisores.flatMap(revisor => revisor.lineasInteres ?? []),
      ]),
    ],
    [listaRevisores]
  )

  const opcionesInstituciones = useMemo(
    () => [
      ...new Set([
        ...institucionesBase,
        ...listaRevisores.map(revisor => revisor.institucion).filter(Boolean),
      ]),
    ],
    [listaRevisores]
  )

  const revisoresFiltrados = useMemo(() => {
    return listaRevisores.filter(revisor => {
      if (soloVencidas && revisor.vencidas === 0) {
        return false
      }
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
        const consulta = textoBusqueda.toLowerCase().trim()
        const coincideNombre = revisor.nombre.toLowerCase().includes(consulta)
        const coincideCorreo = revisor.correo?.toLowerCase().includes(consulta)
        const coincideInstitucion = revisor.institucion.toLowerCase().includes(consulta)
        const coincideLinea = revisor.lineasInteres.some(linea =>
          linea.toLowerCase().includes(consulta)
        )
        if (
          !coincideNombre &&
          !coincideCorreo &&
          !coincideInstitucion &&
          !coincideLinea
        ) {
          return false
        }
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

  const totalPaginas = Math.max(
    1,
    Math.ceil(revisoresFiltrados.length / elementosPorPagina)
  )
  const paginaSegura = Math.min(paginaActual, totalPaginas)
  const revisoresPaginados = revisoresFiltrados.slice(
    (paginaSegura - 1) * elementosPorPagina,
    paginaSegura * elementosPorPagina
  )

  return (
    <div className={estilos.pagina}>
      <Encabezado />
      <NavegacionComite rutaActiva="/revisores" />

      <main className={estilos.contenidoPrincipal}>
        {errorCarga ? <p role="alert">{errorCarga}</p> : null}

        <fieldset className={estilos.grupoCampos} disabled={cargando}>
          <div className={estilos.filaEncabezado}>
            <div>
              <h1 className={estilos.titulo}>Revisores</h1>
              <p className={estilos.subtitulo}>
                {cargando
                  ? 'Cargando revisores registrados…'
                  : `${resumen.totalRevisores} revisores registrados · ${resumen.totalAsignadas} revisiones asignadas · ${resumen.totalVencidas} vencidas`}
              </p>
            </div>
            <div>
              <Boton
                variant="secondary"
                type="button"
                onClick={() => navegar('/usuarios')}
              >
                Gestionar usuarios
              </Boton>
            </div>
          </div>

          <div className={estilos.barraFiltros}>
            <div className={estilos.controlesFiltro}>
              <select
                aria-label="Filtrar por línea de interés"
                className={estilos.selectorFiltro}
                value={lineaSeleccionada}
                onChange={evento => {
                  cambiarLineaSeleccionada(evento.target.value)
                  cambiarPaginaActual(1)
                }}
              >
                <option value="todas">Línea: todas</option>
                {opcionesLineas.map(linea => (
                  <option key={linea} value={linea}>
                    Línea: {linea}
                  </option>
                ))}
              </select>

              <select
                aria-label="Filtrar por institución"
                className={estilos.selectorFiltro}
                value={institucionSeleccionada}
                onChange={evento => {
                  cambiarInstitucionSeleccionada(evento.target.value)
                  cambiarPaginaActual(1)
                }}
              >
                <option value="todas">Institución: todas</option>
                {opcionesInstituciones.map(institucion => (
                  <option key={institucion} value={institucion}>
                    Institución: {institucion}
                  </option>
                ))}
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
                Con revisiones vencidas · {resumen.revisoresConVencidas}
              </button>
            </div>

            <div className={estilos.contenedorBusqueda}>
              <input
                type="text"
                placeholder="Buscar revisor..."
                aria-label="Buscar revisor"
                className={estilos.campoBusqueda}
                value={textoBusqueda}
                onChange={evento => {
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
                {revisoresPaginados.map(revisor => (
                  <tr key={revisor.id}>
                    <td className={estilos.celdaNombre}>
                      <strong>{revisor.nombre}</strong>
                    </td>
                    <td className={estilos.celdaInstitucion}>{revisor.institucion}</td>
                    <td className={estilos.celdaLineas}>
                      {revisor.lineasInteres.join(' · ') || 'Sin líneas declaradas'}
                    </td>
                    <td className={estilos.celdaNumero}>{revisor.asignadas}</td>
                    <td className={estilos.celdaEntregadas}>{revisor.entregadas}</td>
                    <td className={estilos.celdaVencidas}>
                      {revisor.vencidas > 0 ? (
                        <span className={estilos.valorVencidasAlerta}>
                          {revisor.vencidas}
                        </span>
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
                : (paginaSegura - 1) * elementosPorPagina + 1}
              –{Math.min(paginaSegura * elementosPorPagina, revisoresFiltrados.length)} de{' '}
              {revisoresFiltrados.length} revisores
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
              {Array.from({ length: totalPaginas }, (_, indice) => indice + 1).map(
                numeroPagina => (
                  <button
                    key={numeroPagina}
                    type="button"
                    className={`${estilos.botonNumeroPagina} ${
                      paginaSegura === numeroPagina ? estilos.paginaActiva : ''
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
                disabled={paginaSegura === totalPaginas}
                onClick={() => cambiarPaginaActual(paginaSegura + 1)}
              >
                Siguiente
              </button>
            </div>
          </div>
        </fieldset>
      </main>

      <PiePagina />
    </div>
  )
}
