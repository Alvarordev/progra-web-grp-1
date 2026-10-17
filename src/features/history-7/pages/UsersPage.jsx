import { useId, useMemo, useState } from 'react'
import Button from '../../../core/ui/Button/Button.jsx'
import BlockUserModal from '../components/BlockUserModal/BlockUserModal.jsx'
import BoardPageLayout from '../components/BoardPageLayout/BoardPageLayout.jsx'
import PageHeading from '../components/PageHeading/PageHeading.jsx'
import Toast from '../components/Toast/Toast.jsx'
import UserFormModal from '../components/UserFormModal/UserFormModal.jsx'
import UsersTable from '../components/UsersTable/UsersTable.jsx'
import useStoredState from '../../../core/utils/useStoredState.js'
import { usersRepository } from '../../../core/utils/repositories.js'
import { initialUsers } from '../../../core/utils/states/usersState.js'
import { roles, statusOptions } from '../data/congressData.js'
import { buildActivity, inferFeminine } from '../utils/users.js'
import styles from './UsersPage.module.css'

const PAGE_SIZE = 8

function countByRole(users, role) {
  return users.filter((user) => user.rol === role).length
}

function UsersPage() {
  const idPrefix = useId()
  const { value: users, loading, saving, error, save } =
    useStoredState(usersRepository, initialUsers)
  const busy = loading || saving
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [institutionFilter, setInstitutionFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [userToBlock, setUserToBlock] = useState(null)
  /* null = cerrado · { usuario: null } = invitar · { usuario } = editar */
  const [userForm, setUserForm] = useState(null)
  const [toast, setToast] = useState('')

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
      allLabel: 'todos',
      value: roleFilter,
      onChange: setRoleFilter,
      options: roles.map((role) => ({ value: role, label: role })),
    },
    {
      label: 'Institución',
      allLabel: 'todas',
      value: institutionFilter,
      onChange: setInstitutionFilter,
      options: institutions.map((name) => ({ value: name, label: name })),
    },
    {
      label: 'Estado',
      allLabel: 'todos',
      value: statusFilter,
      onChange: setStatusFilter,
      options: statusOptions,
    },
  ]

  function changeFilter(setValue, value) {
    setValue(value)
    setPage(1)
  }

  async function updateUser(userId, changes) {
    if (busy) return
    await save(
      users.map((user) =>
        user.id === userId ? { ...user, ...changes } : user,
      ),
    )
  }

  async function confirmBlock(user, { motivo }) {
    try {
      await updateUser(user.id, { bloqueado: true, motivoBloqueo: motivo })
      setUserToBlock(null)
    } catch {
      /* el error se muestra en el mensaje de estado */
    }
  }

  async function reactivateUser(user) {
    try {
      await updateUser(user.id, { bloqueado: false })
    } catch {
      /* el error se muestra en el mensaje de estado */
    }
  }

  async function saveUser(data) {
    if (busy) return
    const editing = userForm.usuario

    try {
      if (editing) {
        await updateUser(editing.id, {
          nombre: data.nombre,
          correo: data.correo,
          rol: data.rol,
          institucion: data.institucion,
          femenino: inferFeminine(data.nombre) || editing.femenino,
          actividad: buildActivity(
            data.rol,
            data.cantidad,
            editing.rol === data.rol ? editing.actividad : '',
          ),
        })
        setToast('Cambios guardados')
      } else {
        await save([
          {
            id: Math.max(0, ...users.map((user) => user.id)) + 1,
            nombre: data.nombre,
            correo: data.correo,
            rol: data.rol,
            femenino: inferFeminine(data.nombre),
            institucion: data.institucion,
            actividad: buildActivity(data.rol, data.cantidad),
            bloqueado: false,
          },
          ...users,
        ])
        /* El nuevo usuario aparece primero: se limpian filtros y se vuelve a la página 1. */
        setSearch('')
        setRoleFilter('')
        setInstitutionFilter('')
        setStatusFilter('')
        setPage(1)
        setToast('Invitación enviada')
      }

      setUserForm(null)
    } catch {
      /* el modal sigue abierto y el error se muestra en el mensaje de estado */
    }
  }

  return (
    <BoardPageLayout rutaActiva="/usuarios">
      <PageHeading
        acciones={
          <Button
            disabled={busy}
            onClick={() => setUserForm({ usuario: null })}
            type="button"
          >
            Invitar usuario
          </Button>
        }
        descripcion={`${users.length} usuarios · ${countByRole(users, 'Autor')} autores · ${countByRole(users, 'Revisor')} revisores · ${countByRole(users, 'Comité')} del comité`}
        titulo="Usuarios"
      />

      <p role="status">{loading ? 'Cargando usuarios…' : error}</p>

      <form
        className={styles.filters}
        onSubmit={(event) => event.preventDefault()}
        role="search"
      >
        {selectFilters.map((filter) => (
          <select
            aria-label={filter.label}
            className={styles.select}
            id={`${idPrefix}-${filter.label}`}
            key={filter.label}
            onChange={(event) =>
              changeFilter(filter.onChange, event.target.value)
            }
            value={filter.value}
          >
            <option value="">{`${filter.label}: ${filter.allLabel}`}</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {`${filter.label}: ${option.label}`}
              </option>
            ))}
          </select>
        ))}
        <input
          aria-label="Buscar usuario por nombre o correo"
          className={styles.search}
          id={`${idPrefix}-search`}
          onChange={(event) => changeFilter(setSearch, event.target.value)}
          placeholder="Buscar por nombre o correo…"
          type="search"
          value={search}
        />
      </form>

      <UsersTable
        deshabilitado={busy}
        alBloquear={setUserToBlock}
        alEditar={(usuario) => setUserForm({ usuario })}
        alReactivar={reactivateUser}
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

      {userForm && (
        <UserFormModal
          alCerrar={() => { if (!busy) setUserForm(null) }}
          guardando={saving}
          errorGuardado={error}
          alGuardar={saveUser}
          instituciones={institutions}
          usuario={userForm.usuario}
          usuarios={users}
        />
      )}

      {toast && <Toast alCerrar={() => setToast('')} mensaje={toast} />}

      {userToBlock && (
        <BlockUserModal
          alCerrar={() => { if (!busy) setUserToBlock(null) }}
          guardando={saving}
          errorGuardado={error}
          alConfirmar={confirmBlock}
          usuario={userToBlock}
        />
      )}
    </BoardPageLayout>
  )
}

export default UsersPage