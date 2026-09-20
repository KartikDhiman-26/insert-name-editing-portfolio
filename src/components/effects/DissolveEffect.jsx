import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const DissolveEffect = ({ targetRef, color, onComplete, trigger }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!trigger || !targetRef?.current || !containerRef.current) return;
    
    const target = targetRef.current;
    const rect = target.getBoundingClientRect();
    const cols = 8;
    const rows = 6;
    const fragWidth = rect.width / cols;
    const fragHeight = rect.height / rows;
    
    const container = containerRef.current;
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = rect.width + 'px';
    container.style.height = rect.height + 'px';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '10';
    
    const fragments = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const frag = document.createElement('div');
        frag.style.position = 'absolute';
        frag.style.left = (c * fragWidth) + 'px';
        frag.style.top = (r * fragHeight) + 'px';
        frag.style.width = fragWidth + 'px';
        frag.style.height = fragHeight + 'px';
        frag.style.background = color || 'var(--surface, #101010)';
        frag.style.opacity = '1';
        container.appendChild(frag);
        fragments.push(frag);
      }
    }
    
    // Hide original
    gsap.set(target, { opacity: 0 });
    
    // Animate fragments
    gsap.to(fragments, {
      opacity: 0,
      scale: 0.3,
      x: () => gsap.utils.random(-60, 60),
      y: () => gsap.utils.random(-40, 40),
      rotation: () => gsap.utils.random(-90, 90),
      duration: 0.8,
      ease: 'power2.in',
      stagger: {
        amount: 0.3,
        from: 'random',
      },
      onComplete: () => {
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
        onComplete?.();
      },
    });
  }, [trigger, targetRef, color, onComplete]);
  
  return (
    <div 
      ref={containerRef} 
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} 
      className="dissolve-container"
    />
  );
};

export default DissolveEffect;
