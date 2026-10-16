import Button from '../../../../core/ui/Button/Button.jsx'
import Modal from '../../../../core/ui/Modal/Modal.jsx'
import { formatTenth } from '../../utils/scoring.js'
import styles from './DecisionModal.module.css'

const opciones = [
  { value: 'aceptar', label: 'Aceptar', descripcion: 'Pasa al programa del congreso.' },
  { value: 'rechazar', label: 'Rechazar', descripcion: 'No participa en esta edición.' },
]

// Solo muestra la interfaz del 5.4. Los botones todavía no tienen acciones;
// la X solo cierra el recuadro.
function DecisionModal({ alCerrar, codigo, resumen, filas }) {
  const enviados = filas.filter((fila) => !fila.pendiente && fila.comentarioAutor)
  const pendientes = filas.filter((fila) => fila.pendiente).map((fila) => fila.revisor)
  const textoPrecargado = enviados.map((fila) => fila.comentarioAutor).join(' ')
  const nota = enviados.length
    ? `Precargado con los comentarios al autor de ${enviados.length} de ${filas.length} revisores. Puede editarlo antes de publicar.`
    : 'Pendiente: el texto se precarga cuando los revisores envíen sus comentarios.'

  return (
    <Modal alCerrar={alCerrar} titulo="Decisión final del comité">
      <p className={styles.subtitulo}>
        {codigo} · promedio {formatTenth(resumen.promedioGeneral)} · {resumen.entregadas} de {resumen.totalRevisiones} revisiones entregadas
      </p>

      <fieldset className={styles.fieldset}>
        <legend>Decisión *</legend>
        <div className={styles.opciones}>
          {opciones.map((opcion) => (
            <label className={styles.opcion} key={opcion.value}>
              <input type="radio" name="decision-final" value={opcion.value} />
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
        <Button variant="tertiary" type="button" size="small">Restaurar texto de los revisores</Button>
      </div>
      <textarea
        id="retroalimentacion-autor"
        className={styles.textarea}
        rows="5"
        defaultValue={textoPrecargado}
        placeholder="Pendiente: se redacta con los comentarios de los revisores."
      />
      <p className={styles.nota}>
        {nota}
        {pendientes.length > 0 && ` Pendientes: ${pendientes.join(', ')}.`}
      </p>

      <p className={styles.aviso}>
        Al publicar, el autor de correspondencia recibirá un correo y el resultado será visible en su detalle del trabajo. La decisión no se puede modificar después.
      </p>

      <div className={styles.acciones}>
        <Button variant="secondary" type="button">Cancelar</Button>
        <Button variant="tertiary" type="button">Guardar sin publicar</Button>
        <Button variant="primary" type="button">Publicar decisión</Button>
      </div>
    </Modal>
  )
}

export default DecisionModal
