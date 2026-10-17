import { useEffect, useMemo, useState } from 'react'
import { criteriaRepository, reviewsRepository, sessionRepository } from '../../../core/utils/repositories.js'
import { getReviewKey } from '../../../core/utils/states/reviewsState.js'
import { Link, useParams, useSearchParams } from 'react-router'
import Header from '../../../core/ui/Header/Header.jsx'
import Footer from '../../../core/ui/Footer/Footer.jsx'
import ReviewerNavigation from '../../../core/ui/ReviewerNavigation/ReviewerNavigation.jsx'
import Button from '../../../core/ui/Button/Button.jsx'
import { calculateWeightedAverage, formatTenth, isValidScore } from '../utils/scoring.js'
import { getRecommendationLabel, recommendationOptions } from '../utils/recommendations.js'
import styles from './EvaluationPage.module.css'
import useReviewerProfile from '../../../core/utils/useReviewerProfile.js'
import { getReviewerUser } from '../../../core/utils/states/reviewerProfilesState.js'

const works = {
  'TRB-2026-042': {
    title: 'Predicción de deserción universitaria mediante aprendizaje supervisado',
    eje: 'Inteligencia artificial y datos',
    tipo: 'Artículo completo',
    fechaLimite: '15/10/2026',
    resumen:
      'Se evalúan tres modelos supervisados para anticipar el abandono de estudios en una universidad privada de Lima, usando registros de cinco cohortes.',
  },
  'TRB-2026-053': {
    title: 'Bienestar emocional y rendimiento académico en primeros ciclos',
    eje: 'Salud y sociedad',
    tipo: 'Póster',
    fechaLimite: '09/10/2026',
    resumen:
      'Estudio sobre la relación entre bienestar emocional, adaptación universitaria y rendimiento académico en estudiantes de primeros ciclos.',
  },
  'TRB-2026-031': {
    title: 'Refactorización guiada por métricas de deuda técnica',
    eje: 'Ingeniería de software',
    tipo: 'Artículo completo',
    fechaLimite: '18/10/2026',
    resumen:
      'La propuesta adapta métricas de deuda técnica al contexto universitario y evalúa su uso en proyectos de software.',
  },
}

const initialCriteria = [
  {
    id: 'originalidad',
    nombre: 'Originalidad',
    peso: 25,
    puntaje: '17',
    comentario: 'Aporte claro frente a trabajos previos del área.',
  },
  {
    id: 'rigor',
    nombre: 'Rigor metodológico',
    peso: 30,
    puntaje: '15',
    comentario: 'Falta validación cruzada y control del desbalance de clases.',
  },
  {
    id: 'claridad',
    nombre: 'Claridad de la exposición',
    peso: 20,
    puntaje: '18',
    comentario: 'Redacción ordenada; mejorar la leyenda de la figura 3.',
  },
  {
    id: 'relevancia',
    nombre: 'Relevancia y aporte',
    peso: 25,
    puntaje: '',
    comentario: '',
  },
]

const readOnlyReviewExamples = {
  'TRB-2026-031': {
    enviadaEl: '2026-10-06T11:05:00',
    criterios: [
      { id: 'originalidad', nombre: 'Originalidad', peso: 25, puntaje: '16', comentario: 'La propuesta adapta métricas conocidas a un contexto universitario.' },
      { id: 'rigor', nombre: 'Rigor metodológico', peso: 30, puntaje: '15', comentario: 'El tamaño de la muestra de repositorios debería justificarse.' },
      { id: 'claridad', nombre: 'Claridad de la exposición', peso: 20, puntaje: '18', comentario: 'Buena estructura y tablas legibles.' },
      { id: 'relevancia', nombre: 'Relevancia y aporte', peso: 25, puntaje: '17', comentario: 'Aplicable a los cursos de proyectos de la carrera.' },
    ],
    recomendacion: 'observaciones',
    comentarioAutor:
      'El trabajo es sólido en su exposición. Recomiendo justificar la selección de repositorios y añadir una comparación con una línea base sin refactorización.',
    comentarioComite:
      'Puede aceptarse si los autores atienden la observación metodológica antes de la versión final.',
  },
}

