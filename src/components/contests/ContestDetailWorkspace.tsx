'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Contest, ContestPaperResource } from '@/types/contest';

interface ContestDetailWorkspaceProps {
  contest: Contest;
  onBack: () => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

type ResourceTypeFilter = 'all' | 'sujet' | 'correction' | 'exercice' | 'fascicule' | 'qcm';

export const ContestDetailWorkspace: React.FC<ContestDetailWorkspaceProps> = ({
  contest,
  onBack,
  onOpenAuth,
}) => {
  const router = useRouter();

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ResourceTypeFilter>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  // Glass Info Modal State
  const [isGlassModalOpen, setIsGlassModalOpen] = useState(false);

  // Active Document Reader Modal (preview)
  const [activeReadingPaper, setActiveReadingPaper] = useState<ContestPaperResource | null>(null);

  const subjects = contest.subjects || [];
  const papers = contest.papers || [];
  const conditions = contest.conditions || [];

  // Available session years from papers
  const availableYears = useMemo(() => {
    const yearsSet = new Set<number>();
    papers.forEach((p) => {
      if (p.year) yearsSet.add(p.year);
    });
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [papers]);

  // Counts by type
  const counts = useMemo(() => {
    return {
      all: papers.length,
      sujet: papers.filter((p) => p.type === 'sujet').length,
      correction: papers.filter((p) => p.type === 'correction').length,
      exercice: papers.filter((p) => p.type === 'exercice').length,
      fascicule: papers.filter((p) => p.type === 'fascicule').length,
      qcm: papers.filter((p) => p.type === 'qcm').length,
    };
  }, [papers]);

  // Filtered papers
  const filteredPapers = useMemo(() => {
    return papers.filter((paper) => {
      // 1. Text Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = paper.title.toLowerCase().includes(query);
        const matchesSubject = paper.subjectName.toLowerCase().includes(query);
        const matchesAuthor = paper.authorOrSource?.toLowerCase().includes(query) ?? false;
        const matchesYear = paper.year.toString().includes(query);
        if (!matchesTitle && !matchesSubject && !matchesAuthor && !matchesYear) {
          return false;
        }
      }

      // 2. Resource Type
      if (selectedType !== 'all' && paper.type !== selectedType) {
        return false;
      }

      // 3. Subject
      if (selectedSubject !== 'all' && paper.subjectName !== selectedSubject) {
        return false;
      }

      // 4. Year
      if (selectedYear !== 'all' && paper.year.toString() !== selectedYear) {
        return false;
      }

      return true;
    });
  }, [papers, searchQuery, selectedType, selectedSubject, selectedYear]);

  const handleOpenAiRevision = (paper: ContestPaperResource) => {
    const prompt = `Aide-moi à réviser pour le concours ${contest.name} : ${paper.title} (${paper.subjectName}). Peux-tu me résumer les notions clés, les pièges classiques et me poser des questions d'entraînement ?`;
    router.push(`/ia?prompt=${encodeURIComponent(prompt)}`);
  };

  const handleConsultPaper = (paper: ContestPaperResource) => {
    setActiveReadingPaper(paper);
  };

  const getTypeLabel = (type: ContestPaperResource['type']) => {
    switch (type) {
      case 'sujet':
        return 'Sujet officiel';
      case 'correction':
        return 'Corrigé d’excellence';
      case 'exercice':
        return 'Série d’exercices';
      case 'fascicule':
        return 'Fascicule méthodologique';
      case 'qcm':
        return 'QCM interactif';
      default:
        return 'Ressource';
    }
  };

  const getTypeBadgeClass = (type: ContestPaperResource['type']) => {
    switch (type) {
      case 'sujet':
        return 'type-badge-sujet';
      case 'correction':
        return 'type-badge-correction';
      case 'exercice':
        return 'type-badge-exercice';
      case 'fascicule':
        return 'type-badge-fascicule';
      case 'qcm':
        return 'type-badge-qcm';
      default:
        return 'type-badge-default';
    }
  };

  return (
    <div className="contest-library-view">
      {/* 1. Header / Breadcrumb & Contest Identity */}
      <section className="contest-top-header">
        <div className="header-navigation-row">
          <button type="button" className="back-btn" onClick={onBack}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Retour à tous les concours</span>
          </button>

          <div className="status-session-badges">
            <span className="session-pill">Session {contest.sessionYear}</span>
            <span className={`status-pill ${contest.status}`}>
              {contest.status === 'open' ? '● Inscriptions ouvertes' : contest.status === 'upcoming' ? '○ Session à venir' : '✕ Fermé'}
            </span>
          </div>
        </div>

        {/* Identity Card Bar */}
        <div className="contest-identity-bar">
          <div className="identity-left">
            <div className="contest-logo-box">
              {contest.coverImage ? (
                <img
                  src={contest.coverImage}
                  alt={contest.name}
                  className="contest-logo-img"
                />
              ) : (
                <span className="contest-logo-fallback">{contest.name.slice(0, 3)}</span>
              )}
            </div>

            <div className="contest-titles">
              <div className="title-row">
                <h1 className="contest-name">{contest.name}</h1>
                <span className="diploma-badge">{contest.diplomaLabel}</span>
              </div>
              <p className="contest-full-name">{contest.fullName}</p>
              <p className="contest-org-line">
                Organisé par : <strong>{contest.organization}</strong>
              </p>
            </div>
          </div>

          <div className="identity-right">
            {/* Glass info button */}
            <button
              type="button"
              className="glass-info-trigger-btn"
              onClick={() => setIsGlassModalOpen(true)}
              title="Consulter les dates, conditions et informations officielles"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="8" />
              </svg>
              <span>Infos & Dates du concours</span>
              <span className="sparkle-chip">Officiel</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Direct Search Capsule (style Bibliothèque) */}
      <section className="search-and-filters-section">
        <div className="search-capsule-wrapper">
          <div className="search-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          <input
            type="text"
            className="search-input"
            placeholder={`Rechercher une annale, un corrigé, un exercice de ${contest.name} (ex: Mathématiques, Français, 2024)...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label={`Rechercher dans ${contest.name}`}
          />

          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Effacer la recherche"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}

          <div className="results-counter-chip">
            <span>{filteredPapers.length} ressource{filteredPapers.length > 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* 3. Filter Pills Row */}
        <div className="filters-container">
          {/* Row A: Resource Types */}
          <div className="filter-pills-row">
            <button
              type="button"
              className={`filter-pill ${selectedType === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedType('all')}
            >
              <span>Tout voir</span>
              <span className="pill-count">{counts.all}</span>
            </button>

            <button
              type="button"
              className={`filter-pill ${selectedType === 'sujet' ? 'active' : ''}`}
              onClick={() => setSelectedType('sujet')}
            >
              <span className="pill-icon">📚</span>
              <span>Sujets officiels</span>
              <span className="pill-count">{counts.sujet}</span>
            </button>

            <button
              type="button"
              className={`filter-pill ${selectedType === 'correction' ? 'active' : ''}`}
              onClick={() => setSelectedType('correction')}
            >
              <span className="pill-icon">✓</span>
              <span>Corrigés détaillés</span>
              <span className="pill-count">{counts.correction}</span>
            </button>

            <button
              type="button"
              className={`filter-pill ${selectedType === 'exercice' ? 'active' : ''}`}
              onClick={() => setSelectedType('exercice')}
            >
              <span className="pill-icon">📝</span>
              <span>Exercices associés</span>
              <span className="pill-count">{counts.exercice}</span>
            </button>

            <button
              type="button"
              className={`filter-pill ${selectedType === 'fascicule' ? 'active' : ''}`}
              onClick={() => setSelectedType('fascicule')}
            >
              <span className="pill-icon">📖</span>
              <span>Fascicules</span>
              <span className="pill-count">{counts.fascicule}</span>
            </button>

            {counts.qcm > 0 && (
              <button
                type="button"
                className={`filter-pill ${selectedType === 'qcm' ? 'active' : ''}`}
                onClick={() => setSelectedType('qcm')}
              >
                <span className="pill-icon">🎯</span>
                <span>QCM interactifs</span>
                <span className="pill-count">{counts.qcm}</span>
              </button>
            )}
          </div>

          {/* Row B: Subjects chips + Year Selector */}
          <div className="secondary-filters-row">
            <div className="subjects-chips-wrap">
              <span className="filter-label">Matière :</span>
              <button
                type="button"
                className={`subject-chip ${selectedSubject === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedSubject('all')}
              >
                Toutes
              </button>
              {subjects.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  className={`subject-chip ${selectedSubject === sub.name ? 'active' : ''}`}
                  onClick={() => setSelectedSubject(sub.name === selectedSubject ? 'all' : sub.name)}
                >
                  {sub.name}
                </button>
              ))}
            </div>

            {availableYears.length > 0 && (
              <div className="year-selector-wrap">
                <span className="filter-label">Session :</span>
                <select
                  className="year-dropdown"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  aria-label="Filtrer par année de session"
                >
                  <option value="all">Toutes les années</option>
                  {availableYears.map((yr) => (
                    <option key={yr} value={yr.toString()}>
                      Session {yr}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Book / Paper Cards Grid */}
      <section className="papers-grid-section">
        {filteredPapers.length === 0 ? (
          <div className="empty-results-box">
            <div className="empty-icon">🔍</div>
            <h3 className="empty-title">Aucune ressource trouvée</h3>
            <p className="empty-desc">
              Aucun document ne correspond à vos critères de recherche actuels.
            </p>
            <button
              type="button"
              className="reset-filters-btn"
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
                setSelectedSubject('all');
                setSelectedYear('all');
              }}
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="papers-grid">
            {filteredPapers.map((paper) => (
              <article key={paper.id} className="paper-card">
                {/* Top Media / Book Representation */}
                <div className="paper-cover-top">
                  <div className="cover-spine" />
                  <div className="cover-badge-row">
                    <span className={`paper-type-badge ${getTypeBadgeClass(paper.type)}`}>
                      {getTypeLabel(paper.type)}
                    </span>
                    <span className="paper-year-pill">Session {paper.year}</span>
                  </div>

                  <div className="cover-center-motif">
                    <div className="motif-icon">
                      {paper.type === 'correction' ? '✓' : paper.type === 'exercice' ? '📝' : paper.type === 'fascicule' ? '📖' : paper.type === 'qcm' ? '🎯' : '📄'}
                    </div>
                    <span className="motif-sub">{paper.subjectName}</span>
                  </div>

                  <div className="cover-footer-meta">
                    <span className="format-badge">{paper.format.toUpperCase()} • {paper.pagesCount} pages</span>
                    {paper.accessLevel === 'free' ? (
                      <span className="access-tag free">Gratuit</span>
                    ) : (
                      <span className="access-tag premium">★ Premium</span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="paper-card-body">
                  <h3 className="paper-title" title={paper.title}>
                    {paper.title}
                  </h3>

                  <div className="paper-meta-details">
                    <div className="detail-item">
                      <span className="detail-label">Matière :</span>
                      <span className="detail-value">{paper.subjectName}</span>
                    </div>
                    {paper.authorOrSource && (
                      <div className="detail-item">
                        <span className="detail-label">Source :</span>
                        <span className="detail-value">{paper.authorOrSource}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="paper-actions">
                    <button
                      type="button"
                      className="consult-doc-btn"
                      onClick={() => handleConsultPaper(paper)}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span>Consulter</span>
                    </button>

                    <button
                      type="button"
                      className="ai-revise-btn"
                      onClick={() => handleOpenAiRevision(paper)}
                      title="S'entraîner et poser des questions avec l'assistant IA"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                      </svg>
                      <span>Réviser avec l’IA</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 5. Frosted Glass Info Modal (« Page Glacée ») */}
      {isGlassModalOpen && (
        <div
          className="glass-modal-backdrop"
          onClick={() => setIsGlassModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="glass-modal-title"
        >
          <div
            className="glass-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Aurora glow inside the glass card */}
            <div className="glass-ambient-aura" />

            {/* Modal Header */}
            <div className="glass-modal-header">
              <div className="glass-header-left">
                <div className="glass-logo-box">
                  {contest.coverImage ? (
                    <img src={contest.coverImage} alt={contest.name} className="glass-logo-img" />
                  ) : (
                    <span className="glass-logo-fallback">{contest.name.slice(0, 3)}</span>
                  )}
                </div>
                <div>
                  <div className="glass-pill-badge">
                    <span className="pulse-dot" />
                    <span>Fiche officielle & Calendrier</span>
                  </div>
                  <h2 id="glass-modal-title" className="glass-title">{contest.name}</h2>
                  <p className="glass-subtitle">{contest.fullName}</p>
                </div>
              </div>

              <button
                type="button"
                className="glass-close-btn"
                onClick={() => setIsGlassModalOpen(false)}
                aria-label="Fermer la fiche d'informations"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="glass-modal-body">
              {/* Calendrier & Statut */}
              <div className="glass-section-box">
                <h3 className="section-heading">
                  <span className="icon">📅</span>
                  <span>Calendrier de la session {contest.sessionYear}</span>
                </h3>

                <div className="timeline-cards-grid">
                  <div className="timeline-card">
                    <span className="t-label">Statut officiel</span>
                    <span className={`t-val status ${contest.status}`}>
                      {contest.status === 'open' ? 'Inscriptions en cours' : contest.status === 'upcoming' ? 'Session à venir' : 'Inscriptions clôturées'}
                    </span>
                  </div>

                  <div className="timeline-card">
                    <span className="t-label">Date limite de dépôt</span>
                    <span className="t-val highlight">
                      {contest.applicationDeadline || 'Non communiquée'}
                    </span>
                  </div>

                  <div className="timeline-card">
                    <span className="t-label">Date des épreuves écrites</span>
                    <span className="t-val highlight">
                      {contest.examDate || 'À fixer par arrêté ministériel'}
                    </span>
                  </div>

                  <div className="timeline-card">
                    <span className="t-label">Niveau d’entrée requis</span>
                    <span className="t-val">
                      {contest.diplomaLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Présentation du Concours */}
              <div className="glass-section-box">
                <h3 className="section-heading">
                  <span className="icon">🏛️</span>
                  <span>Présentation & Missions</span>
                </h3>
                <p className="description-text">
                  {contest.longDescription}
                </p>
                <div className="org-chip">
                  <span>Organisme de tutelle :</span>
                  <strong>{contest.organization}</strong>
                </div>
              </div>

              {/* Conditions d'accès officielles */}
              {conditions.length > 0 && (
                <div className="glass-section-box">
                  <h3 className="section-heading">
                    <span className="icon">📜</span>
                    <span>Conditions d’accès & Éligibilité</span>
                  </h3>
                  <div className="conditions-list">
                    {conditions.map((cond) => (
                      <div key={cond.id} className="condition-row">
                        <div className="cond-check">✓</div>
                        <div className="cond-content">
                          <strong className="cond-title">{cond.title}</strong>
                          <p className="cond-desc">{cond.description}</p>
                        </div>
                        {cond.isMandatory && (
                          <span className="mandatory-pill">Obligatoire</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matières au programme */}
              {subjects.length > 0 && (
                <div className="glass-section-box">
                  <h3 className="section-heading">
                    <span className="icon">📚</span>
                    <span>Matières évaluées au concours</span>
                  </h3>
                  <div className="subjects-chips-grid">
                    {subjects.map((sub) => (
                      <div key={sub.id} className="subject-box">
                        <strong className="sub-title">{sub.name}</strong>
                        <p className="sub-desc">{sub.description}</p>
                        <span className="sub-count">{sub.resourcesCount} ressources disponibles</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="glass-modal-footer">
              <span className="footer-note">
                Toutes les annales, corrigés et fascicules ci-dessous sont conformes au programme officiel.
              </span>
              <button
                type="button"
                className="close-glass-action-btn"
                onClick={() => setIsGlassModalOpen(false)}
              >
                Fermer la fiche
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Active Document Reader / Preview Modal */}
      {activeReadingPaper && (
        <div
          className="glass-modal-backdrop"
          onClick={() => setActiveReadingPaper(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="reader-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="reader-header">
              <div>
                <span className={`paper-type-badge ${getTypeBadgeClass(activeReadingPaper.type)}`}>
                  {getTypeLabel(activeReadingPaper.type)}
                </span>
                <h3 className="reader-title">{activeReadingPaper.title}</h3>
                <p className="reader-meta">
                  {activeReadingPaper.subjectName} • Session {activeReadingPaper.year} • {activeReadingPaper.pagesCount} pages
                </p>
              </div>
              <button
                type="button"
                className="glass-close-btn"
                onClick={() => setActiveReadingPaper(null)}
              >
                ✕
              </button>
            </div>

            <div className="reader-body">
              <div className="preview-document-frame">
                <div className="preview-watermark">
                  <span>DOCUMENT OFFICIEL SUNUBIBLIO</span>
                  <p>Concours {contest.name} — {activeReadingPaper.title}</p>
                </div>
                <div className="preview-text-sample">
                  <h4>RÉPUBLIQUE DU SÉNÉGAL</h4>
                  <p>{contest.organization}</p>
                  <h5>SESSION {activeReadingPaper.year} — ÉPREUVE DE {activeReadingPaper.subjectName.toUpperCase()}</h5>
                  <hr />
                  <p className="sample-instructions">
                    Durée de l’épreuve : 4 heures • Coefficient : 3<br />
                    L’usage des calculatrices et documents personnels est soumis aux consignes du président de jury.
                  </p>
                  <div className="sample-questions-box">
                    <strong>Extrait du Sujet / Document :</strong>
                    <p>
                      1. Analyse théorique et étude des notions fondamentales du programme officiel.<br />
                      2. Problème d’application pratique et synthèse méthodologique.<br />
                      3. Questions de réflexion critique et de raisonnement professionnel.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="reader-footer">
              <button
                type="button"
                className="btn-download"
                onClick={() => alert(`Téléchargement de « ${activeReadingPaper.title} » initié avec succès.`)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Télécharger le PDF complet ({activeReadingPaper.pagesCount} p.)</span>
              </button>

              <button
                type="button"
                className="btn-ai-tutor"
                onClick={() => {
                  const paper = activeReadingPaper;
                  setActiveReadingPaper(null);
                  handleOpenAiRevision(paper);
                }}
              >
                <span>✦ Poser une question à SunuIA sur ce sujet</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .contest-library-view {
          display: flex;
          flex-direction: column;
          gap: 24px;
          padding-bottom: 60px;
          background: #ffffff;
        }

        /* 1. TOP HEADER */
        .contest-top-header {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .header-navigation-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 8px;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: none;
          color: #475569;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          padding: 6px 12px;
          border-radius: 9999px;
          transition: all 0.2s ease;
        }

        .back-btn:hover {
          color: #d97706;
          background: #fef3c7;
          transform: translateX(-2px);
        }

        .status-session-badges {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .session-pill {
          font-size: 11.5px;
          font-weight: 700;
          color: #475569;
          background: #f1f5f9;
          padding: 4px 10px;
          border-radius: 9999px;
          border: 1px solid #e2e8f0;
        }

        .status-pill {
          font-size: 11.5px;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 9999px;
        }

        .status-pill.open {
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
        }

        .status-pill.upcoming {
          background: #fef3c7;
          color: #b45309;
          border: 1px solid #fde68a;
        }

        .status-pill.closed {
          background: #f1f5f9;
          color: #64748b;
          border: 1px solid #cbd5e1;
        }

        /* Identity Bar */
        .contest-identity-bar {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 20px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.04);
        }

        .identity-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .contest-logo-box {
          width: 80px;
          height: 80px;
          border-radius: 16px;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
          flex-shrink: 0;
        }

        .contest-logo-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .contest-logo-fallback {
          font-size: 22px;
          font-weight: 900;
          color: #d97706;
        }

        .contest-titles {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .title-row {
          display: flex;
          align-items: baseline;
          gap: 12px;
        }

        .contest-name {
          font-size: 26px;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .diploma-badge {
          font-size: 11.5px;
          font-weight: 700;
          color: #4f46e5;
          background: #eef2ff;
          padding: 3px 9px;
          border-radius: 6px;
          border: 1px solid rgba(199, 210, 254, 0.8);
        }

        .contest-full-name {
          font-size: 14px;
          color: #475569;
          font-weight: 600;
          margin: 0;
        }

        .contest-org-line {
          font-size: 12.5px;
          color: #64748b;
          margin: 0;
        }

        .identity-right {
          display: flex;
          align-items: center;
        }

        /* Glass trigger button */
        .glass-info-trigger-btn {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          height: 44px;
          padding: 0 20px;
          font-size: 13.5px;
          font-weight: 700;
          color: #0f172a;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border: 1.5px solid rgba(245, 158, 11, 0.35);
          border-radius: 9999px;
          box-shadow: 0 4px 14px rgba(217, 119, 6, 0.12);
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .glass-info-trigger-btn:hover {
          background: #ffffff;
          border-color: #f59e0b;
          box-shadow: 0 6px 20px rgba(217, 119, 6, 0.22);
          transform: translateY(-1px);
        }

        .sparkle-chip {
          font-size: 10px;
          font-weight: 800;
          color: #ffffff;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          padding: 2px 7px;
          border-radius: 9999px;
          text-transform: uppercase;
        }

        /* 2. SEARCH AND FILTERS SECTION */
        .search-and-filters-section {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 20px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.03);
        }

        .search-capsule-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: #ffffff;
          border: 1.5px solid rgba(226, 232, 240, 0.95);
          border-radius: 9999px;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.03);
          transition: all 0.2s ease;
        }

        .search-capsule-wrapper:focus-within {
          border-color: #f59e0b;
          box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.12);
        }

        .search-icon-wrap {
          padding-left: 18px;
          color: #94a3b8;
          display: flex;
          align-items: center;
        }

        .search-input {
          flex: 1;
          height: 48px;
          border: none;
          outline: none;
          background: transparent;
          padding: 0 14px;
          font-size: 14.5px;
          color: #0f172a;
          font-weight: 500;
        }

        .search-input::placeholder {
          color: #94a3b8;
        }

        .search-clear-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          padding: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .results-counter-chip {
          padding-right: 18px;
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          white-space: nowrap;
        }

        /* 3. FILTERS ROWS */
        .filters-container {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .filter-pills-row {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 2px;
          scrollbar-width: none;
        }

        .filter-pills-row::-webkit-scrollbar {
          display: none;
        }

        .filter-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          height: 38px;
          padding: 0 16px;
          font-size: 13px;
          font-weight: 700;
          color: #475569;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 9999px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.18s ease;
        }

        .filter-pill:hover {
          color: #0f172a;
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .filter-pill.active {
          color: #ffffff;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          border-color: transparent;
          box-shadow: 0 3px 10px rgba(217, 119, 6, 0.3);
        }

        .pill-count {
          font-size: 11px;
          padding: 1px 6px;
          border-radius: 9999px;
          background: rgba(0, 0, 0, 0.08);
        }

        .filter-pill.active .pill-count {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }

        /* Secondary Row */
        .secondary-filters-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          padding-top: 10px;
          border-top: 1px solid rgba(226, 232, 240, 0.65);
        }

        .subjects-chips-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .filter-label {
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          margin-right: 4px;
        }

        .subject-chip {
          height: 30px;
          padding: 0 12px;
          font-size: 12px;
          font-weight: 600;
          color: #475569;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .subject-chip:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .subject-chip.active {
          background: #eef2ff;
          color: #4f46e5;
          border-color: #c7d2fe;
          font-weight: 700;
        }

        .year-selector-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .year-dropdown {
          height: 32px;
          padding: 0 12px;
          font-size: 12px;
          font-weight: 700;
          color: #0f172a;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          outline: none;
          cursor: pointer;
        }

        /* 4. PAPERS GRID */
        .papers-grid-section {
          display: flex;
          flex-direction: column;
        }

        .papers-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        .paper-card {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 18px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.03);
          transition: all 0.25s ease;
        }

        .paper-card:hover {
          transform: translateY(-4px);
          border-color: rgba(245, 158, 11, 0.45);
          box-shadow: 0 14px 30px -4px rgba(217, 119, 6, 0.12), 0 4px 12px rgba(15, 23, 42, 0.04);
        }

        /* Book cover top presentation */
        .paper-cover-top {
          height: 140px;
          position: relative;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-bottom: 1px solid #e2e8f0;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .cover-spine {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 5px;
          background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
        }

        .cover-badge-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-left: 6px;
        }

        .paper-type-badge {
          font-size: 10px;
          font-weight: 800;
          padding: 3px 9px;
          border-radius: 9999px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .type-badge-sujet {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .type-badge-correction {
          background: #dcfce7;
          color: #15803d;
        }

        .type-badge-exercice {
          background: #ede9fe;
          color: #6d28d9;
        }

        .type-badge-fascicule {
          background: #fef3c7;
          color: #b45309;
        }

        .type-badge-qcm {
          background: #fae8ff;
          color: #a21caf;
        }

        .type-badge-default {
          background: #f1f5f9;
          color: #475569;
        }

        .paper-year-pill {
          font-size: 11px;
          font-weight: 700;
          color: #475569;
          background: #ffffff;
          padding: 2px 8px;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }

        .cover-center-motif {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-left: 6px;
        }

        .motif-icon {
          font-size: 24px;
        }

        .motif-sub {
          font-size: 12px;
          font-weight: 700;
          color: #334155;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .cover-footer-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-left: 6px;
        }

        .format-badge {
          font-size: 10.5px;
          font-weight: 700;
          color: #64748b;
        }

        .access-tag {
          font-size: 10px;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 4px;
        }

        .access-tag.free {
          background: #ecfdf5;
          color: #059669;
        }

        .access-tag.premium {
          background: #fef3c7;
          color: #b45309;
        }

        /* Card Body */
        .paper-card-body {
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .paper-title {
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.4;
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 42px;
        }

        .paper-meta-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 16px;
          padding-top: 8px;
          border-top: 1px solid #f1f5f9;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
        }

        .detail-label {
          color: #94a3b8;
          font-weight: 600;
        }

        .detail-value {
          color: #475569;
          font-weight: 700;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .paper-actions {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .consult-doc-btn {
          width: 100%;
          height: 38px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #ffffff;
          border: none;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 3px 10px rgba(217, 119, 6, 0.25);
          transition: all 0.2s ease;
        }

        .consult-doc-btn:hover {
          background: linear-gradient(135deg, #fbbf24 0%, #ea580c 100%);
          box-shadow: 0 6px 14px rgba(217, 119, 6, 0.35);
          transform: translateY(-1px);
        }

        .ai-revise-btn {
          width: 100%;
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: #ffffff;
          color: #7c3aed;
          border: 1px solid #ddd6fe;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .ai-revise-btn:hover {
          background: #f5f3ff;
          border-color: #c4b5fd;
          color: #6d28d9;
        }

        /* Empty state */
        .empty-results-box {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 48px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .empty-icon {
          font-size: 36px;
        }

        .empty-title {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .empty-desc {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }

        .reset-filters-btn {
          margin-top: 8px;
          height: 38px;
          padding: 0 18px;
          font-size: 13px;
          font-weight: 700;
          background: #f1f5f9;
          color: #0f172a;
          border: 1px solid #cbd5e1;
          border-radius: 9999px;
          cursor: pointer;
        }

        /* 5. FROSTED GLASS MODAL (« Page Glacée ») */
        .glass-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(16px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: fadeIn 0.2s ease-out;
        }

        .glass-modal-card {
          position: relative;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(28px);
          border: 1.5px solid rgba(255, 255, 255, 0.9);
          border-radius: 24px;
          box-shadow: 0 25px 60px -10px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(226, 232, 240, 0.5);
          width: 100%;
          max-width: 760px;
          max-height: 88vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .glass-ambient-aura {
          position: absolute;
          top: -100px;
          right: -100px;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .glass-modal-header {
          padding: 24px 28px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .glass-header-left {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .glass-logo-box {
          width: 64px;
          height: 64px;
          border-radius: 14px;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
          flex-shrink: 0;
        }

        .glass-logo-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .glass-logo-fallback {
          font-size: 18px;
          font-weight: 900;
          color: #d97706;
        }

        .glass-pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          color: #b45309;
          background: #fef3c7;
          padding: 2px 8px;
          border-radius: 9999px;
          margin-bottom: 4px;
        }

        .pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #d97706;
        }

        .glass-title {
          font-size: 22px;
          font-weight: 900;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .glass-subtitle {
          font-size: 13px;
          color: #475569;
          font-weight: 600;
          margin: 0;
        }

        .glass-close-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          color: #475569;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .glass-close-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .glass-modal-body {
          padding: 24px 28px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .glass-section-box {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .section-heading {
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .timeline-cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .timeline-card {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 12px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .t-label {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
        }

        .t-val {
          font-size: 14px;
          font-weight: 800;
          color: #0f172a;
        }

        .t-val.highlight {
          color: #d97706;
        }

        .t-val.status.open {
          color: #059669;
        }

        .t-val.status.upcoming {
          color: #b45309;
        }

        .description-text {
          font-size: 13.5px;
          color: #334155;
          line-height: 1.55;
          margin: 0;
        }

        .org-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          color: #475569;
          background: #f8fafc;
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          width: fit-content;
        }

        /* Conditions */
        .conditions-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .condition-row {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 10px 14px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .cond-check {
          color: #10b981;
          font-weight: 900;
          font-size: 14px;
          line-height: 1.4;
        }

        .cond-content {
          flex: 1;
        }

        .cond-title {
          font-size: 13px;
          font-weight: 800;
          color: #0f172a;
          display: block;
          margin-bottom: 2px;
        }

        .cond-desc {
          font-size: 12px;
          color: #64748b;
          margin: 0;
          line-height: 1.4;
        }

        .mandatory-pill {
          font-size: 10px;
          font-weight: 800;
          color: #b45309;
          background: #fef3c7;
          padding: 2px 6px;
          border-radius: 4px;
        }

        /* Subjects chips grid */
        .subjects-chips-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .subject-box {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sub-title {
          font-size: 13px;
          font-weight: 800;
          color: #0f172a;
        }

        .sub-desc {
          font-size: 11.5px;
          color: #64748b;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .sub-count {
          font-size: 10.5px;
          font-weight: 700;
          color: #4f46e5;
          margin-top: 4px;
        }

        .glass-modal-footer {
          padding: 16px 28px;
          background: rgba(248, 250, 252, 0.9);
          border-top: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .footer-note {
          font-size: 12px;
          color: #64748b;
          font-style: italic;
        }

        .close-glass-action-btn {
          height: 38px;
          padding: 0 20px;
          font-size: 13px;
          font-weight: 700;
          background: #0f172a;
          color: #ffffff;
          border: none;
          border-radius: 9999px;
          cursor: pointer;
        }

        /* 6. READER PREVIEW MODAL */
        .reader-modal-card {
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
          max-width: 680px;
          width: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.2s ease;
        }

        .reader-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .reader-title {
          font-size: 17px;
          font-weight: 800;
          color: #0f172a;
          margin: 6px 0 2px 0;
        }

        .reader-meta {
          font-size: 12px;
          color: #64748b;
          margin: 0;
        }

        .reader-body {
          padding: 24px;
          background: #f8fafc;
        }

        .preview-document-frame {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          padding: 28px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
        }

        .preview-watermark {
          font-size: 11px;
          font-weight: 800;
          color: #cbd5e1;
          text-align: center;
          margin-bottom: 16px;
          letter-spacing: 0.08em;
        }

        .preview-text-sample {
          text-align: center;
        }

        .preview-text-sample h4 {
          margin: 0;
          font-size: 14px;
          color: #0f172a;
        }

        .preview-text-sample p {
          margin: 2px 0;
          font-size: 12px;
          color: #64748b;
        }

        .preview-text-sample h5 {
          margin: 12px 0 6px 0;
          font-size: 13px;
          color: #d97706;
          font-weight: 800;
        }

        .sample-instructions {
          font-size: 11.5px;
          color: #475569;
          font-style: italic;
          margin: 10px 0;
        }

        .sample-questions-box {
          text-align: left;
          background: #f8fafc;
          border-left: 3px solid #d97706;
          padding: 12px 14px;
          border-radius: 6px;
          margin-top: 16px;
          font-size: 12.5px;
          color: #334155;
          line-height: 1.5;
        }

        .reader-footer {
          padding: 16px 24px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 12px;
          justify-content: flex-end;
          background: #ffffff;
        }

        .btn-download {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 40px;
          padding: 0 18px;
          font-size: 13px;
          font-weight: 700;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #ffffff;
          border: none;
          border-radius: 9999px;
          cursor: pointer;
        }

        .btn-ai-tutor {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 40px;
          padding: 0 16px;
          font-size: 12.5px;
          font-weight: 700;
          background: #f5f3ff;
          color: #6d28d9;
          border: 1px solid #ddd6fe;
          border-radius: 9999px;
          cursor: pointer;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(16px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .papers-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .contest-identity-bar {
            flex-direction: column;
            align-items: flex-start;
          }

          .identity-right {
            width: 100%;
          }

          .glass-info-trigger-btn {
            width: 100%;
            justify-content: center;
          }

          .papers-grid {
            grid-template-columns: 1fr;
          }

          .timeline-cards-grid,
          .subjects-chips-grid {
            grid-template-columns: 1fr;
          }

          .reader-footer {
            flex-direction: column;
          }

          .btn-download,
          .btn-ai-tutor {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};
