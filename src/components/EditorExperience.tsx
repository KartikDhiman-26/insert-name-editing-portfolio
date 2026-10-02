import { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import EditorShell from './editor/EditorShell';
import CustomCursor from '../components/effects/CustomCursor';
import Noise from '../components/effects/Noise';

import { createAssemblyTimeline, createCuttingTimeline, createFinishingTimeline } from '../animations/timeline';

import { CLIPS, Clip } from '../data/project';

gsap.registerPlugin(ScrollTrigger);

export interface EditorExperienceProps {
  onTransitionStart?: () => void;
  isTransitioning?: boolean;
  onTransitionComplete?: () => void;
}

export default function EditorExperience({ onTransitionStart, isTransitioning, onTransitionComplete }: EditorExperienceProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const bootScreenRef = useRef<HTMLDivElement | null>(null);
  const editorShellRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement | null>(null);

  const [clips, setClips] = useState<Clip[]>(CLIPS);
  const [cursorState, setCursorState] = useState<string>('default'); // 'default', 'hover', 'reject'
  const [instruction, setInstruction] = useState<string>('SELECT THE CLIPS');
  const [isPlayReady, setIsPlayReady] = useState<boolean>(false);
  const [editProgress, setEditProgress] = useState<number>(0);

  const handleClipClick = (clipId: string) => {
    setClips((prevClips: Clip[]) => {
      const updatedClips = prevClips.map(c => 
        c.id === clipId ? { ...c, keep: !c.keep } : c
      );
      const clip = updatedClips.find(c => c.id === clipId);
      if (clip) {
        setCursorState(clip.keep ? 'reject' : 'hover');
      }
      setInstruction('ADD TO TIMELINE');
      setEditProgress(15);
      return updatedClips;
    });
  };

  const handleClipEnter = (clipId: string) => {
    const clip = clips.find(c => c.id === clipId);
    if (clip) {
      setCursorState(clip.keep ? 'reject' : 'hover');
    }
  };

  const handleClipLeave = () => {
    setCursorState('default');
  };

  // 1. BOOT SEQUENCE
  useLayoutEffect(() => {
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      const shell = editorShellRef.current;
      const boot = bootScreenRef.current;
      const scrollIndicator = scrollIndicatorRef.current;

      if (!shell || !boot) return;

      const panelTopbar = shell.querySelector('.panel-topbar');
      const panelMedia = shell.querySelector('.panel-media');
      const panelPreview = shell.querySelector('.panel-preview');
      const panelInspector = shell.querySelector('.panel-inspector');
      const panelTimeline = shell.querySelector('.panel-timeline');
      const panelToolbar = shell.querySelector('.panel-toolbar');
      const cursor = cursorRef.current;

      // Initial States
      gsap.set(shell, { opacity: 0 });
      gsap.set(boot, { opacity: 1 });
      if (cursor) gsap.set(cursor, { opacity: 1 }); // Just show it immediately as user moves mouse
      if (scrollIndicator) gsap.set(scrollIndicator, { opacity: 0 });

      if (panelTopbar) gsap.set(panelTopbar, { y: -40, opacity: 0 });
      if (panelPreview) gsap.set(panelPreview, { scale: 0.95, opacity: 0 });
      if (panelMedia) gsap.set(panelMedia, { x: -60, opacity: 0 });
      if (panelInspector) gsap.set(panelInspector, { x: 60, opacity: 0 });
      if (panelTimeline) gsap.set(panelTimeline, { y: 60, opacity: 0 });
      if (panelToolbar) gsap.set(panelToolbar, { y: 20, opacity: 0 });

      const bootTl = gsap.timeline({
        delay: 0.2,
        onComplete: () => {
          document.body.style.overflow = '';
          gsap.set(boot, { display: 'none' });
          ScrollTrigger.refresh(true);
        },
      });

      const loaderText = boot.querySelector('.loader-text');
      if (loaderText) {
        bootTl.to(loaderText, { opacity: 0.4, duration: 0.8, repeat: 3, yoyo: true, ease: 'sine.inOut' });
      }

      bootTl.to({}, { duration: 0.5 });
      bootTl.add(() => { gsap.killTweensOf(boot); });
      bootTl.to(boot, { opacity: 0, duration: 0.5, ease: 'power2.inOut' });
      bootTl.to(shell, { opacity: 1, duration: 0.3 }, '-=0.2');

      if (panelTopbar) bootTl.to(panelTopbar, { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' });
      if (panelPreview) bootTl.to(panelPreview, { scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out' }, '-=0.3');
      if (panelMedia) bootTl.to(panelMedia, { x: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }, '-=0.35');
      if (panelInspector) bootTl.to(panelInspector, { x: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }, '-=0.35');
      if (panelTimeline) bootTl.to(panelTimeline, { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }, '-=0.3');
      if (panelToolbar) bootTl.to(panelToolbar, { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' }, '-=0.25');

      if (scrollIndicator) {
        bootTl.to(scrollIndicator, { opacity: 1, duration: 0.4 }, '-=0.1');
      }
    });

    return () => {
      document.body.style.overflow = '';
      ctx.revert();
    };
  }, []); // Run ONCE

  // 2. SCROLL SEQUENCE (Rebuilds when clips state changes)
  useLayoutEffect(() => {
    const shell = editorShellRef.current;
    if (!shell) return;

    const ctx = gsap.context(() => {
      const scrollIndicator = scrollIndicatorRef.current;
      const timelineClips = Array.from(shell.querySelectorAll<HTMLElement>('.timeline-clip'));
      const timelineTracks = shell.querySelector<HTMLElement>('.timeline-tracks');
      const playhead = shell.querySelector<HTMLElement>('.playhead');
      const audioTrack = shell.querySelector<HTMLElement>('.audio-track');
      const previewContent = shell.querySelector<HTMLElement>('.monitor-content');
      const finishLabels = Array.from(shell.querySelectorAll<HTMLElement>('.finishing .label'));
      
      const clipItems = Array.from(shell.querySelectorAll<HTMLElement>('.clip-item'));

      // Dynamically get the kept clips based on current state
      const keptIndices: number[] = [];
      clips.forEach((clip, i) => { if (clip.keep) keptIndices.push(i); });
      const keptClipItems = keptIndices.map(i => clipItems[i]).filter(Boolean);

      gsap.set(timelineClips, { opacity: 0, scaleX: 0.5 });

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: scrollContainerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
          onUpdate: (self) => {
            const pct = Math.floor(self.progress * 100);
            if (pct === 0) setInstruction('SCROLL TO CONTINUE');
            else if (pct > 0 && pct < 100) setInstruction('FINALIZING EDIT');
            else if (pct === 100) setInstruction('EDIT COMPLETE\nCLICK PLAY TO VIEW');
            
            // Map timeline progress (0-100) to the remaining 15-100% of the bar
            setEditProgress(15 + Math.floor(self.progress * 85));
          }
        },
      });

      const importTl = gsap.timeline();
      if (scrollIndicator) {
        importTl.to(scrollIndicator, { opacity: 0, duration: 0.2 });
      }
      master.add(importTl);

      // ASSEMBLE
      const assemblyTl = createAssemblyTimeline({
        keptClipItems,
        timelineClips,
        timelineTracks,
      });
      master.add(assemblyTl);

      // CUT
      const cuttingTl = createCuttingTimeline({
        cursor: cursorRef.current,
        timelineClips,
        playhead,
      });
      master.add(cuttingTl);

      // FINISH
      const finishTl = createFinishingTimeline({
        previewContent,
        audioTrack,
        finishLabels,
      });
      master.add(finishTl);

      // READY
      const readyTl = gsap.timeline();
      readyTl.to({}, { duration: 0.5 }); // brief pause
      readyTl.call(() => {
        setIsPlayReady(true);
      });
      // We DO NOT add revealTl here. It is triggered by the manual PLAY button click.
    }, scrollContainerRef);

    return () => ctx.revert();
  }, [clips]); // Rebuild timeline when user adds/removes clips!

  // ── WHITE FLASH TRANSITION ──
  useLayoutEffect(() => {
    if (!isTransitioning) return;
    
    // Disable ONLY the scroll triggers belonging to the Editor so it doesn't rewind when window scrolls to 0
    ScrollTrigger.getAll().forEach(st => {
      if (scrollContainerRef.current && st.trigger && (st.trigger === scrollContainerRef.current || scrollContainerRef.current.contains(st.trigger))) {
        st.disable();
      }
    });

    const shell = editorShellRef.current;
    if (!shell) {
      if (onTransitionComplete) onTransitionComplete();
      return;
    }
    
    // Create the white flash overlay
    const flashOverlay = document.createElement('div');
    flashOverlay.style.position = 'fixed';
    flashOverlay.style.inset = '0';
    flashOverlay.style.backgroundColor = '#ffffff';
    flashOverlay.style.opacity = '0';
    flashOverlay.style.zIndex = '999999';
    flashOverlay.style.pointerEvents = 'none';
    document.body.appendChild(flashOverlay);

    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out white flash
        gsap.to(flashOverlay, {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.inOut',
          onComplete: () => {
            if (flashOverlay.parentNode) flashOverlay.parentNode.removeChild(flashOverlay);
          }
        });
      }
    });

    // 1. Flash to white (fast)
    tl.to(flashOverlay, {
      opacity: 1,
      duration: 0.25,
      ease: 'power2.in',
    });

    // 2. While covered in white, trigger complete so React unmounts Editor and shows Portfolio
    tl.call(() => {
      if (onTransitionComplete) onTransitionComplete();
    });
    
    // 3. Hold slightly to ensure Portfolio renders before fade out starts
    tl.to({}, { duration: 0.1 });

  }, [isTransitioning, onTransitionComplete]);

  const handlePlayClick = () => {
    if (isTransitioning) return; // Lock the transition
    
    // Disable ONLY the scroll triggers belonging to the Editor
    ScrollTrigger.getAll().forEach(st => {
      if (scrollContainerRef.current && st.trigger && (st.trigger === scrollContainerRef.current || scrollContainerRef.current.contains(st.trigger))) {
        st.disable();
      }
    });
    
    if (onTransitionStart) onTransitionStart();
  };

  return (
    <>
      <Noise />
      <CustomCursor ref={cursorRef} mode="user" cursorState={cursorState} />

      <div ref={scrollContainerRef} className="scroll-container">
        <div className="pinned-viewport">

          {/* Minimal Loading Screen */}
          <div ref={bootScreenRef} className="boot-screen loader-screen">
            <div className="loader-text">PREPARING THE EDITOR</div>
          </div>

          {/* Editor Shell */}
      <EditorShell 
        ref={editorShellRef} 
        phase="boot" 
        clips={clips} 
        onClipClick={handleClipClick}
        onClipEnter={handleClipEnter}
        onClipLeave={handleClipLeave}
        onPlayClick={handlePlayClick}
        instruction={instruction}
        isPlayReady={isPlayReady}
        editProgress={editProgress}
      />

          {/* Scroll Indicator */}
          <div ref={scrollIndicatorRef} className="scroll-indicator">
            <div className="scroll-label">SCROLL TO EDIT</div>
            <div className="scroll-arrow">
              <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
                <path d="M8 0V20M8 20L1 13M8 20L15 13" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .scroll-container {
          position: relative;
          width: 100%;
          height: 800vh;
        }

        .pinned-viewport {
          position: sticky;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          height: 100dvh;
          overflow: hidden;
        }

        .boot-screen {
          position: fixed;
          inset: 0;
          background: #000;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          color: var(--text);
        }
        
        .countdown-screen {
          background: #030303;
          overflow: hidden;
        }

        .loader-text {
          font-family: var(--font-sans, sans-serif);
          font-size: clamp(24px, 5vw, 48px);
          font-weight: 300;
          letter-spacing: 0.15em;
          color: var(--text);
          text-transform: uppercase;
        }

        .editor-shell {
          position: absolute;
          inset: 0;
          z-index: 50;
        }

        /* ── Scroll Indicator ── */
        .scroll-indicator {
          position: absolute;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 60;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0;
          animation: scrollBounce 1.5s ease-in-out infinite;
        }

        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }

        .scroll-label {
          font-family: var(--font-mono, monospace);
          font-size: 9px;
          letter-spacing: 0.2em;
          color: var(--muted);
        }

        .scroll-arrow {
          color: var(--muted);
        }

        .end-line.editor-name {
          font-size: 16px;
          letter-spacing: 0.15em;
          color: var(--text);
          margin-bottom: 32px;
        }

        .end-line.roles {
          font-size: 11px;
          letter-spacing: 0.15em;
          color: var(--muted);
          margin-bottom: 6px;
        }

        .end-line.spacer-line {
          height: 1px;
          width: 40px;
          background: var(--border);
          margin: 16px 0;
          opacity: 1;
        }

        @media (max-width: 768px) {
          .scroll-container { height: 500vh; }
          .boot-line.brand { font-size: 14px; }
          .end-line.project-name { font-size: 16px; }
        }
      `}</style>
    </>
  );
}
