import { Link } from 'react-router'
import PublicNavigation from '../components/PublicNavigation/PublicNavigation.jsx'
import styles from './CongressRulesPage.module.css'

const sections = {
  'guia-autores': {
    title: 'Guía para autores',
    text: 'Inicie sesión con rol autor, registre los datos del trabajo, agregue a sus coautores y confirme el envío. Consulte el estado y el dictamen desde Mis trabajos. Los borradores no participan de la revisión.',
    to: '/autor/trabajos',
    action: 'Ir a mis trabajos',
  },
  'guia-revisores': {
    title: 'Guía para revisores',
    text: 'Declare sus líneas de interés en Mi cuenta. El comité asigna trabajos sin conflicto de coautoría. Desde Mi bandeja puede guardar una evaluación como borrador y enviar su recomendación. Una evaluación enviada queda en modo lectura.',
    to: '/bandeja-revision',
    action: 'Ir a mi bandeja',
  },
  'preguntas-frecuentes': {
    title: 'Preguntas frecuentes',
    text: 'Las fechas, tipos de trabajo, ejes y criterios vigentes se consultan en las bases. Si no puede acceder a una pantalla, revise el rol de su cuenta. Para consultas del congreso, escriba a congreso@ulima.edu.pe.',
    to: '/bases',
    action: 'Consultar las bases',
  },
  terminos: {
    title: 'Términos de uso',
    text: 'Esta aplicación gestiona el proceso académico del congreso: registro de cuentas, envío de trabajos, revisión, dictamen y programa. Los datos se guardan en el servidor del congreso y los avisos, como la recuperación de contraseña, se envían por correo.',
    to: '/bases',
    action: 'Ver bases del congreso',
  },
  privacidad: {
    title: 'Política de privacidad',
    text: 'Los datos de cuentas, trabajos y evaluaciones se guardan en el servidor del congreso y solo se usan para el proceso académico. Las contraseñas se almacenan cifradas y la sesión se mantiene con una cookie segura que no es accesible desde el navegador. No ingrese datos personales sensibles.',
    to: '/',
    action: 'Volver al inicio',
  },
}

export default function InformationPage({ seccion }) {
  const section = sections[seccion]
  return (
    <PublicNavigation rutaActiva="">
      <main className={styles.main}>
        <header>
          <h1>{section.title}</h1>
        </header>
        <section className={styles.panel}>
          <p>{section.text}</p>
          <Link to={section.to}>{section.action}</Link>
        </section>
      </main>
    </PublicNavigation>
  )
}
