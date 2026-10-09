'use client';

import React, { useEffect } from 'react';
import { FilterState } from '@/types/library';
import { SUBJECT_OPTIONS, RESOURCE_TYPES, ACCESS_LEVELS, RELIGION_SUB_OPTIONS } from '@/data/mockLibrary';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  activeFiltersCount: number;
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_FILTER_LIST = [
  { id: 'all', label: 'Toutes les catégories' },
  { id: 'livres', label: 'Livres' },
  { id: 'cours', label: 'Cours' },
  { id: 'annales', label: 'Annales' },
  { id: 'exercices', label: 'Exercices' },
  { id: 'documents', label: 'Documents' },
  { id: 'religion', label: 'Religion & Spiritualité' },
];

const CYCLE_FILTER_LIST = [
  { id: 'all', label: 'Tous les niveaux' },
  { id: 'primaire', label: 'Primaire' },
  { id: 'college', label: 'Collège' },
  { id: 'lycee', label: 'Lycée' },
  { id: 'universite', label: 'Université' },
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  activeFiltersCount,
  isOpen,
  onClose,
}) => {
  // Fermer avec la touche Échap
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Arrière-plan flouté semi-transparent */}
      <div
        className="filter-drawer-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Volet latéral coulissant moderne */}
      <aside className="filter-drawer-panel" role="dialog" aria-label="Filtres de la bibliothèque">
        {/* En-tête du volet */}
        <div className="filter-drawer-header">
          <div className="header-title-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span className="drawer-title">Filtres</span>
            {activeFiltersCount > 0 && (
              <span className="filters-count-badge">{activeFiltersCount}</span>
            )}
          </div>

          <div className="header-actions">
            {activeFiltersCount > 0 && (
              <button
                type="button"
                className="reset-filters-btn"
                onClick={onResetFilters}
              >
                Tout effacer
              </button>
            )}
            <button
              type="button"
              className="close-drawer-btn"
              onClick={onClose}
              aria-label="Fermer les filtres"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Corps défilable contenant tous les critères */}
        <div className="filter-drawer-body">
          {/* 1. Catégories */}
          <div className="filter-group">
            <h3 className="filter-group-title">Catégorie</h3>
            <div className="filter-options-list">
              {CATEGORY_FILTER_LIST.map((cat) => (
                <label
                  key={cat.id}
                  className={`filter-radio-label ${filters.category === cat.id ? 'active' : ''}`}
                >
                  <input
                    type="radio"
                    name="category_filter"
                    checked={filters.category === cat.id}
                    onChange={() => onFilterChange({ category: cat.id, religionSub: 'all_rel' })}
                    className="filter-radio-input"
                  />
                  <span className="radio-indicator" />
                  <span className="filter-label-text">{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Si Religion est sélectionnée, afficher les sous-traditions */}
          {filters.category === 'religion' && (
            <div className="filter-group religion-highlight">
              <h3 className="filter-group-title">Tradition & Spiritualité</h3>
              <div className="filter-options-list">
                {RELIGION_SUB_OPTIONS.map((sub) => (
                  <label
                    key={sub.id}
                    className={`filter-radio-label ${filters.religionSub === sub.id ? 'active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="religion_filter"
                      checked={filters.religionSub === sub.id}
                      onChange={() => onFilterChange({ religionSub: sub.id })}
                      className="filter-radio-input"
                    />
                    <span className="radio-indicator" />
                    <span className="filter-label-text">{sub.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* 2. Niveau */}
          <div className="filter-group">
            <h3 className="filter-group-title">Niveau d’études</h3>
            <div className="filter-options-list">
              {CYCLE_FILTER_LIST.map((cyc) => (
                <label
                  key={cyc.id}
                  className={`filter-radio-label ${filters.cycle === cyc.id ? 'active' : ''}`}
                >
                  <input
                    type="radio"
                    name="cycle_filter"
                    checked={filters.cycle === cyc.id}
                    onChange={() => onFilterChange({ cycle: cyc.id, grade: undefined })}
                    className="filter-radio-input"
                  />
                  <span className="radio-indicator" />
                  <span className="filter-label-text">{cyc.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 3. Matière */}
          <div className="filter-group">
            <h3 className="filter-group-title">Matière & Discipline</h3>
            <div className="filter-options-list">
              {SUBJECT_OPTIONS.map((sub) => (
                <label
                  key={sub.id}
                  className={`filter-radio-label ${filters.subject === sub.id ? 'active' : ''}`}
                >
                  <input
                    type="radio"
                    name="subject_filter"
                    checked={filters.subject === sub.id}
                    onChange={() => onFilterChange({ subject: sub.id })}
                    className="filter-radio-input"
                  />
                  <span className="radio-indicator" />
                  <span className="filter-label-text">{sub.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 4. Type de ressource */}
          <div className="filter-group">
            <h3 className="filter-group-title">Type de document</h3>
            <div className="filter-options-list">
              {RESOURCE_TYPES.map((type) => (
                <label
                  key={type.id}
                  className={`filter-radio-label ${filters.resourceType === type.id ? 'active' : ''}`}
                >
                  <input
                    type="radio"
                    name="type_filter"
                    checked={filters.resourceType === type.id}
                    onChange={() => onFilterChange({ resourceType: type.id })}
                    className="filter-radio-input"
                  />
                  <span className="radio-indicator" />
                  <span className="filter-label-text">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 5. Accès */}
          <div className="filter-group">
            <h3 className="filter-group-title">Niveau d’accès</h3>
            <div className="filter-options-list">
              {ACCESS_LEVELS.map((acc) => (
                <label
                  key={acc.id}
                  className={`filter-radio-label ${filters.accessLevel === acc.id ? 'active' : ''}`}
                >
                  <input
                    type="radio"
                    name="access_filter"
                    checked={filters.accessLevel === acc.id}
                    onChange={() => onFilterChange({ accessLevel: acc.id })}
                    className="filter-radio-input"
                  />
                  <span className="radio-indicator" />
                  <span className="filter-label-text">{acc.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Pied de volet avec bouton de validation */}
        <div className="filter-drawer-footer">
          <button
            type="button"
            className="apply-filters-btn"
            onClick={onClose}
          >
            Afficher les résultats
          </button>
        </div>
      </aside>

      <style jsx>{`
        .filter-drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.35);
          backdrop-filter: blur(4px);
          z-index: 1000;
          animation: backdropFade 0.2s ease;
        }

        @keyframes backdropFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .filter-drawer-panel {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 320px;
          max-width: 86vw;
          background: #ffffff;
          z-index: 1001;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 48px rgba(15, 23, 42, 0.18);
          animation: slideInLeft 0.24s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .filter-drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 20px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          background: #ffffff;
        }

        .header-title-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .drawer-title {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.01em;
        }

        .filters-count-badge {
          font-size: 11px;
          font-weight: 700;
          color: #713f12;
          background: #eab308;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .reset-filters-btn {
          font-size: 12px;
          font-weight: 600;
          color: #d97706;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
          padding: 2px 4px;
        }

        .reset-filters-btn:hover {
          color: #b45309;
          text-decoration: underline;
        }

        .close-drawer-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #f1f5f9;
          border: none;
          color: #64748b;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .close-drawer-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .filter-drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .filter-group-title {
          font-size: 12.5px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .filter-options-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .filter-radio-label {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 7px 10px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
          user-select: none;
        }

        .filter-radio-label:hover {
          background: #f8fafc;
        }

        .filter-radio-label.active {
          background: #fefce8;
          border: 1px solid rgba(234, 179, 8, 0.25);
        }

        .filter-radio-input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .radio-indicator {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1.5px solid #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.15s ease;
        }

        .filter-radio-label.active .radio-indicator {
          border-color: #eab308;
          background: #eab308;
        }

        .filter-radio-label.active .radio-indicator::after {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ffffff;
        }

        .filter-label-text {
          font-size: 13.5px;
          font-weight: 500;
          color: #334155;
          line-height: 1.3;
        }

        .filter-radio-label.active .filter-label-text {
          color: #713f12;
          font-weight: 700;
        }

        .religion-highlight {
          background: #fffdf5;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid rgba(234, 179, 8, 0.2);
        }

        .filter-drawer-footer {
          padding: 16px 20px;
          border-top: 1px solid rgba(226, 232, 240, 0.8);
          background: #ffffff;
        }

        .apply-filters-btn {
          width: 100%;
          padding: 11px 16px;
          border-radius: 12px;
          background: linear-gradient(135deg, #facc15 0%, #eab308 100%);
          color: #713f12;
          font-size: 14px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(234, 179, 8, 0.25);
          transition: all 0.2s ease;
        }

        .apply-filters-btn:hover {
          filter: brightness(1.05);
          transform: translateY(-1px);
        }
      `}</style>
    </>
  );
};
