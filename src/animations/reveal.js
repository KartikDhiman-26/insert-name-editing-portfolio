import gsap from 'gsap';

export function createRevealTimeline(refs) {
  const tl = gsap.timeline();
  
  // Step 1: The Preview monitor zooms in / becomes prominent
  // Assuming refs.previewContent is passed
  if (refs.previewMonitor) {
    tl.to(refs.previewMonitor, {
      scale: 1.05,
      duration: 1.2,
      ease: 'power2.inOut',
    });
  }
  
  // Step 2: Show the Glassy Play button
  tl.call(() => {
    if (refs.onGlassPlayReady) {
      refs.onGlassPlayReady();
    }
  });
  
  // Hold timeline for a moment
  tl.to({}, { duration: 1.0 });
  
  return tl;
}
