import Button from '../../../../core/ui/Button/Button.jsx'
import Modal from '../../../../core/ui/Modal/Modal.jsx'
import { formatTenth } from '../../utils/scoring.js'
import styles from './DecisionModal.module.css'

// Solo muestra la interfaz del 5.4. Los botones todavía no tienen acciones;
// la X solo cierra el recuadro.
function DecisionModal({ alCerrar, codigo, resumen, filas }) {
  const opciones = [
    { value: 'aceptar', label: 'Aceptar', descripcion: 'Pasa al programa del congreso.' },
    { value: 'rechazar', label: 'Rechazar', descripcion: 'No participa en esta edición.' },
  ]

  return (
    <Modal alCerrar={alCerrar} titulo="Decisión final del comité">
      <p className={styles.subtitulo}>
        {codigo} · promedio {formatTenth(resumen.promedioGeneral)} · {resumen.entregadas} de {resumen.totalRevisiones} revisiones entregadas
      </p>

      <fieldset className={styles.fieldset}>
        <legend>Decisión</legend>
        {opciones.map((opcion) => (
          <label className={styles.opcion} key={opcion.value}>
            <input type="radio" name="decision-final" value={opcion.value} />
            <span>
              <strong>{opcion.label}</strong>
              <small>{opcion.descripcion}</small>
            </span>
          </label>
        ))}
      </fieldset>

      <section className={styles.bloque} aria-labelledby="retroalimentacion-titulo">
        <h3 id="retroalimentacion-titulo">Comentarios de los revisores</h3>
        <ul className={styles.lista}>
          {filas.map((fila) => (
            <li key={fila.revisor}>
              <strong>{fila.revisor}:</strong>{' '}
              {fila.pendiente ? 'Pendiente, todavía no envía su evaluación.' : fila.comentarioAutor}
            </li>
          ))}
        </ul>
        <label className={styles.campo}>
          <span>Retroalimentación para el autor *</span>
          <textarea
            rows="4"
            placeholder="Pendiente: se redacta con los comentarios de los revisores."
          />
        </label>
      </section>

      <p className={styles.aviso}>
        Al publicar, el autor de correspondencia recibirá un correo y el resultado será visible en su detalle del trabajo. La decisión no se puede modificar después.
      </p>

      <div className={styles.acciones}>
        <Button variant="secondary" type="button">Cancelar</Button>
        <Button variant="secondary" type="button">Guardar sin publicar</Button>
        <Button variant="primary" type="button">Publicar decisión</Button>
      </div>
    </Modal>
  )
}

export default DecisionModal
