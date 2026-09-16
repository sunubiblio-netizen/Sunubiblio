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
import { CustomFilterDropdown, DropdownOption } from '@/components/ui/CustomFilterDropdown';

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
  const [expandedMobileSection, setExpandedMobileSection] = useState<string | null>('type');
  const [subjectMobileSearch, setSubjectMobileSearch] = useState('');

  // Synchroniser la recherche locale avec les filtres
  useEffect(() => {
    setLocalSearch(filters.searchQuery || '');
  }, [filters.searchQuery]);

  // Verrouiller le défilement de la page quand le drawer mobile est ouvert
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setSubjectMobileSearch('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileDrawerOpen]);

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

  const toggleMobileSection = (key: string) => {
    setExpandedMobileSection((prev) => (prev === key ? null : key));
  };

  // ==========================================
  // OPTIONS DE SÉLECTION POUR LES DROPDOWNS PROS
  // ==========================================

  const typeOptions: DropdownOption[] = useMemo(
    () =>
      EXERCISE_TYPES.map((t) => ({
        value: t.id,
        label: t.label,
        badge: t.id === 'qcm' ? 'QCM' : t.id === 'exercice' ? 'Guidé' : t.id === 'correction' ? 'Corrigé' : undefined,
      })),
    []
  );

  const levelOptions: DropdownOption[] = useMemo(
    () =>
      EXERCISE_LEVELS.map((l) => ({
        value: l.id,
        label: l.label,
        badge: l.id !== 'all' ? l.label.split(' ')[0] : undefined,
      })),
    []
  );

  const subjectOptions: DropdownOption[] = useMemo(() => {
    return [
      { value: 'all', label: 'Toutes les matières' },
      ...subjects.map((s) => ({
        value: s.slug,
        label: s.name,
      })),
    ];
  }, [subjects]);

  const competitionOptions: DropdownOption[] = useMemo(() => {
    return [
      { value: 'all', label: 'Tous les concours' },
      ...competitions.map((c) => ({
        value: c.id,
        label: c.name,
        badge: 'Concours',
      })),
    ];
  }, [competitions]);

  const difficultyOptions: DropdownOption[] = useMemo(
    () =>
      EXERCISE_DIFFICULTIES.map((d: { id: string; label: string; badge?: string }) => ({
        value: d.id,
        label: d.label,
        badge: d.badge,
      })),
    []
  );

  const accessOptions: DropdownOption[] = useMemo(
    () =>
      EXERCISE_ACCESS_TIERS.map((a) => ({
        value: a.id,
        label: a.label,
        badge: a.id === 'premium' ? 'Gold' : a.id === 'gratuit' ? 'Libre' : undefined,
      })),
    []
  );

  // Libellés actifs pour le résumé mobile
  const activeTypeLabel = typeOptions.find((o) => o.value === (filters.type || 'all'))?.label || 'Tous';
  const activeLevelLabel = levelOptions.find((o) => o.value === (filters.level || 'all'))?.label || 'Tous';
  const activeSubjectLabel = subjectOptions.find((o) => o.value === (filters.subject || 'all'))?.label || 'Toutes';
  const activeCompLabel = competitionOptions.find((o) => o.value === (filters.competition || 'all'))?.label || 'Tous';
  const activeDiffLabel = difficultyOptions.find((o) => o.value === (filters.difficulty || 'all'))?.label || 'Toutes';
  const activeAccessLabel = accessOptions.find((o) => o.value === (filters.access || 'all'))?.label || 'Tous';

  // Filtrage des matières pour le drawer mobile
  const filteredMobileSubjects = useMemo(() => {
    if (!subjectMobileSearch.trim()) return subjects;
    const q = subjectMobileSearch.toLowerCase().trim();
    return subjects.filter((s) => s.name.toLowerCase().includes(q));
  }, [subjects, subjectMobileSearch]);

  return (
    <div className="exercise-filters-container">
      {/* 1. BARRE DE RECHERCHE PRINCIPALE */}
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

        {/* Bouton Filtres sur Mobile */}
        <button
          type="button"
          className="mobile-filter-trigger mobile-only"
          onClick={() => setMobileDrawerOpen(true)}
          aria-label="Ouvrir les filtres avancés"
        >
          <div className="mobile-trigger-icon-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </div>
          <span>Filtres</span>
          {activeFiltersCount > 0 && (
            <span className="active-filters-badge">{activeFiltersCount}</span>
          )}
        </button>
      </form>

      {/* 2. RANGÉE DE FILTRES AVANCÉS DESKTOP (AVEC MENUS DÉROULANTS PERSONNALISÉS FLOTTANTS) */}
      <div className="exercise-desktop-custom-filters desktop-only">
        {/* Type */}
        <CustomFilterDropdown
          id="exo-filter-type"
          label="Type"
          value={filters.type || 'all'}
          options={typeOptions}
          onChange={(val) => onFilterChange({ ...filters, type: val as ExerciseType | 'all' })}
          placeholder="Tous les types"
        />

        {/* Niveau */}
        <CustomFilterDropdown
          id="exo-filter-level"
          label="Niveau"
          value={filters.level || 'all'}
          options={levelOptions}
          onChange={(val) => onFilterChange({ ...filters, level: val as ExerciseLevelId | 'all' })}
          placeholder="Tous les niveaux"
        />

        {/* Matière */}
        <CustomFilterDropdown
          id="exo-filter-subject"
          label="Matière"
          value={filters.subject || 'all'}
          options={subjectOptions}
          onChange={(val) => onFilterChange({ ...filters, subject: val })}
          placeholder="Toutes les matières"
          enableSearch={subjects.length > 5}
          searchPlaceholder="Filtrer les matières..."
        />

        {/* Concours */}
        {competitions.length > 0 && (
          <CustomFilterDropdown
            id="exo-filter-competition"
            label="Concours"
            value={filters.competition || 'all'}
            options={competitionOptions}
            onChange={(val) => onFilterChange({ ...filters, competition: val })}
            placeholder="Tous les concours"
            enableSearch={competitions.length > 5}
            searchPlaceholder="Filtrer les concours..."
          />
        )}

        {/* Difficulté */}
        <CustomFilterDropdown
          id="exo-filter-difficulty"
          label="Difficulté"
          value={filters.difficulty || 'all'}
          options={difficultyOptions}
          onChange={(val) => onFilterChange({ ...filters, difficulty: val as ExerciseDifficulty | 'all' })}
          placeholder="Toutes difficultés"
        />

        {/* Formule d'accès */}
        <CustomFilterDropdown
          id="exo-filter-access"
          label="Accès"
          value={filters.access || 'all'}
          options={accessOptions}
          onChange={(val) => onFilterChange({ ...filters, access: val as ExerciseAccessStatus | 'all' })}
          placeholder="Tous les accès"
          align="right"
        />

        {/* Bouton reset général si filtres actifs */}
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

      {/* 3. EN-TÊTE DES RÉSULTATS & CHIPS ACTIFS */}
      <div className="filters-results-meta">
        <span className="results-count-text">
          <strong>{totalResults}</strong> {totalResults <= 1 ? 'exercice disponible' : 'exercices disponibles'}
        </span>
        {activeFiltersCount > 0 && (
          <div className="active-filter-chips">
            {filters.type && filters.type !== 'all' && (
              <span className="filter-chip">
                Type: {activeTypeLabel}
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filters, type: 'all' })}
                  title="Retirer ce filtre"
                >
                  ✕
                </button>
              </span>
            )}
            {filters.level && filters.level !== 'all' && (
              <span className="filter-chip">
                Niveau: {activeLevelLabel}
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filters, level: 'all' })}
                  title="Retirer ce filtre"
                >
                  ✕
                </button>
              </span>
            )}
            {filters.subject && filters.subject !== 'all' && (
              <span className="filter-chip">
                Matière: {activeSubjectLabel}
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filters, subject: 'all' })}
                  title="Retirer ce filtre"
                >
                  ✕
                </button>
              </span>
            )}
            {filters.competition && filters.competition !== 'all' && (
              <span className="filter-chip">
                Concours: {activeCompLabel}
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filters, competition: 'all' })}
                  title="Retirer ce filtre"
                >
                  ✕
                </button>
              </span>
            )}
            {filters.difficulty && filters.difficulty !== 'all' && (
              <span className="filter-chip">
                {activeDiffLabel}
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filters, difficulty: 'all' })}
                  title="Retirer ce filtre"
                >
                  ✕
                </button>
              </span>
            )}
            {filters.access && filters.access !== 'all' && (
              <span className="filter-chip">
                {activeAccessLabel}
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filters, access: 'all' })}
                  title="Retirer ce filtre"
                >
                  ✕
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* 4. TIROIR MOBILE MODERNE & ERGONOMIQUE (ACCORDÉONS & TOUCH PILLS) */}
      {mobileDrawerOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setMobileDrawerOpen(false)}>
          <div
            className="mobile-drawer-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Header du drawer mobile */}
            <div className="mobile-drawer-header">
              <div>
                <span className="drawer-eyebrow">Affiner l’entraînement</span>
                <h3 className="drawer-title">Filtres pédagogiques</h3>
              </div>
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setMobileDrawerOpen(false)}
                aria-label="Fermer les filtres"
              >
                ✕
              </button>
            </div>

            {/* Corps du drawer avec accordéons */}
            <div className="mobile-drawer-body">
              {/* Accordéon 1 : Type d'entraînement */}
              <div className={`drawer-accordion-card ${filters.type && filters.type !== 'all' ? 'is-filtered' : ''}`}>
                <button
                  type="button"
                  className={`accordion-trigger ${expandedMobileSection === 'type' ? 'is-open' : ''}`}
                  onClick={() => toggleMobileSection('type')}
                >
                  <div className="accordion-title-box">
                    <span className="accordion-icon">📝</span>
                    <div className="accordion-texts">
                      <span className="category-title">Type d’exercice</span>
                      <span className="category-subtitle">{activeTypeLabel}</span>
                    </div>
                  </div>
                  <div className="accordion-action-box">
                    {filters.type && filters.type !== 'all' && <span className="mobile-active-dot" />}
                    <svg
                      className={`chevron-icon ${expandedMobileSection === 'type' ? 'rotated' : ''}`}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>

                {expandedMobileSection === 'type' && (
                  <div className="accordion-expanded-content">
                    <div className="drawer-pills-wrap">
                      {EXERCISE_TYPES.map((t) => {
                        const isSelected = (filters.type || 'all') === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            className={`drawer-pill ${isSelected ? 'active' : ''}`}
                            onClick={() => onFilterChange({ ...filters, type: t.id as ExerciseType | 'all' })}
                          >
                            <span>{t.label}</span>
                            {isSelected && <span className="pill-check">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Accordéon 2 : Niveau académique */}
              <div className={`drawer-accordion-card ${filters.level && filters.level !== 'all' ? 'is-filtered' : ''}`}>
                <button
                  type="button"
                  className={`accordion-trigger ${expandedMobileSection === 'level' ? 'is-open' : ''}`}
                  onClick={() => toggleMobileSection('level')}
                >
                  <div className="accordion-title-box">
                    <span className="accordion-icon">🎓</span>
                    <div className="accordion-texts">
                      <span className="category-title">Niveau d’études</span>
                      <span className="category-subtitle">{activeLevelLabel}</span>
                    </div>
                  </div>
                  <div className="accordion-action-box">
                    {filters.level && filters.level !== 'all' && <span className="mobile-active-dot" />}
                    <svg
                      className={`chevron-icon ${expandedMobileSection === 'level' ? 'rotated' : ''}`}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>

                {expandedMobileSection === 'level' && (
                  <div className="accordion-expanded-content">
                    <div className="drawer-pills-wrap">
                      {EXERCISE_LEVELS.map((l) => {
                        const isSelected = (filters.level || 'all') === l.id;
                        return (
                          <button
                            key={l.id}
                            type="button"
                            className={`drawer-pill ${isSelected ? 'active' : ''}`}
                            onClick={() => onFilterChange({ ...filters, level: l.id as ExerciseLevelId | 'all' })}
                          >
                            <span>{l.label}</span>
                            {isSelected && <span className="pill-check">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Accordéon 3 : Matière */}
              <div className={`drawer-accordion-card ${filters.subject && filters.subject !== 'all' ? 'is-filtered' : ''}`}>
                <button
                  type="button"
                  className={`accordion-trigger ${expandedMobileSection === 'subject' ? 'is-open' : ''}`}
                  onClick={() => toggleMobileSection('subject')}
                >
                  <div className="accordion-title-box">
                    <span className="accordion-icon">📚</span>
                    <div className="accordion-texts">
                      <span className="category-title">Matière</span>
                      <span className="category-subtitle">{activeSubjectLabel}</span>
                    </div>
                  </div>
                  <div className="accordion-action-box">
                    {filters.subject && filters.subject !== 'all' && <span className="mobile-active-dot" />}
                    <svg
                      className={`chevron-icon ${expandedMobileSection === 'subject' ? 'rotated' : ''}`}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>

                {expandedMobileSection === 'subject' && (
                  <div className="accordion-expanded-content">
                    {subjects.length > 5 && (
                      <div className="mobile-subject-search">
                        <input
                          type="text"
                          placeholder="Chercher une matière..."
                          value={subjectMobileSearch}
                          onChange={(e) => setSubjectMobileSearch(e.target.value)}
                          className="mobile-sub-input"
                        />
                      </div>
                    )}
                    <div className="drawer-pills-wrap">
                      <button
                        type="button"
                        className={`drawer-pill ${(!filters.subject || filters.subject === 'all') ? 'active' : ''}`}
                        onClick={() => onFilterChange({ ...filters, subject: 'all' })}
                      >
                        <span>Toutes les matières</span>
                        {(!filters.subject || filters.subject === 'all') && <span className="pill-check">✓</span>}
                      </button>
                      {filteredMobileSubjects.map((s) => {
                        const isSelected = filters.subject === s.slug;
                        return (
                          <button
                            key={s.slug}
                            type="button"
                            className={`drawer-pill ${isSelected ? 'active' : ''}`}
                            onClick={() => onFilterChange({ ...filters, subject: s.slug })}
                          >
                            <span>{s.name}</span>
                            {isSelected && <span className="pill-check">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Accordéon 4 : Concours (si disponible) */}
              {competitions.length > 0 && (
                <div className={`drawer-accordion-card ${filters.competition && filters.competition !== 'all' ? 'is-filtered' : ''}`}>
                  <button
                    type="button"
                    className={`accordion-trigger ${expandedMobileSection === 'competition' ? 'is-open' : ''}`}
                    onClick={() => toggleMobileSection('competition')}
                  >
                    <div className="accordion-title-box">
                      <span className="accordion-icon">🏆</span>
                      <div className="accordion-texts">
                        <span className="category-title">Concours</span>
                        <span className="category-subtitle">{activeCompLabel}</span>
                      </div>
                    </div>
                    <div className="accordion-action-box">
                      {filters.competition && filters.competition !== 'all' && <span className="mobile-active-dot" />}
                      <svg
                        className={`chevron-icon ${expandedMobileSection === 'competition' ? 'rotated' : ''}`}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </button>

                  {expandedMobileSection === 'competition' && (
                    <div className="accordion-expanded-content">
                      <div className="drawer-pills-wrap">
                        <button
                          type="button"
                          className={`drawer-pill ${(!filters.competition || filters.competition === 'all') ? 'active' : ''}`}
                          onClick={() => onFilterChange({ ...filters, competition: 'all' })}
                        >
                          <span>Tous les concours</span>
                          {(!filters.competition || filters.competition === 'all') && <span className="pill-check">✓</span>}
                        </button>
                        {competitions.map((c) => {
                          const isSelected = filters.competition === c.id;
                          return (
                            <button
                              key={c.id}
                              type="button"
                              className={`drawer-pill ${isSelected ? 'active' : ''}`}
                              onClick={() => onFilterChange({ ...filters, competition: c.id })}
                            >
                              <span>{c.name}</span>
                              {isSelected && <span className="pill-check">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Accordéon 5 : Difficulté */}
              <div className={`drawer-accordion-card ${filters.difficulty && filters.difficulty !== 'all' ? 'is-filtered' : ''}`}>
                <button
                  type="button"
                  className={`accordion-trigger ${expandedMobileSection === 'difficulty' ? 'is-open' : ''}`}
                  onClick={() => toggleMobileSection('difficulty')}
                >
                  <div className="accordion-title-box">
                    <span className="accordion-icon">⚡</span>
                    <div className="accordion-texts">
                      <span className="category-title">Difficulté</span>
                      <span className="category-subtitle">{activeDiffLabel}</span>
                    </div>
                  </div>
                  <div className="accordion-action-box">
                    {filters.difficulty && filters.difficulty !== 'all' && <span className="mobile-active-dot" />}
                    <svg
                      className={`chevron-icon ${expandedMobileSection === 'difficulty' ? 'rotated' : ''}`}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>

                {expandedMobileSection === 'difficulty' && (
                  <div className="accordion-expanded-content">
                    <div className="drawer-pills-wrap">
                      {EXERCISE_DIFFICULTIES.map((d: { id: string; label: string }) => {
                        const isSelected = (filters.difficulty || 'all') === d.id;
                        return (
                          <button
                            key={d.id}
                            type="button"
                            className={`drawer-pill ${isSelected ? 'active' : ''}`}
                            onClick={() => onFilterChange({ ...filters, difficulty: d.id as ExerciseDifficulty | 'all' })}
                          >
                            <span>{d.label}</span>
                            {isSelected && <span className="pill-check">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Accordéon 6 : Formule d'accès */}
              <div className={`drawer-accordion-card ${filters.access && filters.access !== 'all' ? 'is-filtered' : ''}`}>
                <button
                  type="button"
                  className={`accordion-trigger ${expandedMobileSection === 'access' ? 'is-open' : ''}`}
                  onClick={() => toggleMobileSection('access')}
                >
                  <div className="accordion-title-box">
                    <span className="accordion-icon">🔒</span>
                    <div className="accordion-texts">
                      <span className="category-title">Formule d’accès</span>
                      <span className="category-subtitle">{activeAccessLabel}</span>
                    </div>
                  </div>
                  <div className="accordion-action-box">
                    {filters.access && filters.access !== 'all' && <span className="mobile-active-dot" />}
                    <svg
                      className={`chevron-icon ${expandedMobileSection === 'access' ? 'rotated' : ''}`}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>

                {expandedMobileSection === 'access' && (
                  <div className="accordion-expanded-content">
                    <div className="drawer-pills-wrap">
                      {EXERCISE_ACCESS_TIERS.map((a) => {
                        const isSelected = (filters.access || 'all') === a.id;
                        return (
                          <button
                            key={a.id}
                            type="button"
                            className={`drawer-pill ${isSelected ? 'active' : ''}`}
                            onClick={() => onFilterChange({ ...filters, access: a.id as ExerciseAccessStatus | 'all' })}
                          >
                            <span>{a.label}</span>
                            {isSelected && <span className="pill-check">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pied du tiroir mobile */}
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
