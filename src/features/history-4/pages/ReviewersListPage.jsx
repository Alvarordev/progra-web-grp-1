import { useState, useMemo } from 'react'
import Header from '../../../core/ui/Header/Header.jsx'
import CommitteeNavigation from '../../../core/ui/CommitteeNavigation/CommitteeNavigation.jsx'
import Footer from '../../../core/ui/Footer/Footer.jsx'
import Button from '../../../core/ui/Button/Button.jsx'
import Modal from '../../../core/ui/Modal/Modal.jsx'
import useStoredState from '../../../core/utils/useStoredState.js'
import { reviewersRepository } from '../../../core/utils/repositories.js'
import { initialReviewers } from '../../../core/utils/states/worksAssignmentState.js'
import styles from './ReviewersListPage.module.css'

const usuarioComite = {
  nombre: 'Dra. Ana Salazar Bermúdez',
  rol: 'Rol: Comité organizador',
  iniciales: 'AS',
}

export default function ReviewersListPage() {
  const estadoRevisores = useStoredState(reviewersRepository, initialReviewers)
  const listaRevisores = estadoRevisores.value
  const ocupado = estadoRevisores.loading || estadoRevisores.saving
  const errorAlmacenamiento = estadoRevisores.error

  const [lineaSeleccionada, establecerLineaSeleccionada] = useState('todas')
  const [institucionSeleccionada, establecerInstitucionSeleccionada] = useState('todas')
  const [soloVencidas, establecerSoloVencidas] = useState(false)
  const [textoBusqueda, establecerTextoBusqueda] = useState('')
  const [paginaActual, establecerPaginaActual] = useState(1)
  const elementosPorPagina = 8

  const [modalInvitarAbierto, establecerModalInvitarAbierto] = useState(false)
  const [formularioInvitacion, establecerFormularioInvitacion] = useState({
    nombre: '',
    correo: '',
    institucion: 'Universidad de Lima',
    lineasInteres: '',
  })
  const [mensajeExito, establecerMensajeExito] = useState('')

  const totalAsignadas = listaRevisores.reduce((suma, revisor) => suma + revisor.asignadas, 0)
  const totalVencidas = listaRevisores.reduce((suma, revisor) => suma + revisor.vencidas, 0)
  const cantidadConVencidas = listaRevisores.filter((revisor) => revisor.vencidas > 0).length

  const revisoresFiltrados = useMemo(() => {
    return listaRevisores.filter((revisor) => {
      if (soloVencidas && revisor.vencidas === 0) return false
      if (lineaSeleccionada !== 'todas' && !revisor.lineasInteres.includes(lineaSeleccionada)) return false
      if (institucionSeleccionada !== 'todas' && revisor.institucion !== institucionSeleccionada) return false
      if (textoBusqueda.trim()) {
        const consulta = textoBusqueda.toLowerCase()
        const coincideNombre = revisor.nombre.toLowerCase().includes(consulta)
        const coincideInstitucion = revisor.institucion.toLowerCase().includes(consulta)
        const coincideLinea = revisor.lineasInteres.some((linea) => linea.toLowerCase().includes(consulta))
        if (!coincideNombre && !coincideInstitucion && !coincideLinea) return false
      }
      return true
    })
  }, [listaRevisores, soloVencidas, lineaSeleccionada, institucionSeleccionada, textoBusqueda])

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
      nombre: formularioInvitacion.nombre.trim(),
      institucion: formularioInvitacion.institucion,
      lineasInteres: formularioInvitacion.lineasInteres
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      asignadas: 0,
      entregadas: 0,
      vencidas: 0,
    }

    const actualizados = [...listaRevisores, nuevoRevisor]
    const guardado = await estadoRevisores.save(actualizados).catch(() => false)
    if (!guardado) return

    establecerModalInvitarAbierto(false)
    establecerFormularioInvitacion({
      nombre: '',
      correo: '',
      institucion: 'Universidad de Lima',
      lineasInteres: '',
    })
    establecerMensajeExito(`Invitación enviada exitosamente a ${nuevoRevisor.nombre}.`)
    setTimeout(() => establecerMensajeExito(''), 5000)
  }

  return (
    <div className={styles.pagina}>
      <Header estado="En revisión" />
      <CommitteeNavigation rutaActiva="/revisores" usuario={usuarioComite} />

      <main className={styles.contenidoPrincipal}>
        {errorAlmacenamiento ? <p role="alert">{errorAlmacenamiento}</p> : null}

        <fieldset className={styles.grupoCampos} disabled={ocupado || Boolean(errorAlmacenamiento)}>
          <div className={styles.filaEncabezado}>
            <div>
              <h1 className={styles.titulo}>Revisores</h1>
              <p className={styles.subtitulo}>
                {listaRevisores.length} revisores registrados · {totalAsignadas} revisiones asignadas · {totalVencidas} vencidas
              </p>
            </div>
            <div>
              <Button variant="secondary" type="button" onClick={() => establecerModalInvitarAbierto(true)}>
                Invitar revisor
              </Button>
            </div>
          </div>

          {mensajeExito ? (
            <div className={styles.notificacionExito}>
              <span>✓ {mensajeExito}</span>
            </div>
          ) : null}

          <div className={styles.barraFiltros}>
            <div className={styles.controlesFiltro}>
              <select
                aria-label="Filtrar por línea de interés"
                className={styles.selectorFiltro}
                value={lineaSeleccionada}
                onChange={(evento) => {
                  establecerLineaSeleccionada(evento.target.value)
                  establecerPaginaActual(1)
                }}
              >
                <option value="todas">Línea: todas</option>
                <option value="Ingeniería de software">Línea: Ingeniería de software</option>
                <option value="IA y datos">Línea: IA y datos</option>
                <option value="Sostenibilidad y ciudad">Línea: Sostenibilidad y ciudad</option>
                <option value="Innovación">Línea: Innovación</option>
                <option value="Innovación y emprendimiento">Línea: Innovación y emprendimiento</option>
                <option value="Salud y sociedad">Línea: Salud y sociedad</option>
                <option value="Economía y mercados">Línea: Economía y mercados</option>
              </select>

              <select
                aria-label="Filtrar por institución"
                className={styles.selectorFiltro}
                value={institucionSeleccionada}
                onChange={(evento) => {
                  establecerInstitucionSeleccionada(evento.target.value)
                  establecerPaginaActual(1)
                }}
              >
                <option value="todas">Institución: todas</option>
                <option value="Universidad de Lima">Institución: Universidad de Lima</option>
                <option value="Pontificia Universidad Católica">Institución: Pontificia Universidad Católica</option>
                <option value="Universidad del Pacífico">Institución: Universidad del Pacífico</option>
                <option value="Universidad Nacional de Ingeniería">Institución: Universidad Nacional de Ingeniería</option>
                <option value="Universidad Nacional Mayor de San Marcos">Institución: Universidad Nacional Mayor de San Marcos</option>
              </select>

              <button
                type="button"
                className={`${styles.botonFiltroVencidas} ${soloVencidas ? styles.filtroVencidasActivo : ''}`}
                onClick={() => {
                  establecerSoloVencidas(!soloVencidas)
                  establecerPaginaActual(1)
                }}
              >
                Con revisiones vencidas · {cantidadConVencidas}
              </button>
            </div>

            <div className={styles.contenedorBusqueda}>
              <input
                type="text"
                placeholder="Buscar revisor..."
                aria-label="Buscar revisor"
                className={styles.campoBusqueda}
                value={textoBusqueda}
                onChange={(evento) => {
                  establecerTextoBusqueda(evento.target.value)
                  establecerPaginaActual(1)
                }}
              />
            </div>
          </div>

          <div className={styles.contenedorTabla}>
            <table className={styles.tablaRevisores}>
              <thead>
                <tr>
                  <th>REVISOR</th>
                  <th>INSTITUCIÓN</th>
                  <th>LÍNEAS DE INTERÉS</th>
                  <th className={styles.columnaDerecha}>ASIGNADAS</th>
                  <th className={styles.columnaDerecha}>ENTREGADAS</th>
                  <th className={styles.columnaDerecha}>VENCIDAS</th>
                </tr>
              </thead>
              <tbody>
                {revisoresPaginados.map((revisor) => (
                  <tr key={revisor.id}>
                    <td className={styles.celdaNombre}>
                      <strong>{revisor.nombre}</strong>
                    </td>
                    <td className={styles.celdaInstitucion}>{revisor.institucion}</td>
                    <td className={styles.celdaLineas}>
                      {revisor.lineasInteres.join(' · ')}
                    </td>
                    <td className={styles.celdaNumero}>{revisor.asignadas}</td>
                    <td className={styles.celdaEntregadas}>{revisor.entregadas}</td>
                    <td className={styles.celdaVencidas}>
                      {revisor.vencidas > 0 ? (
                        <span className={styles.valorVencidasAlerta}>{revisor.vencidas}</span>
                      ) : (
                        <span className={styles.valorCero}>0</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.filaPaginacion}>
            <span className={styles.infoPaginacion}>
              Mostrando {revisoresFiltrados.length === 0 ? 0 : (paginaActual - 1) * elementosPorPagina + 1}–{Math.min(paginaActual * elementosPorPagina, revisoresFiltrados.length)} de {revisoresFiltrados.length} revisores
            </span>
            <div className={styles.botonesPaginacion}>
              <button
                type="button"
                className={styles.botonPagina}
                disabled={paginaActual === 1}
                onClick={() => establecerPaginaActual((pagina) => pagina - 1)}
              >
                Anterior
              </button>
              {Array.from({ length: totalPaginas }, (_, indice) => indice + 1).map((numeroPagina) => (
                <button
                  key={numeroPagina}
                  type="button"
                  className={`${styles.botonNumeroPagina} ${paginaActual === numeroPagina ? styles.paginaActiva : ''}`}
                  onClick={() => establecerPaginaActual(numeroPagina)}
                >
                  {numeroPagina}
                </button>
              ))}
              <button
                type="button"
                className={styles.botonPagina}
                disabled={paginaActual === totalPaginas}
                onClick={() => establecerPaginaActual((pagina) => pagina + 1)}
              >
                Siguiente
              </button>
            </div>
          </div>
        </fieldset>
      </main>

      <Footer />

      {modalInvitarAbierto ? (
        <Modal
          alCerrar={() => {
            if (!ocupado) establecerModalInvitarAbierto(false)
          }}
          titulo="Invitar revisor al congreso"
        >
          <form onSubmit={manejarEnvioInvitacion} className={styles.formularioInvitacion}>
            {errorAlmacenamiento ? <p role="alert">{errorAlmacenamiento}</p> : null}
            <fieldset className={styles.grupoCampos} disabled={ocupado}>
              <label className={styles.etiquetaModal}>
                NOMBRES Y APELLIDOS *
                <input
                  type="text"
                  required
                  className={styles.campoModal}
                  value={formularioInvitacion.nombre}
                  placeholder="Ej. Dr. Mario Vargas Llosa"
                  onChange={(evento) =>
                    establecerFormularioInvitacion({
                      ...formularioInvitacion,
                      nombre: evento.target.value,
                    })
                  }
                />
              </label>

              <label className={styles.etiquetaModal}>
                CORREO ELECTRÓNICO *
                <input
                  type="email"
                  required
                  className={styles.campoModal}
                  value={formularioInvitacion.correo}
                  placeholder="revisor@universidad.edu.pe"
                  onChange={(evento) =>
                    establecerFormularioInvitacion({
                      ...formularioInvitacion,
                      correo: evento.target.value,
                    })
                  }
                />
              </label>

              <label className={styles.etiquetaModal}>
                INSTITUCIÓN *
                <input
                  type="text"
                  required
                  className={styles.campoModal}
                  value={formularioInvitacion.institucion}
                  onChange={(evento) =>
                    establecerFormularioInvitacion({
                      ...formularioInvitacion,
                      institucion: evento.target.value,
                    })
                  }
                />
              </label>

              <label className={styles.etiquetaModal}>
                LÍNEAS DE INTERÉS (SEPARADAS POR COMA)
                <input
                  type="text"
                  className={styles.campoModal}
                  value={formularioInvitacion.lineasInteres}
                  placeholder="Ingeniería de software, IA y datos"
                  onChange={(evento) =>
                    establecerFormularioInvitacion({
                      ...formularioInvitacion,
                      lineasInteres: evento.target.value,
                    })
                  }
                />
              </label>

              <div className={styles.accionesModal}>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => establecerModalInvitarAbierto(false)}
                >
                  Cancelar
                </Button>
                <Button variant="primary" type="submit">
                  Enviar invitación
                </Button>
              </div>
            </fieldset>
          </form>
        </Modal>
      ) : null}
    </div>
  )
}
