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
      `}</style>
    </div>
  );
};
