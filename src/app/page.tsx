import styles from "./page.module.css";
import CTASection from "@/components/CTASection";
import FAQSection from "@/components/FAQSection";
import Hall13Section from "@/components/Hall13Section";
import HerstelSection from "@/components/HerstelSection";
import LeefstijlSection from "@/components/LeefstijlSection";
import MaeSection from "@/components/MaeSection";
import ReviewsSection from "@/components/ReviewsSection";
import ShowreelSection from "@/components/ShowreelSection";
import LazyParticleHero from "@/components/ParticleHero/LazyParticleHero";
import LazyParticleFooter from "@/components/ParticleHero/LazyParticleFooter";

export default function Home() {
  return (
    <>
    <div className={styles.hero}>
      <div className={styles.logoContainer}>
        <LazyParticleHero />
      </div>
    </div>

    <MaeSection />
    <HerstelSection />
    <ReviewsSection type="fysio" />
    <ShowreelSection />
    <LeefstijlSection />
    <ReviewsSection type="leefstijl" />
    <FAQSection />
    <Hall13Section />
    <CTASection />

    <div id="footer-section" className={styles.hero}>
      <div className={styles.logoContainer}>
        <LazyParticleFooter />
      </div>
    </div>

</>
  );
}
