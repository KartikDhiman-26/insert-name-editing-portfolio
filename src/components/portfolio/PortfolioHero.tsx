import { forwardRef } from 'react';

export interface PortfolioHeroProps {}

const PortfolioHero = forwardRef<HTMLDivElement, PortfolioHeroProps>((_props, ref) => {
  return (
    <div className="hero-container" ref={ref}>
      <style>{`
        .hero-container {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
        }

        .cinema-frame {
          position: relative;
          width: 100%;
          max-width: 800px;
          padding: 80px 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(5, 5, 5, 0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 
            inset 0 1px 0 rgba(255, 255, 255, 0.18),
            inset 0 -1px 0 rgba(0, 0, 0, 0.35),
            inset 0 0 0 1px rgba(255, 255, 255, 0.05),
            0 0 0 1px rgba(255, 255, 255, 0.12),
            0 8px 32px rgba(0, 0, 0, 0.6);
        }

        .cinema-frame::before,
        .cinema-frame::after {
          content: '';
          position: absolute;
          left: 10px;
          right: 10px;
          height: 6px;
          background-image: repeating-linear-gradient(
            to right,
            rgba(255, 255, 255, 0.06) 0,
            rgba(255, 255, 255, 0.06) 6px,
            transparent 6px,
            transparent 22px
          );
          z-index: 2;
        }

        .frame-reflection {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.06) 0%,
            transparent 40%,
            transparent 60%,
            rgba(100, 175, 219, 0.03) 100%
          );
          pointer-events: none;
          z-index: 1;
        }

        .cinema-frame::before {
          top: -3px;
        }

        .cinema-frame::after {
          bottom: -3px;
        }

        .frame-glow {
          position: absolute;
          bottom: -1px;
          left: 20%;
          width: 60%;
          height: 1px;
          background: radial-gradient(ellipse at center, var(--dante) 0%, transparent 70%);
          opacity: 0.08;
        }

        .hero-top-row {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }

        .hero-label, .hero-archive-tag {
          font-family: var(--font-mono);
          font-size: 9px;
          text-transform: uppercase;
        }

        .hero-label {
          color: var(--vergil);
          letter-spacing: 0.2em;
        }

        .hero-archive-tag {
          color: var(--muted);
          letter-spacing: 0.15em;
        }

        .hero-name-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero-name {
          font-family: var(--font-sans);
          font-size: clamp(52px, 9vw, 110px);
          font-weight: 300;
          letter-spacing: 0.12em;
          color: var(--text);
          line-height: 1.1;
          text-transform: uppercase;
        }

        .red-plate {
          display: inline-block;
          background: var(--dante, #CE1818);
          color: white;
          padding: 0 16px;
          border-radius: 2px;
        }

        .hero-separator {
          width: 48px;
          height: 1px;
          background-color: rgba(255, 255, 255, 0.12);
          margin: 40px 0;
        }

        .hero-roles {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
          justify-content: center;
        }

        .hero-role {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--muted);
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .hero-meta {
          position: absolute;
          bottom: 30px;
          right: 40px;
          font-family: var(--font-mono);
          font-size: 9px;
          color: var(--muted);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .cinema-frame {
            padding: 60px 20px;
          }
          .hero-label { left: 20px; top: 20px; }
          .hero-archive-tag { right: 20px; top: 20px; }
          .hero-meta { right: 20px; bottom: 20px; }
          .hero-roles {
            gap: 12px;
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
      
      <div className="cinema-frame">
        <div className="frame-reflection"></div>
        <div className="frame-glow"></div>
        
        <div style={{ position: 'relative', zIndex: 3, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <div className="hero-top-row">
            <div className="hero-label">ARCHIVE // 001</div>
            <div className="hero-archive-tag">CREATIVE ARCHIVE</div>
          </div>
          
          <div className="hero-name-container">
            <div className="hero-name">KARTIK</div>
            <div className="hero-name">
              <span className="red-plate">DHIMAN</span>
            </div>
          </div>
          
          <div className="hero-separator"></div>
          
          <div className="hero-roles">
            <span className="hero-role">VIDEO EDITOR</span>
            <span className="hero-role">MOTION DESIGN</span>
            <span className="hero-role">CREATIVE DEVELOPER</span>
          </div>
          
          <div className="hero-meta">VIDEO / MOTION / DIGITAL</div>
        </div>
      </div>
    </div>
  );
});

PortfolioHero.displayName = 'PortfolioHero';

export default PortfolioHero;
