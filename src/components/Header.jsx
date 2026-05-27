import React from 'react';
import { Layers, Presentation, Columns, Terminal, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Header({
  viewMode,
  setViewMode,
  slideIndex,
  totalSlides,
  prevSlide,
  nextSlide
}) {
  return (
    <header className="app-header">
      <div className="logo-group">
        <div className="logo-icon"><Layers size={22} /></div>
        <div className="logo-text">
          <h1>ABC RAG & Context Sandbox</h1>
          <span>Enterprise Context Engineering & Grounding Simulator</span>
        </div>
      </div>

      <div className="header-actions">
        <div className="view-selector">
          <button 
            className={`selector-btn ${viewMode === 'slides' ? 'active' : ''}`}
            onClick={() => setViewMode('slides')}
          >
            <Presentation size={15} /> Slide-Deck
          </button>
          <button 
            className={`selector-btn ${viewMode === 'split' ? 'active' : ''}`}
            onClick={() => setViewMode('split')}
          >
            <Columns size={15} /> Split View
          </button>
          <button 
            className={`selector-btn ${viewMode === 'demo' ? 'active' : ''}`}
            onClick={() => setViewMode('demo')}
          >
            <Terminal size={15} /> Sandbox Only
          </button>
        </div>

        <div className="slide-nav-bar">
          <button className="slide-nav-btn" onClick={prevSlide} title="Previous Slide (Left Arrow)"><ChevronLeft size={16} /></button>
          <span className="slide-indicator">{slideIndex} / {totalSlides}</span>
          <button className="slide-nav-btn" onClick={nextSlide} title="Next Slide (Right Arrow/Space)"><ChevronRight size={16} /></button>
        </div>
      </div>
    </header>
  );
}
