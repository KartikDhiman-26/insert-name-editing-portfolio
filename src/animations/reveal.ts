import gsap from 'gsap';

export interface RevealRefs {
  previewMonitor: HTMLElement | null;
  onGlassPlayReady?: () => void;
}

export function createRevealTimeline(refs: RevealRefs): gsap.core.Timeline {
  const tl = gsap.timeline();
  
  if (refs.previewMonitor) {
    tl.to(refs.previewMonitor, {
      scale: 1.05,
      duration: 1.2,
      ease: 'power2.inOut',
    });
  }
  
  tl.call(() => {
    if (refs.onGlassPlayReady) {
      refs.onGlassPlayReady();
    }
  });
  
  tl.to({}, { duration: 1.0 });
  
  return tl;
}
