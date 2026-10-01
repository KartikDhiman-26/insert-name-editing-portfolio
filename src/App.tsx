import { useState, useEffect } from 'react';
import PersistentAtmosphere from './components/effects/PersistentAtmosphere';
import EditorExperience from './components/EditorExperience';
import PortfolioExperience from './components/PortfolioExperience';

type AppView = 'editor' | 'transition' | 'portfolio';

function App() {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(max-width: 768px)').matches;
    }
    return false;
  });

  const [view, setView] = useState<AppView>('editor');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };
    
    // Modern API with fallback
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const handleTransitionStart = () => {
    setView('transition');
  };

  const handleTransitionComplete = () => {
    setView('portfolio');
  };

  // If mobile, bypass the editor and show portfolio directly
  const showPortfolio = isMobile || view !== 'editor';
  const showEditor = !isMobile && view !== 'portfolio';

  return (
    <>
       <PersistentAtmosphere />
       
       {showPortfolio && (
         <div className="portfolio-layer" style={{ position: 'relative', zIndex: 10 }}>
           <PortfolioExperience isDirectEntry={isMobile && view === 'editor'} />
         </div>
       )}

       {showEditor && (
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
