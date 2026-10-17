import ConfigurationFeedback from '../ConfigurationFeedback/ConfigurationFeedback.jsx'
import { useState } from 'react'
import Button from '../../../../core/ui/Button/Button.jsx'
import Modal from '../../../../core/ui/Modal/Modal.jsx'
import styles from './ThematicAxisModal.module.css'

function ThematicAxisModal({ alCerrar, alGuardar, eje, modo, guardando = false, errorGuardado = '' }) {
  const [valores, setValores] = useState({
    nombre: eje?.nombre ?? '',
    descripcion: eje?.descripcion ?? '',
    responsable: eje?.responsable ?? '',
  })
  const [error, setError] = useState('')
  const titulo = modo === 'edit' ? 'Editar eje temático' : 'Nuevo eje temático'

  function handleChange(event) {
    const { name, value } = event.target
    setValores((valoresActuales) => ({ ...valoresActuales, [name]: value }))
    setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (guardando) return

    if (!valores.nombre.trim() || !valores.descripcion.trim() || !valores.responsable.trim()) {
      setError('Complete el nombre, la descripción y la persona responsable.')
      return
    }

    alGuardar({
      nombre: valores.nombre.trim(),
      descripcion: valores.descripcion.trim(),
      responsable: valores.responsable.trim(),
    })
  }

  return (
    <Modal alCerrar={alCerrar} titulo={titulo}>
      <form className={styles.form} noValidate onSubmit={handleSubmit}>
        <fieldset className={styles.fields} disabled={guardando}>
        <div className={styles.field}>
          <label htmlFor="axis-name">Nombre *</label>
          <input id="axis-name" name="nombre" onChange={handleChange} value={valores.nombre} />
        </div>
        <div className={styles.field}>
          <label htmlFor="axis-description">Descripción *</label>
          <textarea id="axis-description" name="descripcion" onChange={handleChange} rows={3} value={valores.descripcion} />
        </div>
        <div className={styles.field}>
          <label htmlFor="axis-owner">Responsable *</label>
          <input id="axis-owner" name="responsable" onChange={handleChange} value={valores.responsable} />
        </div>
        </fieldset>
        <ConfigurationFeedback compacto error={error || errorGuardado} />
        <footer className={styles.footer}>
          <Button disabled={guardando} onClick={alCerrar} type="button" variant="secondary">Cancelar</Button>
          <Button loading={guardando} type="submit" variant="primary">Guardar eje</Button>
        </footer>
      </form>
    </Modal>
  )
}

export default ThematicAxisModal
