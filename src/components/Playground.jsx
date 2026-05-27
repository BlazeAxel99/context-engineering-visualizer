import React from 'react';
import { Terminal, Zap, Focus, Play } from 'lucide-react';
import VectorSearch from './VectorSearch';
import TokenGrid from './TokenGrid';
import StreamingTerminal from './StreamingTerminal';

export default function Playground({
  activePreset,
  setActivePreset,
  isCaching,
  setIsCaching,
  isAttentionMap,
  setIsAttentionMap,
  promptInput,
  setPromptInput,
  contextInput,
  setContextInput,
  contextTokensCount,
  setContextTokensCount,
  searchQuery,
  setSearchQuery,
  searchResults,
  setSearchResults,
  terminalOutput,
  setTerminalOutput,
  terminalStatus,
  setTerminalStatus,
  streamSpeed,
  setStreamSpeed,
  latStat,
  setLatStat,
  costStat,
  setCostStat,
  groundStat,
  setGroundStat,
  hoveredToken,
  setHoveredToken,
  tooltipPos,
  setTooltipPos,
  triggerSimulation,
  loadPreset,
  injectDocumentIntoContext,
  onHoverToken,
  onLeaveToken,
  onStopStreaming,
  terminalEndRef
}) {
  return (
    <section className="glass-panel playground-panel animate-fade-in">
      <div className="play-header">
        <div className="play-title">
          <Terminal size={18} />
          <h2>Enterprise Grounding Simulator</h2>
        </div>
        
        <div className="play-actions">
          <button 
            className={`ctrl-btn ${isCaching ? 'active-cyan' : ''}`}
            onClick={() => setIsCaching(!isCaching)}
            title="Toggle System Prompt Caching (Simulated)"
          >
            <Zap size={13} /> Caching: {isCaching ? 'ACTIVE' : 'OFF'}
          </button>
          <button 
            className={`ctrl-btn ${isAttentionMap ? 'active-red' : ''}`}
            onClick={() => setIsAttentionMap(!isAttentionMap)}
            title="Toggle Attention Weight Map overlay on Token Grid"
          >
            <Focus size={13} /> Attention Map: {isAttentionMap ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="preset-tabs" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '15px' }}>
        <button 
          className={`tab-btn ${activePreset === 'none' ? 'active' : ''}`}
          onClick={() => loadPreset('none')}
        >
          <span className="tab-btn-idx">01</span>
          <div className="tab-btn-meta">
            <span className="tab-btn-title">Prompt Only</span>
            <span className="tab-btn-desc">No context variables</span>
          </div>
        </button>

        <button 
          className={`tab-btn ${activePreset === 'messy' ? 'active' : ''}`}
          onClick={() => loadPreset('messy')}
        >
          <span className="tab-btn-idx">02</span>
          <div className="tab-btn-meta">
            <span className="tab-btn-title">Messy Context</span>
            <span className="tab-btn-desc">Noisy unranked scrape</span>
          </div>
        </button>

        <button 
          className={`tab-btn ${activePreset === 'ops' ? 'active' : ''}`}
          onClick={() => loadPreset('ops')}
        >
          <span className="tab-btn-idx">03</span>
          <div className="tab-btn-meta">
            <span className="tab-btn-title">Ops Incident</span>
            <span className="tab-btn-desc">Node runbook RAG</span>
          </div>
        </button>

        <button 
          className={`tab-btn ${activePreset === 'auth' ? 'active' : ''}`}
          onClick={() => loadPreset('auth')}
        >
          <span className="tab-btn-idx">04</span>
          <div className="tab-btn-meta">
            <span className="tab-btn-title">API Security</span>
            <span className="tab-btn-desc">OAuth configs</span>
          </div>
        </button>
      </div>

      {/* VECTOR DATABASE SIMULATOR (SEARCH BAR) */}
      <VectorSearch 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        onInject={injectDocumentIntoContext}
      />

      {/* INPUT FIELDS */}
      <div className="inputs-grid">
        <div className="input-block">
          <div className="label-bar label-prompt">
            <span>User Prompt (Instruction)</span>
          </div>
          <textarea 
            className="sandbox-area"
            value={promptInput}
            onChange={(e) => {
              setPromptInput(e.target.value);
              setActivePreset('custom');
            }}
          />
        </div>

        <div className="input-block">
          <div className="label-bar label-context">
            <span>Injected XML Context (Ground Truth)</span>
            <span className="tokens-badge">{contextTokensCount} Tokens</span>
          </div>
          <textarea 
            className="sandbox-area mono"
            placeholder="No context injected. LLM answers from pre-trained generic weights..."
            value={contextInput}
            onChange={(e) => {
              setContextInput(e.target.value);
              const tokenCount = Math.round(e.target.value.length / 4.2);
              setContextTokensCount(tokenCount);
              setActivePreset('custom');
            }}
          />
        </div>
      </div>

      {/* Trigger Play button */}
      <div className="play-btn-row">
        <button 
          className="btn-primary-trigger"
          disabled={terminalStatus === 'thinking' || terminalStatus === 'streaming'}
          onClick={triggerSimulation}
        >
          <Play size={15} /> Stream Grounded LLM Response
        </button>
      </div>

      {/* OUTPUT VISUALS GRID */}
      <div className="outputs-grid">
        
        {/* Token grid visual card */}
        <TokenGrid 
          activePreset={activePreset}
          isCaching={isCaching}
          isAttentionMap={isAttentionMap}
          contextInput={contextInput}
          onHoverToken={onHoverToken}
          onLeaveToken={onLeaveToken}
          latStat={latStat}
          costStat={costStat}
          groundStat={groundStat}
        />

        {/* Terminal console output */}
        <StreamingTerminal 
          terminalOutput={terminalOutput}
          terminalStatus={terminalStatus}
          streamSpeed={streamSpeed}
          setStreamSpeed={setStreamSpeed}
          onStopStreaming={onStopStreaming}
          terminalEndRef={terminalEndRef}
        />

      </div>

    </section>
  );
}
