import { useEffect, useMemo, useState } from 'react'
import ModalBase from '../../../../core/ui/Modal/Modal.jsx'
import Boton from '../../../../core/ui/Button/Button.jsx'
import { obtenerCandidatosAsignacion } from '../../../../core/utils/asignacionesApi.js'
import estilos from './AssignReviewersModal.module.css'

export default function ModalAsignarRevisores({
  guardando = false,
  error = '',
  abierto = false,
  alCerrar,
  trabajosObjetivo = [],
  fechaLimiteInicial = '',
  alConfirmarAsignacion,
}) {
  const [terminoBusqueda, cambiarTerminoBusqueda] = useState('')
  const [revisoresSeleccionados, cambiarRevisoresSeleccionados] = useState([])
  const [permitirMismaInstitucion, cambiarPermitirMismaInstitucion] = useState(false)
  const [fechaLimite, cambiarFechaLimite] = useState(fechaLimiteInicial)
  const [justificacion, setJustificacion] = useState('')

  const codigosClave = trabajosObjetivo.map(trabajo => trabajo.codigo).join(',')
  const [candidatos, setCandidatos] = useState([])
  const [cargandoCandidatos, setCargandoCandidatos] = useState(
    Boolean(abierto && codigosClave)
  )
  const [errorCandidatos, setErrorCandidatos] = useState('')

  useEffect(() => {
    if (!abierto || !codigosClave) {
      return undefined
    }
    let activo = true
    obtenerCandidatosAsignacion({ codigos: codigosClave.split(',') })
      .then(respuesta => {
        if (activo) {
          setCandidatos(respuesta.candidatos ?? [])
        }
      })
      .catch(causa => {
        if (activo) {
          setErrorCandidatos(causa.message)
        }
      })
      .finally(() => {
        if (activo) {
          setCargandoCandidatos(false)
        }
      })
    return () => {
      activo = false
    }
  }, [abierto, codigosClave])

  const listaRevisores = useMemo(
    () =>
      candidatos.map(revisor => ({
        ...revisor,
        cargaTexto: `${revisor.asignadas} ${revisor.asignadas === 1 ? 'revisión' : 'revisiones'}`,
      })),
    [candidatos]
  )

  const esCasoConflicto = listaRevisores.some(
    revisor => revisor.conflicto?.tipo !== 'ninguno'
  )

  const revisoresFiltrados = useMemo(() => {
    const consulta = terminoBusqueda.toLowerCase().trim()
    if (!consulta) {
      return listaRevisores
    }
    return listaRevisores.filter(
      revisor =>
        revisor.nombre.toLowerCase().includes(consulta) ||
        revisor.institucion.toLowerCase().includes(consulta) ||
        revisor.lineasInteres.some(linea => linea.toLowerCase().includes(consulta))
    )
  }, [listaRevisores, terminoBusqueda])

  if (!abierto || trabajosObjetivo.length === 0) {
    return null
  }

  const minPrevios = Math.min(
    ...trabajosObjetivo.map(trabajo => trabajo.revisoresAsignados ?? 0)
  )
  const maxPrevios = Math.max(
    ...trabajosObjetivo.map(trabajo => trabajo.revisoresAsignados ?? 0)
  )
  const minimoRequerido = Math.max(1, 2 - minPrevios)
  const maximoPermitido = Math.max(0, 3 - maxPrevios)

  const alternarRevisor = revisorId => {
    if (guardando || cargandoCandidatos) {
      return
    }
    const elemento = listaRevisores.find(revisor => revisor.id === revisorId)
    if (!elemento || elemento.conflicto?.bloqueante || elemento.yaAsignado) {
      return
    }

    if (revisoresSeleccionados.includes(revisorId)) {
      cambiarRevisoresSeleccionados(
        revisoresSeleccionados.filter(identificador => identificador !== revisorId)
      )
    } else if (revisoresSeleccionados.length < maximoPermitido) {
      cambiarRevisoresSeleccionados([...revisoresSeleccionados, revisorId])
    }
  }

  const seleccionTieneInstitucion = revisoresSeleccionados.some(identificador => {
    const elemento = listaRevisores.find(revisor => revisor.id === identificador)
    return elemento?.conflicto?.tipo === 'institucion'
  })

  const cantidadValida = revisoresSeleccionados.length
  const cumpleCantidad =
    cantidadValida >= minimoRequerido && cantidadValida <= maximoPermitido
  const bloqueadoPorInstitucion = seleccionTieneInstitucion && !permitirMismaInstitucion
  const fechaValida =
    /^\d{2}\/\d{2}\/\d{4}$/.test(fechaLimite) &&
    Number.isFinite(Date.parse(fechaLimite.split('/').reverse().join('-')))
  const puedeGuardar =
    !cargandoCandidatos &&
    cumpleCantidad &&
    !bloqueadoPorInstitucion &&
    (!seleccionTieneInstitucion || Boolean(justificacion.trim())) &&
    fechaValida

  const guardarAsignacion = async () => {
    if (guardando || !puedeGuardar) {
      return
    }
    const guardado = await alConfirmarAsignacion({
      trabajosSeleccionados: trabajosObjetivo,
      idsRevisores: revisoresSeleccionados,
      fechaLimite,
      permitirMismaInstitucion: seleccionTieneInstitucion
        ? permitirMismaInstitucion
        : undefined,
      justificacion: justificacion.trim(),
    })
    if (guardado) {
      alCerrar()
    }
  }

  const primerTrabajo = trabajosObjetivo[0]
  const textoReferencia =
    trabajosObjetivo.length === 1
      ? `${primerTrabajo.codigo} · ${primerTrabajo.titulo} · ${primerTrabajo.eje}`
      : `Asignación en lote · ${trabajosObjetivo.length} trabajos seleccionados`

  const mensajeError = error || errorCandidatos

  return (
    <ModalBase
      alCerrar={() => {
        if (!guardando) {
          alCerrar()
        }
      }}
      titulo="Asignar revisores"
      descripcion={textoReferencia}
      tamano="wide"
    >
      <fieldset
        className={estilos.cuerpoModal}
        disabled={guardando || cargandoCandidatos}
      >
        {mensajeError && (
          <p className={estilos.mensajeError} role="alert">
            {mensajeError}
          </p>
        )}

        {esCasoConflicto && (
          <div className={estilos.alertaConflicto} role="alert">
            <span aria-hidden="true" className={estilos.iconoAlerta}>
              !
            </span>
            <p className={estilos.textoConflicto}>
              <strong>Conflicto detectado:</strong> Hay revisores que son coautores o
              pertenecen a la misma institución del autor de correspondencia. No es
              posible asignar a un coautor.
            </p>
          </div>
        )}

        <div className={estilos.filaBusqueda}>
          <input
            type="text"
            className={estilos.campoBusqueda}
            aria-label="Buscar revisor"
            placeholder="Buscar revisor por nombre, institución o línea de interés…"
            value={terminoBusqueda}
            onChange={evento => cambiarTerminoBusqueda(evento.target.value)}
          />
          <span className={estilos.avisoRegla}>Mínimo 2 · máximo 3 revisores</span>
        </div>

        <div className={estilos.contenedorTabla}>
          <table className={estilos.tabla}>
            <thead>
              <tr>
                <th style={{ width: 38 }}></th>
                <th>REVISOR</th>
                <th>LÍNEAS DE INTERÉS</th>
                <th>CARGA ACTUAL</th>
                <th>CONFLICTO</th>
              </tr>
            </thead>
            <tbody>
              {cargandoCandidatos ? (
                <tr>
                  <td colSpan={5} className={estilos.celdaLineas}>
                    Cargando revisores disponibles…
                  </td>
                </tr>
              ) : (
                revisoresFiltrados.map(revisor => {
                  const seleccionado = revisoresSeleccionados.includes(revisor.id)
                  const esCoautor = revisor.conflicto?.tipo === 'coautor'
                  const esInstitucion = revisor.conflicto?.tipo === 'institucion'
                  const deshabilitado = guardando || esCoautor || revisor.yaAsignado

                  let claseFila = ''
                  if (esCoautor) {
                    claseFila = estilos.filaCoautor
                  } else if (esInstitucion) {
                    claseFila = estilos.filaInstitucion
                  } else if (seleccionado) {
                    claseFila = estilos.filaSeleccionada
                  }

                  return (
                    <tr
                      key={revisor.id}
                      className={claseFila}
                      onClick={() => !deshabilitado && alternarRevisor(revisor.id)}
                    >
                      <td>
                        <input
                          type="checkbox"
                          className={estilos.casilla}
                          checked={seleccionado}
                          aria-label={`Seleccionar a ${revisor.nombre}`}
                          disabled={deshabilitado}
                          onChange={() => alternarRevisor(revisor.id)}
                          onClick={evento => evento.stopPropagation()}
                        />
                      </td>
                      <td className={estilos.celdaNombre}>
                        {revisor.nombre}
                        {revisor.yaAsignado ? ' (ya asignado)' : ''}
                      </td>
                      <td className={estilos.celdaLineas}>
                        {revisor.lineasInteres.join(' · ') || 'Sin líneas declaradas'}
                      </td>
                      <td className={estilos.celdaCarga}>{revisor.cargaTexto}</td>
                      <td>
                        {esCoautor && (
                          <span className={estilos.estadoCoautor}>
                            {revisor.conflicto.etiqueta}
                          </span>
                        )}
                        {esInstitucion && (
                          <span className={estilos.estadoInstitucion}>
                            {revisor.conflicto.etiqueta}
                          </span>
                        )}
                        {!esCoautor && !esInstitucion && (
                          <span className={estilos.estadoSinConflicto}>
                            Sin conflicto
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {esCasoConflicto ? (
          <div className={estilos.bloqueJustificacion}>
            <label className={estilos.etiquetaJustificacion}>
              <input
                type="checkbox"
                className={estilos.casilla}
                checked={permitirMismaInstitucion}
                onChange={evento =>
                  cambiarPermitirMismaInstitucion(evento.target.checked)
                }
              />
              <span>
                Asignar de todos modos al revisor de la misma institución (requiere
                justificación del comité).
              </span>
            </label>
            {permitirMismaInstitucion && (
              <label>
                Justificación del comité *
                <textarea
                  value={justificacion}
                  onChange={evento => setJustificacion(evento.target.value)}
                />
              </label>
            )}
            <label htmlFor="conflict-deadline">Fecha límite de revisión *</label>
            <input
              id="conflict-deadline"
              value={fechaLimite}
              onChange={evento => cambiarFechaLimite(evento.target.value)}
            />
          </div>
        ) : (
          <div className={estilos.bloqueFecha}>
            <label className={estilos.etiquetaFecha} htmlFor="fecha-revision">
              FECHA LÍMITE DE LA REVISIÓN
            </label>
            <div className={estilos.contenedorCampoFecha}>
              <input
                id="fecha-revision"
                type="text"
                className={estilos.campoFecha}
                value={fechaLimite}
                onChange={evento => cambiarFechaLimite(evento.target.value)}
              />
              <span aria-hidden="true" className={estilos.iconoCalendario}>
                ▤
              </span>
            </div>
          </div>
        )}

        <footer className={estilos.pieModal}>
          <div className={estilos.resumenSeleccion}>
            {!puedeGuardar ? (
              <span className={estilos.avisoFaltante}>
                Seleccione entre {minimoRequerido} y {maximoPermitido} revisor(es) válidos
              </span>
            ) : (
              <span className={estilos.conteoSeleccion}>
                {cantidadValida} revisor(es) seleccionado(s)
              </span>
            )}
          </div>
          <div className={estilos.accionesPie}>
            <Boton variant="secondary" type="button" onClick={alCerrar}>
              Cancelar
            </Boton>
            <Boton
              variant="primary"
              type="button"
              loading={guardando}
              disabled={!puedeGuardar}
              onClick={guardarAsignacion}
            >
              Asignar y notificar
            </Boton>
          </div>
        </footer>
      </fieldset>
    </ModalBase>
  )
}
