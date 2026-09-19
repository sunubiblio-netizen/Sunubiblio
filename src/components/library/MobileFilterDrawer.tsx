'use client';

import React from 'react';
import { FilterState } from '@/types/library';
import { SUBJECT_OPTIONS, RESOURCE_TYPES, ACCESS_LEVELS, RELIGION_SUB_OPTIONS } from '@/data/mockLibrary';
import {
  FilterGlassPanel,
  FilterGlassSection,
  ActiveFilterItem,
} from '@/components/ui/filters';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalResultsCount: number;
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

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onResetFilters,
  totalResultsCount,
}) => {
  const categoryOptions = CATEGORY_FILTER_LIST.map((c) => ({ value: c.id, label: c.label }));
  const cycleOptions = CYCLE_FILTER_LIST.map((c) => ({ value: c.id, label: c.label }));
  const subjectOptions = SUBJECT_OPTIONS.map((s) => ({ value: s.id, label: s.label }));
  const typeOptions = RESOURCE_TYPES.map((t) => ({ value: t.id, label: t.label }));
  const accessOptions = ACCESS_LEVELS.map((a) => ({ value: a.id, label: a.label }));
  const religionOptions = RELIGION_SUB_OPTIONS.map((r) => ({ value: r.id, label: r.label }));

  const activeChips: ActiveFilterItem[] = [];
  if (filters.category !== 'all') {
    const lbl = categoryOptions.find((c) => c.value === filters.category)?.label || filters.category;
    activeChips.push({
      id: 'category',
      label: 'Catégorie',
      value: lbl,
      onRemove: () => onFilterChange({ category: 'all', religionSub: 'all_rel' }),
    });
  }
  if (filters.category === 'religion' && filters.religionSub && filters.religionSub !== 'all_rel') {
    const lbl = religionOptions.find((r) => r.value === filters.religionSub)?.label || filters.religionSub;
    activeChips.push({
      id: 'religionSub',
      label: 'Courant',
      value: lbl,
      onRemove: () => onFilterChange({ religionSub: 'all_rel' }),
    });
  }
  if (filters.cycle !== 'all') {
    const lbl = cycleOptions.find((c) => c.value === filters.cycle)?.label || filters.cycle;
    activeChips.push({
      id: 'cycle',
      label: 'Niveau',
      value: lbl,
      onRemove: () => onFilterChange({ cycle: 'all', grade: undefined }),
    });
  }
  if (filters.subject !== 'all') {
    const lbl = subjectOptions.find((s) => s.value === filters.subject)?.label || filters.subject;
    activeChips.push({
      id: 'subject',
      label: 'Matière',
      value: lbl,
      onRemove: () => onFilterChange({ subject: 'all' }),
    });
  }
  if (filters.resourceType !== 'all') {
    const lbl = typeOptions.find((t) => t.value === filters.resourceType)?.label || filters.resourceType;
    activeChips.push({
      id: 'resourceType',
      label: 'Type',
      value: lbl,
      onRemove: () => onFilterChange({ resourceType: 'all' }),
    });
  }
  if (filters.accessLevel !== 'all') {
    const lbl = accessOptions.find((a) => a.value === filters.accessLevel)?.label || filters.accessLevel;
    activeChips.push({
      id: 'accessLevel',
      label: 'Accès',
      value: lbl,
      onRemove: () => onFilterChange({ accessLevel: 'all' }),
    });
  }

  const sections: FilterGlassSection[] = [
    {
      id: 'category',
      title: 'Catégorie',
      options: categoryOptions,
      selectedValue: filters.category,
      onSelect: (val: string) => onFilterChange({ category: val, religionSub: 'all_rel' }),
    },
    ...(filters.category === 'religion'
      ? [
          {
            id: 'religionSub',
            title: 'Tradition & Spiritualité',
            options: religionOptions,
            selectedValue: filters.religionSub || 'all_rel',
            onSelect: (val: string) => onFilterChange({ religionSub: val }),
          },
        ]
      : []),
    {
      id: 'cycle',
      title: 'Niveau scolaire',
      options: cycleOptions,
      selectedValue: filters.cycle,
      onSelect: (val: string) => onFilterChange({ cycle: val as FilterState['cycle'], grade: undefined }),
    },
    {
      id: 'subject',
      title: 'Matière',
      options: subjectOptions,
      selectedValue: filters.subject,
      onSelect: (val: string) => onFilterChange({ subject: val }),
    },
    {
      id: 'resourceType',
      title: 'Format de document',
      options: typeOptions,
      selectedValue: filters.resourceType,
      onSelect: (val: string) => onFilterChange({ resourceType: val }),
    },
    {
      id: 'accessLevel',
      title: 'Accès & Formule',
      options: accessOptions,
      selectedValue: filters.accessLevel,
      onSelect: (val: string) => onFilterChange({ accessLevel: val as FilterState['accessLevel'] }),
    },
  ];

  return (
    <FilterGlassPanel
      isOpen={isOpen}
      onClose={onClose}
      title="Filtres Bibliothèque"
      totalResults={totalResultsCount}
      resultsUnit="ressource"
      resultsUnitPlural="ressources"
      activeCount={activeChips.length}
      activeChips={activeChips}
      sections={sections}
      onResetAll={onResetFilters}
    />
  );
};
