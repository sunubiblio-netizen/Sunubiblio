'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Contest, ContestPaperResource } from '@/types/contest';
import { CountryFlag } from './CountryFlag';

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

  // Collapsible Filter Drawer (Fermé par défaut à l'arrivée sur la page)
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Custom Dropdowns Menu Open States
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

  const subjectDropdownRef = useRef<HTMLDivElement>(null);
  const yearDropdownRef = useRef<HTMLDivElement>(null);

  // Mouse Drag-to-Scroll State for fluid horizontal tabs pushing
  const pillsContainerRef = useRef<HTMLDivElement>(null);
  const [isDraggingPills, setIsDraggingPills] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragScrollLeft, setDragScrollLeft] = useState(0);

  const handlePillsMouseDown = (e: React.MouseEvent) => {
    if (!pillsContainerRef.current) return;
    setIsDraggingPills(true);
    setDragStartX(e.pageX - pillsContainerRef.current.offsetLeft);
    setDragScrollLeft(pillsContainerRef.current.scrollLeft);
  };

  const handlePillsMouseLeaveOrUp = () => {
    setIsDraggingPills(false);
  };

  const handlePillsMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingPills || !pillsContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - pillsContainerRef.current.offsetLeft;
    const walk = (x - dragStartX) * 1.5;
    pillsContainerRef.current.scrollLeft = dragScrollLeft - walk;
  };

  // Fermeture des menus déroulants lors d'un clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        subjectDropdownRef.current &&
        !subjectDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSubjectDropdownOpen(false);
      }
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target as Node)
      ) {
        setIsYearDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mounted State for client-side portals
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Glass Info Modal State
  const [isGlassModalOpen, setIsGlassModalOpen] = useState(false);

  // État d'ouverture/fermeture des sections accordéon de la fiche officielle (toutes repliées/fermées de base)
  const [modalSectionsOpen, setModalSectionsOpen] = useState<{
    calendar: boolean;
    presentation: boolean;
    conditions: boolean;
    subjects: boolean;
  }>({
    calendar: false,      // Replié de base
    presentation: false,  // Replié de base
    conditions: false,    // Replié de base
    subjects: false,      // Replié de base
  });

  const handleOpenGlassModal = () => {
    // Dès qu'on clique, toutes les sections sont systématiquement repliées / fermées de base
    setModalSectionsOpen({
      calendar: false,
      presentation: false,
      conditions: false,
      subjects: false,
    });
    setIsGlassModalOpen(true);
  };

  const toggleModalSection = (key: 'calendar' | 'presentation' | 'conditions' | 'subjects') => {
    setModalSectionsOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const areAllSectionsOpen =
    modalSectionsOpen.calendar &&
    modalSectionsOpen.presentation &&
    modalSectionsOpen.conditions &&
    modalSectionsOpen.subjects;

  const toggleAllModalSections = () => {
    const nextState = !areAllSectionsOpen;
    setModalSectionsOpen({
      calendar: nextState,
      presentation: nextState,
      conditions: nextState,
      subjects: nextState,
    });
  };

  // Flèche retour flottante fluide : apparaît au scroll / interaction et disparaît comme le widget de ScrollNavigation (Image 2)
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

    // Visible au début
    setIsBackVisible(true);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, []);

  // Active Document Reader Modal (preview)
  const [activeReadingPaper, setActiveReadingPaper] = useState<ContestPaperResource | null>(null);

  // Verrouillage du défilement et masquage des éléments flottants lorsque la modale est active
  useEffect(() => {
    if (isGlassModalOpen || activeReadingPaper) {
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
  }, [isGlassModalOpen, activeReadingPaper]);

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

  const hasActiveAdvancedFilters = selectedSubject !== 'all' || selectedYear !== 'all';
  const hasAnyFilter = hasActiveAdvancedFilters || selectedType !== 'all' || searchQuery.trim() !== '';

  const handleClearAllFilters = () => {
    setSelectedSubject('all');
    setSelectedYear('all');
    setSelectedType('all');
    setSearchQuery('');
  };

  const handleGoBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
      return;
    }
    router.push('/concours');
  };

  return (
    <div className="contest-library-view">
      {/* 1. Header / Navigation & Contest Identity */}
      <section className="contest-top-header">
        {/* Identity Card Bar (Cadre FASTEF élégant, occupant immédiatement l'espace en haut) */}
        <div className="contest-identity-bar">
          {/* Ligne 1 : Session 2025 et Inscriptions ouvertes au même niveau */}
          <div className="identity-top-row">
            <span className="session-pill">Session {contest.sessionYear}</span>

            <span className={`status-pill ${contest.status}`}>
              <span className="status-dot" />
              <span>
                {contest.status === 'open'
                  ? 'Inscriptions ouvertes'
                  : contest.status === 'upcoming'
                  ? 'Session à venir'
                  : 'Fermé'}
              </span>
            </span>
          </div>

          {/* Ligne 2 : Logo officiel & Titres institutionnels */}
          <div className="identity-middle-row">
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
              <div className="contest-title-header">
                <div className="contest-title-flag-group">
                  <h1 className="contest-name">{contest.name}</h1>
                  <CountryFlag country={contest.country} size="sm" />
                </div>
                <span className="diploma-pill">{contest.diplomaLabel}</span>
              </div>
              <p className="contest-full-name">{contest.fullName}</p>
              <p className="contest-org-line">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18M3 7v14M21 7v14M6 11h2M6 15h2M11 11h2M11 15h2M16 11h2M16 15h2M12 3 2 7h20L12 3z"/>
                </svg>
                <span>Organisé par : <strong>{contest.organization}</strong></span>
              </p>
            </div>
          </div>

          {/* Ligne 3 : Bouton Infos & Dates officiel soigné */}
          <div className="identity-bottom-row">
            <button
              type="button"
              className="glass-info-trigger-btn"
              onClick={handleOpenGlassModal}
              title="Consulter les dates, conditions et informations officielles"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
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

      {/* 2. Direct Search Capsule (Strictement identique à la page d'accueil, au premier plan) */}
      <section className="search-bar-stage">
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
            placeholder="Rechercher une annale, un sujet, un corrigé..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label={`Rechercher dans ${contest.name}`}
          />

          {searchQuery && (
            <button
              type="button"
              className="hero-search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Effacer la recherche"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
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
      </section>

      {/* 3. Section Filtres globale : Déclencheur visible pour ouvrir / fermer TOUTE la section encadrée */}
      <section className="contest-filters-stage">
        {/* Barre de contrôle principale : Permet d'ouvrir et de fermer toute la section de filtres */}
        <div className="filters-stage-toggle-row">
          <button
            type="button"
            className={`filters-main-toggle-btn ${isFilterPanelOpen ? 'open' : ''} ${hasAnyFilter ? 'has-active' : ''}`}
            onClick={() => {
              setIsFilterPanelOpen((prev) => !prev);
              setIsSubjectDropdownOpen(false);
              setIsYearDropdownOpen(false);
            }}
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
                {isFilterPanelOpen ? 'Fermer les filtres' : 'Filtrer les annales & matières'}
              </span>
              <span className="trigger-count-chip">
                {filteredPapers.length} document{filteredPapers.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="toggle-right-group">
              {hasActiveAdvancedFilters && (
                <span className="filter-active-indicator">Actifs</span>
              )}
              {isFilterPanelOpen ? (
                <div className="trigger-close-icons-wrapper" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span className="trigger-close-icon" title="Fermer les filtres" aria-label="Fermer les filtres">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </span>
                  <span className="trigger-chevron rotate" title="Replier les filtres">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </div>
              ) : (
                <span className="trigger-chevron">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              )}
            </div>
          </button>

          {hasAnyFilter && (
            <button
              type="button"
              className="filter-quick-clear-btn"
              onClick={handleClearAllFilters}
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

        {/* TOUTE LA SECTION ENCADRÉE (Ouvrable et fermable à volonté, fermée par défaut) */}
        {isFilterPanelOpen && (
          <div className="contest-filters-section animate-slide-down">
            {/* Row A: Les types essentiels (Pilules défilables / poussables de manière ultra fluide) */}
            <div
              ref={pillsContainerRef}
              className="filter-pills-row"
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

              {counts.exercice > 0 && (
                <button
                  type="button"
                  className={`filter-pill ${selectedType === 'exercice' ? 'active' : ''}`}
                  onClick={() => setSelectedType('exercice')}
                >
                  <span>Exercices</span>
                  <span className="pill-count">{counts.exercice}</span>
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

              {counts.qcm > 0 && (
                <button
                  type="button"
                  className={`filter-pill ${selectedType === 'qcm' ? 'active' : ''}`}
                  onClick={() => setSelectedType('qcm')}
                >
                  <span>QCM</span>
                  <span className="pill-count">{counts.qcm}</span>
                </button>
              )}
            </div>

            {/* Row B: Panneau des menus déroulants personnalisés (Matière & Session) */}
            <div className="custom-dropdowns-panel">
              {/* Custom Dropdown Matière */}
              <div className={`custom-dropdown-container ${isSubjectDropdownOpen ? 'menu-open' : ''}`} ref={subjectDropdownRef}>
                <span className="custom-dropdown-field-label">Matière</span>
                <button
                  type="button"
                  className={`custom-dropdown-trigger ${selectedSubject !== 'all' ? 'active-value' : ''}`}
                  onClick={() => {
                    setIsSubjectDropdownOpen((prev) => !prev);
                    setIsYearDropdownOpen(false);
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

                {/* Custom Dropdown Menu in-situ avec défilement fluide et z-index au premier plan */}
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
                      {selectedSubject === 'all' && (
                        <span className="item-check">✓</span>
                      )}
                    </button>
                    {subjects.map((sub) => (
                      <button
                        key={sub.id}
                        type="button"
                        className={`custom-dropdown-item ${selectedSubject === sub.name ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedSubject(sub.name);
                          setIsSubjectDropdownOpen(false);
                        }}
                      >
                        <span>{sub.name}</span>
                        {selectedSubject === sub.name && (
                          <span className="item-check">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Dropdown Session */}
              {availableYears.length > 0 && (
                <div className={`custom-dropdown-container ${isYearDropdownOpen ? 'menu-open' : ''}`} ref={yearDropdownRef}>
                  <span className="custom-dropdown-field-label">Session (Année)</span>
                  <button
                    type="button"
                    className={`custom-dropdown-trigger ${selectedYear !== 'all' ? 'active-value' : ''}`}
                    onClick={() => {
                      setIsYearDropdownOpen((prev) => !prev);
                      setIsSubjectDropdownOpen(false);
                    }}
                    aria-expanded={isYearDropdownOpen}
                  >
                    <span className="dropdown-trigger-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </span>
                    <span className="dropdown-trigger-text">
                      {selectedYear === 'all' ? 'Toutes les sessions' : `Session ${selectedYear}`}
                    </span>
                    <span className={`dropdown-trigger-arrow ${isYearDropdownOpen ? 'open' : ''}`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </button>

                  {/* Dropdown Menu Session in-situ */}
                  {isYearDropdownOpen && (
                    <div className="custom-dropdown-menu">
                      <button
                        type="button"
                        className={`custom-dropdown-item ${selectedYear === 'all' ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedYear('all');
                          setIsYearDropdownOpen(false);
                        }}
                      >
                        <span>Toutes les sessions</span>
                        {selectedYear === 'all' && (
                          <span className="item-check">✓</span>
                        )}
                      </button>
                      {availableYears.map((yr) => (
                        <button
                          key={yr}
                          type="button"
                          className={`custom-dropdown-item ${selectedYear === yr.toString() ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedYear(yr.toString());
                            setIsYearDropdownOpen(false);
                          }}
                        >
                          <span>Session {yr}</span>
                          {selectedYear === yr.toString() && (
                            <span className="item-check">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Pied de filtre : Bouton de fermeture d'accès direct avec croix & flèche en gris sobre */}
            <div className="filters-bottom-collapse-row">
              <button
                type="button"
                className="filters-bottom-collapse-btn"
                onClick={() => {
                  setIsFilterPanelOpen(false);
                  setIsSubjectDropdownOpen(false);
                  setIsYearDropdownOpen(false);
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

      {/* 5. Frosted Glass Info Modal (« Page Glacée ») - Style flottant fluide identique à l'Image 2 */}
      {mounted && isGlassModalOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="sunu-glass-panel-overlay"
          onClick={() => setIsGlassModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="glass-modal-title"
          style={{ zIndex: 999990 }}
        >
          <div
            className="sunu-glass-floating-panel"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient subtle glow */}
            <div className="glass-ambient-aura" />

            {/* En-tête Glassmorphism épuré (identique à l'Image 2) */}
            <div className="glass-panel-header">
              <div className="header-title-box">
                <span className="header-sparkle-dot" aria-hidden="true" />
                <h2 id="glass-modal-title" className="header-heading">
                  Fiche {contest.name}
                </h2>
                <span className="header-session-badge">{contest.sessionYear}</span>
              </div>

              <button
                type="button"
                className="glass-close-btn"
                onClick={() => setIsGlassModalOpen(false)}
                aria-label="Fermer la fiche d'informations"
                title="Fermer"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Corps défilable : Sections organisées en cartes accordéons compactes et fluides (Image 2) */}
            <div className="glass-panel-scroll-body" tabIndex={0}>
              <div className="glass-accordions-stack">
                {/* 1. Calendrier & Dates */}
                <div className={`sunu-filter-accordion-item ${modalSectionsOpen.calendar ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className="accordion-header-btn"
                    onClick={() => toggleModalSection('calendar')}
                    aria-expanded={modalSectionsOpen.calendar}
                  >
                    <div className="header-left">
                      <span
                        className="accordion-chevron"
                        style={{
                          transform: modalSectionsOpen.calendar ? 'rotate(90deg)' : 'rotate(0deg)',
                        }}
                      >
                        ›
                      </span>
                      <span className="section-svg-icon">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </span>
                      <span className="accordion-title">Calendrier &amp; Dates</span>
                    </div>
                    <div className="header-right">
                      <span className={`status-pill ${contest.status}`}>
                        {contest.status === 'open' ? 'Inscriptions en cours' : contest.status === 'upcoming' ? 'Session à venir' : 'Clôturé'}
                      </span>
                    </div>
                  </button>

                  {modalSectionsOpen.calendar && (
                    <div className="accordion-body-collapse">
                      <div className="compact-timeline-grid">
                        <div className="compact-info-row">
                          <span className="info-row-label">Statut officiel</span>
                          <span className={`info-row-val status ${contest.status}`}>
                            {contest.status === 'open' ? 'Inscriptions en cours' : contest.status === 'upcoming' ? 'Session à venir' : 'Inscriptions clôturées'}
                          </span>
                        </div>
                        <div className="compact-info-row">
                          <span className="info-row-label">Date limite de dépôt</span>
                          <span className="info-row-val highlight">
                            {contest.applicationDeadline || 'Non communiquée'}
                          </span>
                        </div>
                        <div className="compact-info-row">
                          <span className="info-row-label">Épreuves écrites</span>
                          <span className="info-row-val highlight">
                            {contest.examDate || 'À fixer par arrêté ministériel'}
                          </span>
                        </div>
                        <div className="compact-info-row">
                          <span className="info-row-label">Niveau d’entrée requis</span>
                          <span className="info-row-val">
                            {contest.diplomaLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Présentation du Concours & Missions */}
                <div className={`sunu-filter-accordion-item ${modalSectionsOpen.presentation ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className="accordion-header-btn"
                    onClick={() => toggleModalSection('presentation')}
                    aria-expanded={modalSectionsOpen.presentation}
                  >
                    <div className="header-left">
                      <span
                        className="accordion-chevron"
                        style={{
                          transform: modalSectionsOpen.presentation ? 'rotate(90deg)' : 'rotate(0deg)',
                        }}
                      >
                        ›
                      </span>
                      <span className="section-svg-icon">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                      </span>
                      <span className="accordion-title">Présentation &amp; Missions</span>
                    </div>
                    <div className="header-right">
                      <span className="current-value-badge">Missions</span>
                    </div>
                  </button>

                  {modalSectionsOpen.presentation && (
                    <div className="accordion-body-collapse">
                      <p className="compact-description-text">
                        {contest.longDescription}
                      </p>
                      {contest.organization && (
                        <div className="compact-org-chip">
                          <span className="org-label">Organisme de tutelle :</span>
                          <span className="org-name">{contest.organization}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 3. Conditions d'accès officielles & Éligibilité */}
                {conditions.length > 0 && (
                  <div className={`sunu-filter-accordion-item ${modalSectionsOpen.conditions ? 'is-open' : ''}`}>
                    <button
                      type="button"
                      className="accordion-header-btn"
                      onClick={() => toggleModalSection('conditions')}
                      aria-expanded={modalSectionsOpen.conditions}
                    >
                      <div className="header-left">
                        <span
                          className="accordion-chevron"
                          style={{
                            transform: modalSectionsOpen.conditions ? 'rotate(90deg)' : 'rotate(0deg)',
                          }}
                        >
                          ›
                        </span>
                        <span className="section-svg-icon">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                          </svg>
                        </span>
                        <span className="accordion-title">Conditions d’accès</span>
                      </div>
                      <div className="header-right">
                        <span className="current-value-badge">
                          {conditions.length} critère{conditions.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    </button>

                    {modalSectionsOpen.conditions && (
                      <div className="accordion-body-collapse">
                        <div className="compact-conditions-list">
                          {conditions.map((cond) => (
                            <div key={cond.id} className="compact-condition-row">
                              <span className="cond-check-bullet">✓</span>
                              <div className="cond-text-group">
                                <div className="cond-title-line">
                                  <strong className="cond-title">{cond.title}</strong>
                                  {cond.isMandatory && (
                                    <span className="cond-mandatory-tag">Obligatoire</span>
                                  )}
                                </div>
                                <p className="cond-desc">{cond.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. Matières évaluées au concours */}
                {subjects.length > 0 && (
                  <div className={`sunu-filter-accordion-item ${modalSectionsOpen.subjects ? 'is-open' : ''}`}>
                    <button
                      type="button"
                      className="accordion-header-btn"
                      onClick={() => toggleModalSection('subjects')}
                      aria-expanded={modalSectionsOpen.subjects}
                    >
                      <div className="header-left">
                        <span
                          className="accordion-chevron"
                          style={{
                            transform: modalSectionsOpen.subjects ? 'rotate(90deg)' : 'rotate(0deg)',
                          }}
                        >
                          ›
                        </span>
                        <span className="section-svg-icon">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                          </svg>
                        </span>
                        <span className="accordion-title">Matières évaluées</span>
                      </div>
                      <div className="header-right">
                        <span className="current-value-badge">
                          {subjects.length} matière{subjects.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    </button>

                    {modalSectionsOpen.subjects && (
                      <div className="accordion-body-collapse">
                        <div className="compact-subjects-list">
                          {subjects.map((sub) => (
                            <div key={sub.id} className="compact-subject-row">
                              <div className="subject-info-cluster">
                                <strong className="subject-title">{sub.name}</strong>
                                {sub.description && (
                                  <p className="subject-desc">{sub.description}</p>
                                )}
                              </div>
                              <span className="subject-count-tag">
                                {sub.resourcesCount} doc{sub.resourcesCount > 1 ? 's' : ''}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Pied de panneau avec actions équilibrées (comme l'Image 2) */}
            <div className="glass-panel-footer">
              <button
                type="button"
                className="glass-reset-btn"
                onClick={toggleAllModalSections}
              >
                {areAllSectionsOpen ? 'Tout replier' : 'Tout déplier'}
              </button>
              <button
                type="button"
                className="glass-apply-btn"
                onClick={() => setIsGlassModalOpen(false)}
              >
                Fermer la fiche
              </button>
            </div>
          </div>
        </div>,
        document.body
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

      {/* Widget Flottant Retour Fluide (Apparaît et disparaît au scroll comme dans ScrollNavigation - Image 2) */}
      <aside
        aria-label="Retour aux concours"
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
          onClick={handleGoBack}
          aria-label="Retour aux concours"
          title="Retour aux concours"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
      </aside>

      <style jsx>{`
        .contest-library-view {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-bottom: 80px;
          background: #ffffff;
        }

        /* 1. TOP HEADER & COMPACT IDENTITY CADRE */
        .contest-top-header {
          display: flex;
          flex-direction: column;
          gap: 0;
          margin-top: 0;
          padding-top: 0;
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

        /* Cadre FASTEF soigné, compact & aéré */
        .contest-identity-bar {
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

        /* Ligne 1 : Session 2025 et Inscriptions ouvertes STRICTEMENT au MÊME NIVEAU */
        .identity-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
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
          padding: 3.5px 12px;
          border-radius: 9999px;
          white-space: nowrap;
          line-height: 1.2;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
        }

        .status-pill.open {
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.15);
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

        /* Ligne 2 : Logo & Identité */
        .identity-middle-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .contest-logo-box {
          width: 54px;
          height: 54px;
          border-radius: 14px;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          padding: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
          flex-shrink: 0;
        }

        .contest-logo-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .contest-logo-fallback {
          font-size: 18px;
          font-weight: 900;
          color: #d97706;
        }

        .contest-titles {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
          flex: 1;
        }

        .contest-title-header {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .contest-title-flag-group {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .contest-name {
          font-size: 20px;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin: 0;
          line-height: 1.2;
        }

        .diploma-pill {
          font-size: 11px;
          font-weight: 700;
          color: #4f46e5;
          background: #eef2ff;
          padding: 2.5px 9px;
          border-radius: 9999px;
          border: 1px solid rgba(199, 210, 254, 0.85);
          white-space: normal;
          line-height: 1.35;
          max-width: 100%;
          word-break: break-word;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          padding: 3px 12px;
          border-radius: 9999px;
          white-space: nowrap;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
        }

        .status-pill.open {
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.15);
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

        /* Ligne 2 : Logo & Identité */
        .identity-middle-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .contest-logo-box {
          width: 54px;
          height: 54px;
          border-radius: 14px;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          padding: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
          flex-shrink: 0;
        }

        .contest-logo-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .contest-logo-fallback {
          font-size: 18px;
          font-weight: 900;
          color: #d97706;
        }

        .contest-titles {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .contest-name {
          font-size: 20px;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin: 0;
          line-height: 1.2;
        }

        .contest-full-name {
          font-size: 12.5px;
          color: #475569;
          font-weight: 600;
          margin: 0;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .contest-org-line {
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

        .contest-org-line svg {
          flex-shrink: 0;
          color: #94a3b8;
        }

        /* Ligne 3 : Action officiel */
        .identity-bottom-row {
          display: flex;
          align-items: center;
          padding-top: 2px;
        }

        .glass-info-trigger-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 35px;
          padding: 0 15px;
          font-size: 12px;
          font-weight: 700;
          color: #0f172a;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(12px);
          border: 1.5px solid rgba(245, 158, 11, 0.35);
          border-radius: 9999px;
          box-shadow: 0 2px 10px rgba(217, 119, 6, 0.08);
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .glass-info-trigger-btn:hover {
          background: #ffffff;
          border-color: #f59e0b;
          box-shadow: 0 4px 16px rgba(217, 119, 6, 0.18);
          transform: translateY(-1px);
        }

        .sparkle-chip {
          font-size: 9px;
          font-weight: 800;
          color: #ffffff;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          padding: 2px 6px;
          border-radius: 9999px;
          text-transform: uppercase;
        }

        /* 2. SEARCH BAR STAGE (Au premier plan, identique à la page d'accueil) */
        .search-bar-stage {
          position: relative;
          z-index: 20;
          width: 100%;
        }

        .hero-search-capsule {
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
          font-size: 14px;
          font-weight: 500;
          color: #0f172a;
          background: transparent;
          border: none;
          outline: none;
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
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 50%;
          transition: all 0.15s ease;
          flex-shrink: 0;
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
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
          color: #ffffff !important;
          font-size: 13.5px;
          font-weight: 700;
          border: none !important;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(217, 119, 6, 0.35) !important;
          transition: all 0.2s ease;
        }

        .hero-search-submit:hover {
          background: linear-gradient(135deg, #fbbf24 0%, #ea580c 100%) !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(217, 119, 6, 0.45) !important;
        }

        /* 3. SECTION FILTRES REPLIABLE (Ouverture / Fermeture complète à volonté) */
        .contest-filters-stage {
          position: relative;
          z-index: 60;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .filters-stage-toggle-row {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
        }

        .filters-main-toggle-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 44px;
          padding: 0 16px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          box-shadow: 0 2px 8px -2px rgba(15, 23, 42, 0.04);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .filters-main-toggle-btn:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px -2px rgba(15, 23, 42, 0.08);
        }

        .filters-main-toggle-btn.open {
          background: #ffffff;
          border-color: #cbd5e1;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.06);
        }

        .filters-main-toggle-btn.has-active:not(.open) {
          border-color: #cbd5e1;
          background: #ffffff;
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
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #f1f5f9;
          color: #475569;
          transition: all 0.2s ease;
        }

        .filters-main-toggle-btn.open .trigger-icon-wrap,
        .filters-main-toggle-btn.has-active .trigger-icon-wrap {
          background: #f1f5f9;
          color: #0f172a;
        }

        .trigger-title {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.01em;
        }

        .filters-main-toggle-btn.open .trigger-title {
          color: #0f172a;
        }

        .trigger-count-chip {
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 9999px;
          background: #f1f5f9;
          color: #64748b;
          transition: all 0.2s ease;
        }

        .filters-main-toggle-btn.open .trigger-count-chip {
          background: #e2e8f0;
          color: #334155;
        }

        .toggle-right-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-active-indicator {
          font-size: 10.5px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 9999px;
          background: #0f172a;
          color: #ffffff;
          letter-spacing: 0.02em;
        }

        .trigger-chevron,
        .trigger-close-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s ease;
        }

        .trigger-chevron.rotate {
          transform: rotate(180deg);
          color: #94a3b8;
        }

        .filters-main-toggle-btn:hover .trigger-chevron,
        .filters-main-toggle-btn:hover .trigger-close-icon {
          color: #475569;
        }

        .filter-quick-clear-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 44px;
          padding: 0 14px;
          font-size: 12px;
          font-weight: 700;
          color: #dc2626;
          background: #fef2f2;
          border: 1.5px solid #fee2e2;
          border-radius: 14px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .filter-quick-clear-btn:hover {
          background: #fee2e2;
          border-color: #fca5a5;
          transform: translateY(-1px);
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

        .animate-slide-down {
          animation: slideDownFilters 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .contest-filters-section {
          position: relative;
          z-index: 70;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 18px;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: 0 8px 24px -4px rgba(15, 23, 42, 0.05), 0 2px 6px rgba(15, 23, 42, 0.02);
        }

        /* Row A : Pilules poussables et défilables de manière fluide */
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

        /* Row B : Panneau déroulant des filtres personnalisés */
        .custom-dropdowns-panel {
          position: relative;
          z-index: 80;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          padding-top: 10px;
          border-top: 1px dashed rgba(226, 232, 240, 0.9);
          animation: fadeIn 0.2s ease-out;
        }

        .custom-dropdown-container {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .custom-dropdown-container.menu-open {
          z-index: 999;
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
          box-shadow: 0 16px 36px -4px rgba(15, 23, 42, 0.18), 0 4px 12px rgba(15, 23, 42, 0.08);
          z-index: 9999;
          max-height: 240px;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
          display: flex;
          flex-direction: column;
          gap: 3px;
          animation: fadeIn 0.15s ease-out;
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

        /* Pied de filtre : Bouton de fermeture d'accès direct avec croix & flèche en gris sobre */
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
          border-color: #cbd5e1;
          color: #0f172a;
          transform: translateY(-1px);
        }

        .collapse-btn-icon {
          display: flex;
          align-items: center;
          color: #94a3b8;
          transition: color 0.18s ease;
        }

        .filters-bottom-collapse-btn:hover .collapse-btn-icon {
          color: #475569;
        }

        .btn-clear-filters:hover {
          background: #fde68a;
          color: #92400e;
        }

        /* 4. PAPERS GRID */
        .papers-grid-section {
          position: relative;
          z-index: 10;
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

        /* 5. FROSTED GLASS MODAL (« Fiche Officielle Flottante » - STYLE IDENTIQUE À L'IMAGE 2) */
        .glass-modal-backdrop,
        .sunu-glass-panel-overlay {
          position: fixed;
          inset: 0;
          z-index: 100000;
          background: rgba(15, 23, 42, 0.48);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: max(14px, env(safe-area-inset-top, 14px)) 14px max(14px, env(safe-area-inset-bottom, 14px)) 14px;
          animation: overlayFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);
          touch-action: none;
          overscroll-behavior: none;
        }

        @keyframes overlayFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .sunu-glass-floating-panel {
          position: relative;
          width: 100%;
          max-width: 440px;
          max-height: min(720px, calc(100dvh - 28px));
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.7);
          border-radius: 24px;
          box-shadow: 0 24px 55px -12px rgba(15, 23, 42, 0.28),
            0 0 0 1px rgba(99, 102, 241, 0.08);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          overscroll-behavior: contain;
          user-select: none;
          animation: glassPop 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes glassPop {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .glass-ambient-aura {
          position: absolute;
          top: -100px;
          right: -100px;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .glass-panel-header {
          position: relative;
          z-index: 2;
          padding: 14px 18px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.75);
          background: rgba(248, 250, 255, 0.65);
          display: flex;
          align-items: center;
          justify-content: space-between;
          user-select: none;
        }

        .header-title-box {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-sparkle-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          box-shadow: 0 0 8px rgba(245, 158, 11, 0.5);
        }

        .header-heading {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .header-session-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 2px 8px;
          border-radius: 9999px;
          background: #fef3c7;
          color: #b45309;
          border: 1px solid #fde68a;
          font-size: 11px;
          font-weight: 800;
        }

        .glass-close-btn {
          width: 30px;
          height: 30px;
          border-radius: 9px;
          background: rgba(241, 245, 249, 0.85);
          color: #64748b;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .glass-close-btn:hover {
          background: #fee2e2;
          color: #ef4444;
        }

        .glass-panel-scroll-body {
          position: relative;
          z-index: 1;
          flex: 1;
          overflow-y: auto;
          padding: 14px 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          touch-action: pan-y;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
        }

        .glass-panel-scroll-body::-webkit-scrollbar {
          width: 5px;
        }

        .glass-panel-scroll-body::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 9999px;
        }

        .glass-accordions-stack {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        /* LIGNES ACCORDÉONS (STYLE FILTERACCORDION - ADAPTÉ SUNUBIBLIO) */
        .sunu-filter-accordion-item {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.85);
          border-radius: 14px;
          overflow: hidden;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .sunu-filter-accordion-item.is-open {
          border-color: rgba(245, 158, 11, 0.45);
          box-shadow: 0 4px 16px -2px rgba(245, 158, 11, 0.1);
        }

        .accordion-header-btn {
          width: 100%;
          min-height: 48px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: inherit;
          text-align: left;
          user-select: none;
          transition: background 0.15s ease;
        }

        .accordion-header-btn:hover {
          background: rgba(248, 250, 252, 0.8);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 9px;
          flex: 1;
          min-width: 0;
        }

        .accordion-chevron {
          font-size: 16px;
          font-weight: 700;
          color: #64748b;
          width: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, color 0.15s ease;
          line-height: 1;
        }

        .sunu-filter-accordion-item.is-open .accordion-chevron {
          color: #d97706;
        }

        .section-svg-icon {
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: color 0.15s ease;
        }

        .sunu-filter-accordion-item.is-open .section-svg-icon {
          color: #d97706;
        }

        .accordion-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .header-right {
          display: flex;
          align-items: center;
          margin-left: 8px;
          flex-shrink: 0;
        }

        .current-value-badge {
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #e2e8f0;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 999px;
          max-width: 130px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .status-pill {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 999px;
          white-space: nowrap;
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

        .accordion-body-collapse {
          border-top: 1px solid rgba(226, 232, 240, 0.7);
          padding: 10px 14px 14px 14px;
          background: #ffffff;
          animation: accordionExpand 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes accordionExpand {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Timeline grid */
        .compact-timeline-grid {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .compact-info-row {
          background: #f8fafc;
          border: 1px solid #eef2f6;
          border-radius: 10px;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .info-row-label {
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
          white-space: nowrap;
        }

        .info-row-val {
          font-size: 12.5px;
          font-weight: 700;
          color: #0f172a;
          text-align: right;
        }

        .info-row-val.highlight {
          color: #d97706;
          font-weight: 800;
        }

        .info-row-val.status.open {
          color: #059669;
        }

        .info-row-val.status.upcoming {
          color: #b45309;
        }

        .info-row-val.status.closed {
          color: #64748b;
        }

        .compact-description-text {
          font-size: 12.5px;
          line-height: 1.55;
          color: #334155;
          margin: 0;
        }

        .compact-org-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          color: #475569;
          background: #f8fafc;
          padding: 5px 10px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          margin-top: 8px;
        }

        .compact-org-chip .org-label {
          font-weight: 600;
          color: #64748b;
        }

        .compact-org-chip .org-name {
          font-weight: 700;
          color: #0f172a;
        }

        .compact-conditions-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .compact-condition-row {
          background: #f8fafc;
          border: 1px solid #eef2f6;
          border-radius: 10px;
          padding: 8px 10px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .cond-check-bullet {
          color: #10b981;
          font-weight: 800;
          font-size: 13px;
          line-height: 1.2;
        }

        .cond-text-group {
          flex: 1;
          min-width: 0;
        }

        .cond-title-line {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .cond-title {
          font-size: 12.5px;
          font-weight: 700;
          color: #0f172a;
        }

        .cond-mandatory-tag {
          font-size: 9.5px;
          font-weight: 700;
          color: #dc2626;
          background: #fee2e2;
          padding: 1px 6px;
          border-radius: 999px;
        }

        .cond-desc {
          font-size: 11.5px;
          color: #64748b;
          margin: 2px 0 0 0;
          line-height: 1.35;
        }

        .compact-subjects-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .compact-subject-row {
          background: #f8fafc;
          border: 1px solid #eef2f6;
          border-radius: 10px;
          padding: 8px 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .subject-info-cluster {
          flex: 1;
          min-width: 0;
        }

        .subject-title {
          font-size: 12.5px;
          font-weight: 700;
          color: #0f172a;
          display: block;
        }

        .subject-desc {
          font-size: 11px;
          color: #64748b;
          margin: 1px 0 0 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .subject-count-tag {
          font-size: 10.5px;
          font-weight: 700;
          color: #b45309;
          background: #fef3c7;
          border: 1px solid #fde68a;
          padding: 2px 8px;
          border-radius: 999px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* PIED DE PANNEAU MODAL (SUNUBIBLIO NAVY & SLATE) */
        .glass-panel-footer {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 18px max(14px, env(safe-area-inset-bottom, 14px)) 18px;
          background: rgba(255, 255, 255, 0.85);
          border-top: 1px solid rgba(226, 232, 240, 0.7);
          user-select: none;
        }

        .glass-reset-btn {
          flex: 1;
          height: 42px;
          border-radius: 12px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          font-size: 13px;
          font-weight: 700;
          color: #334155;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .glass-reset-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .glass-apply-btn {
          flex: 2;
          height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          border: none;
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.22);
        }

        .glass-apply-btn:hover {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          transform: translateY(-1px);
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

        @media (max-width: 860px) {
          .contest-library-view {
            gap: 12px;
            padding-bottom: 125px !important;
          }

          .contest-top-header {
            gap: 6px;
          }

          /* MODALE FICHE FLOTTANTE SUR MOBILE (< 860px) - RESTE FLUIDE ET CENTRÉE COMME L'IMAGE 2 */
          .sunu-glass-panel-overlay {
            padding: 12px !important;
          }

          .sunu-glass-floating-panel {
            max-width: 440px !important;
            max-height: min(690px, calc(100dvh - 24px)) !important;
            border-radius: 22px !important;
          }

          .glass-panel-header {
            padding: 12px 16px !important;
          }

          .header-heading {
            font-size: 0.98rem !important;
          }

          .glass-panel-scroll-body {
            padding: 12px 14px !important;
          }

          .glass-panel-footer {
            padding: 10px 14px max(12px, env(safe-area-inset-bottom, 12px)) 14px !important;
          }

          .contest-identity-bar {
            padding: 12px 14px;
            border-radius: 16px;
            gap: 10px;
            overflow: hidden;
            box-sizing: border-box;
          }

          .identity-top-row {
            gap: 8px;
          }

          .session-pill {
            font-size: 11px;
            padding: 3px 10px;
          }

          .status-pill {
            font-size: 11px;
            padding: 3px 10px;
          }

          .identity-middle-row {
            gap: 11px;
            align-items: flex-start;
          }

          .contest-logo-box {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            flex-shrink: 0;
            margin-top: 2px;
          }

          .contest-titles {
            min-width: 0;
            flex: 1;
            overflow: hidden;
          }

          .contest-title-header {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
            width: 100%;
          }

          .contest-title-flag-group {
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }

          .contest-name {
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

          .contest-full-name {
            font-size: 11.5px;
            line-height: 1.35;
            margin: 2px 0 0 0;
            color: #475569;
          }

          .contest-org-line {
            font-size: 10.5px;
            line-height: 1.35;
            white-space: normal;
            margin-top: 3px;
          }

          .identity-bottom-row .glass-info-trigger-btn {
            width: 100%;
            justify-content: center;
            height: 34px;
            font-size: 11.5px;
          }

          /* Search Bar Mobile */
          .hero-search-capsule {
            min-height: 48px;
            padding: 4px 6px 4px 14px;
          }

          .hero-search-input {
            font-size: 13.5px;
            padding: 0 8px;
          }

          .hero-search-submit {
            height: 38px;
            padding: 0 14px;
            font-size: 12.5px;
            gap: 6px;
          }

          /* Filters Mobile */
          .filters-main-toggle-btn {
            height: 40px;
            padding: 0 12px;
          }

          .trigger-title {
            font-size: 12px;
          }

          .trigger-count-chip {
            font-size: 10px;
            padding: 1px 6px;
          }

          .filter-quick-clear-btn {
            height: 40px;
            padding: 0 10px;
            font-size: 11px;
          }

          .contest-filters-section {
            padding: 12px 14px;
            border-radius: 16px;
            gap: 10px;
          }

          .filter-pill {
            height: 33px;
            padding: 0 12px;
            font-size: 11.5px;
          }

          .custom-dropdowns-panel {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .custom-dropdown-menu {
            max-height: 200px;
          }

          .papers-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .paper-card-body {
            padding: 14px 14px;
          }

          .consult-doc-btn {
            height: 40px;
            font-size: 13px;
          }

          .ai-revise-btn {
            height: 38px;
            font-size: 12.5px;
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
