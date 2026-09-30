import styles from './Header.module.css'

function Header({estado}) {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.leftSide}>
                    <div className={styles.avatar}>
                        C
                    </div>
                    <div className={styles.lefSideText}>
                        <p className={styles.title}>Congreso Académico Estudiantil</p>
                        <p className={styles.description}>Universidad de Lima - Edición 2026</p>
                    </div>
                </div>

                <div className={styles.rightSide}>
                    <p>Estado de la edición</p>
                    <div className={styles.state}>
                        <div></div>
                        <span>{estado}</span>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header