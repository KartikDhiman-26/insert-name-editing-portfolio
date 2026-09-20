import React, { forwardRef } from 'react';

const Inspector = forwardRef(({ phase, project, activeClip, onPlayClick }, ref) => {
  return (
    <div ref={ref} className="inspector">
      <div className="header">INSPECTOR</div>
      
      <div className="section">
        <div className="section-title">PROJECT</div>
        <div className="row">
          <span className="label">NAME</span>
          <span className="value">{project?.name || 'PROJECT_001'}</span>
        </div>
        <div className="row">
          <span className="label">FPS</span>
          <span className="value">{project?.fps || '24.000'}</span>
        </div>
        <div className="row">
          <span className="label">RES</span>
          <span className="value">{project?.resolution ? `${project.resolution.w}x${project.resolution.h}` : '3840x2160'}</span>
        </div>
        <div className="row">
          <span className="label">CREATOR</span>
          <span className="value">{project?.creator || 'SYSTEM'}</span>
        </div>
      </div>

      <div className="section">
        <div className="section-title">CLIP</div>
        {activeClip ? (
          <>
            <div className="row">
              <span className="label">ID</span>
              <span className="value">{activeClip.id}</span>
            </div>
            <div className="row">
              <span className="label">DUR</span>
              <span className="value">{activeClip.duration}</span>
            </div>
            <div className="row">
              <span className="label">TYPE</span>
              <span className="value">{activeClip.meta}</span>
            </div>
          </>
        ) : (
          <div className="empty-state">NO CLIP SELECTED</div>
        )}
      </div>

      <div className="section">
        <div className="section-title">STATUS</div>
        <div className="row">
          <span className="label">PHASE</span>
          <span className="value phase-val">{phase ? phase.toUpperCase() : 'UNKNOWN'}</span>
        </div>
      </div>

      {(phase === 'finish' || phase === 'ready' || phase === 'play') && (
        <div className="section finishing">
          <div className="section-title">FINISHING</div>
          <div className="row">
            <span className="label">MOTION</span>
            <span className="value check">✓</span>
          </div>
          <div className="row">
            <span className="label">COLOR</span>
            <span className="value check">✓</span>
          </div>
          <div className="row">
            <span className="label">SOUND</span>
            <span className="value check">✓</span>
          </div>
        </div>
      )}

      <div className="inspector-footer">
        <button 
          className="inspector-play-btn" 
          data-state="not-ready"
          onClick={onPlayClick}
        >
          PLAY
        </button>
      </div>

      <style>{`
        .inspector {
          background: rgba(10, 10, 10, 0.35);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-left: 1px solid rgba(255,255,255,0.08);
          box-shadow: 
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            inset 0 0 0 1px rgba(255, 255, 255, 0.03);
          padding: 24px;
          height: 100%;
          overflow-y: auto;
          font-family: monospace;
          color: var(--text, #f2f2f2);
          display: flex;
          flex-direction: column;
        }
        .inspector-footer {
          margin-top: auto;
          padding-top: 24px;
        }
        .inspector-play-btn {
          width: 100%;
          height: 48px;
          border: 1px solid var(--border, rgba(255,255,255,0.1));
          background: transparent;
          color: var(--muted, #707070);
          font-family: monospace;
          font-size: 14px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          cursor: none;
          transition: all 0.4s ease;
          border-radius: 2px;
          pointer-events: none; /* Disabled by default */
        }
        .inspector-play-btn[data-state="ready"] {
          pointer-events: auto;
          color: var(--text, #f2f2f2);
          border-color: var(--dante, #CE1818);
          background: rgba(206, 24, 24, 0.1);
          box-shadow: 0 0 16px rgba(206,24,24,0.4);
        }
        .inspector-play-btn[data-state="ready"]:hover {
          background: rgba(206, 24, 24, 0.2);
          box-shadow: 0 0 24px rgba(206,24,24,0.6);
        }
        .header {
          font-size: 10px;
          text-transform: uppercase;
          color: var(--muted, #707070);
          letter-spacing: 0.15em;
          margin-bottom: 24px;
        }
        .section {
          margin-bottom: 24px;
          border-bottom: 1px solid var(--border, rgba(255,255,255,0.10));
          padding-bottom: 16px;
        }
        .section-title {
          font-size: 9px;
          color: var(--muted, #707070);
          letter-spacing: 0.1em;
          margin-bottom: 12px;
        }
        .row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 11px;
        }
        .label {
          color: var(--muted, #707070);
        }
        .value {
          color: var(--text, #f2f2f2);
          text-align: right;
        }
        .empty-state {
          font-size: 10px;
          color: var(--muted, #707070);
          font-style: italic;
        }
        .phase-val {
          color: var(--vergil, #64AFDB);
        }
        .check {
          color: var(--dante, #CE1818);
        }
      `}</style>
    </div>
  );
});

Inspector.displayName = 'Inspector';
export default Inspector;
