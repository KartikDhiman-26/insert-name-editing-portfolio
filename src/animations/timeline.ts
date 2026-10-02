import gsap from 'gsap';

export interface AssemblyRefs {
  keptClipItems: (HTMLElement | null)[];
  timelineClips: (HTMLElement | null)[];
  timelineTracks: HTMLElement | null;
}

export function createAssemblyTimeline(refs: AssemblyRefs): gsap.core.Timeline {
  const tl = gsap.timeline();
  
  refs.keptClipItems?.forEach((clipEl, i) => {
    const timelineClip = refs.timelineClips?.[i];
    if (!clipEl || !timelineClip) return;
    
    tl.to(clipEl, { opacity: 0.4, scale: 0.95, duration: 0.15 });
    
    tl.fromTo(timelineClip, {
      opacity: 0,
      x: () => {
        const binRect = clipEl.getBoundingClientRect();
        const tlRect = timelineClip.getBoundingClientRect();
        if (!tlRect.width) return 0;
        return binRect.left - tlRect.left;
      },
      y: () => {
        const binRect = clipEl.getBoundingClientRect();
        const tlRect = timelineClip.getBoundingClientRect();
        if (!tlRect.height) return 0;
        return binRect.top - tlRect.top;
      },
      scaleX: () => {
        const binRect = clipEl.getBoundingClientRect();
        const tlRect = timelineClip.getBoundingClientRect();
        return tlRect.width ? binRect.width / tlRect.width : 1;
      },
      scaleY: () => {
        const binRect = clipEl.getBoundingClientRect();
        const tlRect = timelineClip.getBoundingClientRect();
        return tlRect.height ? binRect.height / tlRect.height : 1;
      },
      transformOrigin: 'top left'
    }, {
      opacity: 1,
      x: 0,
      y: 0,
      scaleX: 1.02,
      scaleY: 1.02,
      duration: 0.5,
      ease: 'power2.out',
    });

    if (refs.timelineTracks) {
      tl.to(refs.timelineTracks, { backgroundColor: 'rgba(255,255,255,0.03)', duration: 0.1 }, "<");
    }

    tl.to(timelineClip, {
      scaleX: 1,
      scaleY: 1,
      boxShadow: '0 0 12px rgba(206,24,24,0.4)',
      duration: 0.15,
      ease: 'power2.in',
    });
    
    if (refs.timelineTracks) {
      tl.to(refs.timelineTracks, { backgroundColor: 'transparent', duration: 0.2 });
    }
  });
  
  return tl;
}

export interface CuttingRefs {
  cursor: HTMLElement | null;
  playhead: HTMLElement | null;
  timelineClips: (HTMLElement | null)[];
}

export function createCuttingTimeline(refs: CuttingRefs): gsap.core.Timeline {
  const tl = gsap.timeline();
  
  if (refs.playhead) {
    tl.to(refs.playhead, { x: '40%', duration: 0.8, ease: 'power1.inOut' }, 0);
  }
  
  const cuts = [
    { targetIndex: 0, timeOffset: 0.5 },
    { targetIndex: 1, timeOffset: 1.2 },
    { targetIndex: 2, timeOffset: 2.0 },
  ];
  
  cuts.forEach((cut) => {
    const clip = refs.timelineClips[cut.targetIndex];
    if (!clip) return;
    
    tl.to(clip, {
      width: () => clip.offsetWidth * 0.7,
      duration: 0.2,
      ease: 'power2.out',
    }, cut.timeOffset + 0.7);
    
    tl.to(clip, { borderColor: '#CE1818', duration: 0.1 }, cut.timeOffset + 0.7);
    tl.to(clip, { borderColor: 'rgba(255,255,255,0.1)', duration: 0.3 }, cut.timeOffset + 0.8);
  });

  if (refs.playhead) {
    tl.to(refs.playhead, { x: '100%', duration: 1.0, ease: 'power1.inOut' }, 3.0);
  }
  
  return tl;
}

export interface FinishingRefs {
  finishLabels: (HTMLElement | null)[];
  previewContent: HTMLElement | null;
  audioTrack: HTMLElement | null;
}

export function createFinishingTimeline(refs: FinishingRefs): gsap.core.Timeline {
  const tl = gsap.timeline();
  
  tl.call(() => { refs.finishLabels?.[0]?.classList.add('active'); });
  
  tl.call(() => { refs.finishLabels?.[1]?.classList.add('active'); }, undefined, "+=0.2");
  
  tl.call(() => { refs.finishLabels?.[2]?.classList.add('active'); }, undefined, "+=0.2");
  
  if (refs.audioTrack) {
    const waveform = refs.audioTrack.querySelector('.waveform') as HTMLElement | null;
    if (waveform) {
      tl.to(waveform, { opacity: 0.6, duration: 0.4, ease: 'power2.out' });
    }
  }
  
  tl.to({}, { duration: 0.4 });
  
  return tl;
}
