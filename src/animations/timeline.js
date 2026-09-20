import gsap from 'gsap';

export function createAssemblyTimeline(refs) {
  const tl = gsap.timeline();
  
  refs.keptClipItems?.forEach((clipEl, i) => {
    const timelineClip = refs.timelineClips?.[i];
    if (!clipEl || !timelineClip) return;
    
    // Just visually show the clip being "selected" for timeline insertion
    tl.to(clipEl, { opacity: 0.4, scale: 0.95, duration: 0.15 });
    
    // Smooth cinematic entry to timeline slot
    // We animate the timelineClip FROM the bin position TO its natural position (0,0)
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

    // HIGHLIGHT insertion point
    if (refs.timelineTracks) {
      tl.to(refs.timelineTracks, { backgroundColor: 'rgba(255,255,255,0.03)', duration: 0.1 }, "<");
    }

    // DROP & SNAP
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

export function createCuttingTimeline(refs) {
  const tl = gsap.timeline();
  const cursorLabel = refs.cursor?.querySelector('.cursor-label');
  const pointer = refs.cursor?.querySelector('.mouse-pointer');
  
  // Scrub playhead forward initially
  tl.to(refs.playhead, { x: '40%', duration: 0.8, ease: 'power1.inOut' }, 0);
  
    // Cut actions on specific clips
  const cuts = [
    { targetIndex: 0, timeOffset: 0.5 },
    { targetIndex: 1, timeOffset: 1.2 },
    { targetIndex: 2, timeOffset: 2.0 },
  ];
  
  cuts.forEach((cut) => {
    const clip = refs.timelineClips[cut.targetIndex];
    if (!clip) return;
    
    // Action consequence: clip visually shortens, which pulls subsequent clips left automatically due to flex gap
    tl.to(clip, {
      width: () => clip.offsetWidth * 0.7,
      duration: 0.2,
      ease: 'power2.out',
    }, cut.timeOffset + 0.7);
    
    // Subtle red flash on the cut clip
    tl.to(clip, { borderColor: '#CE1818', duration: 0.1 }, cut.timeOffset + 0.7);
    tl.to(clip, { borderColor: 'rgba(255,255,255,0.1)', duration: 0.3 }, cut.timeOffset + 0.8);
  });

  // Final playhead scrub to end
  tl.to(refs.playhead, { x: '100%', duration: 1.0, ease: 'power1.inOut' }, 3.0);
  
  return tl;
}

export function createFinishingTimeline(refs) {
  const tl = gsap.timeline();
  
  // MOTION
  tl.call(() => { refs.finishLabels?.[0]?.classList.add('active'); });
  tl.to(refs.previewContent, {
    scale: 1.05,
    duration: 0.5,
    ease: 'power2.inOut',
    yoyo: true,
    repeat: 1,
  });
  
  // COLOR
  tl.call(() => { refs.finishLabels?.[1]?.classList.add('active'); }, null, "+=0.2");
  tl.to(refs.previewContent, {
    filter: 'saturate(1.3) contrast(1.15) sepia(0.1)',
    duration: 0.6,
    ease: 'power1.inOut',
  });
  
  // SOUND
  tl.call(() => { refs.finishLabels?.[2]?.classList.add('active'); }, null, "+=0.2");
  if (refs.audioTrack) {
    const waveform = refs.audioTrack.querySelector('.waveform');
    if (waveform) {
      tl.to(waveform, { opacity: 0.6, duration: 0.4, ease: 'power2.out' });
    }
  }
  
  tl.to({}, { duration: 0.4 });
  
  return tl;
}
