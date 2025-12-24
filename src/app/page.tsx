import styles from "./page.module.css";
import HerstelSection from "@/components/HerstelSection";
import MaeSection from "@/components/MaeSection";
import Modal from "@/components/Modal";
import Nav from "@/components/Nav";
import ParticleHero from "@/components/ParticleHero";

export default function Home() {
  return (
    <>
    <Nav />
    <div className={styles.hero}>

      {/* Side Labels */}
      <span className={styles.sideLabel + ' ' + styles.left}>FYSIOTHERAPIE</span>
      <span className={styles.sideLabel + ' ' + styles.right}>LEEFSTIJL</span>

      {/* Center Logo with Particle Effect */}
      <div className={styles.logoContainer}>
        <ParticleHero />
      </div>
    </div>

    <div className={styles.content}>
      <div className={styles.heroSpacer} />
      <MaeSection />
      <HerstelSection />
      <div className={styles.footerSpacer} />
    </div>

    <Modal />
    </>
  );
}