// Puntajes y comentarios de la maqueta. Aparecen al abrir la evaluación por primera vez;
// el revisor puede cambiarlos.
const valoresIniciales = {
  originality: { puntaje: '17', comentario: 'Aporte claro frente a trabajos previos del área.' },
  rigor: { puntaje: '15', comentario: 'Falta validación cruzada y control del desbalance de clases.' },
  clarity: { puntaje: '18', comentario: 'Redacción ordenada; mejorar la leyenda de la figura 3.' },
  relevance: { puntaje: '17', comentario: '' },
}

// Recomendación y comentario al autor de la maqueta, precargados como los puntajes.
const formularioInicial = {
  recomendacion: 'observaciones',
  comentarioAutor: 'Reforzar la validación del modelo y detallar el tratamiento de datos faltantes.',
}

function formatSentAt(sentAt) {
  return {
    fecha: sentAt.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    hora: sentAt.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false }),
  }
}

function buildSentNotice(sentAt) {
  if (!sentAt) return 'Evaluación enviada. Ya no admite cambios; si necesita corregirla, solicite al comité.'
  const { fecha, hora } = formatSentAt(sentAt)
  return `Evaluación enviada el ${fecha} a las ${hora}. Ya no admite cambios; si necesita corregirla, solicite al comité.`
}

