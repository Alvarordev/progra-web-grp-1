import { useMemo, useState } from 'react'
import Button from '../core/ui/Button/Button.jsx'
import Header from '../core/ui/Header/Header.jsx'
import styles from './HU7.module.css'

/* ------------------------------------------------------------------ */
/* Datos de ejemplo. Reemplaza estas constantes por la llamada al      */
/* backend / servicio cuando esté disponible.                          */
/* ------------------------------------------------------------------ */

const works = [
  { id: 'TRB-2026-001', eje: 'Inteligencia artificial y datos', tipo: 'Artículo completo', estado: 'Aceptado' },
  { id: 'TRB-2026-002', eje: 'Inteligencia artificial y datos', tipo: 'Artículo completo', estado: 'En revisión' },
  { id: 'TRB-2026-003', eje: 'Educación y sociedad', tipo: 'Resumen extendido', estado: 'Aceptado' },
  { id: 'TRB-2026-004', eje: 'Educación y sociedad', tipo: 'Póster', estado: 'Rechazado' },
  { id: 'TRB-2026-005', eje: 'Salud y bienestar', tipo: 'Artículo completo', estado: 'Enviado' },
  { id: 'TRB-2026-006', eje: 'Salud y bienestar', tipo: 'Resumen extendido', estado: 'Aceptado' },
  { id: 'TRB-2026-007', eje: 'Ingeniería y tecnología', tipo: 'Artículo completo', estado: 'En revisión' },
  { id: 'TRB-2026-008', eje: 'Ingeniería y tecnología', tipo: 'Póster', estado: 'Aceptado' },
  { id: 'TRB-2026-009', eje: 'Ingeniería y tecnología', tipo: 'Artículo completo', estado: 'Rechazado' },
  { id: 'TRB-2026-010', eje: 'Medio ambiente', tipo: 'Resumen extendido', estado: 'En revisión' },
  { id: 'TRB-2026-011', eje: 'Medio ambiente', tipo: 'Póster', estado: 'Aceptado' },
  { id: 'TRB-2026-012', eje: 'Inteligencia artificial y datos', tipo: 'Póster', estado: 'Enviado' },
  { id: 'TRB-2026-013', eje: 'Educación y sociedad', tipo: 'Artículo completo', estado: 'En revisión' },
  { id: 'TRB-2026-014', eje: 'Salud y bienestar', tipo: 'Póster', estado: 'Borrador' },
]

const reviewers = [
  { id: 1, nombre: 'Dra. Carmen Salazar', asignadas: 8, entregadas: 7, vencidas: 0 },
  { id: 2, nombre: 'Mg. Luis Paredes', asignadas: 10, entregadas: 6, vencidas: 2 },
  { id: 3, nombre: 'Dr. Andrés Villanueva', asignadas: 6, entregadas: 6, vencidas: 0 },
  { id: 4, nombre: 'Mg. Patricia Huamán', asignadas: 9, entregadas: 4, vencidas: 3 },
  { id: 5, nombre: 'Dra. Julia Ortega', asignadas: 5, entregadas: 3, vencidas: 1 },
]

