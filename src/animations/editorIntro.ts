import gsap from 'gsap';

export interface EditorIntroRefs {
  bootScreen: HTMLElement | null;
  editorShell: HTMLElement | null;
  bootLines: HTMLElement[] | null;
  panelTopbar: HTMLElement | null;
  panelMedia: HTMLElement | null;
  panelPreview: HTMLElement | null;
  panelInspector: HTMLElement | null;
  panelTimeline: HTMLElement | null;
  panelToolbar: HTMLElement | null;
}

export function createEditorIntro(refs: EditorIntroRefs): gsap.core.Timeline {
  const tl = gsap.timeline();
  
  if (refs.editorShell) tl.set(refs.editorShell, { opacity: 0 });
  if (refs.bootScreen) tl.set(refs.bootScreen, { opacity: 1 });
  
  if (refs.bootLines && refs.bootLines.length > 0) {
    tl.from(refs.bootLines, {
      opacity: 0,
      y: 10,
      duration: 0.3,
      stagger: 0.15,
      ease: 'power2.out',
    }, 0.5);
    
    tl.to(refs.bootLines[refs.bootLines.length - 1], {
      opacity: 0.3,
      duration: 0.4,
      repeat: 2,
      yoyo: true,
    });
  }
  
  if (refs.bootScreen) {
    tl.to(refs.bootScreen, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
    });
  }
  
  if (refs.editorShell) {
    tl.to(refs.editorShell, {
      opacity: 1,
      duration: 0.4,
    });
  }
  
  const panels = [
    { el: refs.panelTopbar, from: { y: -40, opacity: 0 } },
    { el: refs.panelPreview, from: { scale: 0.95, opacity: 0 } },
    { el: refs.panelMedia, from: { x: -60, opacity: 0 } },
    { el: refs.panelInspector, from: { x: 60, opacity: 0 } },
    { el: refs.panelTimeline, from: { y: 60, opacity: 0 } },
    { el: refs.panelToolbar, from: { y: 20, opacity: 0 } },
  ];
  
  panels.forEach((panel) => {
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