function EvaluationScreen({ codigo }) {
  const profileState = useReviewerProfile()
  const [searchParams] = useSearchParams()
  const readOnlyMode = searchParams.get('modo') === 'lectura'
  const existingReview = useMemo(() => (readOnlyMode
    ? readOnlyReviewExamples[codigo] ?? {
        criterios: initialCriteria.map((criterion) => ({
          ...criterion,
          puntaje: criterion.puntaje || '17',
          comentario: criterion.comentario || 'Evaluación registrada para este criterio.',
        })),
        recomendacion: 'aceptar',
        comentarioAutor: 'Evaluación enviada y disponible en modo de lectura.',
        comentarioComite: '',
      }
    : undefined), [readOnlyMode, codigo])
  const trabajo = works[codigo] ?? {
    title: 'Trabajo académico asignado',
    eje: 'Eje temático',
    tipo: 'Tipo de trabajo',
    resumen: 'No hay un resumen de demostración para este trabajo.',
  }
  const [criteria, setCriteria] = useState(() => existingReview?.criteria ?? existingReview?.criterios ?? initialCriteria)
  const [recommendation, setRecommendation] = useState(() => existingReview?.recommendation ?? existingReview?.recomendacion ?? '')
  const [authorComment, setAuthorComment] = useState(() => existingReview?.authorComment ?? existingReview?.comentarioAutor ?? '')
  const [committeeComment, setCommitteeComment] = useState(() => existingReview?.committeeComment ?? existingReview?.comentarioComite ?? '')
  const [submitted, setSubmitted] = useState(Boolean(existingReview))
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
        setCriteria(saved?.status === 'draft' ? currentCriteria : review?.criteria ?? review?.criterios ?? currentCriteria)
        setRecommendation(review?.recommendation ?? review?.recomendacion ?? formularioInicial.recomendacion)
        setAuthorComment(review?.authorComment ?? review?.comentarioAutor ?? formularioInicial.comentarioAutor)
        setCommitteeComment(review?.committeeComment ?? review?.comentarioComite ?? '')
        setSubmitted(saved ? saved.status === 'submitted' : Boolean(existingReview))
        const deliveryDate = saved?.status === 'submitted' ? new Date(saved.updatedAt) : review?.enviadaEl ? new Date(review.enviadaEl) : null
        setSentAt(deliveryDate)
        setNotice(saved?.status === 'draft' ? 'Borrador recuperado de este navegador.' : review && saved?.status !== 'draft' ? buildSentNotice(deliveryDate) : '')
        setErrors([])
      } catch (error) {
        if (active) setLoadError(error.message)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadReview()
    return () => { active = false }
  }, [codigo, existingReview])

  const scoredCriteria = criteria.filter((criterion) => isValidScore(criterion.puntaje))
  const average = formatTenth(calculateWeightedAverage(criteria))
  const recommendationLabel = getRecommendationLabel(recommendation)

  function updateCriterion(id, field, value) {
    setCriteria((currentCriteria) =>
      currentCriteria.map((criterion) =>
        criterion.id === id ? { ...criterion, [field]: value } : criterion,
      ),
    )
    setErrors([])
    setNotice('')
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
      setNotice(status === 'draft' ? 'Borrador guardado en este navegador.' : buildSentNotice(now))
    } catch (error) {
      setErrors([error.message])
      setNotice('')
    } finally {
      setSaving(false)
    }
  }

  function saveDraft() {
    persistReview('draft')
  }

  function sendRecommendation(event) {
    event.preventDefault()

    const missingCriteria = criteria
      .filter((criterion) => criterion.puntaje === '' || !criterion.comentario.trim())
      .map((criterion) => criterion.nombre)
    const validationErrors = []
    if (criteria.some((item) => item.puntaje !== '' && !isValidScore(item.puntaje))) {
      validationErrors.push('Los puntajes deben ser enteros entre 0 y 20.')
    }
    if (criteria.reduce((sum, item) => sum + item.peso, 0) !== 100) {
      validationErrors.push('El comité debe configurar criterios cuyos pesos sumen 100 antes de enviar la evaluación.')
    }
    if (missingCriteria.length > 0) {
      validationErrors.push(`Completa el puntaje y comentario de: ${missingCriteria.join(', ')}.`)
    }
    if (!recommendation) {
      validationErrors.push('Selecciona una recomendación.')
    }
    if (!authorComment.trim()) {
      validationErrors.push('Escribe los comentarios dirigidos al autor.')
    }

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
      <ReviewerNavigation
        rutaActiva="/bandeja-revision"
        usuario={getReviewerUser(profileState.profile)}
      />

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

          {notice && (
            <p
              className={submitted ? styles.successNotice : styles.draftNotice}
              role="status"
            >
              {notice}
            </p>
          )}

          {errors.length > 0 && (
            <div className={styles.errorNotice} role="alert">
              <strong>Revisa estos campos antes de enviar:</strong>
              <ul>
                {errors.map((error) => <li key={error}>{error}</li>)}
              </ul>
            </div>
          )}

          <section className={styles.workPanel} aria-labelledby="work-title">
            <div className={styles.workDetails}>
              <div className={styles.workTags}>
                <span>{codigo}</span>
                <span>{trabajo.eje}</span>
                <span>{trabajo.tipo}</span>
                {submitted && <span className={styles.readOnlyTag}>Solo lectura</span>}
                {submitted && recommendationLabel && (
                  <span className={styles.recommendationTag}>
                    Recomendación: {recommendationLabel.toLowerCase()}
                  </span>
                )}
              </div>
              <h1 id="work-title">{trabajo.title}</h1>
              <p>{trabajo.resumen}</p>
              <small>Revisión ciega: no verá los nombres de los autores.</small>
            </div>
            <div className={styles.workActions}>
              <Button
                variant="secondary"
                type="button"
                onClick={() => setNotice('El enlace al documento se agregará cuando se conecten los datos del trabajo.')}
              >
                Abrir documento
              </Button>
              <p>Vence el {trabajo.fechaLimite ?? '—'}</p>
            </div>
          </section>

          <form className={submitted ? styles.readOnlyForm : undefined} onSubmit={sendRecommendation}>
            <fieldset className={styles.formFields} disabled={loading || saving || Boolean(loadError)}>
            <div className={styles.evaluationLayout}>
              <section className={styles.criteriaPanel} aria-labelledby="criteria-title">
                <h2 id="criteria-title" className={styles.visuallyHidden}>
                  Evaluación por criterios
                </h2>
                <div className={styles.tableHeader}>
                  <span>Criterio</span>
                  <span>Peso</span>
                  <span>Puntaje (0–20)</span>
                  <span>Comentario del criterio</span>
                </div>

                {criteria.map((criterion) => {
                  const scoreInvalid = criterion.puntaje !== '' && !isValidScore(criterion.puntaje)

                  return (
                    <div className={styles.criterionRow} key={criterion.id}>
                      <strong>{criterion.nombre}</strong>
                      <span className={styles.weight}>{criterion.peso} %</span>
                      <label className={styles.visuallyHidden} htmlFor={`score-${criterion.id}`}>
                        Puntaje para {criterion.nombre}, de 0 a 20
                      </label>
                      <div className={styles.scoreField}>
                        <input
                          id={`score-${criterion.id}`}
                          className={styles.scoreInput}
                          type="number"
                          min="0"
                          max="20"
                          step="1"
                          value={criterion.puntaje}
                          disabled={submitted}
                          aria-invalid={scoreInvalid}
                          aria-describedby={`score-error-${criterion.id}`}
                          onChange={(event) => updateCriterion(criterion.id, 'puntaje', event.target.value)}
                          aria-label={`Puntaje para ${criterion.nombre}`}
                        />
                        {scoreInvalid && (
                          <small className={styles.fieldError} id={`score-error-${criterion.id}`}>
                            Ingrese un puntaje entre 0 y 20.
                          </small>
                        )}
                      </div>
                      <label className={styles.visuallyHidden} htmlFor={`comment-${criterion.id}`}>
                        Comentario para {criterion.nombre}
                      </label>
                      <textarea
                        id={`comment-${criterion.id}`}
                        className={styles.criterionComment}
                        rows="2"
                        placeholder="Escriba su comentario..."
                        value={criterion.comentario}
                        disabled={submitted}
                        onChange={(event) => updateCriterion(criterion.id, 'comentario', event.target.value)}
                      />
                    </div>
                  )
                })}

                <div className={styles.averageRow}>
                  <span>{submitted ? 'Promedio ponderado' : `Promedio ponderado provisional (${scoredCriteria.length} de ${criteria.length} criterios)`}</span>
                  <strong>{average}</strong>
                </div>
              </section>

              <aside className={styles.sidePanel}>
                <fieldset className={styles.recommendationPanel} disabled={submitted}>
                  <legend>Recomendación *</legend>
                  {recommendationOptions.map((option) => (
                    <label
                      className={`${styles.recommendationOption} ${recommendation === option.value ? styles.selectedRecommendation : ''}`}
                      key={option.value}
                    >
                      <input
                        type="radio"
                        name="recommendation"
                        value={option.value}
                        checked={recommendation === option.value}
                        onChange={(event) => {
                          setRecommendation(event.target.value)
                          setErrors([])
                        }}
                      />
                      {option.label}
                    </label>
                  ))}
                </fieldset>
                {submitted && (
                  <dl className={styles.deliveryPanel} aria-label="Datos de la entrega">
                    <div>
                      <dt>Enviada</dt>
                      <dd>{sentAt ? `${formatSentAt(sentAt).fecha} · ${formatSentAt(sentAt).hora}` : '—'}</dd>
                    </div>
                    <div>
                      <dt>Fecha límite</dt>
                      <dd>{trabajo.fechaLimite ?? '—'}</dd>
                    </div>
                  </dl>
                )}
                <p className={styles.confidentialNote}>
                  {submitted
                    ? 'Los campos se muestran como texto: en modo lectura no hay controles de edición ni botón de envío.'
                    : 'Los comentarios al autor se publican con el dictamen. Las observaciones al comité son confidenciales.'}
                </p>
              </aside>
            </div>

            <div className={styles.commentsLayout}>
              <label className={styles.field}>
                <span>Comentarios al autor *</span>
                <textarea
                  rows="4"
                  value={authorComment}
                  disabled={submitted}
                  onChange={(event) => {
                    setAuthorComment(event.target.value)
                    setErrors([])
                  }}
                  placeholder="Escriba la retroalimentación que podrá consultar el autor..."
                />
              </label>
              <label className={styles.field}>
                <span>Observaciones al comité (confidencial)</span>
                <textarea
                  rows="4"
                  value={committeeComment}
                  disabled={submitted}
                  onChange={(event) => setCommitteeComment(event.target.value)}
                  placeholder="Estas observaciones solo las verá el comité..."
                />
              </label>
            </div>

            {!submitted && (
              <div className={styles.formFooter}>
                <p>Puede guardar un borrador y continuar la evaluación más tarde.</p>
                <div className={styles.formActions}>
                  <Button disabled={loading || saving || Boolean(loadError)} variant="secondary" type="button" onClick={saveDraft}>
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
        </div>
      </main>

      <Footer />
    </div>
  )
}

function EvaluationPage() {
  const { codigo } = useParams()
  const [searchParams] = useSearchParams()
  return <EvaluationScreen codigo={codigo} key={`${codigo}-${searchParams.get('modo') ?? ''}`} />
}

export default EvaluationPage
