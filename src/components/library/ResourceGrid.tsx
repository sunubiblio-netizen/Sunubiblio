'use client';

import React, { useState } from 'react';
import { Resource, FilterState, SortOption } from '@/types/library';
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
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

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

  return (
    <section className="resource-grid-section">
      {/* Top Header Row (Aéré, spacieux, bouton Filtres à gauche, Tri à droite) */}
      <div className="grid-header">
        <div className="grid-header-left">
          <button
            type="button"
            className={`filter-toggle-pill-btn ${isFiltersOpen ? 'active' : ''}`}
            onClick={onToggleFilters || onOpenMobileFilters}
            aria-expanded={isFiltersOpen}
            aria-label="Afficher ou masquer les filtres"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span>Filtres</span>
            {(activeFiltersCount !== undefined ? activeFiltersCount : activePills.length) > 0 && (
              <span className="filter-pill-badge">{activeFiltersCount !== undefined ? activeFiltersCount : activePills.length}</span>
            )}
          </button>

          {/* Bouton '+' transparent pour ouvrir les catégories (Livres, Cours, Annales...) */}
          <div className="cat-plus-picker-wrapper">
            <button
              type="button"
              className={`cat-plus-btn ${isCategoryMenuOpen ? 'active' : ''}`}
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              aria-expanded={isCategoryMenuOpen}
              aria-label="Choisir une catégorie"
              title="Catégories (Livres, Cours, Annales...)"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>

            {isCategoryMenuOpen && (
              <>
                <div
                  className="cat-picker-backdrop"
                  onClick={() => setIsCategoryMenuOpen(false)}
                  aria-hidden="true"
                />
                <div className="cat-picker-dropdown" role="dialog" aria-label="Catégories">
                  <div className="cat-picker-header">
                    <span className="cat-picker-title">Catégories</span>
                    <button
                      type="button"
                      className="cat-picker-close"
                      onClick={() => setIsCategoryMenuOpen(false)}
                      aria-label="Fermer"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="cat-picker-list">
                    {QUICK_CATEGORY_ITEMS.map((cat) => {
                      const isActive = filters.category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          className={`cat-picker-item ${isActive ? 'active' : ''}`}
                          onClick={() => {
                            onFilterChange({ category: isActive ? 'all' : cat.id, page: 1 });
                            setIsCategoryMenuOpen(false);
                          }}
                        >
                          <span className="item-dot" />
                          <span className="item-name">{cat.label}</span>
                          {isActive && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid-header-right">
          <SortDropdown
            value={filters.sortBy}
            onChange={(val) => onFilterChange({ sortBy: val, page: 1 })}
            options={LIBRARY_SORT_OPTIONS}
            labelPrefix="Trier par :"
            align="right"
          />
        </div>
      </div>

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

        .cat-plus-picker-wrapper {
          position: relative;
        }

        .cat-plus-btn {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          background: transparent;
          border: 1.5px dashed #cbd5e1;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cat-plus-btn:hover,
        .cat-plus-btn.active {
          background: #fffdf5;
          border-color: #eab308;
          color: #854d0e;
          border-style: solid;
          box-shadow: 0 2px 8px rgba(234, 179, 8, 0.18);
          transform: rotate(90deg);
        }

        .cat-picker-backdrop {
          position: fixed;
          inset: 0;
          z-index: 490;
          background: rgba(15, 23, 42, 0.08);
          backdrop-filter: blur(1px);
        }

        .cat-picker-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          width: 270px;
          max-height: 400px;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 16px;
          box-shadow: 0 16px 36px -4px rgba(15, 23, 42, 0.12), 0 2px 8px rgba(15, 23, 42, 0.04);
          z-index: 500;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: popoverFade 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes popoverFade {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .cat-picker-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid #f1f5f9;
        }

        .cat-picker-title {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
        }

        .cat-picker-close {
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 12px;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cat-picker-close:hover {
          color: #0f172a;
          background: #f1f5f9;
        }

        .cat-picker-list {
          padding: 6px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .cat-picker-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: 10px;
          background: transparent;
          border: none;
          color: #334155;
          font-size: 13px;
          font-weight: 600;
          text-align: left;
          cursor: pointer;
          transition: all 0.15s ease;
          width: 100%;
        }

        .cat-picker-item:hover {
          background: #fffdf5;
          color: #854d0e;
        }

        .cat-picker-item.active {
          background: #fefce8;
          color: #854d0e;
          font-weight: 700;
        }

        .cat-picker-item .item-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #cbd5e1;
          flex-shrink: 0;
        }

        .cat-picker-item.active .item-dot {
          background: #eab308;
          box-shadow: 0 0 6px rgba(234, 179, 8, 0.6);
        }

        .cat-picker-item .item-name {
          flex: 1;
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
