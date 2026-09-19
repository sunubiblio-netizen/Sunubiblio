'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ExerciseType,
  ExerciseLevelId,
  ExerciseDifficulty,
  ExerciseAccessStatus,
  ExerciseFilterQuery,
} from '@/types/exercise';
import {
  EXERCISE_LEVELS,
  EXERCISE_TYPES,
  EXERCISE_DIFFICULTIES,
  EXERCISE_ACCESS_TIERS,
} from '@/data/mockExercises';
import {
  FilterBar,
  FilterOption,
  ActiveFilterItem,
  FilterGlassSection,
  FilterDropdown,
} from '@/components/ui/filters';

interface ExerciseSearchFiltersProps {
  filters: ExerciseFilterQuery;
  onFilterChange: (newFilters: ExerciseFilterQuery) => void;
  subjects: { slug: string; name: string }[];
  competitions: { id: string; name: string }[];
  totalResults: number;
}

export const ExerciseSearchFilters: React.FC<ExerciseSearchFiltersProps> = ({
  filters,
  onFilterChange,
  subjects,
  competitions,
  totalResults,
}) => {
  const [localSearch, setLocalSearch] = useState(filters.searchQuery || '');

  // Synchroniser la recherche locale avec les filtres
  useEffect(() => {
    setLocalSearch(filters.searchQuery || '');
  }, [filters.searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ ...filters, searchQuery: localSearch });
  };

  const handleResetFilters = () => {
    setLocalSearch('');
    onFilterChange({
      searchQuery: '',
      type: 'all',
      level: 'all',
      subject: 'all',
      competition: 'all',
      difficulty: 'all',
      access: 'all',
    });
  };

  // 1. Options pour les filtres
  const typeOptions: FilterOption[] = useMemo(
    () =>
      EXERCISE_TYPES.map((t) => ({
        value: t.id,
        label: t.label,
        badge: t.id === 'qcm' ? 'QCM' : t.id === 'exercice' ? 'Guidé' : t.id === 'correction' ? 'Corrigé' : undefined,
      })),
    []
  );

  const levelOptions: FilterOption[] = useMemo(
    () =>
      EXERCISE_LEVELS.map((l) => ({
        value: l.id,
        label: l.label,
        badge: l.id !== 'all' ? l.label.split(' ')[0] : undefined,
      })),
    []
  );

  const subjectOptions: FilterOption[] = useMemo(() => {
    return [
      { value: 'all', label: 'Toutes les matières' },
      ...subjects.map((s) => ({
        value: s.slug,
        label: s.name,
      })),
    ];
  }, [subjects]);

  const competitionOptions: FilterOption[] = useMemo(() => {
    return [
      { value: 'all', label: 'Tous les concours' },
      ...competitions.map((c) => ({
        value: c.id,
        label: c.name,
        badge: 'Concours',
      })),
    ];
  }, [competitions]);

  const difficultyOptions: FilterOption[] = useMemo(
    () =>
      EXERCISE_DIFFICULTIES.map((d: { id: string; label: string; badge?: string }) => ({
        value: d.id,
        label: d.label,
        badge: d.badge,
      })),
    []
  );

  const accessOptions: FilterOption[] = useMemo(
    () =>
      EXERCISE_ACCESS_TIERS.map((a) => ({
        value: a.id,
        label: a.label,
        badge: a.id === 'premium' ? 'Gold' : a.id === 'gratuit' ? 'Libre' : undefined,
      })),
    []
  );

  // 2. Filtres secondaires (+ Filtres)
  const advancedCount = [
    filters.competition && filters.competition !== 'all',
    filters.difficulty && filters.difficulty !== 'all',
    filters.access && filters.access !== 'all',
  ].filter(Boolean).length;

  // 3. Chips actifs
  const activeChips: ActiveFilterItem[] = useMemo(() => {
    const list: ActiveFilterItem[] = [];

    if (filters.type && filters.type !== 'all') {
      const label = typeOptions.find((o) => o.value === filters.type)?.label || filters.type;
      list.push({
        id: 'type',
        label,
        categoryLabel: 'Type',
        onRemove: () => onFilterChange({ ...filters, type: 'all' }),
      });
    }

    if (filters.level && filters.level !== 'all') {
      const label = levelOptions.find((o) => o.value === filters.level)?.label || filters.level;
      list.push({
        id: 'level',
        label,
        categoryLabel: 'Niveau',
        onRemove: () => onFilterChange({ ...filters, level: 'all' }),
      });
    }

    if (filters.subject && filters.subject !== 'all') {
      const label = subjectOptions.find((o) => o.value === filters.subject)?.label || filters.subject;
      list.push({
        id: 'subject',
        label,
        categoryLabel: 'Matière',
        onRemove: () => onFilterChange({ ...filters, subject: 'all' }),
      });
    }

    if (filters.competition && filters.competition !== 'all') {
      const label = competitionOptions.find((o) => o.value === filters.competition)?.label || filters.competition;
      list.push({
        id: 'competition',
        label,
        categoryLabel: 'Concours',
        onRemove: () => onFilterChange({ ...filters, competition: 'all' }),
      });
    }

    if (filters.difficulty && filters.difficulty !== 'all') {
      const label = difficultyOptions.find((o) => o.value === filters.difficulty)?.label || filters.difficulty;
      list.push({
        id: 'difficulty',
        label,
        categoryLabel: 'Difficulté',
        onRemove: () => onFilterChange({ ...filters, difficulty: 'all' }),
      });
    }

    if (filters.access && filters.access !== 'all') {
      const label = accessOptions.find((o) => o.value === filters.access)?.label || filters.access;
      list.push({
        id: 'access',
        label,
        categoryLabel: 'Accès',
        onRemove: () => onFilterChange({ ...filters, access: 'all' }),
      });
    }

    return list;
  }, [
    filters,
    typeOptions,
    levelOptions,
    subjectOptions,
    competitionOptions,
    difficultyOptions,
    accessOptions,
    onFilterChange,
  ]);

  // 4. Sections pour le Panneau Mobile Glassmorphism
  const mobileSections: FilterGlassSection[] = useMemo(() => {
    return [
      {
        id: 'type',
        title: "Type d'entraînement",
        selectedValue: filters.type || 'all',
        onSelect: (v) => onFilterChange({ ...filters, type: v as ExerciseType | 'all' }),
        options: typeOptions.map((o) => ({ id: o.value, label: o.label, badge: o.badge })),
      },
      {
        id: 'level',
        title: 'Niveau académique',
        selectedValue: filters.level || 'all',
        onSelect: (v) => onFilterChange({ ...filters, level: v as ExerciseLevelId | 'all' }),
        options: levelOptions.map((o) => ({ id: o.value, label: o.label, badge: o.badge })),
      },
      {
        id: 'subject',
        title: 'Matière',
        selectedValue: filters.subject || 'all',
        onSelect: (v) => onFilterChange({ ...filters, subject: v }),
        options: subjectOptions.map((o) => ({ id: o.value, label: o.label })),
      },
      ...(competitions.length > 0
        ? [
            {
              id: 'competition',
              title: 'Concours national',
              selectedValue: filters.competition || 'all',
              onSelect: (v: string) => onFilterChange({ ...filters, competition: v }),
              options: competitionOptions.map((o) => ({ id: o.value, label: o.label, badge: o.badge })),
            },
          ]
        : []),
      {
        id: 'difficulty',
        title: 'Niveau de difficulté',
        selectedValue: filters.difficulty || 'all',
        onSelect: (v) => onFilterChange({ ...filters, difficulty: v as ExerciseDifficulty | 'all' }),
        options: difficultyOptions.map((o) => ({ id: o.value, label: o.label, badge: o.badge })),
      },
      {
        id: 'access',
        title: "Formule d'accès",
        selectedValue: filters.access || 'all',
        onSelect: (v) => onFilterChange({ ...filters, access: v as ExerciseAccessStatus | 'all' }),
        options: accessOptions.map((o) => ({ id: o.value, label: o.label, badge: o.badge })),
      },
    ];
  }, [
    filters,
    typeOptions,
    levelOptions,
    subjectOptions,
    competitionOptions,
    difficultyOptions,
    accessOptions,
    competitions,
    onFilterChange,
  ]);

  return (
    <div className="exercise-filters-container">
      {/* 1. BARRE DE RECHERCHE PRINCIPALE */}
      <form onSubmit={handleSearchSubmit} className="exercise-search-bar">
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
            placeholder="Rechercher un exercice, une matière, un chapitre, un concours..."
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              onFilterChange({ ...filters, searchQuery: e.target.value });
            }}
            className="exercise-search-input"
          />
          {localSearch && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => {
                setLocalSearch('');
                onFilterChange({ ...filters, searchQuery: '' });
              }}
              title="Effacer la recherche"
            >
              ✕
            </button>
          )}
        </div>
      </form>

      {/* 2. SYSTÈME UNIFIÉ DE FILTRES COMPACTS */}
      <FilterBar
        mainFilters={[
          {
            id: 'exo-type',
            label: 'Type',
            value: filters.type || 'all',
            options: typeOptions,
            onChange: (v) => onFilterChange({ ...filters, type: v as ExerciseType | 'all' }),
            placeholder: 'Tous les types',
          },
          {
            id: 'exo-level',
            label: 'Niveau',
            value: filters.level || 'all',
            options: levelOptions,
            onChange: (v) => onFilterChange({ ...filters, level: v as ExerciseLevelId | 'all' }),
            placeholder: 'Tous les niveaux',
          },
          {
            id: 'exo-subject',
            label: 'Matière',
            value: filters.subject || 'all',
            options: subjectOptions,
            onChange: (v) => onFilterChange({ ...filters, subject: v }),
            placeholder: 'Toutes les matières',
            enableSearch: subjects.length > 5,
            searchPlaceholder: 'Filtrer les matières...',
          },
        ]}
        advancedFiltersContent={
          <div className="secondary-filters-cluster">
            {competitions.length > 0 && (
              <FilterDropdown
                id="exo-competition"
                label="Concours"
                value={filters.competition || 'all'}
                options={competitionOptions}
                onChange={(v) => onFilterChange({ ...filters, competition: v })}
                placeholder="Concours"
                enableSearch={competitions.length > 5}
              />
            )}
            <FilterDropdown
              id="exo-diff"
              label="Difficulté"
              value={filters.difficulty || 'all'}
              options={difficultyOptions}
              onChange={(v) => onFilterChange({ ...filters, difficulty: v as ExerciseDifficulty | 'all' })}
              placeholder="Difficulté"
            />
            <FilterDropdown
              id="exo-access"
              label="Accès"
              value={filters.access || 'all'}
              options={accessOptions}
              onChange={(v) => onFilterChange({ ...filters, access: v as ExerciseAccessStatus | 'all' })}
              placeholder="Accès"
            />
          </div>
        }
        advancedActiveCount={advancedCount}
        totalResults={totalResults}
        resultsLabel={totalResults <= 1 ? 'exercice disponible' : 'exercices disponibles'}
        activeChips={activeChips}
        onResetAll={activeChips.length > 0 ? handleResetFilters : undefined}
        mobileSections={mobileSections}
        mobileTitle="Filtres exercices"
      />

      <style jsx>{`
        .exercise-filters-container {
          margin-bottom: 24px;
        }

        .exercise-search-bar {
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

        .exercise-search-input {
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

        .exercise-search-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
        }

        .search-clear-btn {
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

        .search-clear-btn:hover {
          background: #ef4444;
          color: #ffffff;
        }

        .secondary-filters-cluster {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
};
