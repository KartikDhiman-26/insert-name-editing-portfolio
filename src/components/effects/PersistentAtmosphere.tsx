import React from 'react';
import DarkVeil from '../DarkVeil';

const PersistentAtmosphere: React.FC = () => {
  return (
    <>
      <style>{`
        .persistent-atmosphere {
          position: fixed;
          inset: 0;
          z-index: 0;
          background-color: #050505;
          overflow: hidden;
          pointer-events: none;
        }

        /* ── Deep Vignette (Frames the light, optional but gives depth) ── */
        .atmo-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse 90% 80% at 50% 50%,
            transparent 40%,
            rgba(5, 5, 5, 0.4) 75%,
            rgba(5, 5, 5, 0.95) 100%
          );
          z-index: 10;
          pointer-events: none;
        }

        /* Ensure DarkVeil container covers viewport and ignores pointers */
        .dark-veil-wrapper {
          position: absolute;
          inset: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
        }
        
        .dark-veil-wrapper canvas {
           width: 100% !important;
           height: 100% !important;
           pointer-events: none;
        }
      `}</style>
      
      <div className="persistent-atmosphere">
        <div className="dark-veil-wrapper">
          <DarkVeil
            hueShift={40}
            noiseIntensity={0}
            scanlineIntensity={0}
            speed={0.5}
            scanlineFrequency={0}
            warpAmount={0}
            resolutionScale={1}
          />
        </div>

        {/* Framing */}
        <div className="atmo-vignette" />
      </div>
    </>
  );
};

export default PersistentAtmosphere;
