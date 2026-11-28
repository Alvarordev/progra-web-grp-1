import { useEffect, useId, useMemo, useState } from 'react'
import Button from '../../../core/ui/Button/Button.jsx'
import BlockUserModal from '../components/BlockUserModal/BlockUserModal.jsx'
import BoardPageLayout from '../components/BoardPageLayout/BoardPageLayout.jsx'
import PageHeading from '../components/PageHeading/PageHeading.jsx'
import Toast from '../components/Toast/Toast.jsx'
import UserFormModal from '../components/UserFormModal/UserFormModal.jsx'
import UsersTable from '../components/UsersTable/UsersTable.jsx'
import {
  actualizarUsuario,
  bloquearUsuario,
  invitarUsuario,
  listarUsuarios,
  reactivarUsuario,
} from '../../../core/utils/gestionUsuariosApi.js'
import { roles, statusOptions } from '../data/congressData.js'
import { toUser, toUserBody } from '../utils/users.js'
import styles from './UsersPage.module.css'

const PAGE_SIZE = 8

/* Quien tiene el rol «Ambos» cuenta como autor y como revisor. */
function countByRole(users, role) {
  return users.filter(
    user => user.rol === role || (user.rol === 'Ambos' && role !== 'Comité')
  ).length
}

function UsersPage() {
  const idPrefix = useId()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
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

  useEffect(() => {
    let active = true

    listarUsuarios()
      .then(rows => {
        if (active) {
          setUsers(rows.map(toUser))
        }
      })
      .catch(cause => {
        if (active) {
          setError(cause.message)
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const institutions = useMemo(
    () => [...new Set(users.map(user => user.institucion))],
    [users]
  )

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase()

    return users.filter(user => {
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
      options: roles.map(role => ({ value: role, label: role })),
    },
    {
      label: 'Institución',
      allLabel: 'todas',
      value: institutionFilter,
      onChange: setInstitutionFilter,
      options: institutions.map(name => ({ value: name, label: name })),
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

  function clearErrors() {
    setError('')
    setFieldErrors({})
  }

  /* Ejecuta una operación contra la API y controla el estado de guardado y de error. */
  async function runSave(operation) {
    setSaving(true)
    clearErrors()
    try {
      return await operation()
    } catch (cause) {
      setError(cause.message)
      setFieldErrors(cause.errores ?? {})
      throw cause
    } finally {
      setSaving(false)
    }
  }

  function replaceUser(row) {
    const updated = toUser(row)
    setUsers(current => current.map(user => (user.id === updated.id ? updated : user)))
  }

  async function confirmBlock(user, { motivo, notificar }) {
    if (busy) {
      return
    }
    try {
      const row = await runSave(() => bloquearUsuario(user.id, motivo, notificar))
      replaceUser(row)
      setUserToBlock(null)
      setToast(
        row.revisionesPausadas
          ? `Usuario bloqueado · ${row.revisionesPausadas} ${row.revisionesPausadas === 1 ? 'revisión queda' : 'revisiones quedan'} en pausa hasta reactivarlo`
          : 'Usuario bloqueado'
      )
    } catch {
      /* el error se muestra en el mensaje de estado */
    }
  }

  async function reactivateUser(user) {
    if (busy) {
      return
    }
    try {
      replaceUser(await runSave(() => reactivarUsuario(user.id)))
      setToast('Usuario reactivado')
    } catch {
      /* el error se muestra en el mensaje de estado */
    }
  }

  async function saveUser(data) {
    if (busy) {
      return
    }
    const editing = userForm.usuario

    try {
      if (editing) {
        replaceUser(await runSave(() => actualizarUsuario(editing.id, toUserBody(data))))
        setToast('Cambios guardados')
      } else {
        const row = await runSave(() => invitarUsuario(toUserBody(data)))
        /* El nuevo usuario aparece primero: se limpian filtros y se vuelve a la página 1. */
        setUsers(current => [toUser(row), ...current])
        setSearch('')
        setRoleFilter('')
        setInstitutionFilter('')
        setStatusFilter('')
        setPage(1)
        setToast(
          row.correoEnviado
            ? `Invitación enviada a ${row.correo}`
            : 'Usuario creado, pero no se pudo enviar el correo de invitación'
        )
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

      <p className={styles.status} role="status">
        {loading ? 'Cargando usuarios…' : error}
      </p>

      <form
        className={styles.filters}
        onSubmit={event => event.preventDefault()}
        role="search"
      >
        {selectFilters.map(filter => (
          <select
            aria-label={filter.label}
            className={styles.select}
            id={`${idPrefix}-${filter.label}`}
            key={filter.label}
            onChange={event => changeFilter(filter.onChange, event.target.value)}
            value={filter.value}
          >
            <option value="">{`${filter.label}: ${filter.allLabel}`}</option>
            {filter.options.map(option => (
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
          onChange={event => changeFilter(setSearch, event.target.value)}
          placeholder="Buscar por nombre o correo…"
          type="search"
          value={search}
        />
      </form>

      <UsersTable
        deshabilitado={busy}
        alBloquear={setUserToBlock}
        alEditar={usuario => setUserForm({ usuario })}
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
          {pageNumbers.map(number => (
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
          alCerrar={() => {
            if (!busy) {
              setUserForm(null)
              clearErrors()
            }
          }}
          guardando={saving}
          errorGuardado={error}
          erroresServidor={fieldErrors}
          alGuardar={saveUser}
          instituciones={institutions}
          usuario={userForm.usuario}
          usuarios={users}
        />
      )}

      {toast && <Toast alCerrar={() => setToast('')} mensaje={toast} />}

      {userToBlock && (
        <BlockUserModal
          alCerrar={() => {
            if (!busy) {
              setUserToBlock(null)
              clearErrors()
            }
          }}
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
