import { useState } from 'react'
import Button from '../../../../core/ui/Button/Button.jsx'
import Modal from '../../../../core/ui/Modal/Modal.jsx'
import styles from './CriterionModal.module.css'

function CriterionModal({ criterio, alCerrar, alGuardar, guardando = false, errorGuardado = '' }) {
  const [values, setValues] = useState({
    nombre: criterio?.nombre ?? '',
    descripcion: criterio?.descripcion ?? '',
    peso: criterio?.peso ?? '',
  })
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (guardando) return
    if (!values.nombre.trim() || !values.descripcion.trim()) {
      setError('Ingrese un nombre y una descripción para el criterio.')
      return
    }
    alGuardar({ nombre: values.nombre.trim(), descripcion: values.descripcion.trim(), peso: Number(values.peso) })
  }

  return (
    <Modal alCerrar={alCerrar} titulo={criterio ? 'Editar criterio' : 'Nuevo criterio'}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <fieldset className={styles.fields} disabled={guardando}>
        <div className={styles.field}>
          <label htmlFor="criterion-name">Nombre *</label>
          <input id="criterion-name" name="nombre" required pattern=".*\S.*" value={values.nombre} onChange={handleChange} />
        </div>
        <div className={styles.field}>
          <label htmlFor="criterion-description">Descripción *</label>
          <textarea id="criterion-description" name="descripcion" required value={values.descripcion} onChange={handleChange} rows={3} />
        </div>
        <div className={styles.field}>
          <label htmlFor="criterion-weight">Peso (%) *</label>
          <input id="criterion-weight" name="peso" type="number" min="1" max="100" step="1" required value={values.peso} onChange={handleChange} />
        </div>
        {error && <p className={styles.error} role="alert">{error}</p>}
        </fieldset>
        {errorGuardado && <p className={styles.error} role="alert">{errorGuardado}</p>}
        <footer className={styles.footer}>
          <Button disabled={guardando} onClick={alCerrar} variant="secondary">Cancelar</Button>
          <Button loading={guardando} type="submit">Guardar criterio</Button>
        </footer>
      </form>
    </Modal>
  )
}

export default CriterionModal
