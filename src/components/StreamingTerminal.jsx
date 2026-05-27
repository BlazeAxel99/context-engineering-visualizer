import React from 'react';
import { Square } from 'lucide-react';

export default function StreamingTerminal({
  terminalOutput,
  terminalStatus,
  streamSpeed,
  setStreamSpeed,
  onStopStreaming,
  terminalEndRef
}) {
  
  // Safe JSX rendering instead of dangerouslySetInnerHTML
  const renderSafeContent = () => {
    if (!terminalOutput) return null;
    
    // If output is the default greeting, just show it
    if (terminalStatus === 'idle' && (terminalOutput.startsWith('Ready.') || terminalOutput.startsWith('Injected'))) {
      return <div className="text-muted">{terminalOutput}</div>;
    }

    const lines = terminalOutput.split('\n');
    return lines.map((line, lineIdx) => {
      // If line is empty, add spacing
      if (line === '') {
        return <div key={lineIdx} style={{ height: '0.8em' }} />;
      }

      // Scanner for **bold**, *italic*, and [Source: doc]
      const regex = /(\*\*.*?\*\*|\*.*?\*|\[Source:.*?\])/g;
      const parts = line.split(regex);

      const elements = parts.map((part, partIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const cleanBold = part.slice(2, -2);
          return <strong key={partIdx} className="text-purple font-semibold">{cleanBold}</strong>;
        } else if (part.startsWith('*') && part.endsWith('*')) {
          const cleanItalic = part.slice(1, -1);
          return <em key={partIdx} className="text-muted" style={{ fontStyle: 'italic' }}>{cleanItalic}</em>;
        } else if (part.startsWith('[Source:') && part.endsWith(']')) {
          const cleanSrc = part.slice(8, -1);
          return (
            <span key={partIdx} className="cite-tag" title="Verified vector document grounding">
              {cleanSrc}
            </span>
          );
        } else {
          return part;
        }
      });

      return (
        <div key={lineIdx} className="terminal-line-item">
          {elements}
        </div>
      );
    });
  };

  return (
    <div className="term-card">
      <div className="card-title-row">
        <div className="term-header-left">
          <span className={`term-dot ${terminalStatus === 'idle' || terminalStatus === 'completed' ? 'idle' : 'active'}`} />
          <span>LLM Terminal - {terminalStatus.toUpperCase()}</span>
        </div>
        
        <div className="term-actions-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {(terminalStatus === 'thinking' || terminalStatus === 'streaming') && (
            <button 
              className="ctrl-btn-stop"
              onClick={onStopStreaming}
              title="Stop streaming response"
            >
              <Square size={10} fill="currentColor" /> Stop
            </button>
          )}
          
          <div className="term-speed">
            <span>Speed:</span>
            <select 
              className="term-select"
              value={streamSpeed}
              onChange={(e) => setStreamSpeed(parseInt(e.target.value))}
            >
              <option value="20">Fast (Normal)</option>
              <option value="5">Turbo</option>
              <option value="50">Realtime</option>
            </select>
          </div>
        </div>
      </div>

      <div className="term-screen">
        <div className="font-mono text-content">
          {renderSafeContent()}
          {(terminalStatus === 'thinking' || terminalStatus === 'streaming') && (
            <span className="term-cursor" />
          )}
        </div>
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}
