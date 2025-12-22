import styles from "./page.module.css";
import ScalingSection from "@/components/ScalingSection";
import DienstenSection from "@/components/DienstenSection";
import Modal from "@/components/Modal";
import Nav from "@/components/Nav";

export default function Home() {
  return (
    <>
    <Nav />
    <div className={styles.hero}>

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

    <div className={styles.content}>
      <div className={styles.heroSpacer} />
      <ScalingSection />
      <DienstenSection />
      <div className={styles.footerSpacer} />
    </div>

    <Modal />
    </>
  );
}
