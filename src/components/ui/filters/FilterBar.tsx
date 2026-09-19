'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FilterDropdown, FilterOption } from './FilterDropdown';
import { SortFilterDropdown, SortItem } from './SortFilterDropdown';
import { ActiveFilterChips, ActiveFilterItem } from './ActiveFilterChips';
import { FilterGlassPanel, FilterGlassSection } from './FilterGlassPanel';
import { FilterChip } from './FilterChip';

export interface FilterBarMainDropdown {
  id: string;
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  enableSearch?: boolean;
  searchPlaceholder?: string;
  icon?: React.ReactNode;
  accent?: boolean;
}

export interface FilterBarProps {
  // Primary Filter chips
  mainFilters?: FilterBarMainDropdown[];
  primaryFilters?: FilterBarMainDropdown[];

  // Secondary Filters
  advancedFiltersContent?: React.ReactNode;
  secondaryFilters?: FilterBarMainDropdown[];
  advancedActiveCount?: number;

  // Search
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;

  // Sort
  sort?: {
    value: string;
    onChange: (val: string) => void;
    options: SortItem<any>[];
  };
  sortOptions?: SortItem<any>[];
  selectedSort?: string;
  onSortChange?: (val: string) => void;

  // Results & Active
  totalResults?: number;
  resultsLabel?: string;
  resultsUnit?: string;
  resultsUnitPlural?: string;
  activeChips?: ActiveFilterItem[];
  onResetAll?: () => void;

