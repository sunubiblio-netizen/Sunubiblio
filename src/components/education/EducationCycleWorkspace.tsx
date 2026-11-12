'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EducationCycleDetails, EducationDocumentItem } from '@/data/educationCyclesData';

interface EducationCycleWorkspaceProps {
  cycle: EducationCycleDetails;
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

type ResourceTypeFilter = 'all' | 'cours' | 'sujet' | 'correction' | 'fascicule' | 'annale';

export const EducationCycleWorkspace: React.FC<EducationCycleWorkspaceProps> = ({
  cycle,
  onOpenAuth,
}) => {
  const router = useRouter();

  // Search & Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<ResourceTypeFilter>('all');
  const [selectedAccess, setSelectedAccess] = useState<'all' | 'gratuit' | 'premium'>('all');

  // Collapsible Filter Drawer (Fermé par défaut à l'arrivée sur la page comme FASTEF & CREM)
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Custom Dropdown Open States (Classe & Matière, comme FASTEF Matière & Session)
  const [isGradeDropdownOpen, setIsGradeDropdownOpen] = useState(false);
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);

  // Dropdown Refs for click-outside
  const gradeDropdownRef = useRef<HTMLDivElement>(null);
  const subjectDropdownRef = useRef<HTMLDivElement>(null);

  // Close custom dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        gradeDropdownRef.current &&
        !gradeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsGradeDropdownOpen(false);
      }
      if (
        subjectDropdownRef.current &&
        !subjectDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSubjectDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format Pills Drag-to-scroll support
  const pillsRowRef = useRef<HTMLDivElement>(null);
  const [isPillsDragging, setIsPillsDragging] = useState(false);
  const [pillsStartX, setPillsStartX] = useState(0);
  const [pillsScrollLeft, setPillsScrollLeft] = useState(0);

  const handlePillsMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!pillsRowRef.current) return;
    setIsPillsDragging(true);
    setPillsStartX(e.pageX - pillsRowRef.current.offsetLeft);
    setPillsScrollLeft(pillsRowRef.current.scrollLeft);
  };

  const handlePillsMouseLeaveOrUp = () => {
    setIsPillsDragging(false);
  };

  const handlePillsMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPillsDragging || !pillsRowRef.current) return;
    e.preventDefault();
    const x = e.pageX - pillsRowRef.current.offsetLeft;
    const walk = (x - pillsStartX) * 1.5;
    pillsRowRef.current.scrollLeft = pillsScrollLeft - walk;
  };

  // Dynamic counts for each format pill
  const counts = useMemo(() => {
    const docs = cycle.documents;
    return {
      all: docs.length,
      sujet: docs.filter((d) => d.type === 'sujet').length,
      correction: docs.filter((d) => d.type === 'correction').length,
      cours: docs.filter((d) => d.type === 'cours').length,
      fascicule: docs.filter((d) => d.type === 'fascicule').length,
      annale: docs.filter((d) => d.type === 'annale').length,
    };
  }, [cycle.documents]);

  // Interactive Modals
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [activeReadingDoc, setActiveReadingDoc] = useState<EducationDocumentItem | null>(null);

  // Flèche retour flottante fluide en bas à gauche (Identique à FASTEF / Concours)
  const [isBackVisible, setIsBackVisible] = useState(true);
  const isBackHoveredRef = useRef(false);

  useEffect(() => {
    let ticking = false;
    let hideTimeout: NodeJS.Timeout | null = null;

    const scheduleHide = () => {
      if (hideTimeout) clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > 60 && !isBackHoveredRef.current) {
          setIsBackVisible(false);
        }
      }, 2600);
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.pageYOffset || document.documentElement.scrollTop;

          if (scrollY <= 60) {
            setIsBackVisible(true);
            if (hideTimeout) clearTimeout(hideTimeout);
          } else {
            setIsBackVisible(true);
            scheduleHide();
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    setIsBackVisible(true);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, []);

  // Verrouillage du défilement et masquage des éléments flottants lorsque la modale est active
  useEffect(() => {
    if (isGuideModalOpen || activeReadingDoc) {
      document.body.classList.add('modal-scroll-locked');
      document.documentElement.classList.add('modal-scroll-locked');
    } else {
      document.body.classList.remove('modal-scroll-locked');
      document.documentElement.classList.remove('modal-scroll-locked');
    }
    return () => {
      document.body.classList.remove('modal-scroll-locked');
      document.documentElement.classList.remove('modal-scroll-locked');
    };
  }, [isGuideModalOpen, activeReadingDoc]);

  // Filtered documents
  const filteredDocs = useMemo(() => {
    return cycle.documents.filter((doc) => {
      // 1. Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const mTitle = doc.title.toLowerCase().includes(q);
        const mSubject = doc.subject.toLowerCase().includes(q);
        const mGrade = doc.grade.toLowerCase().includes(q);
        const mSource = doc.authorOrSource.toLowerCase().includes(q);
        const mSummary = doc.summary.toLowerCase().includes(q);
        const mTopics = doc.topics?.some((t) => t.toLowerCase().includes(q)) ?? false;
        if (!mTitle && !mSubject && !mGrade && !mSource && !mSummary && !mTopics) {
          return false;
        }
      }

      // 2. Grade
      if (selectedGrade !== 'all' && doc.grade !== selectedGrade) {
        return false;
      }

      // 3. Subject
      if (selectedSubject !== 'all' && doc.subject !== selectedSubject) {
        return false;
      }

      // 4. Resource Type
      if (selectedType !== 'all' && doc.type !== selectedType) {
        return false;
      }

      // 5. Access (Gratuit / Premium)
      if (selectedAccess !== 'all' && doc.accessStatus !== selectedAccess) {
        return false;
      }

      return true;
    });
  }, [cycle.documents, searchQuery, selectedGrade, selectedSubject, selectedType, selectedAccess]);

  const hasAnyFilter =
    selectedGrade !== 'all' ||
    selectedSubject !== 'all' ||
    selectedType !== 'all' ||
    selectedAccess !== 'all' ||
    searchQuery.trim() !== '';

  const handleClearFilters = () => {
    setSelectedGrade('all');
    setSelectedSubject('all');
    setSelectedType('all');
    setSelectedAccess('all');
    setSearchQuery('');
  };

  const handleOpenAiAssistant = (doc: EducationDocumentItem) => {
    const prompt = `Bonjour SunulA ! Aide-moi à réviser le document suivant pour le cycle ${cycle.title} (${doc.grade}) : "${doc.title}". Peux-tu me résumer les notions essentielles, les pièges d'examen classiques et me poser 3 questions d'entraînement avec corrigé ?`;
    router.push(`/ia?prompt=${encodeURIComponent(prompt)}`);
  };

  return (
    <div className="edu-cycle-view">
      {/* 1. Header / Navigation & Cycle Identity (Strictement Calqué sur l'Image 2 FASTEF) */}
      <section className="cycle-top-header">
        <div className="container">
          <div className="cycle-identity-bar">
            {/* Ligne 1 : Statut officiel uniquement pour aérer la carte */}
            <div className="identity-top-row">
              <span className="status-pill">
                <span className="status-dot" />
                <span>{cycle.statusLabel.split('•')[0].trim()}</span>
              </span>
            </div>

            {/* Ligne 2 : Logo/Illustration officielle & Titres institutionnels */}
            <div className="identity-middle-row">
              <div className="cycle-logo-box">
                {cycle.image ? (
                  <img
                    src={cycle.image}
                    alt={cycle.title}
                    className="cycle-logo-img"
                    style={cycle.imagePosition ? { objectPosition: cycle.imagePosition } : undefined}
                  />
                ) : (
                  <div className="cycle-logo-fallback">
                    <span>{cycle.title.slice(0, 3)}</span>
                  </div>
                )}
              </div>

              <div className="cycle-titles">
                <div className="cycle-title-header">
                  <div className="cycle-title-flag-group">
                    <h1 className="cycle-name">{cycle.title}</h1>
                    <span className="flag-badge">🇸🇳</span>
                  </div>
                  <span className="diploma-pill">{cycle.examBadge}</span>
                </div>

                <p className="cycle-full-name">{cycle.subtitle}</p>

                <p className="cycle-org-line">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21h18M3 7v14M21 7v14M6 11h2M6 15h2M11 11h2M11 15h2M16 11h2M16 15h2M12 3 2 7h20L12 3z"/>
                  </svg>
                  <span><strong>{cycle.organization.split('•')[0].trim()}</strong></span>
                </p>
              </div>
            </div>

            {/* Ligne 3 : Bouton Infos & Programme Officiel */}
            <div className="identity-bottom-row">
              <button
                type="button"
                className="glass-info-trigger-btn"
                onClick={() => setIsGuideModalOpen(true)}
                title="Consulter le programme officiel, coefficients et conseils de révision"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12" y2="8" />
                </svg>
                <span>Guide & Programme officiel du cycle</span>
                <span className="sparkle-chip">Officiel</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Direct Search Capsule (Strictement identique à l'Image 2) */}
      <section className="search-bar-stage">
        <div className="container">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="hero-search-capsule"
          >
            <div className="search-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>

            <input
              type="text"
              className="hero-search-input"
              placeholder={`Rechercher un cours, un fascicule, un devoir, un corrigé en ${cycle.title}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={`Rechercher dans ${cycle.title}`}
            />

            {searchQuery && (
              <button
                type="button"
                className="hero-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Effacer la recherche"
              >
                ✕
              </button>
            )}

            <button
              type="submit"
              className="hero-search-submit"
              aria-label="Lancer la recherche"
            >
              <span>Rechercher</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>
        </div>
      </section>

      {/* 3. Filter Stage avec bouton déclencheur Accordéon (Comme FASTEF & CREM) */}
      <section className="filter-stage">
        <div className="container">
          {/* Barre de contrôle principale : Permet d'ouvrir et de fermer toute la section de filtres */}
          <div className="filters-stage-toggle-row">
            <button
              type="button"
              className={`filters-main-toggle-btn ${isFilterPanelOpen ? 'open' : ''} ${hasAnyFilter ? 'has-active' : ''}`}
              onClick={() => setIsFilterPanelOpen((prev) => !prev)}
              aria-expanded={isFilterPanelOpen}
              title={isFilterPanelOpen ? 'Fermer la section des filtres' : 'Ouvrir les filtres et catégories'}
            >
              <div className="toggle-left-group">
                <span className="trigger-icon-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                </span>
                <span className="trigger-title">
                  {isFilterPanelOpen ? 'Fermer les filtres' : 'Filtrer les cours & matières'}
                </span>
                <span className="trigger-count-chip">
                  {filteredDocs.length} document{filteredDocs.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="toggle-right-group">
                {hasAnyFilter && (
                  <span className="filter-active-indicator">Actifs</span>
                )}
                <span className={`trigger-chevron ${isFilterPanelOpen ? 'rotate' : ''}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </div>
            </button>

            {hasAnyFilter && (
              <button
                type="button"
                className="filter-quick-clear-btn"
                onClick={handleClearFilters}
                title="Réinitialiser tous les filtres"
              >
                <span>Effacer</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* SECTION ENCADRÉE DÉPLIABLE (Identique à FASTEF Image 2 : Formats avec compteurs, Dropdowns Classe/Matière, Fermer les filtres) */}
          {isFilterPanelOpen && (
            <div className="contest-filters-section animate-slide-down">
              {/* Row A : Pilules poussables et défilables avec compteurs chiffrés (Tout voir, Sujets, Corrigés, Cours, Fascicules, Annales) */}
              <div
                className="filter-pills-row"
                ref={pillsRowRef}
                onMouseDown={handlePillsMouseDown}
                onMouseLeave={handlePillsMouseLeaveOrUp}
                onMouseUp={handlePillsMouseLeaveOrUp}
                onMouseMove={handlePillsMouseMove}
                role="region"
                aria-label="Types de ressources défilables"
              >
                <button
                  type="button"
                  className={`filter-pill ${selectedType === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedType('all')}
                >
                  <span>Tout voir</span>
                  <span className="pill-count">{counts.all}</span>
                </button>

                {counts.sujet > 0 && (
                  <button
                    type="button"
                    className={`filter-pill ${selectedType === 'sujet' ? 'active' : ''}`}
                    onClick={() => setSelectedType('sujet')}
                  >
                    <span>Sujets</span>
                    <span className="pill-count">{counts.sujet}</span>
                  </button>
                )}

                {counts.correction > 0 && (
                  <button
                    type="button"
                    className={`filter-pill ${selectedType === 'correction' ? 'active' : ''}`}
                    onClick={() => setSelectedType('correction')}
                  >
                    <span>Corrigés</span>
                    <span className="pill-count">{counts.correction}</span>
                  </button>
                )}

                {counts.cours > 0 && (
                  <button
                    type="button"
                    className={`filter-pill ${selectedType === 'cours' ? 'active' : ''}`}
                    onClick={() => setSelectedType('cours')}
                  >
                    <span>Cours</span>
                    <span className="pill-count">{counts.cours}</span>
                  </button>
                )}

                {counts.fascicule > 0 && (
                  <button
                    type="button"
                    className={`filter-pill ${selectedType === 'fascicule' ? 'active' : ''}`}
                    onClick={() => setSelectedType('fascicule')}
                  >
                    <span>Fascicules</span>
                    <span className="pill-count">{counts.fascicule}</span>
                  </button>
                )}

                {counts.annale > 0 && (
                  <button
                    type="button"
                    className={`filter-pill ${selectedType === 'annale' ? 'active' : ''}`}
                    onClick={() => setSelectedType('annale')}
                  >
                    <span>Annales</span>
                    <span className="pill-count">{counts.annale}</span>
                  </button>
                )}
              </div>

              {/* Row B : Panneau des menus déroulants personnalisés côte-à-côte (CLASSE & MATIÈRE) */}
              <div className="custom-dropdowns-panel">
                {/* Custom Dropdown Classe */}
                <div
                  className={`custom-dropdown-container ${isGradeDropdownOpen ? 'menu-open' : ''}`}
                  ref={gradeDropdownRef}
                >
                  <span className="custom-dropdown-field-label">Classe</span>
                  <button
                    type="button"
                    className={`custom-dropdown-trigger ${selectedGrade !== 'all' ? 'active-value' : ''}`}
                    onClick={() => {
                      setIsGradeDropdownOpen((prev) => !prev);
                      setIsSubjectDropdownOpen(false);
                    }}
                    aria-expanded={isGradeDropdownOpen}
                  >
                    <span className="dropdown-trigger-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                      </svg>
                    </span>
                    <span className="dropdown-trigger-text">
                      {selectedGrade === 'all' ? 'Toutes les classes' : selectedGrade}
                    </span>
                    <span className={`dropdown-trigger-arrow ${isGradeDropdownOpen ? 'open' : ''}`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </button>

                  {/* Menu déroulant Classe */}
                  {isGradeDropdownOpen && (
                    <div className="custom-dropdown-menu">
                      <button
                        type="button"
                        className={`custom-dropdown-item ${selectedGrade === 'all' ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedGrade('all');
                          setIsGradeDropdownOpen(false);
                        }}
                      >
                        <span>Toutes les classes</span>
                        {selectedGrade === 'all' && <span className="item-check">✓</span>}
                      </button>
                      {cycle.grades.map((grade) => (
                        <button
                          key={grade}
                          type="button"
                          className={`custom-dropdown-item ${selectedGrade === grade ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedGrade(grade);
                            setIsGradeDropdownOpen(false);
                          }}
                        >
                          <span>{grade}</span>
                          {selectedGrade === grade && <span className="item-check">✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Custom Dropdown Matière */}
                <div
                  className={`custom-dropdown-container ${isSubjectDropdownOpen ? 'menu-open' : ''}`}
                  ref={subjectDropdownRef}
                >
                  <span className="custom-dropdown-field-label">Matière</span>
                  <button
                    type="button"
                    className={`custom-dropdown-trigger ${selectedSubject !== 'all' ? 'active-value' : ''}`}
                    onClick={() => {
                      setIsSubjectDropdownOpen((prev) => !prev);
                      setIsGradeDropdownOpen(false);
                    }}
                    aria-expanded={isSubjectDropdownOpen}
                  >
                    <span className="dropdown-trigger-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                    </span>
                    <span className="dropdown-trigger-text">
                      {selectedSubject === 'all' ? 'Toutes les matières' : selectedSubject}
                    </span>
                    <span className={`dropdown-trigger-arrow ${isSubjectDropdownOpen ? 'open' : ''}`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </button>

                  {/* Menu déroulant Matière */}
                  {isSubjectDropdownOpen && (
                    <div className="custom-dropdown-menu">
                      <button
                        type="button"
                        className={`custom-dropdown-item ${selectedSubject === 'all' ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedSubject('all');
                          setIsSubjectDropdownOpen(false);
                        }}
                      >
                        <span>Toutes les matières</span>
                        {selectedSubject === 'all' && <span className="item-check">✓</span>}
                      </button>
                      {cycle.subjects.map((sub) => (
                        <button
                          key={sub.name}
                          type="button"
                          className={`custom-dropdown-item ${selectedSubject === sub.name ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedSubject(sub.name);
                            setIsSubjectDropdownOpen(false);
                          }}
                        >
                          <span>{sub.icon} {sub.name}</span>
                          {selectedSubject === sub.name && <span className="item-check">✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Pied de filtre : Bouton de fermeture d'accès direct avec croix & flèche en gris sobre (Exactement comme FASTEF) */}
              <div className="filters-bottom-collapse-row">
                <button
                  type="button"
                  className="filters-bottom-collapse-btn"
                  onClick={() => {
                    setIsFilterPanelOpen(false);
                    setIsGradeDropdownOpen(false);
                    setIsSubjectDropdownOpen(false);
                  }}
                  title="Fermer les filtres"
                >
                  <span className="collapse-btn-icon">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </span>
                  <span>Fermer les filtres</span>
                  <span className="collapse-btn-icon">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. Grille de Documents (Silhouette Livre 3D & Effleurement Consulter comme Bibliothèque) */}
      <section className="documents-grid-stage">
        <div className="container">
          {filteredDocs.length === 0 ? (
            <div className="empty-docs-box">
              <div className="empty-icon">📂</div>
              <h3>Aucun document ne correspond à vos filtres</h3>
              <p>Essayez de réinitialiser vos critères de recherche ou sélectionnez une autre matière.</p>
              <button
                type="button"
                className="reset-empty-btn"
                onClick={handleClearFilters}
              >
                Afficher tous les documents de {cycle.title}
              </button>
            </div>
          ) : (
            <div className="docs-cards-grid">
              {filteredDocs.map((doc) => {
                // Dégradés harmonieux et contrastés pour la couverture du livre 3D
                const coverGradient =
                  doc.topBadgeColor === 'blue'
                    ? 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1d4ed8 100%)'
                    : doc.topBadgeColor === 'green'
                    ? 'linear-gradient(135deg, #064e3b 0%, #10b981 50%, #047857 100%)'
                    : doc.topBadgeColor === 'purple'
                    ? 'linear-gradient(135deg, #4c1d95 0%, #8b5cf6 50%, #6d28d9 100%)'
                    : 'linear-gradient(135deg, #78350f 0%, #f59e0b 50%, #b45309 100%)';

                return (
                  <article
                    key={doc.id}
                    className="edu-book-card"
                    onClick={() => setActiveReadingDoc(doc)}
                  >
                    {/* Visual Cover Top Banner with Upright Book Silhouette */}
                    <div className="book-card-banner">
                      {/* Top Row : Catégorie Badge & Session/Term */}
                      <div className="banner-top-row">
                        <span className="banner-category-badge">
                          {doc.typeLabel.toUpperCase()}
                        </span>
                        <span className="banner-session-tag">
                          {doc.sessionOrTerm}
                        </span>
                      </div>

                      {/* Upright Book 3D Silhouette */}
                      <div className="book-silhouette-stage">
                        <div
                          className="book-3d-volume"
                          style={{ background: coverGradient }}
                        >
                          <div className="book-spine-crease" />
                          <div className="book-pages-edge" />
                          <div className="book-texture-dots" />

                          {/* Icône emblème au centre de la couverture */}
                          <div className="book-center-emblem">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Floating Rating Pill (★ 4.9) */}
                      <div className="cover-rating-pill">
                        <svg width="10.5" height="10.5" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <span className="cover-rating-num">4.9</span>
                      </div>

                      {/* Hover Action Overlay : Bouton Consulter visible à l'effleurement */}
                      <div className="cover-hover-action">
                        <button
                          type="button"
                          className="hover-view-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveReadingDoc(doc);
                          }}
                        >
                          <span>Consulter</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Card Content & Essentials (Épuré & Calqué sur Bibliothèque) */}
                    <div className="card-body-section">
                      {/* Titre du document */}
                      <h3 className="doc-title-text" title={doc.title}>
                        {doc.title}
                      </h3>

                      {/* Auteur / Source & Matière */}
                      <p className="doc-author-line" title={`${doc.authorOrSource} · ${doc.subject}`}>
                        <span className="author-source">{doc.authorOrSource}</span>
                        <span className="subject-dot"> · {doc.subject}</span>
                      </p>

                      {/* Essentials Footer: Classe à gauche & Accès à droite */}
                      <div className="card-essentials-footer">
                        <span className="grade-badge-chip">
                          {doc.grade}
                        </span>

                        <span className={`access-pill-badge access-${doc.accessStatus}`}>
                          {doc.accessStatus === 'gratuit' ? 'Gratuit' : 'Gold'}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 5. Modal Guide & Programme Officiel du Cycle */}
      {isGuideModalOpen && (
        <div className="modal-overlay" onClick={() => setIsGuideModalOpen(false)}>
          <div className="guide-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-title-wrap">
                <span className="modal-sparkle">📜</span>
                <div>
                  <h3 className="modal-heading">Guide & Programme Officiel — {cycle.title}</h3>
                  <p className="modal-sub">{cycle.organization}</p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsGuideModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body-scroll">
              {/* Présentation */}
              <div className="guide-card-block">
                <h4>🎯 Objectifs Fondamentaux du Cycle</h4>
                <ul className="guide-list">
                  {cycle.guide.objectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>

              {/* Examens Nationaux */}
              <div className="guide-card-block">
                <h4>🏆 Examens & Concours Nationaux Préparés</h4>
                <div className="exam-chips-grid">
                  {cycle.guide.nationalExams.map((exam, i) => (
                    <div key={i} className="exam-chip-card">
                      <span className="chip-icon">🎓</span>
                      <strong>{exam}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coefficients */}
              <div className="guide-card-block">
                <h4>⚖️ Matières Clés & Coefficients Officiels</h4>
                <div className="coef-table">
                  {cycle.guide.coefficients.map((c, i) => (
                    <div key={i} className="coef-row">
                      <span className="coef-subj">{c.subject}</span>
                      <span className="coef-val">{c.coef}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conseils Pédagogiques */}
              <div className="guide-card-block advice-block">
                <h4>💡 Conseils d’Excellence des Inspecteurs</h4>
                <ul className="guide-list">
                  {cycle.guide.studyAdvice.map((adv, i) => (
                    <li key={i}>{adv}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="close-guide-btn"
                onClick={() => setIsGuideModalOpen(false)}
              >
                Fermer le guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Modal de Consultation Rapide du Document */}
      {activeReadingDoc && (
        <div className="modal-overlay" onClick={() => setActiveReadingDoc(null)}>
          <div className="reader-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <span className={`doc-tag-pill badge-${activeReadingDoc.topBadgeColor}`}>
                  {activeReadingDoc.topBadge} • {activeReadingDoc.sessionOrTerm}
                </span>
                <h3 className="reader-heading">{activeReadingDoc.title}</h3>
                <p className="reader-sub">
                  {activeReadingDoc.grade} • {activeReadingDoc.subject} • {activeReadingDoc.pagesCount} pages
                </p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setActiveReadingDoc(null)}
              >
                ✕
              </button>
            </div>

            <div className="reader-body">
              <div className="preview-sheet">
                <div className="preview-top-flag">
                  <span>RÉPUBLIQUE DU SÉNÉGAL</span>
                  <small>Un Peuple — Un But — Une Foi</small>
                </div>
                <div className="preview-divider" />
                <h4 className="preview-doc-title">{activeReadingDoc.title}</h4>
                <p className="preview-doc-source">Émis par : {activeReadingDoc.authorOrSource}</p>

                <div className="preview-summary-box">
                  <strong>Sommaire & Contenu Pédagogique :</strong>
                  <p>{activeReadingDoc.summary}</p>
                </div>

                {activeReadingDoc.topics && (
                  <div className="preview-topics-row">
                    {activeReadingDoc.topics.map((t, idx) => (
                      <span key={idx} className="preview-topic-chip">#{t}</span>
                    ))}
                  </div>
                )}

                <div className="preview-watermark">
                  <span>SUNUBIBLIO ÉDUCATION • DOCUMENT CERTIFIÉ CONFORME</span>
                </div>
              </div>
            </div>

            <div className="reader-actions-bar">
              <button
                type="button"
                className="ai-review-btn"
                onClick={() => handleOpenAiAssistant(activeReadingDoc)}
              >
                <span>✨ Réviser ce cours avec SunulA (IA)</span>
              </button>

              <button
                type="button"
                className="download-pdf-btn"
                onClick={() => {
                  alert(`Le document "${activeReadingDoc.title}" est prêt à être consulté et téléchargé.`);
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Télécharger le PDF ({activeReadingDoc.pagesCount} pages)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Widget Flottant Retour Fluide en bas à gauche (Identique à Image 2 FASTEF) */}
      <aside
        aria-label="Retour aux cycles d'éducation"
        className={`floating-back-widget ${isBackVisible ? 'is-visible' : ''}`}
        onMouseEnter={() => {
          isBackHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isBackHoveredRef.current = false;
        }}
        onTouchStart={() => {
          isBackHoveredRef.current = true;
        }}
        onTouchEnd={() => {
          isBackHoveredRef.current = false;
        }}
      >
        <button
          type="button"
          className="floating-back-btn"
          onClick={() => router.push('/education')}
          aria-label="Retour aux cycles d'éducation"
          title="Retour aux cycles d'éducation"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
      </aside>

      {/* Styles Scoped Fidèles à l'Image 2 FASTEF */}
      <style jsx>{`
        .edu-cycle-view {
          min-height: 100vh;
          background: #ffffff;
          padding: 16px 0 80px;
          color: #0f172a;
        }

        .container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Masquage des éléments fixes / flottants quand la modale est ouverte */
        :global(body.modal-scroll-locked) .floating-back-widget,
        :global(html.modal-scroll-locked) .floating-back-widget,
        :global(body[style*="position: fixed"]) .floating-back-widget,
        :global(body[style*="overflow: hidden"]) .floating-back-widget,
        :global(body.modal-scroll-locked) :global(.mobile-bottom-nav-root),
        :global(html.modal-scroll-locked) :global(.mobile-bottom-nav-root) {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }

        .floating-back-widget {
          position: fixed;
          left: 24px;
          bottom: 36px;
          z-index: 50;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transform: scale(0.85) translateY(10px);
          transition: opacity 0.28s ease, transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.28s;
        }

        .floating-back-widget.is-visible {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transform: scale(1) translateY(0);
        }

        .floating-back-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1.5px solid rgba(226, 232, 240, 0.95);
          box-shadow: 0 10px 25px -4px rgba(15, 23, 42, 0.16), 0 4px 10px rgba(0, 0, 0, 0.04);
          color: #1e293b;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 0;
          outline: none;
          user-select: none;
        }

        .floating-back-btn:hover {
          background: #ffffff;
          border-color: #cbd5e1;
          color: #0f172a;
          transform: translateX(-3px) scale(1.04);
          box-shadow: 0 12px 28px -4px rgba(15, 23, 42, 0.22), 0 4px 12px rgba(0, 0, 0, 0.06);
        }

        .floating-back-btn:active {
          transform: scale(0.92) translateX(-1px);
        }

        @media (max-width: 860px) {
          .floating-back-widget {
            left: 14px;
            bottom: calc(82px + env(safe-area-inset-bottom, 8px));
          }

          .floating-back-btn {
            width: 42px;
            height: 42px;
          }
        }

        /* 1. Cycle Identity Bar (Copie exacte et soignée de FASTEF) */
        .cycle-identity-bar {
          background: #ffffff;
          border: 1.5px solid rgba(226, 232, 240, 0.95);
          border-radius: 20px;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.04);
          transition: all 0.2s ease;
        }

        .identity-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 12px;
        }

        .session-pill {
          font-size: 11.5px;
          font-weight: 700;
          color: #475569;
          background: #f1f5f9;
          padding: 3.5px 11px;
          border-radius: 9999px;
          border: 1px solid #e2e8f0;
          white-space: nowrap;
          line-height: 1.2;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          font-weight: 800;
          color: #059669;
          background: #ecfdf5;
          padding: 3.5px 12px;
          border-radius: 9999px;
          border: 1px solid #a7f3d0;
          white-space: nowrap;
          line-height: 1.2;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.15);
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.25);
        }

        .identity-middle-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .cycle-logo-box {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          background: #ffffff;
          border: 1.5px solid rgba(226, 232, 240, 0.95);
          overflow: hidden;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
          position: relative;
        }

        .cycle-logo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .cycle-logo-fallback {
          font-size: 18px;
          font-weight: 900;
          color: #d97706;
        }

        .cycle-titles {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
          flex: 1;
        }

        .cycle-title-header {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .cycle-title-flag-group {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .cycle-name {
          font-size: 20px;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin: 0;
          line-height: 1.2;
        }

        .flag-badge {
          font-size: 18px;
          line-height: 1;
        }

        .diploma-pill {
          font-size: 11px;
          font-weight: 700;
          color: #4f46e5;
          background: #eef2ff;
          padding: 2.5px 9px;
          border-radius: 9999px;
          border: 1px solid rgba(199, 210, 254, 0.85);
          line-height: 1.3;
          white-space: nowrap;
        }

        .cycle-full-name {
          font-size: 12.5px;
          color: #475569;
          font-weight: 600;
          margin: 0;
          line-height: 1.35;
        }

        .cycle-org-line {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: #64748b;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cycle-org-line strong {
          color: #1e293b;
        }

        .identity-bottom-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 10px;
          border-top: 1px dashed rgba(226, 232, 240, 0.9);
        }

        .glass-info-trigger-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 999px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #0f172a;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .glass-info-trigger-btn:hover {
          border-color: #f59e0b;
          background: #fffbeb;
          transform: translateY(-1px);
        }

        .sparkle-chip {
          background: #f59e0b;
          color: #ffffff;
          font-size: 10px;
          font-weight: 800;
          padding: 1px 7px;
          border-radius: 999px;
          text-transform: uppercase;
        }

        /* 2. Direct Search Capsule (Sticky au défilement en haut, fidèle à FASTEF / Concours) */
        .search-bar-stage {
          position: sticky;
          top: 73px;
          z-index: 80;
          width: 100%;
          padding: 12px 0;
          margin: 4px 0;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .hero-search-capsule {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          background: #ffffff;
          border: 1.5px solid rgba(226, 232, 240, 0.95);
          border-radius: 9999px;
          padding: 5px 6px 5px 20px;
          min-height: 52px;
          box-shadow: 0 10px 28px -4px rgba(15, 23, 42, 0.05), 0 2px 8px rgba(15, 23, 42, 0.02);
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .hero-search-capsule:focus-within {
          border-color: rgba(245, 158, 11, 0.6);
          box-shadow: 0 12px 32px -4px rgba(245, 158, 11, 0.14), 0 0 0 3px rgba(254, 240, 138, 0.35);
          transform: translateY(-1px);
        }

        .search-icon-wrap {
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .hero-search-input {
          flex: 1;
          min-width: 0;
          border: none;
          outline: none;
          font-size: 14px;
          font-weight: 500;
          color: #0f172a;
          background: transparent;
          padding: 0 12px;
        }

        .hero-search-input::placeholder {
          color: #94a3b8;
          font-weight: 400;
        }

        .hero-search-clear {
          background: transparent;
          border: none;
          color: #94a3b8;
          padding: 6px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          flex-shrink: 0;
          transition: all 0.15s ease;
        }

        .hero-search-clear:hover {
          color: #0f172a;
          background: #f1f5f9;
        }

        .hero-search-submit {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 42px;
          padding: 0 20px;
          border-radius: 9999px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #ffffff;
          font-size: 13.5px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(217, 119, 6, 0.35);
          transition: all 0.2s ease;
        }

        .hero-search-submit:hover {
          background: linear-gradient(135deg, #fbbf24 0%, #ea580c 100%);
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(217, 119, 6, 0.45);
        }

        /* 3. Filter Strip Bar (Fidèle à l'Image 2 FASTEF & CREM) */
        .filter-stage {
          padding: 8px 0 20px;
        }

        .filters-stage-toggle-row {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
        }

        .filters-main-toggle-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          min-height: 48px;
          padding: 8px 18px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
          font-family: inherit;
        }

        .filters-main-toggle-btn:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
        }

        .filters-main-toggle-btn.open {
          border-color: #f59e0b;
          box-shadow: 0 4px 14px rgba(245, 158, 11, 0.12);
        }

        .toggle-left-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .trigger-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f59e0b;
        }

        .trigger-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #0f172a;
        }

        .trigger-count-chip {
          background: #f1f5f9;
          color: #475569;
          font-size: 11.5px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 999px;
        }

        .toggle-right-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-active-indicator {
          background: #fef3c7;
          color: #b45309;
          font-size: 10.5px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 999px;
          text-transform: uppercase;
        }

        .trigger-chevron {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          transition: transform 0.25s ease;
        }

        .trigger-chevron.rotate {
          transform: rotate(180deg);
          color: #f59e0b;
        }

        .filter-quick-clear-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 48px;
          padding: 0 16px;
          font-size: 12px;
          font-weight: 700;
          color: #dc2626;
          background: #fef2f2;
          border: 1.5px solid #fee2e2;
          border-radius: 14px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .filter-quick-clear-btn:hover {
          background: #fee2e2;
          transform: translateY(-1px);
        }

        /* 3. SECTION FILTRES REPLIABLE (Identique à FASTEF Image 2) */
        .filter-stage {
          position: relative;
          z-index: 900;
          padding: 8px 0 20px;
        }

        .contest-filters-section {
          position: relative;
          z-index: 950;
          background: #ffffff;
          border: 1.5px solid rgba(226, 232, 240, 0.95);
          border-radius: 18px;
          padding: 14px 16px;
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: 0 8px 24px -4px rgba(15, 23, 42, 0.05), 0 2px 6px rgba(15, 23, 42, 0.02);
        }

        .contest-filters-section:has(.menu-open) {
          z-index: 9999;
        }

        .animate-slide-down {
          animation: slideDownFilters 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slideDownFilters {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Row A : Pilules poussables et défilables avec compteurs chiffrés */
        .filter-pills-row {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          overflow-y: hidden;
          flex-wrap: nowrap;
          padding: 2px 2px 4px 2px;
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
          touch-action: pan-x;
          scroll-behavior: smooth;
          cursor: grab;
          user-select: none;
        }

        .filter-pills-row:active {
          cursor: grabbing;
        }

        .filter-pills-row::-webkit-scrollbar {
          display: none;
        }

        .filter-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 35px;
          padding: 0 14px;
          font-size: 12px;
          font-weight: 700;
          color: #475569;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 9999px;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
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
          font-size: 10.5px;
          padding: 1px 6px;
          border-radius: 9999px;
          background: rgba(0, 0, 0, 0.07);
        }

        .filter-pill.active .pill-count {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }

        /* Row B : Panneau déroulant des filtres personnalisés (Classe & Matière) */
        .custom-dropdowns-panel {
          position: relative;
          z-index: 80;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          padding-top: 10px;
          border-top: 1px dashed rgba(226, 232, 240, 0.9);
        }

        .custom-dropdowns-panel:has(.menu-open) {
          z-index: 9999;
        }

        @media (max-width: 640px) {
          .custom-dropdowns-panel {
            grid-template-columns: 1fr;
          }
        }

        .custom-dropdown-container {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 5px;
          z-index: 10;
        }

        .custom-dropdown-container.menu-open {
          z-index: 9999;
        }

        .custom-dropdown-field-label {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .custom-dropdown-trigger {
          width: 100%;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 0 12px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
          color: #334155;
          cursor: pointer;
          transition: all 0.18s ease;
          text-align: left;
        }

        .custom-dropdown-trigger:hover {
          background: #ffffff;
          border-color: #cbd5e1;
        }

        .custom-dropdown-trigger.active-value {
          border-color: #f59e0b;
          background: #ffffff;
          color: #0f172a;
        }

        .dropdown-trigger-icon {
          color: #94a3b8;
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .dropdown-trigger-text {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dropdown-trigger-arrow {
          color: #94a3b8;
          display: flex;
          align-items: center;
          transition: transform 0.2s ease;
          flex-shrink: 0;
        }

        .dropdown-trigger-arrow.open {
          transform: rotate(180deg);
        }

        .custom-dropdown-menu {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          right: 0;
          background: #ffffff;
          border: 1.5px solid rgba(226, 232, 240, 0.95);
          border-radius: 14px;
          padding: 6px;
          box-shadow: 0 20px 40px -4px rgba(15, 23, 42, 0.22), 0 8px 16px rgba(15, 23, 42, 0.1);
          z-index: 999999;
          max-height: 240px;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .custom-dropdown-item {
          width: 100%;
          padding: 8px 10px;
          border-radius: 8px;
          border: none;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s ease;
        }

        .custom-dropdown-item:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .custom-dropdown-item.selected {
          background: #fef3c7;
          color: #b45309;
          font-weight: 700;
        }

        .item-check {
          color: #d97706;
          font-weight: 800;
        }

        /* Row C : Pied de filtre : Bouton de fermeture d'accès direct avec croix & flèche */
        .filters-bottom-collapse-row {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 10px;
          margin-top: 2px;
          border-top: 1px dashed rgba(226, 232, 240, 0.9);
        }

        .filters-bottom-collapse-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 36px;
          padding: 0 16px;
          border-radius: 9999px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #64748b;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .filters-bottom-collapse-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
          border-color: #cbd5e1;
        }

        .collapse-btn-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
        }

        .filters-bottom-collapse-btn:hover .collapse-btn-icon {
          color: #475569;
        }

        /* 4. Grille de Documents (Cartes Livres 3D avec Effleurement comme Bibliothèque) */
        .documents-grid-stage {
          position: relative;
          z-index: 10;
          padding-top: 8px;
          width: 100%;
        }

        .docs-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 20px;
          width: 100%;
          box-sizing: border-box;
        }

        @media (max-width: 1180px) {
          .docs-cards-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 860px) {
          .docs-cards-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
          }
        }

        @media (max-width: 520px) {
          .docs-cards-grid {
            grid-template-columns: minmax(0, 1fr);
          }
        }

        /* Carte Livre Élégante inspirée de la Bibliothèque */
        .edu-book-card {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 2px 10px -2px rgba(15, 23, 42, 0.04);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          position: relative;
          box-sizing: border-box;
          min-width: 0;
          max-width: 100%;
        }

        .edu-book-card:hover {
          transform: translateY(-4px);
          border-color: rgba(245, 158, 11, 0.5);
          box-shadow: 0 14px 30px -6px rgba(217, 119, 6, 0.16), 0 4px 10px -2px rgba(15, 23, 42, 0.04);
        }

        /* Bannière supérieure de la couverture */
        .book-card-banner {
          position: relative;
          background: linear-gradient(180deg, #f8fafc 0%, #edf2f7 100%);
          border-bottom: 1px solid rgba(226, 232, 240, 0.7);
          padding: 12px 12px 14px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          height: 184px;
        }

        .banner-top-row {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 6px;
        }

        .banner-category-badge {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.05em;
          background: rgba(255, 255, 255, 0.95);
          color: #475569;
          border: 1px solid rgba(226, 232, 240, 0.9);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
          padding: 2.5px 8px;
          border-radius: 9999px;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .banner-session-tag {
          font-size: 10.5px;
          font-weight: 700;
          color: #64748b;
          background: rgba(255, 255, 255, 0.8);
          padding: 2px 7px;
          border-radius: 9999px;
          white-space: nowrap;
        }

        /* Silhouette 3D du livre noble */
        .book-silhouette-stage {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          padding-top: 4px;
        }

        .book-3d-volume {
          width: 94px;
          height: 128px;
          border-radius: 3px 7px 7px 3px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px;
          box-shadow:
            -3px 0 5px rgba(0, 0, 0, 0.16),
            6px 14px 26px -4px rgba(15, 23, 42, 0.26),
            0 2px 6px rgba(0, 0, 0, 0.06);
          transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s ease;
        }

        .edu-book-card:hover .book-3d-volume {
          transform: scale(1.05) translateY(-2px) rotate(-1deg);
          box-shadow:
            -3px 0 6px rgba(0, 0, 0, 0.18),
            8px 18px 30px -4px rgba(15, 23, 42, 0.32),
            0 4px 10px rgba(0, 0, 0, 0.08);
        }

        .book-spine-crease {
          position: absolute;
          left: 6px;
          top: 0;
          bottom: 0;
          width: 1.5px;
          background: rgba(255, 255, 255, 0.35);
          box-shadow: 1px 0 2px rgba(0, 0, 0, 0.15);
        }

        .book-pages-edge {
          position: absolute;
          right: -3px;
          top: 4px;
          bottom: 4px;
          width: 3.5px;
          background: repeating-linear-gradient(
            to bottom,
            #f8fafc 0px,
            #e2e8f0 1.5px,
            #ffffff 3px
          );
          border-radius: 0 2px 2px 0;
          box-shadow: 1px 0 2px rgba(0, 0, 0, 0.1);
        }

        .book-texture-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px);
          background-size: 11px 11px;
          border-radius: 3px 7px 7px 3px;
          pointer-events: none;
        }

        .book-center-emblem {
          position: relative;
          z-index: 2;
          width: 38px;
          height: 38px;
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Pastille flottante de note étoilée */
        .cover-rating-pill {
          position: absolute;
          left: 9px;
          bottom: 9px;
          z-index: 4;
          display: inline-flex;
          align-items: center;
          gap: 3px;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(6px);
          padding: 2.5px 7px;
          border-radius: 9999px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08);
        }

        .cover-rating-num {
          font-size: 11px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1;
        }

        /* Voile d'effleurement avec bouton Consulter au survol */
        .cover-hover-action {
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.38);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.22s ease;
          z-index: 5;
        }

        .edu-book-card:hover .cover-hover-action {
          opacity: 1;
        }

        .hover-view-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 20px;
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          border: 1px solid rgba(255, 255, 255, 0.35);
          box-shadow: 0 6px 18px rgba(217, 119, 6, 0.45);
          border-radius: 9999px;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }

        .hover-view-btn:hover {
          background: linear-gradient(135deg, #fbbf24 0%, #ea580c 100%);
          transform: scale(1.05);
          box-shadow: 0 8px 24px rgba(217, 119, 6, 0.6);
        }

        /* Corps de carte épuré & lisible */
        .card-body-section {
          padding: 12px 14px 14px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .doc-title-text {
          font-size: 13.5px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.35;
          margin: 0 0 4px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 36px;
          letter-spacing: -0.01em;
        }

        .doc-author-line {
          font-size: 11.5px;
          color: #64748b;
          margin: 0 0 10px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .author-source {
          font-weight: 600;
          color: #475569;
        }

        .subject-dot {
          color: #94a3b8;
        }

        /* Pied de carte avec les pastilles classe & accès */
        .card-essentials-footer {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 6px;
          padding-top: 4px;
          border-top: 1px dashed rgba(226, 232, 240, 0.8);
        }

        .grade-badge-chip {
          font-size: 10px;
          font-weight: 700;
          color: #475569;
          background: #f1f5f9;
          border: 1px solid rgba(203, 213, 225, 0.8);
          padding: 2.5px 8px;
          border-radius: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 130px;
        }

        .access-pill-badge {
          font-size: 10px;
          font-weight: 700;
          padding: 2.5px 8px;
          border-radius: 6px;
          white-space: nowrap;
          line-height: 1.2;
        }

        .access-pill-badge.access-gratuit {
          color: #d97706;
          background: #fffbeb;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .access-pill-badge.access-premium {
          color: #b45309;
          background: #fef3c7;
          border: 1px solid rgba(245, 158, 11, 0.35);
        }

        /* Boîte vide */
        .empty-docs-box {
          text-align: center;
          padding: 60px 20px;
          background: #ffffff;
          border-radius: 20px;
          border: 1px dashed #cbd5e1;
        }

        .empty-icon {
          font-size: 40px;
          margin-bottom: 12px;
        }

        .empty-docs-box h3 {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 6px 0;
        }

        .empty-docs-box p {
          font-size: 13.5px;
          color: #64748b;
          margin: 0 0 16px 0;
        }

        .reset-empty-btn {
          background: #f59e0b;
          color: #ffffff;
          border: none;
          padding: 10px 20px;
          border-radius: 999px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
        }

        /* Modales */
        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .guide-modal-content,
        .reader-modal-content {
          background: #ffffff;
          width: 100%;
          max-width: 680px;
          border-radius: 24px;
          box-shadow: 0 25px 60px rgba(15, 23, 42, 0.3);
          display: flex;
          flex-direction: column;
          max-height: 90vh;
          overflow: hidden;
          animation: popModal 0.25s ease-out;
        }

        @keyframes popModal {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .modal-head {
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e2e8f0;
          background: #ffffff;
        }

        .modal-title-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .modal-sparkle {
          font-size: 28px;
        }

        .modal-heading {
          font-size: 17px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .modal-sub {
          font-size: 12px;
          color: #64748b;
          margin: 2px 0 0 0;
        }

        .modal-close-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }

        .modal-close-btn:hover {
          background: #fee2e2;
          color: #dc2626;
        }

        .modal-body-scroll {
          padding: 20px 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .guide-card-block {
          background: #f8fafc;
          border-radius: 16px;
          padding: 16px;
          border: 1px solid #e2e8f0;
        }

        .guide-card-block h4 {
          font-size: 14px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 10px 0;
        }

        .guide-list {
          margin: 0;
          padding-left: 20px;
          font-size: 13px;
          color: #334155;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .exam-chips-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .exam-chip-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          font-size: 13px;
          color: #0f172a;
        }

        .chip-icon {
          font-size: 18px;
        }

        .coef-table {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .coef-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          background: #ffffff;
          border-radius: 8px;
          font-size: 12.5px;
        }

        .coef-subj {
          font-weight: 600;
          color: #334155;
        }

        .coef-val {
          font-weight: 800;
          color: #d97706;
        }

        .modal-footer {
          padding: 16px 24px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: flex-end;
          background: #ffffff;
        }

        .close-guide-btn {
          background: #0f172a;
          color: #ffffff;
          border: none;
          padding: 10px 20px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        /* Reader Modal Styles */
        .reader-body {
          padding: 24px;
          background: #f1f5f9;
          overflow-y: auto;
        }

        .preview-sheet {
          background: #ffffff;
          border-radius: 12px;
          padding: 28px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.05);
          text-align: center;
        }

        .preview-top-flag {
          font-size: 11px;
          font-weight: 800;
          color: #64748b;
          letter-spacing: 0.1em;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .preview-divider {
          width: 60px;
          height: 2px;
          background: #f59e0b;
          margin: 14px auto;
        }

        .preview-doc-title {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 6px 0;
        }

        .preview-doc-source {
          font-size: 12px;
          color: #64748b;
          margin: 0 0 16px 0;
        }

        .preview-summary-box {
          text-align: left;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 14px 16px;
          margin-bottom: 14px;
          font-size: 13px;
          line-height: 1.5;
          color: #334155;
        }

        .preview-summary-box strong {
          display: block;
          margin-bottom: 6px;
          color: #0f172a;
        }

        .preview-topics-row {
          display: flex;
          gap: 6px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .preview-topic-chip {
          background: #e0f2fe;
          color: #0369a1;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 999px;
        }

        .preview-watermark {
          font-size: 10px;
          font-weight: 800;
          color: #94a3b8;
          letter-spacing: 0.15em;
          padding-top: 14px;
          border-top: 1px dashed #e2e8f0;
        }

        .reader-actions-bar {
          padding: 16px 24px;
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        @media (max-width: 640px) {
          .reader-actions-bar {
            flex-direction: column;
          }
          .ai-review-btn,
          .download-pdf-btn {
            width: 100%;
            justify-content: center;
          }
        }

        .ai-review-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 12px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #1d4ed8;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .ai-review-btn:hover {
          background: #dbeafe;
        }

        .download-pdf-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          border-radius: 12px;
          background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
          color: #ffffff;
          border: none;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.25);
        }

        .download-pdf-btn:hover {
          transform: translateY(-1px);
        }

        .doc-tag-pill {
          display: inline-block;
          font-size: 10.5px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 6px;
          margin-bottom: 6px;
        }

        .reader-heading {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .reader-sub {
          font-size: 12px;
          color: #64748b;
          margin: 2px 0 0 0;
        }

        /* =============================================================
           MOBILE ADAPTATION (< 860px) — CALQUÉE SUR L'IMAGE 2 FASTEF
        ============================================================= */
        @media (max-width: 860px) {
          .edu-cycle-view {
            padding: 10px 0 125px !important;
          }

          .container {
            padding: 0 14px;
          }

          .cycle-identity-bar {
            padding: 16px 16px;
            border-radius: 18px;
            gap: 14px;
            overflow: hidden;
            box-sizing: border-box;
          }

          .identity-top-row {
            gap: 6px;
            flex-wrap: wrap;
          }

          .session-pill {
            font-size: 10.5px;
            padding: 3px 9px;
            max-width: 100%;
          }

          .status-pill {
            font-size: 10.5px;
            padding: 3px 9px;
            max-width: 100%;
            white-space: normal;
            line-height: 1.25;
          }

          .identity-middle-row {
            gap: 11px;
            align-items: flex-start;
          }

          .cycle-logo-box {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            flex-shrink: 0;
            margin-top: 2px;
          }

          .cycle-titles {
            min-width: 0;
            flex: 1;
            overflow: hidden;
          }

          .cycle-title-header {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
            width: 100%;
          }

          .cycle-title-flag-group {
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }

          .cycle-name {
            font-size: 17px;
            line-height: 1.2;
          }

          .diploma-pill {
            font-size: 10px;
            padding: 2px 7px;
            border-radius: 6px;
            white-space: normal;
            line-height: 1.35;
            max-width: 100%;
            word-break: break-word;
            display: inline-block;
          }

          .cycle-full-name {
            font-size: 11.5px;
            line-height: 1.4;
            margin: 4px 0 0 0;
            color: #475569;
          }

          .cycle-org-line {
            font-size: 11px;
            line-height: 1.4;
            white-space: normal;
            overflow: visible;
            text-overflow: clip;
            margin-top: 6px;
            align-items: center;
          }

          .cycle-org-line svg {
            flex-shrink: 0;
            margin-top: 0;
          }

          .identity-bottom-row {
            padding-top: 12px;
          }

          .identity-bottom-row .glass-info-trigger-btn {
            width: 100%;
            justify-content: center;
            height: 36px;
            font-size: 11.5px;
            padding: 0 10px;
            white-space: nowrap;
            overflow: hidden;
          }

          /* Sticky Search Bar Mobile (reste intact en haut au défilement comme Concours) */
          .search-bar-stage {
            top: calc(87px + env(safe-area-inset-top, 0px));
            padding: 8px 0;
            margin: 0;
          }

          .hero-search-capsule {
            min-height: 48px;
            padding: 4px 6px 4px 14px;
          }

          .hero-search-input {
            font-size: 13.5px;
            padding: 0 8px;
          }

          .hero-search-submit {
            width: 38px !important;
            height: 38px !important;
            padding: 0 !important;
            border-radius: 50% !important;
            justify-content: center !important;
          }

          .hero-search-submit span {
            display: none !important;
          }

          /* Filters Mobile */
          .filter-stage {
            padding: 6px 0 14px;
          }

          .filters-main-toggle-btn {
            min-height: 42px;
            height: 42px;
            padding: 0 12px;
            border-radius: 14px;
          }

          .trigger-title {
            font-size: 12px;
          }

          .trigger-count-chip {
            font-size: 10px;
            padding: 1px 6px;
          }
        }
      `}</style>
    </div>
  );
};

