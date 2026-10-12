import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import Header from '../../../core/ui/Header/Header.jsx'
import Footer from '../../../core/ui/Footer/Footer.jsx'
import ReviewerNavigation from '../../../core/ui/ReviewerNavigation/ReviewerNavigation.jsx'
import Button from '../../../core/ui/Button/Button.jsx'
import styles from './EvaluationPage.module.css'

const works = {
  'TRB-2026-042': {
    title: 'Predicción de deserción universitaria mediante aprendizaje supervisado',
    eje: 'Inteligencia artificial y datos',
    tipo: 'Artículo completo',
    resumen:
      'Se evalúan tres modelos supervisados para anticipar el abandono de estudios en una universidad privada de Lima, usando registros de cinco cohortes.',
  },
  'TRB-2026-053': {
    title: 'Bienestar emocional y rendimiento académico en primeros ciclos',
    eje: 'Salud y sociedad',
    tipo: 'Póster',
    resumen:
      'Estudio sobre la relación entre bienestar emocional, adaptación universitaria y rendimiento académico en estudiantes de primeros ciclos.',
  },
  'TRB-2026-031': {
    title: 'Refactorización guiada por métricas de deuda técnica',
    eje: 'Ingeniería de software',
    tipo: 'Artículo completo',
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

const recommendations = [
  { value: 'aceptar', label: 'Aceptar' },
  { value: 'observaciones', label: 'Aceptar con observaciones' },
  { value: 'rechazar', label: 'Rechazar' },
]

const readOnlyReviewExamples = {
  'TRB-2026-031': {
    criterios: initialCriteria.map((criterion) => ({
      ...criterion,
      puntaje: criterion.id === 'relevancia' ? '17' : criterion.puntaje,
      comentario:
        criterion.id === 'relevancia'
          ? 'Aplicable a los cursos de proyectos de la carrera.'
          : criterion.comentario,
    })),
    recomendacion: 'observaciones',
    comentarioAutor:
      'El trabajo es sólido en su exposición. Recomiendo justificar la selección de repositorios y añadir una comparación con una línea base sin refactorización.',
    comentarioComite:
      'Puede aceptarse si los autores atienden la observación metodológica antes de la versión final.',
  },
}

function EvaluationPage() {
  const { codigo } = useParams()
  const [searchParams] = useSearchParams()
  const readOnlyMode = searchParams.get('modo') === 'lectura'
  const existingReview = (readOnlyMode
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
    : undefined)
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
  const [notice, setNotice] = useState('')
  const [errors, setErrors] = useState([])

  const scoredCriteria = criteria.filter((criterion) => criterion.puntaje !== '')
  const scoredWeight = scoredCriteria.reduce(
    (total, criterion) => total + criterion.peso,
    0,
  )
  const weightedTotal = scoredCriteria.reduce(
    (total, criterion) => total + Number(criterion.puntaje) * criterion.peso,
    0,
  )
  const average = scoredWeight ? (weightedTotal / scoredWeight).toFixed(1) : '—'

  function updateCriterion(id, field, value) {
    setCriteria((currentCriteria) =>
      currentCriteria.map((criterion) =>
        criterion.id === id ? { ...criterion, [field]: value } : criterion,
      ),
    )
    setErrors([])
    setNotice('')
  }

  function saveDraft() {
    setNotice('Borrador guardado en esta sesión.')
    setErrors([])
  }

  function sendRecommendation(event) {
    event.preventDefault()

    const missingCriteria = criteria
      .filter((criterion) => criterion.puntaje === '' || !criterion.comentario.trim())
      .map((criterion) => criterion.nombre)
    const validationErrors = []

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

    setSubmitted(true)
    setErrors([])
    setNotice('Evaluación enviada. Ya no admite cambios; si necesita corregirla, solicite al comité.')
  }

  return (
    <div className={styles.page}>
      <Header estado="En revisión" />
      <ReviewerNavigation
        rutaActiva="/bandeja-revision"
        usuario={{
          iniciales: 'LR',
          nombre: 'Mg. Luis Ramírez Cárdenas',
          rol: 'Rol: Revisor',
        }}
      />

      <main className={styles.main}>
        <div className={styles.content}>
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
              <p>Vence el 15/10/2026 · faltan 3 días</p>
            </div>
          </section>

          <form onSubmit={sendRecommendation}>
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

                {criteria.map((criterion) => (
                  <div className={styles.criterionRow} key={criterion.id}>
                    <strong>{criterion.nombre}</strong>
                    <span className={styles.weight}>{criterion.peso} %</span>
                    <label className={styles.visuallyHidden} htmlFor={`score-${criterion.id}`}>
                      Puntaje para {criterion.nombre}, de 0 a 20
                    </label>
                    <input
                      id={`score-${criterion.id}`}
                      className={styles.scoreInput}
                      type="number"
                      min="0"
                      max="20"
                      step="1"
                      value={criterion.puntaje}
                      disabled={submitted}
                      onChange={(event) => updateCriterion(criterion.id, 'puntaje', event.target.value)}
                      aria-label={`Puntaje para ${criterion.nombre}`}
                    />
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
                ))}

                <div className={styles.averageRow}>
                  <span>Promedio ponderado provisional ({scoredCriteria.length} de {criteria.length} criterios)</span>
                  <strong>{average}</strong>
                </div>
              </section>

              <aside className={styles.sidePanel}>
                <fieldset className={styles.recommendationPanel} disabled={submitted}>
                  <legend>Recomendación *</legend>
                  {recommendations.map((option) => (
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
                <p className={styles.confidentialNote}>
                  Los comentarios al autor se publican con el dictamen. Las observaciones al comité son confidenciales.
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
                  <Button variant="secondary" type="button" onClick={saveDraft}>
                    Guardar borrador
                  </Button>
                  <Button variant="primary" type="submit">
                    Enviar recomendación
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default EvaluationPage
