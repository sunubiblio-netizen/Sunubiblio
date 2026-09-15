'use client';

import React, { useState } from 'react';
import { PlagiarismReport, SimilarPassage } from '@/types/plagiarism';

interface AntiplagiatReportViewProps {
  report: PlagiarismReport;
  onNewAnalysis: () => void;
}

export const AntiplagiatReportView: React.FC<AntiplagiatReportViewProps> = ({
  report,
  onNewAnalysis,
}) => {
  const [selectedPassageId, setSelectedPassageId] = useState<string>(
    report.passages[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'passages' | 'sources' | 'advice'>('passages');
  const [reformulatedText, setReformulatedText] = useState<{ id: string; text: string } | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const selectedPassage = report.passages.find(p => p.id === selectedPassageId) || report.passages[0];

  const getScoreColorClass = (score: number) => {
    if (score <= 15) return 'score-low';
    if (score <= 35) return 'score-medium';
    return 'score-high';
  };

  const getScoreLabel = (score: number) => {
    if (score <= 15) return 'Similarité faible (Conforme aux standards)';
    if (score <= 35) return 'Similarité modérée (Passages à vérifier)';
    return 'Similarité élevée (Révision approfondie recommandée)';
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 400);
  };

  const handleSuggestReformulation = (passage: SimilarPassage) => {
    // Proposition pédagogique de reformulation académique
    const suggestion = `« Dans le cadre de notre démarche, l'analyse comparative des indicateurs institutionnels a été privilégiée afin de garantir le respect rigoureux de la continuité des apprentissages. » (Proposition rédigée avec vos propres termes).`;
    setReformulatedText({ id: passage.id, text: suggestion });
  };

  return (
    <div className="report-root-container">
      {/* Top action bar */}
      <div className="report-toolbar">
        <button
          type="button"
          onClick={onNewAnalysis}
          className="btn-new-check"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Nouvelle analyse</span>
        </button>

        <button
          type="button"
          onClick={handleExportPDF}
          className="btn-export-report"
          disabled={isExporting}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>{isExporting ? 'Préparation...' : 'Exporter le rapport (PDF)'}</span>
        </button>
      </div>

      {/* Main Score & Document Card */}
      <div className="report-hero-card">
        <div className="hero-left-col">
          <div className="doc-meta-badge">Rapport d’intégrité documentaire</div>
          <h2 className="doc-name">{report.documentName}</h2>
          <div className="doc-specs-row">
            <span>📅 {report.analyzedAt}</span>
            <span>📄 {report.pageCount} pages</span>
            <span>✍️ {report.wordCount.toLocaleString()} mots</span>
            <span>💾 {report.fileSize}</span>
          </div>
        </div>

        {/* Big Similarity Score Ring */}
        <div className={`similarity-score-box ${getScoreColorClass(report.similarityScore)}`}>
          <span className="score-heading">Score de similarité</span>
          <div className="score-number-row">
            <span className="score-val">{report.similarityScore}</span>
            <span className="score-percent">%</span>
          </div>
          <span className="score-status-badge">
            {getScoreLabel(report.similarityScore)}
          </span>
        </div>
      </div>

      {/* Mandatory Methodological Disclaimer */}
      <div className="disclaimer-alert-card" role="note">
        <div className="disclaimer-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </div>
        <div className="disclaimer-text">
          <strong>Avertissement méthodologique :</strong>
          <p>{report.disclaimer}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="report-tabs-bar">
        <button
          type="button"
          onClick={() => setActiveTab('passages')}
          className={`tab-btn ${activeTab === 'passages' ? 'active' : ''}`}
        >
          <span>Passages similaires détectés ({report.passagesCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sources')}
          className={`tab-btn ${activeTab === 'sources' ? 'active' : ''}`}
        >
          <span>Sources comparées ({report.sourcesCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('advice')}
          className={`tab-btn ${activeTab === 'advice' ? 'active' : ''}`}
        >
          <span>Conseils académiques & Citer</span>
        </button>
      </div>

      {/* Tab 1: Passages Explorer */}
      {activeTab === 'passages' && (
        <div className="passages-explorer-grid">
          {/* Left: Passages List */}
          <div className="passages-sidebar-list">
            {report.passages.map((p, idx) => {
              const isSelected = p.id === selectedPassage.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPassageId(p.id)}
                  className={`passage-nav-item ${isSelected ? 'selected' : ''}`}
                >
                  <div className="passage-item-top">
                    <span className="passage-num">Passage {idx + 1}</span>
                    <span className="passage-score-badge">{p.similarityScore}% similarité</span>
                  </div>
                  <p className="passage-snippet">{p.userText.slice(0, 85)}...</p>
                  <span className="passage-source-name">
                    Source : {p.source.title} {p.pageNumber ? `(p. ${p.pageNumber})` : ''}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right: Side-by-Side Comparison Box */}
          <div className="passage-comparison-panel">
            <div className="comparison-header">
              <div className="comp-title-block">
                <span className="badge-passage-active">
                  Passage sélectionné • Page {selectedPassage.pageNumber || 1}
                </span>
                <span className="similarity-pill">
                  {selectedPassage.similarityScore}% de similarité
                </span>
                {selectedPassage.isCitation && (
                  <span className="badge-citation">Citation identifiée</span>
                )}
              </div>
            </div>

            {/* Comparison Columns */}
            <div className="comparison-body-grid">
              {/* Left Column: User text */}
              <div className="comp-col user-col">
                <div className="col-header">
                  <span className="col-tag">Votre document analysé</span>
                </div>
                <div className="col-content">
                  <p className="highlighted-text">{selectedPassage.userText}</p>
                </div>
              </div>

              {/* Right Column: Matched text in Source */}
              <div className="comp-col source-col">
                <div className="col-header">
                  <span className="col-tag">Passage correspondant dans la source</span>
                </div>
                <div className="col-content">
                  <p className="matched-text">{selectedPassage.matchedText}</p>

                  <div className="source-reference-card">
                    <span className="source-label">Source identifiée :</span>
                    <h5 className="src-title">{selectedPassage.source.title}</h5>
                    <p className="src-author">
                      {selectedPassage.source.author && `${selectedPassage.source.author} • `}
                      {selectedPassage.source.institution || 'Sunubiblio'}
                    </p>
                    <span className="src-type-tag">{selectedPassage.source.category || 'Fonds pédagogique'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pedagogical Guidance & AI Reformulation */}
            <div className="passage-advice-card">
              <div className="advice-header">
                <div className="sparkle-icon">💡</div>
                <span className="advice-title">Recommandation académique :</span>
              </div>
              <p className="advice-text">{selectedPassage.advice}</p>

              {reformulatedText && reformulatedText.id === selectedPassage.id ? (
                <div className="reformulation-box">
                  <span className="reform-title">Exemple de reformulation avec vos propres mots :</span>
                  <p className="reform-content">{reformulatedText.text}</p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSuggestReformulation(selectedPassage)}
                  className="btn-suggest-reform"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                  <span>Proposer une formulation académique originale</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Sources List */}
      {activeTab === 'sources' && (
        <div className="sources-tab-view">
          <div className="sources-grid">
            {report.sources.map((src) => (
              <div key={src.id} className="source-full-card">
                <div className="src-card-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                </div>
                <div className="src-card-details">
                  <span className="src-kind-badge">Fonds Documentaire Sunubiblio</span>
                  <h4 className="src-card-title">{src.title}</h4>
                  <p className="src-card-author">{src.author} — {src.institution || 'Éducation Nationale / UCAD'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Academic Advice */}
      {activeTab === 'advice' && (
        <div className="advice-tab-view">
          <div className="academic-guide-card">
            <h3 className="guide-title">Guide d'intégrité académique & Bonnes pratiques</h3>
            <p className="guide-intro">
              Un mémoire, une thèse ou un devoir universitaire gagne en valeur scientifique lorsqu'il est solidement sourcé. Voici les règles indispensables à respecter :
            </p>

            <ul className="advice-rules-list">
              {report.academicAdvice.map((adv, i) => (
                <li key={i}>
                  <span className="rule-icon">✓</span>
                  <span className="rule-text">{adv}</span>
                </li>
              ))}
            </ul>

            <div className="standards-box">
              <h4>Formats de citation recommandés :</h4>
              <div className="standards-items">
                <div className="standard-chip">
                  <strong>APA 7th</strong> : Auteur, A. (2024). <em>Titre du cours</em>. FASTEF.
                </div>
                <div className="standard-chip">
                  <strong>ISO 690</strong> : NOM, Prénom. <em>Titre</em>. Dakar : Sunubiblio, 2024.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .report-root-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .report-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .btn-new-check {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #475569;
          font-size: 13.5px;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-new-check:hover {
          background: #f8faff;
          color: #4f46e5;
          border-color: #6366f1;
        }

        .btn-export-report {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
          color: #ffffff;
          border: none;
          font-size: 13.5px;
          font-weight: 700;
          padding: 9px 20px;
          border-radius: 9999px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
          transition: transform 0.15s ease;
        }

        .btn-export-report:hover {
          transform: translateY(-1px);
        }

        .report-hero-card {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 24px;
          padding: 28px;
          box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.04);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
        }

        .hero-left-col {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .doc-meta-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #6366f1;
          background: rgba(99, 102, 241, 0.08);
          padding: 3px 10px;
          border-radius: 9999px;
          width: fit-content;
        }

        .doc-name {
          font-size: clamp(20px, 3vw, 26px);
          font-weight: 900;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .doc-specs-row {
          display: flex;
          gap: 16px;
          font-size: 13px;
          color: #64748b;
          flex-wrap: wrap;
        }

        .similarity-score-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 20px 28px;
          border-radius: 20px;
          border: 1.5px solid;
          min-width: 220px;
          flex-shrink: 0;
        }

        .similarity-score-box.score-low {
          background: #f0fdf4;
          border-color: #bbf7d0;
          color: #166534;
        }

        .similarity-score-box.score-medium {
          background: #fffbeb;
          border-color: #fde68a;
          color: #b45309;
        }

        .similarity-score-box.score-high {
          background: #fef2f2;
          border-color: #fecaca;
          color: #b91c1c;
        }

        .score-heading {
          font-size: 11.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 4px;
        }

        .score-number-row {
          display: flex;
          align-items: baseline;
          gap: 2px;
        }

        .score-val {
          font-size: 46px;
          font-weight: 900;
          line-height: 1;
        }

        .score-percent {
          font-size: 22px;
          font-weight: 800;
        }

        .score-status-badge {
          font-size: 11.5px;
          font-weight: 700;
          margin-top: 6px;
        }

        .disclaimer-alert-card {
          background: #f8faff;
          border: 1px solid rgba(99, 102, 241, 0.22);
          border-radius: 18px;
          padding: 16px 20px;
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .disclaimer-icon {
          color: #4f46e5;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .disclaimer-text {
          font-size: 13.5px;
          color: #334155;
          line-height: 1.6;
        }

        .disclaimer-text strong {
          color: #0f172a;
        }

        .disclaimer-text p {
          margin: 4px 0 0 0;
          color: #475569;
        }

        .report-tabs-bar {
          display: flex;
          gap: 10px;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 8px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .tab-btn {
          padding: 8px 18px;
          border-radius: 9999px;
          background: transparent;
          border: 1px solid transparent;
          color: #64748b;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .tab-btn:hover {
          color: #4f46e5;
          background: #f8faff;
        }

        .tab-btn.active {
          background: #4f46e5;
          color: #ffffff;
        }

        .passages-explorer-grid {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 20px;
          align-items: start;
        }

        .passages-sidebar-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 600px;
          overflow-y: auto;
        }

        .passage-nav-item {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 14px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .passage-nav-item:hover {
          border-color: #6366f1;
          background: #fcfdfe;
        }

        .passage-nav-item.selected {
          border-color: #4f46e5;
          background: #f8faff;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1);
        }

        .passage-item-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .passage-num {
          font-size: 12px;
          font-weight: 700;
          color: #0f172a;
        }

        .passage-score-badge {
          font-size: 11px;
          font-weight: 700;
          color: #b45309;
          background: #fef3c7;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .passage-snippet {
          font-size: 12.5px;
          color: #475569;
          line-height: 1.45;
          margin: 0 0 6px 0;
        }

        .passage-source-name {
          font-size: 11px;
          color: #94a3b8;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .passage-comparison-panel {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .comparison-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .comp-title-block {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .badge-passage-active {
          font-size: 12px;
          font-weight: 700;
          color: #0f172a;
          background: #f1f5f9;
          padding: 4px 10px;
          border-radius: 6px;
        }

        .similarity-pill {
          font-size: 12px;
          font-weight: 700;
          color: #b45309;
          background: #fef3c7;
          padding: 4px 10px;
          border-radius: 6px;
        }

        .badge-citation {
          font-size: 12px;
          font-weight: 700;
          color: #166534;
          background: #dcfce7;
          padding: 4px 10px;
          border-radius: 6px;
        }

        .comparison-body-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .comp-col {
          border-radius: 16px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .user-col {
          background: #fffdf5;
          border: 1px solid #fef08a;
        }

        .source-col {
          background: #f8faff;
          border: 1px solid #e0e7ff;
        }

        .col-header {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #64748b;
        }

        .highlighted-text {
          font-size: 14px;
          color: #1e293b;
          line-height: 1.6;
          margin: 0;
          background: rgba(254, 240, 138, 0.45);
          padding: 6px 8px;
          border-radius: 6px;
        }

        .matched-text {
          font-size: 14px;
          color: #1e293b;
          line-height: 1.6;
          margin: 0 0 14px 0;
          background: rgba(224, 231, 255, 0.6);
          padding: 6px 8px;
          border-radius: 6px;
        }

        .source-reference-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px;
        }

        .source-label {
          font-size: 10.5px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          display: block;
          margin-bottom: 2px;
        }

        .src-title {
          font-size: 13.5px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 2px 0;
        }

        .src-author {
          font-size: 12px;
          color: #64748b;
          margin: 0 0 6px 0;
        }

        .src-type-tag {
          font-size: 10px;
          font-weight: 700;
          background: #eef2ff;
          color: #4f46e5;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .passage-advice-card {
          background: #fcfbf7;
          border: 1px solid #f2eedb;
          border-radius: 16px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .advice-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sparkle-icon {
          font-size: 16px;
        }

        .advice-title {
          font-size: 13px;
          font-weight: 800;
          color: #854d0e;
        }

        .advice-text {
          font-size: 13.5px;
          color: #713f12;
          line-height: 1.55;
          margin: 0;
        }

        .btn-suggest-reform {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          border: 1px solid #d97706;
          color: #b45309;
          font-size: 12.5px;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 8px;
          cursor: pointer;
          align-self: flex-start;
          margin-top: 4px;
          transition: all 0.15s ease;
        }

        .btn-suggest-reform:hover {
          background: #fef3c7;
        }

        .reformulation-box {
          background: #ffffff;
          border: 1px solid #bbf7d0;
          border-radius: 12px;
          padding: 12px;
          margin-top: 4px;
        }

        .reform-title {
          font-size: 11px;
          font-weight: 800;
          color: #166534;
          text-transform: uppercase;
          display: block;
          margin-bottom: 4px;
        }

        .reform-content {
          font-size: 13px;
          color: #14532d;
          font-style: italic;
          line-height: 1.5;
          margin: 0;
        }

        .sources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 16px;
        }

        .source-full-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 18px;
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .src-card-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: #eef2ff;
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .src-kind-badge {
          font-size: 10px;
          font-weight: 800;
          color: #4f46e5;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          display: block;
          margin-bottom: 4px;
        }

        .src-card-title {
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px 0;
        }

        .src-card-author {
          font-size: 12.5px;
          color: #64748b;
          margin: 0;
        }

        .academic-guide-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 28px;
        }

        .guide-title {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 8px 0;
        }

        .guide-intro {
          font-size: 14px;
          color: #475569;
          line-height: 1.6;
          margin: 0 0 20px 0;
        }

        .advice-rules-list {
          list-style: none;
          padding: 0;
          margin: 0 0 24px 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .advice-rules-list li {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          font-size: 14px;
          color: #334155;
          line-height: 1.5;
        }

        .rule-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #eef2ff;
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 12px;
          flex-shrink: 0;
        }

        .standards-box {
          background: #f8faff;
          border: 1px solid #e0e7ff;
          border-radius: 14px;
          padding: 16px;
        }

        .standards-box h4 {
          font-size: 13px;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 10px 0;
        }

        .standards-items {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .standard-chip {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 13px;
          color: #334155;
        }

        @media (max-width: 900px) {
          .report-hero-card {
            flex-direction: column;
            align-items: stretch;
          }
          .passages-explorer-grid {
            grid-template-columns: 1fr;
          }
          .comparison-body-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
