import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import AuthorNavigation from '../../../core/ui/AuthorNavigation/AuthorNavigation.jsx'
import Footer from '../../../core/ui/Footer/Footer.jsx'
import Header from '../../../core/ui/Header/Header.jsx'
import {
  sessionRepository,
} from '../../../core/utils/repositories.js'
import { getParticipantAccounts } from '../../../core/utils/accounts.js'
import useConference from '../../../core/utils/useConference.js'
import { getReceptionNotice, receptionIsOpen } from '../../../core/utils/reception.js'
import RegistrationNotice from '../components/RegistrationNotice/RegistrationNotice.jsx'
import styles from './AuthorHomePage.module.css'

const steps = [
  {
    title: '1. Datos del trabajo',
    description: 'Título, tipo, eje temático, resumen y palabras clave.',
  },
  {
    title: '2. Coautores',
    description: 'Declare a sus coautores y al autor de correspondencia.',
  },
  {
    title: '3. Envío',
    description: 'Adjunte el enlace al documento y envíe antes del cierre.',
  },
]

function getRoleCopy(role) {
  if (role === 'reviewer') return { label: 'Revisor', title: 'revisor' }
  if (role === 'both') return { label: 'Autor y revisor', title: 'autor y revisor' }
  return { label: 'Autor', title: 'autor' }
}

function getInitials(participant) {
  return `${participant.names.trim()[0]}${participant.surnames.trim()[0]}`.toUpperCase()
}

function AuthorHomePage() {
  const navigate = useNavigate()
  const conference = useConference()
  const receptionOpen = receptionIsOpen(conference.status, conference.schedule)
  const [participant, setParticipant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadParticipant() {
      try {
        const [session, accounts] = await Promise.all([
          sessionRepository.get(),
          getParticipantAccounts(),
        ])

        if (!active) return

        const storedParticipant = accounts.find(account => account.userId === session?.userId)
        if (!session || !storedParticipant) {
          navigate('/iniciar-sesion', { replace: true })
          return
        }

        if (storedParticipant.role === 'reviewer') {
          navigate('/mi-cuenta', { replace: true })
          return
        }

        setParticipant(storedParticipant)
      } catch (cause) {
        if (active) setError(cause.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadParticipant()
    return () => {
      active = false
    }
  }, [navigate])

  if (loading || conference.loading) {
    return (
      <div className={styles.page}>
        <Header estado="Recepción abierta" />
        <main className={styles.statusMain}>
          <p>Cargando su cuenta…</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || conference.error) {
    return (
      <div className={styles.page}>
        <Header estado="Recepción abierta" />
        <main className={styles.statusMain}>
          <p role="alert">No se pudo cargar su cuenta: {error || conference.error}</p>
        </main>
        <Footer />
      </div>
    )
  }

  const roleCopy = getRoleCopy(participant.role)
  const usuario = {
    iniciales: getInitials(participant),
    nombre: participant.name,
    rol: `Rol: ${roleCopy.label}`,
  }

  return (
    <div className={styles.page}>
      <Header estado="Recepción abierta" />
      <AuthorNavigation rutaActiva="/autor" usuario={usuario} />
      <main className={styles.main}>
        <div className={styles.content}>
          <RegistrationNotice />

          <section aria-labelledby="welcome-title" className={styles.welcome}>
            <p className={styles.eyebrow}>BIENVENIDA</p>
            <h1 id="welcome-title">
              {participant.name}, su cuenta de {roleCopy.title} está activa
            </h1>
            <p>
              {receptionOpen ? 'Ya puede registrar sus trabajos.' : 'La recepción está cerrada.'}{' '}
              {getReceptionNotice(conference.status, conference.schedule)}
            </p>
            <div className={styles.actions}>
              {participant.role === 'both' && <Link className={styles.secondaryAction} to="/mi-cuenta">Ir a mi cuenta de revisor</Link>}
              <Link className={styles.primaryAction} to={receptionOpen ? '/autor/nuevo-trabajo' : '/autor/trabajos'}>
                {receptionOpen ? 'Registrar mi primer trabajo' : 'Consultar mis trabajos'}
              </Link>
              <Link className={styles.secondaryAction} to="/autor/cuenta">
                Completar mi perfil
              </Link>
            </div>
          </section>

          <section aria-label="Pasos para enviar un trabajo" className={styles.stepGrid}>
            {steps.map((step) => (
              <article className={styles.stepCard} key={step.title}>
                <h2>{step.title}</h2>
                <p>{step.description}</p>
              </article>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default AuthorHomePage
