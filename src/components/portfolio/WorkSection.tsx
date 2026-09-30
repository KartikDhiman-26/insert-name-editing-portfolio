import { forwardRef, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ReelCarousel from './ReelCarousel';
import { ShortFormWork } from '../../data/portfolio';

gsap.registerPlugin(ScrollTrigger);

export interface WorkSectionProps {
  projects?: ShortFormWork[];
}

const WorkSection = forwardRef<HTMLElement, WorkSectionProps>(( { projects = [] }, ref ) => {
  const containerRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Scroll-scrubbed entrance
      gsap.fromTo('.work-header', 
        { opacity: 0, y: 40 },
        { 
          opacity: 1, y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            end: 'top 50%',
            scrub: 1
          }
        }
      );

      gsap.fromTo('.rc-stage',
        { scale: 0.85, opacity: 0, y: 100 },
        {
          scale: 1, opacity: 1, y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 1.5
          }
        }
      );

      gsap.fromTo(['.rc-title-area', '.rc-meta-area'],
        { opacity: 0, x: -40, filter: 'blur(8px)' },
        {
          opacity: 1, x: 0, filter: 'blur(0px)',
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
    }} className="work-section">
      <div className="work-header">
        <div className="work-header-line" />
        <div className="work-header-content">
          <span className="work-header-index">02</span>
          <span className="work-header-title">SELECTED WORK</span>
          <span className="work-header-type">SHORT FORM</span>
        </div>
        <div className="work-header-line" />
      </div>

      <ReelCarousel projects={projects} />

      <style>{`
        .work-section {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 80px 0 120px;
          position: relative;
        }
        .work-header {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 60px;
          padding: 0 40px;
        }
        .work-header-line {
          flex: 1;
          height: 1px;
          background: var(--border);
        }
        .work-header-content {
          display: flex;
          align-items: center;
          gap: 16px;
          white-space: nowrap;
        }
        .work-header-index {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.15em;
          color: var(--vergil);
        }
        .work-header-title {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.25em;
          color: var(--text);
        }
        .work-header-type {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.15em;
          color: var(--muted);
          padding: 3px 10px;
          border: 1px solid var(--border);
        }

        @media (max-width: 768px) {
          .work-header {
            padding: 0 20px;
            margin-bottom: 32px;
          }
        }
      `}</style>
    </section>
  );
});

WorkSection.displayName = 'WorkSection';
export default WorkSection;
