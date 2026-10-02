import { forwardRef, MouseEvent } from 'react';
import TopBar from './TopBar';
import MediaBin from './MediaBin';
import Preview from './Preview';
import Inspector from './Inspector';
import Timeline from './Timeline';
import Toolbar from './Toolbar';
import { CLIPS, PROJECT, TOOLS, Clip, EditPhase } from '../../data/project';

export interface EditorShellProps {
  phase?: EditPhase | string;
  clips?: Clip[];
  onClipClick?: (id: string) => void;
  onClipEnter?: (id: string, e: MouseEvent<HTMLDivElement>) => void;
  onClipLeave?: () => void;
  onPlayClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  instruction?: string;
  isPlayReady?: boolean;
}

const EditorShell = forwardRef<HTMLDivElement, EditorShellProps>(({ phase, clips = CLIPS, onClipClick, onClipEnter, onClipLeave, onPlayClick, instruction, isPlayReady = false }, ref) => {
  const keptClips = clips.filter(c => c.keep);
  
  return (
    <div ref={ref} className="editor-shell">
      <div className="panel-topbar">
        <TopBar phase={phase} />
      </div>
      <div className="panel-media">
        <MediaBin 
          clips={clips} 
          onClipClick={onClipClick} 
          onClipEnter={onClipEnter}
          onClipLeave={onClipLeave}
        />
      </div>
      <div className="panel-preview">
        <Preview phase={phase} instruction={instruction} onPlayClick={onPlayClick} isPlayReady={isPlayReady} />
      </div>
      <div className="panel-inspector">
        <Inspector phase={phase} project={PROJECT} activeClip={keptClips[0]} />
      </div>
      <div className="panel-timeline">
        <Timeline phase={phase} clips={keptClips} timelineClips={keptClips} />
      </div>
      <div className="panel-toolbar">
        <Toolbar activeTool={TOOLS?.[0]?.id?.toUpperCase() || 'SELECT'} />
      </div>

      <style>{`
        .editor-shell {
          width: 100vw;
          height: 100vh;
          height: 100dvh;
          background: transparent;
          position: relative;
          overflow: hidden;
          opacity: 0; /* GSAP will reveal */
          display: grid;
          grid-template-rows: 40px 1fr 240px 44px;
          grid-template-columns: 280px 1fr 260px;
          color: var(--text, #f2f2f2);
        }

        .panel-topbar {
          grid-column: 1 / -1;
          grid-row: 1;
        }
        
        .panel-media {
          grid-column: 1;
          grid-row: 2;
        }
        
        .panel-preview {
          grid-column: 2;
          grid-row: 2;
        }
        
        .panel-inspector {
          grid-column: 3;
          grid-row: 2;
        }
        
        .panel-timeline {
          grid-column: 1 / -1;
          grid-row: 3;
        }
        
        .panel-toolbar {
          grid-column: 1 / -1;
          grid-row: 4;
        }

        @media (max-width: 768px) {
          .editor-shell {
            height: 100vh;
            height: 100dvh;
            grid-template-columns: 1fr;
            grid-template-rows: 40px 120px 1fr 100px 44px;
          }
          .panel-topbar { grid-column: 1; grid-row: 1; }
          .panel-media { grid-column: 1; grid-row: 2; display: block; }
          .panel-preview { grid-column: 1; grid-row: 3; }
          .panel-inspector { display: none; }
          .panel-timeline { grid-column: 1; grid-row: 4; }
          .panel-toolbar { grid-column: 1; grid-row: 5; }
        }
      `}</style>
    </div>
  );
});

EditorShell.displayName = 'EditorShell';
export default EditorShell;
