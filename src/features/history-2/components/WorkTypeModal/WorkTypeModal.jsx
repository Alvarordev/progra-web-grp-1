import { useState } from 'react'
import Button from '../../../../core/ui/Button/Button.jsx'
import Modal from '../../../../core/ui/Modal/Modal.jsx'
import styles from './WorkTypeModal.module.css'

const formatOptions = [
  'PDF',
  'PDF · plantilla IEEE',
  'PDF · orientación vertical',
]

function createFormValues(tipoTrabajo) {
  if (tipoTrabajo) {
    return {
      nombre: tipoTrabajo.nombre,
      extensionMaxima: tipoTrabajo.extensionMaxima,
      formatoEsperado: tipoTrabajo.formatoEsperado,
      admiteCoautores: tipoTrabajo.admiteCoautores,
      maxCoautores: tipoTrabajo.maxCoautores?.toString() ?? '',
    }
  }

  return {
    nombre: '',
    extensionMaxima: '',
    formatoEsperado: '',
    admiteCoautores: false,
    maxCoautores: '',
  }
}

function WorkTypeModal({ alCerrar, alGuardar, modo, tipoTrabajo }) {
  const [formValues, setFormValues] = useState(() =>
    createFormValues(tipoTrabajo),
  )
  const [errores, setErrores] = useState({})
  const title = modo === 'edit' ? 'Editar tipo de trabajo' : 'Nuevo tipo de trabajo'

  function handleChange(event) {
    const { checked, name, type, value } = event.target

    setFormValues((valuesActuales) => ({
      ...valuesActuales,
      [name]: type === 'checkbox' ? checked : value,
    }))

    setErrores((erroresActuales) => ({ ...erroresActuales, [name]: '' }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const erroresFormulario = {}
    const extensionNumerica = Number.parseFloat(
      formValues.extensionMaxima.replace(/\s/g, '').replace(',', '.'),
    )

    if (!formValues.nombre.trim()) {
      erroresFormulario.nombre = 'Ingrese el nombre del tipo de trabajo.'
    }

    if (!Number.isFinite(extensionNumerica) || extensionNumerica <= 0) {
      erroresFormulario.extensionMaxima =
        'La extensión máxima debe ser mayor a cero.'
    }

    if (!formValues.formatoEsperado) {
      erroresFormulario.formatoEsperado = 'Seleccione el formato esperado.'
    }

    const maxCoautores = Number.parseInt(formValues.maxCoautores, 10)
    if (
      formValues.admiteCoautores &&
      (!Number.isInteger(maxCoautores) || maxCoautores <= 0)
    ) {
      erroresFormulario.maxCoautores =
        'Ingrese un número máximo de coautores mayor a cero.'
    }

    if (Object.keys(erroresFormulario).length > 0) {
      setErrores(erroresFormulario)
      return
    }

    alGuardar({
      nombre: formValues.nombre.trim(),
      extensionMaxima: formValues.extensionMaxima.trim(),
      formatoEsperado: formValues.formatoEsperado,
      admiteCoautores: formValues.admiteCoautores,
      maxCoautores: formValues.admiteCoautores ? maxCoautores : null,
    })
  }

  function renderError(nombreCampo) {
    if (!errores[nombreCampo]) {
      return null
    }

    return (
      <span className={styles.error} id={`${nombreCampo}-error`} role="alert">
        {errores[nombreCampo]}
      </span>
    )
  }

  return (
    <Modal alCerrar={alCerrar} titulo={title}>
      <form className={styles.form} noValidate onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="work-type-name">Nombre *</label>
          <input
            aria-describedby={errores.nombre ? 'nombre-error' : undefined}
            aria-invalid={Boolean(errores.nombre)}
            autoComplete="off"
            id="work-type-name"
            name="nombre"
            onChange={handleChange}
            required
            value={formValues.nombre}
          />
          {renderError('nombre')}
        </div>

        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label htmlFor="work-type-extension">Extensión máxima *</label>
            <input
              aria-describedby={
                errores.extensionMaxima ? 'extensionMaxima-error' : undefined
              }
              aria-invalid={Boolean(errores.extensionMaxima)}
              id="work-type-extension"
              name="extensionMaxima"
              onChange={handleChange}
              placeholder="Ej. 8 000 palabras"
              required
              value={formValues.extensionMaxima}
            />
            {renderError('extensionMaxima')}
          </div>

          <div className={styles.field}>
            <label htmlFor="work-type-format">Formato esperado *</label>
            <select
              aria-describedby={
                errores.formatoEsperado ? 'formatoEsperado-error' : undefined
              }
              aria-invalid={Boolean(errores.formatoEsperado)}
              id="work-type-format"
              name="formatoEsperado"
              onChange={handleChange}
              required
              value={formValues.formatoEsperado}
            >
              <option disabled value="">
                Seleccione un formato
              </option>
              {formatOptions.map((format) => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </select>
            {renderError('formatoEsperado')}
          </div>
        </div>

        <fieldset className={styles.coauthorFieldset}>
          <legend>Coautores</legend>
          <label className={styles.checkboxLabel} htmlFor="work-type-coauthors">
            <input
              checked={formValues.admiteCoautores}
              id="work-type-coauthors"
              name="admiteCoautores"
              onChange={handleChange}
              type="checkbox"
            />
            Admite coautores
          </label>
        </fieldset>

        {formValues.admiteCoautores && (
          <div className={`${styles.field} ${styles.maxCoauthors}`}>
            <label htmlFor="work-type-max-coauthors">
              Número máximo de coautores
            </label>
            <input
              aria-describedby={
                errores.maxCoautores ? 'maxCoautores-error' : undefined
              }
              aria-invalid={Boolean(errores.maxCoautores)}
              id="work-type-max-coauthors"
              min="1"
              name="maxCoautores"
              onChange={handleChange}
              type="number"
              value={formValues.maxCoautores}
            />
            {renderError('maxCoautores')}
          </div>
        )}

        <footer className={styles.footer}>
          <Button onClick={alCerrar} type="button" variant="secondary">
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Guardar tipo
          </Button>
        </footer>
      </form>
    </Modal>
  )
}

export default WorkTypeModal
