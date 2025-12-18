import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.hero}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <a href="#" className={styles.navLink}>HOME</a>
        <a href="#" className={styles.navLink}>TRAJECTEN</a>
        <a href="#" className={styles.navLink}>OVER</a>
        <a href="#" className={styles.navLink}>CONTACT</a>
      </nav>

      {/* Side Labels */}
      <span className={styles.sideLabel + ' ' + styles.left}>FYSIOTHERAPIE</span>
      <span className={styles.sideLabel + ' ' + styles.right}>LEEFSTIJL</span>

      {/* Center Logo with Image Mask */}
      <div className={styles.logoContainer}>
        <div className={styles.logoMask}>
          <img src="/img/run.png" alt="Background" className={styles.logoImage} />
        </div>
      </div>

      {/* Modal Popup */}
      <div className={styles.modal}>
        <button className={styles.modalClose} aria-label="Sluiten">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className={styles.modalLogos}>
          <img src="/icons/mae.svg" alt="MAE" className={styles.modalLogo} />
          <span className={styles.modalDivider}>|</span>
          <img src="/icons/hal13.svg" alt="HAL XIII" className={styles.modalLogoHal} />
        </div>
        <p className={styles.modalText}>
          Voor een complete benadering van gezondheid en fitness combineren wij fysiotherapeutische zorg met professionele coaching en trainingsmogelijkheden.
        </p>
        <div className={styles.modalLinks}>
          <a href="#" className="btn-bar">Blijf hier voor fysiotherapie</a>
          <a href="#" className="btn-bar">Bekijk het volledige aanbod bij HAL XIII</a>
        </div>
      </div>
    </div>
  );
}
