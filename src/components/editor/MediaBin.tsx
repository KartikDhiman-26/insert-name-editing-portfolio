import { forwardRef, MouseEvent } from 'react';
import { Clip, EditPhase } from '../../data/project';

export interface MediaBinProps {
  clips?: Clip[];
  phase?: EditPhase | string;
  onClipClick?: (id: string) => void;
  onClipEnter?: (id: string, e: MouseEvent<HTMLDivElement>) => void;
  onClipLeave?: () => void;
}

const MediaBin = forwardRef<HTMLDivElement, MediaBinProps>(({ clips = [], onClipClick, onClipEnter, onClipLeave }, ref) => {
  return (
    <div ref={ref} className="media-bin">
      <div className="header">MEDIA BIN</div>
      <div className="grid">
        {clips.map(clip => (
          <div 
            key={clip.id} 
            className={`clip-item ${clip.keep ? 'selected' : ''}`} 
            data-clip-id={clip.id}
            data-status={clip.keep ? 'SELECTED' : 'REJECTED'}
            onClick={() => onClipClick && onClipClick(clip.id)}
            onMouseEnter={(e) => onClipEnter && onClipEnter(clip.id, e)}
            onMouseLeave={() => onClipLeave && onClipLeave()}
            style={{ cursor: 'none' }}
          >
            <div className="clip-thumb" style={{ background: `linear-gradient(135deg, ${clip.color}40, ${clip.color}10)` }}>
              <div className="scanline"></div>
              {/* Subtle status overlays */}
              <div className="status-overlay reject" style={{ display: clip.keep ? 'none' : 'flex', opacity: 1 }}>REMOVED</div>
              <div className="status-overlay select" style={{ display: clip.keep ? 'flex' : 'none', opacity: 1 }}>SELECTED</div>
            </div>
            <div className="clip-info">
              <span className="clip-filename">{clip.filename}</span>
            </div>
            <div className="clip-meta">
              <span className="clip-duration">{clip.duration}</span>
              <span className="meta-badge">{clip.meta}</span>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .media-bin {
          background: rgba(10, 10, 10, 0.35);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-right: 1px solid rgba(255,255,255,0.08);
          box-shadow: 
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            inset 0 0 0 1px rgba(255, 255, 255, 0.03);
          padding: 16px;
          overflow-y: auto;
          height: 100%;
          font-family: monospace;
          color: var(--text, #f2f2f2);
        }
        .header {
          font-size: 10px;
          text-transform: uppercase;
          color: var(--muted, #707070);
          letter-spacing: 0.15em;
          margin-bottom: 16px;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          align-content: start;
        }
        .clip-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          transform-origin: top left;
          will-change: transform, opacity, height, margin;
          overflow: hidden;
        }
        .clip-thumb {
          aspect-ratio: 16/9;
          position: relative;
          border: 1px solid var(--border, rgba(255,255,255,0.10));
          overflow: hidden;
          background-color: var(--void, #050505);
          transition: border-color 0.2s;
        }
        .clip-item.selected .clip-thumb {
          border-color: var(--dante, #CE1818);
        }
        .scanline {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.2) 3px,
            rgba(0,0,0,0.2) 3px
          );
          pointer-events: none;
        }
        .status-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          letter-spacing: 0.2em;
          color: #f2f2f2;
          background: rgba(0,0,0,0.6);
        }
        .status-overlay.reject {
          color: var(--vergil, #64AFDB);
        }
        .status-overlay.select {
          color: var(--dante, #CE1818);
        }
        .clip-filename {
          font-size: 10px;
          color: var(--text, #f2f2f2);
        }
        .clip-meta {
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          color: var(--muted, #707070);
        }
        .meta-badge {
          border: 1px solid var(--border, rgba(255,255,255,0.10));
          padding: 1px 4px;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
});

MediaBin.displayName = 'MediaBin';
export default MediaBin;
