import styles from '../../pages/RegistrationPage.module.css'

const degrees = [
  'Ingeniería de Sistemas', 'Ingeniería Industrial', 'Ingeniería Civil',
  'Administración', 'Economía', 'Contabilidad', 'Comunicación', 'Derecho',
  'Psicología', 'Arquitectura', 'Otra carrera',
]

function AcademicFields({ campos, errores, conErrores, bloqueado, alCambiar, alSalir }) {
  return (
    <>
      <div className={styles.fieldGroup}>
        <label htmlFor="registration-degree">Carrera *</label>
        <select
          aria-describedby={conErrores('degree') ? 'degree-error' : undefined}
          aria-invalid={conErrores('degree') || undefined}
          className={conErrores('degree') ? styles.invalid : undefined}
          disabled={bloqueado}
          id="registration-degree"
          name="degree"
          onBlur={alSalir}
          onChange={alCambiar}
          required
          value={campos.degree}
        >
          <option value="">Seleccione su carrera</option>
          {degrees.map(degree => <option key={degree}>{degree}</option>)}
        </select>
        {conErrores('degree') && <span className={styles.fieldError} id="degree-error">{errores.degree}</span>}
      </div>
      <div className={styles.fieldGroup}>
        <label htmlFor="registration-student-code">Código de alumno *</label>
        <input
          aria-describedby={conErrores('studentCode') ? 'student-code-error' : undefined}
          aria-invalid={conErrores('studentCode') || undefined}
          className={conErrores('studentCode') ? styles.invalid : undefined}
          disabled={bloqueado}
          id="registration-student-code"
          inputMode="numeric"
          name="studentCode"
          onBlur={alSalir}
          onChange={alCambiar}
          required
          value={campos.studentCode}
        />
        {conErrores('studentCode') && <span className={styles.fieldError} id="student-code-error">{errores.studentCode}</span>}
      </div>
    </>
  )
}

export default AcademicFields
