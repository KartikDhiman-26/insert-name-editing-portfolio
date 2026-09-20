import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import PersistentAtmosphere from './components/effects/PersistentAtmosphere';
import EditorExperience from './components/EditorExperience';
import PortfolioExperience from './components/PortfolioExperience';

function App() {
  const [view, setView] = useState('editor'); // 'editor', 'transition', 'portfolio'

  const handleTransitionStart = () => {
    setView('transition');
  };

  const handleTransitionComplete = () => {
    setView('portfolio');
  };

  return (
    <>
       <PersistentAtmosphere />
       
       {view !== 'editor' && (
         <div className="portfolio-layer" style={{ position: 'relative', zIndex: 10 }}>
           <PortfolioExperience />
         </div>
       )}

       {view !== 'portfolio' && (
         <div className="editor-layer" style={{ position: view === 'transition' ? 'fixed' : 'relative', inset: 0, zIndex: 50, pointerEvents: view === 'transition' ? 'none' : 'auto' }}>
           <EditorExperience 
             onTransitionStart={handleTransitionStart} 
             isTransitioning={view === 'transition'} 
             onTransitionComplete={handleTransitionComplete}
           />
         </div>
       )}
       
       <style>{`
          .editor-layer {
             width: 100%;
             height: 100%;
          }
          .portfolio-layer {
             width: 100%;
             height: 100%;
          }
       `}</style>
    </>
  );
}

export default App;
