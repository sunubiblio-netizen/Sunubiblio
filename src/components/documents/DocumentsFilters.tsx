'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  DocumentCategory,
  DocumentCategoryInfo,
  DocumentFilterState,
  DocumentFormat,
} from '@/types/document';
import { SortDropdown, SortOptionItem } from '@/components/ui/SortDropdown';

const DOC_SORT_OPTIONS: SortOptionItem<DocumentFilterState['sortBy']>[] = [
  {
    value: 'pertinence',
    label: 'Pertinence',
    description: 'Documents recommandés',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    value: 'recent',
    label: 'Plus récents',
    description: 'Dernières parutions',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    value: 'downloads',
    label: 'Téléchargements',
    description: 'Les plus consultés',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
  },
  {
    value: 'title',
    label: 'Titre (A-Z)',
    description: 'Ordre alphabétique',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="21" y1="6" x2="3" y2="6" />
        <line x1="15" y1="12" x2="3" y2="12" />
        <line x1="9" y1="18" x2="3" y2="18" />
      </svg>
    ),
  },
];

interface DocumentsFiltersProps {
  filters: DocumentFilterState;
  onFilterChange: (newFilters: Partial<DocumentFilterState>) => void;
  onResetFilters: () => void;
  categories: DocumentCategoryInfo[];
  availableYears: number[];
  totalResults: number;
  isFiltersOpen?: boolean;
  onToggleFilters?: () => void;
  activeFiltersCount?: number;
}

