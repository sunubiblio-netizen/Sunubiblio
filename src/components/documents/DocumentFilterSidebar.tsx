'use client';

import React from 'react';
import {
  DocumentCategory,
  DocumentCategoryInfo,
  DocumentFilterState,
  DocumentFormat,
} from '@/types/document';

interface DocumentFilterSidebarProps {
  filters: DocumentFilterState;
  onFilterChange: (newFilters: Partial<DocumentFilterState>) => void;
  onResetFilters: () => void;
  activeFiltersCount: number;
  categories: DocumentCategoryInfo[];
  availableYears: number[];
  isOpen?: boolean;
  onClose?: () => void;
  isDesktopOpen?: boolean;
  onToggleDesktop?: () => void;
}

export const DocumentFilterSidebar: React.FC<DocumentFilterSidebarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  activeFiltersCount,
  categories,
  availableYears,
  isOpen = false,
  onClose,
  isDesktopOpen = true,
  onToggleDesktop,
}) => {
  const categoryOptions = [
    { id: 'all', label: 'Toutes les catégories' },
    ...categories.map((c) => ({ id: c.id, label: c.label })),
  ];

  const formatOptions: { id: DocumentFormat | 'all'; label: string }[] = [
    { id: 'all', label: 'Tous les formats' },
    { id: 'PDF', label: 'Fascicule / Manuel PDF' },
    { id: 'DOCX', label: 'Word / DOCX modifiable' },
    { id: 'XLSX', label: 'Tableur Excel (XLSX)' },
    { id: 'Autre', label: 'Autre document officiel' },
  ];

  const accessOptions = [
    { id: 'all', label: 'Tous les accès' },
    { id: 'free', label: 'Accès Public Gratuit' },
    { id: 'premium', label: 'Réservé Abonnés' },
  ];

  return (
    <>
      <aside className={`doc-filter-sidebar ${isOpen ? 'mobile-open' : ''} ${!isDesktopOpen ? 'desktop-closed' : ''}`}>
        {/* En-tête Filtres : cliquable pour replier/déplier */}
        <div className="filter-sidebar-header">
          <button
            type="button"
            className="header-title-toggle-btn"
            onClick={onToggleDesktop || onClose}
            title="Cliquer pour fermer les filtres"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span className="sidebar-title">Filtres</span>
            {activeFiltersCount > 0 && (
              <span className="filters-count-badge">{activeFiltersCount}</span>
            )}
            <span className="collapse-arrow-icon" aria-hidden="true" title="Fermer les filtres">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </span>
          </button>

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

        {/* 1. Catégorie */}
        <div className="filter-group">
          <h3 className="filter-group-title">CATÉGORIE</h3>
          <div className="filter-options-list">
            {categoryOptions.map((cat) => (
              <label
                key={cat.id}
                className={`filter-radio-label ${filters.category === cat.id ? 'active' : ''}`}
              >
                <input
                  type="radio"
                  name="doc_category_filter"
                  className="filter-radio-input"
                  checked={filters.category === cat.id}
                  onChange={() => onFilterChange({ category: cat.id as DocumentCategory | 'all', page: 1 })}
                />
                <span className="radio-indicator" />
                <span className="filter-label-text">{cat.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 2. Format / Type de ressource */}
        <div className="filter-group">
          <h3 className="filter-group-title">TYPE DE RESSOURCE</h3>
          <div className="filter-options-list">
            {formatOptions.map((f) => (
              <label
                key={f.id}
                className={`filter-radio-label ${filters.format === f.id ? 'active' : ''}`}
              >
                <input
                  type="radio"
                  name="doc_format_filter"
                  className="filter-radio-input"
                  checked={filters.format === f.id}
                  onChange={() => onFilterChange({ format: f.id, page: 1 })}
                />
                <span className="radio-indicator" />
                <span className="filter-label-text">{f.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 3. Année de publication */}
        {availableYears.length > 0 && (
          <div className="filter-group">
            <h3 className="filter-group-title">ANNÉE DE PUBLICATION</h3>
            <div className="filter-options-list">
              <label className={`filter-radio-label ${filters.year === 'all' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="doc_year_filter"
                  className="filter-radio-input"
                  checked={filters.year === 'all'}
                  onChange={() => onFilterChange({ year: 'all', page: 1 })}
                />
                <span className="radio-indicator" />
                <span className="filter-label-text">Toutes les années</span>
              </label>
              {availableYears.slice(0, 6).map((yr) => (
                <label
                  key={yr}
                  className={`filter-radio-label ${filters.year === yr ? 'active' : ''}`}
                >
                  <input
                    type="radio"
                    name="doc_year_filter"
                    className="filter-radio-input"
                    checked={filters.year === yr}
                    onChange={() => onFilterChange({ year: yr, page: 1 })}
                  />
                  <span className="radio-indicator" />
                  <span className="filter-label-text">{yr}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* 4. Niveau d'accès */}
        <div className="filter-group">
          <h3 className="filter-group-title">NIVEAU D'ACCÈS</h3>
          <div className="filter-options-list">
            {accessOptions.map((acc) => (
              <label
                key={acc.id}
                className={`filter-radio-label ${filters.accessLevel === acc.id ? 'active' : ''}`}
              >
                <input
                  type="radio"
                  name="doc_access_filter"
                  className="filter-radio-input"
                  checked={filters.accessLevel === acc.id}
                  onChange={() => onFilterChange({ accessLevel: acc.id as DocumentFilterState['accessLevel'], page: 1 })}
                />
                <span className="radio-indicator" />
                <span className="filter-label-text">{acc.label}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      <style jsx>{`
        .doc-filter-sidebar {
          width: 270px;
          min-width: 270px;
          flex-shrink: 0;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.85);
          border-radius: 16px;
          padding: 20px 18px;
          height: fit-content;
          position: sticky;
          top: 96px;
          box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.03);
          display: block;
          z-index: 20;
          transition: all 0.2s ease;
        }

        @media (min-width: 1025px) {
          .doc-filter-sidebar.desktop-closed {
            display: none !important;
          }
        }

        .filter-sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 14px;
          margin-bottom: 16px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.75);
        }

        .header-title-toggle-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: none;
          padding: 4px 6px;
          margin: -4px -6px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .header-title-toggle-btn:hover {
          background: #f8fafc;
        }

        .header-title-toggle-btn:hover .collapse-arrow-icon {
          background: #e2e8f0;
          transform: translateX(-2px);
        }

        .collapse-arrow-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #f1f5f9;
          margin-left: 4px;
          transition: all 0.15s ease;
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

        .filter-group-title {
          font-size: 12.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #475569;
          margin-bottom: 10px;
        }

        .filter-options-list {
          display: flex !important;
          flex-direction: column !important;
          gap: 6px !important;
        }

        .filter-radio-label {
          display: flex !important;
          align-items: center !important;
          gap: 9px !important;
          padding: 6px 10px !important;
          border-radius: 8px !important;
          cursor: pointer !important;
          transition: background 0.15s ease, border-color 0.15s ease;
          user-select: none;
        }

        .filter-radio-label:hover {
          background: #f8fafc;
        }

        .filter-radio-label.active {
          background: #fefce8 !important;
          border: 1px solid rgba(234, 179, 8, 0.3) !important;
        }

        .filter-radio-input {
          position: absolute !important;
          opacity: 0 !important;
          pointer-events: none !important;
          width: 0 !important;
          height: 0 !important;
          margin: 0 !important;
        }

        .radio-indicator {
          width: 15px !important;
          height: 15px !important;
          border-radius: 50% !important;
          border: 1.5px solid #cbd5e1 !important;
          position: relative !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: all 0.15s ease !important;
          flex-shrink: 0 !important;
        }

        .filter-radio-label.active .radio-indicator {
          border-color: #eab308 !important;
          background: #eab308 !important;
        }

        .filter-radio-label.active .radio-indicator::after {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ffffff;
        }

        .filter-label-text {
          font-size: 13.5px !important;
          font-weight: 500 !important;
          color: #334155 !important;
          line-height: 1.3 !important;
        }

        .filter-radio-label.active .filter-label-text {
          color: #713f12 !important;
          font-weight: 700 !important;
        }

        /* Mobile View */
        @media (max-width: 1024px) {
          .doc-filter-sidebar {
            display: none;
          }

          .doc-filter-sidebar.mobile-open {
            display: flex !important;
            flex-direction: column !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            bottom: 0 !important;
            width: 320px !important;
            max-width: 88vw !important;
            height: 100vh !important;
            background: #ffffff !important;
            z-index: 2200 !important;
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch !important;
            box-shadow: 0 20px 48px rgba(15, 23, 42, 0.28) !important;
            animation: slideDrawer 0.24s cubic-bezier(0.16, 1, 0.3, 1) !important;
            padding: 20px 18px 24px !important;
          }

          .mobile-close-btn {
            display: flex !important;
          }
        }

        @keyframes slideDrawer {
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
