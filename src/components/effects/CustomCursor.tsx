import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
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
  
  // Combine forwarded ref and internal ref
  useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

  useEffect(() => {
    // Always track mouse
    if (!containerRef.current) return;

    // Create GSAP quick setters for performance
    xToRef.current = gsap.quickTo(containerRef.current, 'x', { duration: 0.1, ease: 'power3' });
    yToRef.current = gsap.quickTo(containerRef.current, 'y', { duration: 0.1, ease: 'power3' });

    const handleMouseMove = (e: MouseEvent) => {
      if (xToRef.current) xToRef.current(e.clientX);
      if (yToRef.current) yToRef.current(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mode]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const ctx = gsap.context(() => {
      const pointer = containerRef.current?.querySelector('.mouse-pointer');
      if (!pointer) return;
      
      // Reset
      gsap.killTweensOf([pointer]);
      
      switch (cursorState) {
        case CURSOR_STATES.DEFAULT:
          gsap.to(pointer, { scale: 1, filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))', duration: 0.2 });
          break;
        case CURSOR_STATES.HOVER:
          gsap.to(pointer, { scale: 1.1, filter: 'drop-shadow(0px 4px 8px rgba(206,24,24,0.3))', duration: 0.2 });
          break;
        case CURSOR_STATES.SELECT:
          gsap.to(pointer, { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 });
          break;
        case CURSOR_STATES.DRAG:
          gsap.to(pointer, { scale: 0.95, duration: 0.2 });
          break;
        case CURSOR_STATES.CUT:
          gsap.to(pointer, { scale: 1, duration: 0.2 });
          break;
        case CURSOR_STATES.PLAY:
          gsap.to(pointer, { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 });
          break;
        default:
          break;
      }
    });

    return () => ctx.revert();
  }, [cursorState]);

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    pointerEvents: 'none',
    zIndex: 10000,
    transform: 'translate(0, 0)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const renderPointer = () => {
    if (cursorState === 'hover') return '+';
    if (cursorState === 'reject') return '×';
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 2L18 11.5L11.5 13L9.5 20.5L4 2Z" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    );
  };

  return (
    <div ref={containerRef} style={containerStyle} className={`custom-cursor mode-${mode}`}>
      <div className="mouse-pointer">
        {renderPointer()}
      </div>
      <style>{`
        @media (max-width: 768px) {
          .custom-cursor { display: none !important; }
        }
        .mouse-pointer {
          position: absolute;
          /* Center the container */
          left: -12px;
          top: -12px;
          width: 24px;
          height: 24px;
          /* The default SVG arrow has its tip around (4,2). 
             We can offset the whole pointer so the tip is roughly at center (0,0).
             Actually, if the state is text, it will just be perfectly centered in this 24x24 box.
             Let's use flex to center the text. */
          display: flex;
          align-items: center;
          justify-content: center;
          transform-origin: center center;
          will-change: transform, filter;
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.4));
          font-family: var(--font-sans);
          font-size: 24px;
          color: white;
          font-weight: 300;
          line-height: 1;
        }
        /* When it's the SVG arrow, we can shift it slightly so its tip hits the hotspot */
        .mouse-pointer svg {
          transform: translate(-4px, -2px);
        }
      `}</style>
    </div>
  );
});

CustomCursor.displayName = 'CustomCursor';

export default CustomCursor;
