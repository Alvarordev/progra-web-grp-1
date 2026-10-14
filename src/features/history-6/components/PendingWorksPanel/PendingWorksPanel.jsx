import { useId } from 'react'
import Button from '../../../../core/ui/Button/Button.jsx'
import styles from './PendingWorksPanel.module.css'

function PendingWorksPanel({ alAgregar, hayEspacio, trabajos }) {
  const titleId = useId()

  return (
    <section aria-labelledby={titleId} className={styles.panel}>
      <header className={styles.heading}>
        <h2 className={styles.title} id={titleId}>
          Trabajos aceptados sin sesión
        </h2>
        <span className={styles.count}>{trabajos.length} trabajos</span>
      </header>

      {trabajos.length === 0 ? (
        <p className={styles.empty}>
          No quedan trabajos aceptados sin sesión.
        </p>
      ) : (
        <ul className={styles.list}>
          {trabajos.map((trabajo) => (
            <li className={styles.item} key={trabajo.codigo}>
              <div className={styles.details}>
                <span className={styles.code}>{trabajo.codigo}</span>
                <h3 className={styles.workTitle}>{trabajo.titulo}</h3>
                <span className={styles.meta}>
                  {trabajo.eje} · {trabajo.tipoTrabajo}
                </span>
              </div>
              <Button
                aria-label={`Agregar ${trabajo.titulo} a la sesión`}
                disabled={!hayEspacio}
                onClick={() => alAgregar(trabajo)}
                size="small"
                type="button"
                variant="secondary"
              >
                Agregar →
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default PendingWorksPanel
