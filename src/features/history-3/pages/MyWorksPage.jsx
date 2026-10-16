import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import EmptyState from '../../../core/ui/EmptyState/EmptyState.jsx'
import AuthorPageLayout from '../components/AuthorPageLayout/AuthorPageLayout.jsx'
import DeadlineNotice from '../components/DeadlineNotice/DeadlineNotice.jsx'
import WorkCard from '../components/WorkCard/WorkCard.jsx'
import { works } from '../data/works.js'
import styles from './MyWorksPage.module.css'

const filters = [
  { label: 'Todos', estado: 'todos' },
  { label: 'Borrador', estado: 'borrador' },
  { label: 'En revisión', estado: 'revision' },
  { label: 'Aceptado', estado: 'aceptado' },
  { label: 'Rechazado', estado: 'rechazado' },
]

function MyWorksPage() {
  const [searchParams] = useSearchParams()
  const [filtroActivo, setFiltroActivo] = useState('todos')
  const [busqueda, setBusqueda] = useState('')

  const trabajos = searchParams.get('vista') === 'vacia' ? [] : works

  const texto = busqueda.trim().toLowerCase()
  const trabajosFiltrados = trabajos.filter(
    (trabajo) =>
      (filtroActivo === 'todos' || trabajo.estado === filtroActivo) &&
      (trabajo.titulo.toLowerCase().includes(texto) || trabajo.codigo.toLowerCase().includes(texto)),
  )

  if (trabajos.length === 0) {
    return (
      <AuthorPageLayout rutaActiva="/autor/trabajos">
        <DeadlineNotice restante="Faltan 12 días · 04:11 h">
          Recepción abierta. Cierra el 30/09/2026 a las 23:59.
        </DeadlineNotice>
        <div className={styles.pageHeading}>
          <div>
            <h1>Mis trabajos</h1>
            <p>Aún no registra trabajos en esta edición</p>
          </div>
          <Link className={styles.primaryLink} to="/autor/nuevo-trabajo">
            Nuevo trabajo
          </Link>
        </div>
        <EmptyState
          accion={
            <Link className={styles.primaryLink} to="/autor/nuevo-trabajo">
              Registrar mi primer trabajo
            </Link>
          }
          descripcion="Registre su trabajo antes del 30/09/2026 a las 23:59. Puede guardarlo como borrador y completarlo después."
          icono="✎"
          titulo="Todavía no tiene trabajos registrados"
        />
      </AuthorPageLayout>
    )
  }

  return (
    <AuthorPageLayout estado="En revisión" rutaActiva="/autor/trabajos">
      <DeadlineNotice restante="Faltan 22 días" tipo="warning">
        Etapa de revisión. Los resultados se publican el 28/10/2026 a las 12:00.
      </DeadlineNotice>

      <div className={styles.pageHeading}>
        <div>
          <h1>Mis trabajos</h1>
          <p>{trabajos.length} trabajos registrados como autora o coautora</p>
        </div>
        <span aria-disabled="true" className={styles.disabledLink}>
          Nuevo trabajo (recepción cerrada)
        </span>
      </div>

      <div className={styles.toolbar}>
        <div aria-label="Filtrar por estado" className={styles.filters} role="group">
          {filters.map((filtro) => {
            const cantidad =
              filtro.estado === 'todos'
                ? trabajos.length
                : trabajos.filter((trabajo) => trabajo.estado === filtro.estado).length

            return (
              <button
                aria-pressed={filtroActivo === filtro.estado}
                className={`${styles.filter} ${filtroActivo === filtro.estado ? styles.filterActive : ''}`}
                key={filtro.estado}
                onClick={() => setFiltroActivo(filtro.estado)}
                type="button"
              >
                {filtro.label} · {cantidad}
              </button>
            )
          })}
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

      <section aria-label="Lista de trabajos" className={styles.workGrid}>
        {trabajosFiltrados.map((trabajo) => (
          <WorkCard key={trabajo.codigo} trabajo={trabajo} />
        ))}
      </section>

      <p className={styles.resultCount}>
        {trabajosFiltrados.length === 0
          ? 'Ningún trabajo coincide con la búsqueda.'
          : `Mostrando ${trabajosFiltrados.length} de ${trabajos.length} trabajos`}
      </p>
    </AuthorPageLayout>
  )
}

export default MyWorksPage
