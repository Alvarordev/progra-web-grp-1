import styles from './SubmissionRequirements.module.css'

const requirements = [
  'Regístrese con su correo institucional para participar como autor, revisor o ambos.',
  'Seleccione el tipo de trabajo y un eje temático de la edición vigente.',
  'Prepare el título, resumen, palabras clave y un enlace al documento con acceso de lectura para el comité y los revisores.',
  'La revisión es ciega: el documento no debe contener los nombres de los autores.',
  'Declare a los coautores y a un único autor de correspondencia, responsable de recibir las notificaciones.',
  'Complete y envíe el trabajo antes del cierre de recepción. Los borradores no participan en la revisión.',
]

function SubmissionRequirements({ tipos }) {
  return (
    <section aria-labelledby="requirements-title" className={styles.section}>
      <h2 id="requirements-title">Requisitos de participación y envío</h2>
      <ul className={styles.requirements}>
        {requirements.map(requirement => (
          <li key={requirement}>{requirement}</li>
        ))}
      </ul>
      <h3>Tipos de trabajo admitidos</h3>
      <div className={styles.types}>
        {tipos.map(type => (
          <article className={styles.type} key={type.id}>
            <h4>{type.nombre}</h4>
            <p>Extensión máxima: {type.extensionMaxima}.</p>
            <p>Formato: {type.formatoEsperado}.</p>
            <p>
              {type.admiteCoautores
                ? `Admite hasta ${type.maxCoautores} coautores.`
                : 'No admite coautores.'}
            </p>
          </article>
        ))}
      </div>
      {tipos.length === 0 && <p>El comité todavía no ha habilitado tipos de trabajo.</p>}
    </section>
  )
}

export default SubmissionRequirements
