import styles from "./page.module.css";
import CTASection from "@/components/CTASection";
import Hall13Section from "@/components/Hall13Section";
import HerstelSection from "@/components/HerstelSection";
import LeefstijlSection from "@/components/LeefstijlSection";
import MaeSection from "@/components/MaeSection";
import Modal from "@/components/Modal";
import ParticleHero from "@/components/ParticleHero";
import ReviewsSection from "@/components/ReviewsSection";
import ScrambleText from "@/components/ScrambleText";
import ShowreelSection from "@/components/ShowreelSection";

export default function Home() {
  return (
    <>
    <div className={styles.hero}>
      {/* Side Labels */}
      <div className={styles.sideLabels}>
        <span className={styles.sideLabel + ' ' + styles.left}>
          [<ScrambleText trigger="load" retriggerAtEnd retriggerAtStart>FYSIOTHERAPIE</ScrambleText>]
        </span>
        <span className={styles.sideLabel + ' ' + styles.right}>
          [<ScrambleText trigger="load" retriggerAtEnd retriggerAtStart>LEEFSTIJL</ScrambleText>]
        </span>
      </div>

      {/* Center Logo with Particle Effect */}
      <div className={styles.logoContainer}>
        <ParticleHero />
      </div>

    </div>

    <div className={styles.content}>
      <div className={styles.heroSpacer} />
      <MaeSection />
      <HerstelSection />
      <ReviewsSection type="fysio" />
      <ShowreelSection />
      <LeefstijlSection />
      <ReviewsSection type="leefstijl" />
      <Hall13Section />
      <CTASection />
      <div className={styles.footerSpacer} />
    </div>

    <Modal />
    </>
  );
}
