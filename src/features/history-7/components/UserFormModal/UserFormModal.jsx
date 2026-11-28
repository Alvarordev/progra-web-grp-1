import { useId, useState } from 'react'
import Button from '../../../../core/ui/Button/Button.jsx'
import Modal from '../../../../core/ui/Modal/Modal.jsx'
import styles from './UserFormModal.module.css'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* Formulario único para invitar (usuario = null) y para editar (usuario existente). */
function UserFormModal({
  guardando = false,
  errorGuardado = '',
  erroresServidor = {},
  alCerrar,
  alGuardar,
  instituciones,
  usuario,
  usuarios,
}) {
  const isEditing = Boolean(usuario)
  const isDefaultCommittee = usuario?.userId === 'default-committee'
  const idPrefix = useId()
  const [values, setValues] = useState({
    nombres: usuario?.nombres ?? '',
    apellidos: usuario?.apellidos ?? '',
    correo: usuario?.correo ?? '',
    rol: usuario?.rol ?? '',
    institucion: usuario?.institucion ?? '',
  })
  const [errors, setErrors] = useState({})
  /* Los errores del servidor se muestran hasta que la persona edita ese campo. */
  const visibleErrors = { ...erroresServidor, ...errors }

  function setValue(name, value) {
    setValues(current => ({ ...current, [name]: value }))
    setErrors(current => ({ ...current, [name]: '' }))
  }

  function validate() {
    const found = {}
    const email = values.correo.trim().toLowerCase()

    if (!values.nombres.trim()) {
      found.nombres = 'Ingrese los nombres.'
    }
    if (!values.apellidos.trim()) {
      found.apellidos = 'Ingrese los apellidos.'
    }

    if (!email) {
      found.correo = 'Ingrese el correo electrónico.'
    } else if (!EMAIL_PATTERN.test(email)) {
      found.correo = 'Ingrese un correo válido, por ejemplo nombre@ulima.edu.pe.'
    } else if (
      usuarios.some(
        other => other.id !== usuario?.id && other.correo.toLowerCase() === email
      )
    ) {
      found.correo = 'Ya existe un usuario con este correo.'
    }

    if (!values.rol) {
      found.rol = 'Seleccione un rol.'
    }
    if (!values.institucion.trim()) {
      found.institucion = 'Ingrese la institución.'
    }

    return found
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (guardando) {
      return
    }
    const found = validate()
    setErrors(found)

    if (Object.keys(found).length > 0) {
      return
    }

    alGuardar({
      nombres: values.nombres.trim(),
      apellidos: values.apellidos.trim(),
      correo: values.correo.trim(),
      rol: values.rol,
      institucion: values.institucion.trim(),
    })
  }

  function fieldProps(name) {
    const id = `${idPrefix}-${name}`
    return {
      id,
      'aria-describedby': visibleErrors[name] ? `${id}-error` : undefined,
      'aria-invalid': visibleErrors[name] ? 'true' : undefined,
    }
  }

  function renderError(name) {
    return (
      visibleErrors[name] && (
        <p className={styles.error} id={`${idPrefix}-${name}-error`}>
          {visibleErrors[name]}
        </p>
      )
    )
  }

  return (
    <Modal alCerrar={alCerrar} titulo={isEditing ? 'Editar usuario' : 'Invitar usuario'}>
      <form className={styles.form} noValidate onSubmit={handleSubmit}>
        <fieldset className={styles.body} disabled={guardando}>
          {!isEditing && (
            <p className={styles.intro}>
              Se creará la cuenta con el correo y el rol indicados y se enviará un aviso
              al correo. La persona define su contraseña desde «¿Olvidó su contraseña?».
            </p>
          )}

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor={`${idPrefix}-nombres`}>Nombres *</label>
              <input
                {...fieldProps('nombres')}
                autoComplete="off"
                onChange={event => setValue('nombres', event.target.value)}
                type="text"
                value={values.nombres}
              />
              {renderError('nombres')}
            </div>

            <div className={styles.field}>
              <label htmlFor={`${idPrefix}-apellidos`}>Apellidos *</label>
              <input
                {...fieldProps('apellidos')}
                autoComplete="off"
                onChange={event => setValue('apellidos', event.target.value)}
                type="text"
                value={values.apellidos}
              />
              {renderError('apellidos')}
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor={`${idPrefix}-correo`}>Correo electrónico *</label>
            <input
              {...fieldProps('correo')}
              readOnly={isDefaultCommittee}
              autoComplete="off"
              onChange={event => setValue('correo', event.target.value)}
              type="email"
              value={values.correo}
            />
            {renderError('correo')}
          </div>

          <div className={styles.field}>
            <label htmlFor={`${idPrefix}-rol`}>Rol *</label>
            <select
              {...fieldProps('rol')}
              onChange={event => setValue('rol', event.target.value)}
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
            <label htmlFor={`${idPrefix}-institucion`}>Institución *</label>
            <input
              {...fieldProps('institucion')}
              autoComplete="off"
              list={`${idPrefix}-instituciones`}
              onChange={event => setValue('institucion', event.target.value)}
              type="text"
              value={values.institucion}
            />
            <datalist id={`${idPrefix}-instituciones`}>
              {instituciones.map(name => (
                <option key={name} value={name} />
              ))}
            </datalist>
            {renderError('institucion')}
          </div>
        </fieldset>

        {errorGuardado && <p role="alert">{errorGuardado}</p>}
        <div className={styles.footer}>
          <Button
            disabled={guardando}
            onClick={alCerrar}
            type="button"
            variant="secondary"
          >
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
