import { useState } from 'react'
import Button from '../../../../core/ui/Button/Button.jsx'
import Modal from '../../../../core/ui/Modal/Modal.jsx'
import styles from './FinalVersionModal.module.css'

export default function FinalVersionModal({ alCerrar, alGuardar, guardando, error }) {
  const [url, setUrl] = useState('')
  return (
    <Modal titulo="Subir versión final" alCerrar={alCerrar}>
      <form
        className={styles.form}
        onSubmit={event => {
          event.preventDefault()
          alGuardar(url)
        }}
      >
        <label htmlFor="final-document">Enlace de la versión final *</label>
        <input
          disabled={guardando}
          id="final-document"
          type="url"
          pattern="https://.*"
          required
          value={url}
          onChange={event => setUrl(event.target.value)}
        />
        <p>Comparta un enlace HTTPS de lectura al documento corregido.</p>
        {error && <p role="alert">{error}</p>}
        <footer>
          <Button
            disabled={guardando}
            type="button"
            variant="secondary"
            onClick={alCerrar}
          >
            Cancelar
          </Button>
          <Button loading={guardando} type="submit">
            Guardar versión final
          </Button>
        </footer>
      </form>
    </Modal>
  )
}
