'use client';

import React, { useState, useEffect } from 'react';
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
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(filters.searchQuery || '');

  // Synchroniser la recherche locale avec les filtres
  useEffect(() => {
    setLocalSearch(filters.searchQuery || '');
  }, [filters.searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ ...filters, searchQuery: localSearch });
  };

  const activeFiltersCount = [
    filters.type && filters.type !== 'all',
    filters.level && filters.level !== 'all',
    filters.subject && filters.subject !== 'all',
    filters.competition && filters.competition !== 'all',
    filters.difficulty && filters.difficulty !== 'all',
    filters.access && filters.access !== 'all',
    Boolean(filters.searchQuery && filters.searchQuery.trim()),
  ].filter(Boolean).length;

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

  return (
    <div className="exercise-filters-container">
      {/* Barre de recherche principale */}
      <form onSubmit={handleSearchSubmit} className="exercise-search-bar">
        <div className="search-input-wrapper">
          <svg
            className="search-icon"
            width="20"
            height="20"
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

        {/* Bouton pour ouvrir le drawer sur mobile */}
        <button
          type="button"
          className="mobile-filter-trigger mobile-only"
          onClick={() => setMobileDrawerOpen(true)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span>Filtres</span>
          {activeFiltersCount > 0 && (
            <span className="active-filters-badge">{activeFiltersCount}</span>
          )}
        </button>
      </form>

      {/* Rangée de filtres Desktop */}
      <div className="exercise-desktop-filters desktop-only">
        {/* Type */}
        <div className="filter-select-group">
          <label htmlFor="filter-type">Type</label>
          <select
            id="filter-type"
            value={filters.type || 'all'}
            onChange={(e) =>
              onFilterChange({ ...filters, type: e.target.value as ExerciseType | 'all' })
            }
          >
            {EXERCISE_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Niveau */}
        <div className="filter-select-group">
          <label htmlFor="filter-level">Niveau</label>
          <select
            id="filter-level"
            value={filters.level || 'all'}
            onChange={(e) =>
              onFilterChange({ ...filters, level: e.target.value as ExerciseLevelId | 'all' })
            }
          >
            {EXERCISE_LEVELS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        {/* Matière */}
        <div className="filter-select-group">
          <label htmlFor="filter-subject">Matière</label>
          <select
            id="filter-subject"
            value={filters.subject || 'all'}
            onChange={(e) => onFilterChange({ ...filters, subject: e.target.value })}
          >
            <option value="all">Toutes les matières</option>
            {subjects.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Concours */}
        {competitions.length > 0 && (
          <div className="filter-select-group">
            <label htmlFor="filter-competition">Concours</label>
            <select
              id="filter-competition"
              value={filters.competition || 'all'}
              onChange={(e) => onFilterChange({ ...filters, competition: e.target.value })}
            >
              <option value="all">Tous les concours</option>
              {competitions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Difficulté */}
        <div className="filter-select-group">
          <label htmlFor="filter-difficulty">Difficulté</label>
          <select
            id="filter-difficulty"
            value={filters.difficulty || 'all'}
            onChange={(e) =>
              onFilterChange({ ...filters, difficulty: e.target.value as ExerciseDifficulty | 'all' })
            }
          >
            {EXERCISE_DIFFICULTIES.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        {/* Accès */}
        <div className="filter-select-group">
          <label htmlFor="filter-access">Accès</label>
          <select
            id="filter-access"
            value={filters.access || 'all'}
            onChange={(e) =>
              onFilterChange({ ...filters, access: e.target.value as ExerciseAccessStatus | 'all' })
            }
          >
            {EXERCISE_ACCESS_TIERS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </div>

        {/* Bouton reset si filtres actifs */}
        {activeFiltersCount > 0 && (
          <button
            type="button"
            className="filter-reset-link"
            onClick={handleResetFilters}
            title="Réinitialiser tous les filtres"
          >
            Réinitialiser ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* En-tête des résultats */}
      <div className="filters-results-meta">
        <span className="results-count-text">
          <strong>{totalResults}</strong> {totalResults <= 1 ? 'exercice disponible' : 'exercices disponibles'}
        </span>
        {activeFiltersCount > 0 && (
          <div className="active-filter-chips">
            {filters.type && filters.type !== 'all' && (
              <span className="filter-chip">
                Type: {filters.type.toUpperCase()}
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filters, type: 'all' })}
                >
                  ✕
                </button>
              </span>
            )}
            {filters.level && filters.level !== 'all' && (
              <span className="filter-chip">
                Niveau: {filters.level}
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filters, level: 'all' })}
                >
                  ✕
                </button>
              </span>
            )}
            {filters.difficulty && filters.difficulty !== 'all' && (
              <span className="filter-chip">
                {filters.difficulty}
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filters, difficulty: 'all' })}
                >
                  ✕
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* DRAWER MOBILE */}
      {mobileDrawerOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setMobileDrawerOpen(false)}>
          <div
            className="mobile-drawer-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="mobile-drawer-header">
              <h3 className="drawer-title">Filtres d’entraînement</h3>
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setMobileDrawerOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="mobile-drawer-body">
              {/* Type */}
              <div className="drawer-field">
                <label>Type d’entraînement</label>
                <select
                  value={filters.type || 'all'}
                  onChange={(e) =>
                    onFilterChange({ ...filters, type: e.target.value as ExerciseType | 'all' })
                  }
                >
                  {EXERCISE_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Niveau */}
              <div className="drawer-field">
                <label>Niveau scolaire / académique</label>
                <select
                  value={filters.level || 'all'}
                  onChange={(e) =>
                    onFilterChange({ ...filters, level: e.target.value as ExerciseLevelId | 'all' })
                  }
                >
                  {EXERCISE_LEVELS.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Matière */}
              <div className="drawer-field">
                <label>Matière</label>
                <select
                  value={filters.subject || 'all'}
                  onChange={(e) => onFilterChange({ ...filters, subject: e.target.value })}
                >
                  <option value="all">Toutes les matières</option>
                  {subjects.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Concours */}
              {competitions.length > 0 && (
                <div className="drawer-field">
                  <label>Concours de préparation</label>
                  <select
                    value={filters.competition || 'all'}
                    onChange={(e) => onFilterChange({ ...filters, competition: e.target.value })}
                  >
                    <option value="all">Tous les concours</option>
                    {competitions.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Difficulté */}
              <div className="drawer-field">
                <label>Difficulté</label>
                <select
                  value={filters.difficulty || 'all'}
                  onChange={(e) =>
                    onFilterChange({ ...filters, difficulty: e.target.value as ExerciseDifficulty | 'all' })
                  }
                >
                  {EXERCISE_DIFFICULTIES.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Accès */}
              <div className="drawer-field">
                <label>Formule d’accès</label>
                <select
                  value={filters.access || 'all'}
                  onChange={(e) =>
                    onFilterChange({ ...filters, access: e.target.value as ExerciseAccessStatus | 'all' })
                  }
                >
                  {EXERCISE_ACCESS_TIERS.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mobile-drawer-footer">
              <button
                type="button"
                className="btn-secondary drawer-reset-btn"
                onClick={handleResetFilters}
              >
                Réinitialiser
              </button>
              <button
                type="button"
                className="btn-primary drawer-apply-btn"
                onClick={() => setMobileDrawerOpen(false)}
              >
                Voir les résultats ({totalResults})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
