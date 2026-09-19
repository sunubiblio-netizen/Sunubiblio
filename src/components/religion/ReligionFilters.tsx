'use client';

import React, { useMemo } from 'react';
import {
  ReligionFilterState,
  ReligionTradition,
  ReligionBranch,
  ReligionResourceType,
  ReligionTraditionId,
  ReligionBranchId,
  ReligionPlanRequired,
} from '@/types/religion';
import { RELIGION_CONTENT_TYPES, INITIAL_RELIGION_RESOURCES } from '@/data/mockReligion';
import {
  FilterBar,
  FilterOption,
  SortItem,
  ActiveFilterItem,
  FilterGlassSection,
  FilterDropdown,
} from '@/components/ui/filters';

const RELIGION_ACCESS_PLANS: { key: ReligionPlanRequired; label: string; dotColor: string }[] = [
  { key: 'gratuit', label: 'Gratuit', dotColor: '#10b981' },
  { key: 'simple', label: 'Simple', dotColor: '#3b82f6' },
  { key: 'recommande', label: 'Recommandé', dotColor: '#6366f1' },
  { key: 'gold', label: 'Gold', dotColor: '#f59e0b' },
];

interface ReligionFiltersProps {
  filters: ReligionFilterState;
  traditions: ReligionTradition[];
  branches: ReligionBranch[];
  onFilterChange: (newFilters: Partial<ReligionFilterState>) => void;
  onResetFilters: () => void;
  onOpenMobileDrawer?: () => void;
  activeFiltersCount?: number;
}

