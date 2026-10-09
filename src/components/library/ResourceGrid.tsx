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
}

export const ResourceGrid: React.FC<ResourceGridProps> = ({
  resources,
  totalCount,
  filters,
  onFilterChange,
  onResetFilters,
  onOpenMobileFilters,
  onOpenResource,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
      {/* Top Header Row */}
      <div className="grid-header">
        <div className="grid-title-block">
          <h2 className="grid-title">Bibliothèque</h2>
          <p className="grid-subtitle">
            <span className="results-count">
              {activePills.length > 0 ? `${totalCount} ressource${totalCount > 1 ? 's' : ''} trouvée${totalCount > 1 ? 's' : ''}` : '1 248 ressources disponibles'}
            </span>
          </p>
        </div>

        <div className="grid-controls">
          {/* Mobile Filter Button */}
          <button
            type="button"
            className="mobile-filter-trigger"
            onClick={onOpenMobileFilters}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span>Filtres</span>
            {activePills.length > 0 && (
              <span className="mobile-badge-count">{activePills.length}</span>
            )}
          </button>

          {/* Designer Sort Dropdown */}
          <SortDropdown
            value={filters.sortBy}
            onChange={(val) => onFilterChange({ sortBy: val, page: 1 })}
            options={LIBRARY_SORT_OPTIONS}
            labelPrefix="Trier par :"
            align="right"
          />

          {/* Grid / List View Toggle */}
          <div className="view-toggle-wrap desktop-only">
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Affichage en grille"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="Affichage en liste"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
          </div>
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
        <div className={`cards-container ${viewMode}`}>
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
          margin-bottom: 16px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .grid-title {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin-bottom: 2px;
        }

        .grid-subtitle {
          font-size: 13.5px;
          color: #64748b;
        }

        .results-count {
          font-weight: 700;
          color: #d97706;
        }

        .grid-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mobile-filter-trigger {
          display: none;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: var(--radius-full);
          background: #ffffff;
          border: 1px solid rgba(234, 179, 8, 0.4);
          font-size: 13.5px;
          font-weight: 700;
          color: #d97706;
          box-shadow: 0 2px 6px rgba(234, 179, 8, 0.1);
        }

        .mobile-badge-count {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #eab308;
          color: #ffffff;
          font-size: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .view-toggle-wrap {
          display: flex;
          align-items: center;
          gap: 2px;
          background: #f1f5f9;
          border-radius: var(--radius-full);
          padding: 3px;
        }

        .view-toggle-btn {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          transition: all 0.15s ease;
        }

        .view-toggle-btn.active {
          background: #ffffff;
          color: #d97706;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
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

        /* Cards Layout */
        .cards-container.grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        /* When on very large monitors */
        @media (min-width: 1400px) {
          .cards-container.grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 20px;
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
