'use client';

import React, { useMemo } from 'react';
import {
  FilterGlassPanel,
  FilterGlassSection,
} from '@/components/ui/filters';
import { ProfessorFilterState } from '@/types/professor';
import {
  PROFESSOR_SUBJECTS,
  PROFESSOR_LEVELS,
  PROFESSOR_COUNTRIES,
  PROFESSOR_CITIES,
  PROFESSOR_TEACHING_MODES,
  PROFESSOR_PRICE_RANGES,
  PROFESSOR_AVAILABILITIES,
  PROFESSOR_EXPERIENCE_OPTIONS,
} from '@/data/mockProfessors';

interface MobileProfessorFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ProfessorFilterState;
  onFilterChange: (patch: Partial<ProfessorFilterState>) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export const MobileProfessorFilterDrawer: React.FC<MobileProfessorFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
}) => {
  // Sections courtes et repliables pour la Bottom Sheet mobile
  const sections: FilterGlassSection[] = useMemo(() => {
    return [
      {
        id: 'subject',
        title: 'Matière',
        currentValueLabel: filters.subject === 'all' ? 'Toutes' : filters.subject,
        defaultOpen: true,
        selectedValue: filters.subject,
        onSelect: (val: string) => onFilterChange({ subject: val }),
        options: PROFESSOR_SUBJECTS.map((s) => ({
          id: s === 'Toutes les matières' ? 'all' : s,
          label: s,
        })),
      },
      {
        id: 'level',
        title: 'Niveau académique',
        currentValueLabel:
          PROFESSOR_LEVELS.find((l) => l.id === filters.level)?.label || 'Tous',
        options: PROFESSOR_LEVELS.map((l) => ({
          id: l.id,
          label: l.label,
        })),
        selectedValue: filters.level,
        onSelect: (val: string) => onFilterChange({ level: val }),
      },
      {
        id: 'mode',
        title: "Mode d'apprentissage",
        currentValueLabel:
          PROFESSOR_TEACHING_MODES.find((m) => m.id === filters.mode)?.label || 'Tous',
        options: PROFESSOR_TEACHING_MODES.map((m) => ({
          id: m.id,
          label: m.label,
        })),
        selectedValue: filters.mode,
        onSelect: (val: string) => onFilterChange({ mode: val }),
      },
      {
        id: 'country',
        title: 'Pays',
        currentValueLabel:
          filters.country === 'all' ? 'Tous les pays' : filters.country,
        options: PROFESSOR_COUNTRIES.map((c) => ({
          id: c === 'Tous les pays' ? 'all' : c,
          label: c,
        })),
        selectedValue: filters.country,
        onSelect: (val: string) => onFilterChange({ country: val }),
      },
      {
        id: 'city',
        title: 'Ville / Zone',
        currentValueLabel:
          filters.city === 'all' ? 'Toutes les villes' : filters.city,
        options: PROFESSOR_CITIES.map((c) => ({
          id: c === 'Toutes les villes' ? 'all' : c,
          label: c,
        })),
        selectedValue: filters.city,
        onSelect: (val: string) => onFilterChange({ city: val }),
      },
      {
        id: 'price',
        title: 'Tarif horaire',
        currentValueLabel:
          PROFESSOR_PRICE_RANGES.find((p) => p.id === filters.priceRange)?.label || 'Tous',
        options: PROFESSOR_PRICE_RANGES.map((p) => ({
          id: p.id,
          label: p.label,
        })),
        selectedValue: filters.priceRange,
        onSelect: (val: string) => onFilterChange({ priceRange: val }),
      },
      {
        id: 'availability',
        title: 'Disponibilité',
        currentValueLabel:
          PROFESSOR_AVAILABILITIES.find((a) => a.id === filters.availability)?.label || 'Toutes',
        options: PROFESSOR_AVAILABILITIES.map((a) => ({
          id: a.id,
          label: a.label,
        })),
        selectedValue: filters.availability,
        onSelect: (val: string) => onFilterChange({ availability: val }),
      },
      {
        id: 'experience',
        title: 'Expérience minimale',
        currentValueLabel:
          PROFESSOR_EXPERIENCE_OPTIONS.find((e) => e.id === filters.minExperience)?.label || 'Toutes',
        options: PROFESSOR_EXPERIENCE_OPTIONS.map((e) => ({
          id: e.id,
          label: e.label,
        })),
        selectedValue: filters.minExperience,
        onSelect: (val: string) => onFilterChange({ minExperience: val }),
      },
    ];
  }, [filters, onFilterChange]);

  // Chips actifs affichés dans le Bottom Sheet
  const activeChips = useMemo(() => {
    const list = [];
    if (filters.subject !== 'all') {
      list.push({
        id: 'subject',
        label: filters.subject,
        onRemove: () => onFilterChange({ subject: 'all' }),
      });
    }
    if (filters.level !== 'all') {
      const lvlLabel = PROFESSOR_LEVELS.find((l) => l.id === filters.level)?.label || filters.level;
      list.push({
        id: 'level',
        label: lvlLabel,
        onRemove: () => onFilterChange({ level: 'all' }),
      });
    }
    if (filters.mode !== 'all') {
      const modeLabel = PROFESSOR_TEACHING_MODES.find((m) => m.id === filters.mode)?.label || filters.mode;
      list.push({
        id: 'mode',
        label: modeLabel,
        onRemove: () => onFilterChange({ mode: 'all' }),
      });
    }
    if (filters.country !== 'all') {
      list.push({
        id: 'country',
        label: filters.country,
        onRemove: () => onFilterChange({ country: 'all' }),
      });
    }
    if (filters.city !== 'all') {
      list.push({
        id: 'city',
        label: filters.city,
        onRemove: () => onFilterChange({ city: 'all' }),
      });
    }
    if (filters.priceRange !== 'all') {
      const pLabel = PROFESSOR_PRICE_RANGES.find((p) => p.id === filters.priceRange)?.label || filters.priceRange;
      list.push({
        id: 'price',
        label: pLabel,
        onRemove: () => onFilterChange({ priceRange: 'all' }),
      });
    }
    return list;
  }, [filters, onFilterChange]);

  const activeCount = useMemo(() => {
    return [
      filters.subject !== 'all',
      filters.level !== 'all',
      filters.country !== 'all',
      filters.city !== 'all',
      filters.mode !== 'all',
      filters.priceRange !== 'all',
      filters.availability !== 'all',
      filters.language !== 'all',
      filters.minExperience !== 'all',
    ].filter(Boolean).length;
  }, [filters]);

  return (
    <FilterGlassPanel
      isOpen={isOpen}
      onClose={onClose}
      sections={sections}
      onReset={onResetFilters}
      totalResults={totalResults}
      activeCount={activeCount}
      activeChips={activeChips}
      title="Filtres professeurs"
    />
  );
};
