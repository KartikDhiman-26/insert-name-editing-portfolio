import { forwardRef, useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { EditPhase } from '../../data/project';

export interface PreviewProps {
  phase?: EditPhase | string;
  previewContent?: boolean; // Wait, previewContent doesn't seem to be used except as a prop? Let's check original. It was `previewContent`. Actually, looking at original Preview: `previewContent` wasn't used inside the component directly, wait, was it? Let's assume it was unused if it is. No, wait, wait! The original had `instruction`.
  instruction?: string;
}

const Preview = forwardRef<HTMLDivElement, PreviewProps>(({ instruction }, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const instructionRef = useRef<HTMLDivElement | null>(null);
  const [displayInstruction, setDisplayInstruction] = useState<string | undefined>(instruction);

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
              { opacity: 0, y: 10, filter: 'blur(8px)', scale: instruction && instruction.includes('COMPLETE') ? 1.05 : 1 },
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
      else if (ref && 'current' in ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
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

              <div className="glow-orb red"></div>
              <div className="glow-orb blue"></div>
              
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .preview-monitor {
          background: rgba(10, 10, 10, 0.35);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-left: 1px solid rgba(255,255,255,0.08);
          border-right: 1px solid rgba(255,255,255,0.08);
          box-shadow: 
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            inset 0 0 0 1px rgba(255, 255, 255, 0.03);
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .aspect-wrapper {
          width: 100%;
          max-width: 800px;
          aspect-ratio: 16/9;
        }
        .monitor-placeholder {
          width: 100%;
          height: 100%;
          background: var(--void, #050505);
          border: 1px solid var(--border, rgba(255,255,255,0.10));
          border-radius: 4px;
          padding: 8px;
          position: relative;
        }
        .monitor-frame {
          width: 100%;
          height: 100%;
          border: 1px solid rgba(255,255,255,0.05);
          position: relative;
          background: #000;
          overflow: hidden;
        }
        .monitor-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          z-index: 10;
        }
        
        /* TECHNICAL HEADER - moved to top left */
        .top-technical-header {
          position: absolute;
          top: 16px;
          left: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.3);
          z-index: 20;
        }
        
        .rec-indicator {
          width: 6px;
          height: 6px;
          background: var(--dante, #CE1818);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--dante, #CE1818);
          animation: rec-pulse 2s infinite;
        }
        
        /* INSTRUCTION TYPOGRAPHY - Centered */
        .main-instruction {
          position: relative;
          z-index: 20;
          font-family: var(--font-sans);
          text-transform: uppercase;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        
        .instruction-normal {
          font-size: 1.4rem;
          font-weight: 300;
          letter-spacing: 0.3em;
        }
        
        .instruction-huge {
          font-size: 2.5rem;
          font-weight: 400;
          letter-spacing: 0.4em;
          text-shadow: 0 0 20px rgba(206,24,24,0.4);
        }
        
        .instruction-sub {
          font-size: 0.9rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          opacity: 0.7;
          margin-top: 12px;
        }
        
        /* Deterministic state colors */
        .instruction-blue {
          color: var(--text, #f2f2f2);
          text-shadow: 0 0 12px rgba(100,175,219,0.4);
        }
        
        .instruction-red {
          color: var(--dante, #CE1818);
          text-shadow: 0 0 12px rgba(206,24,24,0.6);
        }

        /* VOLUMETRIC SMOKE / GLOW ORBS */
        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
          z-index: 1;
          will-change: transform, opacity;
        }
        .glow-orb.red {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(206,24,24,0.15) 0%, rgba(206,24,24,0) 70%);
          bottom: -100px;
          right: -100px;
        }
        .glow-orb.blue {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(100,175,219,0.12) 0%, rgba(100,175,219,0) 70%);
          top: -150px;
          left: -150px;
        }

        .scanlines {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(255,255,255,0),
            rgba(255,255,255,0) 50%,
            rgba(0,0,0,0.1) 50%,
            rgba(0,0,0,0.1)
          );
          background-size: 100% 4px;
          pointer-events: none;
          z-index: 30;
        }

        @keyframes rec-pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
});

Preview.displayName = 'Preview';
export default Preview;
