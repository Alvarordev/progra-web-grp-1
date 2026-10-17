import { useState } from 'react'
import Modal from '../../../../core/ui/Modal/Modal.jsx'
import Button from '../../../../core/ui/Button/Button.jsx'
import styles from './ReassignModal.module.css'

export default function ReassignModal({
  guardando = false,
  error = '',
  abierto = false,
  alCerrar,
  itemPendiente,
  revisores = [],
  alConfirmarReasignacion,
}) {
  const [nuevoRevisorId, setNuevoRevisorId] = useState('')
  const [motivo, setMotivo] = useState('')
  const [errorValidacion, setErrorValidacion] = useState('')

  if (!abierto || !itemPendiente) return null

  const candidatos = revisores.filter((r) => r.id !== itemPendiente.revisorId)

  const enviarReasignacion = async (e) => {
    e.preventDefault()
    if (guardando) return
    if (!nuevoRevisorId) {
      setErrorValidacion('Debe seleccionar un nuevo revisor.')
      return
    }
    if (!motivo.trim()) {
      setErrorValidacion('El motivo de la reasignación es obligatorio.')
      return
    }

    const nuevoRevisor = revisores.find((r) => r.id === nuevoRevisorId)

    const guardado = await alConfirmarReasignacion({
      pendienteId: itemPendiente.id,
      codigo: itemPendiente.codigo,
      revisorAnterior: itemPendiente.revisor,
      nuevoRevisorId,
      nuevoRevisorNombre: nuevoRevisor?.nombre || '',
      motivo: motivo.trim(),
    })

    if (!guardado) return
    setMotivo('')
    setNuevoRevisorId('')
    setErrorValidacion('')
    alCerrar()
  }

  return (
    <Modal alCerrar={() => { if (!guardando) alCerrar() }} titulo="Reasignar revisor">
      <form onSubmit={enviarReasignacion}>
        <fieldset className={styles.cuerpoModal} disabled={guardando}>
          <div className={styles.resumenItem}>
            <p className={styles.tituloTrabajo}>
              <strong>{itemPendiente.codigo}</strong> · {itemPendiente.trabajo}
            </p>
            <p className={styles.revisorActual}>
              Revisor actual: <strong>{itemPendiente.revisor}</strong>
              <span className={styles.alertaVencida}> ({itemPendiente.estado})</span>
            </p>
          </div>

          {(error || errorValidacion) && (
            <p className={styles.mensajeError} role="alert">
              {error || errorValidacion}
            </p>
          )}

          <div className={styles.grupoCampo}>
            <label className={styles.etiqueta} htmlFor="selector-nuevo-revisor">
              SELECCIONAR NUEVO REVISOR *
            </label>
            <select
              id="selector-nuevo-revisor"
              className={styles.selector}
              value={nuevoRevisorId}
              onChange={(e) => {
                setNuevoRevisorId(e.target.value)
                setErrorValidacion('')
              }}
            >
              <option value="">Seleccione un revisor disponible…</option>
              {candidatos.map((rev) => (
                <option key={rev.id} value={rev.id}>
                  {rev.nombre} ({rev.institucion} — {rev.asignadas} revisiones asignadas)
                </option>
              ))}
            </select>
          </div>

          <div className={styles.grupoCampo}>
            <label className={styles.etiqueta} htmlFor="motivo-cambio">
              MOTIVO DE LA REASIGNACIÓN *
            </label>
            <textarea
              id="motivo-cambio"
              className={styles.areaTexto}
              rows={3}
              placeholder="Explique el motivo del cambio (ej. incumplimiento de plazo, sobrecarga o indisponibilidad)…"
              value={motivo}
              onChange={(e) => {
                setMotivo(e.target.value)
                setErrorValidacion('')
              }}
            />
            <span className={styles.textoAyuda}>
              Este motivo quedará registrado en el historial de la edición.
            </span>
          </div>

          <footer className={styles.pieModal}>
            <Button variant="secondary" type="button" onClick={alCerrar}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Confirmar reasignación
            </Button>
          </footer>
        </fieldset>
      </form>
    </Modal>
  )
}
