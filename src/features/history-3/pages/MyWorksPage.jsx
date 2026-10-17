import { useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router'
import Pagination from '../../../core/ui/Pagination/Pagination.jsx'
import { formatScheduleDate } from '../../../core/utils/states/scheduleState.js'
import Button from '../../../core/ui/Button/Button.jsx'
import EmptyState from '../../../core/ui/EmptyState/EmptyState.jsx'
import AuthorPageLayout from '../components/AuthorPageLayout/AuthorPageLayout.jsx'
import DeadlineNotice from '../components/DeadlineNotice/DeadlineNotice.jsx'
import WorkCard from '../components/WorkCard/WorkCard.jsx'
import useConference from '../../../core/utils/useConference.js'
import { getAuthorWorks, receptionIsOpen } from '../../../core/utils/submissions.js'
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
  const conference = useConference()
  const open = receptionIsOpen(conference.status, conference.schedule)
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [filtroActivo, setFiltroActivo] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [page, setPage] = useState(1)

  const trabajos = searchParams.get('vista') === 'vacia' ? [] : getAuthorWorks(conference.works, conference.account, conference.decisions)
  const codigoEnviado = location.state?.enviado

  const texto = busqueda.trim().toLowerCase()
  const trabajosFiltrados = trabajos.filter(
    (trabajo) =>
      (filtroActivo === 'todos' || trabajo.estado === filtroActivo) &&
      (trabajo.titulo.toLowerCase().includes(texto) || trabajo.codigo.toLowerCase().includes(texto)),
  )

  const pageSize = 4
  const currentPage = Math.min(page, Math.max(1, Math.ceil(trabajosFiltrados.length / pageSize)))
  const visibleWorks = trabajosFiltrados.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const filtrosConCantidad = filters
    .map((filtro) => ({
      ...filtro,
      cantidad:
        filtro.estado === 'todos'
          ? trabajos.length
          : trabajos.filter((trabajo) => trabajo.estado === filtro.estado).length,
    }))
    .filter((filtro) => filtro.estado === 'todos' || filtro.cantidad > 0)

  if (conference.loading || conference.error) return <AuthorPageLayout><p role="status">{conference.error || 'Cargando trabajos…'}</p></AuthorPageLayout>

  if (trabajos.length === 0) {
    return (
      <AuthorPageLayout rutaActiva="/autor/trabajos">
        <DeadlineNotice titulo={open ? 'Recepción abierta.' : 'Recepción cerrada.'}>
          Fecha de cierre: {formatScheduleDate(conference.schedule.reception ?? '')}.
        </DeadlineNotice>
        <div className={styles.pageHeading}>
          <div>
            <h1>Mis trabajos</h1>
            <p>Aún no registra trabajos en esta edición</p>
          </div>
          <Button disabled={!open} onClick={() => navigate('/autor/nuevo-trabajo')} variant="primary">
            Nuevo trabajo
          </Button>
        </div>
        <div className={styles.emptyBox}>
          <EmptyState
            accion={
              <div className={styles.emptyActions}>
                <Button disabled={!open} onClick={() => navigate('/autor/nuevo-trabajo')} variant="primary">
                  Registrar mi primer trabajo
                </Button>
                <Link className={styles.textLink} to="/bases">
                  Revisar las bases del congreso
                </Link>
              </div>
            }
            descripcion={open ? 'Puede guardar su trabajo como borrador y completarlo antes del cierre de recepción.' : 'La recepción está cerrada. Consulte las fechas vigentes en las bases del congreso.'}
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
      <DeadlineNotice titulo={open ? 'Recepción abierta.' : 'Recepción cerrada.'}>
        Consulte el dictamen y las fechas vigentes desde el detalle y las bases.
      </DeadlineNotice>

      <div className={styles.pageHeading}>
        <div>
          <h1>Mis trabajos</h1>
          <p>{trabajos.length} trabajos registrados como autora o coautora</p>
        </div>
        <Button type="button" disabled={!open} onClick={() => navigate('/autor/nuevo-trabajo')}> {open ? 'Nuevo trabajo' : 'Nuevo trabajo (recepción cerrada)'} </Button>
      </div>

      <div className={styles.toolbar}>
        <div aria-label="Filtrar por estado" className={styles.filters} role="group">
          {filtrosConCantidad.map((filtro) => (
            <button
              aria-pressed={filtroActivo === filtro.estado}
              className={`${styles.filter} ${filtroActivo === filtro.estado ? styles.filterActive : ''}`}
              key={filtro.estado}
              onClick={() => { setFiltroActivo(filtro.estado); setPage(1) }}
              type="button"
            >
              {filtro.label} · {filtro.cantidad}
            </button>
          ))}
        </div>
        <label className={styles.search}>
          <span className={styles.visuallyHidden}>Buscar trabajos</span>
          <input
            onChange={(event) => { setBusqueda(event.target.value); setPage(1) }}
            placeholder="Buscar por título o código…"
            type="search"
            value={busqueda}
          />
        </label>
      </div>

      {trabajosFiltrados.length > 0 ? (
        <section aria-label="Lista de trabajos" className={styles.workGrid}>
          {visibleWorks.map((trabajo) => (
            <WorkCard key={trabajo.codigo} trabajo={trabajo} recepcionAbierta={open} />
          ))}
        </section>
      ) : (
        <p className={styles.noResults}>Ningún trabajo coincide con la búsqueda.</p>
      )}

      <Pagination pagina={currentPage} porPagina={pageSize} total={trabajosFiltrados.length} alCambiar={setPage} />
    </AuthorPageLayout>
  )
}

export default MyWorksPage
