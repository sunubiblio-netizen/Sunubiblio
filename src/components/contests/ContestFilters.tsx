'use client';

import React from 'react';
import { ContestFilterState } from '@/types/contest';
import { CONTEST_DOMAINS, CONTEST_DIPLOMAS, CONTEST_STATUSES, CONTEST_COUNTRIES } from '@/data/mockContests';
import {
  FilterBar,
  FilterOption,
  SortItem,
  ActiveFilterItem,
  FilterGlassSection,
} from '@/components/ui/filters';

interface ContestFiltersProps {
  filters: ContestFilterState;
  onFilterChange: (newFilters: Partial<ContestFilterState>) => void;
  onResetFilters: () => void;
  activeCount?: number;
  totalCount?: number;
}

const CONTEST_SORT_OPTIONS: SortItem<ContestFilterState['sortBy']>[] = [
  { value: 'pertinence', label: 'Pertinence' },
  { value: 'recent', label: 'Plus récents' },
  { value: 'popular', label: 'Plus populaires' },
  { value: 'name', label: 'Nom A-Z' },
];

export const ContestFilters: React.FC<ContestFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalCount = 0,
}) => {
  const domainOptions: FilterOption[] = CONTEST_DOMAINS.map((d) => ({
    value: d.id,
    label: d.label,
  }));

  const diplomaOptions: FilterOption[] = CONTEST_DIPLOMAS.map((d) => ({
    value: d.id,
    label: d.label,
  }));

  const statusOptions: FilterOption[] = CONTEST_STATUSES.map((s) => ({
    value: s.id,
    label: s.label,
  }));

  const countryOptions: FilterOption[] = CONTEST_COUNTRIES.map((c) => ({
    value: c.id,
    label: c.label,
  }));

  const primaryFilters = [
    {
      id: 'domain',
      label: 'Domaine',
      value: filters.domain,
      options: domainOptions,
      onChange: (val: string) => onFilterChange({ domain: val as ContestFilterState['domain'] }),
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
    },
    {
      id: 'diploma',
      label: 'Niveau requis',
      value: filters.diploma,
      options: diplomaOptions,
      onChange: (val: string) => onFilterChange({ diploma: val as ContestFilterState['diploma'] }),
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
    },
    {
      id: 'country',
      label: 'Zone',
      value: filters.country,
      options: countryOptions,
      onChange: (val: string) => onFilterChange({ country: val as ContestFilterState['country'] }),
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
    },
  ];

  const secondaryFilters = [
    {
      id: 'status',
      label: 'Statut de session',
      value: filters.status,
      options: statusOptions,
      onChange: (val: string) => onFilterChange({ status: val as ContestFilterState['status'] }),
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 14 14" />
        </svg>
      ),
    },
  ];

  const activeFilterChips: ActiveFilterItem[] = [];
  if (filters.domain !== 'all') {
    const lbl = domainOptions.find((d) => d.value === filters.domain)?.label || filters.domain;
    activeFilterChips.push({
      id: 'domain',
      label: 'Domaine',
      value: lbl,
      onRemove: () => onFilterChange({ domain: 'all' }),
    });
  }
  if (filters.diploma !== 'all') {
    const lbl = diplomaOptions.find((d) => d.value === filters.diploma)?.label || filters.diploma;
    activeFilterChips.push({
      id: 'diploma',
      label: 'Niveau',
      value: lbl,
      onRemove: () => onFilterChange({ diploma: 'all' }),
    });
  }
  if (filters.status !== 'all') {
    const lbl = statusOptions.find((s) => s.value === filters.status)?.label || filters.status;
    activeFilterChips.push({
      id: 'status',
      label: 'Statut',
      value: lbl,
      onRemove: () => onFilterChange({ status: 'all' }),
    });
  }
  if (filters.country !== 'all') {
    const lbl = countryOptions.find((c) => c.value === filters.country)?.label || filters.country;
    activeFilterChips.push({
      id: 'country',
      label: 'Zone',
      value: lbl,
      onRemove: () => onFilterChange({ country: 'all' }),
    });
  }

  const mobileSections: FilterGlassSection[] = [
    {
      id: 'domain',
      title: 'Domaine de concours',
      options: domainOptions,
      selectedValue: filters.domain,
      onSelect: (val: string) => onFilterChange({ domain: val as ContestFilterState['domain'] }),
    },
    {
      id: 'diploma',
      title: "Niveau d'études requis",
      options: diplomaOptions,
      selectedValue: filters.diploma,
      onSelect: (val: string) => onFilterChange({ diploma: val as ContestFilterState['diploma'] }),
    },
    {
      id: 'status',
      title: 'Statut de la session',
      options: statusOptions,
      selectedValue: filters.status,
      onSelect: (val: string) => onFilterChange({ status: val as ContestFilterState['status'] }),
    },
    {
      id: 'country',
      title: 'Zone géographique',
      options: countryOptions,
      selectedValue: filters.country,
      onSelect: (val: string) => onFilterChange({ country: val as ContestFilterState['country'] }),
    },
  ];

  return (
    <div className="contest-filter-bar-wrapper">
      <FilterBar
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => onFilterChange({ searchQuery: q })}
        searchPlaceholder="Rechercher un concours (ex: FASTEF, CREM, Police, Douanes, ENA)..."
        primaryFilters={primaryFilters}
        secondaryFilters={secondaryFilters}
        sortOptions={CONTEST_SORT_OPTIONS}
        selectedSort={filters.sortBy}
        onSortChange={(sort) => onFilterChange({ sortBy: sort as ContestFilterState['sortBy'] })}
        activeChips={activeFilterChips}
        onResetAll={onResetFilters}
        totalResults={totalCount}
        resultsUnit="concours"
        resultsUnitPlural="concours"
        mobileSections={mobileSections}
        mobileDrawerTitle="Filtres Concours"
      />

      <style jsx>{`
        .contest-filter-bar-wrapper {
          width: 100%;
          margin-bottom: 24px;
        }
      `}</style>
    </div>
  );
};
