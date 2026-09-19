'use client';

import React, { useMemo } from 'react';
import {
  DocumentCategory,
  DocumentCategoryInfo,
  DocumentFilterState,
  DocumentFormat,
} from '@/types/document';
import {
  FilterBar,
  FilterOption,
  SortItem,
  ActiveFilterItem,
  FilterGlassSection,
} from '@/components/ui/filters';

interface DocumentsFiltersProps {
  filters: DocumentFilterState;
  onFilterChange: (newFilters: Partial<DocumentFilterState>) => void;
  onResetFilters: () => void;
  categories: DocumentCategoryInfo[];
  availableYears: number[];
  totalResults: number;
}

export const DocumentsFilters: React.FC<DocumentsFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  categories,
  availableYears,
  totalResults,
}) => {
  // 1. Options pour les filtres
  const categoryOptions: FilterOption[] = useMemo(() => {
    return [
      { value: 'all', label: 'Toutes les catégories' },
      ...categories.map((cat) => ({
        value: cat.id,
        label: cat.label,
        subtitle: cat.description,
      })),
    ];
  }, [categories]);

  const formatOptions: FilterOption[] = useMemo(() => {
    return [
      { value: 'all', label: 'Tous les formats' },
      { value: 'pdf', label: 'PDF téléchargeable', badge: 'PDF' },
      { value: 'doc', label: 'Word / DOCX modifiable', badge: 'Word' },
      { value: 'xls', label: 'Tableur Excel', badge: 'Excel' },
      { value: 'formulaire', label: 'Formulaire officiel', badge: 'Formulaire' },
      { value: 'modele', label: 'Modèle prêt à l’emploi', badge: 'Modèle' },
    ];
  }, []);

  const yearOptions: FilterOption[] = useMemo(() => {
    return [
      { value: 'all', label: 'Toutes les années' },
      ...availableYears.map((yr) => ({
        value: String(yr),
        label: `Année ${yr}`,
      })),
    ];
  }, [availableYears]);

  const sortOptions: SortItem<DocumentFilterState['sortBy']>[] = useMemo(() => {
    return [
      { value: 'pertinence', label: 'Pertinence' },
      { value: 'recent', label: 'Plus récents' },
      { value: 'downloads', label: 'Plus téléchargés' },
      { value: 'title', label: 'Ordre alphabétique' },
    ];
  }, []);

  // 2. Chips actifs supprimables
  const activeChips: ActiveFilterItem[] = useMemo(() => {
    const list: ActiveFilterItem[] = [];

    if (filters.category !== 'all') {
      const label = categories.find((c) => c.id === filters.category)?.label || filters.category;
      list.push({
        id: 'category',
        label,
        categoryLabel: 'Catégorie',
        onRemove: () => onFilterChange({ category: 'all', page: 1 }),
      });
    }

    if (filters.format !== 'all') {
      const label = formatOptions.find((f) => f.value === filters.format)?.label || filters.format;
      list.push({
        id: 'format',
        label,
        categoryLabel: 'Format',
        onRemove: () => onFilterChange({ format: 'all', page: 1 }),
      });
    }

    if (filters.year !== 'all') {
      list.push({
        id: 'year',
        label: `${filters.year}`,
        categoryLabel: 'Année',
        onRemove: () => onFilterChange({ year: 'all', page: 1 }),
      });
    }

    return list;
  }, [filters, categories, formatOptions, onFilterChange]);

  // 3. Sections pour le Panneau Mobile Glassmorphism
  const mobileSections: FilterGlassSection[] = useMemo(() => {
    return [
      {
        id: 'category',
        title: 'Catégorie de documents',
        selectedValue: filters.category,
        onSelect: (val) => onFilterChange({ category: val as DocumentCategory, page: 1 }),
        options: categoryOptions.map((c) => ({ id: c.value, label: c.label, badge: c.badge })),
      },
      {
        id: 'format',
        title: 'Format de fichier',
        selectedValue: filters.format,
        onSelect: (val) => onFilterChange({ format: val as DocumentFormat | 'all', page: 1 }),
        options: formatOptions.map((f) => ({ id: f.value, label: f.label, badge: f.badge })),
      },
      {
        id: 'year',
        title: 'Année de publication',
        selectedValue: String(filters.year),
        onSelect: (val) => onFilterChange({ year: val === 'all' ? 'all' : Number(val), page: 1 }),
        options: yearOptions.map((y) => ({ id: y.value, label: y.label })),
      },
    ];
  }, [filters, categoryOptions, formatOptions, yearOptions, onFilterChange]);

  return (
    <div className="doc-unified-filters-wrapper">
      {/* Barre de recherche */}
      <div className="doc-search-bar">
        <div className="search-input-wrapper">
          <svg
            className="search-leading-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher par titre, type (demande de stage, bourse, modèle de CV)..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value, page: 1 })}
          />
          {filters.searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onFilterChange({ searchQuery: '', page: 1 })}
              aria-label="Effacer la recherche"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Barre unifiée de filtres compacts */}
      <FilterBar
        mainFilters={[
          {
            id: 'doc-category',
            label: 'Catégorie',
            value: filters.category,
            options: categoryOptions,
            onChange: (val) => onFilterChange({ category: val as DocumentCategory, page: 1 }),
            placeholder: 'Toutes catégories',
            enableSearch: categories.length > 5,
            searchPlaceholder: 'Filtrer les catégories...',
          },
          {
            id: 'doc-format',
            label: 'Format',
            value: filters.format,
            options: formatOptions,
            onChange: (val) => onFilterChange({ format: val as DocumentFormat | 'all', page: 1 }),
            placeholder: 'Tous formats',
          },
          {
            id: 'doc-year',
            label: 'Année',
            value: String(filters.year),
            options: yearOptions,
            onChange: (val) => onFilterChange({ year: val === 'all' ? 'all' : Number(val), page: 1 }),
            placeholder: 'Toutes années',
          },
        ]}
        sort={{
          value: filters.sortBy,
          onChange: (val) => onFilterChange({ sortBy: val as DocumentFilterState['sortBy'], page: 1 }),
          options: sortOptions,
        }}
        totalResults={totalResults}
        resultsLabel={totalResults <= 1 ? 'document trouvé' : 'documents trouvés'}
        activeChips={activeChips}
        onResetAll={activeChips.length > 0 ? onResetFilters : undefined}
        mobileSections={mobileSections}
        mobileTitle="Filtres documents"
      />

      <style jsx>{`
        .doc-unified-filters-wrapper {
          margin-bottom: 24px;
        }

        .doc-search-bar {
          margin-bottom: 12px;
        }

        .search-input-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
        }

        .search-leading-icon {
          position: absolute;
          left: 14px;
          color: #94a3b8;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          height: 44px;
          padding: 0 40px 0 42px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-size: 13.5px;
          color: #0f172a;
          outline: none;
          transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
        }

        .search-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
        }

        .clear-search-btn {
          position: absolute;
          right: 12px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(148, 163, 184, 0.2);
          color: #64748b;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 11px;
        }

        .clear-search-btn:hover {
          background: #ef4444;
          color: #ffffff;
        }
      `}</style>
    </div>
  );
};
