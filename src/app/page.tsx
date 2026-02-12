import styles from "./page.module.css";
import CTASection from "@/components/CTASection";
import FAQSection from "@/components/FAQSection";
import Hall13Section from "@/components/Hall13Section";
import HerstelSection from "@/components/HerstelSection";
import LeefstijlSection from "@/components/LeefstijlSection";
import MaeSection from "@/components/MaeSection";
import Modal from "@/components/Modal";
import ParticleHero from "@/components/ParticleHero";
import { ParticleFooter } from "@/components/ParticleHero";
import ReviewsSection from "@/components/ReviewsSection";
import ShowreelSection from "@/components/ShowreelSection";

export default function Home() {
  return (
    <>
    <div className={styles.hero}>
      <div className={styles.logoContainer}>
        <ParticleHero />
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

    <div className={styles.hero}>
      <div className={styles.logoContainer}>
        <ParticleFooter />
      </div>
    </div>

    <Modal />
    </>
  );
}
