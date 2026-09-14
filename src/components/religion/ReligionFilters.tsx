'use client';

import React from 'react';
import {
  ReligionFilterState,
  ReligionTradition,
  ReligionBranch,
  ReligionResourceType,
  ReligionTraditionId,
  ReligionBranchId,
} from '@/types/religion';
import { RELIGION_CONTENT_TYPES } from '@/data/mockReligion';

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
  // Branches disponibles pour la tradition sélectionnée dans les filtres
  const availableBranches =
    filters.traditionId !== 'all'
      ? branches.filter((b) => b.traditionId === filters.traditionId)
      : branches;

  return (
    <div className="religion-filters-container">
      {/* Ligne 1 : Barre de Recherche textuelle (titre, auteur) + Déclencheur mobile */}
      <div className="religion-search-row">
        <div className="religion-search-input-wrap">
          <svg
            className="religion-search-icon"
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
          <input
            type="text"
            className="religion-search-input"
            placeholder="Rechercher par titre, auteur (ex: Bamba, Malick Sy, Augustin, Baye Niass...)..."
            value={filters.searchQuery}
            onChange={(e) =>
              onFilterChange({ searchQuery: e.target.value, page: 1 })
            }
          />
          {filters.searchQuery && (
            <button
              type="button"
              className="religion-search-clear"
              onClick={() => onFilterChange({ searchQuery: '', page: 1 })}
              title="Effacer la recherche"
            >
              ✕
            </button>
          )}
        </div>

        {/* Bouton Filtres pour Mobile */}
        <button
          type="button"
          className="religion-mobile-filter-btn"
          onClick={onOpenMobileDrawer}
          aria-label="Ouvrir les filtres avancés"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
          <span>Filtres</span>
          {activeFiltersCount > 0 && (
            <span className="filter-badge-count">{activeFiltersCount}</span>
          )}
        </button>

        {/* Tri Desktop */}
        <div className="religion-sort-wrapper desktop-only">
          <label htmlFor="sort-select" className="sort-label">
            Trier par :
          </label>
          <select
            id="sort-select"
            className="religion-select"
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange({
                sortBy: e.target.value as ReligionFilterState['sortBy'],
                page: 1,
              })
            }
          >
            <option value="pertinence">Pertinence</option>
            <option value="recent">Année / Époque</option>
            <option value="titre">Titre (A-Z)</option>
            <option value="auteur">Auteur (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Ligne 2 : Filtres Desktop (Tradition, Courant, Type de ressource, Année, Accès) */}
      <div className="religion-desktop-filters desktop-only">
        {/* Filtre Tradition */}
        <div className="filter-group">
          <label className="filter-group-label">Tradition</label>
          <select
            className="religion-select"
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

        {/* Filtre Courant / Confrérie */}
        <div className="filter-group">
          <label className="filter-group-label">Courant / Branche</label>
          <select
            className="religion-select"
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

        {/* Filtre Type de Ressource */}
        <div className="filter-group">
          <label className="filter-group-label">Type de ressource</label>
          <select
            className="religion-select"
            value={filters.contentType}
            onChange={(e) =>
              onFilterChange({
                contentType: e.target.value as ReligionResourceType | 'all',
                page: 1,
              })
            }
          >
            <option value="all">Tous les types</option>
            {RELIGION_CONTENT_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtre Année / Époque */}
        <div className="filter-group">
          <label className="filter-group-label">Année / Époque</label>
          <select
            className="religion-select"
            value={filters.year}
            onChange={(e) =>
              onFilterChange({
                year: e.target.value,
                page: 1,
              })
            }
          >
            <option value="all">Toutes les époques</option>
            <option value="before-1800">Classique &amp; Ancien (&lt; 1800)</option>
            <option value="1800-1950">XIXe &amp; début XXe (1800-1950)</option>
            <option value="post-1950">Contemporain (&gt; 1950)</option>
          </select>
        </div>

        {/* Filtre Accès */}
        <div className="filter-group">
          <label className="filter-group-label">Accès</label>
          <div className="access-segmented-control">
            <button
              type="button"
              className={`segmented-btn ${filters.accessLevel === 'all' ? 'active' : ''}`}
              onClick={() => onFilterChange({ accessLevel: 'all', page: 1 })}
            >
              Tous
            </button>
            <button
              type="button"
              className={`segmented-btn ${filters.accessLevel === 'free' ? 'active' : ''}`}
              onClick={() => onFilterChange({ accessLevel: 'free', page: 1 })}
            >
              Gratuit
            </button>
            <button
              type="button"
              className={`segmented-btn ${filters.accessLevel === 'premium' ? 'active' : ''}`}
              onClick={() => onFilterChange({ accessLevel: 'premium', page: 1 })}
            >
              Premium
            </button>
          </div>
        </div>

        {/* Réinitialisation */}
        {activeFiltersCount > 0 && (
          <button
            type="button"
            className="religion-filter-reset-link"
            onClick={onResetFilters}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            <span>Réinitialiser</span>
          </button>
        )}
      </div>
    </div>
  );
};
