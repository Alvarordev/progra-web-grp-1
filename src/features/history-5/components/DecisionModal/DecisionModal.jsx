import { useState } from 'react'
import Button from '../../../../core/ui/Button/Button.jsx'
import Modal from '../../../../core/ui/Modal/Modal.jsx'
import { formatTenth } from '../../utils/scoring.js'
import styles from './DecisionModal.module.css'

const opciones = [
  { value: 'aceptar', label: 'Aceptar', descripcion: 'Pasa al programa del congreso.' },
  { value: 'rechazar', label: 'Rechazar', descripcion: 'No participa en esta edición.' },
]

function DecisionModal({ alCerrar, codigo, resumen, filas, datos, decision }) {
  const enviados = filas.filter((fila) => !fila.pendiente && fila.comentarioAutor)
  const pendientes = filas.filter((fila) => fila.pendiente).map((fila) => fila.revisor)
  const textoPrecargado = enviados.map((fila) => fila.comentarioAutor).join(' ')
  const nota = enviados.length
    ? `Precargado con los comentarios al autor de ${enviados.length} de ${filas.length} revisores. Puede editarlo antes de publicar.`
    : 'Pendiente: el texto se precarga cuando los revisores envíen sus comentarios.'

  const [result, setResult] = useState(decision?.resultado ?? 'aceptar')
  const [feedback, setFeedback] = useState(decision?.retroalimentacion ?? textoPrecargado)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const published = decision?.status === 'published'

  async function save(publish) {
    if (saving || published) return
    if (!feedback.trim()) { setError('Escriba la retroalimentación al autor.'); return }
    setSaving(true)
    setError('')
    try {
      const record = { resultado: result, retroalimentacion: feedback.trim(), status: publish ? 'published' : 'draft', updatedAt: new Date().toISOString(), promedio: resumen.promedioGeneral, puntajes: datos.criteria.map((criterion, index) => ({ criterio: `${criterion.nombre} (${criterion.peso} %)`, nota: String(filas.filter(row => !row.pendiente).reduce((sum, row) => sum + Number(row.criterios[index]?.puntaje || 0), 0) / Math.max(1, resumen.entregadas)) })), revisiones: enviados.map(row => ({ recomendacion: row.recomendacion, comentario: row.comentarioAutor })) }
      await datos.save('decisions', { ...datos.decisions, [codigo]: record })
      if (publish) {
        await datos.save('works', datos.works.map(work => work.codigo === codigo ? { ...work, estado: result === 'aceptar' ? 'Aceptado' : 'Rechazado' } : work))
      }
      alCerrar()
    } catch (cause) { setError(cause.message) } finally { setSaving(false) }
  }

  return (
    <Modal alCerrar={() => { if (!saving) alCerrar() }} titulo="Decisión final del comité">
      <p className={styles.subtitulo}>
        {codigo} · promedio {formatTenth(resumen.promedioGeneral)} · {resumen.entregadas} de {resumen.totalRevisiones} revisiones entregadas
      </p>

      <fieldset className={styles.fieldset}>
        <legend>Decisión *</legend>
        <div className={styles.opciones}>
          {opciones.map((opcion) => (
            <label className={styles.opcion} key={opcion.value}>
              <input type="radio" name="decision-final" value={opcion.value} checked={result === opcion.value} disabled={saving || published} onChange={() => setResult(opcion.value)} />
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
        <Button disabled={saving || published} onClick={() => setFeedback(textoPrecargado)} variant="tertiary" type="button" size="small">Restaurar texto de los revisores</Button>
      </div>
      <textarea
        id="retroalimentacion-autor"
        className={styles.textarea}
        rows="5"
        value={feedback}
        disabled={saving || published}
        onChange={event => setFeedback(event.target.value)}
        placeholder="Pendiente: se redacta con los comentarios de los revisores."
      />
      <p className={styles.nota}>
        {nota}
        {pendientes.length > 0 && ` Pendientes: ${pendientes.join(', ')}.`}
      </p>

      <p className={styles.aviso}>
        Al publicar, el autor de correspondencia recibirá un correo y el resultado será visible en su detalle del trabajo. La decisión no se puede modificar después.
      </p>

      {error && <p role="alert">{error}</p>}
      <div className={styles.acciones}>
        <Button disabled={saving} onClick={alCerrar} variant="secondary" type="button">Cancelar</Button>
        <Button disabled={saving || published} onClick={() => save(false)} variant="tertiary" type="button">Guardar sin publicar</Button>
        <Button disabled={published} loading={saving} onClick={() => save(true)} variant="primary" type="button">{published ? 'Decisión publicada' : 'Publicar decisión'}</Button>
      </div>
    </Modal>
  )
}

export default DecisionModal
