import { useEffect, useState } from 'react'
import ModalBase from '../../../../core/ui/Modal/Modal.jsx'
import Boton from '../../../../core/ui/Button/Button.jsx'
import { obtenerCandidatosAsignacion } from '../../../../core/utils/asignacionesApi.js'
import estilos from './ReassignModal.module.css'

export default function ModalReasignar({
  modo = 'reasignar',
  guardando = false,
  error = '',
  abierto = false,
  alCerrar,
  itemPendiente,
  alConfirmarReasignacion,
  alConfirmarRetiro,
}) {
  const esRetiro = modo === 'retirar'
  const [nuevoRevisorId, cambiarNuevoRevisorId] = useState('')
  const [motivo, cambiarMotivo] = useState('')
  const [permitirMismaInstitucion, cambiarPermitirMismaInstitucion] = useState(false)
  const [errorValidacion, cambiarErrorValidacion] = useState('')

  const [candidatos, setCandidatos] = useState([])
  const [cargandoCandidatos, setCargandoCandidatos] = useState(
    Boolean(abierto && itemPendiente && !esRetiro)
  )

  useEffect(() => {
    if (!abierto || !itemPendiente || esRetiro) {
      return undefined
    }

    let activo = true
    obtenerCandidatosAsignacion({ codigos: [itemPendiente.codigo] })
      .then(respuesta => {
        if (activo) {
          setCandidatos(respuesta.candidatos ?? [])
        }
      })
      .catch(causa => {
        if (activo) {
          cambiarErrorValidacion(causa.message)
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
  }, [abierto, esRetiro, itemPendiente])

  if (!abierto || !itemPendiente) {
    return null
  }

  const disponibles = candidatos.filter(
    revisor => revisor.id !== itemPendiente.revisorId && !revisor.yaAsignado
  )
  const seleccionado = disponibles.find(revisor => revisor.id === nuevoRevisorId)
  const tieneConflictoInstitucion = seleccionado?.conflicto?.tipo === 'institucion'

  const manejarEnvio = async evento => {
    evento.preventDefault()
    if (guardando || cargandoCandidatos) {
      return
    }

    if (esRetiro) {
      if (!motivo.trim()) {
        cambiarErrorValidacion('El motivo del retiro es obligatorio.')
        return
      }
      const retirado = await alConfirmarRetiro({
        asignacionId: itemPendiente.asignacionId,
        codigo: itemPendiente.codigo,
        revisorAnterior: itemPendiente.revisor,
        motivo: motivo.trim(),
      })
      if (retirado) {
        alCerrar()
      }
      return
    }

    if (!nuevoRevisorId) {
      cambiarErrorValidacion('Debe seleccionar un nuevo revisor.')
      return
    }
    if (!motivo.trim()) {
      cambiarErrorValidacion('El motivo de la reasignación es obligatorio.')
      return
    }
    if (tieneConflictoInstitucion && !permitirMismaInstitucion) {
      cambiarErrorValidacion(
        'Confirme la excepción para asignar a un revisor de la misma institución.'
      )
      return
    }

    const guardado = await alConfirmarReasignacion({
      asignacionId: itemPendiente.asignacionId,
      codigo: itemPendiente.codigo,
      revisorAnterior: itemPendiente.revisor,
      nuevoRevisorId,
      nuevoRevisorNombre: seleccionado?.nombre || '',
      motivo: motivo.trim(),
      permitirMismaInstitucion: tieneConflictoInstitucion ? true : undefined,
      justificacion: tieneConflictoInstitucion ? motivo.trim() : undefined,
    })

    if (guardado) {
      alCerrar()
    }
  }

  return (
    <ModalBase
      alCerrar={() => {
        if (!guardando) {
          alCerrar()
        }
      }}
      titulo={esRetiro ? 'Retirar revisor' : 'Reasignar revisor'}
    >
      <form onSubmit={manejarEnvio}>
        <fieldset
          className={estilos.cuerpoModal}
          disabled={guardando || cargandoCandidatos}
        >
          <div className={estilos.resumenElemento}>
            <p className={estilos.tituloTrabajo}>
              <strong>{itemPendiente.codigo}</strong> · {itemPendiente.trabajo}
            </p>
            <p className={estilos.revisorActual}>
              Revisor actual: <strong>{itemPendiente.revisor}</strong>
              <span className={estilos.alertaVencida}>
                {' '}
                ({itemPendiente.etiquetaEstado ?? itemPendiente.estado})
              </span>
            </p>
          </div>

          {(error || errorValidacion) && (
            <p className={estilos.mensajeError} role="alert">
              {error || errorValidacion}
            </p>
          )}

          {!esRetiro && (
            <div className={estilos.grupoCampo}>
              <label className={estilos.etiqueta} htmlFor="selector-nuevo-revisor">
                SELECCIONAR NUEVO REVISOR *
              </label>
              <select
                id="selector-nuevo-revisor"
                className={estilos.selector}
                value={nuevoRevisorId}
                onChange={evento => {
                  cambiarNuevoRevisorId(evento.target.value)
                  cambiarPermitirMismaInstitucion(false)
                  cambiarErrorValidacion('')
                }}
              >
                <option value="">
                  {cargandoCandidatos
                    ? 'Cargando revisores disponibles…'
                    : 'Seleccione un revisor disponible…'}
                </option>
                {disponibles.map(revisor => {
                  const esCoautor = revisor.conflicto?.tipo === 'coautor'
                  let sufijoConflicto = ''
                  if (esCoautor) {
                    sufijoConflicto = ' · Coautor (bloqueado)'
                  } else if (revisor.conflicto?.tipo === 'institucion') {
                    sufijoConflicto = ' · Misma institución'
                  }
                  return (
                    <option key={revisor.id} value={revisor.id} disabled={esCoautor}>
                      {revisor.nombre} ({revisor.institucion} — {revisor.asignadas}{' '}
                      asignadas{sufijoConflicto})
                    </option>
                  )
                })}
              </select>
            </div>
          )}

          {!esRetiro && tieneConflictoInstitucion && (
            <div className={estilos.grupoCampo}>
              <label className={estilos.etiqueta}>
                <input
                  type="checkbox"
                  checked={permitirMismaInstitucion}
                  onChange={evento => {
                    cambiarPermitirMismaInstitucion(evento.target.checked)
                    cambiarErrorValidacion('')
                  }}
                />{' '}
                Confirmar asignación a revisor de la misma institución (el motivo quedará
                como justificación)
              </label>
            </div>
          )}

          <div className={estilos.grupoCampo}>
            <label className={estilos.etiqueta} htmlFor="motivo-cambio">
              {esRetiro ? 'MOTIVO DEL RETIRO *' : 'MOTIVO DE LA REASIGNACIÓN *'}
            </label>
            <textarea
              id="motivo-cambio"
              className={estilos.areaTexto}
              rows={3}
              placeholder={
                esRetiro
                  ? 'Explique el motivo por el cual se retira al revisor del trabajo…'
                  : 'Explique el motivo del cambio (ej. incumplimiento de plazo, sobrecarga o indisponibilidad)…'
              }
              value={motivo}
              onChange={evento => {
                cambiarMotivo(evento.target.value)
                cambiarErrorValidacion('')
              }}
            />
            <span className={estilos.textoAyuda}>
              Este motivo quedará registrado en el historial de asignaciones del trabajo.
            </span>
          </div>

          <footer className={estilos.pieModal}>
            <Boton variant="secondary" type="button" onClick={alCerrar}>
              Cancelar
            </Boton>
            <Boton
              variant={esRetiro ? 'destructive' : 'primary'}
              type="submit"
              loading={guardando}
            >
              {esRetiro ? 'Confirmar retiro' : 'Confirmar reasignación'}
            </Boton>
          </footer>
        </fieldset>
      </form>
    </ModalBase>
  )
}
