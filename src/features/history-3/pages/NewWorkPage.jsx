import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import Button from '../../../core/ui/Button/Button.jsx'
import AuthorPageLayout from '../components/AuthorPageLayout/AuthorPageLayout.jsx'
import DeadlineNotice from '../components/DeadlineNotice/DeadlineNotice.jsx'
import FormField from '../components/FormField/FormField.jsx'
import WorkStatusBadge from '../components/WorkStatusBadge/WorkStatusBadge.jsx'
import { thematicAxes, workTypes } from '../data/works.js'
import styles from './NewWorkPage.module.css'

const MAX_SUMMARY = 1500
const MIN_KEYWORDS = 3

const steps = ['1. Datos generales', '2. Coautores', '3. Envío']

const initialWork = {
  titulo: 'Predicción de deserción universitaria mediante aprendizaje supervisado',
  tipo: 'Artículo completo',
  eje: 'Inteligencia artificial y datos',
  resumen:
    'Se evalúan tres modelos supervisados para anticipar el abandono de estudios en una universidad privada de Lima, usando registros académicos de cinco cohortes.',
  palabrasClave: ['deserción universitaria', 'aprendizaje supervisado', 'analítica educativa'],
  enlace: 'https://drive.ulima.edu.pe/trb-2026-058/articulo.pdf',
}

function validateWork(trabajo) {
  const errores = {}

  if (!trabajo.titulo.trim()) errores.titulo = 'Ingrese el título del trabajo.'
  if (!trabajo.eje) errores.eje = 'Debe elegir un eje temático.'
  if (!trabajo.resumen.trim()) {
    errores.resumen = 'Ingrese el resumen del trabajo.'
  } else if (trabajo.resumen.length > MAX_SUMMARY) {
    errores.resumen = `El resumen supera el máximo permitido. Reduzca ${trabajo.resumen.length - MAX_SUMMARY} caracteres.`
  }
  if (trabajo.palabrasClave.length < MIN_KEYWORDS) {
    errores.palabrasClave = `Agregue al menos ${MIN_KEYWORDS - trabajo.palabrasClave.length} palabra(s) clave más (mínimo ${MIN_KEYWORDS}).`
  }
  if (!/^https:\/\/\S+\.\S+/.test(trabajo.enlace)) {
    errores.enlace = 'Ingrese una URL completa que empiece con https://'
  }

  return errores
}

