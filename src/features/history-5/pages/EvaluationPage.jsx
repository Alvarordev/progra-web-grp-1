import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import Header from '../../../core/ui/Header/Header.jsx'
import Footer from '../../../core/ui/Footer/Footer.jsx'
import ReviewerNavigation from '../../../core/ui/ReviewerNavigation/ReviewerNavigation.jsx'
import Button from '../../../core/ui/Button/Button.jsx'
import useReviewerProfile from '../../../core/utils/useReviewerProfile.js'
import { getReviewerUser } from '../../../core/utils/states/reviewerProfilesState.js'
import { criteriaRepository, reviewsRepository, sessionRepository } from '../../../core/utils/repositories.js'
import { getReviewKey } from '../../../core/utils/states/reviewsState.js'
import { initialAssignments } from '../../../core/utils/reviewerAssignments.js'
import CriteriaTable from '../components/CriteriaTable/CriteriaTable.jsx'
import EvaluationComments from '../components/EvaluationComments/EvaluationComments.jsx'
import EvaluationSidebar from '../components/EvaluationSidebar/EvaluationSidebar.jsx'
import WorkSummary from '../components/WorkSummary/WorkSummary.jsx'
import { formularioInicial, initialCriteria, readOnlyReviewExamples, valoresIniciales, works } from '../data/evaluationDemo.js'
import { calculateWeightedAverage, formatTenth, isValidScore } from '../utils/scoring.js'
import { sentNotice } from '../utils/sentDate.js'
import { validateEvaluation } from '../utils/validateEvaluation.js'
import styles from './EvaluationPage.module.css'

