import { useState as usarEstado } from 'react'
import ModalBase from '../../../../core/ui/Modal/Modal.jsx'
import Boton from '../../../../core/ui/Button/Button.jsx'
import estilos from './ReassignModal.module.css'

export default function ModalReasignar({
  guardando = false,
  error = '',
  abierto = false,
  alCerrar,
  itemPendiente,
  revisores = [],
  alConfirmarReasignacion,
}) {
  const [nuevoRevisorId, cambiarNuevoRevisorId] = usarEstado('')
  const [motivo, cambiarMotivo] = usarEstado('')
  const [errorValidacion, cambiarErrorValidacion] = usarEstado('')

  if (!abierto || !itemPendiente) {
    return null
  }

  const candidatos = revisores.filter(revisor => revisor.id !== itemPendiente.revisorId)

  const enviarReasignacion = async evento => {
    evento.preventDefault()
    if (guardando) {
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

    const nuevoRevisor = revisores.find(revisor => revisor.id === nuevoRevisorId)

    const guardado = await alConfirmarReasignacion({
      pendienteId: itemPendiente.id,
      codigo: itemPendiente.codigo,
      revisorAnterior: itemPendiente.revisor,
      nuevoRevisorId,
      nuevoRevisorNombre: nuevoRevisor?.nombre || '',
      motivo: motivo.trim(),
    })

    if (!guardado) {
      return
    }
    cambiarMotivo('')
    cambiarNuevoRevisorId('')
    cambiarErrorValidacion('')
    alCerrar()
  }

  return (
    <ModalBase
      alCerrar={() => {
        if (!guardando) {
          alCerrar()
        }
      }}
      titulo="Reasignar revisor"
    >
      <form onSubmit={enviarReasignacion}>
        <fieldset className={estilos.cuerpoModal} disabled={guardando}>
          <div className={estilos.resumenElemento}>
            <p className={estilos.tituloTrabajo}>
              <strong>{itemPendiente.codigo}</strong> · {itemPendiente.trabajo}
            </p>
            <p className={estilos.revisorActual}>
              Revisor actual: <strong>{itemPendiente.revisor}</strong>
              <span className={estilos.alertaVencida}> ({itemPendiente.estado})</span>
            </p>
          </div>

          {(error || errorValidacion) && (
            <p className={estilos.mensajeError} role="alert">
              {error || errorValidacion}
            </p>
          )}

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
                cambiarErrorValidacion('')
              }}
            >
              <option value="">Seleccione un revisor disponible…</option>
              {candidatos.map(revisor => (
                <option key={revisor.id} value={revisor.id}>
                  {revisor.nombre} ({revisor.institucion} — {revisor.asignadas} revisiones
                  asignadas)
                </option>
              ))}
            </select>
          </div>

          <div className={estilos.grupoCampo}>
            <label className={estilos.etiqueta} htmlFor="motivo-cambio">
              MOTIVO DE LA REASIGNACIÓN *
            </label>
            <textarea
              id="motivo-cambio"
              className={estilos.areaTexto}
              rows={3}
              placeholder="Explique el motivo del cambio (ej. incumplimiento de plazo, sobrecarga o indisponibilidad)…"
              value={motivo}
              onChange={evento => {
                cambiarMotivo(evento.target.value)
                cambiarErrorValidacion('')
              }}
            />
            <span className={estilos.textoAyuda}>
              Este motivo quedará registrado en el historial de la edición.
            </span>
          </div>

          <footer className={estilos.pieModal}>
            <Boton variant="secondary" type="button" onClick={alCerrar}>
              Cancelar
            </Boton>
            <Boton variant="primary" type="submit">
              Confirmar reasignación
            </Boton>
          </footer>
        </fieldset>
      </form>
    </ModalBase>
  )
}