function NewWorkPage() {
  const navigate = useNavigate()
  const [trabajo, setTrabajo] = useState(initialWork)
  const [nuevaPalabra, setNuevaPalabra] = useState('')
  const [errores, setErrores] = useState({})
  const [borradorGuardado, setBorradorGuardado] = useState(false)

  const tipoElegido = workTypes.find((tipo) => tipo.nombre === trabajo.tipo)
  const cantidadErrores = Object.keys(errores).length

  function handleChange(event) {
    const { name, value } = event.target
    setTrabajo((trabajoActual) => ({ ...trabajoActual, [name]: value }))
  }

  function handleKeywordKeyDown(event) {
    if (event.key !== 'Enter') return

    event.preventDefault()
    const palabra = nuevaPalabra.trim()

    if (palabra && !trabajo.palabrasClave.includes(palabra)) {
      setTrabajo((trabajoActual) => ({
        ...trabajoActual,
        palabrasClave: [...trabajoActual.palabrasClave, palabra],
      }))
    }
    setNuevaPalabra('')
  }

  function handleRemoveKeyword(palabra) {
    setTrabajo((trabajoActual) => ({
      ...trabajoActual,
      palabrasClave: trabajoActual.palabrasClave.filter((actual) => actual !== palabra),
    }))
  }

  function handleSaveDraft() {
    if (!trabajo.titulo.trim()) {
      setErrores({ titulo: 'Ingrese al menos el título para guardar el borrador.' })
      return
    }
    setErrores({})
    setBorradorGuardado(true)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nuevosErrores = validateWork(trabajo)
    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length === 0) {
      navigate('/nuevo-trabajo/coautores')
    }
  }

  if (borradorGuardado) {
    return (
      <AuthorPageLayout rutaActiva="/nuevo-trabajo">
        <p className={styles.success} role="status">
          ✓ Borrador guardado el 18/09/2026 a las 19:42. Aún no ha sido enviado al comité.{' '}
          <Link to="/mis-trabajos">Ir a mis trabajos</Link>
        </p>
        <DeadlineNotice restante="Faltan 12 días">
          Recepción abierta. Cierra el 30/09/2026 a las 23:59.
        </DeadlineNotice>

        <div className={styles.pageHeading}>
          <div>
            <p className={styles.code}>
              TRB-2026-058 <WorkStatusBadge estado="borrador" />
            </p>
            <h1>{trabajo.titulo}</h1>
          </div>
          <div className={styles.actions}>
            <Button onClick={() => setBorradorGuardado(false)} variant="secondary">
              Seguir editando
            </Button>
            <Button onClick={() => navigate('/nuevo-trabajo/coautores')} variant="primary">
              Enviar al comité
            </Button>
          </div>
        </div>

        <div className={styles.layout}>
          <section aria-labelledby="draft-title" className={styles.panel}>
            <h2 id="draft-title">Resumen del borrador</h2>
            <dl className={styles.summaryList}>
              <div>
                <dt>Tipo</dt>
                <dd>{trabajo.tipo}</dd>
              </div>
              <div>
                <dt>Eje temático</dt>
                <dd>{trabajo.eje || 'Sin definir'}</dd>
              </div>
              <div>
                <dt>Enlace al documento</dt>
                <dd>{trabajo.enlace || 'Sin enlace'}</dd>
              </div>
            </dl>
            <h3 className={styles.label}>Resumen</h3>
            <p>{trabajo.resumen}</p>
          </section>

          <aside className={styles.panel}>
            <h2 className={styles.label}>Lista de verificación</h2>
            <ul className={styles.checklist}>
              <li>✓ Datos generales completos</li>
              <li>✓ Resumen y palabras clave</li>
              <li>✓ Enlace al documento</li>
              <li className={styles.pending}>• Falta confirmar al autor de correspondencia</li>
            </ul>
            <p className={styles.helperText}>
              Los borradores no participan del proceso de revisión. Debe enviarlo antes del
              cierre de la recepción.
            </p>
          </aside>
        </div>
      </AuthorPageLayout>
    )
  }

  return (
    <AuthorPageLayout rutaActiva="/nuevo-trabajo">
      <DeadlineNotice restante="Faltan 12 días · 04:11 h">
        Recepción abierta. Cierra el 30/09/2026 a las 23:59.
      </DeadlineNotice>

      <div className={styles.pageHeading}>
        <div>
          <h1>Nuevo trabajo</h1>
          <p>Paso 1 de 3 · Datos generales</p>
        </div>
        <div className={styles.actions}>
          <Button onClick={handleSaveDraft} variant="secondary">
            Guardar como borrador
          </Button>
          <Button form="new-work-form" type="submit" variant="primary">
            Continuar a coautores
          </Button>
        </div>
      </div>

      <ol aria-label="Pasos del envío" className={styles.steps}>
        {steps.map((paso, indice) => (
          <li aria-current={indice === 0 ? 'step' : undefined} key={paso}>
            {paso}
          </li>
        ))}
      </ol>

      {cantidadErrores > 0 && (
        <section className={styles.errorSummary} role="alert">
          <strong>No se pudo continuar: revise {cantidadErrores} campo(s)</strong>
          <ul>
            {Object.entries(errores).map(([campo, mensaje]) => (
              <li key={campo}>{mensaje}</li>
            ))}
          </ul>
        </section>
      )}

      <div className={styles.layout}>
        <form className={`${styles.panel} ${styles.form}`} id="new-work-form" noValidate onSubmit={handleSubmit}>
          <div className={styles.fullWidth}>
            <FormField ayuda="Máximo 180 caracteres." error={errores.titulo} etiqueta="Título del trabajo *" htmlFor="work-title">
              <input id="work-title" maxLength={180} name="titulo" onChange={handleChange} value={trabajo.titulo} />
            </FormField>
          </div>

          <FormField ayuda="Puede cambiar el tipo mientras el trabajo esté en borrador." etiqueta="Tipo de trabajo *" htmlFor="work-type">
            <select id="work-type" name="tipo" onChange={handleChange} value={trabajo.tipo}>
              {workTypes.map((tipo) => (
                <option key={tipo.nombre} value={tipo.nombre}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </FormField>

          <FormField error={errores.eje} etiqueta="Eje temático *" htmlFor="work-axis">
            <select id="work-axis" name="eje" onChange={handleChange} value={trabajo.eje}>
              <option value="">Seleccione un eje</option>
              {thematicAxes.map((eje) => (
                <option key={eje} value={eje}>
                  {eje}
                </option>
              ))}
            </select>
          </FormField>

          <div className={styles.fullWidth}>
            <FormField
              ayuda={`${trabajo.resumen.length} / 1 500 caracteres`}
              error={errores.resumen}
              etiqueta="Resumen *"
              htmlFor="work-summary"
            >
              <textarea id="work-summary" name="resumen" onChange={handleChange} value={trabajo.resumen} />
            </FormField>
          </div>

          <div className={styles.fullWidth}>
            <FormField error={errores.palabrasClave} etiqueta="Palabras clave *" htmlFor="work-keyword">
              <ul aria-label="Palabras clave agregadas" className={styles.keywords}>
                {trabajo.palabrasClave.map((palabra) => (
                  <li key={palabra}>
                    {palabra}
                    <button aria-label={`Quitar ${palabra}`} onClick={() => handleRemoveKeyword(palabra)} type="button">
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <input
                id="work-keyword"
                onChange={(event) => setNuevaPalabra(event.target.value)}
                onKeyDown={handleKeywordKeyDown}
                placeholder="Escriba y presione Enter…"
                value={nuevaPalabra}
              />
            </FormField>
          </div>

          <div className={styles.fullWidth}>
            <FormField
              ayuda="El enlace debe permitir el acceso de lectura al comité y a los revisores."
              error={errores.enlace}
              etiqueta="Enlace al documento *"
              htmlFor="work-link"
            >
              <input id="work-link" name="enlace" onChange={handleChange} value={trabajo.enlace} />
            </FormField>
          </div>
        </form>

        <aside className={styles.sideColumn}>
          <section className={styles.panel}>
            <h2 className={styles.label}>Requisitos del tipo elegido</h2>
            <p>
              {tipoElegido.nombre} · {tipoElegido.requisitos}
            </p>
          </section>
          <section className={styles.panel}>
            <h2 className={styles.label}>Antes de enviar</h2>
            <p>Verifique que el documento no contenga los nombres de los autores: la revisión es ciega.</p>
            <p className={styles.helperText}>Podrá editar el trabajo hasta el cierre de la recepción.</p>
          </section>
          {cantidadErrores > 0 && (
            <section className={`${styles.panel} ${styles.warningPanel}`}>
              <h2 className={styles.label}>Sus cambios no se han guardado</h2>
              <p>Puede guardar el trabajo como borrador y corregir los campos más tarde, antes del cierre de la recepción.</p>
            </section>
          )}
        </aside>
      </div>
    </AuthorPageLayout>
  )
}

export default NewWorkPage
