import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import Button from '../../../core/ui/Button/Button.jsx'
import AuthorPageLayout from '../components/AuthorPageLayout/AuthorPageLayout.jsx'
import DeadlineNotice from '../components/DeadlineNotice/DeadlineNotice.jsx'
import FormField from '../components/FormField/FormField.jsx'
import { hasWorkWithTitle, sampleWork, sendWork } from '../data/works.js'
import styles from './CoauthorsPage.module.css'

const MAX_COAUTHORS = 4

const initialAuthors = [
  {
    nombre: 'Rosa María Quispe Ttito',
    correo: 'rosa.quispe@aloe.ulima.edu.pe',
    institucion: 'Universidad de Lima',
    esPrincipal: true,
  },
  {
    nombre: 'Diego Alonso Chávez Manrique',
    correo: 'diego.chavez@aloe.ulima.edu.pe',
    institucion: 'Universidad de Lima',
  },
  {
    nombre: 'Milagros Yupanqui Ríos',
    correo: 'milagros.yupanqui@aloe.ulima.edu.pe',
    institucion: 'Universidad de Lima',
  },
]

const emptyCoauthor = { nombre: '', correo: '', institucion: 'Universidad de Lima' }

function CoauthorsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const trabajo = location.state?.trabajo ?? sampleWork
  const [autores, setAutores] = useState(initialAuthors)
  const [correspondencia, setCorrespondencia] = useState(initialAuthors[0].correo)
  const [nuevoCoautor, setNuevoCoautor] = useState(emptyCoauthor)
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState('')
  const [errorEnvio, setErrorEnvio] = useState('')

  const cantidadCoautores = autores.length - 1
  const limiteAlcanzado = cantidadCoautores >= MAX_COAUTHORS

  function handleChange(event) {
    const { name, value } = event.target
    setNuevoCoautor((coautorActual) => ({ ...coautorActual, [name]: value }))
    setErrores({})
  }

  function handleAdd(event) {
    event.preventDefault()
    const correo = nuevoCoautor.correo.trim().toLowerCase()
    const nuevosErrores = {}

    if (!nuevoCoautor.nombre.trim()) nuevosErrores.nombre = 'Ingrese el nombre completo.'
    if (!nuevoCoautor.institucion.trim()) nuevosErrores.institucion = 'Ingrese la institución.'
    if (!/^\S+@\S+\.\S+$/.test(correo)) {
      nuevosErrores.correo = 'Ingrese un correo válido.'
    } else if (autores.some((autor) => autor.correo === correo)) {
      nuevosErrores.correo = 'Este correo ya figura entre los coautores del trabajo.'
    }

    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return

    setAutores((autoresActuales) => [
      ...autoresActuales,
      { ...nuevoCoautor, correo, nombre: nuevoCoautor.nombre.trim() },
    ])
    setNuevoCoautor(emptyCoauthor)
    setMensaje(`✓ Se agregó a ${nuevoCoautor.nombre.trim()} como coautor.`)
  }

  function handleSend() {
    if (hasWorkWithTitle(trabajo.titulo)) {
      setMensaje('')
      setErrorEnvio('Ya envió un trabajo con este título. Cambie el título en los datos generales para continuar.')
      return
    }

    const codigo = sendWork(trabajo, autores, correspondencia)
    navigate('/autor/trabajos', { state: { enviado: codigo } })
  }

  function handleRemove(correo) {
    setAutores((autoresActuales) => autoresActuales.filter((autor) => autor.correo !== correo))
    if (correspondencia === correo) setCorrespondencia(initialAuthors[0].correo)
    setMensaje('')
  }

  return (
    <AuthorPageLayout rutaActiva="/autor/nuevo-trabajo">
      <DeadlineNotice restante="Faltan 12 días · 04:11 h" titulo="Recepción abierta.">
        Cierra el 30/09/2026 a las 23:59.
      </DeadlineNotice>

      <div className={styles.pageHeading}>
        <div>
          <h1>Coautores</h1>
          <p>Paso 2 de 3 · TRB-2026-058 · {trabajo.tipo} (hasta {MAX_COAUTHORS} coautores)</p>
        </div>
        <div className={styles.actions}>
          <Button onClick={() => navigate('/autor/nuevo-trabajo', { state: { trabajo } })} variant="secondary">
            Volver a datos generales
          </Button>
          <Button onClick={handleSend} variant="primary">
            Continuar
          </Button>
        </div>
      </div>

      <p aria-live="polite" className={errorEnvio ? styles.sendError : styles.feedback}>
        {errorEnvio || mensaje}
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
                {autores.map((autor) => {
                  const esCorrespondencia = autor.correo === correspondencia

                  return (
                    <tr key={autor.correo}>
                      <td>{autor.nombre}</td>
                      <td className={styles.email}>{autor.correo}</td>
                      <td>{autor.institucion}</td>
                      <td>
                        {esCorrespondencia ? (
                          <span className={styles.correspondence}>Autor de correspondencia</span>
                        ) : (
                          <Button onClick={() => setCorrespondencia(autor.correo)} size="small" variant="tertiary">
                            Marcar
                          </Button>
                        )}
                      </td>
                      <td>
                        {autor.esPrincipal ? (
                          <span className={styles.helperText}>Usted</span>
                        ) : (
                          <Button onClick={() => handleRemove(autor.correo)} size="small" variant="tertiary">
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
              {autores.length} de {MAX_COAUTHORS + 1} autores declarados (autor principal + {MAX_COAUTHORS} coautores
              como máximo). El orden de la lista es el orden de firma.
            </p>
          </section>

          <form className={`${styles.panel} ${styles.form}`} noValidate onSubmit={handleAdd}>
            <h2 className={styles.label}>Agregar coautor</h2>
            <FormField error={errores.nombre} etiqueta="Nombre completo" htmlFor="coauthor-name">
              <input id="coauthor-name" name="nombre" onChange={handleChange} value={nuevoCoautor.nombre} />
            </FormField>
            <FormField error={errores.correo} etiqueta="Correo" htmlFor="coauthor-email">
              <input id="coauthor-email" name="correo" onChange={handleChange} type="email" value={nuevoCoautor.correo} />
            </FormField>
            <FormField error={errores.institucion} etiqueta="Institución" htmlFor="coauthor-institution">
              <input id="coauthor-institution" name="institucion" onChange={handleChange} value={nuevoCoautor.institucion} />
            </FormField>
            <div className={styles.formAction}>
              <Button disabled={limiteAlcanzado} type="submit" variant="secondary">
                Agregar
              </Button>
            </div>
          </form>
        </div>

        <aside className={styles.sideColumn}>
          <section className={styles.panel}>
            <h2 className={styles.label}>Autor de correspondencia</h2>
            <p>
              Recibe las notificaciones del comité y es responsable de la comunicación oficial. Debe haber
              exactamente uno.
            </p>
          </section>
          <section className={styles.panel}>
            <h2 className={styles.label}>Conflicto de revisión</h2>
            <p>Los coautores declarados no podrán ser asignados como revisores de este trabajo.</p>
          </section>
        </aside>
      </div>
    </AuthorPageLayout>
  )
}

export default CoauthorsPage