const users = [
  { id: 1, nombre: 'Rosa Quispe Ttito', correo: 'rquispe@universidad.edu', rol: 'Autor', institucion: 'Universidad Nacional del Centro', registro: '12/08/2026', trabajos: 2, activo: true },
  { id: 2, nombre: 'Diego Chávez Manrique', correo: 'dchavez@universidad.edu', rol: 'Autor', institucion: 'Universidad Nacional del Centro', registro: '12/08/2026', trabajos: 2, activo: true },
  { id: 3, nombre: 'Dra. Carmen Salazar', correo: 'csalazar@universidad.edu', rol: 'Revisor', institucion: 'Universidad de Lima', registro: '03/08/2026', trabajos: 8, activo: true },
  { id: 4, nombre: 'Mg. Luis Paredes', correo: 'lparedes@universidad.edu', rol: 'Revisor', institucion: 'PUCP', registro: '04/08/2026', trabajos: 10, activo: true },
  { id: 5, nombre: 'Mariana Torres Rojas', correo: 'mtorres@universidad.edu', rol: 'Autor', institucion: 'Universidad San Marcos', registro: '15/08/2026', trabajos: 1, activo: true },
  { id: 6, nombre: 'Jorge Mendoza Alva', correo: 'jmendoza@universidad.edu', rol: 'Autor', institucion: 'UNI', registro: '18/08/2026', trabajos: 1, activo: false },
  { id: 7, nombre: 'Dr. Andrés Villanueva', correo: 'avillanueva@universidad.edu', rol: 'Revisor', institucion: 'Universidad del Pacífico', registro: '02/08/2026', trabajos: 6, activo: true },
  { id: 8, nombre: 'Elena Campos Ruiz', correo: 'ecampos@congreso.edu', rol: 'Organizador', institucion: 'Comité organizador', registro: '01/08/2026', trabajos: 0, activo: true },
  { id: 9, nombre: 'Mg. Patricia Huamán', correo: 'phuaman@universidad.edu', rol: 'Revisor', institucion: 'Universidad Agraria', registro: '05/08/2026', trabajos: 9, activo: true },
  { id: 10, nombre: 'Sofía Linares Díaz', correo: 'slinares@universidad.edu', rol: 'Autor', institucion: 'Universidad de Piura', registro: '20/08/2026', trabajos: 3, activo: true },
  { id: 11, nombre: 'Ricardo Aguirre León', correo: 'raguirre@congreso.edu', rol: 'Organizador', institucion: 'Comité organizador', registro: '01/08/2026', trabajos: 0, activo: true },
  { id: 12, nombre: 'Dra. Julia Ortega', correo: 'jortega@universidad.edu', rol: 'Revisor', institucion: 'UPC', registro: '06/08/2026', trabajos: 5, activo: false },
]

const roles = ['Autor', 'Revisor', 'Organizador']
const PAGE_SIZE = 5

