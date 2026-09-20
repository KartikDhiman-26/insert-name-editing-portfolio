import gsap from 'gsap';

/**
 * Creates the boot + editor appear timeline
 * @param {Object} refs - DOM element references
 * @param {HTMLElement} refs.bootScreen - the boot/splash screen element
 * @param {HTMLElement} refs.editorShell - the editor shell container
 * @param {NodeList|HTMLElement[]} refs.bootLines - individual boot text lines
 * @param {HTMLElement} refs.panelTopbar - top bar panel
 * @param {HTMLElement} refs.panelMedia - media bin panel  
 * @param {HTMLElement} refs.panelPreview - preview panel
 * @param {HTMLElement} refs.panelInspector - inspector panel
 * @param {HTMLElement} refs.panelTimeline - timeline panel
 * @param {HTMLElement} refs.panelToolbar - toolbar panel
 * @returns {gsap.core.Timeline}
 */
export function createEditorIntro(refs) {
  const tl = gsap.timeline();
  
  // Phase 1: Boot screen
  // Dark screen, then boot text lines appear one by one (typewriter feel)
  
  // Boot sequence setup
  tl.set(refs.editorShell, { opacity: 0 });
  tl.set(refs.bootScreen, { opacity: 1 });
  
  // Boot lines appear
  if (refs.bootLines && refs.bootLines.length > 0) {
    tl.from(refs.bootLines, {
      opacity: 0,
      y: 10,
      duration: 0.3,
      stagger: 0.15,
      ease: 'power2.out',
    }, 0.5);
    
    // System initializing... pulse
    tl.to(refs.bootLines[refs.bootLines.length - 1], {
      opacity: 0.3,
      duration: 0.4,
      repeat: 2,
      yoyo: true,
    });
  }
  
  // Boot screen out
  tl.to(refs.bootScreen, {
    opacity: 0,
    duration: 0.6,
    ease: 'power2.inOut',
  });
  
  // Phase 2: Editor assembly
  // Editor shell in
  tl.to(refs.editorShell, {
    opacity: 1,
    duration: 0.4,
  });
  
  // Panels assemble with staggered choreography
  const panels = [
    { el: refs.panelTopbar, from: { y: -40, opacity: 0 } },
    { el: refs.panelPreview, from: { scale: 0.95, opacity: 0 } },
    { el: refs.panelMedia, from: { x: -60, opacity: 0 } },
    { el: refs.panelInspector, from: { x: 60, opacity: 0 } },
    { el: refs.panelTimeline, from: { y: 60, opacity: 0 } },
    { el: refs.panelToolbar, from: { y: 20, opacity: 0 } },
  ];
  
  panels.forEach((panel, i) => {
    if (panel.el) {
      tl.from(panel.el, {
        ...panel.from,
        duration: 0.5,
        ease: 'power3.out',
      }, `-=0.3`);
    }
  });
  
  return tl;
}
