'use client';

import React from 'react';
import {
  EDUCATION_SUBJECTS,
  UNIVERSITY_SUBJECT_GROUPS,
  EDUCATION_RESOURCE_TYPES,
  EDUCATION_YEARS,
  LEVEL_GRADES_MAP,
} from '@/data/educationData';
import {
  EducationFilterState,
  EducationCycleId,
  EducationResourceType,
} from '@/types/education';
import {
  FilterBar,
  FilterOption,
  ActiveFilterItem,
  FilterGlassSection,
} from '@/components/ui/filters';

interface EducationSearchFilterProps {
  filters: EducationFilterState;
  onFilterChange: (newFilters: Partial<EducationFilterState>) => void;
  onResetFilters: () => void;
  totalResultsCount: number;
}



export const EducationSearchFilter: React.FC<EducationSearchFilterProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResultsCount,
}) => {


  const currentGradeOptions =
    filters.level !== 'all' && LEVEL_GRADES_MAP[filters.level]
      ? LEVEL_GRADES_MAP[filters.level]
      : [];

  const levelOptions: FilterOption[] = [
    {
      value: 'all',
      label: 'Tous les niveaux',
      description: 'Maternelle, Primaire, Collège, Lycée, Université, Formations',
      badge: 'Tout',
      icon: '🌐',
    },
    {
      value: 'prescolaire',
      label: 'Préscolaire',
      description: 'Petite, Moyenne & Grande section (Éveil)',
      badge: 'Éveil',
      icon: '🎒',
    },
    {
      value: 'primaire',
      label: 'Primaire',
      description: 'Du CI au CM2 • Préparation CFEE & Entrée en 6e',
      badge: 'Fondamental',
      icon: '📚',
    },
    {
      value: 'college',
      label: 'Collège',
      description: 'De la 6e à la 3e • Préparation BFEM',
      badge: 'Moyen',
      icon: '🏫',
    },
    {
      value: 'lycee',
      label: 'Lycée',
      description: 'Seconde, Première & Terminale • Séries S, L, G, T',
      badge: 'Secondaire',
      icon: '🎓',
    },
    {
      value: 'universite',
      label: 'Université',
      description: 'Licence 1, 2, 3 • Master • Doctorat & Recherche',
      badge: 'Supérieur',
      icon: '🏛️',
    },
    {
      value: 'formation_pro',
      label: 'Formation Pro',
      description: 'CAP, BEP, BTS & Métiers techniques',
      badge: 'Pratique',
      icon: '🛠️',
    },
  ];

  const gradeOptions: FilterOption[] = currentGradeOptions.map((g) => ({
    value: g.id,
    label: g.label,
    description: g.id === 'all'
      ? (filters.level === 'universite' ? 'Tous les cycles (LMD)' : 'Toutes les classes')
      : 'Classe ou série d’enseignement',
    icon: '📌',
    badge: g.short,
  }));

  const subjectOptions: FilterOption[] = [
    {
      value: 'all',
      label: filters.level === 'universite' ? 'Toutes les matières univ.' : 'Toutes les matières',
      description: 'Explorer toutes les disciplines confondues',
      icon: '📚',
    },
    ...(filters.level === 'universite'
      ? UNIVERSITY_SUBJECT_GROUPS.flatMap((grp) =>
          grp.subjects.map((sub) => ({
            value: sub.slug,
            label: sub.name,
            description: `Discipline • ${grp.groupName}`,
            icon: '📖',
          }))
        )
      : EDUCATION_SUBJECTS.map((sub) => ({
          value: sub.slug,
          label: sub.name,
          description: sub.description,
          icon: '📖',
        }))),
  ];

  const typeOptions: FilterOption[] = [
    {
      value: 'all',
      label: 'Tous les types',
      description: 'Cours, exercices, annales et synthèses',
      icon: '📁',
    },
    ...EDUCATION_RESOURCE_TYPES.map((t) => ({
      value: t.id,
      label: t.label,
      description: `Supports classés en ${t.label.toLowerCase()}`,
      icon: t.id === 'cours' ? '📘' : t.id === 'exercice' ? '📝' : t.id === 'revision' ? '📑' : t.id === 'annale' ? '🏛️' : '📚',
    })),
  ];

  const yearOptions: FilterOption[] = [
    {
      value: 'all',
      label: 'Toutes les années',
      description: 'Toutes les sessions d’épreuves confondues',
      icon: '📅',
    },
    ...EDUCATION_YEARS.filter((y) => y !== 'all').map((y) => ({
      value: y,
      label: `Session ${y}`,
      description: y === '2024' ? 'Épreuves et cours de l’année en cours' : `Archives de la session ${y}`,
      icon: y === '2024' ? '🌟' : '🗓️',
      badge: y === '2024' ? 'Actuelle' : undefined,
    })),
  ];

  const primaryFilters = [
    {
      id: 'level',
      label: 'Niveau',
      value: filters.level,
      options: levelOptions,
      onChange: (val: string) =>
        onFilterChange({
          level: val as EducationCycleId | 'all',
          grade: 'all',
          subject: 'all',
        }),
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
    },
    ...(currentGradeOptions.length > 0
      ? [
          {
            id: 'grade',
            label: filters.level === 'universite' ? 'Cycle' : 'Classe',
            value: filters.grade || 'all',
            options: gradeOptions,
            onChange: (val: string) => onFilterChange({ grade: val }),
            accent: true,
          },
        ]
      : []),
    {
      id: 'subject',
      label: 'Matière',
      value: filters.subject,
      options: subjectOptions,
      onChange: (val: string) => onFilterChange({ subject: val }),
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
    },
    {
      id: 'type',
      label: 'Type',
      value: filters.type,
      options: typeOptions,
      onChange: (val: string) => onFilterChange({ type: val as EducationResourceType | 'all' }),
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      ),
    },
  ];

  const secondaryFilters = [
    {
      id: 'year',
      label: 'Session',
      value: filters.year,
      options: yearOptions,
      onChange: (val: string) => onFilterChange({ year: val }),
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

  const activeFilterChips: ActiveFilterItem[] = [];
  if (filters.level !== 'all') {
    const lbl = levelOptions.find((o) => o.value === filters.level)?.label || filters.level;
    activeFilterChips.push({
      id: 'level',
      label: 'Niveau',
      value: lbl,
      onRemove: () => onFilterChange({ level: 'all', grade: 'all' }),
    });
  }
  if (filters.grade && filters.grade !== 'all') {
    activeFilterChips.push({
      id: 'grade',
      label: filters.level === 'universite' ? 'Cycle' : 'Classe',
      value: filters.grade,
      onRemove: () => onFilterChange({ grade: 'all' }),
    });
  }
  if (filters.subject !== 'all') {
    const lbl = subjectOptions.find((o) => o.value === filters.subject)?.label || filters.subject;
    activeFilterChips.push({
      id: 'subject',
      label: 'Matière',
      value: lbl,
      onRemove: () => onFilterChange({ subject: 'all' }),
    });
  }
  if (filters.type !== 'all') {
    const lbl = typeOptions.find((o) => o.value === filters.type)?.label || filters.type;
    activeFilterChips.push({
      id: 'type',
      label: 'Type',
      value: lbl,
      onRemove: () => onFilterChange({ type: 'all' }),
    });
  }
  if (filters.year !== 'all') {
    activeFilterChips.push({
      id: 'year',
      label: 'Session',
      value: filters.year,
      onRemove: () => onFilterChange({ year: 'all' }),
    });
  }

  const mobileSections: FilterGlassSection[] = [
    {
      id: 'level',
      title: "Niveau d'études",
      options: levelOptions,
      selectedValue: filters.level,
      onSelect: (val: string) =>
        onFilterChange({
          level: val as EducationCycleId | 'all',
          grade: 'all',
          subject: 'all',
        }),
    },
    ...(currentGradeOptions.length > 0
      ? [
          {
            id: 'grade',
            title: filters.level === 'universite' ? 'Cycle / Année (LMD)' : 'Classe / Filière',
            options: gradeOptions,
            selectedValue: filters.grade || 'all',
            onSelect: (val: string) => onFilterChange({ grade: val }),
          },
        ]
      : []),
    {
      id: 'subject',
      title: 'Matière',
      options: subjectOptions,
      selectedValue: filters.subject,
      onSelect: (val: string) => onFilterChange({ subject: val }),
    },
    {
      id: 'type',
      title: 'Type de ressource',
      options: typeOptions,
      selectedValue: filters.type,
      onSelect: (val: string) => onFilterChange({ type: val as EducationResourceType | 'all' }),
    },
    {
      id: 'year',
      title: 'Année / Session',
      options: yearOptions,
      selectedValue: filters.year,
      onSelect: (val: string) => onFilterChange({ year: val }),
    },
  ];

  return (
    <div className="education-filter-container" id="recherche-ressources">
      <FilterBar
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => onFilterChange({ searchQuery: q })}
        searchPlaceholder="Rechercher par titre, niveau (ex : Licence, Master, Terminale S, BFEM)..."
        primaryFilters={primaryFilters}
        secondaryFilters={secondaryFilters}
        activeChips={activeFilterChips}
        onResetAll={onResetFilters}
        totalResults={totalResultsCount}
        resultsUnit="ressource éducative"
        resultsUnitPlural="ressources éducatives"
        mobileSections={mobileSections}
        mobileDrawerTitle="Filtres Éducation"
      />

      <style jsx>{`
        .education-filter-container {
          width: 100%;
          max-width: 1080px;
          margin: 0 auto 32px;
        }
      `}</style>
    </div>
  );
};
