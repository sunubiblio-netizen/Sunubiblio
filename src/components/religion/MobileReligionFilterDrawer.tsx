'use client';

import React, { useEffect } from 'react';
import {
  ReligionFilterState,
  ReligionTradition,
  ReligionBranch,
  ReligionResourceType,
  ReligionTraditionId,
  ReligionBranchId,
} from '@/types/religion';
import { RELIGION_CONTENT_TYPES } from '@/data/mockReligion';

interface MobileReligionFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ReligionFilterState;
  traditions: ReligionTradition[];
  branches: ReligionBranch[];
  onFilterChange: (newFilters: Partial<ReligionFilterState>) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export const MobileReligionFilterDrawer: React.FC<MobileReligionFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  traditions,
  branches,
  onFilterChange,
  onResetFilters,
  totalResults,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const availableBranches =
    filters.traditionId !== 'all'
      ? branches.filter((b) => b.traditionId === filters.traditionId)
      : branches;

  return (
    <div className="mobile-drawer-backdrop" onClick={onClose}>
      <div
        className="mobile-drawer-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header du tiroir */}
        <div className="mobile-drawer-header">
          <div className="drawer-title-wrap">
            <h3 className="drawer-title">Filtres de recherche</h3>
            <span className="drawer-count">({totalResults} résultat{totalResults > 1 ? 's' : ''})</span>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Fermer les filtres"
          >
            ✕
          </button>
        </div>

        {/* Corps des filtres */}
        <div className="mobile-drawer-body">
          {/* Tradition */}
          <div className="drawer-group">
            <label className="drawer-label">Tradition religieuse</label>
            <select
              className="drawer-select"
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

          {/* Courant / Confrérie */}
          <div className="drawer-group">
            <label className="drawer-label">Courant / Branche</label>
            <select
              className="drawer-select"
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

          {/* Type de ressource */}
          <div className="drawer-group">
            <label className="drawer-label">Type de ressource</label>
            <select
              className="drawer-select"
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

          {/* Année / Époque */}
          <div className="drawer-group">
            <label className="drawer-label">Époque / Période</label>
            <select
              className="drawer-select"
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

          {/* Tri */}
          <div className="drawer-group">
            <label className="drawer-label">Ordre de tri</label>
            <select
              className="drawer-select"
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

          {/* Niveau d'accès */}
          <div className="drawer-group">
            <label className="drawer-label">Niveau d’accès</label>
            <div className="access-segmented-control w-full">
              <button
                type="button"
                className={`segmented-btn flex-1 ${filters.accessLevel === 'all' ? 'active' : ''}`}
                onClick={() => onFilterChange({ accessLevel: 'all', page: 1 })}
              >
                Tous
              </button>
              <button
                type="button"
                className={`segmented-btn flex-1 ${filters.accessLevel === 'free' ? 'active' : ''}`}
                onClick={() => onFilterChange({ accessLevel: 'free', page: 1 })}
              >
                Gratuit
              </button>
              <button
                type="button"
                className={`segmented-btn flex-1 ${filters.accessLevel === 'premium' ? 'active' : ''}`}
                onClick={() => onFilterChange({ accessLevel: 'premium', page: 1 })}
              >
                Premium
              </button>
            </div>
          </div>
        </div>

        {/* Footer avec boutons d'action */}
        <div className="mobile-drawer-footer">
          <button
            type="button"
            className="btn-secondary drawer-btn"
            onClick={() => {
              onResetFilters();
            }}
          >
            Réinitialiser
          </button>
          <button
            type="button"
            className="btn-primary drawer-btn"
            onClick={onClose}
          >
            Appliquer ({totalResults})
          </button>
        </div>
      </div>
    </div>
  );
};
