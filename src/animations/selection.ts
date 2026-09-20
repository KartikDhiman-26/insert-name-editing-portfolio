import gsap from 'gsap';
import { Clip } from '../data/project';

export interface SelectionRefs {
  cursor: HTMLElement | null;
  clipItems: (HTMLElement | null)[];
  clipThumbs: (HTMLElement | null)[];
  clips: Clip[] | null;
  onReject?: (clipIndex: number) => void;
}

export function createSelectionTimeline(refs: SelectionRefs): gsap.core.Timeline {
  const tl = gsap.timeline();
  
  // const cursorLabel = refs.cursor?.querySelector('.cursor-label') as HTMLElement | null;
  const pointer = refs.cursor?.querySelector('.mouse-pointer') as HTMLElement | null;
  
  if (pointer) {
    tl.set(pointer, { scale: 1 });
  }

  const MOVE_EASE = 'sine.inOut';

  refs.clips?.forEach((clip, i) => {
    const clipEl = refs.clipItems[i];
    // const thumbEl = refs.clipThumbs[i];
    if (!clipEl) return;
    
    if (refs.cursor) {
      tl.to(refs.cursor, {
        x: () => {
          const rect = clipEl.getBoundingClientRect();
          return rect.left + (rect.width * 0.4) + (Math.random() * 20);
        },
        y: () => {
          const rect = clipEl.getBoundingClientRect();
          return rect.top + (rect.height * 0.4) + (Math.random() * 20);
        },
        duration: 0.5 + Math.random() * 0.2,
        ease: MOVE_EASE,
      });
    }
    
    if (pointer) {
      tl.to(pointer, {
        scale: 1.1,
        filter: 'drop-shadow(0px 4px 8px rgba(206,24,24,0.3))',
        duration: 0.15,
      });
    }
    
    tl.to({}, { duration: 0.3 + Math.random() * 0.3 });
    
    if (clip.keep) {
      tl.call(() => { if (pointer) pointer.innerHTML = '+'; });
      if (pointer) {
        tl.to(pointer, { scale: 0.9, filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.5))', duration: 0.05 });
      }
      
      tl.call(() => {
        clipEl.classList.add('selected');
        const overlay = clipEl.querySelector('.status-overlay.select') as HTMLElement | null;
        if (overlay) overlay.style.display = 'flex';
      });

      const selectOverlay = clipEl.querySelector('.status-overlay.select') as HTMLElement | null;
      if (selectOverlay) {
        tl.to(selectOverlay, { opacity: 1, duration: 0.2 });
      }

      if (pointer) {
        tl.to(pointer, { scale: 1.1, filter: 'drop-shadow(0px 4px 8px rgba(206,24,24,0.3))', duration: 0.1 });
      }

    } else {
      tl.call(() => { if (pointer) pointer.innerHTML = '×'; });
      
      if (pointer) {
        tl.to(pointer, { scale: 0.9, filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.5))', duration: 0.05 });
        tl.to(pointer, { scale: 1.1, duration: 0.1 });
      }

      tl.call(() => {
        const overlay = clipEl.querySelector('.status-overlay.reject') as HTMLElement | null;
        if (overlay) overlay.style.display = 'flex';
        refs.onReject?.(i);
      });
      
      const rejectOverlay = clipEl.querySelector('.status-overlay.reject') as HTMLElement | null;
      if (rejectOverlay) {
        tl.to(rejectOverlay, { opacity: 1, duration: 0.2 });
      }
      
      tl.to({}, { duration: 0.5 });
    }
    
    if (pointer) {
      tl.to(pointer, { scale: 1, filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))', duration: 0.15 });
    }

    tl.call(() => { 
      if (pointer) pointer.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 2L18 11.5L11.5 13L9.5 20.5L4 2Z" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinejoin="round"/></svg>'; 
    });
  });
  
  return tl;
}
