import React, { forwardRef } from 'react';

const GlassSurface = forwardRef(({ className = '', children, ...props }, ref) => {
  return (
    <div ref={ref} className={`glass-surface ${className}`} {...props}>
      {/* Subtle background reflection gradient */}
      <div className="glass-reflection" />
      {/* Content wrapper to ensure it sits above reflection but inside glass bounds */}
      <div className="glass-content">
        {children}
      </div>

      <style>{`
        .glass-surface {
          position: relative;
          background: rgba(5, 5, 5, 0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          /* Outer edge and inner edge illusion via multiple box-shadows */
          box-shadow: 
            inset 0 1px 0 rgba(255, 255, 255, 0.18), /* Highlight edge */
            inset 0 -1px 0 rgba(0, 0, 0, 0.35), /* Dark underside */
            inset 0 0 0 1px rgba(255, 255, 255, 0.05), /* Inner border */
            0 0 0 1px rgba(255, 255, 255, 0.12), /* Outer border */
            0 8px 32px rgba(0, 0, 0, 0.6); /* Depth shadow */
          overflow: hidden;
        }

        .glass-reflection {
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
          z-index: 0;
        }

        .glass-content {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
});

GlassSurface.displayName = 'GlassSurface';
export default GlassSurface;
