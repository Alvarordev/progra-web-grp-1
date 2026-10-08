import { useState } from 'react'
import { Link } from 'react-router'
import Button from '../../../core/ui/Button/Button.jsx'
import PublicNavigation from '../components/PublicNavigation/PublicNavigation.jsx'
import styles from './RegistrationPage.module.css'

function RegistrationPage() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <PublicNavigation>
      <main className={styles.main}>
        <section aria-labelledby="registration-title" className={styles.formCard}>
          <div>
            <h1 id="registration-title">Registro de participante</h1>
            <p className={styles.intro}>Los campos marcados con asterisco son obligatorios.</p>
            <form onSubmit={handleSubmit}>
              <div className={styles.fieldGroup}>
                <label htmlFor="names">Nombres *</label>
                <input defaultValue="Rosa María" id="names" required />
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="surnames">Apellidos *</label>
                <input defaultValue="Quispe Ttito" id="surnames" required />
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="registration-email">Correo institucional *</label>
                <input defaultValue="rosa.quispe@aloe.ulima.edu.pe" id="registration-email" required type="email" />
                <span>Se usará para todas las notificaciones.</span>
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="institution">Institución *</label>
                <select defaultValue="Universidad de Lima" id="institution" required>
                  <option>Universidad de Lima</option>
                  <option>Pontificia Universidad Católica del Perú</option>
                  <option>Universidad Nacional de Ingeniería</option>
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="registration-password">Contraseña *</label>
                <input defaultValue="Segura2026" id="registration-password" required type="password" />
                <span>Mínimo 8 caracteres, con una mayúscula y un número.</span>
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="confirm-password">Confirmar contraseña *</label>
                <input defaultValue="Segura2026" id="confirm-password" required type="password" />
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="career">Carrera *</label>
                <select defaultValue="Ingeniería de Sistemas" id="career" required>
                  <option>Ingeniería de Sistemas</option>
                  <option>Ingeniería Industrial</option>
                  <option>Administración</option>
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="student-code">Código de alumno</label>
                <input defaultValue="20211547" id="student-code" />
              </div>
              <fieldset className={styles.roleField}>
                <legend>Deseo participar como *</legend>
                <label>
                  <input defaultChecked name="role" type="radio" value="author" />
                  <span className={styles.roleCopy}><strong>Autor</strong><small>Enviaré uno o más trabajos.</small></span>
                </label>
                <label>
                  <input name="role" type="radio" value="reviewer" />
                  <span className={styles.roleCopy}><strong>Revisor</strong><small>Evaluaré trabajos asignados.</small></span>
                </label>
                <label>
                  <input name="role" type="radio" value="both" />
                  <span className={styles.roleCopy}><strong>Ambos</strong><small>Autor y revisor.</small></span>
                </label>
              </fieldset>
              <label className={styles.consent}>
                <input required type="checkbox" />
                Acepto las bases del congreso y el tratamiento de mis datos.
              </label>
              {submitted && <p className={styles.success} role="status">Revise los datos ingresados antes de crear su cuenta.</p>}
              <div className={styles.actions}>
                <Link className={styles.cancel} to="/">Cancelar</Link>
                <Button type="submit">Crear mi cuenta</Button>
              </div>
            </form>
          </div>
          <aside className={styles.notice}>
            <h2>Antes de registrarse</h2>
            <p>La recepción de trabajos cierra el 30/09/2026 a las 23:59. Después de esa fecha no será posible editar los envíos.</p>
            <p>Si participa como revisor, deberá declarar sus líneas de interés para recibir asignaciones sin conflicto.</p>
          </aside>
        </section>
      </main>
    </PublicNavigation>
  )
}

export default RegistrationPage