// la misma pantalla sirve para evaluar y para leer; el modo viene en la url.
function EvaluationScreen({ codigo }) {
  const profileState = useReviewerProfile()
  const [searchParams] = useSearchParams()
  const readOnlyMode = searchParams.get('modo') === 'lectura'
  const existingReview = readOnlyMode ? readOnlyReviewExamples[codigo] : undefined
  const bandeja = initialAssignments.find((item) => item.codigo === codigo)
  const trabajo = works[codigo] ?? { title: bandeja?.titulo, eje: bandeja?.eje, tipo: bandeja?.tipoTrabajo, resumen: '' }
  const [criteria, setCriteria] = useState(existingReview?.criteria ?? initialCriteria)
  const [recommendation, setRecommendation] = useState(existingReview?.recommendation ?? '')
  const [authorComment, setAuthorComment] = useState(existingReview?.authorComment ?? '')
  const [committeeComment, setCommitteeComment] = useState(existingReview?.committeeComment ?? '')
  const [submitted, setSubmitted] = useState(Boolean(existingReview))
  const [sinEvaluacion, setSinEvaluacion] = useState(false)
  const [sentAt, setSentAt] = useState(null)
  const [notice, setNotice] = useState('')
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [reviewerId, setReviewerId] = useState('demo-reviewer')
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let active = true
    async function loadReview() {
      try {
        const [reviews, session, configuredCriteria] = await Promise.all([
          reviewsRepository.get(), sessionRepository.get(), criteriaRepository.get(),
        ])
        if (!active) return
        const userId = session?.userId ?? 'demo-reviewer'
        const saved = reviews[getReviewKey(userId, codigo)]
        const review = saved ?? existingReview
        const done = review?.status === 'submitted'
        const deliveryDate = done ? new Date(review.updatedAt) : null
        const currentCriteria = configuredCriteria.map((item) => {
          const previous = saved?.criteria.find((criterion) => criterion.id === item.id)
          return {
            ...item,
            puntaje: previous?.puntaje ?? valoresIniciales[item.id]?.puntaje ?? '',
            comentario: previous?.comentario ?? valoresIniciales[item.id]?.comentario ?? '',
          }
        })
        setReviewerId(userId)
        setLoadError('')
        setCriteria(done ? review.criteria : currentCriteria)
        setRecommendation(review?.recommendation ?? formularioInicial.recommendation)
        setAuthorComment(review?.authorComment ?? formularioInicial.authorComment)
        setCommitteeComment(review?.committeeComment ?? '')
        setSubmitted(done)
        setSinEvaluacion(readOnlyMode && !review)
        setSentAt(deliveryDate)
        if (saved?.status === 'draft') setNotice('Borrador recuperado de este navegador.')
        else setNotice(done ? sentNotice(deliveryDate) : '')
        setErrors([])
      } catch (error) {
        if (active) setLoadError(error.message)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadReview()
    return () => { active = false }
  }, [codigo, existingReview, readOnlyMode])

  const scoredCriteria = criteria.filter((criterion) => isValidScore(criterion.puntaje))
  const average = formatTenth(calculateWeightedAverage(criteria))

  function updateCriterion(id, field, value) {
    setCriteria((current) => current.map((criterion) => (criterion.id === id ? { ...criterion, [field]: value } : criterion)))
    setErrors([])
    setNotice('')
  }

  function changeRecommendation(value) {
    setRecommendation(value)
    setErrors([])
  }

  function changeAuthorComment(value) {
    setAuthorComment(value)
    setErrors([])
  }

  async function persistReview(status) {
    if (loading || saving || submitted || loadError) return
    setSaving(true)
    try {
      const reviews = await reviewsRepository.get()
      const key = getReviewKey(reviewerId, codigo)
      if (reviews[key]?.status === 'submitted') {
        setErrors(['Esta evaluación ya fue enviada y no admite cambios. Recargue la página.'])
        return
      }
      const now = new Date()
      await reviewsRepository.save({
        ...reviews,
        [key]: { criteria, recommendation, authorComment, committeeComment, status, updatedAt: now.toISOString() },
      })
      setSubmitted(status === 'submitted')
      setSentAt(status === 'submitted' ? now : null)
      setErrors([])
      setNotice(status === 'draft' ? 'Borrador guardado en este navegador.' : sentNotice(now))
    } catch (error) {
      setErrors([error.message])
      setNotice('')
    } finally {
      setSaving(false)
    }
  }

  function sendRecommendation(event) {
    event.preventDefault()
    const validationErrors = validateEvaluation({ criteria, recommendation, authorComment })
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      setNotice('')
      return
    }
    persistReview('submitted')
  }

  return (
    <div className={styles.page}>
      <Header estado="En revisión" />
      <ReviewerNavigation rutaActiva="/bandeja-revision" usuario={getReviewerUser(profileState.profile)} />

      <main className={styles.main}>
        <div className={styles.content}>
          {loading && <p role="status">Cargando evaluación…</p>}
          {loadError && <p role="alert">{loadError}</p>}
          <nav aria-label="Ruta de navegación" className={styles.breadcrumb}>
            <Link to="/bandeja-revision">Mi bandeja</Link>
            <span aria-hidden="true">›</span>
            <span>{codigo}</span>
            <span aria-hidden="true">›</span>
            <span>Evaluación</span>
          </nav>

          {notice && <p className={submitted ? styles.successNotice : styles.draftNotice} role="status">{notice}</p>}
          {errors.length > 0 && (
            <div className={styles.errorNotice} role="alert">
              <strong>Revisa estos campos antes de enviar:</strong>
              <ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul>
            </div>
          )}

          <WorkSummary codigo={codigo} trabajo={trabajo} enviada={submitted} recomendacion={recommendation} />

          {sinEvaluacion ? (
            <p className={styles.draftNotice} role="status">
              Aún no hay una evaluación enviada para este trabajo en este navegador.
            </p>
          ) : (
            <form onSubmit={sendRecommendation}>
              <fieldset className={styles.formFields} disabled={loading || saving || Boolean(loadError)}>
                <div className={styles.evaluationLayout}>
                  <CriteriaTable
                    criterios={criteria}
                    promedio={average}
                    puntuados={scoredCriteria.length}
                    soloLectura={submitted}
                    alCambiar={updateCriterion}
                  />
                  <EvaluationSidebar
                    soloLectura={submitted}
                    recomendacion={recommendation}
                    alElegir={changeRecommendation}
                    enviadaEl={sentAt}
                    fechaLimite={trabajo.fechaLimite}
                  />
                </div>

                <EvaluationComments
                  comentarioAutor={authorComment}
                  comentarioComite={committeeComment}
                  soloLectura={submitted}
                  alCambiarAutor={changeAuthorComment}
                  alCambiarComite={setCommitteeComment}
                />

                {!submitted && (
                  <div className={styles.formFooter}>
                    <p>Puede guardar un borrador y continuar la evaluación más tarde.</p>
                    <div className={styles.formActions}>
                      <Button disabled={loading || saving || Boolean(loadError)} variant="secondary" type="button" onClick={() => persistReview('draft')}>
                        Guardar borrador
                      </Button>
                      <Button disabled={loading || Boolean(loadError)} loading={saving} variant="primary" type="submit">
                        Enviar recomendación
                      </Button>
                    </div>
                  </div>
                )}
              </fieldset>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

// la key reinicia la pantalla cuando cambia el modo.
function EvaluationPage() {
  const { codigo } = useParams()
  const [searchParams] = useSearchParams()
  return <EvaluationScreen codigo={codigo} key={`${codigo}-${searchParams.get('modo') ?? ''}`} />
}

export default EvaluationPage
