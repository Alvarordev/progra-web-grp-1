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
  const codigoTrabajo = primerTrabajo?.codigo ?? 'TRB-2026-031'
  const esCasoConflicto =
    codigoTrabajo === 'TRB-2026-042' ||
    trabajosObjetivo.some((trabajo) =>
      trabajo.autores?.some((autor) => autor.includes('Yupanqui'))
    )

  const [terminoBusqueda, cambiarTerminoBusqueda] = usarEstado('')
  const [revisoresSeleccionados, cambiarRevisoresSeleccionados] = usarEstado(() =>
    esCasoConflicto ? ['rev-1'] : ['rev-1', 'rev-2']
  )
  const [permitirMismaInstitucion, cambiarPermitirMismaInstitucion] = usarEstado(false)
  const [fechaLimite, cambiarFechaLimite] = usarEstado('20/10/2026')

  const listaRevisores = usarMemo(() => {
    if (esCasoConflicto) {
      return [
        {
          id: 'rev-1',
          nombre: 'Mg. Luis Ramírez Cárdenas',
          institucion: 'Pontificia Universidad Católica',
          lineasInteres: ['IA y datos', 'Ingeniería de software'],
          cargaTexto: '4 revisiones',
          conflicto: { tipo: 'ninguno', etiqueta: 'Sin conflicto', bloqueante: false },
        },
        {
          id: 'rev-4',
          nombre: 'Dra. Milagros Yupanqui Ríos',
          institucion: 'Universidad de Lima',
          lineasInteres: ['Salud y sociedad'],
          cargaTexto: '3 revisiones',
          conflicto: { tipo: 'coautor', etiqueta: 'Coautora del trabajo', bloqueante: true },
        },
        {
          id: 'rev-3',
          nombre: 'Ing. Jorge Palomino Ávila',
          institucion: 'Universidad de Lima',
          lineasInteres: ['Innovación', 'IA y datos'],
          cargaTexto: '5 revisiones',
          conflicto: { tipo: 'institucion', etiqueta: 'Misma institución', bloqueante: false },
        },
        {
          id: 'rev-5',
          nombre: 'Dr. Óscar Nakamura Trigoso',
          institucion: 'Pontificia Universidad Católica',
          lineasInteres: ['IA y datos', 'Economía'],
          cargaTexto: '1 revisión',
          conflicto: { tipo: 'ninguno', etiqueta: 'Sin conflicto', bloqueante: false },
        },
      ]
    }

    const baseRevisores = revisores.length > 0 ? revisores.slice(0, 4) : []
    return baseRevisores.map((revisor) => {
      const lineas =
        revisor.id === 'rev-2'
          ? ['Ingeniería de software', 'Sostenibilidad']
          : revisor.lineasInteres
      const carga =
        revisor.id === 'rev-1' ? 4 : revisor.id === 'rev-2' ? 2 : revisor.asignadas
      return {
        ...revisor,
        lineasInteres: lineas,
        cargaTexto: `${carga} ${carga === 1 ? 'revisión' : 'revisiones'}`,
        conflicto: { tipo: 'ninguno', etiqueta: 'Sin conflicto', bloqueante: false },
      }
    })
  }, [esCasoConflicto, revisores])

  const revisoresFiltrados = usarMemo(() => {
    const consulta = terminoBusqueda.toLowerCase().trim()
    if (!consulta) return listaRevisores
    return listaRevisores.filter(
      (revisor) =>
        revisor.nombre.toLowerCase().includes(consulta) ||
        revisor.institucion.toLowerCase().includes(consulta) ||
        revisor.lineasInteres.some((linea) => linea.toLowerCase().includes(consulta))
    )
  }, [listaRevisores, terminoBusqueda])

  if (!abierto || trabajosObjetivo.length === 0) return null

  const alternarRevisor = (revisorId) => {
    const elemento = listaRevisores.find((revisor) => revisor.id === revisorId)
    if (elemento?.conflicto?.bloqueante) return

    if (revisoresSeleccionados.includes(revisorId)) {
      cambiarRevisoresSeleccionados(
        revisoresSeleccionados.filter((identificador) => identificador !== revisorId)
      )
    } else {
      if (revisoresSeleccionados.length >= 3) return
      cambiarRevisoresSeleccionados([...revisoresSeleccionados, revisorId])
    }
  }

  const seleccionTieneInstitucion = revisoresSeleccionados.some((identificador) => {
    const elemento = listaRevisores.find((revisor) => revisor.id === identificador)
    return elemento?.conflicto?.tipo === 'institucion'
  })

  const cantidadValida = revisoresSeleccionados.length
  const cumpleCantidad = cantidadValida >= 2 && cantidadValida <= 3
  const bloqueadoPorInstitucion = seleccionTieneInstitucion && !permitirMismaInstitucion
  const puedeGuardar = cumpleCantidad && !bloqueadoPorInstitucion

  const guardarAsignacion = async () => {
    if (guardando || !puedeGuardar) return
    const guardado = await alConfirmarAsignacion({
      codigosTrabajo: trabajosObjetivo.map((trabajo) => trabajo.codigo),
      idsRevisores: revisoresSeleccionados,
      fechaLimite,
    })
    if (!guardado) return
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
        if (!guardando) alCerrar()
      }}
      titulo="Asignar revisores"
    >
      <fieldset className={estilos.cuerpoModal} disabled={guardando}>
        <div className={estilos.referenciaTrabajo}>
          <p className={estilos.subtitulo}>{textoReferencia}</p>
        </div>

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
              <strong>Conflicto detectado:</strong> 1 revisor es coautor del trabajo y otro pertenece a la misma institución del autor de correspondencia. No es posible asignar a un coautor.
            </p>
          </div>
        )}

        {!esCasoConflicto && (
          <div className={estilos.filaBusqueda}>
            <input
              type="text"
              className={estilos.campoBusqueda}
              placeholder="Buscar revisor por nombre, institución o línea de interés…"
              value={terminoBusqueda}
              onChange={(evento) => cambiarTerminoBusqueda(evento.target.value)}
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
              {revisoresFiltrados.map((revisor) => {
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
                        disabled={esCoautor}
                        onChange={() => alternarRevisor(revisor.id)}
                        onClick={(evento) => evento.stopPropagation()}
                      />
                    </td>
                    <td className={estilos.celdaNombre}>{revisor.nombre}</td>
                    <td className={estilos.celdaLineas}>
                      {revisor.lineasInteres.join(' · ')}
                    </td>
                    <td className={estilos.celdaCarga}>{revisor.cargaTexto}</td>
                    <td>
                      {esCoautor && (
                        <span className={estilos.estadoCoautor}>{revisor.conflicto.etiqueta}</span>
                      )}
                      {esInstitucion && (
                        <span className={estilos.estadoInstitucion}>{revisor.conflicto.etiqueta}</span>
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
                onChange={(evento) => cambiarPermitirMismaInstitucion(evento.target.checked)}
              />
              <span>
                Asignar de todos modos al revisor de la misma institución (requiere justificación del comité).
              </span>
            </label>
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
                onChange={(evento) => cambiarFechaLimite(evento.target.value)}
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
