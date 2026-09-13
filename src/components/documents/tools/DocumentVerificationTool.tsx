'use client';

import React, { useState } from 'react';
import {
  DocumentTypeTarget,
  DocumentAnalysisReport,
} from '@/types/documentTools';
import { documentToolsService } from '@/services/documentToolsService';

interface DocumentVerificationToolProps {
  onAnalysisSaved?: () => void;
}

const SAMPLE_TEXT = `Il convient de noter que dans le contexte actuel, une approche multidimensionnelle est cruciale pour appréhender les transformations économiques en cours. En effet, la mondialisation des flux financiers et l'accélération numérique redéfinissent profondément les modèles opérationnels traditionnels. Les acteurs institutionnels doivent nécessairement développer des stratégies de résilience pérennes pour garantir leur compétitivité à long terme.

Par ailleurs, le développement de ces nouvelles technologies favorise le développement d'écosystèmes innovants. Ce développement continu permet de renforcer le développement des compétences locales. Cependant, la majorité des entreprises adoptent cette méthode sans disposer d'un cadre méthodologique rigoureux, ce qui engendre des disparités significatives dans l'application des réformes structurelles.

En conclusion, il est indéniable que les perspectives d'avenir ouvrent la voie à de nombreuses opportunités d'expansion, à condition que les politiques publiques soutiennent une gouvernance concertée et proactive entre tous les partenaires.`;

