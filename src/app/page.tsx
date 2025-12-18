import styles from "./page.module.css";
import ScalingSection from "@/components/ScalingSection";
import DienstenSection from "@/components/DienstenSection";
import Modal from "@/components/Modal";

export default function Home() {
  return (
    <>
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
    </div>
    <ScalingSection />
    <DienstenSection />
    <Modal />
    </>
  );
}
