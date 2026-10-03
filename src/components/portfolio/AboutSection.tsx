import { forwardRef, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GlassSurface from '../effects/GlassSurface';

gsap.registerPlugin(ScrollTrigger);

export interface AboutSectionProps extends React.HTMLAttributes<HTMLElement> {}

const AboutSection = forwardRef<HTMLElement, AboutSectionProps>((props, ref) => {
  const containerRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(['.about-header', '.about-title', '.about-strip', '.about-body', '.about-footer'],
        { opacity: 0, y: 40, filter: 'blur(8px)', clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0% 0%)' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)', clipPath: 'polygon(0 -20%, 100% -20%, 100% 120%, 0% 120%)',
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'top 40%',
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
    }} className="about-section" {...props}>
      <GlassSurface className="about-glass">
        <div className="about-header">
          <span className="about-tag">ABOUT // 004</span>
          <span className="about-meta">CREATIVE / DIGITAL</span>
        </div>

        <h2 className="about-title">ABOUT ME</h2>

        <div className="about-strip">
          <span className="strip-item">VIDEO</span>
          <span className="strip-separator">/</span>
          <span className="strip-item">MOTION</span>
          <span className="strip-separator">/</span>
          <span className="strip-item">WEB</span>
          <span className="strip-separator">/</span>
          <span className="strip-item">TECH</span>
        </div>

        <div className="about-body">
          <p>
            Bridging the gap between physical media aesthetics and modern technical architecture.
            Specializing in video editing, motion design, creative technology, web development, and engineering.
          </p>
        </div>

        <div className="about-footer">
          <span className="footer-year">2026</span>
        </div>
      </GlassSurface>

      <style>{`
        .about-section {
          min-height: 100vh;
          min-height: 100dvh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 120px 24px;
          position: relative;
        }
        .about-glass {
          width: 100%;
          max-width: 640px;
          padding: 60px 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          overflow: hidden;
        }
        .about-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 48px;
        }
        .about-tag {
          color: var(--vergil);
        }
        .about-meta {
          color: var(--muted);
        }
        .about-title {
          font-family: var(--font-sans);
          font-size: clamp(24px, 4vw, 42px);
          font-weight: 300;
          letter-spacing: 0.15em;
          color: var(--text);
          margin-bottom: 40px;
          text-transform: uppercase;
        }
        .about-strip {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 48px auto;
          gap: 16px;
          padding: 16px 32px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 2px;
          width: fit-content;
        }
        .strip-item {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text);
          letter-spacing: 0.2em;
        }
        .strip-separator {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--muted);
        }
        .about-body {
          max-width: 480px;
          margin: 0 auto 48px auto;
          text-align: center;
          font-family: var(--font-sans);
          font-size: 13px;
          line-height: 1.6;
          color: var(--muted);
        }
        .about-footer {
          width: 100%;
          display: flex;
          justify-content: center;
        }
        .footer-year {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.2em;
          color: rgba(255, 255, 255, 0.2);
        }

        @media (max-width: 640px) {
          .about-section {
            padding: 80px 20px;
          }
          .about-glass {
            padding: 40px 20px;
          }
          .about-strip {
            flex-wrap: wrap;
            justify-content: center;
            gap: 8px;
            padding: 12px 20px;
          }
          .strip-item {
            font-size: 10px;
            letter-spacing: 0.1em;
          }
          .about-title {
            font-size: clamp(20px, 5vw, 42px);
            margin-bottom: 24px;
          }
          .about-body {
            font-size: 12px;
            margin: 0 auto 32px auto;
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
});

AboutSection.displayName = 'AboutSection';
export default AboutSection;