export const ReligionFilters: React.FC<ReligionFiltersProps> = ({
  filters,
  traditions,
  branches,
  onFilterChange,
  onResetFilters,
}) => {
  const availableBranches = useMemo(() => {
    if (filters.traditionId !== 'all') {
      return branches.filter((b) => b.traditionId === filters.traditionId);
    }
    return branches;
  }, [branches, filters.traditionId]);

  const availableAuthors = useMemo(() => {
    const set = new Set(INITIAL_RELIGION_RESOURCES.map((r) => r.auteur));
    return Array.from(set).sort();
  }, []);

  const traditionOptions: FilterOption[] = useMemo(() => {
    return [
      { value: 'all', label: 'Toutes les traditions' },
      ...traditions.map((t) => ({
        value: t.id,
        label: t.title,
        badge: t.badge,
      })),
    ];
  }, [traditions]);

  const branchOptions: FilterOption[] = useMemo(() => {
    return [
      { value: 'all', label: 'Tous les courants & confréries' },
      ...availableBranches.map((b) => ({
        value: b.id,
        label: b.title,
        badge: b.subtitle,
      })),
    ];
  }, [availableBranches]);

  const typeOptions: FilterOption[] = useMemo(() => {
    return [
      { value: 'all', label: 'Tous les types de contenus' },
      ...RELIGION_CONTENT_TYPES.map((t) => ({
        value: t.id,
        label: t.label,
      })),
    ];
  }, []);

  const authorOptions: FilterOption[] = useMemo(() => {
    return [
      { value: 'all', label: 'Tous les auteurs et maîtres' },
      ...availableAuthors.map((author) => ({
        value: author,
        label: author,
      })),
    ];
  }, [availableAuthors]);

  const epochOptions: FilterOption[] = useMemo(() => {
    return [
      { value: 'all', label: 'Toutes les époques' },
      { value: 'xvii', label: 'XVIIe siècle' },
      { value: 'xviii', label: 'XVIIIe siècle' },
      { value: 'xix', label: 'XIXe siècle (Fondations majeures)' },
      { value: 'xx', label: 'XXe siècle (Expansion & Écrits)' },
      { value: 'xxi', label: 'XXIe siècle (Contemporain)' },
    ];
  }, []);

  const planOptions: FilterOption[] = useMemo(() => {
    return [
      { value: 'all', label: 'Tous les accès' },
      ...RELIGION_ACCESS_PLANS.map((p) => ({
        value: p.key,
        label: p.label,
      })),
    ];
  }, []);

  const sortOptions: SortItem<ReligionFilterState['sortBy']>[] = useMemo(() => {
    return [
      { value: 'pertinence', label: 'Pertinence' },
      { value: 'recent', label: 'Plus récents' },
      { value: 'titre', label: 'Titre alphabétique' },
      { value: 'auteur', label: 'Par auteur' },
    ];
  }, []);

  // Chips actifs supprimables
  const activeChips: ActiveFilterItem[] = useMemo(() => {
    const list: ActiveFilterItem[] = [];

    if (filters.traditionId !== 'all') {
      const label = traditions.find((t) => t.id === filters.traditionId)?.title || filters.traditionId;
      list.push({
        id: 'trad',
        label,
        categoryLabel: 'Tradition',
        onRemove: () => onFilterChange({ traditionId: 'all', branchId: 'all', page: 1 }),
      });
    }

    if (filters.branchId !== 'all') {
      const label = branches.find((b) => b.id === filters.branchId)?.title || filters.branchId;
      list.push({
        id: 'branch',
        label,
        categoryLabel: 'Courant',
        onRemove: () => onFilterChange({ branchId: 'all', page: 1 }),
      });
    }

    if (filters.contentType !== 'all') {
      const label = RELIGION_CONTENT_TYPES.find((t) => t.id === filters.contentType)?.label || filters.contentType;
      list.push({
        id: 'type',
        label,
        categoryLabel: 'Type',
        onRemove: () => onFilterChange({ contentType: 'all', page: 1 }),
      });
    }

    if (filters.author !== 'all') {
      list.push({
        id: 'author',
        label: filters.author,
        categoryLabel: 'Auteur',
        onRemove: () => onFilterChange({ author: 'all', page: 1 }),
      });
    }

    if (filters.year !== 'all') {
      const label = epochOptions.find((e) => e.value === filters.year)?.label || filters.year;
      list.push({
        id: 'epoch',
        label,
        categoryLabel: 'Époque',
        onRemove: () => onFilterChange({ year: 'all', page: 1 }),
      });
    }

    if (filters.requiredPlan !== 'all') {
      const label = RELIGION_ACCESS_PLANS.find((p) => p.key === filters.requiredPlan)?.label || filters.requiredPlan;
      list.push({
        id: 'plan',
        label,
        categoryLabel: 'Accès',
        onRemove: () => onFilterChange({ requiredPlan: 'all', page: 1 }),
      });
    }

    return list;
  }, [filters, traditions, branches, epochOptions, onFilterChange]);

  // Sections pour le panneau mobile glassmorphism
  const mobileSections: FilterGlassSection[] = useMemo(() => {
    return [
      {
        id: 'tradition',
        title: 'Traditions spirituelles',
        selectedValue: filters.traditionId,
        onSelect: (val) => onFilterChange({ traditionId: val as ReligionTraditionId | 'all', branchId: 'all', page: 1 }),
        options: traditionOptions.map((t) => ({ id: t.value, label: t.label, badge: t.badge })),
      },
      {
        id: 'branch',
        title: 'Courants & Confréries',
        selectedValue: filters.branchId,
        onSelect: (val) => onFilterChange({ branchId: val as ReligionBranchId | 'all', page: 1 }),
        options: branchOptions.map((b) => ({ id: b.value, label: b.label, badge: b.badge })),
      },
      {
        id: 'type',
        title: 'Type de contenu',
        selectedValue: filters.contentType,
        onSelect: (val) => onFilterChange({ contentType: val as ReligionResourceType | 'all', page: 1 }),
        options: typeOptions.map((t) => ({ id: t.value, label: t.label })),
      },
      {
        id: 'author',
        title: 'Auteur / Figure spirituelle',
        selectedValue: filters.author,
        onSelect: (val) => onFilterChange({ author: val, page: 1 }),
        options: authorOptions.map((a) => ({ id: a.value, label: a.label })),
      },
      {
        id: 'epoch',
        title: 'Époque / Siècle',
        selectedValue: filters.year,
        onSelect: (val) => onFilterChange({ year: val, page: 1 }),
        options: epochOptions.map((e) => ({ id: e.value, label: e.label })),
      },
      {
        id: 'access',
        title: "Formule d'accès",
        selectedValue: filters.requiredPlan,
        onSelect: (val) => onFilterChange({ requiredPlan: val as ReligionPlanRequired | 'all', page: 1 }),
        options: planOptions.map((p) => ({ id: p.value, label: p.label })),
      },
    ];
  }, [filters, traditionOptions, branchOptions, typeOptions, authorOptions, epochOptions, planOptions, onFilterChange]);

  return (
    <div className="religion-unified-filters-wrapper">
      {/* 1. Recherche stylisée */}
      <div className="religion-search-bar">
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
            placeholder="Filtrer par titre, auteur ou mot-clé (ex: Bamba, Malick Sy, Augustin)..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value, page: 1 })}
          />
          {filters.searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onFilterChange({ searchQuery: '', page: 1 })}
              aria-label="Effacer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 2. Barre unifiée de filtres compacts */}
      <FilterBar
        mainFilters={[
          {
            id: 'rel-tradition',
            label: 'Tradition',
            value: filters.traditionId,
            options: traditionOptions,
            onChange: (val) => onFilterChange({ traditionId: val as ReligionTraditionId | 'all', branchId: 'all', page: 1 }),
            placeholder: 'Toutes traditions',
            enableSearch: true,
            searchPlaceholder: 'Chercher une tradition...',
          },
          {
            id: 'rel-branch',
            label: 'Courant',
            value: filters.branchId,
            options: branchOptions,
            onChange: (val) => onFilterChange({ branchId: val as ReligionBranchId | 'all', page: 1 }),
            placeholder: 'Tous courants',
            enableSearch: true,
            searchPlaceholder: 'Chercher un courant...',
          },
          {
            id: 'rel-type',
            label: 'Contenu',
            value: filters.contentType,
            options: typeOptions,
            onChange: (val) => onFilterChange({ contentType: val as ReligionResourceType | 'all', page: 1 }),
            placeholder: 'Tous types',
          },
        ]}
        advancedFiltersContent={
          <div className="religion-secondary-filters">
            <FilterDropdown
              id="rel-author"
              label="Auteur"
              value={filters.author}
              options={authorOptions}
              onChange={(val) => onFilterChange({ author: val, page: 1 })}
              placeholder="Auteur"
              enableSearch={authorOptions.length > 5}
              searchPlaceholder="Filtrer les auteurs..."
            />
            <FilterDropdown
              id="rel-epoch"
              label="Époque"
              value={filters.year}
              options={epochOptions}
              onChange={(val) => onFilterChange({ year: val, page: 1 })}
              placeholder="Époque"
            />
            <FilterDropdown
              id="rel-plan"
              label="Accès"
              value={filters.requiredPlan}
              options={planOptions}
              onChange={(val) => onFilterChange({ requiredPlan: val as ReligionPlanRequired | 'all', page: 1 })}
              placeholder="Accès"
            />
          </div>
        }
        sort={{
          value: filters.sortBy,
          onChange: (val) => onFilterChange({ sortBy: val as ReligionFilterState['sortBy'], page: 1 }),
          options: sortOptions,
        }}
        activeChips={activeChips}
        onResetAll={activeChips.length > 0 ? onResetFilters : undefined}
        mobileSections={mobileSections}
        mobileTitle="Filtres religion"
      />

      <style jsx>{`
        .religion-unified-filters-wrapper {
          margin-bottom: 24px;
        }

        .religion-search-bar {
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

        .religion-secondary-filters {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
};
