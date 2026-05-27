import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  ArrowRight, 
  Maximize2, 
  Minimize2, 
  ChevronLeft, 
  ChevronRight,
  Code
} from 'lucide-react';

export default function SlidesDeck({
  slideIndex,
  totalSlides,
  prevSlide,
  nextSlide,
  setSlideIndex,
  syncSlideWithDemo
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [animateClass, setAnimateClass] = useState('slide-enter-active');

  // Trigger animation on slide index change
  useEffect(() => {
    setAnimateClass('slide-enter');
    const timer = setTimeout(() => {
      setAnimateClass('slide-enter-active');
    }, 20);
    return () => clearTimeout(timer);
  }, [slideIndex]);

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <section className={`glass-panel slides-panel ${isFullscreen ? 'presenter-mode-active' : ''}`}>
      <div className="slide-box">
        
        {/* Fullscreen Button */}
        <button 
          className="fullscreen-toggle-btn"
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Presenter Mode (Esc)" : "Enter Presenter Mode"}
        >
          {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          <span>{isFullscreen ? 'Exit Fullscreen' : 'Presenter Mode'}</span>
        </button>

        {/* Slide contents with transition animation wrapper */}
        <div className={`slide-animation-wrapper ${animateClass}`}>
          
          {/* Slide 1 */}
          {slideIndex === 1 && (
            <div className="slide-content animate-fade-in">
              <span className="slide-badge">Opening Frame</span>
              <h2 className="slide-title">Context is the New <span className="gradient-text">API</span></h2>
              <p className="slide-desc">Why context engineering is the most leverageable discipline in modern Enterprise AI systems.</p>
              
              <div className="slide-cards-grid">
                <div className="slide-card">
                  <div className="card-icon icon-purple"><Database size={20} /></div>
                  <h3>Fine-Tuning is the University</h3>
                  <p>Teaching models broad corporate rules, style profiles, and behavioral weights. Extremely costly and historical.</p>
                </div>
                <div className="slide-card">
                  <div className="card-icon icon-cyan"><Sparkles size={20} /></div>
                  <h3>Context is the Open Book</h3>
                  <p>Supplying exact target database logs, network documentation, and runbooks at the moment of execution.</p>
                </div>
              </div>

              <div className="slide-quote">
                “An LLM's raw capability is capped by its weights, but its active business utility is unlocked by its engineered context.”
              </div>
            </div>
          )}

          {/* Slide 2 */}
          {slideIndex === 2 && (
            <div className="slide-content animate-fade-in">
              <span className="slide-badge">Operational Boundary</span>
              <h2 className="slide-title">Prompt vs. <span className="gradient-text">Context</span></h2>
              <p className="slide-desc">Mapping the definitive boundary between operational intent and grounded facts.</p>
              
              <div className="slide-comp-layout">
                <div className="comp-box">
                  <div className="comp-box-header">
                    <h2><Code size={18} className="text-purple" /> The Prompt</h2>
                    <span className="slide-badge" style={{margin: 0, padding: '2px 8px', fontSize: '0.62rem'}}>Command Intent</span>
                  </div>
                  <ul className="comp-list">
                    <li><CheckCircle2 size={14} className="text-cyan" /> Defines the instruction constraints</li>
                    <li><CheckCircle2 size={14} className="text-cyan" /> Outlines target rules & formatting specs</li>
                    <li><CheckCircle2 size={14} className="text-cyan" /> Expresses user objective</li>
                    <li><AlertTriangle size={14} className="text-red" /> Fails completely without grounding data</li>
                  </ul>
                  <div className="comp-pill">"Locate the operations runbook command to resolve Node failures..."</div>
                </div>

                <div className="comp-box">
                  <div className="comp-box-header">
                    <h2><Database size={18} className="text-green" /> The Context</h2>
                    <span className="slide-badge badge-green" style={{margin: 0, padding: '2px 8px', fontSize: '0.62rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: 'var(--neon-green)'}}>Grounded Ground-Truth</span>
                  </div>
                  <ul className="comp-list">
                    <li><CheckCircle2 size={14} className="text-cyan" /> Injects live database variables</li>
                    <li><CheckCircle2 size={14} className="text-cyan" /> Provides security specs & environment keys</li>
                    <li><CheckCircle2 size={14} className="text-cyan" /> Eliminates API hallucinations entirely</li>
                    <li><AlertTriangle size={14} className="text-red" /> Passive text, useless without instructions</li>
                  </ul>
                  <div className="comp-pill comp-pill-green">"source='operations-runbook.md' trigger='Disk &gt; 95%' script='/opt/acme/scripts/...'..."</div>
                </div>
              </div>
            </div>
          )}

          {/* Slide 3 */}
          {slideIndex === 3 && (
            <div className="slide-content animate-fade-in">
              <span className="slide-badge">The RAG Pipeline</span>
              <h2 className="slide-title">Anatomy of the <span className="gradient-text">Context Pipeline</span></h2>
              <p className="slide-desc">Raw text ingestion leads to dilution. Enterprise systems require highly engineered structures.</p>
              
              <div className="pipeline-track">
                <div className="pipeline-node">
                  <div className="node-num">1</div>
                  <h3>Retrieve</h3>
                  <p>Vector database similarity matching on enterprise runbooks.</p>
                </div>
                <div className="pipeline-line"><ArrowRight size={16} /></div>
                <div className="pipeline-node">
                  <div className="node-num">2</div>
                  <h3>Rank & Filter</h3>
                  <p>Removing low similarity scores and sorting relative chunks.</p>
                </div>
                <div className="pipeline-line"><ArrowRight size={16} /></div>
                <div className="pipeline-node">
                  <div className="node-num">3</div>
                  <h3>Format (XML)</h3>
                  <p>Wrapping inside strict tags with document metadata identifiers.</p>
                </div>
                <div className="pipeline-line"><ArrowRight size={16} /></div>
                <div className="pipeline-node">
                  <div className="node-num">4</div>
                  <h3>Cache Prefix</h3>
                  <p>Storing static chunks in RAM to optimize latency.</p>
                </div>
              </div>

              <div className="slide-alert-tip">
                <Lightbulb size={18} className="text-cyan" />
                <div>
                  <strong>Pro Context Tip:</strong> Surrounding vector chunks in semantic markers like <code>&lt;incident_runbook id="doc_ops_02"&gt;</code> isolates raw details, boosting query recall accuracy by over <strong>35%</strong>.
                </div>
              </div>
            </div>
          )}

          {/* Slide 4 */}
          {slideIndex === 4 && (
            <div className="slide-content animate-fade-in">
              <span className="slide-badge badge-red">Attention Limits</span>
              <h2 className="slide-title">The <span className="gradient-text">"Lost in the Middle"</span> Dilemma</h2>
              <p className="slide-desc">Why dumping unranked database scrapes into LLMs degrades target recall accuracy.</p>
              
              <div className="split-grid-2-1">
                <div>
                  <p style={{fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '15px'}}>
                    If relevant runbook scripts or configuration parameters are buried inside long, unranked documents (thousands of tokens), the LLM's capability to extract them drops to near coin-flip levels.
                  </p>
                  <div style={{display: 'flex', gap: '15px'}}>
                    <div style={{background: 'rgba(255,255,255,0.02)', border: '1px solid var(--panel-border)', borderRadius: '10px', padding: '12px', flexGrow: 1, textAlign: 'center'}}>
                      <h4 className="text-green" style={{fontSize: '1.5rem', fontWeight: 800}}>99%</h4>
                      <span style={{fontSize: '0.68rem', color: 'var(--text-muted)'}}>Recall at extremes</span>
                    </div>
                    <div style={{background: 'rgba(255,255,255,0.02)', border: '1px solid var(--panel-border)', borderRadius: '10px', padding: '12px', flexGrow: 1, textAlign: 'center'}}>
                      <h4 className="text-red" style={{fontSize: '1.5rem', fontWeight: 800}}>~38%</h4>
                      <span style={{fontSize: '0.68rem', color: 'var(--text-muted)'}}>Recall in middle valley</span>
                    </div>
                  </div>
                </div>

                <div className="attention-chart-box">
                  <div className="chart-axis-lbl" style={{top: '15px'}}>Attention (100%)</div>
                  <div className="chart-axis-lbl" style={{top: '75px'}}>(50%)</div>
                  <div className="chart-axis-lbl" style={{bottom: '22px'}}>(0%)</div>
                  <div className="chart-plot">
                    <svg viewBox="0 0 200 100" className="chart-svg">
                      <path d="M 10 10 Q 100 85, 190 10" fill="none" stroke="var(--neon-purple)" strokeWidth="3" className="path-stroke" />
                      <line x1="100" y1="10" x2="100" y2="85" stroke="rgba(255,255,255,0.1)" strokeDasharray="3,3" />
                      <circle cx="10" cy="10" r="4" fill="var(--neon-cyan)" />
                      <circle cx="100" cy="82" r="5" fill="var(--neon-red)" />
                      <circle cx="190" cy="10" r="4" fill="var(--neon-cyan)" />
                    </svg>
                  </div>
                  <div className="chart-x-labels">
                    <span>Start of Context</span>
                    <span>The Attention Valley</span>
                    <span>End of Context</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Slide 5 */}
          {slideIndex === 5 && (
            <div className="slide-content animate-fade-in">
              <span className="slide-badge">Latency & Cost</span>
              <h2 className="slide-title">Unlocking <span className="gradient-text">Prompt Caching</span></h2>
              <p className="slide-desc">Persisting contextual frameworks to run sub-second queries at 10% pricing rates.</p>
              
              <div className="cache-panel-grid">
                <div className="cache-showcase-box">
                  <h3 style={{fontSize: '1rem', marginBottom: '10px'}}>Without Caching</h3>
                  <div className="cache-metric-row">
                    <span className="metric-pill metric-slow">Slow (350ms+)</span>
                    <span className="metric-pill metric-cost-full">Full API Rates ($0.015)</span>
                  </div>
                  <p style={{fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4}}>
                    Every token is parsed on every execution turn. Highly inefficient for conversational runbook guides or code helpers.
                  </p>
                </div>

                <div className="cache-showcase-box">
                  <div className="glow-overlay-border"></div>
                  <h3 style={{fontSize: '1rem', marginBottom: '10px'}}>Prefix Caching Enabled</h3>
                  <div className="cache-metric-row">
                    <span className="metric-pill metric-fast">Instant (~45ms)</span>
                    <span className="metric-pill metric-cost-cut">90% Cost Saving ($0.001)</span>
                  </div>
                  <p style={{fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4}}>
                    The massive system instructions and API documents are cached in memory. The model only processes dynamic prompt details!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Slide 6 */}
          {slideIndex === 6 && (
            <div className="slide-content animate-fade-in">
              <span className="slide-badge">Summary</span>
              <h2 className="slide-title">The Enterprise <span className="gradient-text">Context Playbook</span></h2>
              <p className="slide-desc" style={{ marginBottom: '10px' }}>Four golden rules to ship highly accurate, enterprise-grade LLM applications.</p>
              
              <div className="playbook-split-layout">
                <div className="playbook-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                  <div className="playbook-card">
                    <div className="playbook-index">01</div>
                    <div className="playbook-content">
                      <h3>Delimit Structurally</h3>
                      <p>Surround target documents inside clean XML/YAML tags to prevent prompt injections.</p>
                    </div>
                  </div>

                  <div className="playbook-card">
                    <div className="playbook-index">02</div>
                    <div className="playbook-content">
                      <h3>Rank by Relevance</h3>
                      <p>Order retrieved vector results so the most crucial facts sit at extreme ends—never in the middle valley.</p>
                    </div>
                  </div>

                  <div className="playbook-card">
                    <div className="playbook-index">03</div>
                    <div className="playbook-content">
                      <h3>Minimize Redundancy</h3>
                      <p>Filter out high-token noise. Unranked scrapes dilute recall efficiency and attention.</p>
                    </div>
                  </div>

                  <div className="playbook-card">
                    <div className="playbook-index">04</div>
                    <div className="playbook-content">
                      <h3>Maximize Caching</h3>
                      <p>Design multi-turn conversations around stable system prefixes to maximize cache hits.</p>
                    </div>
                  </div>
                </div>

                {/* PREMIUM CODE COMPARE VIEW FOR SLIDE 6 */}
                <div className="code-compare-card animate-fade-in">
                  <div className="code-compare-header">
                    <span>💡 Grounding Context Best Practices (Before vs After XML)</span>
                  </div>
                  <div className="code-compare-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="code-pane before">
                      <div className="pane-title text-red">❌ Untagged Raw Dumping</div>
                      <pre className="pane-code">
{`This is the US-EAST-4 operational script.
Disk exceeds 95% run logs script
/opt/acme/scripts/purge_temp_logs.sh
Also sysops need to reboot acme-db-service.`}
                      </pre>
                    </div>
                    <div className="code-pane after">
                      <div className="pane-title text-green">✅ Machine-Readable XML Delimiters</div>
                      <pre className="pane-code">
{`<context>
  <runbook id="doc_ops_02" cluster="US-EAST-4">
    <trigger>Disk Space > 95%</trigger>
    <command>/opt/acme/scripts/purge_temp_logs.sh</command>
    <service>acme-db-service</service>
  </runbook>
</context>`}
                      </pre>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Presentation Footer */}
        <div className="slide-footer-nav">
          <button className="footer-nav-btn" onClick={prevSlide} title="Previous Slide (Left Arrow)"><ChevronLeft size={16} /> Previous</button>
          <div className="dots-indicator-row">
            {Array.from({length: totalSlides}).map((_, i) => (
              <div 
                key={i} 
                className={`dot-indicator ${slideIndex === i + 1 ? 'active' : ''}`}
                onClick={() => {
                  setSlideIndex(i+1);
                  syncSlideWithDemo(i+1);
                }}
              />
            ))}
          </div>
          <button className="footer-nav-btn primary" onClick={nextSlide} title="Next Slide (Right Arrow/Space)">Next <ChevronRight size={16} /></button>
        </div>

      </div>
    </section>
  );
}
