'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ReligionTradition,
  ReligionBranch,
  ReligionResource,
  ReligionPedagogicalData,
} from '@/types/religion';

interface ReligionTraditionWorkspaceProps {
  tradition: ReligionTradition;
  branches: ReligionBranch[];
  resources: ReligionResource[];
  pedagogicalData: ReligionPedagogicalData | null;
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

type ResourceTypeFilter = 'all' | 'livre' | 'cours' | 'document' | 'texte' | 'conference';

export const ReligionTraditionWorkspace: React.FC<ReligionTraditionWorkspaceProps> = ({
  tradition,
  branches,
  resources,
  pedagogicalData,
  onOpenAuth,
}) => {
  const router = useRouter();

  // Search & Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<ResourceTypeFilter>('all');
  const [selectedAccess, setSelectedAccess] = useState<'all' | 'gratuit' | 'abonne'>('all');

  // Collapsible Filter Drawer (Fermé par défaut comme Éducation & Concours)
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Dropdown States
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [isAccessDropdownOpen, setIsAccessDropdownOpen] = useState(false);

  const branchDropdownRef = useRef<HTMLDivElement>(null);
  const accessDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        branchDropdownRef.current &&
        !branchDropdownRef.current.contains(event.target as Node)
      ) {
        setIsBranchDropdownOpen(false);
      }
      if (
        accessDropdownRef.current &&
        !accessDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAccessDropdownOpen(false);
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

  // Dynamic counts for format pills
  const counts = useMemo(() => {
    return {
      all: resources.length,
      livre: resources.filter((d) => d.contentType === 'livre').length,
      cours: resources.filter((d) => d.contentType === 'cours').length,
      texte: resources.filter((d) => d.contentType === 'texte' || d.contentType === 'document').length,
      conference: resources.filter((d) => d.contentType === 'conference' || d.contentType === 'article').length,
    };
  }, [resources]);

  // Interactive Modals
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [activeReadingDoc, setActiveReadingDoc] = useState<ReligionResource | null>(null);

  // Accordion sections for the spiritual guide
  const [guideSectionsOpen, setGuideSectionsOpen] = useState<{
    history: boolean;
    beliefs: boolean;
    figures: boolean;
    texts: boolean;
  }>({
    history: false,
    beliefs: false,
    figures: false,
    texts: false,
  });

  const handleOpenGuideModal = () => {
    setGuideSectionsOpen({
      history: false,
      beliefs: false,
      figures: false,
      texts: false,
    });
    setIsGuideModalOpen(true);
  };

  const toggleGuideSection = (key: 'history' | 'beliefs' | 'figures' | 'texts') => {
    setGuideSectionsOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Flèche retour flottante fluide en bas à gauche (Identique à FASTEF / Concours / Éducation)
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

  // Lock body scroll when modals open
  useEffect(() => {
    if (isGuideModalOpen || activeReadingDoc) {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      document.body.classList.add('modal-scroll-locked');
      document.documentElement.classList.add('modal-scroll-locked');
      document.documentElement.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';

      return () => {
        document.body.classList.remove('modal-scroll-locked');
        document.documentElement.classList.remove('modal-scroll-locked');
        document.documentElement.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isGuideModalOpen, activeReadingDoc]);

  // Filtering engine
  const filteredDocs = useMemo(() => {
    return resources.filter((doc) => {
      // 1. Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const mTitle = doc.titre.toLowerCase().includes(q);
        const mAuthor = doc.auteur.toLowerCase().includes(q);
        const mDesc = doc.description?.toLowerCase().includes(q) ?? false;
        const mTags = doc.tags?.some((t) => t.toLowerCase().includes(q)) ?? false;
        if (!mTitle && !mAuthor && !mDesc && !mTags) {
          return false;
        }
      }

      // 2. Branch
      if (selectedBranch !== 'all' && doc.branchId !== selectedBranch) {
        return false;
      }

      // 3. Resource Type
      if (selectedType !== 'all') {
        if (selectedType === 'texte' && doc.contentType !== 'texte' && doc.contentType !== 'document') {
          return false;
        } else if (selectedType === 'conference' && doc.contentType !== 'conference' && doc.contentType !== 'article') {
          return false;
        } else if (selectedType !== 'texte' && selectedType !== 'conference' && doc.contentType !== selectedType) {
          return false;
        }
      }

      // 4. Access (Gratuit / Abonné)
      if (selectedAccess === 'gratuit' && doc.requiredPlan !== 'gratuit') {
        return false;
      }
      if (selectedAccess === 'abonne' && doc.requiredPlan === 'gratuit') {
        return false;
      }

      return true;
    });
  }, [resources, searchQuery, selectedBranch, selectedType, selectedAccess]);

  const hasAnyFilter =
    selectedBranch !== 'all' ||
    selectedType !== 'all' ||
    selectedAccess !== 'all' ||
    searchQuery.trim() !== '';

  const handleClearFilters = () => {
    setSelectedBranch('all');
    setSelectedType('all');
    setSelectedAccess('all');
    setSearchQuery('');
  };

  // Get active branch title
  const activeBranchTitle = useMemo(() => {
    if (selectedBranch === 'all') return 'Tous les courants';
    const b = branches.find((item) => item.id === selectedBranch);
    return b ? b.title : selectedBranch;
  }, [selectedBranch, branches]);

  return (
    <div className="rel-tradition-view">
      {/* 1. Top Header Card (Identique à Éducation & Concours) */}
      <section className="rel-top-header">
        <div className="container">
          <div className="rel-identity-card">
            {/* Arrière-plan avec photo & fondu élégant */}
            {tradition.image && (
              <div className="rel-card-ambient-bg" aria-hidden="true">
                <img
                  src={tradition.image}
                  alt=""
                  className="ambient-bg-img"
                  style={tradition.imagePosition ? { objectPosition: tradition.imagePosition } : undefined}
                />
                <div className="ambient-bg-gradient" />
              </div>
            )}

            <div className="rel-card-content">
              {/* Ligne 1 : Badges et Statut officiel */}
              <div className="identity-top-row">
                <span className="session-pill">
                  {tradition.badge || 'Tradition Spirituelle'}
                </span>

                <span className="status-pill">
                  <span className="status-dot" />
                  <span>{resources.length} ouvrage{resources.length > 1 ? 's' : ''} numérisé{resources.length > 1 ? 's' : ''}</span>
                </span>
              </div>

              {/* Ligne 2 : Logo/Illustration officielle & Titres */}
              <div className="identity-middle-row">
                <div className="rel-logo-box">
                  {tradition.image ? (
                    <img
                      src={tradition.image}
                      alt={tradition.title}
                      className="rel-logo-img"
                      style={tradition.imagePosition ? { objectPosition: tradition.imagePosition } : undefined}
                    />
                  ) : (
                    <div className="rel-logo-fallback">
                      <span>{tradition.title.slice(0, 3)}</span>
                    </div>
                  )}
                </div>

                <div className="rel-titles">
                  <div className="rel-title-header">
                    <h1 className="rel-name">{tradition.title}</h1>
                    <span className="diploma-pill">{tradition.branchesCount} Courant{tradition.branchesCount > 1 ? 's' : ''}</span>
                  </div>

                  <p className="rel-full-subtitle">{tradition.subtitle}</p>

                  <p className="rel-desc-line">{tradition.description}</p>
                </div>
              </div>

              {/* Ligne 3 : Bouton Infos & Guide Pédagogique */}
              <div className="identity-bottom-row">
                <button
                  type="button"
                  className="glass-info-trigger-btn"
                  onClick={handleOpenGuideModal}
                  title="Consulter l'histoire, les fondements, les textes sacrés et figures marquantes"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12" y2="8" />
                  </svg>
                  <span>Fiche &amp; Repères spirituels de la tradition</span>
                  <span className="sparkle-chip">Authentifié</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Direct Search Capsule (Identique à Éducation & Concours) */}
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
              placeholder={`Rechercher un livre, un traité, un auteur, une exégèse en ${tradition.title}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={`Rechercher dans ${tradition.title}`}
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

      {/* 3. Filter Stage avec bouton déclencheur Accordéon (Comme FASTEF & Éducation) */}
      <section className="filter-stage">
        <div className="container">
          <div className="filters-stage-toggle-row">
            <button
              type="button"
              className={`filters-main-toggle-btn ${isFilterPanelOpen ? 'open' : ''} ${hasAnyFilter ? 'has-active' : ''}`}
              onClick={() => setIsFilterPanelOpen((prev) => !prev)}
              aria-expanded={isFilterPanelOpen}
              title={isFilterPanelOpen ? 'Fermer les filtres' : 'Ouvrir les filtres par courant et format'}
            >
              <div className="toggle-left-group">
                <span className="trigger-icon-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                </span>
                <span className="trigger-title">
                  {isFilterPanelOpen ? 'Fermer les filtres' : 'Filtrer par courant & format'}
                </span>
                <span className="trigger-count-chip">
                  {filteredDocs.length} ouvrage{filteredDocs.length > 1 ? 's' : ''}
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

          {/* SECTION DÉPLIABLE DES FILTRES */}
          {isFilterPanelOpen && (
            <div className="contest-filters-section animate-slide-down">
              {/* Row A : Pilules poussables avec compteurs chiffrés */}
              <div
                className="filter-pills-row"
                ref={pillsRowRef}
                onMouseDown={handlePillsMouseDown}
                onMouseLeave={handlePillsMouseLeaveOrUp}
                onMouseUp={handlePillsMouseLeaveOrUp}
                onMouseMove={handlePillsMouseMove}
                role="region"
                aria-label="Types d'écrits défilables"
              >
                <button
                  type="button"
                  className={`filter-pill ${selectedType === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedType('all')}
                >
                  <span>Tous les formats</span>
                  <span className="pill-count">{counts.all}</span>
                </button>

                {counts.livre > 0 && (
                  <button
                    type="button"
                    className={`filter-pill ${selectedType === 'livre' ? 'active' : ''}`}
                    onClick={() => setSelectedType('livre')}
                  >
                    <span>Livres &amp; Traités</span>
                    <span className="pill-count">{counts.livre}</span>
                  </button>
                )}

                {counts.cours > 0 && (
                  <button
                    type="button"
                    className={`filter-pill ${selectedType === 'cours' ? 'active' : ''}`}
                    onClick={() => setSelectedType('cours')}
                  >
                    <span>Cours &amp; Exégèses</span>
                    <span className="pill-count">{counts.cours}</span>
                  </button>
                )}

                {counts.texte > 0 && (
                  <button
                    type="button"
                    className={`filter-pill ${selectedType === 'texte' ? 'active' : ''}`}
                    onClick={() => setSelectedType('texte')}
                  >
                    <span>Textes &amp; Poésies</span>
                    <span className="pill-count">{counts.texte}</span>
                  </button>
                )}

                {counts.conference > 0 && (
                  <button
                    type="button"
                    className={`filter-pill ${selectedType === 'conference' ? 'active' : ''}`}
                    onClick={() => setSelectedType('conference')}
                  >
                    <span>Conférences &amp; Articles</span>
                    <span className="pill-count">{counts.conference}</span>
                  </button>
                )}
              </div>

              {/* Row B : Panneau des menus déroulants personnalisés côte-à-côte */}
              <div className="custom-dropdowns-panel">
                {/* Custom Dropdown Courant / Confrérie */}
                {branches.length > 0 && (
                  <div
                    className={`custom-dropdown-container ${isBranchDropdownOpen ? 'menu-open' : ''}`}
                    ref={branchDropdownRef}
                  >
                    <span className="custom-dropdown-field-label">Courant / Confrérie</span>
                    <button
                      type="button"
                      className={`custom-dropdown-trigger ${selectedBranch !== 'all' ? 'active-value' : ''}`}
                      onClick={() => {
                        setIsBranchDropdownOpen((prev) => !prev);
                        setIsAccessDropdownOpen(false);
                      }}
                      aria-expanded={isBranchDropdownOpen}
                    >
                      <span className="dropdown-trigger-icon">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                      </span>
                      <span className="dropdown-trigger-text">
                        {activeBranchTitle}
                      </span>
                      <span className={`dropdown-trigger-arrow ${isBranchDropdownOpen ? 'open' : ''}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </button>

                    {isBranchDropdownOpen && (
                      <div className="custom-dropdown-menu">
                        <button
                          type="button"
                          className={`custom-dropdown-item ${selectedBranch === 'all' ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedBranch('all');
                            setIsBranchDropdownOpen(false);
                          }}
                        >
                          <span>Tous les courants</span>
                          {selectedBranch === 'all' && <span className="item-check">✓</span>}
                        </button>
                        {branches.map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            className={`custom-dropdown-item ${selectedBranch === b.id ? 'selected' : ''}`}
                            onClick={() => {
                              setSelectedBranch(b.id);
                              setIsBranchDropdownOpen(false);
                            }}
                          >
                            <span>{b.title}</span>
                            {selectedBranch === b.id && <span className="item-check">✓</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Custom Dropdown Accès */}
                <div
                  className={`custom-dropdown-container ${isAccessDropdownOpen ? 'menu-open' : ''}`}
                  ref={accessDropdownRef}
                >
                  <span className="custom-dropdown-field-label">Formule d’accès</span>
                  <button
                    type="button"
                    className={`custom-dropdown-trigger ${selectedAccess !== 'all' ? 'active-value' : ''}`}
                    onClick={() => {
                      setIsAccessDropdownOpen((prev) => !prev);
                      setIsBranchDropdownOpen(false);
                    }}
                    aria-expanded={isAccessDropdownOpen}
                  >
                    <span className="dropdown-trigger-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <span className="dropdown-trigger-text">
                      {selectedAccess === 'all'
                        ? 'Tous les accès'
                        : selectedAccess === 'gratuit'
                        ? 'Accès Gratuit'
                        : 'Réservé Abonnés'}
                    </span>
                    <span className={`dropdown-trigger-arrow ${isAccessDropdownOpen ? 'open' : ''}`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </button>

                  {isAccessDropdownOpen && (
                    <div className="custom-dropdown-menu">
                      <button
                        type="button"
                        className={`custom-dropdown-item ${selectedAccess === 'all' ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedAccess('all');
                          setIsAccessDropdownOpen(false);
                        }}
                      >
                        <span>Tous les accès</span>
                        {selectedAccess === 'all' && <span className="item-check">✓</span>}
                      </button>
                      <button
                        type="button"
                        className={`custom-dropdown-item ${selectedAccess === 'gratuit' ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedAccess('gratuit');
                          setIsAccessDropdownOpen(false);
                        }}
                      >
                        <span>Accès Gratuit</span>
                        {selectedAccess === 'gratuit' && <span className="item-check">✓</span>}
                      </button>
                      <button
                        type="button"
                        className={`custom-dropdown-item ${selectedAccess === 'abonne' ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedAccess('abonne');
                          setIsAccessDropdownOpen(false);
                        }}
                      >
                        <span>Réservé Abonnés</span>
                        {selectedAccess === 'abonne' && <span className="item-check">✓</span>}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Pied de filtre : Bouton de fermeture d'accès direct */}
              <div className="filters-bottom-collapse-row">
                <button
                  type="button"
                  className="filters-bottom-collapse-btn"
                  onClick={() => {
                    setIsFilterPanelOpen(false);
                    setIsBranchDropdownOpen(false);
                    setIsAccessDropdownOpen(false);
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

      {/* 4. Grille de Livres (Silhouette 3D & Visuel Sunubiblio) */}
      <section className="documents-grid-stage">
        <div className="container">
          {filteredDocs.length === 0 ? (
            <div className="empty-docs-box">
              <div className="empty-icon">📖</div>
              <h3>Aucun ouvrage ne correspond à vos filtres</h3>
              <p>Essayez de réinitialiser vos critères de recherche ou sélectionnez un autre courant.</p>
              <button
                type="button"
                className="reset-empty-btn"
                onClick={handleClearFilters}
              >
                Afficher tous les ouvrages de {tradition.title}
              </button>
            </div>
          ) : (
            <div className="docs-cards-grid">
              {filteredDocs.map((doc) => {
                const coverGradient =
                  doc.requiredPlan === 'gold'
                    ? 'linear-gradient(135deg, #78350f 0%, #d97706 60%, #b45309 100%)'
                    : doc.requiredPlan === 'recommande'
                    ? 'linear-gradient(135deg, #064e3b 0%, #059669 60%, #047857 100%)'
                    : doc.requiredPlan === 'simple'
                    ? 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #1d4ed8 100%)'
                    : 'linear-gradient(135deg, #0f172a 0%, #334155 60%, #475569 100%)';

                return (
                  <article
                    key={doc.id}
                    className="rel-book-card"
                    onClick={() => setActiveReadingDoc(doc)}
                  >
                    {/* Visual Cover Top Banner with Upright Book Silhouette */}
                    <div className="book-card-banner">
                      <div className="banner-top-row">
                        <span className="banner-category-badge">
                          {doc.contentType.toUpperCase()}
                        </span>
                        <span className="banner-session-tag">
                          {doc.language ? doc.language.toUpperCase() : 'FR'}
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

                          {/* Center Emblem */}
                          <div className="book-center-emblem">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Floating Rating Pill (★ 5.0) */}
                      <div className="cover-rating-pill">
                        <svg width="10.5" height="10.5" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <span className="cover-rating-num">5.0</span>
                      </div>

                      {/* Hover Action Overlay */}
                      <div className="cover-hover-action">
                        <span className="hover-action-btn">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                          </svg>
                          <span>Consulter</span>
                        </span>
                      </div>
                    </div>

                    {/* Book Metadata Bottom */}
                    <div className="book-card-body">
                      <h4 className="book-title" title={doc.titre}>
                        {doc.titre}
                      </h4>

                      <p className="book-author">
                        {doc.auteur || 'Érudits & Sages'}
                      </p>

                      <div className="book-meta-footer">
                        <span className="book-tag-pill">
                          {tradition.title}
                        </span>

                        <span
                          className={`book-access-badge ${
                            doc.requiredPlan === 'gratuit' ? 'free' : 'sub'
                          }`}
                        >
                          {doc.requiredPlan === 'gratuit' ? 'Gratuit' : 'Abonnement'}
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

      {/* 5. Flèche Retour Flottante Fluide (Strictement identique à FASTEF, Éducation & Concours) */}
      <div className={`floating-back-fab-wrap ${isBackVisible ? 'visible' : 'hidden'}`}>
        <Link
          href="/religion"
          className="floating-back-fab-btn"
          aria-label="Retour au catalogue Religion"
          title="Retour aux grandes traditions religieuses"
          onMouseEnter={() => {
            isBackHoveredRef.current = true;
          }}
          onMouseLeave={() => {
            isBackHoveredRef.current = false;
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span className="fab-label">Retour aux traditions</span>
        </Link>
      </div>

      {/* 6. Modale Guide & Repères Spirituels (Pédagogique) */}
      {isGuideModalOpen && (
        <div className="guide-modal-overlay" onClick={() => setIsGuideModalOpen(false)}>
          <div
            className="guide-modal-box"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="guide-modal-header">
              <div className="modal-title-group">
                <span className="modal-badge-pill">Repères Spirituels &amp; Historiques</span>
                <h3 className="modal-heading">{pedagogicalData?.hero.title || tradition.title}</h3>
                <p className="modal-subheading">{pedagogicalData?.hero.tagline || tradition.subtitle}</p>
              </div>

              <button
                type="button"
                className="guide-modal-close-btn"
                onClick={() => setIsGuideModalOpen(false)}
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div className="guide-modal-body">
              {/* Accordion 1: Histoire & Contexte */}
              <div className="guide-accordion-item">
                <button
                  type="button"
                  className={`accordion-trigger ${guideSectionsOpen.history ? 'open' : ''}`}
                  onClick={() => toggleGuideSection('history')}
                >
                  <div className="acc-left">
                    <span className="acc-icon">🏛️</span>
                    <span className="acc-title">Histoire, Origines &amp; Contexte</span>
                  </div>
                  <span className={`acc-chevron ${guideSectionsOpen.history ? 'rotate' : ''}`}>▾</span>
                </button>
                {guideSectionsOpen.history && (
                  <div className="accordion-content">
                    <p>{pedagogicalData?.introduction.definition || tradition.description}</p>
                    {pedagogicalData?.introduction.historicalOrigin && (
                      <p><strong>Époque &amp; Naissance :</strong> {pedagogicalData.introduction.historicalOrigin}</p>
                    )}
                    {pedagogicalData?.introduction.etymology && (
                      <p><strong>Étymologie &amp; Sens :</strong> {pedagogicalData.introduction.etymology}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Accordion 2: Piliers & Croyances fondamentales */}
              <div className="guide-accordion-item">
                <button
                  type="button"
                  className={`accordion-trigger ${guideSectionsOpen.beliefs ? 'open' : ''}`}
                  onClick={() => toggleGuideSection('beliefs')}
                >
                  <div className="acc-left">
                    <span className="acc-icon">✨</span>
                    <span className="acc-title">Croyances &amp; Piliers Fondamentaux</span>
                  </div>
                  <span className={`acc-chevron ${guideSectionsOpen.beliefs ? 'rotate' : ''}`}>▾</span>
                </button>
                {guideSectionsOpen.beliefs && (
                  <div className="accordion-content">
                    {pedagogicalData?.coreBeliefs ? (
                      <div className="beliefs-list">
                        {pedagogicalData.coreBeliefs.map((b, idx) => (
                          <div key={idx} className="belief-item">
                            <span className="belief-num">{idx + 1}</span>
                            <div>
                              <strong>{b.title}</strong>
                              <p>{b.explanation}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>Les piliers fondamentaux de la tradition guident la quête de sagesse, la droiture morale et la relation avec le Divin.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Accordion 3: Figures Spirituelles Marquantes */}
              <div className="guide-accordion-item">
                <button
                  type="button"
                  className={`accordion-trigger ${guideSectionsOpen.figures ? 'open' : ''}`}
                  onClick={() => toggleGuideSection('figures')}
                >
                  <div className="acc-left">
                    <span className="acc-icon">👥</span>
                    <span className="acc-title">Figures Spirituelles &amp; Penseurs Majeurs</span>
                  </div>
                  <span className={`acc-chevron ${guideSectionsOpen.figures ? 'rotate' : ''}`}>▾</span>
                </button>
                {guideSectionsOpen.figures && (
                  <div className="accordion-content">
                    {pedagogicalData?.keyFigures ? (
                      <div className="figures-list">
                        {pedagogicalData.keyFigures.map((fig, idx) => (
                          <div key={idx} className="figure-card">
                            <h4 className="fig-name">{fig.name}</h4>
                            <span className="fig-title">{fig.title} • {fig.period}</span>
                            <p className="fig-bio">{fig.role} : {fig.mission}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>Découvrez les maîtres spirituels et les sages ayant transmis ces enseignements au fil des siècles.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Accordion 4: Textes Sacrés & Références */}
              <div className="guide-accordion-item">
                <button
                  type="button"
                  className={`accordion-trigger ${guideSectionsOpen.texts ? 'open' : ''}`}
                  onClick={() => toggleGuideSection('texts')}
                >
                  <div className="acc-left">
                    <span className="acc-icon">📜</span>
                    <span className="acc-title">Textes Sacrés &amp; Écrits Fondateurs</span>
                  </div>
                  <span className={`acc-chevron ${guideSectionsOpen.texts ? 'rotate' : ''}`}>▾</span>
                </button>
                {guideSectionsOpen.texts && (
                  <div className="accordion-content">
                    {pedagogicalData?.sacredTexts ? (
                      <div className="texts-list">
                        {pedagogicalData.sacredTexts.map((text, idx) => (
                          <div key={idx} className="sacred-text-item">
                            <h4>{text.name} {text.arabicOrOriginalName ? `(${text.arabicOrOriginalName})` : ''}</h4>
                            <p>{text.subtitle} — {text.importance}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>Les recueils sacrés, exégèses et manuscrits fondent l’enseignement et la spiritualité de cette tradition.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="guide-modal-footer">
              <button
                type="button"
                className="guide-modal-ok-btn"
                onClick={() => setIsGuideModalOpen(false)}
              >
                Fermer le guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Modale de Lecture d'un Ouvrage */}
      {activeReadingDoc && (
        <div className="doc-modal-overlay" onClick={() => setActiveReadingDoc(null)}>
          <div
            className="doc-modal-box"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="doc-modal-header">
              <div className="doc-modal-tag-group">
                <span className="modal-category-tag">{activeReadingDoc.contentType.toUpperCase()}</span>
                <span className="modal-access-tag">
                  {activeReadingDoc.requiredPlan === 'gratuit' ? 'Accès Public Gratuit' : 'Réservé Abonnés'}
                </span>
              </div>
              <button
                type="button"
                className="guide-modal-close-btn"
                onClick={() => setActiveReadingDoc(null)}
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            <div className="doc-modal-body">
              <h3 className="doc-modal-title">{activeReadingDoc.titre}</h3>
              <p className="doc-modal-author">
                Auteur / Érudit : <strong>{activeReadingDoc.auteur}</strong>
              </p>

              {activeReadingDoc.description && (
                <div className="doc-modal-desc-box">
                  <h4>Présentation de l'ouvrage</h4>
                  <p>{activeReadingDoc.description}</p>
                </div>
              )}

              {activeReadingDoc.source && (
                <div className="doc-modal-context-box">
                  <h4>Source &amp; Authenticité</h4>
                  <p>{activeReadingDoc.source}</p>
                </div>
              )}

              <div className="doc-modal-specs">
                <div className="spec-item">
                  <span className="spec-label">Format</span>
                  <span className="spec-val">PDF Haute Définition</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Langue</span>
                  <span className="spec-val">{activeReadingDoc.language || 'Français / Arabe'}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Tradition</span>
                  <span className="spec-val">{tradition.title}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Téléchargements</span>
                  <span className="spec-val">{activeReadingDoc.downloadsCount || 420}+</span>
                </div>
              </div>
            </div>

            <div className="doc-modal-footer">
              <button
                type="button"
                className="doc-modal-read-btn"
                onClick={() => {
                  alert(`Ouverture du lecteur sécurisé Sunubiblio pour : ${activeReadingDoc.titre}`);
                }}
              >
                📖 Lire l'ouvrage en ligne
              </button>
              <button
                type="button"
                className="doc-modal-cancel-btn"
                onClick={() => setActiveReadingDoc(null)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .rel-tradition-view {
          min-height: 100vh;
          background: #fdfcf9;
          padding-bottom: 80px;
        }

        /* 1. Top Header Card */
        .rel-top-header {
          padding: 32px 0 20px;
        }

        .rel-identity-card {
          position: relative;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
        }

        .rel-card-ambient-bg {
          position: absolute;
          inset: 0;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .ambient-bg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.18;
          filter: blur(1px);
        }

        .ambient-bg-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0.98) 0%,
            rgba(255, 255, 255, 0.92) 50%,
            rgba(255, 255, 255, 0.85) 100%
          );
        }

        .rel-card-content {
          position: relative;
          z-index: 1;
          padding: 28px 32px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .identity-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .session-pill {
          font-size: 11.5px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 9999px;
          background: rgba(217, 119, 6, 0.1);
          color: #b45309;
          border: 1px solid rgba(217, 119, 6, 0.25);
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #059669;
          background: #ecfdf5;
          padding: 4px 10px;
          border-radius: 9999px;
          border: 1px solid rgba(5, 150, 105, 0.2);
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
        }

        .identity-middle-row {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .rel-logo-box {
          width: 88px;
          height: 88px;
          border-radius: 18px;
          overflow: hidden;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.06);
        }

        .rel-logo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .rel-logo-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 20px;
          color: #d97706;
          background: #fffbeb;
        }

        .rel-titles {
          flex: 1;
        }

        .rel-title-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
          flex-wrap: wrap;
        }

        .rel-name {
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          line-height: 1.2;
        }

        .diploma-pill {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 6px;
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #cbd5e1;
        }

        .rel-full-subtitle {
          font-size: 14.5px;
          font-weight: 600;
          color: #d97706;
          margin: 0 0 6px 0;
        }

        .rel-desc-line {
          font-size: 13.5px;
          line-height: 1.55;
          color: #475569;
          margin: 0;
          max-width: 860px;
        }

        .identity-bottom-row {
          display: flex;
          align-items: center;
          padding-top: 10px;
          border-top: 1px dashed #e2e8f0;
        }

        .glass-info-trigger-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.85);
          border: 1.5px solid rgba(217, 119, 6, 0.35);
          padding: 8px 16px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          color: #b45309;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .glass-info-trigger-btn:hover {
          background: #fffbeb;
          border-color: #d97706;
          transform: translateY(-1px);
        }

        .sparkle-chip {
          font-size: 10px;
          background: #d97706;
          color: #ffffff;
          padding: 2px 6px;
          border-radius: 9999px;
          font-weight: 700;
          text-transform: uppercase;
        }

        /* 2. Direct Search Capsule */
        .search-bar-stage {
          padding: 10px 0 16px;
        }

        .hero-search-capsule {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 9999px;
          padding: 6px 8px 6px 18px;
          box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.05);
          transition: all 0.2s ease;
        }

        .hero-search-capsule:focus-within {
          border-color: #f59e0b;
          box-shadow: 0 12px 30px -5px rgba(245, 158, 11, 0.15), 0 0 0 3px rgba(245, 158, 11, 0.15);
        }

        .search-icon-wrap {
          color: #94a3b8;
          display: flex;
          align-items: center;
        }

        .hero-search-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 14.5px;
          color: #0f172a;
          background: transparent;
          font-weight: 500;
        }

        .hero-search-clear {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px 8px;
          font-size: 13px;
        }

        .hero-search-submit {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #ffffff;
          border: none;
          border-radius: 9999px;
          padding: 10px 22px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .hero-search-submit:hover {
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          transform: translateY(-1px);
        }

        /* 3. Filter Stage */
        .filter-stage {
          padding: 0 0 24px;
        }

        .filters-stage-toggle-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .filters-main-toggle-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 18px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filters-main-toggle-btn.open {
          border-color: #d97706;
          background: #fffdfa;
        }

        .toggle-left-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .trigger-icon-wrap {
          color: #d97706;
          display: flex;
          align-items: center;
        }

        .trigger-title {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
        }

        .trigger-count-chip {
          font-size: 11.5px;
          font-weight: 600;
          color: #64748b;
          background: #f1f5f9;
          padding: 2px 8px;
          border-radius: 9999px;
        }

        .toggle-right-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-active-indicator {
          font-size: 10px;
          font-weight: 700;
          color: #ffffff;
          background: #d97706;
          padding: 2px 6px;
          border-radius: 9999px;
        }

        .trigger-chevron {
          color: #64748b;
          transition: transform 0.2s ease;
        }

        .trigger-chevron.rotate {
          transform: rotate(180deg);
        }

        .filter-quick-clear-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #fee2e2;
          color: #dc2626;
          border: 1px solid #fca5a5;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
        }

        .contest-filters-section {
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 16px;
          padding: 18px 20px;
          margin-top: 12px;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);
        }

        .filter-pills-row {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 14px;
          border-bottom: 1px solid #f1f5f9;
          cursor: grab;
          scrollbar-width: none;
        }

        .filter-pills-row::-webkit-scrollbar {
          display: none;
        }

        .filter-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 14px;
          border-radius: 10px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #475569;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .filter-pill.active {
          background: #fffbeb;
          border-color: #f59e0b;
          color: #b45309;
        }

        .pill-count {
          font-size: 11px;
          padding: 1px 6px;
          border-radius: 9999px;
          background: rgba(148, 163, 184, 0.18);
        }

        .filter-pill.active .pill-count {
          background: #f59e0b;
          color: #ffffff;
        }

        .custom-dropdowns-panel {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          padding-top: 14px;
        }

        .custom-dropdown-container {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .custom-dropdown-field-label {
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
        }

        .custom-dropdown-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 12px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          font-size: 13px;
          color: #0f172a;
          cursor: pointer;
        }

        .dropdown-trigger-icon {
          color: #64748b;
          margin-right: 8px;
        }

        .dropdown-trigger-text {
          flex: 1;
          text-align: left;
          font-weight: 600;
        }

        .custom-dropdown-menu {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          z-index: 50;
          background: #ffffff;
          border: 1.5px solid #cbd5e1;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.1);
          padding: 6px;
          max-height: 220px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .custom-dropdown-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          border-radius: 8px;
          border: none;
          background: transparent;
          font-size: 12.5px;
          color: #334155;
          text-align: left;
          cursor: pointer;
        }

        .custom-dropdown-item:hover {
          background: #f1f5f9;
        }

        .custom-dropdown-item.selected {
          background: #fffbeb;
          color: #b45309;
          font-weight: 700;
        }

        .filters-bottom-collapse-row {
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px dashed #e2e8f0;
          display: flex;
          justify-content: center;
        }

        .filters-bottom-collapse-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
        }

        /* 4. Documents Grid */
        .documents-grid-stage {
          padding: 0 0 40px;
        }

        .empty-docs-box {
          text-align: center;
          padding: 60px 20px;
          background: #ffffff;
          border: 1px dashed #cbd5e1;
          border-radius: 20px;
        }

        .empty-icon {
          font-size: 42px;
          margin-bottom: 12px;
        }

        .reset-empty-btn {
          margin-top: 14px;
          background: #d97706;
          color: #ffffff;
          border: none;
          padding: 10px 20px;
          border-radius: 9999px;
          font-weight: 700;
          cursor: pointer;
        }

        .docs-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .rel-book-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.03);
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
        }

        .rel-book-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
          border-color: rgba(217, 119, 6, 0.4);
        }

        .book-card-banner {
          position: relative;
          height: 180px;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px;
          border-bottom: 1px solid #f1f5f9;
        }

        .banner-top-row {
          position: absolute;
          top: 10px;
          left: 10px;
          right: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 2;
        }

        .banner-category-badge {
          font-size: 9.5px;
          font-weight: 800;
          background: rgba(255, 255, 255, 0.95);
          color: #334155;
          padding: 2px 7px;
          border-radius: 5px;
          border: 1px solid #e2e8f0;
          letter-spacing: 0.03em;
        }

        .banner-session-tag {
          font-size: 9.5px;
          font-weight: 700;
          background: rgba(255, 255, 255, 0.95);
          color: #64748b;
          padding: 2px 6px;
          border-radius: 5px;
        }

        /* 3D Book Silhouette */
        .book-silhouette-stage {
          perspective: 800px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .book-3d-volume {
          width: 76px;
          height: 108px;
          border-radius: 4px 8px 8px 4px;
          position: relative;
          box-shadow: -4px 6px 14px rgba(15, 23, 42, 0.25), inset 2px 0 4px rgba(255, 255, 255, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotateY(-8deg);
          transition: transform 0.3s ease;
        }

        .rel-book-card:hover .book-3d-volume {
          transform: rotateY(0deg) scale(1.05);
        }

        .book-spine-crease {
          position: absolute;
          left: 8px;
          top: 0;
          bottom: 0;
          width: 1.5px;
          background: rgba(255, 255, 255, 0.25);
        }

        .book-center-emblem {
          opacity: 0.9;
        }

        .cover-rating-pill {
          position: absolute;
          bottom: 10px;
          left: 10px;
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(255, 255, 255, 0.95);
          padding: 2px 6px;
          border-radius: 9999px;
          font-size: 10.5px;
          font-weight: 700;
          color: #b45309;
          border: 1px solid #fde68a;
        }

        .cover-hover-action {
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .rel-book-card:hover .cover-hover-action {
          opacity: 1;
        }

        .hover-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          color: #0f172a;
          padding: 8px 14px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .book-card-body {
          padding: 14px 16px 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .book-title {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 6px 0;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .book-author {
          font-size: 12px;
          color: #64748b;
          margin: 0 0 12px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .book-meta-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          gap: 6px;
        }

        .book-tag-pill {
          font-size: 10.5px;
          font-weight: 600;
          color: #475569;
          background: #f1f5f9;
          padding: 2px 7px;
          border-radius: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 110px;
        }

        .book-access-badge {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 4px;
        }

        .book-access-badge.free {
          background: #ecfdf5;
          color: #059669;
          border: 1px solid rgba(5, 150, 105, 0.2);
        }

        .book-access-badge.sub {
          background: #fffbeb;
          color: #b45309;
          border: 1px solid rgba(217, 119, 6, 0.25);
        }

        /* 5. Flèche Retour Flottante Fluide */
        .floating-back-fab-wrap {
          position: fixed;
          bottom: 24px;
          left: 24px;
          z-index: 45;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .floating-back-fab-wrap.hidden {
          opacity: 0;
          transform: translateY(20px);
          pointer-events: none;
        }

        .floating-back-fab-wrap.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .floating-back-fab-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: #0f172a;
          color: #ffffff;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.25);
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .floating-back-fab-btn:hover {
          background: #d97706;
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(217, 119, 6, 0.35);
        }

        /* 6. Guide Modal */
        .guide-modal-overlay,
        .doc-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .guide-modal-box,
        .doc-modal-box {
          background: #ffffff;
          border-radius: 20px;
          max-width: 680px;
          width: 100%;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.2);
          overflow: hidden;
        }

        .guide-modal-header,
        .doc-modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .modal-badge-pill {
          font-size: 11px;
          font-weight: 700;
          color: #b45309;
          background: #fffbeb;
          padding: 3px 8px;
          border-radius: 9999px;
          border: 1px solid #fde68a;
        }

        .modal-heading {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          margin: 6px 0 2px 0;
        }

        .modal-subheading {
          font-size: 13px;
          color: #64748b;
          margin: 0;
        }

        .guide-modal-close-btn {
          background: #f1f5f9;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          font-size: 14px;
          color: #64748b;
          cursor: pointer;
        }

        .guide-modal-body,
        .doc-modal-body {
          padding: 20px 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .guide-accordion-item {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
        }

        .accordion-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: #f8fafc;
          border: none;
          cursor: pointer;
        }

        .accordion-trigger.open {
          background: #fffbeb;
          border-bottom: 1px solid #fde68a;
        }

        .acc-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .acc-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #0f172a;
        }

        .accordion-content {
          padding: 16px;
          font-size: 13.5px;
          line-height: 1.6;
          color: #475569;
        }

        .beliefs-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .belief-item {
          display: flex;
          gap: 12px;
        }

        .belief-num {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #d97706;
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .guide-modal-footer,
        .doc-modal-footer {
          padding: 16px 24px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .guide-modal-ok-btn,
        .doc-modal-cancel-btn {
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #475569;
          padding: 8px 18px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
        }

        .doc-modal-read-btn {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #ffffff;
          border: none;
          padding: 8px 20px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
        }

        .doc-modal-title {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .doc-modal-author {
          font-size: 13.5px;
          color: #64748b;
          margin: 0;
        }

        .doc-modal-desc-box {
          background: #f8fafc;
          padding: 14px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .doc-modal-desc-box h4 {
          margin: 0 0 6px 0;
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
        }

        .doc-modal-desc-box p {
          margin: 0;
          font-size: 13px;
          line-height: 1.55;
          color: #475569;
        }

        .doc-modal-specs {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .spec-item {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 10px 14px;
          display: flex;
          flex-direction: column;
        }

        .spec-label {
          font-size: 11px;
          color: #94a3b8;
          font-weight: 600;
        }

        .spec-val {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
        }

        @media (max-width: 1024px) {
          .docs-cards-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .docs-cards-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
          }

          .rel-card-content {
            padding: 20px;
          }

          .identity-middle-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 14px;
          }

          .custom-dropdowns-panel {
            grid-template-columns: 1fr;
          }

          .rel-name {
            font-size: 24px;
          }

          .floating-back-fab-wrap {
            bottom: 16px;
            left: 16px;
          }
        }

        @media (max-width: 480px) {
          .docs-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
