import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import Button from '../../../core/ui/Button/Button.jsx'
import AuthorPageLayout from '../components/AuthorPageLayout/AuthorPageLayout.jsx'
import DeadlineNotice from '../components/DeadlineNotice/DeadlineNotice.jsx'
import FormField from '../components/FormField/FormField.jsx'
import useConference from '../../../core/utils/useConference.js'
import {
  receptionIsOpen,
  saveSubmission,
  toSubmission,
} from '../../../core/utils/submissions.js'
import styles from './CoauthorsPage.module.css'

const emptyCoauthor = { nombre: '', correo: '', institucion: 'Universidad de Lima' }

function CoauthorsPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const code = params.get('borrador')
  const conference = useConference()
  const raw = conference.works.find(
    work =>
      work.codigo === code &&
      (work.ownerId === conference.account?.userId ||
        work.ownerEmail === conference.account?.email)
  )
  const trabajo = raw ? toSubmission(raw) : null
  const [authorsDraft, setAutores] = useState(null)
  const autores = authorsDraft ?? trabajo?.autores ?? []
  const [selectedCorrespondence, setCorrespondencia] = useState(null)
  const correspondencia =
    selectedCorrespondence ??
    autores.find(author => author.correspondencia)?.correo ??
    autores[0]?.correo
  const [nuevoCoautor, setNuevoCoautor] = useState(emptyCoauthor)
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState('')
  const [errorEnvio, setErrorEnvio] = useState('')
  const [saving, setSaving] = useState(false)
  const open = receptionIsOpen(conference.status, conference.schedule)
  const busy = conference.busy || saving || !open
  const type = conference.types.find(item => item.nombre === trabajo?.tipo)
  const MAX_COAUTHORS = type?.admiteCoautores ? type.maxCoautores : 0
  const limiteAlcanzado = autores.length - 1 >= MAX_COAUTHORS

  function handleChange(event) {
    setNuevoCoautor(current => ({ ...current, [event.target.name]: event.target.value }))
    setErrores({})
  }

  async function persist(authors, correspondence, send = false) {
    if (busy || !trabajo) {
      return false
    }
    setSaving(true)
    setErrorEnvio('')
    try {
      await saveSubmission({
        account: conference.account,
        submission: {
          ...trabajo,
          autores: authors.map(author => ({
            ...author,
            correspondencia: author.correo === correspondence,
            rol:
              author.correo === correspondence ? 'Autor de correspondencia' : 'Coautor',
          })),
        },
        code,
        send,
        status: conference.status,
        schedule: conference.schedule,
      })
      await conference.refresh()
      return true
    } catch (cause) {
      setErrorEnvio(cause.message)
      return false
    } finally {
      setSaving(false)
    }
  }

  async function handleAdd(event) {
    event.preventDefault()
    if (busy || limiteAlcanzado) {
      return
    }
    const correo = nuevoCoautor.correo.trim().toLowerCase()
    const errors = {}
    if (!nuevoCoautor.nombre.trim()) {
      errors.nombre = 'Ingrese el nombre completo.'
    }
    if (!/^\S+@\S+\.\S+$/.test(correo)) {
      errors.correo = 'Ingrese un correo válido.'
    } else if (autores.some(author => author.correo?.toLowerCase() === correo)) {
      errors.correo = 'Este correo ya figura entre los coautores del trabajo.'
    }
    if (!nuevoCoautor.institucion.trim()) {
      errors.institucion = 'Ingrese la institución.'
    }
    setErrores(errors)
    if (Object.keys(errors).length) {
      return
    }
    const next = [
      ...autores,
      { ...nuevoCoautor, correo, nombre: nuevoCoautor.nombre.trim() },
    ]
    if (await persist(next, correspondencia)) {
      setAutores(next)
      setNuevoCoautor(emptyCoauthor)
      setMensaje('Coautor guardado.')
    }
  }

  async function handleSend() {
    if (!autores.some(author => author.correo === correspondencia)) {
      setErrorEnvio('Seleccione exactamente un autor de correspondencia.')
      return
    }
    if (await persist(autores, correspondencia, true)) {
      navigate('/autor/trabajos', { state: { enviado: code } })
    }
  }

  async function handleRemove(correo) {
    const next = autores.filter(author => author.correo !== correo)
    const selected = correspondencia === correo ? next[0]?.correo : correspondencia
    if (await persist(next, selected)) {
      setAutores(next)
      setCorrespondencia(selected)
    }
  }

  if (conference.loading) {
    return (
      <AuthorPageLayout>
        <p role="status">Cargando coautores…</p>
      </AuthorPageLayout>
    )
  }
  if (!trabajo) {
    return (
      <AuthorPageLayout>
        <h1>Coautores</h1>
        <p>Guarde primero los datos generales del trabajo.</p>
        <Button type="button" onClick={() => navigate('/autor/nuevo-trabajo')}>
          Ir a datos generales
        </Button>
      </AuthorPageLayout>
    )
  }

  return (
    <AuthorPageLayout rutaActiva="/autor/nuevo-trabajo">
      <DeadlineNotice titulo={open ? 'Recepción abierta.' : 'Recepción cerrada.'}>
        Consulte las fechas vigentes en las bases del congreso.
      </DeadlineNotice>

      <div className={styles.pageHeading}>
        <div>
          <h1>Coautores</h1>
          <p>
            Paso 3 de 3 · {code} · {trabajo.tipo} (hasta {MAX_COAUTHORS} coautores)
          </p>
        </div>
        <div className={styles.actions}>
          <Button
            onClick={() => navigate(`/autor/nuevo-trabajo?borrador=${code}`)}
            variant="secondary"
          >
            Volver a datos generales
          </Button>
          <Button disabled={busy} onClick={handleSend} variant="primary">
            Continuar
          </Button>
        </div>
      </div>

      <p aria-live="polite" className={errorEnvio ? styles.sendError : styles.feedback}>
        {conference.error || errorEnvio || mensaje}
      </p>

      <div className={styles.layout}>
        <div className={styles.sideColumn}>
          <section aria-label="Autores declarados" className={styles.tablePanel}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Nombre completo</th>
                  <th scope="col">Correo</th>
                  <th scope="col">Institución</th>
                  <th scope="col">Correspondencia</th>
                  <th scope="col">
                    <span className={styles.visuallyHidden}>Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {autores.map(autor => {
                  const esCorrespondencia = autor.correo === correspondencia

                  return (
                    <tr key={autor.correo}>
                      <td>{autor.nombre}</td>
                      <td className={styles.email}>{autor.correo}</td>
                      <td>{autor.institucion}</td>
                      <td>
                        {esCorrespondencia ? (
                          <span className={styles.correspondence}>
                            Autor de correspondencia
                          </span>
                        ) : (
                          <Button
                            disabled={busy}
                            onClick={async () => {
                              if (await persist(autores, autor.correo)) {
                                setCorrespondencia(autor.correo)
                              }
                            }}
                            size="small"
                            variant="tertiary"
                          >
                            Marcar
                          </Button>
                        )}
                      </td>
                      <td>
                        {autor.correo === conference.account?.email ? (
                          <span className={styles.helperText}>Usted</span>
                        ) : (
                          <Button
                            disabled={busy}
                            onClick={() => handleRemove(autor.correo)}
                            size="small"
                            variant="tertiary"
                          >
                            Quitar
                          </Button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <p className={styles.tableFooter}>
              {autores.length} de {MAX_COAUTHORS + 1} autores declarados (autor principal
              + {MAX_COAUTHORS} coautores como máximo). El orden de la lista es el orden
              de firma.
            </p>
          </section>

          <form
            className={`${styles.panel} ${styles.form}`}
            noValidate
            onSubmit={handleAdd}
          >
            <h2 className={styles.label}>Agregar coautor</h2>
            <FormField
              error={errores.nombre}
              etiqueta="Nombre completo"
              htmlFor="coauthor-name"
            >
              <input
                id="coauthor-name"
                name="nombre"
                onChange={handleChange}
                value={nuevoCoautor.nombre}
              />
            </FormField>
            <FormField error={errores.correo} etiqueta="Correo" htmlFor="coauthor-email">
              <input
                id="coauthor-email"
                name="correo"
                onChange={handleChange}
                type="email"
                value={nuevoCoautor.correo}
              />
            </FormField>
            <FormField
              error={errores.institucion}
              etiqueta="Institución"
              htmlFor="coauthor-institution"
            >
              <input
                id="coauthor-institution"
                name="institucion"
                onChange={handleChange}
                value={nuevoCoautor.institucion}
              />
            </FormField>
            <div className={styles.formAction}>
              <Button
                disabled={busy || limiteAlcanzado}
                type="submit"
                variant="secondary"
              >
                Agregar
              </Button>
            </div>
          </form>
        </div>

        <aside className={styles.sideColumn}>
          <section className={styles.panel}>
            <h2 className={styles.label}>Autor de correspondencia</h2>
            <p>
              Recibe las notificaciones del comité y es responsable de la comunicación
              oficial. Debe haber exactamente uno.
            </p>
          </section>
          <section className={styles.panel}>
            <h2 className={styles.label}>Conflicto de revisión</h2>
            <p>
              Los coautores declarados no podrán ser asignados como revisores de este
              trabajo.
            </p>
          </section>
        </aside>
      </div>
    </AuthorPageLayout>
  )
}

export default CoauthorsPage
