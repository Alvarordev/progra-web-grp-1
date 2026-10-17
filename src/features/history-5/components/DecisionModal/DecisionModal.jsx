import { useState } from 'react'
import Button from '../../../../core/ui/Button/Button.jsx'
import Modal from '../../../../core/ui/Modal/Modal.jsx'
import { formatTenth } from '../../utils/scoring.js'
import { buildFeedbackText, feedbackNote } from '../../utils/decisionText.js'
import styles from './DecisionModal.module.css'

const opciones = [
  { value: 'aceptar', label: 'Aceptar', descripcion: 'Pasa al programa del congreso.' },
  { value: 'rechazar', label: 'Rechazar', descripcion: 'No participa en esta edición.' },
]

// clase de la opción elegida: verde para aceptar y rojo para rechazar, como pide la maqueta.
const clasesSeleccion = { aceptar: styles.seleccionadaAceptar, rechazar: styles.seleccionadaRechazar }

// recuadro del 5.4. guarda un borrador o publica la decisión con alGuardar,
// que la página escribe en el repositorio de decisiones.
function DecisionModal({ alCerrar, alGuardar, codigo, decisionGuardada, filas, resumen }) {
  const publicada = decisionGuardada?.status === 'published'
  const enviados = filas.filter((fila) => !fila.pendiente && fila.comentarioAutor)
  const pendientes = filas.filter((fila) => fila.pendiente).map((fila) => fila.revisor)
  const cantidadTexto = enviados.length === filas.length
    ? `los ${filas.length} revisores`
    : `${enviados.length} de ${filas.length} revisores`
  // sin decisión guardada, la maqueta muestra aceptar marcado; el comité puede cambiarlo.
  const decisionInicial = decisionGuardada?.decision || 'aceptar'
  const [decision, setDecision] = useState(decisionInicial)
  // al entrar, el texto está en blanco; si ya hay un borrador o una decisión publicada, se muestra su texto.
  const [feedback, setFeedback] = useState(decisionGuardada?.feedback ?? '')
  // solo después de pulsar «Restaurar», el texto cambia según la decisión elegida.
  const [textoAutomatico, setTextoAutomatico] = useState(false)
  const nota = feedbackNote({ publicada, feedback, enviados, cantidadTexto })
  const [confirmando, setConfirmando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [errores, setErrores] = useState([])
  const [aviso, setAviso] = useState('')

  function elegirDecision(valor) {
    setDecision(valor)
    if (textoAutomatico) setFeedback(buildFeedbackText(valor, enviados))
  }

  function restaurarTexto() {
    setFeedback(buildFeedbackText(decision, enviados))
    setTextoAutomatico(true)
  }

  // publicar exige decisión y retroalimentación; luego pide confirmar.
  function pedirPublicar() {
    const faltantes = []
    if (!decision) faltantes.push('Elija Aceptar o Rechazar.')
    if (!feedback.trim()) faltantes.push('Escriba la retroalimentación para el autor.')
    setErrores(faltantes)
    setConfirmando(faltantes.length === 0)
  }

  // el borrador no pide nada. si el guardado falla, se conserva el formulario y se muestra el error.
  async function guardar(status) {
    setGuardando(true)
    setErrores([])
    setAviso('')
    try {
      await alGuardar({ decision, feedback, status })
      setConfirmando(false)
      setAviso(status === 'draft' ? 'Borrador guardado en este navegador.' : 'Decisión publicada.')
    } catch (error) {
      setErrores([error.message])
    } finally {
      setGuardando(false)
    }
  }

  const subtitulo = `${codigo} · promedio ${formatTenth(resumen.promedioGeneral)} · ${resumen.entregadas} de ${resumen.totalRevisiones} revisiones entregadas`

  return (
    <Modal alCerrar={alCerrar} claseTitulo={styles.titulo} subtitulo={subtitulo} tamano="amplio" titulo="Decisión final del comité">
      <div className={styles.body}>
        {publicada && (
          <p className={styles.publicada} role="status">
            Decisión publicada el {formatDate(decisionGuardada.updatedAt)}. Ya no se puede modificar.
          </p>
        )}

        <fieldset className={styles.fieldset} disabled={publicada || guardando}>
          <legend className={styles.legendOculta}>Decisión *</legend>
          <div className={styles.opciones}>
            {opciones.map((opcion) => (
              <label
                className={`${styles.opcion} ${decision === opcion.value ? clasesSeleccion[opcion.value] : ''}`}
                key={opcion.value}
              >
                <input
                  checked={decision === opcion.value}
                  name="decision-final"
                  onChange={() => elegirDecision(opcion.value)}
                  type="radio"
                  value={opcion.value}
                />
                <span>
                  <strong>{opcion.label}</strong>
                  <small>{opcion.descripcion}</small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className={styles.encabezadoCampo}>
          <label className={styles.etiquetaCampo} htmlFor="retroalimentacion-autor">
            Retroalimentación al autor *
          </label>
          <Button
            className={styles.enlace}
            disabled={publicada || guardando}
            onClick={restaurarTexto}
            size="small"
            type="button"
            variant="tertiary"
          >
            Restaurar texto de los revisores
          </Button>
        </div>
        <textarea
          className={styles.textarea}
          id="retroalimentacion-autor"
          onChange={(event) => {
            setFeedback(event.target.value)
            setTextoAutomatico(false)
          }}
          placeholder="Escriba la retroalimentación o pulse «Restaurar texto de los revisores»."
          readOnly={publicada || guardando}
          rows="5"
          value={feedback}
        />
        <p className={styles.nota}>
          {nota}
          {pendientes.length > 0 && ` Pendientes: ${pendientes.join(', ')}.`}
        </p>

        {errores.length > 0 && (
          <div className={styles.error} role="alert">
            <strong>Revise estos campos:</strong>
            <ul>
              {errores.map((error) => <li key={error}>{error}</li>)}
            </ul>
          </div>
        )}

        {aviso && <p className={styles.estado} role="status">{aviso}</p>}

        {!publicada && (
          <p className={styles.aviso}>
            Al publicar, el autor de correspondencia recibirá un correo y el resultado será visible en su detalle del trabajo. La decisión no se puede modificar después.
          </p>
        )}

        {confirmando ? (
          <div className={styles.confirmacion}>
            <p>¿Publicar la decisión? Después no se podrá modificar.</p>
            <div className={styles.acciones}>
              <Button disabled={guardando} onClick={() => setConfirmando(false)} type="button" variant="secondary">
                Volver
              </Button>
              <Button loading={guardando} onClick={() => guardar('published')} type="button" variant="primary">
                Sí, publicar decisión
              </Button>
            </div>
          </div>
        ) : publicada ? (
          <div className={styles.acciones}>
            <Button onClick={alCerrar} type="button" variant="secondary">Cerrar</Button>
          </div>
        ) : (
          <div className={styles.acciones}>
            <Button onClick={alCerrar} type="button" variant="secondary">Cancelar</Button>
            <Button
              className={styles.enlace}
              disabled={guardando}
              onClick={() => guardar('draft')}
              type="button"
              variant="tertiary"
            >
              Guardar sin publicar
            </Button>
            <Button disabled={guardando} onClick={pedirPublicar} type="button" variant="primary">
              Publicar decisión
            </Button>
          </div>
        )}
      </div>
    </Modal>
  )
}

function formatDate(fecha) {
  return new Date(fecha).toLocaleDateString('es-PE')
}

export default DecisionModal
