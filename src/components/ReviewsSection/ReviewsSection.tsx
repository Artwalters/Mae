'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ReviewsSection.module.css';

gsap.registerPlugin(ScrollTrigger);

interface ReviewsSectionProps {
  type: 'fysio' | 'leefstijl';
}

// Fysiotherapie reviews (by Maarten)
const fysioReviews = [
  {
    text: 'Door de fysiotherapie van MAE heb ik weer normaal leren squatten zonder dat ik pijn heb aan mijn benen en rug.',
    author: 'Rayan Vierblessingen',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'
  },
  {
    text: 'Na mijn knieblessure dacht ik dat hardlopen er niet meer in zat. Maarten heeft me stap voor stap weer opgebouwd.',
    author: 'Sophie van den Berg',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face'
  },
  {
    text: 'Eindelijk iemand die naar mijn lichaam luistert en niet alleen naar de klachten. Topbehandeling!',
    author: 'Thomas de Vries',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face'
  },
  {
    text: 'Mijn schouderpijn is volledig verdwenen na de behandelingen. Kan MAE aan iedereen aanraden.',
    author: 'Lisa Jansen',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face'
  },
  {
    text: 'Als atleet is het belangrijk om snel te herstellen. Maarten begrijpt dat als geen ander.',
    author: 'Kevin Bakker',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'
  },
  {
    text: 'Na jaren rugklachten eindelijk de juiste aanpak gevonden. Dankjewel MAE!',
    author: 'Emma Smit',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face'
  }
];

// Leefstijl reviews (by Merel)
const leefstijlReviews = [
  {
    text: 'Merel heeft me geholpen om een gezonde balans te vinden tussen werk en beweging. Ik voel me fitter dan ooit!',
    author: 'Mark Peters',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face'
  },
  {
    text: 'Door het leefstijlprogramma ben ik 10 kilo afgevallen en heb ik veel meer energie.',
    author: 'Anna de Boer',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face'
  },
  {
    text: 'Geen dieet maar een echte lifestyle verandering. Merel denkt met je mee en motiveert enorm.',
    author: 'Daan Visser',
    image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop&crop=face'
  },
  {
    text: 'Eindelijk een aanpak die werkt voor mijn drukke leven. Praktische tips die ik kan volhouden.',
    author: 'Julia Mulder',
    image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&h=200&fit=crop&crop=face'
  },
  {
    text: 'Mijn slaap is verbeterd, mijn stress verminderd. Het leefstijltraject heeft me zoveel gebracht.',
    author: 'Niels van Dijk',
    image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=200&h=200&fit=crop&crop=face'
  },
  {
    text: 'Super persoonlijke begeleiding van Merel. Ze staat altijd voor je klaar met advies.',
    author: 'Sara Hendriks',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face'
  }
];

interface ReviewCardProps {
  text: string;
  author: string;
  image: string;
}

function ReviewCard({ text, author, image }: ReviewCardProps) {
  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewImage}>
        <img src={image} alt={author} />
      </div>
      <p className={styles.reviewText}>{text}</p>
      <p className={styles.reviewAuthor}>{author}</p>
    </div>
  );
}

interface MarqueeRowProps {
  reviews: typeof fysioReviews;
  direction: 'left' | 'right';
  speed?: number;
  scrollSpeed?: number;
}

function MarqueeRow({ reviews, direction, speed = 25, scrollSpeed = 10 }: MarqueeRowProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const collectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    const marqueeScroll = scrollRef.current;
    const marqueeContent = collectionRef.current;

    if (!marquee || !marqueeScroll || !marqueeContent) return;

    const marqueeDirectionAttr = direction === 'right' ? 1 : -1;
    const speedMultiplier = window.innerWidth < 479 ? 0.25 : window.innerWidth < 991 ? 0.5 : 1;
    const marqueeSpeed = speed * (marqueeContent.offsetWidth / window.innerWidth) * speedMultiplier;

    // Set scroll container styles
    marqueeScroll.style.marginLeft = `${scrollSpeed * -1}%`;
    marqueeScroll.style.width = `${(scrollSpeed * 2) + 100}%`;

    // Duplicate content
    for (let i = 0; i < 2; i++) {
      const clone = marqueeContent.cloneNode(true) as HTMLElement;
      marqueeScroll.appendChild(clone);
    }

    // Get all collections
    const marqueeItems = marquee.querySelectorAll(`.${styles.marqueeCollection}`);

    // GSAP animation
    const animation = gsap.to(marqueeItems, {
      xPercent: -100,
      repeat: -1,
      duration: marqueeSpeed,
      ease: 'linear'
    }).totalProgress(0.5);

    // Set initial position
    gsap.set(marqueeItems, { xPercent: marqueeDirectionAttr === 1 ? 100 : -100 });
    animation.timeScale(marqueeDirectionAttr);
    animation.play();

    // Set initial status
    marquee.setAttribute('data-marquee-status', 'normal');

    // ScrollTrigger for direction inversion
    ScrollTrigger.create({
      trigger: marquee,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const isInverted = self.direction === 1;
        const currentDirection = isInverted ? -marqueeDirectionAttr : marqueeDirectionAttr;
        animation.timeScale(currentDirection);
        marquee.setAttribute('data-marquee-status', isInverted ? 'normal' : 'inverted');
      }
    });

    // Extra scroll speed effect
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: marquee,
        start: '0% 100%',
        end: '100% 0%',
        scrub: 0
      }
    });

    const scrollStart = marqueeDirectionAttr === -1 ? scrollSpeed : -scrollSpeed;
    const scrollEnd = -scrollStart;

    tl.fromTo(marqueeScroll, { x: `${scrollStart}vw` }, { x: `${scrollEnd}vw`, ease: 'none' });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [direction, speed, scrollSpeed]);

  return (
    <div
      ref={marqueeRef}
      className={styles.marquee}
      data-marquee-direction={direction}
    >
      <div ref={scrollRef} className={styles.marqueeScroll}>
        <div ref={collectionRef} className={styles.marqueeCollection}>
          {reviews.map((review, index) => (
            <ReviewCard key={index} {...review} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ReviewsSection({ type }: ReviewsSectionProps) {
  const reviews = type === 'fysio' ? fysioReviews : leefstijlReviews;
  const direction = type === 'fysio' ? 'left' : 'right';

  return (
    <section className={styles.section}>
      <div className={styles.marqueeWrapper}>
        <MarqueeRow reviews={reviews} direction={direction} />
      </div>
    </section>
  );
}
