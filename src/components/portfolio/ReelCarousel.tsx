import { useState, useRef, useCallback, useEffect } from 'react';
import gsap from 'gsap';

// Unique color textures per project — layered CSS gradients + radial glows
const TEXTURES = {
  '001': `
    radial-gradient(ellipse at 30% 70%, rgba(206,24,24,0.25) 0%, transparent 60%),
    radial-gradient(ellipse at 70% 30%, rgba(180,40,20,0.15) 0%, transparent 50%),
    linear-gradient(160deg, #0a0404 0%, #120808 40%, #0a0505 100%)
  `,
  '002': `
    radial-gradient(ellipse at 60% 40%, rgba(100,175,219,0.2) 0%, transparent 55%),
    radial-gradient(ellipse at 20% 80%, rgba(40,80,140,0.15) 0%, transparent 50%),
    linear-gradient(200deg, #040608 0%, #08101a 45%, #050809 100%)
  `,
  '003': `
    radial-gradient(ellipse at 50% 60%, rgba(220,140,40,0.18) 0%, transparent 55%),
    radial-gradient(ellipse at 80% 20%, rgba(206,24,24,0.12) 0%, transparent 50%),
    linear-gradient(140deg, #0a0804 0%, #120e06 40%, #0a0805 100%)
  `,
  '004': `
    radial-gradient(ellipse at 40% 50%, rgba(60,200,210,0.2) 0%, transparent 55%),
    radial-gradient(ellipse at 70% 80%, rgba(100,175,219,0.1) 0%, transparent 50%),
    linear-gradient(180deg, #040809 0%, #061012 40%, #040808 100%)
  `,
  '005': `
    radial-gradient(ellipse at 50% 40%, rgba(200,200,200,0.1) 0%, transparent 55%),
    radial-gradient(ellipse at 30% 70%, rgba(140,140,140,0.08) 0%, transparent 50%),
    linear-gradient(160deg, #080808 0%, #0e0e0e 40%, #080808 100%)
  `,
};

// Card positions in the 3D stack
function getCardStyle(offset: number) {
  // offset: 0 = active, -1 = prev, 1 = next, -2 = far prev, 2 = far next
  const clamped = Math.max(-2, Math.min(2, offset));
  const absOff = Math.abs(clamped);

  return {
    x: clamped * 55,
    y: absOff * -18,
    z: absOff === 0 ? 20 : absOff === 1 ? 0 : -20, // Physically pull active card forward to fix bleed
    scale: 1 - absOff * 0.1,
    rotateY: clamped * -6,
    zIndex: 10 - absOff,
    opacity: absOff === 0 ? 1 : absOff === 1 ? 0.55 : 0.25,
    filter: absOff === 0 ? 'blur(0px) brightness(1)' : `blur(${absOff * 2}px) brightness(0.6)`,
  };
}

import { ShortFormWork } from '../../data/portfolio';

export interface ReelCarouselProps {
  projects?: ShortFormWork[];
}

