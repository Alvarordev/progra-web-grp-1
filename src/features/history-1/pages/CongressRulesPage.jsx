import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import useActiveAccount from '../../../core/utils/useActiveAccount.js'
import {
  criteriaRepository,
  editionRepository,
  editionStatusRepository,
  scheduleRepository,
  thematicAxesRepository,
  workTypesRepository,
} from '../../../core/utils/repositories.js'
import { formatScheduleDate } from '../../../core/utils/states/scheduleState.js'
import PublicNavigation from '../components/PublicNavigation/PublicNavigation.jsx'
import SubmissionRequirements from '../components/SubmissionRequirements/SubmissionRequirements.jsx'
import InfoSection from '../components/InfoSection/InfoSection.jsx'
import styles from './CongressRulesPage.module.css'

function CongressRulesPage() {
  const location = useLocation()
  const account = useActiveAccount()
  const [rules, setRules] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (rules && location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView()
    }
  }, [rules, location.hash])

  useEffect(() => {
    let active = true
    Promise.all([
      editionRepository.get(),
      editionStatusRepository.get(),
      thematicAxesRepository.get(),
      workTypesRepository.get(),
      scheduleRepository.get(),
      criteriaRepository.get(),
    ])
      .then(([edition, status, axes, types, schedule, criteria]) => {
        if (active) {
          setRules({ edition, status, axes, types, schedule, criteria })
        }
      })
      .catch(cause => {
        if (active) {
          setError(cause.message)
        }
      })
    return () => {
      active = false
    }
  }, [])

  const deadlines = rules
    ? [
        [
          'Cierre de recepción de trabajos',
          `${formatScheduleDate(rules.schedule.reception)} · ${rules.schedule.reception.slice(11)}`,
        ],
        [
          'Cierre de la etapa de revisión',
          `${formatScheduleDate(rules.schedule.review)} · ${rules.schedule.review.slice(11)}`,
        ],
        [
          'Publicación de resultados',
          `${formatScheduleDate(rules.schedule.publication)} · ${rules.schedule.publication.slice(11)}`,
        ],
      ]
    : []
  const criteriaWeight = rules?.criteria.reduce(
    (total, criterion) => total + criterion.peso,
    0
  )

  return (
    <PublicNavigation
      cargando={account.loading}
      error={account.error}
      estado={rules?.status}
      participante={account.participant}
      rutaActiva="/bases"
    >
      <main className={styles.main}>
        <header className={styles.heading}>
          <div>
            <h1>Bases del congreso</h1>
            <p>Requisitos, ejes temáticos, fechas y criterios de la edición vigente.</p>
          </div>
          <Link to="/">Volver al inicio</Link>
        </header>
        {!rules && !error && <p role="status">Cargando las bases del congreso…</p>}
        {error && (
          <p className={styles.error} role="alert">
            No se pudieron cargar las bases: {error}
          </p>
        )}
        {rules && (
          <>
            <section className={styles.edition} aria-labelledby="rules-edition-title">
              <h2 id="rules-edition-title">{rules.edition.editionName}</h2>
              <p>{rules.edition.editionDescription}</p>
              <p>
                <strong>Sede:</strong> {rules.edition.editionVenue}
              </p>
              <p>
                <strong>Estado de la edición:</strong> {rules.status}
              </p>
            </section>
            <SubmissionRequirements tipos={rules.types} />
            <section aria-labelledby="rules-axes-title" id="rules-axes">
              <h2 id="rules-axes-title">Ejes temáticos</h2>
              <div className={styles.axes}>
                {rules.axes.map(axis => (
                  <article key={axis.id}>
                    <h3>{axis.nombre}</h3>
                    <p>{axis.descripcion}</p>
                  </article>
                ))}
              </div>
              {rules.axes.length === 0 && (
                <p>El comité todavía no ha configurado ejes temáticos.</p>
              )}
            </section>
            <div className={styles.columns}>
              <InfoSection filas={deadlines} id="rules-dates" titulo="Fechas límite" />
              <div>
                <InfoSection
                  filas={rules.criteria.map(criterion => [
                    criterion.nombre,
                    `${criterion.peso} %`,
                  ])}
                  id="rules-criteria"
                  titulo="Criterios de evaluación"
                />
                {criteriaWeight !== 100 && (
                  <p className={styles.warning}>
                    Criterios en preparación: los pesos configurados suman{' '}
                    {criteriaWeight} %. El comité debe completar el 100 %.
                  </p>
                )}
              </div>
            </div>
            <section className={styles.edition} aria-labelledby="data-use-title">
              <h2 id="data-use-title">Bases y tratamiento de datos</h2>
              <p>
                Al registrarse acepta estas bases y el uso de sus datos de participación
                para gestionar su cuenta, los trabajos y las comunicaciones del congreso.
              </p>
              <p>
                Para consultas, escriba a{' '}
                <a href="mailto:congreso@ulima.edu.pe">congreso@ulima.edu.pe</a>.
              </p>
            </section>
          </>
        )}
      </main>
    </PublicNavigation>
  )
}

export default CongressRulesPage
