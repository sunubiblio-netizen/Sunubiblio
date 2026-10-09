'use client';

import React, { useEffect } from 'react';
import { FilterState } from '@/types/library';
import { SUBJECT_OPTIONS, RESOURCE_TYPES, ACCESS_LEVELS, RELIGION_SUB_OPTIONS } from '@/data/mockLibrary';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  activeFiltersCount: number;
  isOpen?: boolean;
  onClose?: () => void;
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
  isOpen = false,
  onClose,
}) => {
  // Fermer avec la touche Échap sur mobile
  useEffect(() => {
    if (!isOpen || !onClose) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const content = (
    <div className="filter-sidebar-inner">
      {/* Sidebar Header */}
      <div className="filter-sidebar-header">
        <div className="header-title-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span className="sidebar-title">Filtres</span>
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
              Réinitialiser
            </button>
          )}
          {onClose && (
            <button
              type="button"
              className="mobile-close-btn"
              onClick={onClose}
              aria-label="Fermer les filtres"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="filter-groups-scroll-area">
        {/* 1. Catégorie */}
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

        {/* Si Religion est sélectionnée, afficher sous-traditions */}
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
          <h3 className="filter-group-title">Niveau</h3>
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
          <h3 className="filter-group-title">Matière</h3>
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
          <h3 className="filter-group-title">Type de ressource</h3>
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
          <h3 className="filter-group-title">Accès</h3>
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
    </div>
  );

  return (
    <>
      {/* 1. Affichage standard sur PC (toujours ouvert dans la colonne de gauche) */}
      <aside className="filter-sidebar desktop-filter-sidebar">
        {content}
      </aside>

      {/* 2. Affichage mobile en tiroir coulissant lorsque ouvert */}
      {isOpen && (
        <div className="mobile-filter-drawer-wrapper">
          <div
            className="mobile-filter-backdrop"
            onClick={onClose}
            aria-hidden="true"
          />
          <aside className="filter-sidebar mobile-filter-sidebar" role="dialog" aria-label="Filtres">
            {content}
          </aside>
        </div>
      )}

      <style jsx>{`
        /* Version Desktop : fixée à gauche comme sur l'Image 2 */
        .desktop-filter-sidebar {
          width: 275px;
          flex-shrink: 0;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.85);
          border-radius: var(--radius-lg);
          padding: 20px 18px;
          height: fit-content;
          position: sticky;
          top: 96px;
          box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.03);
          display: block;
        }

        .filter-sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 14px;
          margin-bottom: 16px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.75);
        }

        .header-title-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sidebar-title {
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
          width: 19px;
          height: 19px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .reset-filters-btn {
          font-size: 12px;
          font-weight: 600;
          color: #d97706;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: color 0.15s ease;
          padding: 2px 4px;
        }

        .reset-filters-btn:hover {
          color: #b45309;
          text-decoration: underline;
        }

        .mobile-close-btn {
          display: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #f1f5f9;
          border: none;
          color: #64748b;
          font-size: 12px;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .filter-group {
          margin-bottom: 18px;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
        }

        .filter-group:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .filter-group.religion-highlight {
          background: rgba(245, 158, 11, 0.05);
          padding: 12px;
          border-radius: var(--radius-md);
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .filter-group-title {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #475569;
          margin-bottom: 10px;
        }

        .filter-options-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .filter-radio-label {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 5px 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.15s ease;
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
          display: none;
        }

        .radio-indicator {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 1.5px solid #cbd5e1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
          flex-shrink: 0;
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

        /* Version Mobile Tiroir */
        .mobile-filter-drawer-wrapper {
          display: none;
        }

        @media (max-width: 1024px) {
          .desktop-filter-sidebar {
            display: none;
          }

          .mobile-filter-drawer-wrapper {
            display: block;
          }

          .mobile-filter-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.4);
            backdrop-filter: blur(4px);
            z-index: 1000;
          }

          .mobile-filter-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 310px;
            max-width: 86vw;
            background: #ffffff;
            z-index: 1001;
            padding: 20px 18px;
            overflow-y: auto;
            box-shadow: 0 20px 48px rgba(15, 23, 42, 0.18);
            animation: slideIn 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .mobile-close-btn {
            display: flex;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};
