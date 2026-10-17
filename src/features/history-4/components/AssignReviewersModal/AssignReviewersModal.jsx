import { useState, useMemo } from 'react'
import Modal from '../../../../core/ui/Modal/Modal.jsx'
import Button from '../../../../core/ui/Button/Button.jsx'
import styles from './AssignReviewersModal.module.css'

export default function AssignReviewersModal({
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
  const esCasoConflicto = codigoTrabajo === 'TRB-2026-042' || trabajosObjetivo.some((t) =>
    t.autores?.some((autor) => autor.includes('Yupanqui'))
  )

  const [terminoBusqueda, setTerminoBusqueda] = useState('')
  const [revisoresSeleccionados, setRevisoresSeleccionados] = useState(() =>
    esCasoConflicto ? ['rev-1'] : ['rev-1', 'rev-2']
  )
  const [permitirMismaInstitucion, setPermitirMismaInstitucion] = useState(false)
  const [fechaLimite, setFechaLimite] = useState('20/10/2026')

  const listaRevisores = useMemo(() => {
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

    const base = revisores.length > 0 ? revisores.slice(0, 4) : []
    return base.map((rev) => {
      const lineas = rev.id === 'rev-2'
        ? ['Ingeniería de software', 'Sostenibilidad']
        : rev.lineasInteres
      const carga = rev.id === 'rev-1' ? 4 : rev.id === 'rev-2' ? 2 : rev.asignadas
      return {
        ...rev,
        lineasInteres: lineas,
        cargaTexto: `${carga} ${carga === 1 ? 'revisión' : 'revisiones'}`,
        conflicto: { tipo: 'ninguno', etiqueta: 'Sin conflicto', bloqueante: false },
      }
    })
  }, [esCasoConflicto, revisores])

  const revisoresFiltrados = useMemo(() => {
    const consulta = terminoBusqueda.toLowerCase().trim()
    if (!consulta) return listaRevisores
    return listaRevisores.filter((rev) =>
      rev.nombre.toLowerCase().includes(consulta) ||
      rev.institucion.toLowerCase().includes(consulta) ||
      rev.lineasInteres.some((linea) => linea.toLowerCase().includes(consulta))
    )
  }, [listaRevisores, terminoBusqueda])

  if (!abierto || trabajosObjetivo.length === 0) return null

  const alternarRevisor = (revisorId) => {
    const item = listaRevisores.find((r) => r.id === revisorId)
    if (item?.conflicto?.bloqueante) return

    if (revisoresSeleccionados.includes(revisorId)) {
      setRevisoresSeleccionados(revisoresSeleccionados.filter((id) => id !== revisorId))
    } else {
      if (revisoresSeleccionados.length >= 3) return
      setRevisoresSeleccionados([...revisoresSeleccionados, revisorId])
    }
  }

  const seleccionTieneInstitucion = revisoresSeleccionados.some((id) => {
    const item = listaRevisores.find((r) => r.id === id)
    return item?.conflicto?.tipo === 'institucion'
  })

  const cantidadValida = revisoresSeleccionados.length
  const cumpleCantidad = cantidadValida >= 2 && cantidadValida <= 3
  const bloqueadoPorInstitucion = seleccionTieneInstitucion && !permitirMismaInstitucion
  const puedeGuardar = cumpleCantidad && !bloqueadoPorInstitucion

  const guardarAsignacion = async () => {
    if (guardando || !puedeGuardar) return
    const guardado = await alConfirmarAsignacion({
      codigosTrabajo: trabajosObjetivo.map((t) => t.codigo),
      idsRevisores: revisoresSeleccionados,
      fechaLimite,
    })
    if (!guardado) return
    alCerrar()
  }

  const tituloCorto = primerTrabajo.codigo === 'TRB-2026-042'
    ? 'Predicción de deserción universitaria'
    : primerTrabajo.titulo

  const textoReferencia = `${primerTrabajo.codigo} · ${tituloCorto} · ${primerTrabajo.eje}`

  return (
    <Modal alCerrar={() => { if (!guardando) alCerrar() }} titulo="Asignar revisores">
      <fieldset className={styles.cuerpoModal} disabled={guardando}>
        <div className={styles.referenciaTrabajo}>
          <p className={styles.subtitulo}>{textoReferencia}</p>
        </div>

        {error && <p className={styles.mensajeError} role="alert">{error}</p>}

        {esCasoConflicto && (
          <div className={styles.alertaConflicto} role="alert">
            <span aria-hidden="true" className={styles.iconoAlerta}>!</span>
            <p className={styles.textoConflicto}>
              <strong>Conflicto detectado:</strong> 1 revisor es coautor del trabajo y otro pertenece a la misma institución del autor de correspondencia. No es posible asignar a un coautor.
            </p>
          </div>
        )}

        {!esCasoConflicto && (
          <div className={styles.filaBusqueda}>
            <input
              type="text"
              className={styles.campoBusqueda}
              placeholder="Buscar revisor por nombre, institución o línea de interés…"
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
            />
            <span className={styles.avisoRegla}>Mínimo 2 · máximo 3 revisores</span>
          </div>
        )}

        <div className={styles.contenedorTabla}>
          <table className={styles.tabla}>
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
              {revisoresFiltrados.map((rev) => {
                const seleccionado = revisoresSeleccionados.includes(rev.id)
                const esCoautor = rev.conflicto.tipo === 'coautor'
                const esInstitucion = rev.conflicto.tipo === 'institucion'

                let claseFila = ''
                if (esCoautor) {
                  claseFila = styles.filaCoautor
                } else if (esInstitucion) {
                  claseFila = styles.filaInstitucion
                } else if (seleccionado) {
                  claseFila = styles.filaSeleccionada
                }

                return (
                  <tr
                    key={rev.id}
                    className={claseFila}
                    onClick={() => !esCoautor && alternarRevisor(rev.id)}
                  >
                    <td>
                      <input
                        type="checkbox"
                        className={styles.casilla}
                        checked={seleccionado}
                        disabled={esCoautor}
                        onChange={() => alternarRevisor(rev.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className={styles.celdaNombre}>{rev.nombre}</td>
                    <td className={styles.celdaLineas}>
                      {rev.lineasInteres.join(' · ')}
                    </td>
                    <td className={styles.celdaCarga}>{rev.cargaTexto}</td>
                    <td>
                      {esCoautor && (
                        <span className={styles.estadoCoautor}>{rev.conflicto.etiqueta}</span>
                      )}
                      {esInstitucion && (
                        <span className={styles.estadoInstitucion}>{rev.conflicto.etiqueta}</span>
                      )}
                      {!esCoautor && !esInstitucion && (
                        <span className={styles.estadoSinConflicto}>Sin conflicto</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {esCasoConflicto ? (
          <div className={styles.bloqueJustificacion}>
            <label className={styles.etiquetaJustificacion}>
              <input
                type="checkbox"
                className={styles.casilla}
                checked={permitirMismaInstitucion}
                onChange={(e) => setPermitirMismaInstitucion(e.target.checked)}
              />
              <span>
                Asignar de todos modos al revisor de la misma institución (requiere justificación del comité).
              </span>
            </label>
          </div>
        ) : (
          <div className={styles.bloqueFecha}>
            <label className={styles.etiquetaFecha} htmlFor="fecha-revision">
              FECHA LÍMITE DE LA REVISIÓN
            </label>
            <div className={styles.contenedorInputFecha}>
              <input
                id="fecha-revision"
                type="text"
                className={styles.campoFecha}
                value={fechaLimite}
                onChange={(e) => setFechaLimite(e.target.value)}
              />
              <span aria-hidden="true" className={styles.iconoCalendario}>▤</span>
            </div>
          </div>
        )}

        <footer className={styles.pieModal}>
          <div className={styles.resumenSeleccion}>
            {!puedeGuardar ? (
              <span className={styles.avisoFaltante}>Seleccione al menos 2 revisores sin conflicto</span>
            ) : (
              <span className={styles.conteoSeleccion}>{cantidadValida} revisores seleccionados</span>
            )}
          </div>
          <div className={styles.accionesPie}>
            <Button variant="secondary" type="button" onClick={alCerrar}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              type="button"
              disabled={!puedeGuardar}
              onClick={guardarAsignacion}
            >
              Asignar y notificar
            </Button>
          </div>
        </footer>
      </fieldset>
    </Modal>
  )
}