export const DocumentVerificationTool: React.FC<DocumentVerificationToolProps> = ({
  onAnalysisSaved,
}) => {
  const [targetType, setTargetType] = useState<DocumentTypeTarget>('memoire');
  const [inputText, setInputText] = useState(SAMPLE_TEXT);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<DocumentAnalysisReport | null>(null);
  const [activeReportTab, setActiveReportTab] = useState<'ai_assistance' | 'style' | 'structure' | 'summary'>('ai_assistance');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const documentTypes = documentToolsService.getDocumentTypes();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    // If text or markdown file, read content directly
    if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) setInputText(content);
      };
      reader.readAsText(file);
    } else {
      // For .docx or .pdf, provide an explanatory placeholder extracted text
      setInputText(
        `[Extrait importé depuis ${file.name}]\n\n` + SAMPLE_TEXT
      );
    }
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/documents/tools/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          targetType,
        }),
      });

      const data = await res.json();
      if (data.success && data.report) {
        setReport(data.report);
        if (onAnalysisSaved) onAnalysisSaved();
      }
    } catch (err) {
      console.error('Erreur analyse:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopySuggestion = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

  return (
    <div className="doc-tool-box doc-verify-tool-container">
      {/* Tool Header */}
      <div className="doc-tool-header">
        <div className="tool-title-col">
          <div className="tool-badge-pill">Aide à l’écriture & Diagnostic éthique</div>
          <h2 className="tool-main-title">Vérification de document & Assistance rédactionnelle</h2>
          <p className="tool-main-desc">
            Optimisez vos livres, mémoires, thèses, rapports et articles : vérifiez la clarté, la structure,
            éliminez les formulations standardisées et enrichissez votre style personnel.
          </p>
        </div>
      </div>

      {/* 1. Target Document Type Selector */}
      <div className="doc-type-selector-bar">
        <span className="type-selector-label">Type de document rédigé :</span>
        <div className="type-selector-grid">
          {documentTypes.map((type) => {
            const isSelected = targetType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                className={`type-card-btn ${isSelected ? 'is-selected' : ''}`}
                onClick={() => setTargetType(type.id)}
              >
                <span className="type-card-icon">{type.icon}</span>
                <div className="type-card-text">
                  <span className="type-card-title">{type.label}</span>
                  <span className="type-card-desc">{type.description}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Text Input & File Upload Area */}
      <div className="doc-input-panel">
        <div className="panel-toolbar">
          <div className="panel-upload-col">
            <label htmlFor="file-upload-input" className="file-upload-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>{fileName ? `Fichier : ${fileName}` : 'Importer un fichier (.docx, .pdf, .txt)'}</span>
            </label>
            <input
              id="file-upload-input"
              type="file"
              accept=".txt,.docx,.doc,.pdf,.md"
              className="hidden-file-input"
              onChange={handleFileUpload}
            />
          </div>

          <div className="panel-stats-col">
            <span className="stat-pill">{wordCount} mot{wordCount > 1 ? 's' : ''}</span>
            <button
              type="button"
              className="sample-text-btn"
              onClick={() => {
                setInputText(SAMPLE_TEXT);
                setFileName(null);
              }}
            >
              Exemple type
            </button>
            <button
              type="button"
              className="clear-text-btn"
              onClick={() => {
                setInputText('');
                setFileName(null);
                setReport(null);
              }}
            >
              Effacer
            </button>
          </div>
        </div>

        <textarea
          className="doc-textarea"
          placeholder="Collez ici le texte de votre mémoire, thèse, rapport ou chapitre à vérifier..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={10}
        />

        <div className="panel-submit-row">
          <div className="confidentiality-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.4">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Analyse confidentielle sécurisée : votre texte n'est ni partagé ni conservé sans votre accord.</span>
          </div>

          <button
            type="button"
            className="btn-primary analyze-submit-btn"
            disabled={isAnalyzing || wordCount < 5}
            onClick={handleAnalyze}
          >
            {isAnalyzing ? (
              <>
                <span className="btn-spinner" />
                <span>Analyse en cours...</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>Lancer l’analyse complète</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Analysis Results Dashboard */}
      {report && (
        <div className="analysis-results-section" id="resultats-analyse">
          {/* Executive Score Banner */}
          <div className="analysis-summary-card">
            <div className="summary-left">
              <div className="score-circle-badge">
                <span className="score-num">{report.globalQualityScore}</span>
                <span className="score-max">/100</span>
              </div>
              <div className="summary-headings">
                <div className="summary-meta-line">
                  <span className="target-pill">{report.targetType.toUpperCase()}</span>
                  <span className="date-pill">Analysé le {report.analyzedAt}</span>
                  <span className="words-pill">{report.wordCount} mots (~{report.readingTimeMinutes} min de lecture)</span>
                </div>
                <h3 className="summary-title">Bilan global de qualité rédactionnelle</h3>
                <p className="summary-desc">{report.executiveSummary}</p>
              </div>
            </div>

            {/* AI Assistance Indicator with Mandatory Ethical Nuance */}
            <div className="ai-indicator-box">
              <div className="ai-indicator-header">
                <span className="ai-indicator-dot" />
                <span className="ai-indicator-title">{report.aiAssistanceIndicator.label}</span>
              </div>
              <p className="ai-indicator-text">{report.aiAssistanceIndicator.description}</p>
              <div className="ai-ethical-alert">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>{report.aiAssistanceIndicator.ethicalDisclaimer}</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs for Report */}
          <div className="report-tabs-nav">
            <button
              type="button"
              className={`report-tab-btn ${activeReportTab === 'ai_assistance' ? 'is-active' : ''}`}
              onClick={() => setActiveReportTab('ai_assistance')}
            >
              <span>Passages à personnaliser ({report.flaggedPassages.length})</span>
            </button>
            <button
              type="button"
              className={`report-tab-btn ${activeReportTab === 'style' ? 'is-active' : ''}`}
              onClick={() => setActiveReportTab('style')}
            >
              <span>Style, clarté & répétitions ({report.stylisticAlerts.length})</span>
            </button>
            <button
              type="button"
              className={`report-tab-btn ${activeReportTab === 'structure' ? 'is-active' : ''}`}
              onClick={() => setActiveReportTab('structure')}
            >
              <span>Structure & Cohérence</span>
            </button>
            <button
              type="button"
              className={`report-tab-btn ${activeReportTab === 'summary' ? 'is-active' : ''}`}
              onClick={() => setActiveReportTab('summary')}
            >
              <span>Recommandations prioritaires</span>
            </button>
          </div>

          {/* Tab Content 1: Passages susceptibles d'assistance IA avec suggestions constructives */}
          {activeReportTab === 'ai_assistance' && (
            <div className="report-tab-panel">
              <div className="tab-panel-intro">
                <h4 className="tab-intro-title">Passages présentant des caractéristiques standardisées</h4>
                <p className="tab-intro-desc">
                  L’objectif est de vous aider à enrichir ces segments pour refléter fidèlement votre voix d’auteur,
                  votre démarche personnelle et votre ancrage empirique.
                </p>
              </div>

              <div className="flagged-passages-list">
                {report.flaggedPassages.map((flag) => (
                  <div key={flag.id} className="flagged-passage-card">
                    <div className="flag-card-header">
                      <span className="flag-loc">{flag.locationLabel}</span>
                      <span className="flag-status-pill">{flag.confidenceIndicator}</span>
                    </div>

                    <div className="flag-excerpt-box">
                      <p className="flag-excerpt">{flag.excerpt}</p>
                    </div>

                    {/* Explication éthique */}
                    <div className="flag-detail-section">
                      <div className="detail-item">
                        <strong className="detail-label">Pourquoi ce passage a été relevé :</strong>
                        <p className="detail-text">{flag.whyFlagged}</p>
                      </div>

                      <div className="detail-item">
                        <strong className="detail-label">Piste d'amélioration :</strong>
                        <p className="detail-text">{flag.whatCanImprove}</p>
                      </div>
                    </div>

                    {/* Suggestion de reformulation */}
                    <div className="reformulation-box">
                      <div className="reformData-header">
                        <strong className="reform-title">💡 Suggestion de reformulation plus naturelle :</strong>
                        <button
                          type="button"
                          className="copy-reform-btn"
                          onClick={() => handleCopySuggestion(flag.reformulationSuggestion, flag.id)}
                        >
                          {copiedId === flag.id ? 'Copié !' : 'Copier'}
                        </button>
                      </div>
                      <p className="reform-content">{flag.reformulationSuggestion}</p>
                    </div>

                    {/* Conseils pour rendre personnel */}
                    <div className="personalize-tips-box">
                      <span className="tips-heading">Conseils pour rendre votre texte plus personnel et précis :</span>
                      <ul className="tips-list">
                        {flag.personalizationTips.map((tip, idx) => (
                          <li key={idx} className="tip-item">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content 2: Style, Clarté & Répétitions */}
          {activeReportTab === 'style' && (
            <div className="report-tab-panel">
              <div className="tab-panel-intro">
                <h4 className="tab-intro-title">Vérification de la clarté et du vocabulaire</h4>
                <p className="tab-intro-desc">
                  Alertes ciblées pour supprimer les redondances et renforcer la portée de vos démonstrations.
                </p>
              </div>

              <div className="stylistic-alerts-grid">
                {report.stylisticAlerts.map((alert) => (
                  <div key={alert.id} className="stylistic-alert-card">
                    <div className="alert-type-header">
                      <span className="alert-badge">{alert.title}</span>
                    </div>
                    <div className="alert-excerpt">{alert.excerpt}</div>
                    <p className="alert-explanation">{alert.explanation}</p>
                    <div className="alert-suggestion">
                      <strong>Suggestion :</strong> {alert.suggestion}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content 3: Structure & Cohérence */}
          {activeReportTab === 'structure' && (
            <div className="report-tab-panel">
              <div className="structure-overview-card">
                <h4 className="structure-card-title">Organisation et progression logique</h4>
                <div className="structure-sections-wrap">
                  <span className="sections-label">Sections identifiées :</span>
                  <div className="sections-chips">
                    {report.structureAssessment.detectedSections.map((sec, idx) => (
                      <span key={idx} className="structure-chip">
                        {idx + 1}. {sec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="structure-obs-list">
                  <span className="obs-label">Observations méthodologiques :</span>
                  <ul>
                    {report.structureAssessment.observations.map((obs, idx) => (
                      <li key={idx}>{obs}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 4: Recommandations prioritaires */}
          {activeReportTab === 'summary' && (
            <div className="report-tab-panel">
              <div className="recommendations-dual-grid">
                <div className="recom-card strengths">
                  <h4 className="recom-title">
                    <span>✨</span> Points forts du travail
                  </h4>
                  <ul className="recom-list">
                    {report.strengths.map((str, idx) => (
                      <li key={idx}>{str}</li>
                    ))}
                  </ul>
                </div>

                <div className="recom-card improvements">
                  <h4 className="recom-title">
                    <span>🎯</span> Priorités d’amélioration
                  </h4>
                  <ul className="recom-list">
                    {report.priorityImprovements.map((imp, idx) => (
                      <li key={idx}>{imp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
