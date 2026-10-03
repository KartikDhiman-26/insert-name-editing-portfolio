import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { LongFormWork } from '../../data/portfolio';

export interface LongFormReelProps {
  projects?: LongFormWork[];
}

export default function LongFormReel({ projects = [] }: LongFormReelProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [infoIndex, setInfoIndex] = useState(0); // Track info separately to update mid-transition
  const [isAnimating, setIsAnimating] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Toggle mute on click
  const handleVideoClick = (index: number) => {
    if (index === activeIndex) {
      const vid = videoRefs.current[index];
      if (vid) {
        vid.muted = !vid.muted;
        setIsMuted(vid.muted);
      }
    }
  };

  const animateTransition = useCallback((fromIndex: number, toIndex: number, direction: number) => {
    const ctx = gsap.context(() => {
      const currentReel = document.querySelector(`.reel-item-${fromIndex} .cinema-strip`);
      const nextReel = document.querySelector(`.reel-item-${toIndex} .cinema-strip`);
      const infoContainer = document.querySelector('.shared-info-section');
      
      const tl = gsap.timeline({
        onComplete: () => {
          setActiveIndex(toIndex);
          setIsAnimating(false);
          gsap.set([currentReel, nextReel, infoContainer], { clearProps: 'all' });
        }
      });

      // Animate out current reel and info
      tl.to(currentReel, {
        rotation: direction > 0 ? -12 : 12,
        x: direction > 0 ? -180 : 180,
        scale: 0.85,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.in'
      }, 0);
      
      tl.to(infoContainer, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          // Update the info content while it's hidden
          setInfoIndex(toIndex);
        }
      }, 0);

      // Setup next reel
      gsap.set(`.reel-item-${toIndex}`, { zIndex: 10, opacity: 1 });
      gsap.set(`.reel-item-${fromIndex}`, { zIndex: 1 });
      gsap.set(nextReel, {
        rotation: direction > 0 ? 10 : -10,
        x: direction > 0 ? 180 : -180,
        scale: 0.85,
        opacity: 0
      });

      // Animate in next reel
      tl.to(nextReel, {
        rotation: 0,
        x: 0,
        scale: 1,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out'
      }, 0.3);
      
      // Animate in new info
      tl.fromTo(infoContainer, 
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        }, 0.5);

    }, containerRef);

    return () => ctx.revert();
  }, [containerRef]);

  const handleNext = useCallback(() => {
    if (isAnimating || projects.length <= 1) return;
    setIsAnimating(true);
    
    const nextIndex = (activeIndex + 1) % projects.length;
    animateTransition(activeIndex, nextIndex, 1);
  }, [activeIndex, isAnimating, projects.length, animateTransition]);

  const handlePrev = useCallback(() => {
    if (isAnimating || projects.length <= 1) return;
    setIsAnimating(true);
    
    const prevIndex = (activeIndex - 1 + projects.length) % projects.length;
    animateTransition(activeIndex, prevIndex, -1);
  }, [activeIndex, isAnimating, projects.length, animateTransition]);

  // Intersection Observer for keyboard lock
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, { threshold: 0.3 });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isInView) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInView, handleNext, handlePrev]);

  // Audio/Video logic
  useEffect(() => {
    setIsMuted(true);
    videoRefs.current.forEach((vid, i) => {
      if (vid) {
        vid.muted = true;
        if (i === activeIndex && isInView) {
          vid.play().catch(() => {});
        } else {
          vid.pause();
          vid.currentTime = 0;
        }
      }
    });
  }, [activeIndex, isInView]);



  if (!projects || projects.length === 0) {
    return <div style={{ color: 'var(--muted)', textAlign: 'center', padding: '4rem' }}>No projects available.</div>;
  }

  const getPlaceholderStyle = (id: string) => {
    if (id === 'LF_001') {
      return { background: 'radial-gradient(circle at center, #3a1c0d 0%, #1a0a05 100%)' };
    }
    if (id === 'LF_002') {
      return { background: 'radial-gradient(circle at center, #0a1f24 0%, #050d12 100%)' };
    }
    if (id === 'LF_003') {
      return { background: 'radial-gradient(circle at center, #2e0808 0%, #120202 100%)' };
    }
    // Default fallback
    return { background: 'radial-gradient(circle at center, #1a1a1a 0%, #050505 100%)' };
  };

  // Generate an array of 20 perforations for the side strips
  const perforations = Array.from({ length: 20 }).map((_, i) => i);

  return (
    <div className="long-form-reel-container" ref={containerRef}>
      <style>{`
        .long-form-reel-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          min-height: 800px;
          overflow: hidden;
        }

        .reel-stack {
          position: relative;
          width: 100%;
          max-width: 900px;
          display: flex;
          justify-content: center;
        }

        .reel-item {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .media-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          width: 100%;
          position: relative;
        }

        .reels-container {
          position: relative;
          width: 100%;
          max-width: 828px;
          height: 480px; /* Adjust based on cinema-strip height */
          display: flex;
          justify-content: center;
          perspective: 1000px;
        }

        .nav-btn-side {
          background: rgba(10, 10, 10, 0.4);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
          color: var(--muted, #707070);
          font-family: monospace;
          font-size: 13px;
          letter-spacing: 0.15em;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 2px;
        }
        .nav-btn-side.prev:hover {
          color: var(--vergil, #64AFDB);
          border-color: rgba(100, 175, 219, 0.3);
          background: rgba(100, 175, 219, 0.05);
        }
        .nav-btn-side.next:hover {
          color: var(--dante, #CE1818);
          border-color: rgba(206, 24, 24, 0.3);
          background: rgba(206, 24, 24, 0.05);
        }
        .nav-btn-side:disabled {
          opacity: 0.2;
          cursor: not-allowed;
        }

        @media (max-width: 1024px) {
          .media-wrapper {
            gap: 1rem;
          }
        }

        @media (max-width: 768px) {
          .media-wrapper {
            flex-direction: column;
            width: 100%;
            max-width: 100%;
            padding: 0 20px;
            box-sizing: border-box;
          }
          .nav-btn-side {
            padding: 0.5rem;
          }
          .reels-container {
            height: auto;
            aspect-ratio: 16 / 9;
            width: 100%;
            max-width: 100%;
          }
        }

        .reel-item.active {
          position: relative;
          opacity: 1;
          pointer-events: auto;
          z-index: 5;
        }

        .reel-item.inactive {
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
          pointer-events: none;
          z-index: 1;
        }

        .cinema-strip {
          display: flex;
          align-items: stretch;
          background: rgba(5, 5, 5, 0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 
            inset 0 1px 0 rgba(255, 255, 255, 0.18),
            inset 0 -1px 0 rgba(0, 0, 0, 0.35),
            inset 0 0 0 1px rgba(255, 255, 255, 0.05),
            0 0 0 1px rgba(255, 255, 255, 0.12),
            0 8px 32px rgba(0, 0, 0, 0.6);
          padding: 8px 0;
          margin-bottom: 0;
          width: 100%;
          max-width: 828px; /* 780 + 24 + 24 */
          position: relative;
        }
        
        .strip-reflection {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.06) 0%,
            transparent 40%,
            transparent 60%,
            rgba(100, 175, 219, 0.03) 100%
          );
          pointer-events: none;
          z-index: 1;
        }

        .perforation-strip {
          width: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          padding: 4px 0;
        }

        .hole {
          width: 8px;
          height: 8px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.06);
          margin: 6px 0;
        }

        .video-container {
          flex: 1;
          aspect-ratio: 16 / 9;
          max-width: 780px;
          border: 1px solid var(--border);
          position: relative;
          overflow: hidden;
          background: var(--surface);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .video-element {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .placeholder-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: var(--text);
        }

        .placeholder-title {
          font-family: var(--font-sans);
          font-size: 2rem;
          font-weight: 300;
          letter-spacing: 0.1em;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }

        .placeholder-duration {
          font-family: var(--font-mono);
          font-size: 0.875rem;
          color: var(--muted);
        }

        .info-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          margin-top: 1rem;
          min-height: auto;
        }

        .project-title {
          font-family: var(--font-sans);
          font-size: clamp(20px, 4vw, 32px);
          font-weight: 300;
          letter-spacing: 0.1em;
          color: var(--text);
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          text-align: center;
        }

        .metadata-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 1rem;
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .meta-label {
          font-family: var(--font-mono);
          font-size: 9px;
          color: var(--vergil);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .meta-value {
          font-family: var(--font-sans);
          font-size: 11px;
          color: var(--text);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .project-description {
          font-family: var(--font-sans);
          font-size: 11px;
          color: var(--muted);
          max-width: 520px;
          text-align: center;
          line-height: 1.6;
          margin: 0 auto;
        }

        .navigation-controls {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-top: 3rem;
          z-index: 20;
        }

        .nav-btn {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--glass);
          border: 1px solid var(--border);
          color: var(--text);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .nav-btn:hover:not(:disabled) {
          border-color: var(--dante);
        }

        .nav-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .counter {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--muted);
          letter-spacing: 0.1em;
        }

        @media (max-width: 768px) {
          .perforation-strip {
            display: none;
          }
          .cinema-strip {
            padding: 0;
            border-left: none;
            border-right: none;
          }
        }
      `}</style>

      <div className="media-wrapper">
        <button 
          className="nav-btn-side prev" 
          onClick={handlePrev}
          disabled={projects.length <= 1 || isAnimating}
          aria-label="Previous reel"
        >
          PREV
        </button>

        <div className="reels-container">
          {projects.map((project, index) => (
            <div 
              key={project.id} 
              className={`reel-item reel-item-${index} ${index === activeIndex ? 'active' : 'inactive'}`}
            >
              <div className="cinema-strip">
                <div className="strip-reflection"></div>
                <div className="perforation-strip" style={{ position: 'relative', zIndex: 2 }}>
                  {perforations.map(p => <div key={`l-${p}`} className="hole" />)}
                </div>

                <div 
                  className="video-container" 
                  style={{ position: 'relative', zIndex: 2, cursor: 'pointer' }}
                  onClick={() => handleVideoClick(index)}
                >
                  {project.videoUrl ? (
                    <video 
                      ref={(el) => { videoRefs.current[index] = el; }}
                      className="video-element"
                      src={project.videoUrl}
                      preload="none"
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <div className="placeholder-content" style={getPlaceholderStyle(project.id)}>
                      <div className="placeholder-title">{project.title}</div>
                      <div className="placeholder-duration">{project.duration || '00:00'}</div>
                    </div>
                  )}
                </div>

                <div className="perforation-strip" style={{ position: 'relative', zIndex: 2 }}>
                  {perforations.map(p => <div key={`r-${p}`} className="hole" />)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          className="nav-btn-side next" 
          onClick={handleNext}
          disabled={projects.length <= 1 || isAnimating}
          aria-label="Next reel"
        >
          NEXT
        </button>
      </div>

      <div className="shared-info-section info-section">
        <h2 className="project-title">{projects[infoIndex]?.title}</h2>
        
        <div className="metadata-row">
          {projects[infoIndex]?.role && (
            <div className="meta-item">
              <span className="meta-label">Role</span>
              <span className="meta-value">{projects[infoIndex]?.role}</span>
            </div>
          )}
          {projects[infoIndex]?.type && (
            <div className="meta-item">
              <span className="meta-label">Type</span>
              <span className="meta-value">{projects[infoIndex]?.type}</span>
            </div>
          )}
          {projects[infoIndex]?.duration && (
            <div className="meta-item">
              <span className="meta-label">Duration</span>
              <span className="meta-value">{projects[infoIndex]?.duration}</span>
            </div>
          )}
          {projects[infoIndex]?.year && (
            <div className="meta-item">
              <span className="meta-label">Year</span>
              <span className="meta-value">{projects[infoIndex]?.year}</span>
            </div>
          )}
        </div>

        {projects[infoIndex]?.description && (
          <p className="project-description">{projects[infoIndex]?.description}</p>
        )}
      </div>
    </div>
  );
}
