'use client';

import React, { useMemo } from 'react';
import {
  ReligionFilterState,
  ReligionTradition,
  ReligionBranch,
  ReligionResourceType,
  ReligionTraditionId,
  ReligionBranchId,
  ReligionPlanRequired,
} from '@/types/religion';
import { RELIGION_CONTENT_TYPES, INITIAL_RELIGION_RESOURCES } from '@/data/mockReligion';
import { PRICING_PLANS } from '@/data/pricingPlans';

interface ReligionFiltersProps {
  filters: ReligionFilterState;
  traditions: ReligionTradition[];
  branches: ReligionBranch[];
  onFilterChange: (newFilters: Partial<ReligionFilterState>) => void;
  onResetFilters: () => void;
  onOpenMobileDrawer: () => void;
  activeFiltersCount: number;
}

export const ReligionFilters: React.FC<ReligionFiltersProps> = ({
  filters,
  traditions,
  branches,
  onFilterChange,
  onResetFilters,
  onOpenMobileDrawer,
  activeFiltersCount,
}) => {
  const availableBranches = useMemo(() => {
    if (filters.traditionId !== 'all') {
      return branches.filter((b) => b.traditionId === filters.traditionId);
    }
    return branches;
  }, [branches, filters.traditionId]);

  const availableAuthors = useMemo(() => {
    const set = new Set(INITIAL_RELIGION_RESOURCES.map((r) => r.auteur));
    return Array.from(set).sort();
  }, []);

  return (
    <div className="modern-religion-filters">
      {/* Barre Supérieure : Recherche Principale + Déclencheur Mobile + Tri */}
      <div className="filters-top-bar">
        {/* Capsule de recherche stylisée */}
        <div className="filter-search-capsule">
          <div className="search-icon-wrap">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            type="text"
            className="filter-search-input"
            placeholder="Filtrer par titre, auteur ou mot-clé (ex: Bamba, Malick Sy, Augustin...)..."
            value={filters.searchQuery}
            onChange={(e) =>
              onFilterChange({ searchQuery: e.target.value, page: 1 })
            }
          />
          {filters.searchQuery && (
            <button
              type="button"
              className="filter-search-clear"
              onClick={() => onFilterChange({ searchQuery: '', page: 1 })}
              title="Effacer la recherche"
            >
              ✕
            </button>
          )}
        </div>

        {/* Bouton Filtres pour Mobile (visible uniquement sur smartphone/tablette) */}
        <button
          type="button"
          className="mobile-filter-trigger"
          onClick={onOpenMobileDrawer}
          aria-label="Ouvrir les filtres avancés"
        >
          <div className="trigger-icon-wrap">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </div>
          <span className="trigger-text">Filtres</span>
          {activeFiltersCount > 0 && (
            <span className="trigger-count-badge">{activeFiltersCount}</span>
          )}
        </button>

        {/* Tri Desktop */}
        <div className="sort-dropdown-box desktop-only">
          <label htmlFor="religion-sort" className="sort-box-label">
            Trier :
          </label>
          <div className="custom-select-wrap">
            <select
              id="religion-sort"
              className="modern-select"
              value={filters.sortBy}
              onChange={(e) =>
                onFilterChange({
                  sortBy: e.target.value as ReligionFilterState['sortBy'],
                  page: 1,
                })
              }
            >
              <option value="pertinence">Pertinence &amp; Vues</option>
              <option value="recent">Année / Époque</option>
              <option value="titre">Titre (A-Z)</option>
              <option value="auteur">Auteur (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Reset général si filtres actifs */}
        {activeFiltersCount > 0 && (
          <button
            type="button"
            className="reset-all-link desktop-only"
            onClick={onResetFilters}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            <span>Réinitialiser ({activeFiltersCount})</span>
          </button>
        )}
      </div>

      {/* Panneau de Filtres Interactifs Desktop (Moderne sous forme de Pills & Chips) */}
      <div className="filters-chips-panel desktop-only">
        {/* 1. Ligne des Formats de Document (Pills Modernes) */}
        <div className="filter-chips-row">
          <span className="chips-row-label">Format :</span>
          <div className="chips-scroller">
            <button
              type="button"
              className={`filter-pill-chip ${filters.contentType === 'all' ? 'active' : ''}`}
              onClick={() => onFilterChange({ contentType: 'all', page: 1 })}
            >
              Tous les formats
            </button>
            {RELIGION_CONTENT_TYPES.map((type) => {
              const isActive = filters.contentType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  className={`filter-pill-chip ${isActive ? 'active' : ''}`}
                  onClick={() => onFilterChange({ contentType: type.id, page: 1 })}
                >
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Ligne des Formules d'Abonnement */}
        <div className="filter-chips-row">
          <span className="chips-row-label">Accès :</span>
          <div className="chips-scroller">
            <button
              type="button"
              className={`filter-pill-chip ${filters.requiredPlan === 'all' ? 'active' : ''}`}
              onClick={() => onFilterChange({ requiredPlan: 'all', page: 1 })}
            >
              Tous les accès
            </button>
            {PRICING_PLANS.map((plan) => {
              const planKey =
                plan.slug === 'gratuit'
                  ? 'gratuit'
                  : plan.slug === 'simple'
                  ? 'simple'
                  : plan.slug === 'recommande'
                  ? 'recommande'
                  : 'gold';
              const isActive = filters.requiredPlan === planKey;
              return (
                <button
                  key={plan.id}
                  type="button"
                  className={`filter-pill-chip ${isActive ? 'active' : ''}`}
                  onClick={() => onFilterChange({ requiredPlan: planKey, page: 1 })}
                >
                  <span
                    className="plan-dot-indicator"
                    style={{
                      backgroundColor:
                        planKey === 'gold'
                          ? '#f59e0b'
                          : planKey === 'recommande'
                          ? '#4f46e5'
                          : planKey === 'simple'
                          ? '#3b82f6'
                          : '#10b981',
                    }}
                  />
                  <span>
                    {plan.name} ({plan.formattedPrice})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Sélecteurs Avancés en Capsules Élégantes : Tradition, Courant, Auteur, Époque */}
        <div className="advanced-capsules-grid">
          {/* Tradition */}
          <div className="capsule-field">
            <label htmlFor="tradition-capsule" className="capsule-label">
              Tradition
            </label>
            <div className="capsule-select-wrap">
              <select
                id="tradition-capsule"
                className="capsule-select"
                value={filters.traditionId}
                onChange={(e) =>
                  onFilterChange({
                    traditionId: e.target.value as ReligionTraditionId | 'all',
                    branchId: 'all',
                    page: 1,
                  })
                }
              >
                <option value="all">Toutes les traditions</option>
                {traditions.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Courant / Confrérie */}
          <div className="capsule-field">
            <label htmlFor="branch-capsule" className="capsule-label">
              Courant / Confrérie
            </label>
            <div className="capsule-select-wrap">
              <select
                id="branch-capsule"
                className="capsule-select"
                value={filters.branchId}
                onChange={(e) =>
                  onFilterChange({
                    branchId: e.target.value as ReligionBranchId | 'all',
                    page: 1,
                  })
                }
              >
                <option value="all">Tous les courants</option>
                {availableBranches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Auteur */}
          <div className="capsule-field">
            <label htmlFor="author-capsule" className="capsule-label">
              Auteur / Figure
            </label>
            <div className="capsule-select-wrap">
              <select
                id="author-capsule"
                className="capsule-select"
                value={filters.author}
                onChange={(e) =>
                  onFilterChange({
                    author: e.target.value,
                    page: 1,
                  })
                }
              >
                <option value="all">Tous les auteurs</option>
                {availableAuthors.map((author) => (
                  <option key={author} value={author}>
                    {author}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Époque */}
          <div className="capsule-field">
            <label htmlFor="epoch-capsule" className="capsule-label">
              Époque / Siècle
            </label>
            <div className="capsule-select-wrap">
              <select
                id="epoch-capsule"
                className="capsule-select"
                value={filters.year}
                onChange={(e) =>
                  onFilterChange({
                    year: e.target.value,
                    page: 1,
                  })
                }
              >
                <option value="all">Toutes les époques</option>
                <option value="before-1800">Classique (&lt; 1800)</option>
                <option value="1800-1950">XIXe &amp; début XXe (1800-1950)</option>
                <option value="post-1950">Contemporain (&gt; 1950)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modern-religion-filters {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.85);
          border-radius: 20px;
          padding: 20px 22px;
          box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.04);
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .filters-top-bar {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
        }

        .filter-search-capsule {
          display: flex;
          align-items: center;
          flex: 1;
          background: #f8fafc;
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 9999px;
          padding: 7px 14px 7px 18px;
          transition: all 0.2s ease;
        }

        .filter-search-capsule:focus-within {
          background: #ffffff;
          border-color: #4f46e5;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.12);
        }

        .search-icon-wrap {
          color: #94a3b8;
          display: flex;
          align-items: center;
          margin-right: 10px;
          flex-shrink: 0;
        }

        .filter-search-input {
          width: 100%;
          border: none;
          background: transparent;
          font-size: 14px;
          color: #0f172a;
          outline: none;
          font-weight: 500;
        }

        .filter-search-input::placeholder {
          color: #94a3b8;
          font-size: 13.5px;
        }

        .filter-search-clear {
          background: none;
          border: none;
          color: #94a3b8;
          padding: 2px 6px;
          cursor: pointer;
          font-size: 13px;
          border-radius: 50%;
          transition: color 0.15s;
        }

        .filter-search-clear:hover {
          color: #0f172a;
        }

        .mobile-filter-trigger {
          display: none;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 9999px;
          padding: 9px 16px;
          font-size: 13.5px;
          font-weight: 700;
          color: #1e1b4b;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
          transition: all 0.2s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .mobile-filter-trigger:hover {
          border-color: #4f46e5;
          color: #4f46e5;
          background: #fafaff;
        }

        .trigger-icon-wrap {
          color: #4f46e5;
          display: flex;
          align-items: center;
        }

        .trigger-count-badge {
          background: #4f46e5;
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 9999px;
        }

        .sort-dropdown-box {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .sort-box-label {
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          white-space: nowrap;
        }

        .custom-select-wrap {
          position: relative;
        }

        .modern-select {
          appearance: none;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 10px;
          padding: 8px 30px 8px 12px;
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          outline: none;
          transition: all 0.15s ease;
        }

        .modern-select:hover,
        .modern-select:focus {
          border-color: #4f46e5;
        }

        .reset-all-link {
          background: transparent;
          border: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: #6366f1;
          cursor: pointer;
          padding: 6px 12px;
          border-radius: 8px;
          transition: background 0.15s;
          white-space: nowrap;
        }

        .reset-all-link:hover {
          background: #eef2ff;
          color: #4338ca;
        }

        /* Panneau de Chips */
        .filters-chips-panel {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding-top: 14px;
          border-top: 1px solid rgba(241, 245, 249, 0.95);
        }

        .filter-chips-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chips-row-label {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          width: 65px;
          flex-shrink: 0;
        }

        .chips-scroller {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
          padding: 2px 0;
        }

        .filter-pill-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          font-weight: 600;
          color: #475569;
          background: #f8fafc;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 9999px;
          padding: 5px 14px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.18s ease;
        }

        .filter-pill-chip:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
          color: #0f172a;
        }

        .filter-pill-chip.active {
          background: #1e1b4b;
          color: #ffffff;
          border-color: #1e1b4b;
          box-shadow: 0 3px 10px rgba(30, 27, 75, 0.18);
        }

        .plan-dot-indicator {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* Capsules Grid */
        .advanced-capsules-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          padding-top: 6px;
        }

        .capsule-field {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .capsule-label {
          font-size: 11.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #64748b;
        }

        .capsule-select-wrap {
          position: relative;
        }

        .capsule-select {
          width: 100%;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 10px;
          padding: 8px 12px;
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          outline: none;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .capsule-select:hover,
        .capsule-select:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
        }

        @media (max-width: 960px) {
          .advanced-capsules-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .modern-religion-filters {
            padding: 14px 16px;
            border-radius: 16px;
          }

          .desktop-only {
            display: none !important;
          }

          .mobile-filter-trigger {
            display: inline-flex;
          }

          .filter-search-capsule {
            padding: 5px 12px;
          }

          .filter-search-input {
            font-size: 13.5px;
          }
        }
      `}</style>
    </div>
  );
};
