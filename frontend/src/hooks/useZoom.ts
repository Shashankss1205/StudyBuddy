import { useState } from 'react';

export const useZoom = () => {
  const [zoomLevel, setZoomLevel] = useState(1);

  // Handle zoom in/out
  const handleZoom = (direction: 'in' | 'out') => {
    if (direction === 'in') {
      setZoomLevel(prev => Math.min(prev + 0.25, 3));
    } else {
      setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
    }
    
    // Force layout recalculation after zoom to ensure scrollbars update correctly
    setTimeout(() => {
      const scrollContainers = document.querySelectorAll('.pdf-scroll-container');
      scrollContainers.forEach(container => {
        if (container instanceof HTMLElement) {
          // Trigger a reflow
          container.style.overflow = 'hidden';
          setTimeout(() => {
            container.style.overflow = 'auto';
          }, 0);
        }
      });
    }, 50);
  };

  return {
    zoomLevel,
    setZoomLevel,
    handleZoom
  };
}; 