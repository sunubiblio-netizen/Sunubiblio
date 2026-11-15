'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Resource, FilterState, SortOption } from '@/types/library';
import { RESOURCE_TYPES, ACCESS_LEVELS } from '@/data/mockLibrary';
import { ResourceCard } from './ResourceCard';
import { EmptyState } from './EmptyState';
import { LibraryPagination } from './LibraryPagination';
import { SortDropdown, SortOptionItem } from '@/components/ui/SortDropdown';

const LIBRARY_SORT_OPTIONS: SortOptionItem<SortOption>[] = [
  {
    value: 'pertinence',
    label: 'Pertinence',
    description: 'Recommandé pour votre niveau',
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
    value: 'rating',
    label: 'Mieux notés',
    description: 'Ressources 5 étoiles',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
      </svg>
    ),
  },
  {
    value: 'pages',
    label: 'Volume (Pages)',
    description: 'Par nombre de pages',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
];

interface ResourceGridProps {
  resources: Resource[];
  totalCount: number;
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  onOpenMobileFilters: () => void;
  onOpenResource: (resource: Resource) => void;
  isFiltersOpen?: boolean;
  onToggleFilters?: () => void;
  activeFiltersCount?: number;
}

const QUICK_CATEGORY_ITEMS = [
  { id: 'livres', label: 'Livres' },
  { id: 'cours', label: 'Cours' },
  { id: 'annales', label: 'Annales' },
  { id: 'exercices', label: 'Exercices' },
  { id: 'documents', label: 'Documents' },
  { id: 'informatique', label: 'Informatique' },
  { id: 'sciences', label: 'Sciences' },
  { id: 'business', label: 'Business & Entrepreneuriat' },
  { id: 'litterature', label: 'Littérature' },
  { id: 'finance', label: 'Finance & Management' },
  { id: 'dev_perso', label: 'Développement personnel' },
  { id: 'religion', label: 'Religion & Spiritualité' },
];

