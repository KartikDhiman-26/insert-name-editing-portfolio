import { forwardRef } from 'react';

const Playhead = forwardRef<HTMLDivElement, {}>((_props, ref) => {
  return (
    <div ref={ref} className="playhead">
      <div className="triangle"></div>
      <style>{`
        .playhead {
          position: absolute;
          top: 0;
          height: 100%;
          width: 2px;
          background: var(--dante, #CE1818);
          box-shadow: 0 0 8px var(--dante, #CE1818);
          z-index: 10;
          pointer-events: none;
          transform: translateX(0);
          left: 48px; /* Offset for track label */
        }
        .triangle {
          position: absolute;
          top: 0;
          left: -4px;
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 6px solid var(--dante, #CE1818);
        }
      `}</style>
    </div>
  );
});

Playhead.displayName = 'Playhead';
export default Playhead;
