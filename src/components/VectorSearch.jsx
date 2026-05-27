import React from 'react';
import { Database, Search, FileText, Sparkles } from 'lucide-react';
import { VECTOR_DOCUMENTS } from '../data/vectorDocs';

export default function VectorSearch({
  searchQuery,
  setSearchQuery,
  searchResults,
  setSearchResults,
  onInject
}) {
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    
    // Compute simple word overlap & scoring
    const matched = VECTOR_DOCUMENTS.map(doc => {
      let score = 0.55; // baseline cosine similarity proxy
      
      // tags hit raises score
      const tagsHit = doc.tags.filter(t => query.includes(t) || t.includes(query)).length;
      score += (tagsHit * 0.15);

      // limit max score to 0.98
      score = Math.min(score, 0.98);
      
      return { ...doc, score: parseFloat(score.toFixed(2)) };
    })
    .filter(doc => doc.score > 0.6)
    .sort((a, b) => b.score - a.score);

    setSearchResults(matched);
  };

  return (
    <div className="vector-search-section">
      <div className="search-label">
        <Database size={14} />
        <span>Simulate Vector Retrieval (RAG Ingestion)</span>
      </div>
      
      <form onSubmit={handleSearchSubmit} className="search-input-row">
        <input 
          type="text" 
          className="search-input"
          placeholder="Search mock Vector database (e.g. 'outage storage', 'API token', 'latency')..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="btn-search-trigger">
          <Search size={14} /> Retrieve
        </button>
      </form>

      {searchResults.length > 0 && (
        <div className="search-results-tray animate-fade-in">
          {searchResults.map(doc => (
            <div key={doc.id} className="search-result-card">
              <div className="result-card-header">
                <span className="result-title-group">
                  <FileText size={13} className="text-cyan" />
                  {doc.title} ({doc.source})
                </span>
                <span className="result-score">Cosine Sim: {doc.score}</span>
              </div>
              <p className="result-body">{doc.content.slice(0, 140)}...</p>
              <div className="result-actions">
                <button 
                  className="btn-inject-context"
                  onClick={() => onInject(doc)}
                >
                  <Sparkles size={11} /> Inject Context XML
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
