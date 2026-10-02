import { forwardRef, useLayoutEffect, useRef, useState, useEffect, MouseEvent } from 'react';
import gsap from 'gsap';
import { EditPhase } from '../../data/project';
import Balatro from '../Balatro';

export interface PreviewProps {
  phase?: EditPhase | string;
  previewContent?: boolean;
  instruction?: string;
  onPlayClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  isPlayReady?: boolean;
  editProgress?: number;
}

const Preview = forwardRef<HTMLDivElement, PreviewProps>(({ instruction, onPlayClick, isPlayReady = false, editProgress = 0 }, ref) => {
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
              { opacity: 0, y: 10, filter: 'blur(8px)', scale: instruction && instruction.includes('COMPLETE') ? 1.02 : 1 },
              { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, duration: 0.6, ease: 'power3.out' }
            );
          }
        });
      } else {
        setDisplayInstruction(instruction);
      }
    }
  }, [instruction, displayInstruction]);

  // Derive step info from instruction
  const getStepInfo = () => {
    if (!displayInstruction) return { step: '01', title: 'SELECT THE CLIPS', subtitle: 'Choose the clips you want to keep.' };
    if (displayInstruction.includes('SELECT')) return { step: '01', title: 'SELECT THE CLIPS', subtitle: 'Choose the clips you want to keep.' };
    if (displayInstruction.includes('ADD TO TIMELINE')) return { step: '02', title: 'ADD TO TIMELINE', subtitle: 'Scroll down to build your edit.' };
    if (displayInstruction.includes('SCROLL TO CONTINUE')) return { step: '02', title: 'SCROLL TO CONTINUE', subtitle: 'Scroll to assemble the timeline.' };
    if (displayInstruction.includes('FINALIZING')) return { step: '03', title: 'FINALIZING EDIT', subtitle: 'Arranging clips on the timeline.' };
    if (displayInstruction.includes('COMPLETE')) return { step: '04', title: 'EDIT COMPLETE', subtitle: 'YOUR EDIT IS READY' };
    return { step: '01', title: displayInstruction, subtitle: '' };
  };

  const stepInfo = getStepInfo();
  const isComplete = displayInstruction?.includes('COMPLETE') || false;
  
  // Dynamic play control styling
  const getPlayControlStyle = () => {
    if (isPlayReady) return { transform: 'scale(1)', opacity: 1 };
    
    // Scale starts small and grows as progress increases
    const scale = 0.5 + ((editProgress / 100) * 0.4); // 0.5 to 0.9
    const opacity = 0.2 + ((editProgress / 100) * 0.5); // 0.2 to 0.7
    
    return {
      transform: `scale(${scale})`,
      opacity: opacity,
      transition: 'transform 0.5s ease, opacity 0.5s ease'
    };
  };

  return (
    <div ref={(node) => {
      containerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref && 'current' in ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }} className="preview-monitor">
      <div className="aspect-wrapper">
        <div className="monitor-placeholder">
          <div className="monitor-frame">
            {/* Balatro Background - contained inside monitor frame */}
            <div className="balatro-wrapper">
              <Balatro
                spinRotation={-5.5}
                spinSpeed={6}
                color1="#CE1818"
                color2="#64AFDB"
                color3="#050505"
                contrast={6.5}
                lighting={0.5}
                spinAmount={0.2}
                pixelFilter={2000}
              />
            </div>

            <div className="monitor-content">
              <div className="scanlines"></div>
              <div className="top-technical-header">
                <span className="brand">INSERT_NAME®</span>
                <span className="rec-indicator"></span>
                <span className="project">PROJECT_001</span>
              </div>
              
              {/* Progressive guidance with minimal CTA */}
              <div ref={instructionRef} className={`main-instruction ${isComplete ? 'final-instruction' : ''}`}>
                <div className="instruction-step">
                  STEP {stepInfo.step}
                </div>
                <div className={`instruction-title ${isComplete ? 'instruction-red' : 'instruction-blue'}`}>
                  {stepInfo.title}
                </div>
                <div className="instruction-subtitle">
                  {stepInfo.subtitle}
                </div>
                
                <div className="instruction-separator"></div>

                <div className="media-play-control" style={getPlayControlStyle()}>
                  <span className={`play-bracket ${isPlayReady ? 'ready' : ''}`}>&lt;</span>
                  <button
                    className={`minimal-play-btn ${isPlayReady ? 'ready' : ''}`}
                    onClick={onPlayClick}
                    disabled={!isPlayReady}
                    aria-label="Play edit"
                  >
                    <svg className="minimal-play-icon" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="6,3 20,12 6,21" />
                    </svg>
                  </button>
                  <span className={`play-bracket ${isPlayReady ? 'ready' : ''}`}>&gt;</span>
                </div>

                <div className="instruction-footer">
                  {isComplete ? (
                    <>CLICK THE <span className="play-word">PLAY</span> BUTTON TO CONTINUE</>
                  ) : (
                    'AWAITING INPUT'
                  )}
                </div>

              </div>

            </div>
          </div>
        </div>
        
        {/* Progress Strip */}
        <div className="preview-progress-container">
          <div className="preview-progress-track">
            <div 
              className="preview-progress-fill" 
              style={{ width: `${editProgress}%` }}
            ></div>
          </div>
          <div className="preview-progress-label">
            {editProgress}%
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
          display: flex;
          flex-direction: column;
        }
        .monitor-placeholder {
          width: 100%;
          aspect-ratio: 16/9;
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

        /* ── PROGRESS STRIP ── */
        .preview-progress-container {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 20px;
          padding: 0 4px;
        }

        .preview-progress-track {
          flex: 1;
          height: 4px;
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 2px;
          overflow: hidden;
          position: relative;
        }

        .preview-progress-fill {
          height: 100%;
          background: var(--dante, #CE1818);
          box-shadow: 0 0 12px rgba(206, 24, 24, 0.8);
          transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 2px;
        }

        .preview-progress-label {
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          color: rgba(255, 255, 255, 0.4);
          min-width: 36px;
          text-align: right;
          letter-spacing: 0.1em;
          transition: color 0.3s ease;
        }

        .final-instruction ~ .preview-progress-container .preview-progress-label {
          color: rgba(255, 255, 255, 0.8);
        }

        /* ── BALATRO BACKGROUND ── */
        .balatro-wrapper {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
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
        
        /* ── TECHNICAL HEADER ── */
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
        
        /* ── INSTRUCTION TYPOGRAPHY & CARD ── */
        .main-instruction {
          position: relative;
          z-index: 20;
          font-family: var(--font-sans);
          text-transform: uppercase;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 360px;
          
          /* Premium glass material */
          background: linear-gradient(135deg, rgba(20, 20, 22, 0.75) 0%, rgba(10, 10, 12, 0.85) 100%);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 
            inset 0 1px 0 rgba(255, 255, 255, 0.15),
            0 16px 40px rgba(0, 0, 0, 0.5);
          
          padding: 36px 36px 28px 36px;
          border-radius: 8px;
        }

        .instruction-step {
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.3em;
          color: rgba(100, 175, 219, 0.8);
          margin-bottom: 12px;
        }

        .instruction-title {
          font-size: clamp(1rem, 2.5vw, 1.4rem);
          font-weight: 800;
          letter-spacing: 0.12em;
          line-height: 1.1;
          margin-bottom: 6px;
        }

        .instruction-subtitle {
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.45);
          text-transform: none;
        }

        .instruction-separator {
          width: 100%;
          height: 1px;
          background: rgba(255, 255, 255, 0.06);
          margin: 24px 0 20px 0;
        }

        /* ── MINIMAL PLAY CONTROL ── */
        .media-play-control {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          margin: 8px 0;
        }
        
        .play-bracket {
          font-family: var(--font-mono, monospace);
          font-size: 24px;
          font-weight: 300;
          color: rgba(255, 255, 255, 0.15);
          transition: color 0.4s ease;
        }

        .play-bracket.ready {
          color: rgba(255, 255, 255, 0.4);
        }

        .minimal-play-btn {
          background: transparent;
          border: none;
          padding: 16px;
          color: rgba(255, 255, 255, 0.15);
          cursor: not-allowed;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .minimal-play-icon {
          width: 32px;
          height: 32px;
        }

        .minimal-play-btn.ready {
          cursor: pointer;
          color: var(--dante, #CE1818);
          animation: dante-pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .minimal-play-btn.ready {
            animation: none;
            filter: drop-shadow(0 0 12px rgba(206, 24, 24, 0.6));
          }
        }

        @keyframes dante-pulse {
          0%, 100% {
            filter: drop-shadow(0 0 12px rgba(206, 24, 24, 0.4));
            transform: scale(1);
          }
          50% {
            filter: drop-shadow(0 0 28px rgba(206, 24, 24, 0.8));
            transform: scale(1.08);
          }
        }

        .minimal-play-btn.ready:hover {
          color: #ff3333;
          animation: none;
          filter: drop-shadow(0 0 32px rgba(206, 24, 24, 0.9));
          transform: scale(1.15);
        }

        .minimal-play-btn.ready:active {
          transform: scale(0.95);
        }

        /* ── INSTRUCTION FOOTER ── */
        .instruction-footer {
          width: 100%;
          text-align: center;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          font-family: var(--font-mono, monospace);
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.35);
        }
        
        .play-word {
          color: var(--dante, #CE1818);
          font-weight: 800;
          letter-spacing: 0.15em;
          text-shadow: 0 0 8px rgba(206, 24, 24, 0.4);
          margin: 0 4px;
        }

        /* Deterministic state colors */
        .instruction-blue {
          color: var(--text, #ffffff);
          text-shadow: 0 0 12px rgba(100,175,219,0.3);
        }
        
        .instruction-red {
          color: var(--text, #ffffff);
          text-shadow: 0 0 16px rgba(206,24,24,0.4);
          animation: instruction-breathe 3s ease-in-out infinite;
        }

        @keyframes instruction-breathe {
          0%, 100% { text-shadow: 0 0 16px rgba(206,24,24,0.2); }
          50% { text-shadow: 0 0 32px rgba(206,24,24,0.5); }
        }

        .scanlines {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(255,255,255,0),
            rgba(255,255,255,0) 50%,
            rgba(0,0,0,0.08) 50%,
            rgba(0,0,0,0.08)
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

        @media (max-width: 768px) {
          .preview-monitor { padding: 8px; }
          .monitor-placeholder { padding: 4px; }
          .main-instruction { 
            width: 280px;
            padding: 24px 20px 20px 20px; 
          }
          .instruction-title { font-size: 1.1rem; }
          .top-technical-header { font-size: 8px; top: 8px; left: 10px; gap: 6px; }
          .minimal-play-icon { width: 24px; height: 24px; }
          .play-bracket { font-size: 20px; }
        }
      `}</style>
    </div>
  );
});

Preview.displayName = 'Preview';
export default Preview;
