import { forwardRef } from 'react';
import { EditPhase } from '../../data/project';

export interface ToolbarProps {
  phase?: EditPhase | string;
  activeTool?: string;
}

const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(({ activeTool }, ref) => {
  const tools = ['SELECT', 'MOVE', 'CUT'];
  
  return (
    <div ref={ref} className="toolbar panel-toolbar">
      <div className="tools-left">
        {tools.map(tool => (
          <button 
            key={tool}
            className={`tool-btn ${activeTool === tool ? 'active' : ''}`}
            data-tool={tool}
          >
            {tool}
          </button>
        ))}
      </div>
      <style>{`
        .toolbar {
          background: var(--deep, #090909);
          border-top: 1px solid var(--border, rgba(255,255,255,0.10));
          display: flex;
          justify-content: center;
          gap: 2px;
          padding: 8px;
          height: 100%;
        }
        .tools-left {
          display: flex;
          gap: 2px;
        }
        .tools-right {
          margin-left: 24px;
        }
        .tool-btn {
          background: transparent;
          border: 1px solid var(--border, rgba(255,255,255,0.10));
          padding: 8px 20px;
          color: var(--muted, #707070);
          cursor: none;
          font-family: monospace;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.1em;
          transition: all 0.2s ease;
        }
        .tool-btn.active {
          border-color: var(--dante, #CE1818);
          color: var(--text, #f2f2f2);
          box-shadow: 0 0 8px rgba(206, 24, 24, 0.2);
        }
        .play-btn {
          color: var(--muted, #707070);
          border-color: var(--border, rgba(255,255,255,0.10));
        }
        .play-btn.ready {
          box-shadow: 0 0 16px rgba(206, 24, 24, 0.6);
          border-color: var(--dante, #CE1818);
          color: var(--text, #f2f2f2);
          background: rgba(206, 24, 24, 0.1);
        }
      `}</style>
    </div>
  );
});

Toolbar.displayName = 'Toolbar';
export default Toolbar;
