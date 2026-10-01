import React from 'react';
import styles from './ReviewerInbox.module.css'; 

export default function ReviewerInbox() {
  return (
    <div className={styles.page}>
      <main className={styles.content}>
        <h2>Mi bandeja de revisión</h2>
        <p>6 trabajos asignados · la etapa de revisión cierra el 20/10/2026 a las 18:00</p>
        
        {/* Tarjeta del trabajo */}
        <div className={styles.workCard}>
           <h3>Predicción de deserción universitaria mediante aprendizaje supervisado</h3>
           <p>Vence el 15/10/2026 - faltan 3 días</p>
           <button>Evaluar</button>
        </div>
      </main>
    </div>
  );
}