const statusClass = {
  Borrador: 'draft',
  Enviado: 'submitted',
  'En revisión': 'review',
  Aceptado: 'accepted',
  Rechazado: 'rejected',
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function countBy(list, key) {
  const counts = list.reduce((acc, item) => {
    acc[item[key]] = (acc[item[key]] || 0) + 1
    return acc
  }, {})
  return Object.entries(counts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
}

function percent(part, total) {
  return total === 0 ? 0 : Math.round((part / total) * 100)
}

/* Gráfico de barras horizontales hecho con CSS: no requiere librerías. */
function DistributionChart({ title, data, colorByLabel = false }) {
  const max = Math.max(...data.map((item) => item.value), 1)

  return (
    <article className={styles.chartCard}>
      <h3>{title}</h3>
      <ul className={styles.chartList}>
        {data.map((item) => (
          <li className={styles.chartRow} key={item.label}>
            <span className={styles.chartLabel}>{item.label}</span>
            <span aria-hidden="true" className={styles.chartTrack}>
              <span
                className={`${styles.chartFill} ${
                  colorByLabel ? styles[`fill_${statusClass[item.label]}`] : ''
                }`}
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </span>
            <span className={styles.chartValue}>{item.value}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

function HU7() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [page, setPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState(null)

  /* Tablero */
  const metrics = useMemo(() => {
    const recibidos = works.filter((work) => work.estado !== 'Borrador').length
    const aceptados = works.filter((work) => work.estado === 'Aceptado').length
    const pendientes = reviewers.reduce(
      (total, reviewer) => total + (reviewer.asignadas - reviewer.entregadas),
      0,
    )
    return {
      recibidos,
      aceptados,
      tasa: percent(aceptados, recibidos),
      pendientes,
    }
  }, [])

  /* Distribuciones */
  const byEje = useMemo(() => countBy(works, 'eje'), [])
  const byTipo = useMemo(() => countBy(works, 'tipo'), [])
  const byEstado = useMemo(() => countBy(works, 'estado'), [])

  /* Usuarios filtrados + paginados */
  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase()
    return users.filter((user) => {
      const matchesRole = !roleFilter || user.rol === roleFilter
      const matchesSearch =
        !term ||
        user.nombre.toLowerCase().includes(term) ||
        user.correo.toLowerCase().includes(term)
      return matchesRole && matchesSearch
    })
  }, [search, roleFilter])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  function handleSearch(event) {
    setSearch(event.target.value)
    setPage(1)
  }

  function handleRole(event) {
    setRoleFilter(event.target.value)
    setPage(1)
  }

  function clearFilters() {
    setSearch('')
    setRoleFilter('')
    setPage(1)
  }

  return (
    <div className={styles.page}>
      <Header estado={'Recepcion abierta'} />

      <main className={styles.content}>
        <section aria-labelledby="page-title" className={styles.intro}>
          <p className={styles.eyebrow}>HU-7 · Complementaria</p>
          <h1 id="page-title">Métricas y usuarios</h1>
          <p className={styles.lead}>
            Seguimiento de la recepción de trabajos, la carga de los revisores
            y la gestión de usuarios del congreso.
          </p>
        </section>

        {/* 1. Tablero */}
        <section aria-labelledby="board-title" className={styles.section}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Resumen general</p>
              <h2 id="board-title">Tablero de trabajos</h2>
            </div>
            <p className={styles.sectionDescription}>
              La tasa de aceptación se calcula sobre los trabajos recibidos
              (se excluyen los borradores).
            </p>
          </div>
          <ul className={styles.kpiGrid}>
            <li className={styles.kpi}>
              <span className={styles.kpiLabel}>Trabajos recibidos</span>
              <strong className={styles.kpiValue}>{metrics.recibidos}</strong>
            </li>
            <li className={styles.kpi}>
              <span className={styles.kpiLabel}>Trabajos aceptados</span>
              <strong className={styles.kpiValue}>{metrics.aceptados}</strong>
            </li>
            <li className={styles.kpi}>
              <span className={styles.kpiLabel}>Tasa de aceptación</span>
              <strong className={styles.kpiValue}>{metrics.tasa}%</strong>
            </li>
            <li className={`${styles.kpi} ${styles.kpiWarning}`}>
              <span className={styles.kpiLabel}>Revisiones pendientes</span>
              <strong className={styles.kpiValue}>{metrics.pendientes}</strong>
            </li>
          </ul>
        </section>

        {/* 2. Distribución */}
        <section aria-labelledby="distribution-title" className={styles.section}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Gráficos</p>
              <h2 id="distribution-title">Distribución de trabajos</h2>
            </div>
            <p className={styles.sectionDescription}>
              Cada barra incluye su valor numérico; el color nunca es el único
              indicador.
            </p>
          </div>
          <div className={styles.chartGrid}>
            <DistributionChart title="Por eje temático" data={byEje} />
            <DistributionChart title="Por tipo de trabajo" data={byTipo} />
            <DistributionChart title="Por estado" data={byEstado} colorByLabel />
          </div>
        </section>

        {/* 3. Revisores */}
        <section aria-labelledby="reviewers-title" className={styles.section}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Revisión</p>
              <h2 id="reviewers-title">Carga y cumplimiento por revisor</h2>
            </div>
            <p className={styles.sectionDescription}>
              El cumplimiento es el porcentaje de revisiones entregadas sobre
              las asignadas.
            </p>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <caption className={styles.srOnly}>
                Carga y cumplimiento por revisor
              </caption>
              <thead>
                <tr>
                  <th scope="col">Revisor</th>
                  <th scope="col" className={styles.numeric}>Asignadas</th>
                  <th scope="col" className={styles.numeric}>Entregadas</th>
                  <th scope="col" className={styles.numeric}>Vencidas</th>
                  <th scope="col">Cumplimiento</th>
                </tr>
              </thead>
              <tbody>
                {reviewers.map((reviewer) => {
                  const compliance = percent(reviewer.entregadas, reviewer.asignadas)
                  return (
                    <tr key={reviewer.id}>
                      <th scope="row">{reviewer.nombre}</th>
                      <td className={styles.numeric}>{reviewer.asignadas}</td>
                      <td className={styles.numeric}>{reviewer.entregadas}</td>
                      <td className={styles.numeric}>
                        {reviewer.vencidas > 0 ? (
                          <span className={`${styles.status} ${styles.rejected}`}>
                            {reviewer.vencidas}
                          </span>
                        ) : (
                          0
                        )}
                      </td>
                      <td>
                        <div className={styles.progress}>
                          <span aria-hidden="true" className={styles.progressTrack}>
                            <span
                              className={styles.progressFill}
                              style={{ width: `${compliance}%` }}
                            />
                          </span>
                          <span className={styles.progressValue}>{compliance}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Usuarios */}
        <section aria-labelledby="users-title" className={styles.section}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Gestión</p>
              <h2 id="users-title">Listado de usuarios</h2>
            </div>
            <p className={styles.sectionDescription}>
              Filtra por rol, busca por nombre o correo y abre la ficha de
              detalle de cada usuario.
            </p>
          </div>

          <form
            className={styles.filters}
            onSubmit={(event) => event.preventDefault()}
            role="search"
          >
            <div className={styles.field}>
              <label htmlFor="user-search">Buscar</label>
              <input
                id="user-search"
                onChange={handleSearch}
                placeholder="Nombre o correo"
                type="search"
                value={search}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="user-role">Rol</label>
              <select id="user-role" onChange={handleRole} value={roleFilter}>
                <option value="">Todos los roles</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <Button onClick={clearFilters} type="button" variant="tertiary">
              Limpiar filtros
            </Button>
          </form>

          <div className={styles.usersLayout}>
            <div>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <caption className={styles.srOnly}>Listado de usuarios</caption>
                  <thead>
                    <tr>
                      <th scope="col">Usuario</th>
                      <th scope="col">Rol</th>
                      <th scope="col">Estado</th>
                      <th scope="col">
                        <span className={styles.srOnly}>Acciones</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageUsers.length === 0 && (
                      <tr>
                        <td className={styles.empty} colSpan={4}>
                          No se encontraron usuarios con esos filtros.
                        </td>
                      </tr>
                    )}
                    {pageUsers.map((user) => (
                      <tr
                        className={
                          selectedUser?.id === user.id ? styles.rowSelected : ''
                        }
                        key={user.id}
                      >
                        <th scope="row">
                          <span className={styles.userName}>{user.nombre}</span>
                          <span className={styles.userMail}>{user.correo}</span>
                        </th>
                        <td>
                          <span className={styles.roleTag}>{user.rol}</span>
                        </td>
                        <td>
                          <span
                            className={`${styles.status} ${
                              user.activo ? styles.accepted : styles.draft
                            }`}
                          >
                            {user.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className={styles.actions}>
                          <Button
                            onClick={() => setSelectedUser(user)}
                            type="button"
                            variant="secondary"
                          >
                            Ver ficha
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <nav aria-label="Paginación de usuarios" className={styles.pagination}>
                <span className={styles.paginationInfo}>
                  {filteredUsers.length} usuario(s) · Página {currentPage} de{' '}
                  {totalPages}
                </span>
                <div className={styles.paginationButtons}>
                  <Button
                    disabled={currentPage === 1}
                    onClick={() => setPage(currentPage - 1)}
                    type="button"
                    variant="secondary"
                  >
                    Anterior
                  </Button>
                  <Button
                    disabled={currentPage === totalPages}
                    onClick={() => setPage(currentPage + 1)}
                    type="button"
                    variant="secondary"
                  >
                    Siguiente
                  </Button>
                </div>
              </nav>
            </div>

            <aside
              aria-labelledby="detail-title"
              aria-live="polite"
              className={styles.detail}
            >
              <h3 id="detail-title">Ficha de detalle</h3>
              {selectedUser ? (
                <>
                  <p className={styles.detailName}>{selectedUser.nombre}</p>
                  <dl className={styles.detailList}>
                    <div>
                      <dt>Correo</dt>
                      <dd>{selectedUser.correo}</dd>
                    </div>
                    <div>
                      <dt>Rol</dt>
                      <dd>{selectedUser.rol}</dd>
                    </div>
                    <div>
                      <dt>Institución</dt>
                      <dd>{selectedUser.institucion}</dd>
                    </div>
                    <div>
                      <dt>Fecha de registro</dt>
                      <dd>{selectedUser.registro}</dd>
                    </div>
                    <div>
                      <dt>
                        {selectedUser.rol === 'Revisor'
                          ? 'Revisiones asignadas'
                          : 'Trabajos'}
                      </dt>
                      <dd>{selectedUser.trabajos}</dd>
                    </div>
                    <div>
                      <dt>Estado</dt>
                      <dd>{selectedUser.activo ? 'Activo' : 'Inactivo'}</dd>
                    </div>
                  </dl>
                  <Button
                    onClick={() => setSelectedUser(null)}
                    type="button"
                    variant="tertiary"
                  >
                    Cerrar ficha
                  </Button>
                </>
              ) : (
                <p className={styles.detailEmpty}>
                  Selecciona «Ver ficha» en un usuario para ver su información.
                </p>
              )}
            </aside>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        Congreso Académico Estudiantil · Interfaz de escritorio
      </footer>
    </div>
  )
}

export default HU7

