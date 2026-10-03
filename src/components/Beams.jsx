import { useRef, useEffect } from 'react';

export default function Beams({
  beamWidth = 2,
  beamHeight = 15,
  beamNumber = 12,
  lightColor = "#CE1818",
  speed = 2,
  noiseIntensity = 1.75,
  scale = 0.2,
  rotation = 0
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Hex to RGB for canvas gradient
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '206, 24, 24';
    };
    const rgbStr = hexToRgb(lightColor);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const isMobile = window.innerWidth < 768;
    const actualBeamNumber = isMobile ? Math.min(6, beamNumber) : beamNumber;

    // Initialize randomized architectural beams
    const beams = Array.from({ length: actualBeamNumber }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight * 2 - window.innerHeight,
      // Base dimensions off props
      length: (Math.random() * 0.5 + 0.5) * beamHeight * scale * 500,
      width: (Math.random() * 0.5 + 0.5) * beamWidth * scale * 50,
      speed: (Math.random() * 0.5 + 0.5) * speed * (isMobile ? 1.0 : 1.5),
      opacity: Math.random() * 0.4 + 0.1, // deep, restrained opacity
      phase: Math.random() * Math.PI * 2
    }));

    let time = 0;
    
    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.save();
      
      // Handle rotation from center
      if (rotation !== 0) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
      }

      // Draw beams
      beams.forEach(beam => {
        beam.y -= beam.speed;
        
        // Loop vertically
        if (beam.y < -beam.length * 2) {
          beam.y = canvas.height + beam.length;
          beam.x = Math.random() * canvas.width;
        }

        const currentOpacity = beam.opacity + Math.sin(time + beam.phase) * 0.1;
        
        // Create architectural light gradient
        const gradient = ctx.createLinearGradient(beam.x, beam.y, beam.x, beam.y + beam.length);
        gradient.addColorStop(0, `rgba(${rgbStr}, 0)`);
        gradient.addColorStop(0.5, `rgba(${rgbStr}, ${currentOpacity})`);
        gradient.addColorStop(1, `rgba(${rgbStr}, 0)`);

        if (!isMobile) {
          ctx.shadowColor = `rgba(${rgbStr}, 0.6)`;
          ctx.shadowBlur = 60 * scale;
        }
        ctx.fillStyle = gradient;
        
        ctx.beginPath();
        // Draw soft vertical beam
        ctx.rect(beam.x - beam.width / 2, beam.y, beam.width, beam.length);
        ctx.fill();
      });
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };
    
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [beamWidth, beamHeight, beamNumber, lightColor, speed, noiseIntensity, scale, rotation]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none'
        }}
      />
      {noiseIntensity > 0 && (
        <div 
          className="beams-noise"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: noiseIntensity * 0.03, // subtle film grain
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
      )}
      <style>{`
        @media (max-width: 768px) {
          .beams-noise { display: none !important; }
        }
      `}</style>
    </>
  );
}
