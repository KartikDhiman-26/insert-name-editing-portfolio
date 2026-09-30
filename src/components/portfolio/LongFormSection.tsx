import { forwardRef, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LongFormReel from './LongFormReel';
import { LongFormWork } from '../../data/portfolio';

gsap.registerPlugin(ScrollTrigger);

export interface LongFormSectionProps {
  projects?: LongFormWork[];
}

const LongFormSection = forwardRef<HTMLElement, LongFormSectionProps>(( { projects = [] }, ref ) => {
  const containerRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Scroll-scrubbed entrance
      gsap.fromTo('.lf-header', 
        { opacity: 0, y: 40, clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0% 0%)' },
        { 
          opacity: 1, y: 0, clipPath: 'polygon(0 -20%, 100% -20%, 100% 120%, 0% 120%)',
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            end: 'top 50%',
            scrub: 1
          }
        }
      );

      gsap.fromTo('.media-wrapper',
        { scale: 0.9, opacity: 0, y: 100, rotationX: 10 },
        {
          scale: 1, opacity: 1, y: 0, rotationX: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 1.5
          }
        }
      );

      gsap.fromTo('.shared-info-section',
        { opacity: 0, y: 60, filter: 'blur(8px)' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)',
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            end: 'top 35%',
            scrub: 1
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={(node) => {
      containerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref && 'current' in ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;
    }} className="lf-section">
      <div className="lf-header">
        <div className="lf-header-line" />
        <div className="lf-header-content">
          <span className="lf-header-index">03</span>
          <span className="lf-header-title">LONG FORM</span>
          <span className="lf-header-type">CINEMATIC</span>
        </div>
        <div className="lf-header-line" />
      </div>

      <LongFormReel projects={projects} />

      <style>{`
        .lf-section {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px 0 100px;
          position: relative;
        }
        .lf-header {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 40px;
          padding: 0 40px;
        }
        .lf-header-line {
          flex: 1;
          height: 1px;
          background: var(--border);
        }
        .lf-header-content {
          display: flex;
          align-items: center;
          gap: 16px;
          white-space: nowrap;
        }
        .lf-header-index {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.15em;
          color: var(--vergil);
        }
        .lf-header-title {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.25em;
          color: var(--text);
        }
        .lf-header-type {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.15em;
          color: var(--muted);
          padding: 3px 10px;
          border: 1px solid var(--border);
        }

        @media (max-width: 768px) {
          .lf-header {
            padding: 0 20px;
            margin-bottom: 32px;
          }
        }
      `}</style>
    </section>
  );
});

LongFormSection.displayName = 'LongFormSection';
export default LongFormSection;
