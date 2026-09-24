import React from 'react';
import Beams from '../Beams';

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

        /* Ensure Beams container covers viewport and ignores pointers */
        .beams-wrapper {
          position: absolute;
          inset: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
        }
      `}</style>
      
      <div className="persistent-atmosphere">
        <div className="beams-wrapper">
          <Beams
            beamWidth={2}
            beamHeight={15}
            beamNumber={12}
            lightColor="#CE1818"
            speed={2}
            noiseIntensity={1.75}
            scale={0.2}
            rotation={0}
          />
        </div>

        {/* Framing */}
        <div className="atmo-vignette" />
      </div>
    </>
  );
};

export default PersistentAtmosphere;
