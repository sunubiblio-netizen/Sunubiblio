'use client';

import React, { useState, useRef, useMemo } from 'react';
import {
  DocumentCategory,
  DocumentCategoryInfo,
  DocumentFilterState,
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
  const [isCategoryBarOpen, setIsCategoryBarOpen] = useState(false);
  const ribbonRef = useRef<HTMLDivElement>(null);

  // Ribbon scroll helper
  const scrollRibbon = (direction: 'left' | 'right') => {
    if (ribbonRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      ribbonRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const allCategories = useMemo(() => {
    return [
      { id: 'all', label: 'Tous les documents' },
      ...categories.map((c) => ({ id: c.id, label: c.label })),
    ];
  }, [categories]);

  return (
    <div className="doc-grid-header-wrapper">
      {/* Top Header Row (Identique à Bibliothèque : Filtres + bouton + à gauche, Trier par à droite) */}
      <div className="grid-header">
        <div className="grid-header-left">
          {/* Bouton Filtres élégant (masqué sur desktop quand la sidebar est ouverte, visible sur mobile ou quand sidebar repliée) */}
          <button
            type="button"
            className={`open-filters-pill-btn ${isFiltersOpen ? 'desktop-hidden' : ''}`}
            onClick={onToggleFilters}
            aria-label="Ouvrir les filtres"
            title="Ouvrir les filtres"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span>Filtres</span>
            {activeFiltersCount > 0 && (
              <span className="filter-pill-badge">{activeFiltersCount}</span>
            )}
          </button>

          {/* Bouton '+' transparent pour ouvrir/fermer le ruban des catégories */}
          <button
            type="button"
            className={`cat-plus-toggle-btn ${isCategoryBarOpen ? 'active' : ''}`}
            onClick={() => setIsCategoryBarOpen(!isCategoryBarOpen)}
            aria-expanded={isCategoryBarOpen}
            aria-label={isCategoryBarOpen ? 'Masquer les catégories' : 'Afficher les catégories'}
            title={isCategoryBarOpen ? 'Masquer les catégories' : 'Explorer les catégories de documents'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        <div className="grid-header-right">
          <SortDropdown
            value={filters.sortBy}
            onChange={(val) => onFilterChange({ sortBy: val, page: 1 })}
            options={DOC_SORT_OPTIONS}
            labelPrefix="Trier par :"
            align="right"
          />
        </div>
      </div>

      {/* Ruban horizontal fluide des catégories (ouvert au clic sur le '+') */}
      {isCategoryBarOpen && (
        <div className="cat-fluid-ribbon-wrapper">
          <button
            type="button"
            className="ribbon-arrow-btn prev"
            onClick={() => scrollRibbon('left')}
            aria-label="Faire défiler vers la gauche"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="cat-fluid-ribbon-track" ref={ribbonRef}>
            {allCategories.map((cat) => {
              const isActive = filters.category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`cat-ribbon-pill ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    onFilterChange({ category: isActive ? 'all' : (cat.id as DocumentCategory), page: 1 });
                  }}
                >
                  {isActive && <span className="pill-active-dot" />}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="ribbon-arrow-btn next"
            onClick={() => scrollRibbon('right')}
            aria-label="Faire défiler vers la droite"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}

      {/* Active Filter Pills Row */}
      {activeFiltersCount > 0 && !isFiltersOpen && (
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
          border-radius: 9999px;
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

        @media (min-width: 1025px) {
          .open-filters-pill-btn.desktop-hidden {
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

        /* Ruban horizontal fluide des catégories */
        .cat-fluid-ribbon-wrapper {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 18px;
          padding: 8px 10px;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.85);
          border-radius: 9999px;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.03);
          animation: ribbonExpand 0.22s cubic-bezier(0.16, 1, 0.3, 1);
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

        .ribbon-arrow-btn {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #64748b;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.18s ease;
        }

        .ribbon-arrow-btn:hover {
          background: #fffbeb;
          border-color: #f59e0b;
          color: #b45309;
        }

        .cat-fluid-ribbon-track {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 2px 4px;
          scroll-behavior: smooth;
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
