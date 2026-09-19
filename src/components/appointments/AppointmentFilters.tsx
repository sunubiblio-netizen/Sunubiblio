'use client';

import React from 'react';
import {
  FilterBar,
  FilterOption,
  FilterGlassSection,
  ActiveFilterItem,
} from '@/components/ui/filters';
import { AppointmentFilterState } from '@/types/appointment';

interface AppointmentFiltersProps {
  filters: AppointmentFilterState;
  onFilterChange: (newFilters: Partial<AppointmentFilterState>) => void;
  onResetFilters: () => void;
  totalResults: number;
}

const STATUS_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'Tous les statuts', icon: '📋' },
  { value: 'upcoming', label: 'À venir', badge: 'Confirmé', icon: '🕐' },
  { value: 'today', label: "Aujourd'hui", badge: 'Urgent', icon: '🎯' },
  { value: 'pending', label: 'En attente', badge: 'Réponse attendue', icon: '⏳' },
  { value: 'completed', label: 'Terminé', badge: 'Passé', icon: '✅' },
  { value: 'cancelled', label: 'Annulé', icon: '❌' },
];

const MODE_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'Tous les modes', icon: '🌐' },
  { value: 'visio', label: 'Visio en direct', badge: 'En ligne', icon: '🖥' },
  { value: 'presentiel', label: 'Présentiel', badge: 'En salle', icon: '📍' },
  { value: 'domicile', label: 'À domicile', badge: 'Déplacement', icon: '🏠' },
];

const PERIOD_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'Toutes les périodes', icon: '📅' },
  { value: 'today', label: "Aujourd'hui", icon: '📅' },
  { value: 'this_week', label: 'Cette semaine', icon: '📅' },
  { value: 'this_month', label: 'Ce mois', icon: '📅' },
];

const TYPE_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'Tous les types', icon: '📚' },
  { value: 'cours', label: 'Cours particulier', badge: 'Cours', icon: '📚' },
  { value: 'formation', label: 'Formation', badge: 'Formation', icon: '🎓' },
  { value: 'rdv', label: 'Rendez-vous conseil', badge: 'RDV', icon: '💬' },
];

export const AppointmentFilters: React.FC<AppointmentFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
}) => {
  // Chips des filtres actifs
  const activeChips: ActiveFilterItem[] = [];
  if (filters.status !== 'all') {
    const lbl = STATUS_OPTIONS.find((o) => o.value === filters.status)?.label || filters.status;
    activeChips.push({
      id: 'status',
      label: 'Statut',
      value: lbl,
      onRemove: () => onFilterChange({ status: 'all' }),
    });
  }
  if (filters.mode !== 'all') {
    const lbl = MODE_OPTIONS.find((o) => o.value === filters.mode)?.label || filters.mode;
    activeChips.push({
      id: 'mode',
      label: 'Mode',
      value: lbl,
      onRemove: () => onFilterChange({ mode: 'all' }),
    });
  }
  if (filters.period !== 'all') {
    const lbl = PERIOD_OPTIONS.find((o) => o.value === filters.period)?.label || filters.period;
    activeChips.push({
      id: 'period',
      label: 'Période',
      value: lbl,
      onRemove: () => onFilterChange({ period: 'all' }),
    });
  }
  if (filters.type !== 'all') {
    const lbl = TYPE_OPTIONS.find((o) => o.value === filters.type)?.label || filters.type;
    activeChips.push({
      id: 'type',
      label: 'Type',
      value: lbl,
      onRemove: () => onFilterChange({ type: 'all' }),
    });
  }

  // Sections panneau glassmorphism mobile
  const mobileSections: FilterGlassSection[] = [
    {
      id: 'status',
      title: 'Statut',
      options: STATUS_OPTIONS,
      selectedValue: filters.status,
      onSelect: (val) => onFilterChange({ status: val as AppointmentFilterState['status'] }),
    },
    {
      id: 'mode',
      title: 'Mode de séance',
      options: MODE_OPTIONS,
      selectedValue: filters.mode,
      onSelect: (val) => onFilterChange({ mode: val as AppointmentFilterState['mode'] }),
    },
    {
      id: 'period',
      title: 'Période',
      options: PERIOD_OPTIONS,
      selectedValue: filters.period,
      onSelect: (val) => onFilterChange({ period: val as AppointmentFilterState['period'] }),
    },
    {
      id: 'type',
      title: 'Type de séance',
      options: TYPE_OPTIONS,
      selectedValue: filters.type,
      onSelect: (val) => onFilterChange({ type: val as AppointmentFilterState['type'] }),
    },
  ];

  // Filtres desktop primaires
  const primaryFilters = [
    {
      id: 'status',
      label: 'Statut',
      value: filters.status,
      options: STATUS_OPTIONS,
      onChange: (val: string) => onFilterChange({ status: val as AppointmentFilterState['status'] }),
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      id: 'mode',
      label: 'Mode',
      value: filters.mode,
      options: MODE_OPTIONS,
      onChange: (val: string) => onFilterChange({ mode: val as AppointmentFilterState['mode'] }),
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      ),
    },
    {
      id: 'period',
      label: 'Période',
      value: filters.period,
      options: PERIOD_OPTIONS,
      onChange: (val: string) => onFilterChange({ period: val as AppointmentFilterState['period'] }),
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
  ];

  const secondaryFilters = [
    {
      id: 'type',
      label: 'Type',
      value: filters.type,
      options: TYPE_OPTIONS,
      onChange: (val: string) => onFilterChange({ type: val as AppointmentFilterState['type'] }),
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
    },
  ];

  return (
    <FilterBar
      searchQuery={filters.searchQuery}
      onSearchChange={(q) => onFilterChange({ searchQuery: q })}
      searchPlaceholder="Rechercher un professeur, une matière..."
      primaryFilters={primaryFilters}
      secondaryFilters={secondaryFilters}
      activeChips={activeChips}
      onResetAll={activeChips.length > 0 ? onResetFilters : undefined}
      totalResults={totalResults}
      resultsUnit="rendez-vous"
      resultsUnitPlural="rendez-vous"
      mobileSections={mobileSections}
      mobileDrawerTitle="Filtrer les rendez-vous"
    />
  );
};
