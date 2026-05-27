import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import SlidesDeck from './components/SlidesDeck';
import Playground from './components/Playground';
import Tooltip from './components/Tooltip';
import { PRESETS } from './data/presets';

export default function App() {
  const [viewMode, setViewMode] = useState('slides'); // 'slides', 'split', 'demo'
  const [slideIndex, setSlideIndex] = useState(1);
  const [activePreset, setActivePreset] = useState('none');
  const [isCaching, setIsCaching] = useState(false);
  const [isAttentionMap, setIsAttentionMap] = useState(false);
  
  // Vector search simulator states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // Prompt & context workspace states
  const [promptInput, setPromptInput] = useState(PRESETS.none.prompt);
  const [contextInput, setContextInput] = useState('');
  const [contextTokensCount, setContextTokensCount] = useState(0);
  
  // Terminal outputs streaming states
  const [terminalOutput, setTerminalOutput] = useState('Ready. Click "Stream LLM Response" to execute.');
  const [terminalStatus, setTerminalStatus] = useState('idle'); // 'idle', 'thinking', 'streaming', 'completed'
  const [streamSpeed, setStreamSpeed] = useState(20);
  
  // Metrics displayed
  const [latStat, setLatStat] = useState('-- ms');
  const [costStat, setCostStat] = useState('$--');
  const [groundStat, setGroundStat] = useState('--%');

  // Token Cost Calculator slider state
  const [calculatorTokens, setCalculatorTokens] = useState(16384);

  // Tooltip token data
  const [hoveredToken, setHoveredToken] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const terminalEndRef = useRef(null);
  const streamingTimer = useRef(null);
  const totalSlides = 12;

  // Auto scroll console terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalOutput]);

  // Clean up streaming timer on unmount (Resolves P0 memory leak!)
  useEffect(() => {
    return () => {
      if (streamingTimer.current) {
        clearTimeout(streamingTimer.current);
      }
    };
  }, []);

  // Handle Preset loading
  const loadPreset = (presetKey) => {
    if (streamingTimer.current) {
      clearTimeout(streamingTimer.current);
    }
    
    setActivePreset(presetKey);
    
    if (presetKey === 'custom') {
      setPromptInput('What steps and scripts should our operations run to resolve storage outages on node-us-east-4?');
      setContextInput('<context>\n  <!-- [Live Audience Challenge] Search vector DB and inject document chunks, or paste custom text here -->\n</context>');
      setContextTokensCount(15);
      setTerminalOutput('Ready. Under Live Audience Challenge, enter custom prompts or inject database chunks and stream responses.');
      setTerminalStatus('idle');
      setLatStat('-- ms');
      setCostStat('$--');
      setGroundStat('--%');
      setSearchResults([]);
      setSearchQuery('');
      return;
    }
    
    const preset = PRESETS[presetKey];
    setPromptInput(preset.prompt);
    setContextInput(preset.context);
    
    // count approx tokens based on characters
    const tokenCount = preset.context ? Math.round(preset.context.length / 4.2) : 0;
    setContextTokensCount(tokenCount);

    setTerminalOutput('Ready. Choose controls or click "Stream LLM Response".');
    setTerminalStatus('idle');
    setLatStat('-- ms');
    setCostStat('$--');
    setGroundStat('--%');
    setSearchResults([]);
    setSearchQuery('');
  };

  // Keyboard navigation for Slide deck with viewMode integration (Resolves P1 stale closures!)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
      }
      if (viewMode === 'demo') {
        return; // Guard slide navigation when only the Sandbox playground is visible
      }
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault(); // Prevents double-scroll behavior on Spacebar!
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slideIndex, viewMode]);

  const nextSlide = () => {
    if (slideIndex < totalSlides) {
      setSlideIndex(prev => {
        const nextIdx = prev + 1;
        syncSlideWithDemo(nextIdx, viewMode);
        return nextIdx;
      });
    }
  };

  const prevSlide = () => {
    if (slideIndex > 1) {
      setSlideIndex(prev => {
        const nextIdx = prev - 1;
        syncSlideWithDemo(nextIdx, viewMode);
        return nextIdx;
      });
    }
  };

  // Auto-sync slide presentation pages with demo parameters for splitscreen presenter!
  const syncSlideWithDemo = (idx, mode = viewMode) => {
    if (mode === 'split') {
      if (idx === 1 || idx === 2) {
        loadPreset('none');
        setIsAttentionMap(false);
        setIsCaching(false);
      } else if (idx === 3) {
        loadPreset('ops');
        setIsAttentionMap(false);
        setIsCaching(false);
      } else if (idx === 4) {
        // Slide 4: Token Economics Slider simulator
        loadPreset('none');
        setIsAttentionMap(false);
        setIsCaching(false);
      } else if (idx === 5) {
        // Slide 5: Lost in the Middle (previously 4)
        loadPreset('messy');
        setIsAttentionMap(true);
        setIsCaching(false);
      } else if (idx === 6) {
        // Slide 6: Multi-Turn Memory Simulation
        loadPreset('multi_turn');
        setIsAttentionMap(true);
        setIsCaching(false);
      } else if (idx === 7) {
        // Slide 7: Tool use
        loadPreset('ops');
        setIsAttentionMap(false);
        setIsCaching(false);
      } else if (idx === 8) {
        // Slide 8: Prompt Caching (previously 5)
        loadPreset('auth');
        setIsAttentionMap(false);
        setIsCaching(true);
      } else if (idx === 9) {
        // Slide 9: Guardrails & Context Injection Safety
        loadPreset('injection');
        setIsAttentionMap(false);
        setIsCaching(false);
      } else if (idx === 10) {
        // Slide 10: Evaluating Grounding metrics
        loadPreset('ops');
        setIsAttentionMap(false);
        setIsCaching(false);
      } else if (idx === 11) {
        // Slide 11: Context Playbook (previously 6)
        loadPreset('ops');
        setIsAttentionMap(false);
        setIsCaching(false);
      } else if (idx === 12) {
        // Slide 12: Audience Challenge
        loadPreset('custom');
        setIsAttentionMap(false);
        setIsCaching(false);
      }
    }
  };

  // Inject retrieved chunk into Context Box
  const injectDocumentIntoContext = (doc) => {
    const xml = `<context>
  <metadata source="${doc.source}" similarity="${doc.score}" />
  <document id="${doc.id}" title="${doc.title}">
    ${doc.content}
  </document>
</context>`;

    setContextInput(xml);
    const tokenCount = Math.round(xml.length / 4.2);
    setContextTokensCount(tokenCount);
    
    // Switch active preset to custom
    setActivePreset('custom');
    setTerminalOutput(`Injected vector document [${doc.source}] into active Context. Ready to stream!`);
  };

  // Stop / Cancel active LLM Streaming response (Resolves P2 request!)
  const handleStopStreaming = () => {
    if (streamingTimer.current) {
      clearTimeout(streamingTimer.current);
    }
    setTerminalStatus('completed');
    setTerminalOutput(prev => prev + '\n\n[RESPONSE TERMINATED BY SPEAKER]');
    setLatStat('Terminated');
    setCostStat('$--');
    setGroundStat('--%');
  };

  // Simulating the LLM Call
  const triggerSimulation = () => {
    if (streamingTimer.current) {
      clearTimeout(streamingTimer.current);
    }

    setTerminalStatus('thinking');
    setTerminalOutput('Thinking...');
    
    let simulatedOutput = '';
    let statsSource = PRESETS.none;

    if (activePreset === 'ops') {
      statsSource = PRESETS.ops;
    } else if (activePreset === 'auth') {
      statsSource = PRESETS.auth;
    } else if (activePreset === 'messy') {
      statsSource = PRESETS.messy;
    } else if (activePreset === 'multi_turn') {
      statsSource = PRESETS.multi_turn;
    } else if (activePreset === 'injection') {
      statsSource = PRESETS.injection;
    } else if (activePreset === 'custom') {
      // Dynamic response matching prompt & context content realistically!
      const hasInjectedContext = contextInput.trim() !== '' && 
                                 !contextInput.includes('[Live Audience Challenge]') && 
                                 contextInput.length > 30;
      const promptLower = promptInput.toLowerCase();
      
      if (!hasInjectedContext) {
        // No context injected (equivalent to Prompt Only / No RAG)
        let fallbackMsg = `I do not have access to private operational records or real-time infrastructure metrics. Since there is no grounding context supplied in my context window, I cannot answer the query: "${promptInput}". Please search the vector database and inject the relevant operational files, or paste custom text inside the Injected XML Context box.`;
        
        if (promptLower.includes('weather')) {
          fallbackMsg = `I do not have access to real-time meteorological services or weather APIs. Because no grounding context has been injected, I cannot determine the weather. Please provide weather reports or database files inside the context window to answer this query.`;
        }
        
        statsSource = {
          stats: { latency: "310 ms", cost: "$0.00015", grounding: "0%" },
          output: fallbackMsg
        };
      } else {
        // Context is present! Let's simulate dynamic grounding based on search results or keywords
        let dynamicOutput = "";
        let finalGroundingVal = "90%";
        
        if (promptLower.includes('weather')) {
          dynamicOutput = `Based on the custom context provided, I cannot find any weather reports or meteorological telemetry files. The provided logs only mention cluster servers. Therefore, I cannot verify the current weather conditions.`;
          finalGroundingVal = "100% (Accurate negation from empty weather context)";
        } else {
          // Normal operations query with custom context
          const docSource = searchResults[0]?.source || 'injected-context';
          dynamicOutput = `Based on the grounded context [Source: ${docSource}], we can resolve the operational query. The system logs outline running script execution commands or configuration variables safely. Details extracted: \n\n` + 
            (contextInput.length > 100 ? contextInput.slice(0, 180) + "..." : contextInput) + 
            `\n\nAll credentials must be managed structurally to prevent prompt hijacking.`;
        }
        
        statsSource = {
          stats: { latency: "220 ms", cost: "$0.00045", grounding: finalGroundingVal },
          output: dynamicOutput
        };
      }
    } else if (contextInput.trim() !== '') {
      // User manual text injected
      statsSource = {
        stats: { latency: "250 ms", cost: "$0.00048", grounding: "90%" },
        output: "Based on the custom context provided: \n\n" + contextInput.slice(0, 150) + "...\n\nI was able to locate the grounding details successfully and cited the source documents."
      };
    }

    const words = statsSource.output.split(' ');
    let idx = 0;
    
    let thinkingDelay = 900;
    if (isCaching && activePreset !== 'none') {
      thinkingDelay = 80; // Cached queries bypass warmups!
    }

    streamingTimer.current = setTimeout(() => {
      setTerminalStatus('streaming');
      setTerminalOutput('');
      
      const streamWords = () => {
        if (idx < words.length) {
          let word = words[idx];
          
          simulatedOutput += (idx === 0 ? '' : ' ') + word;
          setTerminalOutput(simulatedOutput);
          
          idx++;
          streamingTimer.current = setTimeout(streamWords, streamSpeed + Math.random() * 20);
        } else {
          setTerminalStatus('completed');
          
          // Output simulated stats
          let finalLatency = statsSource.stats.latency;
          let finalCost = statsSource.stats.cost;
          let finalGrounding = statsSource.stats.grounding;

          if (isCaching && activePreset !== 'none') {
            const numLat = parseInt(finalLatency.replace(/[^0-9]/g, ''));
            finalLatency = `${Math.round(numLat * 0.12)} ms (Cache Hit)`;
            const numCost = parseFloat(finalCost.replace('$', ''));
            finalCost = `$${(numCost * 0.1).toFixed(5)} (-90%)`;
          }

          if (activePreset === 'ops' && isAttentionMap) {
            // Diluted when attention map highlights info buried in middle noise
            finalGrounding = "38% (Incident details buried in attention valley)";
          } else if (activePreset === 'messy' && isAttentionMap) {
            finalGrounding = "38% (Recovery commands lost in diagnostic chat noise)";
          } else if (activePreset === 'multi_turn' && isAttentionMap) {
            finalGrounding = "52% (Early conversation turns lost to memory window compression)";
          }

          setLatStat(finalLatency);
          setCostStat(finalCost);
          setGroundStat(finalGrounding);
        }
      };
      
      streamWords();
    }, thinkingDelay);
  };

  const handleTokenHover = (e, index, type, wordText) => {
    if (type === 'empty') return;
    
    // Translate fixed coordinates relative to browser viewport (Resolves scroll-offset bugs!)
    setTooltipPos({ x: e.clientX + 10, y: e.clientY + 10 });
    
    let label = type.charAt(0).toUpperCase() + type.slice(1);
    if (type === 'sys') label = 'System Instruction';
    if (type === 'prt') label = 'User Prompt';
    if (type === 'met') label = 'Metadata Delimiters';
    if (type === 'ctx') label = 'Context Chunks (RAG)';
    if (type === 'cch') label = 'Cached Context Chunks';
    if (type === 'lost') label = 'Context Chunks (Attention Valley: 38% Recall)';
    if (type === 'crit') label = 'Buried Core Runbook Script (Missing Attention)';

    setHoveredToken({ index, label, word: wordText });
  };

  return (
    <div className="app-container">
      {/* Premium Obsidian Gradient floaters */}
      <div className="bg-glow bg-glow-purple"></div>
      <div className="bg-glow bg-glow-blue"></div>

      {/* Corporate Header component */}
      <Header 
        viewMode={viewMode}
        setViewMode={setViewMode}
        slideIndex={slideIndex}
        totalSlides={totalSlides}
        prevSlide={prevSlide}
        nextSlide={nextSlide}
      />

      {/* Main Workspace Panels */}
      <main className={`workspace-grid mode-${viewMode}`}>
        
        {/* PRESENTATION PANEL */}
        {viewMode !== 'demo' && (
          <SlidesDeck 
            slideIndex={slideIndex}
            totalSlides={totalSlides}
            prevSlide={prevSlide}
            nextSlide={nextSlide}
            setSlideIndex={setSlideIndex}
            syncSlideWithDemo={syncSlideWithDemo}
          />
        )}

        {/* INTERACTIVE PLAYGROUND PANEL */}
        {viewMode !== 'slides' && (
          <Playground 
            activePreset={activePreset}
            setActivePreset={setActivePreset}
            isCaching={isCaching}
            setIsCaching={setIsCaching}
            isAttentionMap={isAttentionMap}
            setIsAttentionMap={setIsAttentionMap}
            promptInput={promptInput}
            setPromptInput={setPromptInput}
            contextInput={contextInput}
            setContextInput={setContextInput}
            contextTokensCount={contextTokensCount}
            setContextTokensCount={setContextTokensCount}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchResults={searchResults}
            setSearchResults={setSearchResults}
            terminalOutput={terminalOutput}
            setTerminalOutput={setTerminalOutput}
            terminalStatus={terminalStatus}
            setTerminalStatus={setTerminalStatus}
            streamSpeed={streamSpeed}
            setStreamSpeed={setStreamSpeed}
            latStat={latStat}
            setLatStat={setLatStat}
            costStat={costStat}
            setCostStat={setCostStat}
            groundStat={groundStat}
            setGroundStat={setGroundStat}
            hoveredToken={hoveredToken}
            setHoveredToken={setHoveredToken}
            tooltipPos={tooltipPos}
            setTooltipPos={setTooltipPos}
            triggerSimulation={triggerSimulation}
            loadPreset={loadPreset}
            injectDocumentIntoContext={injectDocumentIntoContext}
            onHoverToken={handleTokenHover}
            onLeaveToken={() => setHoveredToken(null)}
            onStopStreaming={handleStopStreaming}
            terminalEndRef={terminalEndRef}
            calculatorTokens={calculatorTokens}
            setCalculatorTokens={setCalculatorTokens}
            slideIndex={slideIndex}
          />
        )}
      </main>

      {/* Dynamic Token Details Tooltip with fixed positions */}
      <Tooltip 
        hoveredToken={hoveredToken}
        tooltipPos={tooltipPos}
      />
    </div>
  );
}
