import { useState } from 'react'
import Button from '../../../../core/ui/Button/Button.jsx'
import Modal from '../../../../core/ui/Modal/Modal.jsx'
import { toMinutes } from '../../utils/sessionSchedule.js'
import styles from './SessionModal.module.css'

function createFormValues(sesion) {
  return {
    nombre: sesion?.nombre ?? '',
    ejeId: sesion ? String(sesion.ejeId) : '',
    fecha: sesion?.fecha ?? '',
    horaInicio: sesion?.horaInicio ?? '',
    horaFin: sesion?.horaFin ?? '',
    salaId: sesion ? String(sesion.salaId) : '',
    moderadorId: sesion?.moderadorId ?? '',
  }
}

/* El solapamiento de sala y de moderación lo valida el servidor. */
function validate(valores) {
  const errores = {}

  if (!valores.nombre.trim()) {
    errores.nombre = 'Ingrese el nombre de la sesión.'
  }

  if (!valores.ejeId) {
    errores.ejeId = 'Seleccione el eje temático.'
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

  if (!valores.salaId) {
    errores.salaId = 'Seleccione la sala.'
  }

  if (!valores.moderadorId) {
    errores.moderadorId = 'Seleccione a la persona moderadora.'
  }

  if (
    valores.horaInicio &&
    valores.horaFin &&
    toMinutes(valores.horaFin) <= toMinutes(valores.horaInicio)
  ) {
    errores.horaFin = 'La hora de fin debe ser posterior a la de inicio.'
  }

  return errores
}

function SessionModal({
  guardando = false,
  alCerrar,
  alGuardar,
  errorGuardado = '',
  erroresServidor = {},
  modo,
  sesion,
  ejes,
  salas,
  moderadores,
}) {
  const [valores, setValores] = useState(() => createFormValues(sesion))
  const [erroresLocales, setErrores] = useState({})
  const errores = { ...erroresServidor, ...erroresLocales }
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

    const erroresFormulario = validate(valores)

    if (Object.keys(erroresFormulario).length > 0) {
      setErrores(erroresFormulario)
      return
    }

    setErrores({})
    alGuardar({
      ...valores,
      nombre: valores.nombre.trim(),
      ejeId: Number(valores.ejeId),
      salaId: Number(valores.salaId),
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
          <label htmlFor="session-ejeId">Eje temático *</label>
          <select {...fieldProps('ejeId')} required>
            <option disabled value="">
              Seleccione un eje
            </option>
            {ejes.map(eje => (
              <option key={eje.id} value={eje.id}>
                {eje.nombre}
              </option>
            ))}
          </select>
          {renderError('ejeId')}
        </div>

        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label htmlFor="session-fecha">Fecha *</label>
            <input {...fieldProps('fecha')} required type="date" />
            {renderError('fecha')}
          </div>
          <div className={styles.field}>
            <label htmlFor="session-salaId">Sala *</label>
            <select {...fieldProps('salaId')} required>
              <option disabled value="">
                Seleccione una sala
              </option>
              {salas.map(sala => (
                <option key={sala.id} value={sala.id}>
                  {sala.codigo}
                </option>
              ))}
            </select>
            {renderError('salaId')}
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
          <label htmlFor="session-moderadorId">Moderación *</label>
          <select {...fieldProps('moderadorId')} required>
            <option disabled value="">
              Seleccione a la persona moderadora
            </option>
            {moderadores.map(persona => (
              <option key={persona.id} value={persona.id}>
                {persona.nombre}
              </option>
            ))}
          </select>
          {renderError('moderadorId')}
        </div>

        {errorGuardado && (
          <p className={styles.error} role="alert">
            {errorGuardado}
          </p>
        )}

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
