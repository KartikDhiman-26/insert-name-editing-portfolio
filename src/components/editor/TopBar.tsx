import { forwardRef } from 'react';
import { EditPhase } from '../../data/project';

export interface TopBarProps {
  phase?: EditPhase | string;
}

const TopBar = forwardRef<HTMLDivElement, TopBarProps>((_props, ref) => {
  return (
    <div ref={ref} className="top-bar">
      <div className="left">INSERT_NAME®</div>
      <div className="center">PROJECT_001</div>
      <div className="right">
        <span className="badge">24 FPS</span>
        <span className="badge">4K</span>
        <span className="status">
          <span className="dot"></span> SYSTEM READY
        </span>
      </div>
      <style>{`
        .top-bar {
          background: var(--deep, #090909);
          border-bottom: 1px solid var(--border, rgba(255,255,255,0.10));
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 24px;
          height: 100%;
          font-family: monospace;
          color: var(--text, #f2f2f2);
        }
        .left {
          font-size: 11px;
          letter-spacing: 0.2em;
          color: var(--muted, #707070);
          text-transform: uppercase;
        }
        .center {
          font-size: 12px;
          letter-spacing: 0.1em;
        }
        .right {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 10px;
        }
        .badge {
          border: 1px solid var(--vergil, #64AFDB);
          color: var(--vergil, #64AFDB);
          padding: 2px 6px;
          border-radius: 2px;
        }
        .status {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--muted, #707070);
          margin-left: 8px;
        }
        .dot {
          width: 6px;
          height: 6px;
          background: var(--vergil, #64AFDB);
          border-radius: 50%;
          box-shadow: 0 0 6px var(--vergil, #64AFDB);
        }
      `}</style>
    </div>
  );
});

TopBar.displayName = 'TopBar';
export default TopBar;
