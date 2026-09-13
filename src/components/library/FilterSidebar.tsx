'use client';

import React from 'react';
import { FilterState } from '@/types/library';
import { SUBJECT_OPTIONS, RESOURCE_TYPES, ACCESS_LEVELS, RELIGION_SUB_OPTIONS } from '@/data/mockLibrary';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  activeFiltersCount: number;
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
}) => {
  return (
    <aside className="filter-sidebar">
      {/* Sidebar Header */}
      <div className="filter-sidebar-header">
        <div className="header-title-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span className="sidebar-title">Filtres</span>
          {activeFiltersCount > 0 && (
            <span className="filters-count-badge">{activeFiltersCount}</span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            type="button"
            className="reset-filters-btn"
            onClick={onResetFilters}
          >
            Réinitialiser
          </button>
        )}
      </div>

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

      {/* If Religion is selected, show religious subcategories */}
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

      <style jsx>{`
        .filter-sidebar {
          width: 280px;
          flex-shrink: 0;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.85);
          border-radius: var(--radius-lg);
          padding: 20px 18px;
          height: fit-content;
          position: sticky;
          top: 140px;
          box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.03);
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
          color: #ffffff;
          background: #4f46e5;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .reset-filters-btn {
          font-size: 12px;
          font-weight: 600;
          color: #6366f1;
          transition: color 0.15s ease;
        }

        .reset-filters-btn:hover {
          color: #4338ca;
          text-decoration: underline;
        }

        .filter-group {
          margin-bottom: 20px;
          padding-bottom: 16px;
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
          gap: 7px;
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
          background: #eef2ff;
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
          border-color: #4f46e5;
          background: #4f46e5;
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
          color: #4f46e5;
          font-weight: 700;
        }

        @media (max-width: 1024px) {
          .filter-sidebar {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
};
