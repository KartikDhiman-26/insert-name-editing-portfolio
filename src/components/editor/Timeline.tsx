import { forwardRef } from 'react';
import Playhead from './Playhead';
import { Clip, EditPhase } from '../../data/project';

// Simple helper inside the file based on the previous original code
const parseDurationToSeconds = (durationStr: string): number => {
  if (!durationStr) return 0;
  const parts = durationStr.split(':').map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
};

export interface TimelineProps {
  clips?: Clip[];
  timelineClips?: Clip[];
  phase?: EditPhase | string;
}

const Timeline = forwardRef<HTMLDivElement, TimelineProps>(({ timelineClips = [] }, ref) => {
  return (
    <div ref={ref} className="timeline panel-timeline">
      <div className="timeline-header">
        <div className="title">TIMELINE</div>
        <div className="timecode">01:00:00:00</div>
      </div>
      
      <div className="ruler">
        <span>00:00</span>
        <span>00:05</span>
        <span>00:10</span>
        <span>00:15</span>
        <span>00:20</span>
      </div>
      
      <div className="timeline-tracks">
        <Playhead />
        
        <div className="track-container">
          <div className="track-label">V1</div>
          <div className="track">
            {timelineClips.map((clip, index) => {
              const seconds = parseDurationToSeconds(clip.duration);
              const width = Math.max(60, seconds * 0.8);
              return (
                <div 
                  key={`v1-${clip.id}-${index}`}
                  className="timeline-clip"
                  data-clip-id={clip.id}
                  style={{ 
                    background: `${clip.color}40`,
                    borderColor: clip.color,
                    width: `${width}px`,
                    transformOrigin: 'left center', // For shrinking during cuts
                    willChange: 'width, transform'
                  }}
                >
                  <span className="clip-id-label">{clip.id}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="track-container">
          <div className="track-label">A1</div>
          <div className="track audio-track"></div>
        </div>
      </div>

      <style>{`
        .timeline {
          background: rgba(10, 10, 10, 0.35);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-top: 1px solid rgba(255,255,255,0.08);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
          height: 100%;
          display: flex;
          flex-direction: column;
          font-family: monospace;
        }
        .timeline-header {
          display: flex;
          justify-content: space-between;
          padding: 8px 16px;
          border-bottom: 1px solid var(--border, rgba(255,255,255,0.10));
        }
        .title {
          font-size: 10px;
          color: var(--muted, #707070);
          letter-spacing: 0.1em;
        }
        .timecode {
          font-size: 12px;
          color: var(--text, #f2f2f2);
        }
        .ruler {
          display: flex;
          justify-content: space-between;
          padding: 4px 32px 4px 48px;
          font-size: 9px;
          color: var(--muted, #707070);
          border-bottom: 1px solid var(--border, rgba(255,255,255,0.10));
        }
        .timeline-tracks {
          flex: 1;
          position: relative;
          padding: 8px 0;
          overflow-x: auto;
          overflow-y: hidden;
        }
        .track-container {
          display: flex;
          align-items: center;
          margin-bottom: 4px;
          height: 48px;
        }
        .track-label {
          width: 40px;
          text-align: center;
          font-size: 10px;
          color: var(--muted, #707070);
          border-right: 1px solid var(--border, rgba(255,255,255,0.10));
        }
        .track {
          flex: 1;
          height: 40px;
          background: rgba(255,255,255,0.02);
          margin-left: 8px;
          position: relative;
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 0 4px;
        }
        .timeline-clip {
          height: 100%;
          border: 1px solid var(--border, rgba(255,255,255,0.10));
          border-radius: 2px;
          display: flex;
          align-items: center;
          padding: 0 4px;
          overflow: hidden;
          opacity: 0; /* GSAP reveals them */
        }
        .clip-id-label {
          font-size: 9px;
          color: var(--text, #f2f2f2);
        }
      `}</style>
    </div>
  );
});

Timeline.displayName = 'Timeline';
export default Timeline;
