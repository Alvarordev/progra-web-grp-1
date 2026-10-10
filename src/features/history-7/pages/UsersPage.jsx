import { useId, useMemo, useState } from 'react'
import Button from '../../../core/ui/Button/Button.jsx'
import BlockUserModal from '../components/BlockUserModal/BlockUserModal.jsx'
import BoardPageLayout from '../components/BoardPageLayout/BoardPageLayout.jsx'
import PageHeading from '../components/PageHeading/PageHeading.jsx'
import UsersTable from '../components/UsersTable/UsersTable.jsx'
import { initialUsers, roles, statusOptions } from '../data/congressData.js'
import styles from './UsersPage.module.css'

const PAGE_SIZE = 8

function countByRole(users, role) {
  return users.filter((user) => user.rol === role).length
}

function UsersPage() {
  const idPrefix = useId()
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [institutionFilter, setInstitutionFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [userToBlock, setUserToBlock] = useState(null)

  const institutions = useMemo(
    () => [...new Set(users.map((user) => user.institucion))],
    [users],
  )

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase()

    return users.filter((user) => {
      const matchesSearch =
        !term ||
        user.nombre.toLowerCase().includes(term) ||
        user.correo.toLowerCase().includes(term)
      const matchesRole = !roleFilter || user.rol === roleFilter
      const matchesInstitution =
        !institutionFilter || user.institucion === institutionFilter
      const matchesStatus =
        !statusFilter ||
        (statusFilter === 'bloqueados' ? user.bloqueado : !user.bloqueado)

      return matchesSearch && matchesRole && matchesInstitution && matchesStatus
    })
  }, [users, search, roleFilter, institutionFilter, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const firstIndex = (currentPage - 1) * PAGE_SIZE
  const pageUsers = filteredUsers.slice(firstIndex, firstIndex + PAGE_SIZE)
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)

  const selectFilters = [
    {
      label: 'Rol',
      allLabel: 'Todos',
      value: roleFilter,
      onChange: setRoleFilter,
      options: roles.map((role) => ({ value: role, label: role })),
    },
    {
      label: 'Institución',
      allLabel: 'Todas',
      value: institutionFilter,
      onChange: setInstitutionFilter,
      options: institutions.map((name) => ({ value: name, label: name })),
    },
    {
      label: 'Estado',
      allLabel: 'Todos',
      value: statusFilter,
      onChange: setStatusFilter,
      options: statusOptions,
    },
  ]

  function changeFilter(setValue, value) {
    setValue(value)
    setPage(1)
  }

  function updateUser(userId, changes) {
    setUsers((current) =>
      current.map((user) =>
        user.id === userId ? { ...user, ...changes } : user,
      ),
    )
  }

  function confirmBlock(user, { motivo }) {
    updateUser(user.id, { bloqueado: true, motivoBloqueo: motivo })
    setUserToBlock(null)
  }

  return (
    <BoardPageLayout rutaActiva="/usuarios">
      <PageHeading
        acciones={<Button type="button">Invitar usuario</Button>}
        descripcion={`${users.length} usuarios · ${countByRole(users, 'Autor')} autores · ${countByRole(users, 'Revisor')} revisores · ${countByRole(users, 'Comité')} del comité`}
        titulo="Usuarios"
      />

      <form
        className={styles.filters}
        onSubmit={(event) => event.preventDefault()}
        role="search"
      >
        {selectFilters.map((filter) => (
          <div className={styles.field} key={filter.label}>
            <label htmlFor={`${idPrefix}-${filter.label}`}>{filter.label}</label>
            <select
              id={`${idPrefix}-${filter.label}`}
              onChange={(event) =>
                changeFilter(filter.onChange, event.target.value)
              }
              value={filter.value}
            >
              <option value="">{filter.allLabel}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
        <div className={`${styles.field} ${styles.search}`}>
          <label htmlFor={`${idPrefix}-search`}>Buscar</label>
          <input
            id={`${idPrefix}-search`}
            onChange={(event) => changeFilter(setSearch, event.target.value)}
            placeholder="Nombre o correo…"
            type="search"
            value={search}
          />
        </div>
      </form>

      <UsersTable
        alBloquear={setUserToBlock}
        alReactivar={(user) => updateUser(user.id, { bloqueado: false })}
        usuarios={pageUsers}
      />

      <nav aria-label="Paginación de usuarios" className={styles.pagination}>
        <span className={styles.paginationInfo}>
          Mostrando{' '}
          {filteredUsers.length === 0
            ? 0
            : `${firstIndex + 1}–${firstIndex + pageUsers.length}`}{' '}
          de {filteredUsers.length} usuarios
        </span>
        <div className={styles.paginationButtons}>
          <Button
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
            size="small"
            type="button"
            variant="secondary"
          >
            Anterior
          </Button>
          {pageNumbers.map((number) => (
            <Button
              aria-current={number === currentPage ? 'page' : undefined}
              key={number}
              onClick={() => setPage(number)}
              size="small"
              type="button"
              variant={number === currentPage ? 'primary' : 'secondary'}
            >
              {number}
            </Button>
          ))}
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setPage(currentPage + 1)}
            size="small"
            type="button"
            variant="secondary"
          >
            Siguiente
          </Button>
        </div>
      </nav>

      {userToBlock && (
        <BlockUserModal
          alCerrar={() => setUserToBlock(null)}
          alConfirmar={confirmBlock}
          usuario={userToBlock}
        />
      )}
    </BoardPageLayout>
  )
}

export default UsersPage
