import gsap from 'gsap';

/**
 * Creates the clip selection/rejection timeline with human-like movement
 * @param {Object} refs
 * @param {HTMLElement} refs.cursor - the choreographed cursor element
 * @param {HTMLElement[]} refs.clipItems - array of 6 clip item elements
 * @param {HTMLElement[]} refs.clipThumbs - array of 6 clip thumbnail elements  
 * @param {Object[]} refs.clips - clip data array with keep/reject info
 * @param {Function} refs.onReject - callback(clipIndex) to trigger grid reflow
 * @returns {gsap.core.Timeline}
 */
export function createSelectionTimeline(refs) {
  const tl = gsap.timeline();
  
  const cursorLabel = refs.cursor?.querySelector('.cursor-label');
  const pointer = refs.cursor?.querySelector('.mouse-pointer');
  
  tl.set(pointer, { scale: 1 });

  // Add human-like pauses between clips
  const MOVE_EASE = 'sine.inOut';

  refs.clips?.forEach((clip, i) => {
    const clipEl = refs.clipItems[i];
    const thumbEl = refs.clipThumbs[i];
    if (!clipEl) return;
    
    // APPROACH: Cursor moves to clip with slight overshoot/variation
    tl.to(refs.cursor, {
      x: () => {
        const rect = clipEl.getBoundingClientRect();
        // Slightly off-center to feel more human
        return rect.left + (rect.width * 0.4) + (Math.random() * 20);
      },
      y: () => {
        const rect = clipEl.getBoundingClientRect();
        return rect.top + (rect.height * 0.4) + (Math.random() * 20);
      },
      duration: 0.5 + Math.random() * 0.2, // Variable speed
      ease: MOVE_EASE,
    });
    
    // HOVER: Slight visual change in cursor
    tl.to(pointer, {
      scale: 1.1,
      filter: 'drop-shadow(0px 4px 8px rgba(206,24,24,0.3))',
      duration: 0.15,
    });
    
    // THINK: Brief inspection pause (human rhythm)
    tl.to({}, { duration: 0.3 + Math.random() * 0.3 });
    
    // ACTION
    if (clip.keep) {
      // SELECT (Click)
      tl.call(() => { if (pointer) pointer.innerHTML = '+'; });
      
      // Click down
      tl.to(pointer, { scale: 0.9, filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.5))', duration: 0.05 });
      
      // UI Response
      tl.call(() => {
        clipEl.classList.add('selected');
        const overlay = clipEl.querySelector('.status-overlay.select');
        if (overlay) overlay.style.display = 'flex';
      });
      tl.to(clipEl.querySelector('.status-overlay.select'), { opacity: 1, duration: 0.2 });

      // Click up
      tl.to(pointer, { scale: 1.1, filter: 'drop-shadow(0px 4px 8px rgba(206,24,24,0.3))', duration: 0.1 });

    } else {
      // REJECT (Click)
      tl.call(() => { if (pointer) pointer.innerHTML = '×'; });
      
      // Click down
      tl.to(pointer, { scale: 0.9, filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.5))', duration: 0.05 });
      
      // Click up
      tl.to(pointer, { scale: 1.1, duration: 0.1 });

      tl.call(() => {
        const overlay = clipEl.querySelector('.status-overlay.reject');
        if (overlay) overlay.style.display = 'flex';
        // Trigger the reflow callback in App.jsx
        refs.onReject?.(i);
      });
      
      tl.to(clipEl.querySelector('.status-overlay.reject'), { opacity: 1, duration: 0.2 });
      
      // Wait for reflow to finish
      tl.to({}, { duration: 0.5 });
    }
    
    // Reset hover state before moving
    tl.to(pointer, { scale: 1, filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))', duration: 0.15 });
    tl.call(() => { 
      if (pointer) pointer.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 2L18 11.5L11.5 13L9.5 20.5L4 2Z" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinejoin="round"/></svg>'; 
    });
  });
  
  return tl;
}
