import { useState as usarEstado, useMemo as usarMemo } from 'react'
import ModalBase from '../../../../core/ui/Modal/Modal.jsx'
import Boton from '../../../../core/ui/Button/Button.jsx'
import estilos from './AssignReviewersModal.module.css'

export default function ModalAsignarRevisores({
  guardando = false,
  error = '',
  abierto = false,
  alCerrar,
  trabajosObjetivo = [],
  revisores = [],
  alConfirmarAsignacion,
}) {
  const primerTrabajo = trabajosObjetivo[0]
  const [terminoBusqueda, cambiarTerminoBusqueda] = usarEstado('')
  const [revisoresSeleccionados, cambiarRevisoresSeleccionados] = usarEstado(() => [])
  const [permitirMismaInstitucion, cambiarPermitirMismaInstitucion] = usarEstado(false)
  const [fechaLimite, cambiarFechaLimite] = usarEstado('20/10/2026')

  const [justification, setJustification] = usarEstado('')
  const listaRevisores = usarMemo(
    () =>
      revisores
        .filter(reviewer => !reviewer.bloqueado)
        .map(reviewer => {
          const coauthor = trabajosObjetivo.some(
            work =>
              work.details?.autores?.some(
                author =>
                  Boolean(
                    author.correo &&
                    reviewer.email &&
                    author.correo.toLowerCase() === reviewer.email.toLowerCase()
                  ) || author.nombre === reviewer.nombre
              ) || work.autores.some(name => reviewer.nombre.includes(name))
          )
          const sameInstitution = trabajosObjetivo.some(
            work => work.institucion === reviewer.institucion
          )
          let conflicto = {
            tipo: 'ninguno',
            etiqueta: 'Sin conflicto',
            bloqueante: false,
          }
          if (coauthor) {
            conflicto = {
              tipo: 'coautor',
              etiqueta: 'Coautor del trabajo',
              bloqueante: true,
            }
          } else if (sameInstitution) {
            conflicto = {
              tipo: 'institucion',
              etiqueta: 'Misma institución',
              bloqueante: false,
            }
          }
          return {
            ...reviewer,
            cargaTexto: `${reviewer.asignadas} revisiones`,
            conflicto,
          }
        }),
    [revisores, trabajosObjetivo]
  )
  const esCasoConflicto = listaRevisores.some(
    reviewer => reviewer.conflicto.tipo !== 'ninguno'
  )

  const revisoresFiltrados = usarMemo(() => {
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

  const alternarRevisor = revisorId => {
    if (guardando) {
      return
    }
    const elemento = listaRevisores.find(revisor => revisor.id === revisorId)
    if (elemento?.conflicto?.bloqueante) {
      return
    }

    if (revisoresSeleccionados.includes(revisorId)) {
      cambiarRevisoresSeleccionados(
        revisoresSeleccionados.filter(identificador => identificador !== revisorId)
      )
    } else {
      if (revisoresSeleccionados.length >= 3) {
        return
      }
      cambiarRevisoresSeleccionados([...revisoresSeleccionados, revisorId])
    }
  }

  const seleccionTieneInstitucion = revisoresSeleccionados.some(identificador => {
    const elemento = listaRevisores.find(revisor => revisor.id === identificador)
    return elemento?.conflicto?.tipo === 'institucion'
  })

  const cantidadValida = revisoresSeleccionados.length
  const cumpleCantidad = cantidadValida >= 2 && cantidadValida <= 3
  const bloqueadoPorInstitucion = seleccionTieneInstitucion && !permitirMismaInstitucion
  const validDate =
    /^\d{2}\/\d{2}\/\d{4}$/.test(fechaLimite) &&
    Number.isFinite(Date.parse(fechaLimite.split('/').reverse().join('-')))
  const puedeGuardar =
    cumpleCantidad &&
    !bloqueadoPorInstitucion &&
    (!seleccionTieneInstitucion || Boolean(justification.trim())) &&
    validDate

  const guardarAsignacion = async () => {
    if (guardando || !puedeGuardar) {
      return
    }
    const guardado = await alConfirmarAsignacion({
      codigosTrabajo: trabajosObjetivo.map(trabajo => trabajo.codigo),
      idsRevisores: revisoresSeleccionados,
      fechaLimite,
      justificacion: justification.trim(),
    })
    if (!guardado) {
      return
    }
    alCerrar()
  }

  const tituloCorto =
    primerTrabajo.codigo === 'TRB-2026-042'
      ? 'Predicción de deserción universitaria'
      : primerTrabajo.titulo

  const textoReferencia = `${primerTrabajo.codigo} · ${tituloCorto} · ${primerTrabajo.eje}`

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
      <fieldset className={estilos.cuerpoModal} disabled={guardando}>
        {error && (
          <p className={estilos.mensajeError} role="alert">
            {error}
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

        {!esCasoConflicto && (
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
        )}

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
              {revisoresFiltrados.map(revisor => {
                const seleccionado = revisoresSeleccionados.includes(revisor.id)
                const esCoautor = revisor.conflicto.tipo === 'coautor'
                const esInstitucion = revisor.conflicto.tipo === 'institucion'

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
                    onClick={() => !esCoautor && alternarRevisor(revisor.id)}
                  >
                    <td>
                      <input
                        type="checkbox"
                        className={estilos.casilla}
                        checked={seleccionado}
                        aria-label={`Seleccionar a ${revisor.nombre}`}
                        disabled={guardando || esCoautor}
                        onChange={() => alternarRevisor(revisor.id)}
                        onClick={evento => evento.stopPropagation()}
                      />
                    </td>
                    <td className={estilos.celdaNombre}>{revisor.nombre}</td>
                    <td className={estilos.celdaLineas}>
                      {revisor.lineasInteres.join(' · ')}
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
                        <span className={estilos.estadoSinConflicto}>Sin conflicto</span>
                      )}
                    </td>
                  </tr>
                )
              })}
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
                  value={justification}
                  onChange={event => setJustification(event.target.value)}
                />
              </label>
            )}
            <label htmlFor="conflict-deadline">Fecha límite de revisión *</label>
            <input
              id="conflict-deadline"
              value={fechaLimite}
              onChange={event => cambiarFechaLimite(event.target.value)}
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
                Seleccione al menos 2 revisores sin conflicto
              </span>
            ) : (
              <span className={estilos.conteoSeleccion}>
                {cantidadValida} revisores seleccionados
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
