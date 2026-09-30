import { forwardRef, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GlassSurface from '../effects/GlassSurface';

gsap.registerPlugin(ScrollTrigger);

export interface ContactSectionProps extends React.HTMLAttributes<HTMLElement> {}

const ContactSection = forwardRef<HTMLElement, ContactSectionProps>((props, ref) => {
  const containerRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          end: 'top 30%',
          scrub: 1
        }
      });

      tl.fromTo('.contact-header',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, ease: 'none' }, 0
      );

      tl.fromTo('.contact-title span',
        { opacity: 0, y: 40, filter: 'blur(10px)', scale: 0.95 },
        { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, stagger: 0.1, ease: 'none' }, 0
      );
      
      tl.fromTo('.contact-final',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, ease: 'none' }, 0.2
      );

      tl.fromTo('.contact-link',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, stagger: 0.1, ease: 'none' }, 0.2
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={(node) => {
      containerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref && 'current' in ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;
    }} className="contact-section" {...props}>
      <GlassSurface className="contact-glass">
        <div className="contact-header">
          <span className="contact-tag">CONTACT // 005</span>
        </div>

        <h2 className="contact-title">
          <span>LET'S</span>
          <span>WORK</span>
          <span>TOGETHER.</span>
        </h2>
        
        <div className="contact-final" style={{ marginBottom: '40px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.2em', color: 'var(--vergil)' }}>
          GOT AN IDEA? <span style={{ color: 'var(--text)' }}>insert_name</span>
        </div>

        <div className="contact-links">
          <a href="https://instagram.com/thandithandicoffeeee" target="_blank" rel="noopener noreferrer" className="contact-link">
            <span className="link-label">INSTAGRAM</span>
            <span className="link-arrow">↗</span>
          </a>
          <a href="https://linkedin.com/in/kartik-dhiman" target="_blank" rel="noopener noreferrer" className="contact-link">
            <span className="link-label">LINKEDIN</span>
            <span className="link-arrow">↗</span>
          </a>
          <a href="https://github.com/KartikDhiman-26" target="_blank" rel="noopener noreferrer" className="contact-link">
            <span className="link-label">GITHUB</span>
            <span className="link-arrow">↗</span>
          </a>
          <a href="mailto:kartikdhiman80@gmail.com" className="contact-link">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span className="link-label">EMAIL</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted)', textTransform: 'lowercase', letterSpacing: '0.05em' }}>kartikdhiman80@gmail.com</span>
            </div>
            <span className="link-arrow">↗</span>
          </a>
        </div>
      </GlassSurface>

      <style>{`
        .contact-section {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 120px 24px;
          position: relative;
        }
        .contact-glass {
          width: 100%;
          max-width: 720px;
          padding: 80px 60px;
          display: flex;
          flex-direction: column;
        }
        .contact-header {
          margin-bottom: 60px;
        }
        .contact-tag {
          font-family: var(--font-mono);
          font-size: 9px;
          color: var(--vergil);
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }
        .contact-title {
          font-family: var(--font-sans);
          font-size: clamp(40px, 7vw, 84px);
          font-weight: 300;
          letter-spacing: 0.05em;
          color: var(--text);
          display: flex;
          flex-direction: column;
          line-height: 1;
          margin-bottom: 80px;
        }
        .contact-links {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 40px;
        }
        .contact-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .contact-link:hover {
          background: rgba(206, 24, 24, 0.05);
          border-color: var(--dante);
        }
        .contact-link:hover .link-arrow {
          transform: translate(4px, -4px);
          color: var(--dante);
        }
        .link-label {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text);
          letter-spacing: 0.15em;
        }
        .link-arrow {
          font-family: var(--font-mono);
          font-size: 14px;
          color: var(--muted);
          transition: transform 0.3s ease, color 0.3s ease;
        }

        @media (max-width: 640px) {
          .contact-glass {
            padding: 40px 24px;
          }
          .contact-title {
            margin-bottom: 40px;
          }
        }
      `}</style>
    </section>
  );
});

ContactSection.displayName = 'ContactSection';
export default ContactSection;
