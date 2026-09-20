import React, { forwardRef, useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';

const Preview = forwardRef(({ phase, previewContent, instruction }, ref) => {
  const containerRef = useRef(null);
  const instructionRef = useRef(null);
  const [displayInstruction, setDisplayInstruction] = useState(instruction);

  useEffect(() => {
    if (instruction !== displayInstruction) {
      if (instructionRef.current) {
        gsap.to(instructionRef.current, {
          opacity: 0,
          y: -10,
          filter: 'blur(4px)',
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            setDisplayInstruction(instruction);
            gsap.fromTo(instructionRef.current, 
              { opacity: 0, y: 10, filter: 'blur(8px)', scale: instruction.includes('COMPLETE') ? 1.05 : 1 },
              { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, duration: 0.6, ease: 'power3.out' }
            );
          }
        });
      } else {
        setDisplayInstruction(instruction);
      }
    }
  }, [instruction, displayInstruction]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const orbs = document.querySelectorAll('.glow-orb');
      
      orbs.forEach((orb) => {
        // Random organic movement
        const move = () => {
          gsap.to(orb, {
            x: () => (Math.random() - 0.5) * 120,
            y: () => (Math.random() - 0.5) * 120,
            scale: () => 1 + Math.random() * 0.5,
            opacity: () => 0.1 + Math.random() * 0.15,
            duration: () => 3 + Math.random() * 4,
            ease: 'sine.inOut',
            onComplete: move
          });
        };
        move();
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={(node) => {
      containerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    }} className="preview-monitor">
      <div className="aspect-wrapper">
        <div className="monitor-placeholder">
          <div className="monitor-frame">
            <div className="monitor-content">
              <div className="scanlines"></div>
              <div className="top-technical-header">
                <span className="brand">INSERT_NAME®</span>
                <span className="rec-indicator"></span>
                <span className="project">PROJECT_001</span>
              </div>
              
              {/* Main Instruction Heading */}
              {displayInstruction && (
                <div 
                  ref={instructionRef}
                  className={`main-instruction ${displayInstruction.includes('COMPLETE') ? 'final-instruction' : ''}`}
                >
                  {displayInstruction.split('\n').map((line, i) => {
                    let className = 'instruction-normal';
                    let colorClass = 'instruction-blue';
                    
                    if (displayInstruction.includes('ADD TO TIMELINE') || 
                        displayInstruction.includes('FINALIZING') || 
                        displayInstruction.includes('EDITING') ||
                        displayInstruction.includes('COMPLETE')) {
                      colorClass = 'instruction-red';
                    }

                    if (displayInstruction.includes('COMPLETE')) {
                      className = i === 0 ? 'instruction-huge' : 'instruction-sub';
                      if (i === 1) colorClass = 'instruction-red';
                    }
                    
                    return (
                      <div key={i} className={`${className} ${colorClass}`}>
                        {line}
                      </div>
                    );
                  })}
                </div>
              )}
              
              <div className="center-content">
                <div className="cinematic-processing">
                  <div className="glow-orb orb-red"></div>
                  <div className="glow-orb orb-blue"></div>
                  <div className="smoke-layer"></div>
                  <div className="dust-layer"></div>
                </div>
              </div>
              
              <div className="bottom-bar">
                <span>3840x2160</span>
                <span>ProRes 4444</span>
                <span>24.000 fps</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .preview-monitor {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(10, 10, 10, 0.35);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            inset 0 0 0 1px rgba(255, 255, 255, 0.03);
          padding: 24px;
          box-sizing: border-box;
        }
        .aspect-wrapper {
          width: 100%;
          max-width: 100%;
          aspect-ratio: 16/9;
          position: relative;
        }
        .monitor-placeholder {
          width: 100%;
          height: 100%;
          position: relative;
        }
        .monitor-frame {
          width: 100%;
          height: 100%;
          border: 1px solid var(--border, rgba(255,255,255,0.10));
          box-shadow: inset 0 0 40px rgba(0,0,0,0.8);
          background: #000;
          position: relative;
          overflow: hidden;
        }
        .monitor-content {
          width: 100%;
          height: 100%;
          position: relative;
        }
        .scanlines {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            to bottom,
            rgba(255,255,255,0),
            rgba(255,255,255,0) 2px,
            rgba(0,0,0,0.1) 3px,
            rgba(0,0,0,0.1) 3px
          );
          pointer-events: none;
          z-index: 10;
        }
        .overlay-meta {
          position: absolute;
          font-family: monospace;
          font-size: 10px;
          color: var(--text, #f2f2f2);
          z-index: 20;
          opacity: 0.7;
        }
        .top-right { top: 16px; right: 16px; }
        .top-left { top: 16px; left: 16px; display: flex; align-items: center; gap: 6px; }
        .top-technical-header {
          position: absolute;
          top: 24px;
          left: 24px;
          right: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: monospace;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 0.2em;
          z-index: 10;
        }
        .rec-indicator {
          width: 8px; height: 8px;
          background: var(--dante, #CE1818);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--dante, #CE1818);
        }
        .main-instruction {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: monospace;
          font-size: 16px;
          letter-spacing: 0.3em;
          color: var(--vergil, #64AFDB);
          text-shadow: 0 0 16px rgba(100,175,219,0.5);
          z-index: 10;
          text-align: center;
          width: 100%;
          pointer-events: none;
        }
        .main-instruction.final-instruction {
          color: var(--text, #f2f2f2);
          text-shadow: none;
        }
        .instruction-normal {
          font-size: 24px;
          letter-spacing: 0.3em;
        }
        .instruction-huge {
          font-size: 42px;
          font-weight: 700;
          letter-spacing: 0.15em;
          margin-bottom: 12px;
        }
        .instruction-sub {
          font-size: 14px;
          letter-spacing: 0.4em;
        }
        .instruction-blue {
          color: var(--vergil, #64AFDB);
          text-shadow: 0 0 16px rgba(100,175,219,0.6);
        }
        .instruction-red {
          color: var(--dante, #CE1818);
          text-shadow: 0 0 16px rgba(206,24,24,0.6);
        }
        .main-instruction.final-instruction .instruction-huge {
          color: var(--text, #f2f2f2);
          text-shadow: 0 0 32px rgba(255,255,255,0.4);
        }
        .center-content {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: monospace;
          color: var(--muted, #707070);
          z-index: 5;
        }
        .boot-sequence {
          text-align: center;
        }
        .logo {
          font-size: 24px;
          letter-spacing: 0.2em;
          color: var(--text, #f2f2f2);
          margin-bottom: 8px;
        }
        .info {
          font-size: 10px;
          letter-spacing: 0.1em;
        }
        .bottom-bar {
          position: absolute;
          bottom: 24px;
          left: 24px;
          right: 24px;
          display: flex;
          justify-content: space-between;
          font-family: monospace;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 0.1em;
        }
        .cinematic-processing {
          position: absolute;
          inset: -40px;
          opacity: 1;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }
        .glow-orb {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.25;
        }
        .orb-red {
          background: var(--dante, #CE1818);
          top: 10%;
          left: 10%;
        }
        .orb-blue {
          background: var(--vergil, #64AFDB);
          bottom: 10%;
          right: 10%;
        }
        .dust-layer {
          position: absolute;
          inset: 0;
          background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
          opacity: 0.05;
          mix-blend-mode: overlay;
          animation: drift 20s linear infinite;
        }
        .smoke-layer {
          position: absolute;
          inset: -50%;
          background: radial-gradient(circle at center, transparent 0%, rgba(5,5,5,0.8) 100%);
          opacity: 0.6;
          filter: blur(20px);
          z-index: 2;
        }
        @keyframes drift {
          0% { transform: translateY(0); }
          100% { transform: translateY(-16px); }
        }
        .glass-play-btn {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            inset 0 0 20px rgba(255, 255, 255, 0.05),
            0 8px 32px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 100;
          transition: all 0.3s ease;
        }
        .glass-play-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 
            inset 0 0 20px rgba(255, 255, 255, 0.1),
            0 8px 32px rgba(0, 0, 0, 0.4);
          transform: translate(-50%, -50%) scale(1.05);
        }
        .glass-play-btn svg {
          margin-left: 4px; /* Optical alignment for play triangle */
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
});

Preview.displayName = 'Preview';
export default Preview;
