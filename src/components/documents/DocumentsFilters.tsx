'use client';

import React, { useState, useEffect } from 'react';
import {
  DocumentCategory,
  DocumentCategoryInfo,
  DocumentFilterState,
  DocumentFormat,
} from '@/types/document';
import { CustomDocumentSelect, CustomSelectOption } from './CustomDocumentSelect';

interface DocumentsFiltersProps {
  filters: DocumentFilterState;
  onFilterChange: (newFilters: Partial<DocumentFilterState>) => void;
  onResetFilters: () => void;
  categories: DocumentCategoryInfo[];
  availableYears: number[];
  totalResults: number;
}

export const DocumentsFilters: React.FC<DocumentsFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  categories,
  availableYears,
  totalResults,
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'category' | 'format' | 'year' | 'sort' | null>(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<'category' | 'format' | 'year' | 'sort' | null>(null);

  // Auto-close mobile drawer when switching/resizing to PC (> 860px)
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

  // Active filters count
  const activeCount = [
    Boolean(filters.searchQuery.trim()),
    filters.category !== 'all',
    filters.format !== 'all',
    filters.year !== 'all',
    filters.sortBy !== 'pertinence',
  ].filter(Boolean).length;

  const toggleDropdown = (name: 'category' | 'format' | 'year' | 'sort') => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const toggleMobileDropdown = (name: 'category' | 'format' | 'year' | 'sort') => {
    setMobileOpenDropdown((prev) => (prev === name ? null : name));
  };

  // Category Options
  const categoryOptions: CustomSelectOption[] = [
    {
      value: 'all',
      label: 'Toutes les catégories',
      subtitle: 'Tous les domaines administratifs et scolaires',
      badge: 'Tout',
      badgeColor: '#e0e7ff',
      badgeTextColor: '#4338ca',
      icon: '📁',
    },
    ...categories.map((cat) => {
      let icon = '📄';
      if (cat.id === 'administratifs') icon = '🏛️';
      else if (cat.id === 'guides') icon = '🧭';
      else if (cat.id === 'formulaires') icon = '📋';
      else if (cat.id === 'textes-officiels') icon = '⚖️';
      else if (cat.id === 'scolaires') icon = '🎓';
      else if (cat.id === 'professionnels') icon = '💼';
      else if (cat.id === 'modeles') icon = '📝';
      else if (cat.id === 'autres') icon = '📌';

      return {
        value: cat.id,
        label: cat.label,
        subtitle: cat.description,
        icon,
      };
    }),
  ];

  // Format Options
  const formatOptions: CustomSelectOption[] = [
    {
      value: 'all',
      label: 'Tous les types (PDF, Word, Excel...)',
      subtitle: 'Tous formats de fichiers confondus',
      icon: '🗂️',
    },
    {
      value: 'PDF',
      label: 'PDF (Documents officiels)',
      subtitle: 'Textes de loi, formulaires officiels, fiches',
      icon: '📕',
      badge: 'Lecture',
      badgeColor: '#fee2e2',
      badgeTextColor: '#b91c1c',
    },
    {
      value: 'DOCX',
      label: 'DOCX / Word (Modèles modifiables)',
      subtitle: 'Lettres, CV, conventions et demandes types',
      icon: '📘',
      badge: 'Éditable',
      badgeColor: '#dbeafe',
      badgeTextColor: '#1d4ed8',
    },
    {
      value: 'XLSX',
      label: 'XLSX / Excel (Tableurs & Outils)',
      subtitle: 'Plannings de révision, grilles et barèmes',
      icon: '📗',
      badge: 'Calculs',
      badgeColor: '#dcfce7',
      badgeTextColor: '#15803d',
    },
  ];

  // Year Options
  const yearOptions: CustomSelectOption[] = [
    {
      value: 'all',
      label: 'Toutes les années',
      subtitle: 'Archives et éditions récentes',
      icon: '📅',
    },
    ...availableYears.map((yr) => ({
      value: String(yr),
      label: `Édition ${yr}`,
      subtitle: yr === 2026 ? 'Documents et modèles en vigueur' : `Version de l'année ${yr}`,
      icon: yr === 2026 ? '🌟' : '🗓️',
      badge: yr === 2026 ? 'Récent' : undefined,
      badgeColor: yr === 2026 ? '#e0e7ff' : undefined,
      badgeTextColor: yr === 2026 ? '#4338ca' : undefined,
    })),
  ];

  // Sort Options
  const sortOptions: CustomSelectOption[] = [
    {
      value: 'pertinence',
      label: 'Pertinence',
      subtitle: 'Ressources les plus adaptées et populaires',
      icon: '⚡',
    },
    {
      value: 'recent',
      label: 'Plus récents',
      subtitle: 'Classer par dernière mise à jour',
      icon: '✨',
    },
    {
      value: 'downloads',
      label: 'Plus téléchargés',
      subtitle: 'Modèles les plus utilisés par la communauté',
      icon: '🔥',
    },
    {
      value: 'title',
      label: 'Ordre alphabétique (A - Z)',
      subtitle: 'Classer par titre de document',
      icon: '🔤',
    },
  ];

  return (
    <div className="search-filter-wrapper doc-search-filter-wrapper" id="recherche-documents">
      {/* 1. Main Search Bar Row */}
      <div className="search-bar-row">
        <div className="search-input-box">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="documents-search-input"
            type="text"
            className="search-input"
            placeholder="Rechercher par titre, type (ex : demande de stage, bourse, modèle de CV)..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value, page: 1 })}
          />
          {filters.searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onFilterChange({ searchQuery: '', page: 1 })}
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

      {/* 2. Desktop Filters Grid (Custom Designer Dropdowns identical to Education) */}
      <div className="desktop-filters-grid grid-4-cols">
        {/* Catégorie */}
        <CustomDocumentSelect
          id="doc-filter-category"
          label="Catégorie"
          icon={
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          }
          value={filters.category}
          options={categoryOptions}
          isOpen={openDropdown === 'category'}
          onToggle={() => toggleDropdown('category')}
          onClose={() => setOpenDropdown(null)}
          onChange={(newVal) => onFilterChange({ category: newVal as DocumentCategory, page: 1 })}
          minMenuWidth="320px"
        />

        {/* Format / Type de document */}
        <CustomDocumentSelect
          id="doc-filter-format"
          label="Type de document"
          icon={
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          }
          value={filters.format}
          options={formatOptions}
          isOpen={openDropdown === 'format'}
          onToggle={() => toggleDropdown('format')}
          onClose={() => setOpenDropdown(null)}
          onChange={(newVal) => onFilterChange({ format: newVal as DocumentFormat | 'all', page: 1 })}
          minMenuWidth="290px"
        />

        {/* Année */}
        <CustomDocumentSelect
          id="doc-filter-year"
          label="Année"
          icon={
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          }
          value={filters.year === 'all' ? 'all' : String(filters.year)}
          options={yearOptions}
          isOpen={openDropdown === 'year'}
          onToggle={() => toggleDropdown('year')}
          onClose={() => setOpenDropdown(null)}
          onChange={(newVal) =>
            onFilterChange({ year: newVal === 'all' ? 'all' : Number(newVal), page: 1 })
          }
          minMenuWidth="260px"
        />

        {/* Tri */}
        <CustomDocumentSelect
          id="doc-filter-sort"
          label="Trier par"
          icon={
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          }
          value={filters.sortBy}
          options={sortOptions}
          isOpen={openDropdown === 'sort'}
          onToggle={() => toggleDropdown('sort')}
          onClose={() => setOpenDropdown(null)}
          onChange={(newVal) =>
            onFilterChange({ sortBy: newVal as DocumentFilterState['sortBy'], page: 1 })
          }
          minMenuWidth="260px"
        />
      </div>

      {/* 3. Quick Visual Chips for Categories (Mirror of Education Levels Chips) */}
      <div className="quick-filter-chips-bar">
        <div className="chips-container">
          <span className="chips-heading">Catégories rapides :</span>
          <div className="chips-list">
            <button
              type="button"
              className={`quick-chip-btn ${filters.category === 'all' ? 'chip-active' : ''}`}
              onClick={() => onFilterChange({ category: 'all', page: 1 })}
            >
              <span>Tous les documents</span>
            </button>
            {categories.map((cat) => {
              const isSelected = filters.category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`quick-chip-btn ${isSelected ? 'chip-active' : ''}`}
                  onClick={() => onFilterChange({ category: cat.id, page: 1 })}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Active filters status bar */}
      <div className="active-filters-bar">
        <span className="results-count">
          <strong>{totalResults}</strong> {totalResults > 1 ? 'documents utiles trouvés' : 'document utile trouvé'}
          {filters.category !== 'all' && (
            <span className="highlight-query-badge">
              {' '}
              • {categories.find((c) => c.id === filters.category)?.label}
            </span>
          )}
          {filters.format !== 'all' && (
            <span className="highlight-query-badge"> • {filters.format}</span>
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

      {/* 5. Mobile Filter Drawer / Bottom Sheet (Identical to Education) */}
      {mobileDrawerOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setMobileDrawerOpen(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            {/* Top Handle Bar for Touch Gestures */}
            <div className="drawer-handle-bar">
              <span className="drawer-handle-pill" />
            </div>

            <div className="drawer-header">
              <div className="drawer-title-wrap">
                <h3 className="drawer-title">Filtres des documents</h3>
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

            {/* Quick Category Switcher Bar inside Drawer */}
            <div className="drawer-quick-levels">
              <span className="drawer-quick-label">Catégorie de document :</span>
              <div className="drawer-quick-chips">
                <button
                  type="button"
                  className={`drawer-quick-chip ${filters.category === 'all' ? 'active' : ''}`}
                  onClick={() => onFilterChange({ category: 'all', page: 1 })}
                >
                  📁 Tous
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`drawer-quick-chip ${filters.category === cat.id ? 'active' : ''}`}
                    onClick={() => onFilterChange({ category: cat.id, page: 1 })}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="drawer-body">
              {/* 1. Catégorie Custom Select */}
              <CustomDocumentSelect
                id="mob-filter-category"
                label="Catégorie officielle"
                icon={
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                }
                value={filters.category}
                options={categoryOptions}
                isOpen={mobileOpenDropdown === 'category'}
                onToggle={() => toggleMobileDropdown('category')}
                onClose={() => setMobileOpenDropdown(null)}
                onChange={(newCat) => onFilterChange({ category: newCat as DocumentCategory, page: 1 })}
                minMenuWidth="100%"
                isMobile={true}
              />

              {/* 2. Format / Type */}
              <CustomDocumentSelect
                id="mob-filter-format"
                label="Format / Type de ressource"
                icon={
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                }
                value={filters.format}
                options={formatOptions}
                isOpen={mobileOpenDropdown === 'format'}
                onToggle={() => toggleMobileDropdown('format')}
                onClose={() => setMobileOpenDropdown(null)}
                onChange={(newFmt) => onFilterChange({ format: newFmt as DocumentFormat | 'all', page: 1 })}
                minMenuWidth="100%"
                isMobile={true}
              />

              {/* 3. Année */}
              <CustomDocumentSelect
                id="mob-filter-year"
                label="Année de publication"
                icon={
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                }
                value={filters.year === 'all' ? 'all' : String(filters.year)}
                options={yearOptions}
                isOpen={mobileOpenDropdown === 'year'}
                onToggle={() => toggleMobileDropdown('year')}
                onClose={() => setMobileOpenDropdown(null)}
                onChange={(newYr) =>
                  onFilterChange({ year: newYr === 'all' ? 'all' : Number(newYr), page: 1 })
                }
                minMenuWidth="100%"
                isMobile={true}
              />

              {/* 4. Tri */}
              <CustomDocumentSelect
                id="mob-filter-sort"
                label="Ordre d'affichage"
                icon={
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                }
                value={filters.sortBy}
                options={sortOptions}
                isOpen={mobileOpenDropdown === 'sort'}
                onToggle={() => toggleMobileDropdown('sort')}
                onClose={() => setMobileOpenDropdown(null)}
                onChange={(newSort) =>
                  onFilterChange({ sortBy: newSort as DocumentFilterState['sortBy'], page: 1 })
                }
                minMenuWidth="100%"
                isMobile={true}
              />
            </div>

            {/* Sticky Drawer Footer */}
            <div className="drawer-footer">
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
              <button
                type="button"
                className="drawer-apply-btn"
                onClick={() => setMobileDrawerOpen(false)}
              >
                <span>Afficher les {totalResults} document{totalResults > 1 ? 's' : ''}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