  // Mobile
  mobileSections?: FilterGlassSection[];
  mobileTitle?: string;
  mobileDrawerTitle?: string;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  mainFilters,
  primaryFilters,
  advancedFiltersContent,
  secondaryFilters = [],
  advancedActiveCount = 0,
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  sort,
  sortOptions,
  selectedSort,
  onSortChange,
  totalResults,
  resultsLabel,
  resultsUnit = 'résultat',
  resultsUnitPlural = 'résultats',
  activeChips = [],
  onResetAll,
  mobileSections = [],
  mobileTitle,
  mobileDrawerTitle,
  className = '',
}) => {
  const [mobileGlassOpen, setMobileGlassOpen] = useState(false);
  const [secondaryPanelOpen, setSecondaryPanelOpen] = useState(false);
  const secondaryPanelRef = useRef<HTMLDivElement>(null);

  const effectiveMainFilters = primaryFilters || mainFilters || [];
  const effectiveMobileTitle = mobileDrawerTitle || mobileTitle || 'Filtres';

  // Resolved Sort
  const effectiveSort = sort || (sortOptions && selectedSort && onSortChange ? {
    value: selectedSort,
    onChange: onSortChange,
    options: sortOptions,
  } : undefined);

  // Close secondary panel on outside click or Escape
  useEffect(() => {
    if (!secondaryPanelOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (secondaryPanelRef.current && !secondaryPanelRef.current.contains(e.target as Node)) {
        setSecondaryPanelOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSecondaryPanelOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [secondaryPanelOpen]);

  const totalActiveCount = activeChips.length;

  // Calculate active count in secondary filters if not explicitly provided
  const computedSecondaryActiveCount =
    advancedActiveCount ||
    secondaryFilters.filter((f) => f.value && f.value !== 'all').length;

  const resolvedResultsLabel =
    resultsLabel ||
    (totalResults !== undefined
      ? `${totalResults > 1 ? resultsUnitPlural : resultsUnit} ${
          (resultsUnit && (resultsUnit.includes('ressource') || resultsUnit.includes('session')))
            ? (totalResults > 1 ? 'trouvées' : 'trouvée')
            : (totalResults > 1 ? 'trouvés' : 'trouvé')
        }`
      : 'résultats');

  return (
    <div className={`sunu-unified-filter-bar ${className}`}>
      {/* ── 0. OPTIONAL SEARCH BAR ROW ── */}
      {searchQuery !== undefined && onSearchChange !== undefined && (
        <div className="filter-search-input-row">
          <div className="filter-search-box">
            <svg
              className="filter-search-icon"
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
              className="filter-search-input"
              placeholder={searchPlaceholder || 'Rechercher...'}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="filter-search-clear"
                onClick={() => onSearchChange('')}
                aria-label="Effacer la recherche"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── 1. DESKTOP BAR (COMPACT FILTER CHIPS ROW) ── */}
      <div className="filter-bar-desktop-row">
        <div className="filter-chips-cluster">
          {effectiveMainFilters.map((f) => (
            <FilterDropdown
              key={f.id}
              id={f.id}
              label={f.label}
              value={f.value}
              options={f.options}
              onChange={f.onChange}
              placeholder={f.placeholder}
              enableSearch={f.enableSearch}
              searchPlaceholder={f.searchPlaceholder}
              icon={f.icon}
            />
          ))}

          {/* Secondary Filters Content: Either injected Node or built from array */}
          {advancedFiltersContent}

          {secondaryFilters.length > 0 && (
            <div className="secondary-filters-popover-anchor" ref={secondaryPanelRef}>
              <FilterChip
                id="btn-secondary-filters"
                label="+ Filtres"
                countBadge={computedSecondaryActiveCount > 0 ? computedSecondaryActiveCount : undefined}
                isActive={computedSecondaryActiveCount > 0}
                isOpen={secondaryPanelOpen}
                onClick={() => setSecondaryPanelOpen(!secondaryPanelOpen)}
                variant="secondary"
              />

              {secondaryPanelOpen && (
                <div className="secondary-filters-dropdown-box">
                  <div className="secondary-box-header">
                    <span className="secondary-box-title">Critères secondaires</span>
                    {computedSecondaryActiveCount > 0 && (
                      <span className="secondary-box-badge">
                        {computedSecondaryActiveCount} actif{computedSecondaryActiveCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div className="secondary-box-grid">
                    {secondaryFilters.map((f) => (
                      <div key={f.id} className="secondary-field-wrap">
                        <label className="secondary-field-label">{f.label}</label>
                        <FilterDropdown
                          id={`secondary-${f.id}`}
                          label={f.label}
                          value={f.value}
                          options={f.options}
                          onChange={f.onChange}
                          placeholder={f.placeholder}
                          enableSearch={f.enableSearch}
                          searchPlaceholder={f.searchPlaceholder}
                          icon={f.icon}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Trier */}
        {effectiveSort && (
          <div className="filter-sort-cluster">
            <SortFilterDropdown
              value={effectiveSort.value}
              onChange={effectiveSort.onChange}
              options={effectiveSort.options}
              align="right"
            />
          </div>
        )}
      </div>

      {/* ── 2. MOBILE COMPACT BAR ([Filtres] [Trier]) ── */}
      <div className="filter-bar-mobile-row">
        {mobileSections.length > 0 && (
          <button
            type="button"
            className={`mobile-filter-launcher-btn ${totalActiveCount > 0 ? 'is-active' : ''}`}
            onClick={() => setMobileGlassOpen(true)}
            aria-label="Ouvrir les filtres"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span>Filtres</span>
            {totalActiveCount > 0 && (
              <span className="mobile-badge-pill">{totalActiveCount}</span>
            )}
          </button>
        )}

        {effectiveSort && (
          <SortFilterDropdown
            value={effectiveSort.value}
            onChange={effectiveSort.onChange}
            options={effectiveSort.options}
            align="right"
          />
        )}
      </div>

      {/* ── 3. META STATUS ROW (Nombre de résultats & Bouton Reset) ── */}
      {(totalResults !== undefined || totalActiveCount > 0) && (
        <div className="filter-bar-status-row">
          {totalResults !== undefined && (
            <div className="status-results-badge">
              <span className="badge-num">{totalResults}</span>{' '}
              <span className="badge-text">{resolvedResultsLabel}</span>
            </div>
          )}

          {totalActiveCount > 0 && onResetAll && (
            <button
              type="button"
              className="status-reset-action"
              onClick={onResetAll}
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      )}

      {/* ── 4. CHIPS ACTIFS SUPPRIMABLES ── */}
      {activeChips.length > 0 && (
        <ActiveFilterChips
          items={activeChips}
          onResetAll={totalActiveCount > 1 ? onResetAll : undefined}
        />
      )}

      {/* ── 5. PANNEAU FLOTTANT GLASSMORPHISM MOBILE ── */}
      {mobileSections.length > 0 && (
        <FilterGlassPanel
          isOpen={mobileGlassOpen}
          onClose={() => setMobileGlassOpen(false)}
          sections={mobileSections}
          onReset={() => {
            if (onResetAll) onResetAll();
          }}
          totalResults={totalResults}
          resultsUnit={resultsUnit}
          resultsUnitPlural={resultsUnitPlural}
          activeCount={totalActiveCount}
          activeChips={activeChips}
          title={effectiveMobileTitle}
        />
      )}

      <style jsx>{`
        .sunu-unified-filter-bar {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.85);
          border-radius: 16px;
          padding: 14px 18px;
          box-shadow: 0 4px 20px -4px rgba(15, 23, 42, 0.04);
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative;
        }

        /* 0. Integrated Search Input Row */
        .filter-search-input-row {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
        }

        .filter-search-box {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
        }

        .filter-search-icon {
          position: absolute;
          left: 14px;
          color: #94a3b8;
          pointer-events: none;
        }

        .filter-search-input {
          width: 100%;
          height: 44px;
          padding: 8px 36px 8px 42px;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14px;
          color: #0f172a;
          background: #f8fafc;
          transition: all 0.2s ease;
          outline: none;
        }

        .filter-search-input:focus {
          background: #ffffff;
          border-color: #6366f1;
          box-shadow: 0 0 0 3.5px rgba(99, 102, 241, 0.12);
        }

        .filter-search-clear {
          position: absolute;
          right: 12px;
          background: #e2e8f0;
          border: none;
          color: #64748b;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          cursor: pointer;
        }

        /* 1. Desktop Row */
        .filter-bar-desktop-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .filter-chips-cluster {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          flex: 1;
        }

        .filter-sort-cluster {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        /* Secondary Popover Anchor */
        .secondary-filters-popover-anchor {
          position: relative;
          display: inline-block;
        }

        .secondary-filters-dropdown-box {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 16px 36px -8px rgba(15, 23, 42, 0.12);
          z-index: 100;
          min-width: 280px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          animation: popoverFadeIn 0.15s ease-out;
        }

        @keyframes popoverFadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .secondary-box-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 8px;
        }

        .secondary-box-title {
          font-size: 12.5px;
          font-weight: 700;
          color: #0f172a;
        }

        .secondary-box-badge {
          background: #ede9fe;
          color: #6366f1;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 999px;
        }

        .secondary-box-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .secondary-field-wrap {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .secondary-field-label {
          font-size: 11.5px;
          font-weight: 600;
          color: #64748b;
        }

        /* 2. Mobile Row */
        .filter-bar-mobile-row {
          display: none;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          width: 100%;
        }

        .mobile-filter-launcher-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 40px;
          padding: 0 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 999px;
          font-size: 13.5px;
          font-weight: 600;
          color: #0f172a;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          user-select: none;
          flex-shrink: 0;
        }

        .mobile-filter-launcher-btn:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .mobile-filter-launcher-btn.is-active {
          background: #ede9fe;
          border-color: #c4b5fd;
          color: #4f46e5;
        }

        .mobile-badge-pill {
          background: #4f46e5;
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        /* 3. Status Row */
        .filter-bar-status-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 4px;
          font-size: 12.5px;
        }

        .status-results-badge {
          display: flex;
          align-items: baseline;
          gap: 5px;
          color: #64748b;
        }

        .badge-num {
          font-weight: 700;
          color: #0f172a;
        }

        .badge-text {
          color: #64748b;
        }

        .status-reset-action {
          background: none;
          border: none;
          padding: 0;
          font-size: 12px;
          font-weight: 600;
          color: #6366f1;
          cursor: pointer;
          transition: color 0.15s ease;
        }

        .status-reset-action:hover {
          color: #4f46e5;
          text-decoration: underline;
        }

        /* ── RESPONSIVE ADAPTATIONS ── */
        @media (max-width: 860px) {
          .sunu-unified-filter-bar {
            padding: 14px 16px;
            border-radius: 16px;
          }

          .filter-bar-desktop-row {
            display: none !important;
          }

          .filter-bar-mobile-row {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};
