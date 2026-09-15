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
import { CustomFilterDropdown, DropdownOption } from './CustomFilterDropdown';

const RELIGION_ACCESS_PLANS: { key: ReligionPlanRequired; label: string; dotColor: string }[] = [
  { key: 'gratuit', label: 'Gratuit', dotColor: '#10b981' },
  { key: 'simple', label: 'Simple', dotColor: '#3b82f6' },
  { key: 'recommande', label: 'Recommandé', dotColor: '#6366f1' },
  { key: 'gold', label: 'Gold', dotColor: '#f59e0b' },
];

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

  const traditionOptions: DropdownOption[] = useMemo(() => {
    return [
      { value: 'all', label: 'Toutes les traditions' },
      ...traditions.map((t) => ({
        value: t.id,
        label: t.title,
        badge: t.badge,
      })),
    ];
  }, [traditions]);

  const branchOptions: DropdownOption[] = useMemo(() => {
    return [
      { value: 'all', label: 'Tous les courants' },
      ...availableBranches.map((b) => ({
        value: b.id,
        label: b.title,
        badge: b.badge,
      })),
    ];
  }, [availableBranches]);

  const authorOptions: DropdownOption[] = useMemo(() => {
    return [
      { value: 'all', label: 'Tous les auteurs' },
      ...availableAuthors.map((author) => ({
        value: author,
        label: author,
      })),
    ];
  }, [availableAuthors]);

  const epochOptions: DropdownOption[] = useMemo(
    () => [
      { value: 'all', label: 'Toutes les époques' },
      { value: 'before-1800', label: 'Classique (< 1800)', badge: 'Classique' },
      { value: '1800-1950', label: 'XIXe & début XXe (1800-1950)', badge: 'XIXe-XXe' },
      { value: 'post-1950', label: 'Contemporain (> 1950)', badge: 'Moderne' },
    ],
    []
  );

  const sortOptions: DropdownOption[] = useMemo(
    () => [
      { value: 'pertinence', label: 'Pertinence & Vues' },
      { value: 'recent', label: 'Année / Époque' },
      { value: 'titre', label: 'Titre (A-Z)' },
      { value: 'auteur', label: 'Auteur (A-Z)' },
    ],
    []
  );

  return (
    <div className="modern-religion-filters">
      {/* Barre Supérieure : Recherche Principale + Déclencheur Mobile + Tri */}
      <div className="filters-top-bar">
        {/* Capsule de recherche stylisée */}
        <div className={`filter-search-capsule ${filters.searchQuery.trim() ? 'has-query' : ''}`}>
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

        {/* Tri Desktop avec CustomFilterDropdown */}
        <div className="sort-dropdown-box desktop-only">
          <CustomFilterDropdown
            id="religion-sort"
            label="Trier par"
            value={filters.sortBy}
            options={sortOptions}
            onChange={(val) =>
              onFilterChange({
                sortBy: val as ReligionFilterState['sortBy'],
                page: 1,
              })
            }
            align="right"
          />
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
            {RELIGION_ACCESS_PLANS.map((plan) => {
              const isActive = filters.requiredPlan === plan.key;
              return (
                <button
                  key={plan.key}
                  type="button"
                  className={`filter-pill-chip ${isActive ? 'active' : ''}`}
                  onClick={() => onFilterChange({ requiredPlan: plan.key, page: 1 })}
                >
                  <span
                    className="plan-dot-indicator"
                    style={{
                      backgroundColor: isActive ? '#ffffff' : plan.dotColor,
                    }}
                  />
                  <span>{plan.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Sélecteurs Avancés en Composants Personnalisés Élégants : Tradition, Courant, Auteur, Époque */}
        <div className="advanced-capsules-grid">
          <CustomFilterDropdown
            id="tradition-dropdown"
            label="Tradition"
            value={filters.traditionId}
            options={traditionOptions}
            onChange={(val) =>
              onFilterChange({
                traditionId: val as ReligionTraditionId | 'all',
                branchId: 'all',
                page: 1,
              })
            }
            enableSearch={true}
            searchPlaceholder="Chercher une tradition..."
          />

          <CustomFilterDropdown
            id="branch-dropdown"
            label="Courant / Confrérie"
            value={filters.branchId}
            options={branchOptions}
            onChange={(val) =>
              onFilterChange({
                branchId: val as ReligionBranchId | 'all',
                page: 1,
              })
            }
            enableSearch={true}
            searchPlaceholder="Chercher un courant..."
          />

          <CustomFilterDropdown
            id="author-dropdown"
            label="Auteur / Figure"
            value={filters.author}
            options={authorOptions}
            onChange={(val) =>
              onFilterChange({
                author: val,
                page: 1,
              })
            }
            enableSearch={true}
            searchPlaceholder="Filtrer parmi les auteurs..."
          />

          <CustomFilterDropdown
            id="epoch-dropdown"
            label="Époque / Siècle"
            value={filters.year}
            options={epochOptions}
            onChange={(val) =>
              onFilterChange({
                year: val,
                page: 1,
              })
            }
          />
        </div>
      </div>

      <style jsx>{`
        .modern-religion-filters {
          position: relative;
          z-index: 40;
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

        .filter-search-capsule:focus-within,
        .filter-search-capsule.has-query {
          background: #ffffff;
          border-color: #4f46e5;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.14);
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
          min-width: 175px;
          flex-shrink: 0;
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
          border-color: rgba(99, 102, 241, 0.3);
          color: #4f46e5;
          transform: translateY(-1px);
        }

        .filter-pill-chip:active {
          transform: scale(0.97);
        }

        .filter-pill-chip.active {
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #9333ea 100%);
          color: #ffffff;
          border-color: transparent;
          font-weight: 700;
          box-shadow: 0 4px 14px -2px rgba(99, 102, 241, 0.4);
          transform: translateY(-1px);
        }

        .filter-pill-chip.active:hover {
          background: linear-gradient(135deg, #4338ca 0%, #4f46e5 50%, #7e22ce 100%);
          color: #ffffff;
          border-color: transparent;
          box-shadow: 0 6px 18px -2px rgba(99, 102, 241, 0.5);
        }

        .plan-dot-indicator {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
          transition: all 0.15s ease;
        }

        .filter-pill-chip.active .plan-dot-indicator {
          box-shadow: 0 0 0 1.5px rgba(255, 255, 255, 0.9);
        }

        /* Capsules Grid */
        .advanced-capsules-grid {
          position: relative;
          z-index: 45;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          padding-top: 6px;
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