export const DocumentsFilters: React.FC<DocumentsFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  categories,
  availableYears,
  totalResults,
  isFiltersOpen = false,
  onToggleFilters,
  activeFiltersCount = 0,
}) => {
  type ActiveControl = 'none' | 'filters' | 'categories' | 'sort';
  const [activeControl, setActiveControl] = useState<ActiveControl>('none');
  const [mobileActiveTab, setMobileActiveTab] = useState<'category' | 'format' | 'access'>('category');
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [isMoreCategoriesOpen, setIsMoreCategoriesOpen] = useState(false);
  const [formatSearchQuery, setFormatSearchQuery] = useState('');
  const [isMoreFormatsOpen, setIsMoreFormatsOpen] = useState(false);
  
  const ribbonRef = useRef<HTMLDivElement>(null);
  const mobilePopoverRef = useRef<HTMLDivElement>(null);

  // Touch & drag handler for ultra-fluid ribbon scrolling on mobile
  const ribbonTouchStartX = useRef<number | null>(null);
  const ribbonTouchStartScroll = useRef<number>(0);
  const ribbonHasMoved = useRef<boolean>(false);
  const ribbonIsDragging = useRef<boolean>(false);

  const onRibbonTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    ribbonHasMoved.current = false;
    ribbonTouchStartX.current = e.touches[0].clientX;
    ribbonTouchStartScroll.current = ribbonRef.current?.scrollLeft || 0;
  };

  const onRibbonTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (ribbonTouchStartX.current === null || !ribbonRef.current) return;
    const diff = ribbonTouchStartX.current - e.touches[0].clientX;
    if (Math.abs(diff) > 4) {
      ribbonHasMoved.current = true;
    }
    ribbonRef.current.scrollLeft = ribbonTouchStartScroll.current + diff;
  };

  const onRibbonTouchEnd = () => {
    ribbonTouchStartX.current = null;
  };

  const onRibbonMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    ribbonIsDragging.current = true;
    ribbonHasMoved.current = false;
    ribbonTouchStartX.current = e.clientX;
    ribbonTouchStartScroll.current = ribbonRef.current?.scrollLeft || 0;
  };

  const onRibbonMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ribbonIsDragging.current || ribbonTouchStartX.current === null || !ribbonRef.current) return;
    const diff = ribbonTouchStartX.current - e.clientX;
    if (Math.abs(diff) > 4) {
      ribbonHasMoved.current = true;
    }
    ribbonRef.current.scrollLeft = ribbonTouchStartScroll.current + diff;
  };

  const onRibbonMouseUp = () => {
    ribbonIsDragging.current = false;
    ribbonTouchStartX.current = null;
  };

  const isMobilePopoverOpen = activeControl === 'filters';
  const isCategoryBarOpen = activeControl === 'categories';
  const isSortOpen = activeControl === 'sort';

  // Click on "Filtres" button: on mobile it opens the floating popover; on desktop it toggles the sidebar
  const handleFiltresClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
      if (activeControl === 'filters') {
        setActiveControl('none');
      } else {
        setActiveControl('filters');
        setTimeout(() => {
          window.scrollBy({ top: 140, behavior: 'smooth' });
        }, 60);
      }
    } else {
      if (onToggleFilters) onToggleFilters();
    }
  };

  const handleToggleCategories = () => {
    if (activeControl === 'categories') {
      setActiveControl('none');
    } else {
      setActiveControl('categories');
    }
  };

  const handleSortOpenChange = (open: boolean) => {
    if (open) {
      setActiveControl('sort');
    } else if (activeControl === 'sort') {
      setActiveControl('none');
    }
  };

  // Close mobile popover when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;
      if (
        activeControl === 'filters' &&
        mobilePopoverRef.current &&
        !mobilePopoverRef.current.contains(target)
      ) {
        setActiveControl('none');
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && activeControl !== 'none') {
        setActiveControl('none');
      }
    }

    if (activeControl !== 'none') {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeControl]);

  const allCategories = useMemo(() => {
    return [
      { id: 'all', label: 'Toutes les catégories' },
      ...categories.map((c) => ({ id: c.id, label: c.label })),
    ];
  }, [categories]);

  const formatsList: { id: DocumentFormat | 'all'; label: string; desc: string }[] = [
    { id: 'all', label: 'Tous les formats', desc: 'Sans restriction de format' },
    { id: 'PDF', label: 'Fascicule / Manuel PDF', desc: 'Fichier PDF haute définition' },
    { id: 'DOCX', label: 'Word / DOCX modifiable', desc: 'Document texte éditable' },
    { id: 'XLSX', label: 'Tableur Excel (XLSX)', desc: 'Feuille de calcul et formules' },
    { id: 'Autre', label: 'Autre format officiel', desc: 'Formulaires et modèles types' },
  ];

  const accessList: { id: 'all' | 'free' | 'premium'; label: string; desc: string }[] = [
    { id: 'all', label: 'Tous les accès', desc: 'Gratuits et Abonnements' },
    { id: 'free', label: 'Accès Public Gratuit', desc: 'Téléchargement direct immédiat' },
    { id: 'premium', label: 'Réservé Abonnés', desc: 'Accès avec formule active' },
  ];

  // Document category separation: top 5 + collapsible remaining
  const actualCategories = categories.map((c) => ({ id: c.id, label: c.label }));
  const topDocCategories = actualCategories.slice(0, 5);
  const otherDocCategories = actualCategories.slice(5);
  const filteredDocCategories = categorySearchQuery.trim()
    ? actualCategories.filter((c) =>
        c.label.toLowerCase().includes(categorySearchQuery.toLowerCase())
      )
    : null;

  // Format separation: top 2 + collapsible remaining
  const actualFormats = formatsList.filter((f) => f.id !== 'all');
  const topDocFormats = actualFormats.slice(0, 2); // PDF, DOCX
  const otherDocFormats = actualFormats.slice(2); // XLSX, Autre
  const filteredDocFormats = formatSearchQuery.trim()
    ? actualFormats.filter((f) =>
        f.label.toLowerCase().includes(formatSearchQuery.toLowerCase())
      )
    : null;

  return (
    <div className="doc-grid-header-wrapper">
      {/* Top Header Row (Identique à Bibliothèque : Filtres + bouton + à gauche, Trier par à droite) */}
      <div className="grid-header">
        <div className="grid-header-left" ref={mobilePopoverRef}>
          {/* Bouton Filtres élégant */}
          <button
            type="button"
            className={`open-filters-pill-btn ${isFiltersOpen ? 'desktop-hidden' : ''} ${isMobilePopoverOpen ? 'active' : ''}`}
            onClick={handleFiltresClick}
            aria-label="Ouvrir les filtres"
            title="Ouvrir les filtres"
            aria-expanded={isMobilePopoverOpen}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span>Filtres</span>
            {activeFiltersCount > 0 && (
              <span className="filter-pill-badge">{activeFiltersCount}</span>
            )}
            <svg
              className={`filter-chevron ${isMobilePopoverOpen ? 'rotated' : ''}`}
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Bouton '+' transparent pour ouvrir/fermer le ruban des catégories */}
          <button
            type="button"
            className={`cat-plus-toggle-btn ${isCategoryBarOpen ? 'active' : ''}`}
            onClick={handleToggleCategories}
            aria-expanded={isCategoryBarOpen}
            aria-label={isCategoryBarOpen ? 'Masquer les catégories' : 'Afficher les catégories'}
            title={isCategoryBarOpen ? 'Masquer les catégories' : 'Explorer les catégories de documents'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>

          {/* =========================================================
              POPOVER FLOTTANT DE FILTRES SUR MOBILE (Exactement comme Pertinence)
              ========================================================= */}
          {isMobilePopoverOpen && (
            <div className="mobile-filter-popover-card" role="dialog" aria-modal="true">
              {/* Header */}
              <div className="popover-header">
                <div className="popover-header-title-group">
                  <span className="popover-header-title">Filtrer les documents</span>
                  {activeFiltersCount > 0 && (
                    <span className="popover-header-badge">{activeFiltersCount}</span>
                  )}
                </div>
                <div className="popover-header-right">
                  {activeFiltersCount > 0 && (
                    <button
                      type="button"
                      className="popover-reset-btn"
                      onClick={onResetFilters}
                    >
                      Réinitialiser
                    </button>
                  )}
                  <button
                    type="button"
                    className="popover-close-btn"
                    onClick={() => setActiveControl('none')}
                    aria-label="Fermer les filtres"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Navigation par 3 Onglets - Strictement de même taille */}
              <div className="popover-tabs-nav">
                <button
                  type="button"
                  className={`popover-tab-btn ${mobileActiveTab === 'category' ? 'active' : ''}`}
                  onClick={() => setMobileActiveTab('category')}
                >
                  <span>Catégorie</span>
                  {filters.category !== 'all' && <span className="tab-dot" />}
                </button>
                <button
                  type="button"
                  className={`popover-tab-btn ${mobileActiveTab === 'format' ? 'active' : ''}`}
                  onClick={() => setMobileActiveTab('format')}
                >
                  <span>Format</span>
                  {filters.format !== 'all' && <span className="tab-dot" />}
                </button>
                <button
                  type="button"
                  className={`popover-tab-btn ${mobileActiveTab === 'access' ? 'active' : ''}`}
                  onClick={() => setMobileActiveTab('access')}
                >
                  <span>Accès</span>
                  {filters.accessLevel !== 'all' && <span className="tab-dot" />}
                </button>
              </div>

              {/* Options List */}
              <div className="popover-options-scroll">
                {/* 1. Catégorie avec mini barre de recherche et déroulant */}
                {mobileActiveTab === 'category' && (
                  <div className="popover-options-group">
                    {/* Mini barre de recherche remplaçant "Toutes les catégories" */}
                    <div className="popover-search-box">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Rechercher une catégorie..."
                        value={categorySearchQuery}
                        onChange={(e) => setCategorySearchQuery(e.target.value)}
                        className="popover-search-input"
                      />
                      {categorySearchQuery ? (
                        <button
                          type="button"
                          className="search-clear-btn"
                          onClick={() => setCategorySearchQuery('')}
                        >
                          ×
                        </button>
                      ) : filters.category !== 'all' ? (
                        <button
                          type="button"
                          className="search-all-badge-btn"
                          onClick={() => onFilterChange({ category: 'all', page: 1 })}
                          title="Toutes les catégories"
                        >
                          Tout
                        </button>
                      ) : null}
                    </div>

                    {filteredDocCategories ? (
                      filteredDocCategories.length > 0 ? (
                        filteredDocCategories.map((cat) => {
                          const isSelected = filters.category === cat.id;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              className={`popover-option-item ${isSelected ? 'selected' : ''}`}
                              onClick={() => onFilterChange({ category: cat.id as DocumentCategory | 'all', page: 1 })}
                            >
                              <div className="option-icon-box">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                </svg>
                              </div>
                              <span className="option-main-label">{cat.label}</span>
                              {isSelected && (
                                <div className="option-check-pill">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                </div>
                              )}
                            </button>
                          );
                        })
                      ) : (
                        <div className="popover-no-results">Aucune catégorie trouvée</div>
                      )
                    ) : (
                      <>
                        {topDocCategories.map((cat) => {
                          const isSelected = filters.category === cat.id;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              className={`popover-option-item ${isSelected ? 'selected' : ''}`}
                              onClick={() => onFilterChange({ category: cat.id as DocumentCategory | 'all', page: 1 })}
                            >
                              <div className="option-icon-box">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                </svg>
                              </div>
                              <span className="option-main-label">{cat.label}</span>
                              {isSelected && (
                                <div className="option-check-pill">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                </div>
                              )}
                            </button>
                          );
                        })}

                        {otherDocCategories.length > 0 && (
                          <>
                            <button
                              type="button"
                              className={`popover-more-toggle-btn ${isMoreCategoriesOpen ? 'open' : ''}`}
                              onClick={() => setIsMoreCategoriesOpen(!isMoreCategoriesOpen)}
                            >
                              <span>{isMoreCategoriesOpen ? 'Moins de catégories' : 'Autres catégories (Modèles, Textes...)'}</span>
                              <svg className={`chevron-icon ${isMoreCategoriesOpen ? 'rotated' : ''}`} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </button>

                            {isMoreCategoriesOpen && (
                              <div className="popover-more-list">
                                {otherDocCategories.map((cat) => {
                                  const isSelected = filters.category === cat.id;
                                  return (
                                    <button
                                      key={cat.id}
                                      type="button"
                                      className={`popover-option-item ${isSelected ? 'selected' : ''}`}
                                      onClick={() => onFilterChange({ category: cat.id as DocumentCategory | 'all', page: 1 })}
                                    >
                                      <div className="option-icon-box">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                        </svg>
                                      </div>
                                      <span className="option-main-label">{cat.label}</span>
                                      {isSelected && (
                                        <div className="option-check-pill">
                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                          </svg>
                                        </div>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* 2. Format */}
                {mobileActiveTab === 'format' && (
                  <div className="popover-options-group">
                    <div className="popover-search-box">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Rechercher un format..."
                        value={formatSearchQuery}
                        onChange={(e) => setFormatSearchQuery(e.target.value)}
                        className="popover-search-input"
                      />
                      {formatSearchQuery ? (
                        <button
                          type="button"
                          className="search-clear-btn"
                          onClick={() => setFormatSearchQuery('')}
                        >
                          ×
                        </button>
                      ) : filters.format !== 'all' ? (
                        <button
                          type="button"
                          className="search-all-badge-btn"
                          onClick={() => onFilterChange({ format: 'all', page: 1 })}
                          title="Tous les formats"
                        >
                          Tout
                        </button>
                      ) : null}
                    </div>

                    {filteredDocFormats ? (
                      filteredDocFormats.length > 0 ? (
                        filteredDocFormats.map((f) => {
                          const isSelected = filters.format === f.id;
                          return (
                            <button
                              key={f.id}
                              type="button"
                              className={`popover-option-item ${isSelected ? 'selected' : ''}`}
                              onClick={() => onFilterChange({ format: f.id, page: 1 })}
                            >
                              <div className="option-icon-box">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                  <polyline points="14 2 14 8 20 8" />
                                </svg>
                              </div>
                              <div className="option-text-group">
                                <span className="option-main-label">{f.label}</span>
                                <span className="option-desc-label">{f.desc}</span>
                              </div>
                              {isSelected && (
                                <div className="option-check-pill">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                </div>
                              )}
                            </button>
                          );
                        })
                      ) : (
                        <div className="popover-no-results">Aucun format trouvé</div>
                      )
                    ) : (
                      <>
                        {topDocFormats.map((f) => {
                          const isSelected = filters.format === f.id;
                          return (
                            <button
                              key={f.id}
                              type="button"
                              className={`popover-option-item ${isSelected ? 'selected' : ''}`}
                              onClick={() => onFilterChange({ format: f.id, page: 1 })}
                            >
                              <div className="option-icon-box">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                  <polyline points="14 2 14 8 20 8" />
                                </svg>
                              </div>
                              <div className="option-text-group">
                                <span className="option-main-label">{f.label}</span>
                                <span className="option-desc-label">{f.desc}</span>
                              </div>
                              {isSelected && (
                                <div className="option-check-pill">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                </div>
                              )}
                            </button>
                          );
                        })}

                        {otherDocFormats.length > 0 && (
                          <>
                            <button
                              type="button"
                              className={`popover-more-toggle-btn ${isMoreFormatsOpen ? 'open' : ''}`}
                              onClick={() => setIsMoreFormatsOpen(!isMoreFormatsOpen)}
                            >
                              <span>{isMoreFormatsOpen ? 'Moins de formats' : 'Autres formats (Excel, Autres...)'}</span>
                              <svg className={`chevron-icon ${isMoreFormatsOpen ? 'rotated' : ''}`} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </button>

                            {isMoreFormatsOpen && (
                              <div className="popover-more-list">
                                {otherDocFormats.map((f) => {
                                  const isSelected = filters.format === f.id;
                                  return (
                                    <button
                                      key={f.id}
                                      type="button"
                                      className={`popover-option-item ${isSelected ? 'selected' : ''}`}
                                      onClick={() => onFilterChange({ format: f.id, page: 1 })}
                                    >
                                      <div className="option-icon-box">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                          <polyline points="14 2 14 8 20 8" />
                                        </svg>
                                      </div>
                                      <div className="option-text-group">
                                        <span className="option-main-label">{f.label}</span>
                                        <span className="option-desc-label">{f.desc}</span>
                                      </div>
                                      {isSelected && (
                                        <div className="option-check-pill">
                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                          </svg>
                                        </div>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* 3. Accès */}
                {mobileActiveTab === 'access' && (
                  <div className="popover-options-group">
                    {accessList.map((acc) => {
                      const isSelected = filters.accessLevel === acc.id;
                      return (
                        <button
                          key={acc.id}
                          type="button"
                          className={`popover-option-item ${isSelected ? 'selected' : ''}`}
                          onClick={() => onFilterChange({ accessLevel: acc.id, page: 1 })}
                        >
                          <div className="option-icon-box">
                            {acc.id === 'premium' ? (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                            ) : (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>
                          <div className="option-text-group">
                            <span className="option-main-label">{acc.label}</span>
                            <span className="option-desc-label">{acc.desc}</span>
                          </div>
                          {isSelected && (
                            <div className="option-check-pill">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="grid-header-right">
          <SortDropdown
            value={filters.sortBy}
            onChange={(val) => onFilterChange({ sortBy: val, page: 1 })}
            options={DOC_SORT_OPTIONS}
            labelPrefix="Trier par :"
            align="right"
            isOpen={isSortOpen}
            onOpenChange={handleSortOpenChange}
          />
        </div>
      </div>

      {/* Ruban horizontal fluide des catégories (100% tactile et glissant avec les doigts) */}
      {isCategoryBarOpen && (
        <div className="cat-fluid-ribbon-wrapper">
          <div
            className="cat-fluid-ribbon-track"
            ref={ribbonRef}
            onTouchStart={onRibbonTouchStart}
            onTouchMove={onRibbonTouchMove}
            onTouchEnd={onRibbonTouchEnd}
            onMouseDown={onRibbonMouseDown}
            onMouseMove={onRibbonMouseMove}
            onMouseUp={onRibbonMouseUp}
            onMouseLeave={onRibbonMouseUp}
          >
            {actualCategories.map((cat) => {
              const isActive = filters.category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`cat-ribbon-pill ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    if (ribbonHasMoved.current) {
                      ribbonHasMoved.current = false;
                      return;
                    }
                    onFilterChange({ category: isActive ? 'all' : (cat.id as DocumentCategory), page: 1 });
                  }}
                >
                  {isActive && <span className="pill-active-dot" />}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Filter Pills Row */}
      {activeFiltersCount > 0 && (
        <div className="active-pills-row">
          <span className="pills-title">Filtres actifs :</span>
          <div className="pills-list">
            {filters.category !== 'all' && (
              <span className="active-filter-pill">
                <span>Catégorie : {categories.find((c) => c.id === filters.category)?.label || filters.category}</span>
                <button
                  type="button"
                  onClick={() => onFilterChange({ category: 'all', page: 1 })}
                  className="pill-remove-btn"
                >
                  ✕
                </button>
              </span>
            )}
            {filters.format !== 'all' && (
              <span className="active-filter-pill">
                <span>Format : {filters.format}</span>
                <button
                  type="button"
                  onClick={() => onFilterChange({ format: 'all', page: 1 })}
                  className="pill-remove-btn"
                >
                  ✕
                </button>
              </span>
            )}
            {filters.year !== 'all' && (
              <span className="active-filter-pill">
                <span>Année : {filters.year}</span>
                <button
                  type="button"
                  onClick={() => onFilterChange({ year: 'all', page: 1 })}
                  className="pill-remove-btn"
                >
                  ✕
                </button>
              </span>
            )}
            {filters.accessLevel !== 'all' && (
              <span className="active-filter-pill">
                <span>Accès : {filters.accessLevel === 'premium' ? 'Abonnement' : 'Gratuit'}</span>
                <button
                  type="button"
                  onClick={() => onFilterChange({ accessLevel: 'all', page: 1 })}
                  className="pill-remove-btn"
                >
                  ✕
                </button>
              </span>
            )}
            <button type="button" className="pill-reset-all" onClick={onResetFilters}>
              Effacer tout
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .doc-grid-header-wrapper {
          margin-bottom: 20px;
        }

        .grid-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          gap: 16px;
          position: relative;
        }

        .grid-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
          position: relative;
        }

        .open-filters-pill-btn {
          height: 38px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0 14px;
          border-radius: 9999px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          color: #1e293b;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
        }

        .open-filters-pill-btn:hover {
          background: #fafafa;
          border-color: #cbd5e1;
          color: #1e293b;
        }

        .open-filters-pill-btn.active {
          border-color: #f59e0b;
          color: #854d0e;
          background: #fffdf5;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
        }

        .filter-chevron {
          color: #94a3b8;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          margin-left: -2px;
        }

        .filter-chevron.rotated {
          transform: rotate(180deg);
          color: #d97706;
        }

        @media (min-width: 1025px) {
          .open-filters-pill-btn.desktop-hidden {
            display: none !important;
          }
          .filter-chevron {
            display: none !important;
          }
          .mobile-filter-popover-card {
            display: none !important;
          }
        }

        .filter-pill-badge {
          background: #d97706;
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          padding: 1px 7px;
          border-radius: 9999px;
          line-height: 1.3;
        }

        .cat-plus-toggle-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          color: #475569;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.03);
        }

        .cat-plus-toggle-btn:hover {
          background: #fffdf5;
          border-color: #eab308;
          color: #854d0e;
          box-shadow: 0 4px 12px rgba(234, 179, 8, 0.12);
          transform: translateY(-1px);
        }

        .cat-plus-toggle-btn.active {
          background: #fefce8;
          border-color: #eab308;
          color: #854d0e;
          box-shadow: 0 2px 8px rgba(234, 179, 8, 0.18);
        }

        .cat-plus-toggle-btn.active svg {
          transform: rotate(45deg);
          transition: transform 0.22s ease;
        }

        .cat-plus-toggle-btn svg {
          transition: transform 0.22s ease;
        }

        .grid-header-right {
          display: flex;
          align-items: center;
        }

        /* =========================================================
           POPOVER FLOTTANT SUR MOBILE (Exactement comme Pertinence)
           ========================================================= */
        .mobile-filter-popover-card {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          z-index: 500;
          width: 295px;
          max-width: calc(100vw - 32px);
          max-height: calc(100vh - 210px);
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 14px;
          box-shadow: 0 16px 36px -4px rgba(15, 23, 42, 0.16),
            0 2px 8px rgba(15, 23, 42, 0.04);
          padding: 10px;
          animation: popoverFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes popoverFadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .popover-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 4px 8px 6px;
          border-bottom: 1px solid #f1f5f9;
        }

        .popover-header-title-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .popover-header-right {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .popover-close-btn {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #f1f5f9;
          border: none;
          color: #64748b;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .popover-close-btn:hover {
          background: #fee2e2;
          color: #ef4444;
        }

        .popover-header-title {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .popover-header-badge {
          background: #eab308;
          color: #713f12;
          font-size: 10px;
          font-weight: 800;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .popover-reset-btn {
          background: none;
          border: none;
          font-size: 11px;
          font-weight: 700;
          color: #d97706;
          cursor: pointer;
          padding: 2px 4px;
        }

        .popover-reset-btn:hover {
          text-decoration: underline;
        }

        /* Onglets horizontaux - Tous de taille rigoureusement identique */
        .popover-tabs-nav {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 5px;
          padding: 8px 2px;
          border-bottom: 1px solid #f1f5f9;
          width: 100%;
          box-sizing: border-box;
        }

        .popover-tab-btn {
          width: 100%;
          min-width: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 6px 2px;
          border-radius: 8px;
          border: 1px solid transparent;
          background: #f8fafc;
          color: #64748b;
          font-size: 11.5px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
          box-sizing: border-box;
        }

        .popover-tab-btn.active {
          background: #fffbeb;
          border-color: rgba(245, 158, 11, 0.35);
          color: #b45309;
          font-weight: 700;
        }

        .tab-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #f59e0b;
        }

        /* Barre de recherche intégrée au popover */
        .popover-search-box {
          display: flex;
          align-items: center;
          gap: 7px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          padding: 6px 9px;
          margin: 4px 2px 7px 2px;
          transition: all 0.15s ease;
        }

        .popover-search-box:focus-within {
          border-color: #f59e0b;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.12);
        }

        .popover-search-input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 12px;
          color: #1e293b;
          outline: none;
          min-width: 0;
        }

        .popover-search-input::placeholder {
          color: #94a3b8;
        }

        .search-clear-btn {
          background: #e2e8f0;
          border: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          color: #64748b;
          font-size: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          line-height: 1;
          padding: 0;
        }

        .search-all-badge-btn {
          background: #fffbeb;
          border: 1px solid rgba(245, 158, 11, 0.4);
          color: #b45309;
          font-size: 10px;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 6px;
          cursor: pointer;
          white-space: nowrap;
        }

        .popover-no-results {
          padding: 12px 8px;
          text-align: center;
          color: #94a3b8;
          font-size: 12px;
        }

        /* Bouton déroulant pour le reste des catégories */
        .popover-more-toggle-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 7px 9px;
          margin-top: 3px;
          border-radius: 8px;
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          color: #64748b;
          font-size: 11.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .popover-more-toggle-btn:hover {
          background: #fffbeb;
          border-color: #f59e0b;
          color: #b45309;
        }

        .popover-more-toggle-btn.open {
          background: #fffdf5;
          border-color: #f59e0b;
          color: #854d0e;
        }

        .popover-more-toggle-btn .chevron-icon {
          transition: transform 0.2s ease;
        }

        .popover-more-toggle-btn .chevron-icon.rotated {
          transform: rotate(180deg);
        }

        .popover-more-list {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding-top: 4px;
        }

        /* Liste des options */
        .popover-options-scroll {
          flex: 1;
          max-height: calc(100vh - 280px);
          min-height: 120px;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
          padding: 4px 2px;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .popover-options-group {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .popover-option-item {
          display: flex;
          align-items: center;
          gap: 9px;
          width: 100%;
          padding: 7px 9px;
          border-radius: 10px;
          background: transparent;
          border: 1px solid transparent;
          text-align: left;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .popover-option-item:hover {
          background: #f8fafc;
        }

        .popover-option-item.selected {
          background: #fefce8;
          border-color: rgba(234, 179, 8, 0.35);
        }

        .option-icon-box {
          width: 26px;
          height: 26px;
          border-radius: 8px;
          background: #f8fafc;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.15s ease;
        }

        .popover-option-item.selected .option-icon-box {
          background: linear-gradient(135deg, #facc15 0%, #eab308 100%);
          color: #713f12;
          box-shadow: 0 2px 6px rgba(234, 179, 8, 0.25);
        }

        .option-text-group {
          display: flex;
          flex-direction: column;
          gap: 1px;
          flex: 1;
          min-width: 0;
        }

        .option-main-label {
          font-size: 12.5px;
          font-weight: 600;
          color: #1e293b;
          line-height: 1.25;
          flex: 1;
        }

        .popover-option-item.selected .option-main-label {
          color: #854d0e;
          font-weight: 700;
        }

        .option-desc-label {
          font-size: 10px;
          color: #64748b;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .option-check-pill {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgba(234, 179, 8, 0.2);
          flex-shrink: 0;
        }

        /* Ruban horizontal fluide des catégories */
        .cat-fluid-ribbon-wrapper {
          display: flex;
          align-items: center;
          margin-bottom: 18px;
          padding: 6px 8px;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.85);
          border-radius: 9999px;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.03);
          animation: ribbonExpand 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }

        @keyframes ribbonExpand {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .cat-fluid-ribbon-track {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 2px 4px;
          scroll-behavior: smooth;
          touch-action: pan-x;
        }

        .cat-fluid-ribbon-track::-webkit-scrollbar {
          display: none;
        }

        .cat-ribbon-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .cat-ribbon-pill:hover {
          background: #fffdf5;
          border-color: #f59e0b;
          color: #92400e;
        }

        .cat-ribbon-pill.active {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          border-color: #d97706;
          color: #ffffff;
          box-shadow: 0 4px 10px rgba(217, 119, 6, 0.25);
        }

        .pill-active-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ffffff;
        }

        /* Active Pills Row */
        .active-pills-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .pills-title {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
        }

        .pills-list {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .active-filter-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: #fffbeb;
          border: 1px solid rgba(245, 158, 11, 0.4);
          border-radius: 9999px;
          font-size: 12px;
          color: #92400e;
          font-weight: 600;
        }

        .pill-remove-btn {
          background: none;
          border: none;
          color: #b45309;
          cursor: pointer;
          font-size: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }

        .pill-reset-all {
          background: none;
          border: none;
          font-size: 12px;
          color: #64748b;
          text-decoration: underline;
          cursor: pointer;
        }

        .pill-reset-all:hover {
          color: #0f172a;
        }
      `}</style>
    </div>
  );
};