export const ResourceGrid: React.FC<ResourceGridProps> = ({
  resources,
  totalCount,
  filters,
  onFilterChange,
  onResetFilters,
  onOpenMobileFilters,
  onOpenResource,
  isFiltersOpen,
  onToggleFilters,
  activeFiltersCount,
}) => {
  type ActiveControl = 'none' | 'filters' | 'categories' | 'sort';
  const [activeControl, setActiveControl] = useState<ActiveControl>('none');
  const [mobileActiveTab, setMobileActiveTab] = useState<'category' | 'type' | 'access'>('category');
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [isMoreCategoriesOpen, setIsMoreCategoriesOpen] = useState(false);
  const [formatSearchQuery, setFormatSearchQuery] = useState('');
  const [isMoreFormatsOpen, setIsMoreFormatsOpen] = useState(false);

  const ribbonRef = useRef<HTMLDivElement>(null);
  const mobileFilterRef = useRef<HTMLDivElement>(null);

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

  const isMobileFilterPopoverOpen = activeControl === 'filters';
  const isCategoryBarOpen = activeControl === 'categories';
  const isSortOpen = activeControl === 'sort';

  // Toggle Filters: mutual close & auto-scroll down on mobile
  const handleToggleFilters = () => {
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

  // Toggle '+' category ribbon
  const handleToggleCategories = () => {
    if (activeControl === 'categories') {
      setActiveControl('none');
    } else {
      setActiveControl('categories');
    }
  };

  // Sort dropdown open handler
  const handleSortOpenChange = (open: boolean) => {
    if (open) {
      setActiveControl('sort');
    } else if (activeControl === 'sort') {
      setActiveControl('none');
    }
  };

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;
      if (
        activeControl === 'filters' &&
        mobileFilterRef.current &&
        !mobileFilterRef.current.contains(target)
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

  // Active filter badges
  const activePills: { key: string; label: string; remove: () => void }[] = [];

  if (filters.searchQuery) {
    activePills.push({
      key: 'search',
      label: `« ${filters.searchQuery} »`,
      remove: () => onFilterChange({ searchQuery: '', page: 1 }),
    });
  }

  if (filters.category !== 'all') {
    activePills.push({
      key: 'cat',
      label: `Catégorie: ${filters.category}`,
      remove: () => onFilterChange({ category: 'all', page: 1 }),
    });
  }

  if (filters.cycle !== 'all') {
    activePills.push({
      key: 'cycle',
      label: `Niveau: ${filters.cycle}`,
      remove: () => onFilterChange({ cycle: 'all', grade: undefined, page: 1 }),
    });
  }

  if (filters.grade) {
    activePills.push({
      key: 'grade',
      label: `Classe: ${filters.grade}`,
      remove: () => onFilterChange({ grade: undefined, page: 1 }),
    });
  }

  if (filters.subject !== 'all') {
    activePills.push({
      key: 'subject',
      label: `Matière: ${filters.subject}`,
      remove: () => onFilterChange({ subject: 'all', page: 1 }),
    });
  }

  if (filters.resourceType !== 'all') {
    activePills.push({
      key: 'type',
      label: `Format: ${filters.resourceType.toUpperCase()}`,
      remove: () => onFilterChange({ resourceType: 'all', page: 1 }),
    });
  }

  if (filters.accessLevel !== 'all') {
    activePills.push({
      key: 'access',
      label: `Accès: ${filters.accessLevel}`,
      remove: () => onFilterChange({ accessLevel: 'all', page: 1 }),
    });
  }

  if (filters.competition) {
    activePills.push({
      key: 'competition',
      label: `Concours: ${filters.competition.toUpperCase()}`,
      remove: () => onFilterChange({ competition: undefined, page: 1 }),
    });
  }

  const totalPages = Math.ceil(totalCount / filters.perPage) || 1;

  // Exact 4 categories first as requested: Livres, Cours, Annales, Exercices, then the rest
  const LIBRARY_CATEGORIES_ORDERED = [
    { id: 'livres', label: 'Livres' },
    { id: 'cours', label: 'Cours' },
    { id: 'annales', label: 'Annales' },
    { id: 'exercices', label: 'Exercices' },
    { id: 'documents', label: 'Documents' },
    { id: 'informatique', label: 'Informatique' },
    { id: 'sciences', label: 'Sciences' },
    { id: 'business', label: 'Business & Entrepreneuriat' },
    { id: 'litterature', label: 'Littérature' },
    { id: 'finance', label: 'Finance & Management' },
    { id: 'dev_perso', label: 'Développement personnel' },
    { id: 'religion', label: 'Religion & Spiritualité' },
  ];

  // Exact 4 formats first as requested: Fascicules, Cours structuré, Annales, Cahiers d'exercices, then the rest
  const LIBRARY_FORMATS_ORDERED = [
    { id: 'livre', label: 'Fascicules', desc: 'Fascicule / Manuel PDF' },
    { id: 'cours', label: 'Cours structuré', desc: 'Support de cours structuré' },
    { id: 'annales', label: 'Annales', desc: 'Sujets d’examen officiels' },
    { id: 'exercices', label: 'Cahiers d’exercices', desc: 'Série d’exercices corrigés' },
    { id: 'fiche', label: 'Fiche synthétique', desc: 'Fiche mémo & synthèse' },
    { id: 'epreuve', label: 'Épreuve officielle', desc: 'Épreuve officielle concours' },
  ];

  const displayedCategories = categorySearchQuery.trim()
    ? LIBRARY_CATEGORIES_ORDERED.filter((c) =>
        c.label.toLowerCase().includes(categorySearchQuery.toLowerCase())
      )
    : LIBRARY_CATEGORIES_ORDERED;

  const displayedFormats = formatSearchQuery.trim()
    ? LIBRARY_FORMATS_ORDERED.filter(
        (f) =>
          f.label.toLowerCase().includes(formatSearchQuery.toLowerCase()) ||
          f.desc.toLowerCase().includes(formatSearchQuery.toLowerCase())
      )
    : LIBRARY_FORMATS_ORDERED;

  return (
    <section className="resource-grid-section">
      {/* Top Header Row (Aéré, spacieux, bouton Filtres + bouton + transparent à gauche, Tri à droite) */}
      <div className="grid-header">
        <div className="grid-header-left" ref={mobileFilterRef}>
          {/* Bouton Filtres élégant (toujours visible sur mobile, et sur desktop quand la sidebar est fermée) */}
          <button
            type="button"
            className={`open-filters-pill-btn ${isFiltersOpen ? 'desktop-hidden' : ''} ${isMobileFilterPopoverOpen ? 'active' : ''}`}
            onClick={handleToggleFilters}
            aria-label="Ouvrir les filtres"
            title="Ouvrir les filtres"
            aria-expanded={isMobileFilterPopoverOpen}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span>Filtres</span>
            {activeFiltersCount !== undefined && activeFiltersCount > 0 && (
              <span className="filter-pill-badge">{activeFiltersCount}</span>
            )}
            <svg
              className={`filter-chevron ${isMobileFilterPopoverOpen ? 'rotated' : ''}`}
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

          {/* Bouton '+' transparent pour ouvrir/fermer les catégories */}
          <button
            type="button"
            className={`cat-plus-toggle-btn ${isCategoryBarOpen ? 'active' : ''}`}
            onClick={handleToggleCategories}
            aria-expanded={isCategoryBarOpen}
            aria-label={isCategoryBarOpen ? 'Masquer les catégories' : 'Afficher les catégories'}
            title={isCategoryBarOpen ? 'Masquer les catégories' : 'Explorer les catégories (Livres, Cours, Annales...)'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>

          {/* =========================================================
              POPOVER FLOTTANT DE FILTRES SUR MOBILE (Exactement comme Pertinence)
              ========================================================= */}
          {isMobileFilterPopoverOpen && (
            <div className="mobile-filter-popover-card" role="dialog" aria-modal="true">
              {/* Header */}
              <div className="popover-header">
                <div className="popover-header-title-group">
                  <span className="popover-header-title">Filtrer la bibliothèque</span>
                  {activeFiltersCount !== undefined && activeFiltersCount > 0 && (
                    <span className="popover-header-badge">{activeFiltersCount}</span>
                  )}
                </div>
                <div className="popover-header-right">
                  {activeFiltersCount !== undefined && activeFiltersCount > 0 && (
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

              {/* Onglets horizontaux - Tous de taille rigoureusement identique */}
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
                  className={`popover-tab-btn ${mobileActiveTab === 'type' ? 'active' : ''}`}
                  onClick={() => setMobileActiveTab('type')}
                >
                  <span>Format</span>
                  {filters.resourceType !== 'all' && <span className="tab-dot" />}
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

              {/* Options */}
              <div className="popover-options-scroll">
                {/* 1. Catégorie avec mini barre de recherche et défilement fluide */}
                {mobileActiveTab === 'category' && (
                  <div className="popover-options-group">
                    {/* Mini barre de recherche */}
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
                          title="Réinitialiser à toutes les catégories"
                        >
                          Tout
                        </button>
                      ) : null}
                    </div>

                    {/* Liste défilable au doigt (4 catégories visibles au même niveau que format, le reste défilable) */}
                    <div className="popover-items-scrollable">
                      {displayedCategories.length > 0 ? (
                        displayedCategories.map((cat) => {
                          const isSelected = filters.category === cat.id;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              className={`popover-option-item ${isSelected ? 'selected' : ''}`}
                              onClick={() => onFilterChange({ category: cat.id, page: 1 })}
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
                      )}
                    </div>
                  </div>
                )}

                {/* 2. Format avec mini barre de recherche et défilement fluide */}
                {mobileActiveTab === 'type' && (
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
                      ) : filters.resourceType !== 'all' ? (
                        <button
                          type="button"
                          className="search-all-badge-btn"
                          onClick={() => onFilterChange({ resourceType: 'all', page: 1 })}
                          title="Tous les formats"
                        >
                          Tout
                        </button>
                      ) : null}
                    </div>

                    {/* Liste défilable au doigt (4 formats visibles : Fascicules, Cours structuré, Annales, Cahiers d'exercices) */}
                    <div className="popover-items-scrollable">
                      {displayedFormats.length > 0 ? (
                        displayedFormats.map((rt) => {
                          const isSelected = filters.resourceType === rt.id;
                          return (
                            <button
                              key={rt.id}
                              type="button"
                              className={`popover-option-item ${isSelected ? 'selected' : ''}`}
                              onClick={() => onFilterChange({ resourceType: rt.id, page: 1 })}
                            >
                              <div className="option-icon-box">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                  <polyline points="14 2 14 8 20 8" />
                                </svg>
                              </div>
                              <div className="option-text-group">
                                <span className="option-main-label">{rt.label}</span>
                                <span className="option-desc-label">{rt.desc}</span>
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
                      )}
                    </div>
                  </div>
                )}

                {/* 3. Accès */}
                {mobileActiveTab === 'access' && (
                  <div className="popover-options-group">
                    {ACCESS_LEVELS.map((acc) => {
                      const isSelected = filters.accessLevel === acc.id;
                      return (
                        <button
                          key={acc.id}
                          type="button"
                          className={`popover-option-item ${isSelected ? 'selected' : ''}`}
                          onClick={() => onFilterChange({ accessLevel: acc.id, page: 1 })}
                        >
                          <div className="option-icon-box">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                          <span className="option-main-label">{acc.label}</span>
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
            options={LIBRARY_SORT_OPTIONS}
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
            {QUICK_CATEGORY_ITEMS.map((cat) => {
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
                    onFilterChange({ category: isActive ? 'all' : cat.id, page: 1 });
                  }}
                >
                  {isActive && (
                    <span className="pill-active-dot" />
                  )}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Filter Pills Row */}
      {activePills.length > 0 && (
        <div className="active-pills-row">
          <span className="pills-title">Filtres actifs :</span>
          <div className="pills-list">
            {activePills.map((pill) => (
              <span key={pill.key} className="active-filter-pill">
                <span>{pill.label}</span>
                <button
                  type="button"
                  onClick={pill.remove}
                  className="pill-remove-btn"
                  aria-label={`Supprimer le filtre ${pill.label}`}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </span>
            ))}
            <button
              type="button"
              className="clear-all-pills-btn"
              onClick={onResetFilters}
            >
              Tout effacer
            </button>
          </div>
        </div>
      )}

      {/* Main Grid or Empty State */}
      {resources.length === 0 ? (
        <EmptyState onResetFilters={onResetFilters} />
      ) : (
        <div className="cards-container grid">
          {resources.map((res) => (
            <ResourceCard
              key={res.id}
              resource={res}
              onOpenResource={onOpenResource}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {resources.length > 0 && (
        <LibraryPagination
          currentPage={filters.page}
          totalPages={totalPages}
          onPageChange={(page) => onFilterChange({ page })}
        />
      )}

      <style jsx>{`
        .resource-grid-section {
          flex: 1;
          min-width: 0;
        }

        .grid-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          gap: 16px;
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
          padding: 0 16px;
          border-radius: var(--radius-full);
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          color: #1e293b;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.03);
        }

        .open-filters-pill-btn:hover {
          background: #fffdf5;
          border-color: #eab308;
          color: #854d0e;
          box-shadow: 0 4px 12px rgba(234, 179, 8, 0.12);
          transform: translateY(-1px);
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

        /* Liste défilable au doigt pour les éléments */
        .popover-items-scrollable {
          max-height: 180px;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding-right: 2px;
        }

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

        /* Ruban horizontal fluide des catégories */
        .cat-fluid-ribbon-wrapper {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          padding: 6px 8px;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.85);
          border-radius: var(--radius-full);
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.03);
          animation: ribbonExpand 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
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
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 2px 4px;
          touch-action: pan-x;
        }

        .cat-fluid-ribbon-track::-webkit-scrollbar {
          display: none;
        }

        .cat-ribbon-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          padding: 7px 15px;
          font-size: 13px;
          font-weight: 500;
          color: #475569;
          background: #f8fafc;
          border: 1px solid rgba(226, 232, 240, 0.85);
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all 0.18s ease;
          user-select: none;
          flex-shrink: 0;
        }

        .cat-ribbon-pill:hover {
          background: #fffdf5;
          border-color: #eab308;
          color: #854d0e;
        }

        .cat-ribbon-pill.active {
          background: #fefce8;
          border-color: #eab308;
          color: #713f12;
          font-weight: 700;
          box-shadow: 0 2px 6px rgba(234, 179, 8, 0.15);
        }

        .pill-active-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #eab308;
          display: inline-block;
        }

        .ribbon-arrow-btn {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #f1f5f9;
          border: none;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.15s ease;
        }

        .ribbon-arrow-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .filter-toggle-pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border-radius: var(--radius-full);
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          color: #334155;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
        }

        .filter-toggle-pill-btn:hover {
          border-color: rgba(234, 179, 8, 0.45);
          background: #fffdf5;
          color: #854d0e;
          transform: translateY(-1px);
        }

        .filter-toggle-pill-btn.active {
          background: #fefce8;
          border-color: #eab308;
          color: #713f12;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(234, 179, 8, 0.18);
        }

        .filter-pill-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 19px;
          height: 19px;
          padding: 0 5px;
          border-radius: 50%;
          background: #eab308;
          color: #713f12;
          font-size: 11px;
          font-weight: 700;
        }

        /* Active filter pills */
        .active-pills-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
          padding: 10px 14px;
          background: #fffdf5;
          border-radius: var(--radius-md);
          border: 1px solid rgba(234, 179, 8, 0.25);
        }

        .pills-title {
          font-size: 12.5px;
          font-weight: 700;
          color: #854d0e;
        }

        .pills-list {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .active-filter-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 3px 10px;
          border-radius: var(--radius-full);
          background: #ffffff;
          border: 1px solid rgba(234, 179, 8, 0.35);
          font-size: 12px;
          font-weight: 600;
          color: #854d0e;
          box-shadow: 0 1px 3px rgba(234, 179, 8, 0.08);
        }

        .pill-remove-btn {
          color: #d97706;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          border-radius: 50%;
          transition: all 0.1s ease;
        }

        .pill-remove-btn:hover {
          background: #fef9c3;
          color: #713f12;
        }

        .clear-all-pills-btn {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          text-decoration: underline;
          padding: 2px 6px;
        }

        .clear-all-pills-btn:hover {
          color: #ef4444;
        }

        /* Cards Layout (4 cartes par ligne sur PC pour épouser le rectangle tracé) */
        .cards-container.grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        @media (min-width: 1280px) {
          .cards-container.grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 16px;
          }
        }

        @media (max-width: 1200px) {
          .cards-container.grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 16px;
          }
        }

        @media (max-width: 1024px) {
          .mobile-filter-trigger {
            display: inline-flex;
          }

          .cards-container.grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 16px;
          }
        }

        @media (max-width: 820px) {
          .cards-container.grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
          }
        }

        @media (max-width: 640px) {
          .cards-container.grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }

          .sort-label {
            display: none;
          }
        }

        @media (max-width: 360px) {
          .cards-container.grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
          }
        }
      `}</style>
    </section>
  );
};
