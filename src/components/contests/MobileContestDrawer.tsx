'use client';

import React from 'react';
import { ContestFilterState } from '@/types/contest';
import { CONTEST_DOMAINS, CONTEST_DIPLOMAS, CONTEST_STATUSES, CONTEST_COUNTRIES } from '@/data/mockContests';
import {
  FilterGlassPanel,
  FilterGlassSection,
  ActiveFilterItem,
} from '@/components/ui/filters';

interface MobileContestDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ContestFilterState;
  onFilterChange: (newFilters: Partial<ContestFilterState>) => void;
  onResetFilters: () => void;
  totalCount: number;
}

export const MobileContestDrawer: React.FC<MobileContestDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onResetFilters,
  totalCount,
}) => {
  const domainOptions = CONTEST_DOMAINS.map((d) => ({ value: d.id, label: d.label }));
  const diplomaOptions = CONTEST_DIPLOMAS.map((d) => ({ value: d.id, label: d.label }));
  const statusOptions = CONTEST_STATUSES.map((s) => ({ value: s.id, label: s.label }));
  const countryOptions = CONTEST_COUNTRIES.map((c) => ({ value: c.id, label: c.label }));

  const activeChips: ActiveFilterItem[] = [];
  if (filters.domain !== 'all') {
    const lbl = domainOptions.find((d) => d.value === filters.domain)?.label || filters.domain;
    activeChips.push({
      id: 'domain',
      label: 'Domaine',
      value: lbl,
      onRemove: () => onFilterChange({ domain: 'all' }),
    });
  }
  if (filters.diploma !== 'all') {
    const lbl = diplomaOptions.find((d) => d.value === filters.diploma)?.label || filters.diploma;
    activeChips.push({
      id: 'diploma',
      label: 'Niveau',
      value: lbl,
      onRemove: () => onFilterChange({ diploma: 'all' }),
    });
  }
  if (filters.status !== 'all') {
    const lbl = statusOptions.find((s) => s.value === filters.status)?.label || filters.status;
    activeChips.push({
      id: 'status',
      label: 'Statut',
      value: lbl,
      onRemove: () => onFilterChange({ status: 'all' }),
    });
  }
  if (filters.country !== 'all') {
    const lbl = countryOptions.find((c) => c.value === filters.country)?.label || filters.country;
    activeChips.push({
      id: 'country',
      label: 'Zone',
      value: lbl,
      onRemove: () => onFilterChange({ country: 'all' }),
    });
  }

  const sections: FilterGlassSection[] = [
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
    <FilterGlassPanel
      isOpen={isOpen}
      onClose={onClose}
      title="Filtres Concours"
      totalResults={totalCount}
      resultsUnit="concours"
      resultsUnitPlural="concours"
      activeCount={activeChips.length}
      activeChips={activeChips}
      sections={sections}
      onResetAll={onResetFilters}
    />
  );
};
