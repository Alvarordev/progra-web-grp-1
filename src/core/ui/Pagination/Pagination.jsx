import Button from '../Button/Button.jsx'
import styles from './Pagination.module.css'

function Pagination({ pagina, total, porPagina, alCambiar }) {
  const pages = Math.max(1, Math.ceil(total / porPagina))
  return (
    <nav aria-label="Paginación" className={styles.pagination}>
      <span>{total ? (pagina - 1) * porPagina + 1 : 0}–{Math.min(pagina * porPagina, total)} de {total} registros</span>
      <div>
        <Button disabled={pagina === 1} onClick={() => alCambiar(pagina - 1)} size="small" type="button" variant="secondary">Anterior</Button>
        <span aria-live="polite">Página {pagina} de {pages}</span>
        <Button disabled={pagina === pages} onClick={() => alCambiar(pagina + 1)} size="small" type="button" variant="secondary">Siguiente</Button>
      </div>
    </nav>
  )
}

export default Pagination
