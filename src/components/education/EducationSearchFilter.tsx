'use client';

import React, { useState, useEffect } from 'react';
import {
  EDUCATION_LEVELS,
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
import { CustomEducationSelect, CustomSelectOption } from './CustomEducationSelect';

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
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Auto-close mobile drawer when switching/resizing to PC/desktop viewport (> 860px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 860) {
        setMobileDrawerOpen(false);
        setMobileOpenDropdown(null);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileDrawerOpen]);

  // Available grade options for the currently selected level
  const currentGradeOptions =
    filters.level !== 'all' && LEVEL_GRADES_MAP[filters.level]
      ? LEVEL_GRADES_MAP[filters.level]
      : [];

  // Calculate count of active filters
  const activeCount = [
    filters.level !== 'all',
    filters.grade && filters.grade !== 'all',
    filters.subject !== 'all',
    filters.type !== 'all',
    filters.year !== 'all',
    filters.accessStatus !== 'all',
    Boolean(filters.searchQuery.trim()),
  ].filter(Boolean).length;

  const [openDropdown, setOpenDropdown] = useState<'level' | 'grade' | 'subject' | 'type' | 'year' | null>(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<'level' | 'grade' | 'subject' | 'type' | 'year' | null>(null);

  const toggleDropdown = (name: 'level' | 'grade' | 'subject' | 'type' | 'year') => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const toggleMobileDropdown = (name: 'level' | 'grade' | 'subject' | 'type' | 'year') => {
    setMobileOpenDropdown((prev) => (prev === name ? null : name));
  };

  // Custom Options for Level
  const levelOptions: CustomSelectOption[] = [
    {
      value: 'all',
      label: 'Tous les niveaux',
      subtitle: 'Maternelle, Primaire, Collège, Lycée, Université, Formations',
      badge: 'Tout',
      badgeColor: '#e0e7ff',
      badgeTextColor: '#4338ca',
      icon: '🌐',
    },
    {
      value: 'prescolaire',
      label: 'Préscolaire',
      subtitle: 'Petite, Moyenne & Grande section (Éveil)',
      badge: 'Éveil',
      badgeColor: 'rgba(236, 72, 153, 0.12)',
      badgeTextColor: '#db2777',
      icon: '🎒',
    },
    {
      value: 'primaire',
      label: 'Primaire',
      subtitle: 'Du CI au CM2 • Préparation CFEE & Entrée en 6e',
      badge: 'Fondamental',
      badgeColor: 'rgba(14, 165, 233, 0.12)',
      badgeTextColor: '#0284c7',
      icon: '📚',
    },
    {
      value: 'college',
      label: 'Collège',
      subtitle: 'De la 6e à la 3e • Préparation BFEM',
      badge: 'Moyen',
      badgeColor: 'rgba(99, 102, 241, 0.12)',
      badgeTextColor: '#4f46e5',
      icon: '🏫',
    },
    {
      value: 'lycee',
      label: 'Lycée',
      subtitle: 'Seconde, Première & Terminale • Séries S, L, G, T',
      badge: 'Secondaire',
      badgeColor: 'rgba(168, 85, 247, 0.12)',
      badgeTextColor: '#9333ea',
      icon: '🎓',
    },
    {
      value: 'universite',
      label: 'Université',
      subtitle: 'Licence 1, 2, 3 • Master • Doctorat & Recherche',
      badge: 'Supérieur',
      badgeColor: 'rgba(59, 130, 246, 0.12)',
      badgeTextColor: '#2563eb',
      icon: '🏛️',
    },
    {
      value: 'formation_pro',
      label: 'Formation Professionnelle',
      subtitle: 'CAP, BEP, BTS & Métiers techniques',
      badge: 'Pratique',
      badgeColor: 'rgba(245, 158, 11, 0.12)',
      badgeTextColor: '#d97706',
      icon: '🛠️',
    },
  ];

  // Custom Options for Grade / Sub-level
  const gradeOptions: CustomSelectOption[] = currentGradeOptions.map((g) => {
    let icon = '📌';
    let subtitle = 'Classe ou série d’enseignement';
    if (g.id === 'all') {
      icon = '🎓';
      subtitle = filters.level === 'universite' ? 'Tous les cycles (LMD)' : 'Toutes les classes';
    } else if (g.id === 'Licence 1') {
      icon = '📘';
      subtitle = 'Première année universitaire (L1)';
    } else if (g.id === 'Licence 2') {
      icon = '📗';
      subtitle = 'Deuxième année universitaire (L2)';
    } else if (g.id === 'Licence 3') {
      icon = '📙';
      subtitle = 'Troisième année (Diplôme de Licence)';
    } else if (g.id === 'Master') {
      icon = '📕';
      subtitle = 'Master 1 & Master 2 (Spécialisation)';
    } else if (g.id === 'Doctorat') {
      icon = '🔬';
      subtitle = 'Doctorat, thèse & séminaires de recherche';
    } else if (g.id.includes('Terminale')) {
      icon = '🎓';
      subtitle = 'Préparation aux épreuves du Baccalauréat';
    }
    return {
      value: g.id,
      label: g.label,
      subtitle,
      icon,
      badge: g.short,
    };
  });

  // Custom Options for Subject
  const subjectOptions: CustomSelectOption[] = [
    {
      value: 'all',
      label: filters.level === 'universite' ? 'Toutes les matières universitaires' : 'Toutes les matières',
      subtitle: 'Explorer toutes les disciplines confondues',
      icon: '📚',
    },
    ...(filters.level === 'universite'
      ? UNIVERSITY_SUBJECT_GROUPS.flatMap((grp) =>
          grp.subjects.map((sub) => ({
            value: sub.slug,
            label: sub.name,
            subtitle: `Discipline • ${grp.groupName}`,
            group: grp.groupName,
            icon: '📖',
          }))
        )
      : EDUCATION_SUBJECTS.map((sub) => ({
          value: sub.slug,
          label: sub.name,
          subtitle: sub.description,
          icon: '📖',
        }))),
  ];

  // Custom Options for Resource Type
  const typeOptions: CustomSelectOption[] = [
    {
      value: 'all',
      label: 'Tous les types',
      subtitle: 'Cours, exercices, annales et synthèses',
      icon: '📁',
    },
    ...EDUCATION_RESOURCE_TYPES.map((t) => {
      let icon = '📄';
      if (t.id === 'cours') icon = '📘';
      else if (t.id === 'exercice') icon = '📝';
      else if (t.id === 'revision') icon = '📑';
      else if (t.id === 'annale') icon = '🏛️';
      else if (t.id === 'livre') icon = '📚';
      return {
        value: t.id,
        label: t.label,
        subtitle: `Supports classés en ${t.label.toLowerCase()}`,
        icon,
      };
    }),
  ];

  // Custom Options for Session Year
  const yearOptions: CustomSelectOption[] = [
    {
      value: 'all',
      label: 'Toutes les années',
      subtitle: 'Toutes les sessions d’épreuves confondues',
      icon: '📅',
    },
    ...EDUCATION_YEARS.filter((y) => y !== 'all').map((y) => ({
      value: y,
      label: `Session ${y}`,
      subtitle: y === '2024' ? 'Épreuves et cours de l’année en cours' : `Archives de la session ${y}`,
      icon: y === '2024' ? '🌟' : '🗓️',
      badge: y === '2024' ? 'Actuelle' : undefined,
      badgeColor: y === '2024' ? '#dcfce7' : undefined,
      badgeTextColor: y === '2024' ? '#15803d' : undefined,
    })),
  ];

  return (
    <div className="search-filter-wrapper" id="recherche-ressources">
      {/* 1. Main Search Bar Row */}
      <div className="search-bar-row">
        <div className="search-input-box">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="education-search-input"
            type="text"
            className="search-input"
            placeholder="Rechercher par titre, niveau (ex : Licence, Master, Terminale S, BFEM)..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
          />
          {filters.searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onFilterChange({ searchQuery: '' })}
              aria-label="Effacer la recherche"
            >
              ✕
            </button>
          )}
        </div>

        {/* Mobile Filter Toggle Button */}
        <button
          type="button"
          className="mobile-filter-btn"
          onClick={() => setMobileDrawerOpen(true)}
          aria-label="Ouvrir les filtres"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
          <span>Filtres</span>
          {activeCount > 0 && <span className="filter-badge">{activeCount}</span>}
        </button>
      </div>

      {/* 2. Desktop Filters Grid (Custom Designer Dropdowns) */}
      <div className={`desktop-filters-grid ${currentGradeOptions.length > 0 ? 'grid-5-cols' : 'grid-4-cols'}`}>
        {/* Level Custom Dropdown */}
        <CustomEducationSelect
          id="filter-level"
          label="Niveau"
          icon={
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          }
          value={filters.level}
          options={levelOptions}
          isOpen={openDropdown === 'level'}
          onToggle={() => toggleDropdown('level')}
          onClose={() => setOpenDropdown(null)}
          onChange={(newVal) => {
            onFilterChange({
              level: newVal as EducationCycleId | 'all',
              grade: 'all',
              subject: 'all',
            });
          }}
          minMenuWidth="340px"
        />

        {/* Dynamic Sub-Level / Grade Custom Dropdown */}
        {currentGradeOptions.length > 0 && (
          <CustomEducationSelect
            id="filter-grade"
            label={filters.level === 'universite' ? 'Année / Cycle (LMD)' : 'Classe / Filière'}
            icon={
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 14 14" />
              </svg>
            }
            value={filters.grade || 'all'}
            options={gradeOptions}
            isOpen={openDropdown === 'grade'}
            onToggle={() => toggleDropdown('grade')}
            onClose={() => setOpenDropdown(null)}
            onChange={(newVal) => onFilterChange({ grade: newVal })}
            accent={true}
            minMenuWidth="300px"
          />
        )}

        {/* Subject Custom Dropdown */}
        <CustomEducationSelect
          id="filter-subject"
          label="Matière"
          icon={
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          }
          value={filters.subject}
          options={subjectOptions}
          isOpen={openDropdown === 'subject'}
          onToggle={() => toggleDropdown('subject')}
          onClose={() => setOpenDropdown(null)}
          onChange={(newVal) => onFilterChange({ subject: newVal })}
          minMenuWidth="340px"
        />

        {/* Type Custom Dropdown */}
        <CustomEducationSelect
          id="filter-type"
          label="Type de ressource"
          icon={
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          }
          value={filters.type}
          options={typeOptions}
          isOpen={openDropdown === 'type'}
          onToggle={() => toggleDropdown('type')}
          onClose={() => setOpenDropdown(null)}
          onChange={(newVal) => onFilterChange({ type: newVal as EducationResourceType | 'all' })}
          minMenuWidth="290px"
        />

        {/* Year Custom Dropdown */}
        <CustomEducationSelect
          id="filter-year"
          label="Session"
          icon={
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          }
          value={filters.year}
          options={yearOptions}
          isOpen={openDropdown === 'year'}
          onToggle={() => toggleDropdown('year')}
          onClose={() => setOpenDropdown(null)}
          onChange={(newVal) => onFilterChange({ year: newVal })}
          minMenuWidth="260px"
        />
      </div>

      {/* 3. Quick Visual Chips for Level and Sub-Level (Licence 1, Master, Doctorat, etc.) */}
      <div className="quick-filter-chips-bar">
        {filters.level === 'all' ? (
          <div className="chips-container">
            <span className="chips-heading">Niveau rapide :</span>
            <div className="chips-list">
              {EDUCATION_LEVELS.map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  className="quick-chip-btn"
                  onClick={() => onFilterChange({ level: lvl.id, grade: 'all' })}
                >
                  <span>{lvl.title}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="chips-container">
            <span className="chips-heading chips-heading-accent">
              {filters.level === 'universite' ? '🎓 Préciser le cycle universitaire :' : '📌 Préciser la classe :'}
            </span>
            <div className="chips-list">
              {currentGradeOptions.map((g) => {
                const isSelected =
                  (g.id === 'all' && (!filters.grade || filters.grade === 'all')) ||
                  filters.grade === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    className={`quick-chip-btn ${isSelected ? 'chip-active' : ''}`}
                    onClick={() => onFilterChange({ grade: g.id })}
                  >
                    <span>{g.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4. Active filters status bar */}
      <div className="active-filters-bar">
        <span className="results-count">
          <strong>{totalResultsCount}</strong> {totalResultsCount > 1 ? 'ressources éducatives trouvées' : 'ressource trouvée'}
          {filters.level === 'universite' && filters.grade && filters.grade !== 'all' && (
            <span className="highlight-query-badge"> • {filters.grade}</span>
          )}
        </span>

        {activeCount > 0 && (
          <button
            type="button"
            className="reset-filters-link"
            onClick={onResetFilters}
          >
            <span>Réinitialiser les filtres ({activeCount})</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* 5. Mobile Filter Drawer / Bottom Sheet */}
      {mobileDrawerOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setMobileDrawerOpen(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            {/* Top Handle Bar for Touch Gestures */}
            <div className="drawer-handle-bar">
              <span className="drawer-handle-pill" />
            </div>

            <div className="drawer-header">
              <div className="drawer-title-wrap">
                <h3 className="drawer-title">Filtres de recherche</h3>
                {activeCount > 0 && (
                  <span className="drawer-active-pill">
                    {activeCount} actif{activeCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <button
                type="button"
                className="drawer-close"
                onClick={() => setMobileDrawerOpen(false)}
                aria-label="Fermer les filtres"
              >
                ✕
              </button>
            </div>

            {/* Quick Cycle Switcher Bar inside Drawer */}
            <div className="drawer-quick-levels">
              <span className="drawer-quick-label">Cycle d’études :</span>
              <div className="drawer-quick-chips">
                <button
                  type="button"
                  className={`drawer-quick-chip ${filters.level === 'all' ? 'active' : ''}`}
                  onClick={() => onFilterChange({ level: 'all', grade: 'all', subject: 'all' })}
                >
                  🌐 Tous
                </button>
                {EDUCATION_LEVELS.map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    className={`drawer-quick-chip ${filters.level === lvl.id ? 'active' : ''}`}
                    onClick={() => onFilterChange({ level: lvl.id, grade: 'all', subject: 'all' })}
                  >
                    {lvl.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="drawer-body">
              {/* 1. Level */}
              <CustomEducationSelect
                id="mob-filter-level"
                label="Niveau d’enseignement"
                icon={
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                }
                value={filters.level}
                options={levelOptions}
                isOpen={mobileOpenDropdown === 'level'}
                onToggle={() => toggleMobileDropdown('level')}
                onClose={() => setMobileOpenDropdown(null)}
                onChange={(newLvl) => {
                  onFilterChange({
                    level: newLvl as EducationCycleId | 'all',
                    grade: 'all',
                    subject: 'all',
                  });
                }}
                minMenuWidth="100%"
                isMobile={true}
              />

              {/* 2. Sub-Level / Grade */}
              {currentGradeOptions.length > 0 && (
                <CustomEducationSelect
                  id="mob-filter-grade"
                  label={filters.level === 'universite' ? 'Année / Cycle universitaire (LMD)' : 'Classe / Filière'}
                  icon={
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 14 14" />
                    </svg>
                  }
                  value={filters.grade || 'all'}
                  options={gradeOptions}
                  isOpen={mobileOpenDropdown === 'grade'}
                  onToggle={() => toggleMobileDropdown('grade')}
                  onClose={() => setMobileOpenDropdown(null)}
                  onChange={(newGrade) => onFilterChange({ grade: newGrade })}
                  accent={true}
                  minMenuWidth="100%"
                  isMobile={true}
                />
              )}

              {/* 3. Subject */}
              <CustomEducationSelect
                id="mob-filter-subject"
                label="Matière"
                icon={
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                }
                value={filters.subject}
                options={subjectOptions}
                isOpen={mobileOpenDropdown === 'subject'}
                onToggle={() => toggleMobileDropdown('subject')}
                onClose={() => setMobileOpenDropdown(null)}
                onChange={(newSub) => onFilterChange({ subject: newSub })}
                minMenuWidth="100%"
                isMobile={true}
              />

              {/* 4. Type */}
              <CustomEducationSelect
                id="mob-filter-type"
                label="Format / Type de ressource"
                icon={
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                }
                value={filters.type}
                options={typeOptions}
                isOpen={mobileOpenDropdown === 'type'}
                onToggle={() => toggleMobileDropdown('type')}
                onClose={() => setMobileOpenDropdown(null)}
                onChange={(newType) => onFilterChange({ type: newType as EducationResourceType | 'all' })}
                minMenuWidth="100%"
                isMobile={true}
              />

              {/* 5. Year */}
              <CustomEducationSelect
                id="mob-filter-year"
                label="Année de session"
                icon={
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                }
                value={filters.year}
                options={yearOptions}
                isOpen={mobileOpenDropdown === 'year'}
                onToggle={() => toggleMobileDropdown('year')}
                onClose={() => setMobileOpenDropdown(null)}
                onChange={(newYear) => onFilterChange({ year: newYear })}
                minMenuWidth="100%"
                isMobile={true}
              />
            </div>

            <div className="drawer-footer">
              {activeCount > 0 && (
                <button
                  type="button"
                  className="drawer-reset-btn"
                  onClick={() => {
                    onResetFilters();
                    setMobileDrawerOpen(false);
                  }}
                >
                  Réinitialiser
                </button>
              )}
              <button
                type="button"
                className="btn-primary drawer-apply-btn"
                onClick={() => setMobileDrawerOpen(false)}
              >
                Afficher les résultats ({totalResultsCount})
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .search-filter-wrapper {
          background: #ffffff;
          border: 1px solid var(--border-card, rgba(226, 232, 240, 0.9));
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 10px 30px -10px rgba(15, 23, 42, 0.06);
          margin-bottom: 36px;
        }

        .search-bar-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
        }

        .search-input-box {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          color: #94a3b8;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          height: 48px;
          padding: 10px 42px 10px 48px;
          border: 1.5px solid var(--border-subtle, #e2e8f0);
          border-radius: var(--radius-md, 12px);
          font-size: 14.5px;
          color: var(--text-heading, #0f172a);
          background: #ffffff;
          transition: all 0.2s ease;
          outline: none;
        }

        .search-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3.5px rgba(99, 102, 241, 0.15);
        }

        .clear-search-btn {
          position: absolute;
          right: 14px;
          background: #f1f5f9;
          border: none;
          color: #64748b;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          cursor: pointer;
        }

        .mobile-filter-btn {
          display: none;
          align-items: center;
          gap: 8px;
          height: 48px;
          padding: 0 16px;
          background: #f8fafc;
          border: 1.5px solid var(--border-subtle, #e2e8f0);
          border-radius: var(--radius-md, 12px);
          font-size: 13.5px;
          font-weight: 700;
          color: #1e1b4b;
          cursor: pointer;
          flex-shrink: 0;
        }

        .filter-badge {
          background: #4f46e5;
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .desktop-filters-grid {
          display: grid;
          gap: 14px;
          padding-bottom: 18px;
          border-bottom: 1px solid #f1f5f9;
        }

        .grid-4-cols {
          grid-template-columns: repeat(4, 1fr);
        }

        .grid-5-cols {
          grid-template-columns: repeat(5, 1fr);
        }

        .filter-col {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .filter-label {
          font-size: 11.5px;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .select-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .filter-select {
          width: 100%;
          height: 42px;
          padding: 8px 30px 8px 12px;
          border: 1.5px solid var(--border-subtle, #e2e8f0);
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          background: #ffffff;
          appearance: none;
          cursor: pointer;
          outline: none;
          transition: all 0.15s ease;
        }

        .filter-select:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
        }

        .select-accent {
          border-color: rgba(99, 102, 241, 0.5) !important;
          background: #fdfefe !important;
          color: #3730a3 !important;
        }

        .select-chevron {
          position: absolute;
          right: 11px;
          pointer-events: none;
          color: #94a3b8;
          display: flex;
          align-items: center;
        }

        /* Quick Chips Bar */
        .quick-filter-chips-bar {
          padding: 14px 0 6px;
          border-bottom: 1px solid #f1f5f9;
        }

        .chips-container {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .chips-heading {
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          white-space: nowrap;
        }

        .chips-heading-accent {
          color: #4f46e5;
        }

        .chips-list {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .quick-chip-btn {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .quick-chip-btn:hover {
          background: #eef2ff;
          border-color: rgba(99, 102, 241, 0.3);
          color: #4f46e5;
        }

        .quick-chip-btn.chip-active {
          background: #4f46e5;
          border-color: #4f46e5;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
        }

        /* Active filters status bar */
        .active-filters-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
        }

        .results-count {
          font-size: 13px;
          color: #64748b;
        }

        .results-count strong {
          color: #0f172a;
        }

        .highlight-query-badge {
          color: #4f46e5;
          font-weight: 700;
        }

        .reset-filters-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #dc2626;
          background: #fef2f2;
          border: 1px solid #fee2e2;
          padding: 4px 10px;
          border-radius: 999px;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .reset-filters-link:hover {
          background: #fee2e2;
        }

        /* Mobile Drawer */
        .mobile-drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          z-index: 9999;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          animation: fadeIn 0.2s ease-out;
        }

        @media (min-width: 861px) {
          .mobile-drawer-backdrop {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
          }
        }

        .mobile-drawer-content {
          width: 100%;
          max-width: 560px;
          background: #ffffff;
          border-radius: 20px 20px 0 0;
          max-height: 85vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          box-shadow: 0 -10px 40px rgba(15, 23, 42, 0.2);
          animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .drawer-header {
          padding: 16px 20px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .drawer-title {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .drawer-close {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          cursor: pointer;
        }

        .drawer-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Mobile Custom Select Styles */
        .mob-select-root {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .mob-select-accent {
          background: #f5f3ff;
          padding: 12px;
          border-radius: 14px;
          border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .mob-select-label {
          font-size: 11px;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          user-select: none;
        }

        .mob-label-icon {
          display: flex;
          align-items: center;
          color: #6366f1;
        }

        .mob-select-trigger {
          width: 100%;
          min-height: 48px;
          padding: 0 14px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          outline: none;
          text-align: left;
        }

        .mob-select-trigger:hover,
        .mob-select-trigger:active {
          border-color: #cbd5e1;
          background: #f8fafc;
        }

        .mob-select-trigger.is-open {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
          background: #ffffff;
        }

        .mob-select-trigger.has-active {
          border-color: #818cf8;
          background: #faf5ff;
        }

        .mob-trigger-left {
          display: flex;
          align-items: center;
          gap: 9px;
          overflow: hidden;
          padding-right: 8px;
        }

        .mob-trigger-icon {
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .mob-trigger-text {
          font-size: 13.5px;
          font-weight: 600;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mob-trigger-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .mob-active-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4f46e5;
        }

        .mob-chevron {
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        }

        .mob-chevron.rotate {
          transform: rotate(180deg);
          color: #4f46e5;
        }

        /* Mobile Dropdown Menu Card */
        .mob-menu-card {
          background: #ffffff;
          border: 1.5px solid #e0e7ff;
          border-radius: 14px;
          box-shadow: 0 10px 30px -8px rgba(15, 23, 42, 0.1);
          overflow: hidden;
          margin-top: 4px;
          animation: mobMenuIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes mobMenuIn {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Drawer Top Handle */
        .drawer-handle-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px 0 4px;
        }

        .drawer-handle-pill {
          width: 38px;
          height: 4px;
          border-radius: 999px;
          background: #cbd5e1;
        }

        .drawer-title-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .drawer-active-pill {
          font-size: 11px;
          font-weight: 700;
          color: #4f46e5;
          background: #eef2ff;
          border: 1px solid rgba(79, 70, 229, 0.2);
          padding: 2px 8px;
          border-radius: 999px;
        }

        /* Drawer Quick Level Chips */
        .drawer-quick-levels {
          padding: 8px 18px 12px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .drawer-quick-label {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .drawer-quick-chips {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 2px;
          scrollbar-width: none;
        }

        .drawer-quick-chips::-webkit-scrollbar {
          display: none;
        }

        .drawer-quick-chip {
          padding: 6px 12px;
          border-radius: 999px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          font-size: 12px;
          font-weight: 600;
          color: #475569;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }

        .drawer-quick-chip:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .drawer-quick-chip.active {
          background: #4f46e5;
          color: #ffffff;
          border-color: #4f46e5;
          box-shadow: 0 3px 10px rgba(79, 70, 229, 0.3);
        }

        .drawer-body {
          padding: 16px 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .drawer-footer {
          padding: 16px 20px;
          border-top: 1px solid #f1f5f9;
          display: flex;
          gap: 10px;
          background: #ffffff;
        }

        .drawer-reset-btn {
          flex: 1;
          height: 48px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 700;
          color: #64748b;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .drawer-reset-btn:hover {
          background: #fee2e2;
          color: #ef4444;
          border-color: #fca5a5;
        }

        .drawer-apply-btn {
          flex: 2;
          height: 48px;
          border-radius: 12px;
          font-size: 14.5px;
          font-weight: 700;
          justify-content: center;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);
        }

        @media (max-width: 1080px) {
          .desktop-filters-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 860px) {
          .desktop-filters-grid {
            display: none;
          }

          .mobile-filter-btn {
            display: inline-flex;
          }

          .search-filter-wrapper {
            padding: 18px 16px;
          }
        }
      `}</style>
    </div>
  );
};
