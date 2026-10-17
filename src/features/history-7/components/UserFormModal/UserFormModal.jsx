import { useId, useState } from 'react'
import Button from '../../../../core/ui/Button/Button.jsx'
import Modal from '../../../../core/ui/Modal/Modal.jsx'
import { parseCount } from '../../utils/users.js'
import styles from './UserFormModal.module.css'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* Formulario único para invitar (usuario = null) y para editar (usuario existente). */
function UserFormModal({ guardando = false, errorGuardado = '', alCerrar, alGuardar, instituciones, usuario, usuarios }) {
  const isEditing = Boolean(usuario)
  const idPrefix = useId()
  const [values, setValues] = useState({
    nombre: usuario?.nombre ?? '',
    correo: usuario?.correo ?? '',
    rol: usuario?.rol ?? '',
    institucion: usuario?.institucion ?? '',
    cantidad: usuario ? parseCount(usuario.actividad) : '0',
  })
  const [errors, setErrors] = useState({})

  const isCommittee = values.rol === 'Comité'

  function setValue(name, value) {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  function validate() {
    const found = {}
    const email = values.correo.trim().toLowerCase()

    if (!values.nombre.trim()) found.nombre = 'Ingrese el nombre completo.'

    if (!email) {
      found.correo = 'Ingrese el correo electrónico.'
    } else if (!EMAIL_PATTERN.test(email)) {
      found.correo = 'Ingrese un correo válido, por ejemplo nombre@ulima.edu.pe.'
    } else if (
      usuarios.some(
        (other) => other.id !== usuario?.id && other.correo.toLowerCase() === email,
      )
    ) {
      found.correo = 'Ya existe un usuario con este correo.'
    }

    if (!values.rol) found.rol = 'Seleccione un rol.'
    if (!values.institucion.trim()) found.institucion = 'Ingrese la institución.'

    if (!isCommittee) {
      const total = Number(values.cantidad)
      if (values.cantidad === '' || !Number.isInteger(total) || total < 0) {
        found.cantidad = 'Ingrese un número entero igual o mayor que 0.'
      }
    }

    return found
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (guardando) return
    const found = validate()
    setErrors(found)

    if (Object.keys(found).length > 0) return

    alGuardar({
      nombre: values.nombre.trim(),
      correo: values.correo.trim(),
      rol: values.rol,
      institucion: values.institucion.trim(),
      cantidad: isCommittee ? '' : values.cantidad,
    })
  }

  function fieldProps(name) {
    const id = `${idPrefix}-${name}`
    return {
      id,
      'aria-describedby': errors[name] ? `${id}-error` : undefined,
      'aria-invalid': errors[name] ? 'true' : undefined,
    }
  }

  function renderError(name) {
    return (
      errors[name] && (
        <p className={styles.error} id={`${idPrefix}-${name}-error`}>
          {errors[name]}
        </p>
      )
    )
  }

  const countLabel =
    values.rol === 'Autor'
      ? 'Número de trabajos'
      : values.rol === 'Revisor'
        ? 'Número de revisiones'
        : 'Número de trabajos'

  return (
    <Modal
      alCerrar={alCerrar}
      titulo={isEditing ? 'Editar usuario' : 'Invitar usuario'}
    >
      <form className={styles.form} noValidate onSubmit={handleSubmit}>
        <fieldset className={styles.body} disabled={guardando}>
          {!isEditing && (
            <p className={styles.intro}>
              La invitación queda registrada en este navegador. La persona podrá
              crear su cuenta con el correo y el rol indicados.
            </p>
          )}

          <div className={styles.field}>
            <label htmlFor={`${idPrefix}-nombre`}>Nombre completo *</label>
            <input
              {...fieldProps('nombre')}
              autoComplete="off"
              onChange={(event) => setValue('nombre', event.target.value)}
              type="text"
              value={values.nombre}
            />
            {renderError('nombre')}
          </div>

          <div className={styles.field}>
            <label htmlFor={`${idPrefix}-correo`}>Correo electrónico *</label>
            <input
              {...fieldProps('correo')}
              autoComplete="off"
              onChange={(event) => setValue('correo', event.target.value)}
              type="email"
              value={values.correo}
            />
            {renderError('correo')}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor={`${idPrefix}-rol`}>Rol *</label>
              <select
                {...fieldProps('rol')}
                onChange={(event) => setValue('rol', event.target.value)}
                value={values.rol}
              >
                <option value="">Seleccione…</option>
                <option value="Autor">Autor</option>
                <option value="Revisor">Revisor</option>
                <option value="Ambos">Ambos</option>
                <option value="Comité">Comité</option>
              </select>
              {renderError('rol')}
            </div>

            <div className={styles.field}>
              <label htmlFor={`${idPrefix}-cantidad`}>{countLabel}</label>
              <input
                {...fieldProps('cantidad')}
                disabled={isCommittee}
                inputMode="numeric"
                min="0"
                onChange={(event) => setValue('cantidad', event.target.value)}
                step="1"
                type="number"
                value={isCommittee ? '' : values.cantidad}
              />
              {isCommittee && (
                <p className={styles.help}>No aplica para el comité.</p>
              )}
              {renderError('cantidad')}
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor={`${idPrefix}-institucion`}>Institución *</label>
            <input
              {...fieldProps('institucion')}
              autoComplete="off"
              list={`${idPrefix}-instituciones`}
              onChange={(event) => setValue('institucion', event.target.value)}
              type="text"
              value={values.institucion}
            />
            <datalist id={`${idPrefix}-instituciones`}>
              {instituciones.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
            {renderError('institucion')}
          </div>
        </fieldset>

        {errorGuardado && <p role="alert">{errorGuardado}</p>}
        <div className={styles.footer}>
          <Button disabled={guardando} onClick={alCerrar} type="button" variant="secondary">
            Cancelar
          </Button>
          <Button loading={guardando} type="submit">
            {isEditing ? 'Guardar cambios' : 'Invitar'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default UserFormModal
