import React from 'react';

const PersistentAtmosphere: React.FC = () => {
  return (
    <>
      <style>{`
        .persistent-atmosphere {
          position: fixed;
          inset: 0;
          z-index: 0;
          background-color: #020203;
          overflow: hidden;
          pointer-events: none;
        }

        /* ── Deep Vignette ── */
        .atmo-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse 80% 70% at 50% 50%,
            transparent 30%,
            rgba(0, 0, 0, 0.4) 70%,
            rgba(0, 0, 0, 0.85) 100%
          );
          z-index: 10;
        }

        /* ── Core Ambient Glow (deep blue-grey center) ── */
        .ambient-glow {
          position: absolute;
          width: 90vw;
          height: 90vh;
          top: 5vh;
          left: 5vw;
          background: radial-gradient(ellipse at 45% 45%, rgba(20, 28, 35, 0.12) 0%, transparent 65%);
          filter: blur(100px);
          animation: pulse-glow 24s ease-in-out infinite;
        }

        /* ── Volumetric Haze Layers ── */
        .haze-deep {
          position: absolute;
          inset: -20%;
          background: radial-gradient(
            ellipse at 40% 60%,
            rgba(15, 10, 10, 0.3) 0%,
            rgba(5, 8, 12, 0.15) 40%,
            transparent 70%
          );
          filter: blur(180px);
          animation: haze-breathe 30s ease-in-out infinite alternate;
        }

        .haze-mid {
          position: absolute;
          inset: -10%;
          background: radial-gradient(
            ellipse at 60% 35%,
            rgba(8, 15, 22, 0.2) 0%,
            rgba(3, 3, 5, 0.08) 50%,
            transparent 75%
          );
          filter: blur(140px);
          animation: haze-breathe 22s ease-in-out infinite alternate-reverse;
        }

        @keyframes haze-breathe {
          0% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 0.7; transform: scale(0.97); }
        }

        /* ── Side Smoke (edge atmospheric bleed) ── */
        .side-smoke-left {
          position: absolute;
          top: 10%;
          left: -15%;
          width: 45%;
          height: 80%;
          background: radial-gradient(circle at center, rgba(206,24,24,0.02) 0%, transparent 65%);
          border-radius: 50%;
          filter: blur(140px);
          will-change: transform;
          animation: side-drift-l 40s ease-in-out infinite alternate;
        }

        .side-smoke-right {
          position: absolute;
          top: 20%;
          right: -15%;
          width: 50%;
          height: 70%;
          background: radial-gradient(circle at center, rgba(100,175,219,0.015) 0%, transparent 65%);
          border-radius: 50%;
          filter: blur(150px);
          will-change: transform;
          animation: side-drift-r 36s ease-in-out infinite alternate-reverse;
        }

        @keyframes side-drift-l {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, 20px) scale(1.05); }
        }
        @keyframes side-drift-r {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-25px, 15px) scale(1.03); }
        }

        /* ── Smoke Orbs (shared base) ── */
        .smoke-layer {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          will-change: transform, opacity;
        }

        /* Dante smoke 1 */
        .smoke-1 {
          width: 650px;
          height: 550px;
          background: var(--dante, #CE1818);
          opacity: 0.025;
          top: 8%;
          left: 8%;
          animation: drift-1 38s ease-in-out infinite alternate;
        }

        /* Dante smoke 2 */
        .smoke-2 {
          width: 500px;
          height: 480px;
          background: var(--dante, #CE1818);
          opacity: 0.02;
          bottom: -8%;
          right: 18%;
          animation: drift-2 45s ease-in-out infinite alternate-reverse;
        }

        /* Vergil smoke 3 */
        .smoke-3 {
          width: 750px;
          height: 650px;
          background: var(--vergil, #64AFDB);
          opacity: 0.025;
          top: -12%;
          right: -8%;
          animation: drift-3 40s ease-in-out infinite alternate;
        }

        /* Vergil smoke 4 */
        .smoke-4 {
          width: 480px;
          height: 580px;
          background: var(--vergil, #64AFDB);
          opacity: 0.03;
          bottom: 12%;
          left: -12%;
          animation: drift-4 50s ease-in-out infinite alternate-reverse;
        }

        /* Neutral smoke 5 (warm white) */
        .smoke-5 {
          width: 550px;
          height: 500px;
          background: rgba(200, 180, 160, 1);
          opacity: 0.012;
          top: 38%;
          left: 28%;
          animation: drift-5 34s ease-in-out infinite alternate;
        }

        /* ── Technical Grid Lines ── */
        .tech-lines {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
          background-size: 150px 150px;
          mask-image: radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 75%);
          -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 75%);
        }

        .tech-lines-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px);
          background-size: 30px 30px;
          background-position: 0 0;
          mask-image: radial-gradient(circle at 70% 30%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 55%);
          -webkit-mask-image: radial-gradient(circle at 70% 30%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 55%);
          animation: subtle-drift-dots 60s linear infinite;
          will-change: transform;
        }

        @keyframes subtle-drift-dots {
          0% { transform: translateY(0); }
          100% { transform: translateY(-30px); }
        }

        /* ── Horizontal Light Streaks ── */
        .light-streak {
          position: absolute;
          top: 28%;
          left: 50%;
          width: 75vw;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent);
          filter: blur(2px);
          transform: translateX(-50%);
          animation: streak-drift 28s ease-in-out infinite alternate;
          will-change: transform;
        }

        .light-streak-2 {
          position: absolute;
          top: 65%;
          left: 50%;
          width: 60vw;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(206,24,24,0.03), rgba(100,175,219,0.02), transparent);
          filter: blur(3px);
          transform: translateX(-50%);
          animation: streak-drift-2 35s ease-in-out infinite alternate-reverse;
          will-change: transform;
        }

        /* ── SVG Paths ── */
        .bg-paths {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0.6;
        }
        .technical-path {
          fill: none;
          stroke-width: 0.5;
          opacity: 0.5;
        }

        /* ── Noise Overlay ── */
        .atmo-noise {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          mix-blend-mode: overlay;
        }

        /* ── Keyframes ── */
        @keyframes pulse-glow {
          0% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.65; }
        }
        @keyframes drift-1 {
          0% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(150px, 80px) scale(1.1) rotate(15deg); }
          66% { transform: translate(-50px, 120px) scale(0.9) rotate(-10deg); }
          100% { transform: translate(-100px, -50px) scale(1.05) rotate(5deg); }
        }
        @keyframes drift-2 {
          0% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(-180px, -100px) scale(1.15) rotate(-20deg); }
          66% { transform: translate(-80px, 50px) scale(0.85) rotate(10deg); }
          100% { transform: translate(120px, -80px) scale(1.05) rotate(-5deg); }
        }
        @keyframes drift-3 {
          0% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(-200px, 150px) scale(0.9) rotate(10deg); }
          66% { transform: translate(50px, 200px) scale(1.1) rotate(-15deg); }
          100% { transform: translate(100px, -50px) scale(1) rotate(5deg); }
        }
        @keyframes drift-4 {
          0% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(250px, -150px) scale(1.2) rotate(-15deg); }
          66% { transform: translate(150px, -200px) scale(0.95) rotate(10deg); }
          100% { transform: translate(-50px, 80px) scale(1.05) rotate(-5deg); }
        }
        @keyframes drift-5 {
          0% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(-100px, -120px) scale(1.1) rotate(12deg); }
          66% { transform: translate(150px, 80px) scale(0.9) rotate(-8deg); }
          100% { transform: translate(50px, 150px) scale(1.05) rotate(5deg); }
        }
        @keyframes streak-drift {
          0% { transform: translateX(-60%); }
          100% { transform: translateX(-40%); }
        }
        @keyframes streak-drift-2 {
          0% { transform: translateX(-55%); }
          100% { transform: translateX(-45%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ambient-glow, .smoke-layer, .light-streak, .light-streak-2,
          .tech-lines-dots, .haze-deep, .haze-mid,
          .side-smoke-left, .side-smoke-right {
            animation: none !important;
          }
        }
      `}</style>
      
      <div className="persistent-atmosphere">
        {/* Deep haze layers */}
        <div className="haze-deep" />
        <div className="haze-mid" />

        <div className="ambient-glow" />
        <div className="side-smoke-left" />
        <div className="side-smoke-right" />
        
        {/* Background SVG Paths */}
        <svg className="bg-paths" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="path-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.01)" />
              <stop offset="50%" stopColor="rgba(100,175,219,0.15)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.01)" />
            </linearGradient>
            <linearGradient id="path-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.01)" />
              <stop offset="50%" stopColor="rgba(206,24,24,0.12)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.01)" />
            </linearGradient>
          </defs>
          <path className="technical-path" d="M -100 200 C 500 200, 800 900, 2020 900" stroke="url(#path-grad-1)" />
          <path className="technical-path reverse" d="M -100 800 C 600 800, 1000 300, 2020 300" stroke="url(#path-grad-2)" />
          <path className="technical-path" d="M 2020 600 C 1400 600, 1200 150, 400 150" stroke="rgba(255,255,255,0.05)" />
        </svg>

        {/* Smoke orbs */}
        <div className="smoke-layer smoke-1" />
        <div className="smoke-layer smoke-2" />
        <div className="smoke-layer smoke-3" />
        <div className="smoke-layer smoke-4" />
        <div className="smoke-layer smoke-5" />

        {/* Technical details */}
        <div className="tech-lines" />
        <div className="tech-lines-dots" />
        <div className="light-streak" />
        <div className="light-streak-2" />

        {/* Vignette (on top) */}
        <div className="atmo-vignette" />

        {/* Noise */}
        <svg className="atmo-noise" width="100%" height="100%">
          <filter id="fractal-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.5 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#fractal-noise)" />
        </svg>
      </div>
    </>
  );
};

export default PersistentAtmosphere;
