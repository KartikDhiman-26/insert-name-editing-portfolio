import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import gsap from 'gsap';

import PortfolioHero from './portfolio/PortfolioHero';
import PortfolioProgress from './portfolio/PortfolioProgress';
import WorkSection from './portfolio/WorkSection';
import LongFormSection from './portfolio/LongFormSection';
import AboutSection from './portfolio/AboutSection';
import ContactSection from './portfolio/ContactSection';

import { SHORT_FORM_WORK, LONG_FORM_WORK } from '../data/portfolio';

export interface PortfolioExperienceProps {}

export default function PortfolioExperience(_props: PortfolioExperienceProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const workRef = useRef<HTMLElement | null>(null);
  const longFormRef = useRef<HTMLElement | null>(null);
  const aboutRef = useRef<HTMLElement | null>(null);
  const contactRef = useRef<HTMLElement | null>(null);

  const [activeSection, setActiveSection] = useState<string>('intro');
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // ── Entry setup & Hero Reveal ──
  useLayoutEffect(() => {
    // Force scroll to top before painting
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      const hero = heroRef.current;
      if (!hero) return;

      const nameEls = hero.querySelectorAll('.hero-name');
      
      // Pre-setup state for hero reveal
      gsap.set(nameEls, { 
        opacity: 0, 
        y: 40,
        scale: 1.05,
        filter: 'blur(12px)',
        clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0% 0%)' // masked start
      });

      // Animate in AFTER the portal transition clears (portal takes ~1.5s total)
      gsap.to(nameEls, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        clipPath: 'polygon(0 -20%, 100% -20%, 100% 120%, 0% 120%)', // mask opens fully
        duration: 1.4,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 1.2
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  // ── Scroll tracking ──
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const scrollTop = window.scrollY;
      const scrollHeight = container.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
      setScrollProgress(Math.min(1, Math.max(0, progress)));

      // Determine active section based on element positions
      const sections = [
        { id: 'intro', ref: heroRef },
        { id: 'work', ref: workRef },
        { id: 'longform', ref: longFormRef },
        { id: 'about', ref: aboutRef },
        { id: 'contact', ref: contactRef },
      ];

      const viewportCenter = scrollTop + window.innerHeight * 0.4;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i].ref.current;
        if (el && el.offsetTop <= viewportCenter) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="portfolio-experience">
      <div className="portfolio-content-layer">
        <PortfolioHero ref={heroRef} />
        <WorkSection ref={workRef} projects={SHORT_FORM_WORK} />
        <LongFormSection ref={longFormRef} projects={LONG_FORM_WORK} />
        <AboutSection ref={aboutRef} />
        <ContactSection ref={contactRef} />
      </div>

      <PortfolioProgress activeSection={activeSection} scrollProgress={scrollProgress} />

      <style>{`
        .portfolio-experience {
          width: 100%;
          min-height: 100vh;
          /* Remove solid background so persistent atmosphere shows through */
          background: transparent; 
          color: var(--text);
          position: relative;
          cursor: auto;
        }
        .portfolio-content-layer {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </div>
  );
}
