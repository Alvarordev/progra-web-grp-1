import { useState } from 'react'
import Button from '../../../../core/ui/Button/Button.jsx'
import Modal from '../../../../core/ui/Modal/Modal.jsx'
import { formatTenth } from '../../utils/scoring.js'
import styles from './DecisionModal.module.css'

const opciones = [
  { value: 'aceptar', label: 'Aceptar', descripcion: 'Pasa al programa del congreso.' },
  { value: 'rechazar', label: 'Rechazar', descripcion: 'No participa en esta edición.' },
]

// Recuadro del 5.4. Guarda un borrador o publica la decisión con alGuardar,
// que la página escribe en el repositorio de decisiones.
function DecisionModal({ alCerrar, alGuardar, codigo, decisionGuardada, filas, resumen }) {
  const publicada = decisionGuardada?.status === 'published'
  const enviados = filas.filter((fila) => !fila.pendiente && fila.comentarioAutor)
  const pendientes = filas.filter((fila) => fila.pendiente).map((fila) => fila.revisor)
  const textoPrecargado = enviados.map((fila) => fila.comentarioAutor).join(' ')
  const nota = enviados.length
    ? `Precargado con los comentarios al autor de ${enviados.length} de ${filas.length} revisores. Puede editarlo antes de publicar.`
    : 'Pendiente: el texto se precarga cuando los revisores envíen sus comentarios.'

  const [decision, setDecision] = useState(decisionGuardada?.decision ?? '')
  const [feedback, setFeedback] = useState(decisionGuardada?.feedback ?? textoPrecargado)
  const [confirmando, setConfirmando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [errores, setErrores] = useState([])
  const [aviso, setAviso] = useState('')

  // Publicar exige decisión y retroalimentación; luego pide confirmar.
  function pedirPublicar() {
    const faltantes = []
    if (!decision) faltantes.push('Elija Aceptar o Rechazar.')
    if (!feedback.trim()) faltantes.push('Escriba la retroalimentación para el autor.')
    setErrores(faltantes)
    setConfirmando(faltantes.length === 0)
  }

  // El borrador no pide nada. Si el guardado falla, se conserva el formulario y se muestra el error.
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

  return (
    <Modal alCerrar={alCerrar} titulo="Decisión final del comité">
      <p className={styles.subtitulo}>
        {codigo} · promedio {formatTenth(resumen.promedioGeneral)} · {resumen.entregadas} de {resumen.totalRevisiones} revisiones entregadas
      </p>

      {publicada && (
        <p className={styles.publicada} role="status">
          Decisión publicada el {formatDate(decisionGuardada.updatedAt)}. Ya no se puede modificar.
        </p>
      )}

      <fieldset className={styles.fieldset} disabled={publicada || guardando}>
        <legend>Decisión *</legend>
        <div className={styles.opciones}>
          {opciones.map((opcion) => (
            <label className={styles.opcion} key={opcion.value}>
              <input
                checked={decision === opcion.value}
                name="decision-final"
                onChange={() => setDecision(opcion.value)}
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
        <label htmlFor="retroalimentacion-autor">Retroalimentación al autor *</label>
        <Button
          disabled={publicada || guardando}
          onClick={() => setFeedback(textoPrecargado)}
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
        onChange={(event) => setFeedback(event.target.value)}
        placeholder="Pendiente: se redacta con los comentarios de los revisores."
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
          <Button disabled={guardando} onClick={() => guardar('draft')} type="button" variant="tertiary">
            Guardar sin publicar
          </Button>
          <Button disabled={guardando} onClick={pedirPublicar} type="button" variant="primary">
            Publicar decisión
          </Button>
        </div>
      )}
    </Modal>
  )
}

function formatDate(fecha) {
  return new Date(fecha).toLocaleDateString('es-PE')
}

export default DecisionModal
