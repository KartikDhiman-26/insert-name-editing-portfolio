import React from 'react';

const PersistentAtmosphere: React.FC = () => {
  return (
    <>
      <style>{`
        .persistent-atmosphere {
          position: fixed;
          inset: 0;
          z-index: 0;
          background-color: var(--void, #030303);
          overflow: hidden;
          pointer-events: none;
        }

        .ambient-glow {
          position: absolute;
          width: 80vw;
          height: 80vh;
          top: 10vh;
          left: 10vw;
          background: radial-gradient(ellipse at center, rgba(30,40,45,0.15) 0%, rgba(3,3,3,0) 70%);
          filter: blur(80px);
          animation: pulse-glow 20s ease-in-out infinite;
        }
        
        .side-smoke-left {
          position: absolute;
          top: 15%;
          left: -10%;
          width: 40%;
          height: 70%;
          background: radial-gradient(circle at center, rgba(206,24,24,0.015) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(120px);
          will-change: transform;
        }

        .side-smoke-right {
          position: absolute;
          top: 25%;
          right: -10%;
          width: 45%;
          height: 60%;
          background: radial-gradient(circle at center, rgba(100,175,219,0.012) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(130px);
          will-change: transform;
        }

        /* Dante smoke 1 */
        .smoke-1 {
          width: 600px;
          height: 500px;
          background: var(--dante, #CE1818);
          opacity: 0.03;
          top: 10%;
          left: 10%;
          animation: drift-1 35s ease-in-out infinite alternate;
        }

        /* Dante smoke 2 */
        .smoke-2 {
          width: 500px;
          height: 450px;
          background: var(--dante, #CE1818);
          opacity: 0.025;
          bottom: -10%;
          right: 20%;
          animation: drift-2 42s ease-in-out infinite alternate-reverse;
        }

        /* Vergil smoke 3 */
        .smoke-3 {
          width: 700px;
          height: 600px;
          background: var(--vergil, #64AFDB);
          opacity: 0.03;
          top: -15%;
          right: -5%;
          animation: drift-3 38s ease-in-out infinite alternate;
        }

        /* Vergil smoke 4 */
        .smoke-4 {
          width: 450px;
          height: 550px;
          background: var(--vergil, #64AFDB);
          opacity: 0.035;
          bottom: 15%;
          left: -10%;
          animation: drift-4 48s ease-in-out infinite alternate-reverse;
        }

        /* White smoke 5 */
        .smoke-5 {
          width: 550px;
          height: 500px;
          background: #ffffff;
          opacity: 0.02;
          top: 40%;
          left: 30%;
          animation: drift-5 31s ease-in-out infinite alternate;
        }

        /* Technical Architectural Lines */
        .tech-lines {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
          background-size: 150px 150px;
          mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%);
          -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%);
        }

        .tech-lines-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 30px 30px;
          background-position: 0 0;
          mask-image: radial-gradient(circle at 70% 30%, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%);
          -webkit-mask-image: radial-gradient(circle at 70% 30%, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%);
          animation: subtle-drift-dots 60s linear infinite;
          will-change: transform;
        }

        @keyframes subtle-drift-dots {
          0% { transform: translateY(0); }
          100% { transform: translateY(-30px); }
        }

        /* Subtle Horizontal Light Streak */
        .light-streak {
          position: absolute;
          top: 30%;
          left: 50%;
          width: 70vw;
          height: 2px;
          background: #ffffff;
          opacity: 0.015;
          filter: blur(4px);
          transform: translateX(-50%);
          animation: streak-drift 28s ease-in-out infinite alternate;
          will-change: transform;
        }

        /* Noise Overlay */
        .noise-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.025;
          mix-blend-mode: overlay;
        }

        /* Keyframes */
        @keyframes pulse-glow {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.7; }
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
        @media (prefers-reduced-motion: reduce) {
          .ambient-glow, .smoke-layer, .light-streak, .tech-lines-dots {
            animation: none !important;
          }
        }
      `}</style>
      
      <div className="persistent-atmosphere">
        <div className="ambient-glow" />
        <div className="side-smoke-left" />
        <div className="side-smoke-right" />
        
        {/* Background Paths (SVG) */}
        <svg className="bg-paths" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="path-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.02)" />
              <stop offset="50%" stopColor="rgba(100,175,219,0.2)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
            </linearGradient>
            <linearGradient id="path-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.02)" />
              <stop offset="50%" stopColor="rgba(206,24,24,0.2)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
            </linearGradient>
          </defs>
          <path className="technical-path" d="M -100 200 C 500 200, 800 900, 2020 900" stroke="url(#path-grad-1)" />
          <path className="technical-path reverse" d="M -100 800 C 600 800, 1000 300, 2020 300" stroke="url(#path-grad-2)" />
          <path className="technical-path" d="M 2020 600 C 1400 600, 1200 150, 400 150" stroke="rgba(255,255,255,0.08)" />
        </svg>
        <div className="smoke-layer smoke-1" />
        <div className="smoke-layer smoke-2" />
        <div className="smoke-layer smoke-3" />
        <div className="smoke-layer smoke-4" />
        <div className="smoke-layer smoke-5" />
        <div className="tech-lines" />
        <div className="tech-lines-dots" />
        <div className="light-streak" />
        <svg className="noise-overlay" width="100%" height="100%">
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
