'use client';

import React, { useMemo } from 'react';
import {
  FilterDropdown,
  FilterOption,
  SortFilterDropdown,
  SortItem,
  AdvancedFiltersPanel,
  ActiveFilterChips,
  ActiveFilterItem,
} from '@/components/ui/filters';
import { ProfessorFilterState, ProfessorSortOption } from '@/types/professor';
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

interface ProfessorFiltersBarProps {
  filters: ProfessorFilterState;
  onFilterChange: (patch: Partial<ProfessorFilterState>) => void;
  onResetFilters: () => void;
  onOpenMobileFilters: () => void;
  totalResults: number;
}

const SORT_OPTIONS: SortItem<ProfessorSortOption>[] = [
  { value: 'pertinence', label: 'Pertinence' },
  { value: 'availability', label: 'Disponibilité' },
  { value: 'rating_desc', label: 'Avis & Notes (★)' },
  { value: 'experience_desc', label: 'Expérience (+)' },
  { value: 'price_asc', label: 'Prix : Moins cher' },
  { value: 'price_desc', label: 'Prix : Plus élevé' },
];

export const ProfessorFiltersBar: React.FC<ProfessorFiltersBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  onOpenMobileFilters,
  totalResults,
}) => {
  // 1. Options pour les filtres principaux
  const subjectOptions: FilterOption[] = useMemo(
    () =>
      PROFESSOR_SUBJECTS.map((s) => ({
        value: s === 'Toutes les matières' ? 'all' : s,
        label: s,
      })),
    []
  );

  const levelOptions: FilterOption[] = useMemo(
    () =>
      PROFESSOR_LEVELS.map((l) => ({
        value: l.id,
        label: l.label,
      })),
    []
  );

  const modeOptions: FilterOption[] = useMemo(
    () =>
      PROFESSOR_TEACHING_MODES.map((m) => ({
        value: m.id,
        label: m.label,
      })),
    []
  );

  // Zone regroupe pays & villes
  const zoneOptions: FilterOption[] = useMemo(() => {
    const pays: FilterOption[] = PROFESSOR_COUNTRIES.map((c) => ({
      value: `country:${c === 'Tous les pays' ? 'all' : c}`,
      label: c,
      subtitle: 'Pays',
    }));
    const villes: FilterOption[] = PROFESSOR_CITIES.filter(
      (v) => v !== 'Toutes les villes'
    ).map((v) => ({
      value: `city:${v}`,
      label: v,
      subtitle: 'Ville',
    }));
    return [
      { value: 'all', label: 'Toutes les zones' },
      ...pays.filter((p) => p.value !== 'country:all'),
      ...villes,
    ];
  }, []);

  const currentZoneValue = useMemo(() => {
    if (filters.city && filters.city !== 'all') {
      return `city:${filters.city}`;
    }
    if (filters.country && filters.country !== 'all') {
      return `country:${filters.country}`;
    }
    return 'all';
  }, [filters.city, filters.country]);

  const handleZoneChange = (val: string) => {
    if (val === 'all') {
      onFilterChange({ country: 'all', city: 'all' });
    } else if (val.startsWith('country:')) {
      const c = val.replace('country:', '');
      onFilterChange({ country: c, city: 'all' });
    } else if (val.startsWith('city:')) {
      const ct = val.replace('city:', '');
      onFilterChange({ city: ct });
    }
  };

  // Langues pour les filtres avancés
  const languageList = useMemo(
    () => ['Toutes les langues', 'Français', 'Wolof', 'Anglais', 'Arabe'],
    []
  );

  // 2. Compter les filtres avancés actifs (+ Filtres)
  const advancedActiveCount = useMemo(() => {
    return [
      filters.priceRange !== 'all',
      filters.availability !== 'all',
      filters.language !== 'all',
      filters.minExperience !== 'all',
    ].filter(Boolean).length;
  }, [filters.priceRange, filters.availability, filters.language, filters.minExperience]);

  // Nombre total de filtres actifs
  const totalActiveFiltersCount = useMemo(() => {
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

  // 3. Liste des chips actifs supprimables
  const activeChips: ActiveFilterItem[] = useMemo(() => {
    const list: ActiveFilterItem[] = [];

    if (filters.subject !== 'all') {
      list.push({
        id: 'subject',
        label: filters.subject,
        categoryLabel: 'Matière',
        onRemove: () => onFilterChange({ subject: 'all' }),
      });
    }

    if (filters.level !== 'all') {
      const lvlLabel = PROFESSOR_LEVELS.find((l) => l.id === filters.level)?.label || filters.level;
      list.push({
        id: 'level',
        label: lvlLabel,
        categoryLabel: 'Niveau',
        onRemove: () => onFilterChange({ level: 'all' }),
      });
    }

    if (filters.mode !== 'all') {
      const modeLabel = PROFESSOR_TEACHING_MODES.find((m) => m.id === filters.mode)?.label || filters.mode;
      list.push({
        id: 'mode',
        label: modeLabel,
        categoryLabel: 'Mode',
        onRemove: () => onFilterChange({ mode: 'all' }),
      });
    }

    if (filters.city !== 'all') {
      list.push({
        id: 'city',
        label: filters.city,
        categoryLabel: 'Ville',
        onRemove: () => onFilterChange({ city: 'all' }),
      });
    } else if (filters.country !== 'all') {
      list.push({
        id: 'country',
        label: filters.country,
        categoryLabel: 'Pays',
        onRemove: () => onFilterChange({ country: 'all' }),
      });
    }

    if (filters.priceRange !== 'all') {
      const priceLabel = PROFESSOR_PRICE_RANGES.find((p) => p.id === filters.priceRange)?.label || filters.priceRange;
      list.push({
        id: 'price',
        label: priceLabel,
        categoryLabel: 'Tarif',
        onRemove: () => onFilterChange({ priceRange: 'all' }),
      });
    }

    if (filters.availability !== 'all') {
      const availLabel = PROFESSOR_AVAILABILITIES.find((a) => a.id === filters.availability)?.label || filters.availability;
      list.push({
        id: 'avail',
        label: availLabel,
        categoryLabel: 'Dispo',
        onRemove: () => onFilterChange({ availability: 'all' }),
      });
    }

    if (filters.minExperience !== 'all') {
      const expLabel = PROFESSOR_EXPERIENCE_OPTIONS.find((e) => e.id === filters.minExperience)?.label || `${filters.minExperience} ans`;
      list.push({
        id: 'exp',
        label: expLabel,
        categoryLabel: 'Exp.',
        onRemove: () => onFilterChange({ minExperience: 'all' }),
      });
    }

    if (filters.language !== 'all') {
      list.push({
        id: 'lang',
        label: filters.language,
        categoryLabel: 'Langue',
        onRemove: () => onFilterChange({ language: 'all' }),
      });
    }

    return list;
  }, [filters, onFilterChange]);

  return (
    <div className="sunu-compact-filters-wrapper">
      {/* ── DESKTOP BAR (Filter Chips) ── */}
      <div className="filters-desktop-bar">
        <div className="filters-chips-left">
          {/* Matière */}
          <FilterDropdown
            id="filter-chip-subject"
            label="Matière"
            value={filters.subject}
            options={subjectOptions}
            onChange={(val) => onFilterChange({ subject: val })}
            enableSearch
            searchPlaceholder="Rechercher une matière..."
          />

          {/* Niveau */}
          <FilterDropdown
            id="filter-chip-level"
            label="Niveau"
            value={filters.level}
            options={levelOptions}
            onChange={(val) => onFilterChange({ level: val })}
          />

          {/* Mode */}
          <FilterDropdown
            id="filter-chip-mode"
            label="Mode"
            value={filters.mode}
            options={modeOptions}
            onChange={(val) => onFilterChange({ mode: val })}
          />

          {/* Zone (Pays / Ville) */}
          <FilterDropdown
            id="filter-chip-zone"
            label="Zone"
            value={currentZoneValue}
            options={zoneOptions}
            onChange={handleZoneChange}
            enableSearch
            searchPlaceholder="Chercher un pays ou ville..."
          />

          {/* + Filtres (Tarif, Disponibilité, Langue, Expérience) */}
          <AdvancedFiltersPanel
            values={{
              priceRange: filters.priceRange,
              availability: filters.availability,
              language: filters.language,
              minExperience: filters.minExperience,
            }}
            onChange={onFilterChange}
            onReset={() =>
              onFilterChange({
                priceRange: 'all',
                availability: 'all',
                language: 'all',
                minExperience: 'all',
              })
            }
            priceOptions={PROFESSOR_PRICE_RANGES}
            availabilityOptions={PROFESSOR_AVAILABILITIES}
            languageOptions={languageList}
            experienceOptions={PROFESSOR_EXPERIENCE_OPTIONS}
            activeCount={advancedActiveCount}
          />
        </div>

        {/* Trier */}
        <div className="filters-chips-right">
          <SortFilterDropdown
            value={filters.sort}
            onChange={(s) => onFilterChange({ sort: s })}
            options={SORT_OPTIONS}
            align="right"
          />
        </div>
      </div>

      {/* ── MOBILE BAR (Compact [Filtres] [Trier]) ── */}
      <div className="filters-mobile-compact-bar">
        <button
          type="button"
          className={`mobile-filter-trigger-btn ${totalActiveFiltersCount > 0 ? 'has-active' : ''}`}
          onClick={onOpenMobileFilters}
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
          {totalActiveFiltersCount > 0 && (
            <span className="mobile-active-pill">{totalActiveFiltersCount}</span>
          )}
        </button>

        <SortFilterDropdown
          value={filters.sort}
          onChange={(s) => onFilterChange({ sort: s })}
          options={SORT_OPTIONS}
          align="right"
        />
      </div>

      {/* ── STATUS ROW (Nombre de résultats & Reset global) ── */}
      <div className="filters-meta-row">
        <div className="results-badge">
          <span className="results-num">{totalResults}</span>
          <span className="results-label">
            {totalResults > 1 ? 'professeurs trouvés' : 'professeur trouvé'}
          </span>
        </div>

        {totalActiveFiltersCount > 0 && (
          <button
            type="button"
            className="reset-all-text-btn"
            onClick={onResetFilters}
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* ── REMOVABLE CHIPS (Filtres actifs) ── */}
      <ActiveFilterChips
        items={activeChips}
        onResetAll={totalActiveFiltersCount > 1 ? onResetFilters : undefined}
      />

      <style jsx>{`
        .sunu-compact-filters-wrapper {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.85);
          border-radius: 18px;
          padding: 14px 18px;
          box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.04);
          margin-bottom: 24px;
        }

        /* Barre Desktop */
        .filters-desktop-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .filters-chips-left {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filters-chips-right {
          display: flex;
          align-items: center;
        }

        /* Barre Mobile */
        .filters-mobile-compact-bar {
          display: none;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .mobile-filter-trigger-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          height: 38px;
          padding: 0 14px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .mobile-filter-trigger-btn.has-active {
          background: #eef2ff;
          border-color: #6366f1;
          color: #4338ca;
        }

        .mobile-active-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          background: #4f46e5;
          color: #ffffff;
          border-radius: 9999px;
          font-size: 10px;
          font-weight: 700;
        }

        /* Barre de statut résultats */
        .filters-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          margin-top: 10px;
          border-top: 1px solid #f8fafc;
        }

        .results-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .results-num {
          font-size: 12px;
          font-weight: 700;
          color: #4f46e5;
          background: #eef2ff;
          padding: 2px 7px;
          border-radius: 6px;
        }

        .results-label {
          font-size: 12.5px;
          font-weight: 500;
          color: #64748b;
        }

        .reset-all-text-btn {
          background: transparent;
          border: none;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          padding: 3px 6px;
          border-radius: 4px;
          transition: color 0.12s ease;
        }

        .reset-all-text-btn:hover {
          color: #ef4444;
          text-decoration: underline;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .filters-desktop-bar {
            display: none;
          }

          .filters-mobile-compact-bar {
            display: flex;
          }
        }
      `}</style>
    </div>
  );
};
