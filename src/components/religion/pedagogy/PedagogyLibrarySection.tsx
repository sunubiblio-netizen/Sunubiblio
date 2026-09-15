'use client';

import React from 'react';
import { ReligionResource, ReligionFilterState, ReligionTradition, ReligionBranch, ReligionThemeCategory } from '@/types/religion';
import { ReligionFilters } from '@/components/religion/ReligionFilters';
import { ReligionPopularResources } from '@/components/religion/ReligionPopularResources';
import { ReligionResourceCard } from '@/components/religion/ReligionResourceCard';
import { ReligionEmptyState } from '@/components/religion/ReligionEmptyState';

interface PedagogyLibrarySectionProps {
  filters: ReligionFilterState;
  traditions: ReligionTradition[];
  branches: ReligionBranch[];
  themeCategories: ReligionThemeCategory[];
  resources: ReligionResource[];
  popularResources: ReligionResource[];
  totalResources: number;
  totalPages: number;
  isLoading: boolean;
  activeFiltersCount: number;
  onFilterChange: (newFilters: Partial<ReligionFilterState>) => void;
  onResetFilters: () => void;
  onOpenMobileDrawer: () => void;
  onConsultResource: (resource: ReligionResource) => void;
}

export const PedagogyLibrarySection: React.FC<PedagogyLibrarySectionProps> = ({
  filters,
  traditions,
  branches,
  themeCategories,
  resources,
  popularResources,
  totalResources,
  totalPages,
  isLoading,
  activeFiltersCount,
  onFilterChange,
  onResetFilters,
  onOpenMobileDrawer,
  onConsultResource,
}) => {
  return (
    <section className="pedagogy-library-section" id="bibliotheque">
      <div className="container">
        
        {/* En-tête de section */}
        <div className="library-header-wrapper">
          <div className="section-pill-tag">Bibliothèque Numérique</div>
          <h2 className="library-title">Explorer les Ressources</h2>
          <p className="library-subtitle">
            Recherchez des ouvrages, documents et conférences propres à cette tradition et ses courants.
          </p>
        </div>

        {/* Filtres contextuels */}
        <div className="library-filters-wrapper">
          <ReligionFilters
            filters={filters}
            traditions={traditions}
            branches={branches}
            onFilterChange={onFilterChange}
            onResetFilters={onResetFilters}
            onOpenMobileDrawer={onOpenMobileDrawer}
            activeFiltersCount={activeFiltersCount}
          />
        </div>

        {/* Section "Plus visionnés" contextuelle */}
        {popularResources.length > 0 && filters.page === 1 && (
          <div className="library-popular-wrapper">
            <ReligionPopularResources
              resources={popularResources}
              onConsultResource={onConsultResource}
            />
          </div>
        )}

        {/* Onglets des catégories thématiques */}
        <div className="theme-pills-scroller">
          <button
            type="button"
            className={`theme-tab-pill ${filters.themeCategoryId === 'all' ? 'active' : ''}`}
            onClick={() => onFilterChange({ themeCategoryId: 'all', page: 1 })}
          >
            Toutes les catégories
          </button>
          {themeCategories.map((th) => {
            const isActive = filters.themeCategoryId === th.id;
            return (
              <button
                key={th.id}
                type="button"
                className={`theme-tab-pill ${isActive ? 'active' : ''}`}
                onClick={() => onFilterChange({ themeCategoryId: th.id, page: 1 })}
              >
                {th.label}
              </button>
            );
          })}
        </div>

        {/* Grille de cartes de ressources / Loading / Empty state */}
        <div className="library-grid-wrapper">
          {isLoading ? (
            <div className="religion-loading-box">
              <div className="loading-spinner" />
              <p>Chargement des ressources...</p>
            </div>
          ) : resources.length > 0 ? (
            <div className="religion-cards-grid">
              {resources.map((res) => (
                <ReligionResourceCard
                  key={res.id}
                  resource={res}
                  onConsult={onConsultResource}
                />
              ))}
            </div>
          ) : (
            <ReligionEmptyState
              onReset={onResetFilters}
              hasFilter={Boolean(filters.searchQuery || filters.author !== 'all' || filters.themeCategoryId !== 'all' || filters.branchId !== 'all')}
            />
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="religion-pagination-bar">
            <button
              type="button"
              className="pagination-btn"
              disabled={filters.page <= 1}
              onClick={() => onFilterChange({ page: filters.page - 1 })}
            >
              ← Précédent
            </button>
            <div className="pagination-pages-indicator">
              Page <span className="current-page">{filters.page}</span> sur {totalPages} ({totalResources} document{totalResources > 1 ? 's' : ''})
            </div>
            <button
              type="button"
              className="pagination-btn"
              disabled={filters.page >= totalPages}
              onClick={() => onFilterChange({ page: filters.page + 1 })}
            >
              Suivant →
            </button>
          </div>
        )}

      </div>

      <style jsx>{`
        .pedagogy-library-section {
          padding: 60px 0;
          background: #fafaff;
          border-top: 1px solid rgba(226, 232, 240, 0.75);
          border-bottom: 1px solid rgba(226, 232, 240, 0.75);
          margin-bottom: 40px;
        }

        .library-header-wrapper {
          margin-bottom: 30px;
        }

        .section-pill-tag {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #4f46e5;
          background: #eef2ff;
          padding: 4px 10px;
          border-radius: 9999px;
          margin-bottom: 8px;
        }

        .library-title {
          font-size: clamp(24px, 3.5vw, 32px);
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 12px 0;
          letter-spacing: -0.02em;
        }

        .library-subtitle {
          font-size: 15px;
          color: #64748b;
          max-width: 800px;
          line-height: 1.6;
          margin: 0;
        }

        .library-filters-wrapper {
          margin-bottom: 30px;
        }

        .library-popular-wrapper {
          margin-bottom: 40px;
          padding-bottom: 40px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.75);
        }

        .theme-pills-scroller {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: thin;
          padding-bottom: 16px;
          margin-bottom: 24px;
        }

        .theme-tab-pill {
          display: inline-flex;
          align-items: center;
          padding: 8px 16px;
          border-radius: 9999px;
          border: 1px solid rgba(226, 232, 240, 0.85);
          background: #ffffff;
          color: #475569;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .theme-tab-pill:hover {
          background: #f1f5f9;
          color: #4f46e5;
          border-color: rgba(99, 102, 241, 0.3);
          transform: translateY(-1px);
        }

        .theme-tab-pill.active {
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #9333ea 100%);
          color: #ffffff;
          border-color: transparent;
          font-weight: 700;
          box-shadow: 0 4px 14px -2px rgba(99, 102, 241, 0.4);
          transform: translateY(-1px);
        }

        .library-grid-wrapper {
          min-height: 300px;
        }

        .religion-loading-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          gap: 14px;
          color: #64748b;
          font-size: 14px;
        }

        .loading-spinner {
          width: 36px;
          height: 36px;
          border: 3px solid rgba(99, 102, 241, 0.2);
          border-top-color: #4f46e5;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .religion-pagination-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 36px;
          padding-top: 24px;
          border-top: 1px solid rgba(241, 245, 249, 0.9);
        }

        .pagination-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          border-radius: 10px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          background: #ffffff;
          color: #334155;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pagination-btn:hover:not(:disabled) {
          border-color: #4f46e5;
          color: #4f46e5;
          background: #fafaff;
        }

        .pagination-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          background: #f8fafc;
        }

        .pagination-pages-indicator {
          font-size: 13.5px;
          color: #64748b;
        }

        .current-page {
          font-weight: 700;
          color: #0f172a;
        }
      `}</style>
    </section>
  );
};
