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
  terminalEndRef,
  calculatorTokens,
  setCalculatorTokens,
  slideIndex
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
      <div className="preset-tabs" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', marginBottom: '15px' }}>
        <button 
          className={`tab-btn ${activePreset === 'none' ? 'active' : ''}`}
          onClick={() => loadPreset('none')}
        >
          <span className="tab-btn-idx">01</span>
          <div className="tab-btn-meta">
            <span className="tab-btn-title">Prompt Only</span>
            <span className="tab-btn-desc">No context</span>
          </div>
        </button>

        <button 
          className={`tab-btn ${activePreset === 'messy' ? 'active' : ''}`}
          onClick={() => loadPreset('messy')}
        >
          <span className="tab-btn-idx">02</span>
          <div className="tab-btn-meta">
            <span className="tab-btn-title">Messy Context</span>
            <span className="tab-btn-desc">Noisy dump</span>
          </div>
        </button>

        <button 
          className={`tab-btn ${activePreset === 'ops' ? 'active' : ''}`}
          onClick={() => loadPreset('ops')}
        >
          <span className="tab-btn-idx">03</span>
          <div className="tab-btn-meta">
            <span className="tab-btn-title">Ops Incident</span>
            <span className="tab-btn-desc">RAG runbook</span>
          </div>
        </button>

        <button 
          className={`tab-btn ${activePreset === 'auth' ? 'active' : ''}`}
          onClick={() => loadPreset('auth')}
        >
          <span className="tab-btn-idx">04</span>
          <div className="tab-btn-meta">
            <span className="tab-btn-title">API Security</span>
            <span className="tab-btn-desc">OAuth specs</span>
          </div>
        </button>

        <button 
          className={`tab-btn ${activePreset === 'multi_turn' ? 'active' : ''}`}
          onClick={() => loadPreset('multi_turn')}
        >
          <span className="tab-btn-idx">05</span>
          <div className="tab-btn-meta">
            <span className="tab-btn-title">Multi-Turn</span>
            <span className="tab-btn-desc">Chat memory</span>
          </div>
        </button>

        <button 
          className={`tab-btn ${activePreset === 'injection' ? 'active' : ''}`}
          onClick={() => loadPreset('injection')}
        >
          <span className="tab-btn-idx">06</span>
          <div className="tab-btn-meta">
            <span className="tab-btn-title">Context Safety</span>
            <span className="tab-btn-desc">Guardrail test</span>
          </div>
        </button>
      </div>

      {/* Dynamic Token Cost Calculator Slider - Visible during slide 4 */}
      {slideIndex === 4 && (
        <div className="token-calculator-panel active-calculator animate-fade-in">
          <div className="calc-title-row">
            <span>⚙️ Token Economics Cost & Latency Simulator</span>
            <span>Interactive Demo (Slide 4)</span>
          </div>
          <div className="slider-row">
            <input 
              type="range" 
              min="1024" 
              max="131072" 
              step="1024" 
              className="slider-input" 
              value={calculatorTokens}
              onChange={(e) => setCalculatorTokens(parseInt(e.target.value))}
            />
            <span className="slider-val-badge">
              {Math.round(calculatorTokens / 1024)}K tkn
            </span>
          </div>
          
          <div className="calc-metrics-row">
            <div className="calc-metric-box">
              <span className="calc-metric-lbl">Est. Latency (TTFT)</span>
              <span className="calc-metric-val text-purple">
                {Math.round((calculatorTokens / 1000) * 8.5 + 120)} ms
              </span>
            </div>
            <div className="calc-metric-box">
              <span className="calc-metric-lbl">Input API Cost</span>
              <span className="calc-metric-val text-cyan">
                ${((calculatorTokens * 2.5) / 1000000).toFixed(5)}
              </span>
            </div>
            <div className="calc-metric-box">
              <span className="calc-metric-lbl">Output API Cost</span>
              <span className="calc-metric-val text-green">
                ${((256 * 10) / 1000000).toFixed(5)}
              </span>
            </div>
          </div>
        </div>
      )}

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
          slideIndex={slideIndex}
          calculatorTokens={calculatorTokens}
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
