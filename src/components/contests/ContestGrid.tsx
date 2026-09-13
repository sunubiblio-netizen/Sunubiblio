'use client';

import React from 'react';
import { Contest, ContestFilterState } from '@/types/contest';
import { ContestCard } from './ContestCard';

import { SortDropdown, SortOptionItem } from '@/components/ui/SortDropdown';

const CONTEST_SORT_OPTIONS: SortOptionItem<ContestFilterState['sortBy']>[] = [
  {
    value: 'pertinence',
    label: 'Pertinence',
    description: 'Recommandé selon votre profil',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    value: 'recent',
    label: 'Plus récents',
    description: 'Dernières sessions et annales',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    value: 'popular',
    label: 'Plus populaires',
    description: 'Concours les plus demandés',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
      </svg>
    ),
  },
  {
    value: 'name',
    label: 'Nom A-Z',
    description: 'Par ordre alphabétique',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h7M3 12h5M3 18h3M18 6v12M15 15l3 3 3-3" />
      </svg>
    ),
  },
];

interface ContestGridProps {
  contests: Contest[];
  totalCount: number;
  filters: ContestFilterState;
  onFilterChange: (newFilters: Partial<ContestFilterState>) => void;
  onResetFilters: () => void;
  onOpenMobileFilters: () => void;
  onSelectContest: (contest: Contest) => void;
}

export const ContestGrid: React.FC<ContestGridProps> = ({
  contests,
  totalCount,
  filters,
  onFilterChange,
  onResetFilters,
  onOpenMobileFilters,
  onSelectContest,
}) => {
  const isFiltered =
    Boolean(filters.searchQuery) ||
    filters.domain !== 'all' ||
    filters.diploma !== 'all' ||
    filters.status !== 'all' ||
    filters.country !== 'all';

  return (
    <section className="contest-grid-section">
      {/* Grid Header */}
      <div className="grid-header-row">
        <div className="title-block">
          <h2 className="main-title">Tous les concours</h2>
          <p className="subtitle">
            <span className="count-highlight">
              {isFiltered ? `${totalCount} concours trouvé${totalCount > 1 ? 's' : ''}` : '128 concours disponibles'}
            </span>
          </p>
        </div>

        <div className="controls-block">
          {/* Mobile Filter Trigger */}
          <button
            type="button"
            className="mobile-filter-btn"
            onClick={onOpenMobileFilters}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span>Filtres</span>
            {isFiltered && <span className="filter-badge">•</span>}
          </button>

          {/* Designer Sort Dropdown */}
          <SortDropdown
            value={filters.sortBy}
            onChange={(val) =>
              onFilterChange({
                sortBy: val,
                page: 1,
              })
            }
            options={CONTEST_SORT_OPTIONS}
            labelPrefix="Trier par :"
            align="right"
          />
        </div>
      </div>

      {/* Results */}
      {contests.length === 0 ? (
        <div className="empty-contests-box">
          <div className="empty-icon-wrap">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.6">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </div>
          <h3 className="empty-title">Aucun concours ne correspond à vos filtres</h3>
          <p className="empty-desc">
            Veuillez élargir votre recherche ou réinitialiser vos critères de niveau et de domaine.
          </p>
          <button type="button" className="btn-primary reset-cta-btn" onClick={onResetFilters}>
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="contests-cards-grid">
          {contests.map((c) => (
            <ContestCard
              key={c.id}
              contest={c}
              onSelectContest={onSelectContest}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        .contest-grid-section {
          flex: 1;
          min-width: 0;
        }

        .grid-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .main-title {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin-bottom: 2px;
        }

        .subtitle {
          font-size: 13.5px;
          color: #64748b;
        }

        .count-highlight {
          font-weight: 700;
          color: #4f46e5;
        }

        .controls-block {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mobile-filter-btn {
          display: none;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: var(--radius-full);
          background: #ffffff;
          border: 1px solid rgba(99, 102, 241, 0.3);
          font-size: 13.5px;
          font-weight: 700;
          color: #4f46e5;
          box-shadow: 0 2px 6px rgba(99, 102, 241, 0.08);
        }

        .filter-badge {
          color: #ec4899;
          font-size: 16px;
          line-height: 0;
        }



        .contests-cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        @media (min-width: 1400px) {
          .contests-cards-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 1024px) {
          .mobile-filter-btn {
            display: inline-flex;
          }

          .contests-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .contests-cards-grid {
            grid-template-columns: 1fr;
          }

          .sort-label {
            display: none;
          }
        }

        /* Empty state */
        .empty-contests-box {
          background: #ffffff;
          border: 1.5px dashed rgba(226, 232, 240, 0.9);
          border-radius: var(--radius-xl);
          padding: 44px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin: 20px 0;
        }

        .empty-icon-wrap {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #eef2ff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .empty-title {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 6px;
        }

        .empty-desc {
          font-size: 14px;
          color: #64748b;
          max-width: 420px;
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .reset-cta-btn {
          padding: 10px 22px;
          font-size: 14px;
        }
      `}</style>
    </section>
  );
};
