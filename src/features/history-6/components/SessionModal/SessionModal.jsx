import { useState } from 'react'
import Button from '../../../../core/ui/Button/Button.jsx'
import Modal from '../../../../core/ui/Modal/Modal.jsx'
import { rooms } from '../../data/program.js'
import { sessionsOverlap, toMinutes } from '../../utils/sessionSchedule.js'
import styles from './SessionModal.module.css'

function createFormValues(sesion) {
  return {
    nombre: sesion?.nombre ?? '',
    eje: sesion?.eje ?? '',
    fecha: sesion?.fecha ?? '',
    horaInicio: sesion?.horaInicio ?? '',
    horaFin: sesion?.horaFin ?? '',
    sala: sesion?.sala ?? '',
    moderador: sesion?.moderador ?? '',
  }
}

function validate(valores, sesiones, idActual) {
  const errores = {}

  if (!valores.nombre.trim()) {
    errores.nombre = 'Ingrese el nombre de la sesión.'
  }

  if (!valores.eje) {
    errores.eje = 'Seleccione el eje temático.'
  }

  if (!valores.fecha) {
    errores.fecha = 'Seleccione la fecha.'
  }

  if (!valores.horaInicio) {
    errores.horaInicio = 'Ingrese la hora de inicio.'
  }

  if (!valores.horaFin) {
    errores.horaFin = 'Ingrese la hora de fin.'
  }

  if (!valores.sala) {
    errores.sala = 'Seleccione la sala.'
  }

  if (!valores.moderador.trim()) {
    errores.moderador = 'Ingrese el nombre de la persona moderadora.'
  }

  if (
    valores.horaInicio &&
    valores.horaFin &&
    toMinutes(valores.horaFin) <= toMinutes(valores.horaInicio)
  ) {
    errores.horaFin = 'La hora de fin debe ser posterior a la de inicio.'
  }

  if (Object.keys(errores).length === 0) {
    const conflicto = sesiones.find(
      otra => otra.id !== idActual && sessionsOverlap(valores, otra)
    )

    if (conflicto) {
      errores.sala = `La sala ${valores.sala} ya está ocupada por «${conflicto.nombre}» en ese horario.`
    }
  }

  return errores
}

function SessionModal({
  guardando = false,
  alCerrar,
  alGuardar,
  modo,
  sesion,
  sesiones,
  ejes,
}) {
  const [valores, setValores] = useState(() => createFormValues(sesion))
  const [errores, setErrores] = useState({})
  const titulo = modo === 'edit' ? 'Editar sesión' : 'Nueva sesión'

  function handleChange(event) {
    const { name, value } = event.target

    setValores(valoresActuales => ({ ...valoresActuales, [name]: value }))
    setErrores(erroresActuales => ({ ...erroresActuales, [name]: '' }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (guardando) {
      return
    }

    const erroresFormulario = validate(valores, sesiones, sesion?.id)

    if (Object.keys(erroresFormulario).length > 0) {
      setErrores(erroresFormulario)
      return
    }

    alGuardar({
      ...valores,
      nombre: valores.nombre.trim(),
      moderador: valores.moderador.trim(),
    })
  }

  function fieldProps(campo) {
    return {
      'aria-describedby': errores[campo] ? `${campo}-error` : undefined,
      'aria-invalid': Boolean(errores[campo]),
      id: `session-${campo}`,
      name: campo,
      onChange: handleChange,
      value: valores[campo],
      disabled: guardando,
    }
  }

  function renderError(campo) {
    if (!errores[campo]) {
      return null
    }

    return (
      <span className={styles.error} id={`${campo}-error`} role="alert">
        {errores[campo]}
      </span>
    )
  }

  return (
    <Modal alCerrar={alCerrar} titulo={titulo}>
      <form
        aria-busy={guardando}
        className={styles.form}
        noValidate
        onSubmit={handleSubmit}
      >
        <div className={styles.field}>
          <label htmlFor="session-nombre">Nombre *</label>
          <input {...fieldProps('nombre')} autoComplete="off" required />
          {renderError('nombre')}
        </div>

        <div className={styles.field}>
          <label htmlFor="session-eje">Eje temático *</label>
          <select {...fieldProps('eje')} required>
            <option disabled value="">
              Seleccione un eje
            </option>
            {ejes.map(eje => (
              <option key={eje} value={eje}>
                {eje}
              </option>
            ))}
          </select>
          {renderError('eje')}
        </div>

        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label htmlFor="session-fecha">Fecha *</label>
            <input {...fieldProps('fecha')} required type="date" />
            {renderError('fecha')}
          </div>
          <div className={styles.field}>
            <label htmlFor="session-sala">Sala *</label>
            <select {...fieldProps('sala')} required>
              <option disabled value="">
                Seleccione una sala
              </option>
              {rooms.map(sala => (
                <option key={sala.codigo} value={sala.codigo}>
                  {sala.codigo}
                </option>
              ))}
            </select>
            {renderError('sala')}
          </div>
        </div>

        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label htmlFor="session-horaInicio">Hora de inicio *</label>
            <input {...fieldProps('horaInicio')} required type="time" />
            {renderError('horaInicio')}
          </div>
          <div className={styles.field}>
            <label htmlFor="session-horaFin">Hora de fin *</label>
            <input {...fieldProps('horaFin')} required type="time" />
            {renderError('horaFin')}
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="session-moderador">Moderación *</label>
          <input {...fieldProps('moderador')} autoComplete="off" required />
          {renderError('moderador')}
        </div>

        <footer className={styles.footer}>
          <Button
            disabled={guardando}
            onClick={alCerrar}
            type="button"
            variant="secondary"
          >
            Cancelar
          </Button>
          <Button loading={guardando} type="submit" variant="primary">
            Guardar sesión
          </Button>
        </footer>
      </form>
    </Modal>
  )
}

export default SessionModal
