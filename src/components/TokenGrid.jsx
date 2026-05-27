import React, { useMemo } from 'react';
import { Database } from 'lucide-react';

export default function TokenGrid({
  activePreset,
  isCaching,
  isAttentionMap,
  contextInput,
  onHoverToken,
  onLeaveToken,
  latStat,
  costStat,
  groundStat
}) {
  // Helper strings to fill high fidelity tooltip tokens
  const getSystemWord = (i) => {
    const list = ["SYSTEM:", "You", "are", "a", "confidential", "VectraFlux", "cloud", "assistant.", "Ground", "responses", "strictly", "in", "the", "enclosed", "XML", "context.", "Never", "leak", "vault", "secrets", "or", "keys."];
    return list[i % list.length];
  };

  const getPromptWord = (i) => {
    const list = ["What", "steps", "and", "scripts", "should", "our", "operations", "run", "to", "resolve", "storage", "outages", "on", "cluster", "node-us-east-4?"];
    return list[i % list.length];
  };

  const getMetaWord = (i) => {
    const list = ["<context>", "<metadata", "source=\"operations-runbook.md\"", "classification=\"INTERNAL\"", "tag=\"incident\"/>"];
    return list[i % list.length];
  };

  const getContextWord = (i) => {
    let sourceText = "VectraFlux STORAGE INCIDENT INCIDENT RUNBOOK DISK CAPACITY EXCEEDS 95% EXECUTE PURGING COMMAND RUN SCRIPT PURGE TEMP LOGS.SH OR FAILOVER MICROSERVICE REBOOT DB SERVICE";
    if (activePreset === 'auth') {
      sourceText = "VectraFlux GATEWAY SECURITY SPECS SECRETS AUTH OAUTH2 BEARER JWT LIFESPAN 3600 SECONDS USE MTLS FOR INTERNAL TRUST RULES DO NOT EXPOSE API KEYS";
    } else if (activePreset === 'messy') {
      sourceText = "HOST US-EAST-1 OK 12.4 HOST US-EAST-2 OK 8.9 HOST US-EAST-3 OK 45.2 PING DNS 12MS CHAT DAVE STAGING OAUTH SARAH YES ACTIVE HANDSHAKE FAILS DAVE CACHING FAST TODAY SYSADMIN CRITICAL STORAGE EXHAUSTED RUN PURGE SCRIPT REBOOT CONTAINER DAVE OH EAST-4 RECOVERY PROCEDURES DOCKER OR K8S IMAGE BACKUP CRON SYSTEM DIAGNOSTICS SUCCESSFUL";
    }
    const words = sourceText.split(' ');
    return words[i % words.length];
  };

  // Compute cell specifications (memoized!)
  const cellsData = useMemo(() => {
    let countSys = 25;
    let countPrompt = 30;
    
    let countMeta = 0;
    let countContext = 0;

    if (activePreset === 'none') {
      countMeta = 0;
      countContext = 0;
    } else if (activePreset === 'ops') {
      countMeta = 12;
      countContext = 95;
    } else if (activePreset === 'auth') {
      countMeta = 10;
      countContext = 85;
    } else if (activePreset === 'messy') {
      countMeta = 15;
      countContext = 280;
    } else {
      // custom
      countMeta = contextInput ? 12 : 0;
      countContext = Math.min(350, Math.round(contextInput.length / 4.2));
    }

    const totalCells = 576;
    const items = [];

    for (let i = 0; i < totalCells; i++) {
      let type = 'empty';
      let wordText = '...';

      if (i < countSys) {
        type = 'sys';
        wordText = getSystemWord(i);
      } else if (i < countSys + countPrompt) {
        type = 'prt';
        wordText = getPromptWord(i - countSys);
      } else if (i < countSys + countPrompt + countMeta) {
        type = 'met';
        wordText = getMetaWord(i - countSys - countPrompt);
      } else if (i < countSys + countPrompt + countMeta + countContext) {
        type = 'ctx';
        const ctxIdx = i - countSys - countPrompt - countMeta;
        wordText = getContextWord(ctxIdx);

        // Highlight Caching blocks (Cyan)
        if (isCaching && activePreset !== 'none') {
          type = 'cch';
        }

        // Highlight Attention Maps
        if (isAttentionMap) {
          if (activePreset === 'ops') {
            const ratio = ctxIdx / countContext;
            if (ratio > 0.25 && ratio < 0.75) {
              // Valley
              if (ctxIdx >= 40 && ctxIdx <= 55) {
                type = 'crit'; // buried critical text
              } else {
                type = 'lost'; // lost attention segment
              }
            }
          } else if (activePreset === 'messy') {
            // Messy context also has a deep attention valley in the center (where the runbook command is buried)
            const ratio = ctxIdx / countContext;
            if (ratio > 0.15 && ratio < 0.85) {
              if (ctxIdx >= 70 && ctxIdx <= 110) {
                type = 'crit'; // buried critical recovery script
              } else {
                type = 'lost'; // lost attention
              }
            }
          }
        }
      }

      items.push({ index: i, type, wordText });
    }
    return { items, totalTokens: countSys + countPrompt + countMeta + countContext };
  }, [activePreset, isCaching, isAttentionMap, contextInput]);

  return (
    <div className="viz-card">
      <div className="card-title-row">
        <span className="title-inner">
          <Database size={13} />
          <span>Context Window Token Grid</span>
        </span>
        <span className="window-metric">
          {cellsData.totalTokens} / 576 Tokens
        </span>
      </div>

      {/* Color legend */}
      <div className="legend" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 12px', marginBottom: '12px' }}>
        <div className="legend-block"><span className="color-dot dot-system" /> System</div>
        <div className="legend-block"><span className="color-dot dot-prompt" /> Prompt</div>
        <div className="legend-block"><span className="color-dot dot-context" /> Context</div>
        <div className="legend-block"><span className="color-dot dot-meta" /> XML Tags</div>
        {isCaching && <div className="legend-block"><span className="color-dot dot-cache" /> Cached</div>}
        {isAttentionMap && <div className="legend-block"><span className="color-dot dot-lost" /> Attention Valley</div>}
        {isAttentionMap && <div className="legend-block"><span className="color-dot dot-crit" /> Buried Critical</div>}
      </div>

      {/* Token blocks grid frame */}
      <div className="grid-frame">
        <div className="token-block-grid">
          {cellsData.items.map((cell) => (
            <div 
              key={cell.index} 
              className={`t-cell ${cell.type}`}
              onMouseEnter={(e) => onHoverToken(e, cell.index, cell.type, cell.wordText)}
              onMouseLeave={onLeaveToken}
            />
          ))}
        </div>
      </div>

      {/* Mini metrics bar */}
      <div className="stat-row">
        <div className="stat-metric">
          <span className="stat-lbl">Latency</span>
          <span className="stat-val text-purple">{latStat}</span>
        </div>
        <div className="stat-metric">
          <span className="stat-lbl">Token Cost</span>
          <span className="stat-val text-cyan">{costStat}</span>
        </div>
        <div className="stat-metric">
          <span className="stat-lbl">Semantic Grounding</span>
          <span className="stat-val text-green">{groundStat}</span>
        </div>
      </div>
    </div>
  );
}
