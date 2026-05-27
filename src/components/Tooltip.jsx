import React, { useRef, useState, useEffect } from 'react';

export default function Tooltip({ hoveredToken, tooltipPos }) {
  const tooltipRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!tooltipRef.current || !hoveredToken) return;
    
    const rect = tooltipRef.current.getBoundingClientRect();
    const tooltipWidth = rect.width || 250;
    const tooltipHeight = rect.height || 100;

    let x = tooltipPos.x;
    let y = tooltipPos.y;

    // Guard viewport boundaries (right and bottom edges)
    if (x + tooltipWidth > window.innerWidth - 20) {
      x = window.innerWidth - tooltipWidth - 20;
    }
    if (y + tooltipHeight > window.innerHeight - 20) {
      y = window.innerHeight - tooltipHeight - 20;
    }
    
    // Safeguard negative values (left and top edges)
    x = Math.max(10, x);
    y = Math.max(10, y);

    setCoords({ x, y });
  }, [tooltipPos, hoveredToken]);

  if (!hoveredToken) return null;

  return (
    <div 
      ref={tooltipRef}
      className="floating-tooltip animate-fade-in"
      style={{ 
        left: coords.x, 
        top: coords.y, 
        position: 'fixed', 
        zIndex: 1000,
        pointerEvents: 'none'
      }}
    >
      <div className="tooltip-idx">Token #{hoveredToken.index}</div>
      <div className="tooltip-txt">"{hoveredToken.word}"</div>
      <div className="tooltip-seg">{hoveredToken.label}</div>
    </div>
  );
}
