import InfoSection from '../components/InfoSection/InfoSection.jsx'
import HeroSection from '../components/HeroSection/HeroSection.jsx'
import PublicNavigation from '../components/PublicNavigation/PublicNavigation.jsx'
import TopicsSection from '../components/TopicsSection/TopicsSection.jsx'
import styles from './History1Page.module.css'

const deadlines = [
  ['Cierre de recepción de trabajos', '30/09/2026'],
  ['Cierre de la etapa de revisión', '20/10/2026'],
  ['Publicación de resultados', '28/10/2026'],
  ['Días del congreso', '12/11/2026 – 13/11/2026'],
]

const criteria = [
  ['Originalidad', '25 %'],
  ['Rigor metodológico', '30 %'],
  ['Claridad de la exposición', '20 %'],
  ['Relevancia y aporte', '25 %'],
]

function History1Page() {
  return (
    <PublicNavigation rutaBase="/history-1">
      <main>
        <HeroSection />
        <TopicsSection />
        <div className={styles.infoGrid}>
          <InfoSection
            className={styles.deadlines}
            id="deadlines"
            filas={deadlines}
            titulo="Fechas límite"
          />
          <InfoSection
            className={styles.criteria}
            id="criteria"
            filas={criteria}
            titulo="Criterios de evaluación"
          />
        </div>
      </main>
    </PublicNavigation>
  )
}

export default History1Page
