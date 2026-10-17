import { useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router'
import Button from '../../../core/ui/Button/Button.jsx'
import EmptyState from '../../../core/ui/EmptyState/EmptyState.jsx'
import AuthorPageLayout from '../components/AuthorPageLayout/AuthorPageLayout.jsx'
import DeadlineNotice from '../components/DeadlineNotice/DeadlineNotice.jsx'
import WorkCard from '../components/WorkCard/WorkCard.jsx'
import { getWorks } from '../data/works.js'
import styles from './MyWorksPage.module.css'

const filters = [
  { label: 'Todos', estado: 'todos' },
  { label: 'Borrador', estado: 'borrador' },
  { label: 'Enviado', estado: 'enviado' },
  { label: 'En revisión', estado: 'revision' },
  { label: 'Aceptado', estado: 'aceptado' },
  { label: 'Rechazado', estado: 'rechazado' },
]

function MyWorksPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [filtroActivo, setFiltroActivo] = useState('todos')
  const [busqueda, setBusqueda] = useState('')

  const trabajos = searchParams.get('vista') === 'vacia' ? [] : getWorks()
  const codigoEnviado = location.state?.enviado

  const texto = busqueda.trim().toLowerCase()
  const trabajosFiltrados = trabajos.filter(
    (trabajo) =>
      (filtroActivo === 'todos' || trabajo.estado === filtroActivo) &&
      (trabajo.titulo.toLowerCase().includes(texto) || trabajo.codigo.toLowerCase().includes(texto)),
  )

  const filtrosConCantidad = filters
    .map((filtro) => ({
      ...filtro,
      cantidad:
        filtro.estado === 'todos'
          ? trabajos.length
          : trabajos.filter((trabajo) => trabajo.estado === filtro.estado).length,
    }))
    .filter((filtro) => filtro.estado === 'todos' || filtro.cantidad > 0)

  if (trabajos.length === 0) {
    return (
      <AuthorPageLayout rutaActiva="/autor/trabajos">
        <DeadlineNotice restante="Faltan 12 días · 04:11 h" titulo="Recepción abierta.">
          Cierra el 30/09/2026 a las 23:59.
        </DeadlineNotice>
        <div className={styles.pageHeading}>
          <div>
            <h1>Mis trabajos</h1>
            <p>Aún no registra trabajos en esta edición</p>
          </div>
          <Button onClick={() => navigate('/autor/nuevo-trabajo')} variant="primary">
            Nuevo trabajo
          </Button>
        </div>
        <div className={styles.emptyBox}>
          <EmptyState
            accion={
              <div className={styles.emptyActions}>
                <Button onClick={() => navigate('/autor/nuevo-trabajo')} variant="primary">
                  Registrar mi primer trabajo
                </Button>
                <Link className={styles.textLink} to="/bases">
                  Revisar las bases del congreso
                </Link>
              </div>
            }
            descripcion="Registre su trabajo antes del 30/09/2026 a las 23:59. Puede guardarlo como borrador y completarlo después."
            icono="✎"
            titulo="Todavía no tiene trabajos registrados"
          />
        </div>
      </AuthorPageLayout>
    )
  }

  return (
    <AuthorPageLayout estado="En revisión" rutaActiva="/autor/trabajos">
      {codigoEnviado && (
        <p className={styles.success} role="status">
          ✓ Trabajo {codigoEnviado} enviado al comité. Ya aparece en su lista de trabajos.
        </p>
      )}
      <DeadlineNotice restante="Faltan 22 días" titulo="Etapa de revisión.">
        Los resultados se publican el 28/10/2026 a las 12:00.
      </DeadlineNotice>

      <div className={styles.pageHeading}>
        <div>
          <h1>Mis trabajos</h1>
          <p>{trabajos.length} trabajos registrados como autora o coautora</p>
        </div>
        <button className={styles.closedButton} disabled type="button">
          Nuevo trabajo (recepción cerrada)
        </button>
      </div>

      <div className={styles.toolbar}>
        <div aria-label="Filtrar por estado" className={styles.filters} role="group">
          {filtrosConCantidad.map((filtro) => (
            <button
              aria-pressed={filtroActivo === filtro.estado}
              className={`${styles.filter} ${filtroActivo === filtro.estado ? styles.filterActive : ''}`}
              key={filtro.estado}
              onClick={() => setFiltroActivo(filtro.estado)}
              type="button"
            >
              {filtro.label} · {filtro.cantidad}
            </button>
          ))}
        </div>
        <label className={styles.search}>
          <span className={styles.visuallyHidden}>Buscar trabajos</span>
          <input
            onChange={(event) => setBusqueda(event.target.value)}
            placeholder="Buscar por título o código…"
            type="search"
            value={busqueda}
          />
        </label>
      </div>

      {trabajosFiltrados.length > 0 ? (
        <section aria-label="Lista de trabajos" className={styles.workGrid}>
          {trabajosFiltrados.map((trabajo) => (
            <WorkCard key={trabajo.codigo} trabajo={trabajo} />
          ))}
        </section>
      ) : (
        <p className={styles.noResults}>Ningún trabajo coincide con la búsqueda.</p>
      )}

      <nav aria-label="Paginación" className={styles.pagination}>
        <span>
          Mostrando {trabajosFiltrados.length} de {trabajos.length} trabajos
        </span>
        <div className={styles.pages}>
          <button className={styles.pageButton} disabled type="button">
            Anterior
          </button>
          <span aria-current="page" className={styles.currentPage}>
            1
          </span>
          <button className={styles.pageButton} disabled type="button">
            Siguiente
          </button>
        </div>
      </nav>
    </AuthorPageLayout>
  )
}

export default MyWorksPage
