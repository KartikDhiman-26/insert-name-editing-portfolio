import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import gsap from 'gsap';

export const CURSOR_STATES = {
  DEFAULT: 'default',
  HOVER: 'hover',
  SELECT: 'select',
  DRAG: 'drag',
  CUT: 'cut',
  PLAY: 'play',
};

export type CursorState = 'default' | 'hover' | 'select' | 'drag' | 'cut' | 'play' | 'reject' | string;

export interface CustomCursorProps {
  mode?: string;
  cursorState?: CursorState;
}

const CustomCursor = forwardRef<HTMLDivElement, CustomCursorProps>(({ mode = 'choreographed', cursorState = 'default' }, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const xToRef = useRef<gsap.QuickToFunc | null>(null);
  const yToRef = useRef<gsap.QuickToFunc | null>(null);
  
  useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

  // Mouse tracking — snappy, no artificial lag
  useEffect(() => {
    if (!containerRef.current) return;

    xToRef.current = gsap.quickTo(containerRef.current, 'x', { duration: 0.04, ease: 'power3' });
    yToRef.current = gsap.quickTo(containerRef.current, 'y', { duration: 0.04, ease: 'power3' });

    const handleMouseMove = (e: MouseEvent) => {
      if (xToRef.current) xToRef.current(e.clientX);
      if (yToRef.current) yToRef.current(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mode]);

  // State-based scale animation
  useEffect(() => {
    if (!containerRef.current) return;
    
    const ctx = gsap.context(() => {
      const vf = containerRef.current?.querySelector('.viewfinder');
      if (!vf) return;
      
      gsap.killTweensOf(vf);
      
      switch (cursorState) {
        case CURSOR_STATES.DEFAULT:
          gsap.to(vf, { scale: 1, opacity: 0.85, duration: 0.15, ease: 'power2.out' });
          break;
        case CURSOR_STATES.HOVER:
        case CURSOR_STATES.SELECT:
          gsap.to(vf, { scale: 1.1, opacity: 1, duration: 0.15, ease: 'power2.out' });
          break;
        case 'reject':
          gsap.to(vf, { scale: 1.15, opacity: 1, duration: 0.12, ease: 'power2.out' });
          break;
        case CURSOR_STATES.PLAY:
          gsap.to(vf, { scale: 0.9, duration: 0.08, yoyo: true, repeat: 1 });
          break;
        default:
          gsap.to(vf, { scale: 1, opacity: 0.85, duration: 0.15 });
          break;
      }
    });

    return () => ctx.revert();
  }, [cursorState]);

  // Determine center symbol
  const getCenterSymbol = () => {
    if (cursorState === 'hover' || cursorState === 'select') return '+';
    if (cursorState === 'reject') return '×';
    return null;
  };

  const centerSymbol = getCenterSymbol();
  const isReject = cursorState === 'reject';

  return (
    <div ref={containerRef} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      pointerEvents: 'none',
      zIndex: 10000,
      transform: 'translate(0, 0)',
    }} className={`custom-cursor mode-${mode}`}>
      <div className="viewfinder">
        {/* Four corner brackets */}
        <div className="vf-corner vf-tl" />
        <div className="vf-corner vf-tr" />
        <div className="vf-corner vf-bl" />
        <div className="vf-corner vf-br" />
        {/* Center crosshair dot (default state) */}
        {!centerSymbol && <div className="vf-dot" />}
        {/* Center symbol (hover/reject states) */}
        {centerSymbol && (
          <div className={`vf-symbol ${isReject ? 'vf-reject' : 'vf-select'}`}>
            {centerSymbol}
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 768px) {
          .custom-cursor { display: none !important; }
        }
        .viewfinder {
          position: absolute;
          left: -12px;
          top: -12px;
          width: 24px;
          height: 24px;
          transform-origin: center center;
          will-change: transform, opacity;
        }

        /* ── Corner Brackets ── */
        .vf-corner {
          position: absolute;
          width: 6px;
          height: 6px;
          border-color: rgba(255, 255, 255, 0.75);
          border-style: solid;
          border-width: 0;
        }
        .vf-tl {
          top: 0; left: 0;
          border-top-width: 1px;
          border-left-width: 1px;
        }
        .vf-tr {
          top: 0; right: 0;
          border-top-width: 1px;
          border-right-width: 1px;
        }
        .vf-bl {
          bottom: 0; left: 0;
          border-bottom-width: 1px;
          border-left-width: 1px;
        }
        .vf-br {
          bottom: 0; right: 0;
          border-bottom-width: 1px;
          border-right-width: 1px;
        }

        /* ── Center Dot (default) ── */
        .vf-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 2px;
          height: 2px;
          background: rgba(255, 255, 255, 0.6);
          transform: translate(-50%, -50%);
        }

        /* ── Center Symbol (+/×) ── */
        .vf-symbol {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: var(--font-sans, sans-serif);
          font-size: 11px;
          font-weight: 200;
          line-height: 1;
          color: rgba(255, 255, 255, 0.9);
        }
        .vf-select {
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 0 6px rgba(100, 175, 219, 0.5);
        }
        .vf-reject {
          color: var(--dante, #CE1818);
          text-shadow: 0 0 6px rgba(206, 24, 24, 0.5);
        }
      `}</style>
    </div>
  );
});

CustomCursor.displayName = 'CustomCursor';

export default CustomCursor;
