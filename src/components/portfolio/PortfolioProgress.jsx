import React, { useState, useEffect } from 'react';

const SECTIONS = [
  { id: 'intro', label: 'INTRO', index: '01' },
  { id: 'work', label: 'WORK', index: '02' },
  { id: 'longform', label: 'LONG FORM', index: '03' },
  { id: 'about', label: 'ABOUT', index: '04' },
  { id: 'contact', label: 'CONTACT', index: '05' },
];

export default function PortfolioProgress({ activeSection = 'intro', scrollProgress = 0 }) {
  const activeIdx = SECTIONS.findIndex(s => s.id === activeSection);
  const fillPercent = Math.max(0, Math.min(100, scrollProgress * 100));

  return (
    <div className="pf-progress">
      <div className="pf-progress-sections">
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            className={`pf-progress-section ${i === activeIdx ? 'active' : ''} ${i < activeIdx ? 'past' : ''}`}
          >
            <span className="pf-progress-index">{s.index}</span>
            <span className="pf-progress-label">{s.label}</span>
          </button>
        ))}
      </div>

      <div className="pf-progress-track">
        <div className="pf-progress-fill" style={{ width: `${fillPercent}%` }} />
        <div className="pf-progress-playhead" style={{ left: `${fillPercent}%` }} />
      </div>

      <style>{`
        .pf-progress {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 16px 40px 20px;
          background: linear-gradient(to top, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.6) 60%, transparent 100%);
          pointer-events: none;
        }
        .pf-progress-sections {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          pointer-events: auto;
        }
        .pf-progress-section {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 0;
          opacity: 0.35;
          transition: opacity 0.3s ease;
        }
        .pf-progress-section:hover {
          opacity: 0.7;
        }
        .pf-progress-section.active {
          opacity: 1;
        }
        .pf-progress-section.past {
          opacity: 0.5;
        }
        .pf-progress-index {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.1em;
          color: var(--vergil);
        }
        .pf-progress-label {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.15em;
          color: var(--text);
        }
        .pf-progress-section.active .pf-progress-label {
          color: var(--text);
        }
        .pf-progress-track {
          width: 100%;
          height: 1px;
          background: rgba(255,255,255,0.08);
          position: relative;
        }
        .pf-progress-fill {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background: var(--dante);
          transition: width 0.15s ease-out;
        }
        .pf-progress-playhead {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--dante);
          box-shadow: 0 0 8px rgba(206,24,24,0.4);
          transition: left 0.15s ease-out;
        }

        @media (max-width: 768px) {
          .pf-progress {
            padding: 12px 20px 16px;
          }
          .pf-progress-label {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