export default function ReelCarousel({ projects = [] }: ReelCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isInView, setIsInView] = useState(false);
  
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const metaRef = useRef<HTMLDivElement | null>(null);

  const active = projects[activeIndex] || {} as ShortFormWork;
  const titleWords = active.title ? active.title.split(' ') : [];

  // Position all cards
  const positionCards = useCallback((animate = true) => {
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const offset = i - activeIndex;
      const style = getCardStyle(offset);

      if (animate) {
        gsap.to(card, {
          x: style.x,
          y: style.y,
          z: style.z,
          scale: style.scale,
          rotateY: style.rotateY,
          opacity: style.opacity,
          filter: style.filter,
          zIndex: style.zIndex,
          duration: 0.65,
          ease: 'power3.out',
        });
      } else {
        gsap.set(card, {
          x: style.x,
          y: style.y,
          z: style.z,
          scale: style.scale,
          rotateY: style.rotateY,
          opacity: style.opacity,
          filter: style.filter,
          zIndex: style.zIndex,
        });
      }
    });
  }, [activeIndex, projects.length]);

  // Initial positioning
  useEffect(() => {
    positionCards(false);
  }, [positionCards]);

  // Intersection Observer for keyboard lock
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, { threshold: 0.3 });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback((newIndex: number) => {
    if (isAnimating || newIndex === activeIndex || newIndex < 0 || newIndex >= projects.length) return;
    setIsAnimating(true);

    // Animate title/meta out
    const tl = gsap.timeline({
      onComplete: () => {
        setActiveIndex(newIndex);
        setIsAnimating(false);
      }
    });

    if (titleRef.current) {
      tl.to(titleRef.current, { y: -15, opacity: 0, duration: 0.3, ease: 'power2.in' }, 0);
    }
    if (metaRef.current) {
      tl.to(metaRef.current, { y: -10, opacity: 0, duration: 0.25, ease: 'power2.in' }, 0.05);
    }
  }, [activeIndex, isAnimating, projects.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isInView) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goTo(activeIndex - 1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goTo(activeIndex + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInView, activeIndex, goTo]);

  // Animate cards + title/meta on index change
  // Also handle video playback & muting logic here
  useEffect(() => {
    positionCards(true);

    // Audio/Video logic
    setIsMuted(true);
    videoRefs.current.forEach((vid, i) => {
      if (vid) {
        vid.muted = true;
        if (i === activeIndex && isInView) {
          vid.play().catch(() => {}); // handle preload="none" policies
        } else {
          vid.pause();
          vid.currentTime = 0;
        }
      }
    });

    // Animate title in
    if (titleRef.current) {
      gsap.fromTo(titleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.1 }
      );
    }
    // Animate meta in
    if (metaRef.current) {
      gsap.fromTo(metaRef.current,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out', delay: 0.15 }
      );
    }
  }, [activeIndex, positionCards, isInView]);

  const handleCardClick = (index: number) => {
    if (index === activeIndex) {
      const vid = videoRefs.current[index];
      if (vid) {
        vid.muted = !vid.muted;
        setIsMuted(vid.muted);
      }
    }
  };

  return (
    <div ref={containerRef} className="rc-root">

      {/* Left: Title */}
      <div ref={titleRef} className="rc-title-area">
        <div className="rc-title-id">PROJECT_{active?.id}</div>
        {titleWords.map((word: string, i: number) => (
          <div key={i} className="rc-title-word">{word}</div>
        ))}
      </div>

      {/* Center: 9:16 Stacked Cards */}
      <div className="rc-stage">
        <div className="rc-cards-wrapper">
          {projects.map((proj, i) => (
            <div
              key={proj.id}
              ref={(el) => { cardsRef.current[i] = el; }}
              className={`rc-card ${i === activeIndex ? 'rc-card-active' : ''}`}
              onClick={() => handleCardClick(i)}
            >
              <div className="rc-card-inner">
                <div className="rc-card-reflection" />
                <div
                  className="rc-card-texture"
                  style={{ background: (TEXTURES as any)[proj.id] || TEXTURES['005'] }}
                >
                  {proj.videoUrl && (
                    <video
                      ref={(el) => { videoRefs.current[i] = el; }}
                      src={proj.videoUrl}
                      preload="none"
                      loop
                      muted
                      playsInline
                      preload={i === activeIndex ? "auto" : "none"}
                      className="rc-card-video"
                    />
                  )}
                  {/* Scanline overlay */}
                  <div className="rc-card-scanlines" />
                  {/* Noise grain overlay */}
                  <div className="rc-card-grain" />
                  {/* Audio visual feedback indicator */}
                  {i === activeIndex && proj.videoUrl && (
                    <div className="rc-audio-indicator">
                      {isMuted ? 'MUTED' : 'SOUND ON'}
                    </div>
                  )}
                  {/* Project ID watermark */}
                  <div className="rc-card-watermark">{proj.id}</div>
                </div>
              </div>
              {/* Subtle blue edge glow for non-active cards */}
              {i !== activeIndex && <div className="rc-card-blue-edge" />}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="rc-nav">
          <button
            className={`rc-nav-btn ${activeIndex === 0 ? 'disabled' : ''}`}
            onClick={() => goTo(activeIndex - 1)}
            disabled={isAnimating || activeIndex === 0}
          >
            <span className="rc-nav-arrow">←</span>
            <span className="rc-nav-text">PREV</span>
          </button>
          <div className="rc-nav-counter">
            <span className="rc-nav-cur">{String(activeIndex + 1).padStart(2, '0')}</span>
            <span className="rc-nav-sep">/</span>
            <span className="rc-nav-tot">{String(projects.length).padStart(2, '0')}</span>
          </div>
          <button
            className={`rc-nav-btn ${activeIndex === projects.length - 1 ? 'disabled' : ''}`}
            onClick={() => goTo(activeIndex + 1)}
            disabled={isAnimating || activeIndex === projects.length - 1}
          >
            <span className="rc-nav-text">NEXT</span>
            <span className="rc-nav-arrow">→</span>
          </button>
        </div>
      </div>

      {/* Right: Metadata */}
      <div ref={metaRef} className="rc-meta-area">
        <div className="rc-meta-block">
          <div className="rc-meta-label">ROLE</div>
          <div className="rc-meta-val">{active?.role}</div>
        </div>
        <div className="rc-meta-block">
          <div className="rc-meta-label">TYPE</div>
          <div className="rc-meta-val">{active?.type}</div>
        </div>
        <div className="rc-meta-block">
          <div className="rc-meta-label">DURATION</div>
          <div className="rc-meta-val">{active?.duration}</div>
        </div>
        <div className="rc-meta-block">
          <div className="rc-meta-label">TOOLS</div>
          <div className="rc-meta-val">{active?.tools}</div>
        </div>
        <div className="rc-meta-block">
          <div className="rc-meta-label">YEAR</div>
          <div className="rc-meta-val">{active?.year}</div>
        </div>
      </div>

      <style>{`
        .rc-root {
          display: grid;
          grid-template-columns: 240px 1fr 200px;
          gap: 32px;
          align-items: center;
          min-height: 520px;
          padding: 0 48px;
        }

        /* ── Title (left) ── */
        .rc-title-area {
          display: flex;
          flex-direction: column;
        }
        .rc-title-id {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.2em;
          color: var(--vergil);
          margin-bottom: 16px;
        }
        .rc-title-word {
          font-family: var(--font-sans);
          font-size: clamp(32px, 4.5vw, 56px);
          letter-spacing: 0.08em;
          color: var(--text);
          font-weight: 300;
          line-height: 1.05;
        }

        /* ── Stage (center) ── */
        .rc-stage {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .rc-cards-wrapper {
          position: relative;
          width: 280px;
          height: 500px;
          perspective: 1200px;
          transform-style: preserve-3d;
        }
        .rc-card {
          position: absolute;
          top: 0;
          left: 0;
          width: 280px;
          height: 500px;
          transform-style: preserve-3d;
          will-change: transform, opacity, filter;
          cursor: default;
        }
        .rc-card-inner {
          width: 100%;
          height: 100%;
          background: rgba(5, 5, 5, 0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 
            inset 0 1px 0 rgba(255, 255, 255, 0.18),
            inset 0 -1px 0 rgba(0, 0, 0, 0.35),
            inset 0 0 0 1px rgba(255, 255, 255, 0.05),
            0 0 0 1px rgba(255, 255, 255, 0.12),
            0 8px 32px rgba(0, 0, 0, 0.6);
          overflow: hidden;
          position: relative;
        }
        .rc-card-reflection {
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
        .rc-card-texture {
          width: 100%;
          height: 100%;
          position: relative;
          z-index: 2;
        }
        .rc-card-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          background-color: #000;
          z-index: 0;
        }
        
        .rc-audio-indicator {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-family: var(--font-mono);
          font-size: 8px;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.8);
          z-index: 10;
          pointer-events: none;
        }
        
        .rc-card-active .rc-card-inner {
          background: #000;
          opacity: 1 !important;
        }
        .rc-card-scanlines {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 2px,
            rgba(0,0,0,0.08) 2px,
            rgba(0,0,0,0.08) 4px
          );
          pointer-events: none;
        }
        .rc-card-grain {
          position: absolute;
          inset: 0;
          opacity: 0.04;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23g)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }
        .rc-card-watermark {
          position: absolute;
          bottom: 16px;
          right: 16px;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.08);
        }
        .rc-card-blue-edge {
          position: absolute;
          inset: -1px;
          border: 1px solid rgba(100,175,219,0.12);
          pointer-events: none;
          box-shadow: inset 0 0 20px rgba(100,175,219,0.04);
        }

        /* ── Navigation ── */
        .rc-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 28px;
          margin-top: 28px;
        }
        .rc-nav-btn {
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--border);
          color: var(--text);
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.12em;
          padding: 10px 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: border-color 0.2s ease, background 0.2s ease;
          pointer-events: auto;
        }
        .rc-nav-btn:hover:not(.disabled) {
          border-color: var(--dante);
          background: rgba(206,24,24,0.04);
        }
        .rc-nav-btn.disabled {
          opacity: 0.2;
          cursor: default;
          pointer-events: none;
        }
        .rc-nav-arrow { font-size: 14px; }
        .rc-nav-counter {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.1em;
          color: var(--muted);
          display: flex;
          gap: 5px;
        }
        .rc-nav-cur { color: var(--text); }
        .rc-nav-sep { color: rgba(255,255,255,0.15); }

        /* ── Metadata (right) ── */
        .rc-meta-area {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }
        .rc-meta-block {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .rc-meta-label {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.2em;
          color: var(--vergil);
        }
        .rc-meta-val {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.1em;
          color: var(--text);
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .rc-root {
            grid-template-columns: 1fr;
            gap: 28px;
            padding: 0 20px;
          }
          .rc-title-area {
            flex-direction: row;
            align-items: baseline;
            gap: 12px;
            flex-wrap: wrap;
          }
          .rc-title-word { font-size: 28px; }
          .rc-cards-wrapper {
            width: 240px;
            height: 427px;
            margin: 0 auto;
          }
          .rc-card {
            width: 240px;
            height: 427px;
          }
          .rc-meta-area {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 16px;
            justify-content: center;
          }
          .rc-meta-block { align-items: center; min-width: 80px; }
        }
      `}</style>
    </div>
  );
}
