'use client';

import React, { useState, useEffect, useMemo } from 'react';
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

const RELIGION_ACCESS_PLANS: { key: ReligionPlanRequired; label: string; dotColor: string }[] = [
  { key: 'gratuit', label: 'Gratuit', dotColor: '#10b981' },
  { key: 'simple', label: 'Simple', dotColor: '#3b82f6' },
  { key: 'recommande', label: 'Recommandé', dotColor: '#6366f1' },
  { key: 'gold', label: 'Gold', dotColor: '#f59e0b' },
];

const EPOCH_OPTIONS = [
  { value: 'all', label: 'Toutes les époques' },
  { value: 'before-1800', label: 'Classique (< 1800)' },
  { value: '1800-1950', label: 'XIXe & début XXe (1800-1950)' },
  { value: 'post-1950', label: 'Contemporain (> 1950)' },
];

const SORT_OPTIONS: { value: 'pertinence' | 'recent' | 'titre' | 'auteur'; label: string }[] = [
  { value: 'pertinence', label: 'Pertinence & Vues' },
  { value: 'recent', label: 'Année / Époque' },
  { value: 'titre', label: 'Titre (A-Z)' },
  { value: 'auteur', label: 'Auteur (A-Z)' },
];

interface MobileReligionFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ReligionFilterState;
  traditions: ReligionTradition[];
  branches: ReligionBranch[];
  onFilterChange: (newFilters: Partial<ReligionFilterState>) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export const MobileReligionFilterDrawer: React.FC<MobileReligionFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  traditions,
  branches,
  onFilterChange,
  onResetFilters,
  totalResults,
}) => {
  // Gestion de l'ouverture individuelle par catégorie (accordéon)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    tradition: true, // Ouvert par défaut pour accès immédiat
    branch: false,
    content: false,
    author: false,
    epoch: false,
    access: false,
    sort: false,
  });

  const [authorSearch, setAuthorSearch] = useState('');

  // Verrouillage du scroll arrière-plan quand le tiroir est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Ouvrir la section qui contient un filtre actif s'il y en a un
      if (filters.branchId !== 'all') {
        setOpenSections((prev) => ({ ...prev, branch: true }));
      }
      if (filters.author !== 'all') {
        setOpenSections((prev) => ({ ...prev, author: true }));
      }
    } else {
      document.body.style.overflow = '';
      setAuthorSearch('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, filters.branchId, filters.author]);

  const toggleSection = (sectionKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

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

  const filteredAuthors = useMemo(() => {
    if (!authorSearch.trim()) return availableAuthors;
    const q = authorSearch.toLowerCase().trim();
    return availableAuthors.filter((a) => a.toLowerCase().includes(q));
  }, [availableAuthors, authorSearch]);

  // Libellés sélectionnés pour le résumé de chaque catégorie
  const selectedTraditionLabel = useMemo(() => {
    if (filters.traditionId === 'all') return 'Toutes les traditions';
    return traditions.find((t) => t.id === filters.traditionId)?.title || 'Sélectionné';
  }, [filters.traditionId, traditions]);

  const selectedBranchLabel = useMemo(() => {
    if (filters.branchId === 'all') return 'Tous les courants';
    return availableBranches.find((b) => b.id === filters.branchId)?.title || 'Sélectionné';
  }, [filters.branchId, availableBranches]);

  const selectedContentLabel = useMemo(() => {
    if (filters.contentType === 'all') return 'Tous les formats';
    return RELIGION_CONTENT_TYPES.find((c) => c.id === filters.contentType)?.label || 'Sélectionné';
  }, [filters.contentType]);

  const selectedAuthorLabel = useMemo(() => {
    if (filters.author === 'all') return 'Tous les auteurs';
    return filters.author;
  }, [filters.author]);

  const selectedEpochLabel = useMemo(() => {
    const found = EPOCH_OPTIONS.find((e) => e.value === filters.year);
    return found ? found.label : 'Toutes les époques';
  }, [filters.year]);

  const selectedPlanLabel = useMemo(() => {
    if (filters.requiredPlan === 'all') return 'Toutes les formules';
    const found = RELIGION_ACCESS_PLANS.find((p) => p.key === filters.requiredPlan);
    return found ? found.label : 'Sélectionné';
  }, [filters.requiredPlan]);

  const selectedSortLabel = useMemo(() => {
    const found = SORT_OPTIONS.find((s) => s.value === filters.sortBy);
    return found ? found.label : 'Pertinence & Vues';
  }, [filters.sortBy]);

  // Détection des catégories actives
  const isTraditionActive = filters.traditionId !== 'all';
  const isBranchActive = filters.branchId !== 'all';
  const isContentActive = filters.contentType !== 'all';
  const isAuthorActive = filters.author !== 'all';
  const isEpochActive = filters.year !== 'all';
  const isPlanActive = filters.requiredPlan !== 'all';
  const isSortActive = filters.sortBy !== 'pertinence';

  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Poignée de glissement tactile */}
        <div className="drawer-handle" />

        {/* Header du tiroir */}
        <div className="drawer-header">
          <div className="drawer-title-wrap">
            <h2 className="drawer-title">Filtres de recherche</h2>
            <button
              type="button"
              className="drawer-reset-link"
              onClick={onResetFilters}
            >
              Réinitialiser
            </button>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Fermer les filtres"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Corps accordéon scrollable */}
        <div className="drawer-body">
          {/* =========================================================================
              1. GRANDE TRADITION
             ========================================================================= */}
          <div className={`drawer-accordion-card ${isTraditionActive ? 'is-filtered' : ''}`}>
            <button
              type="button"
              className={`accordion-trigger ${openSections.tradition ? 'is-open' : ''}`}
              onClick={() => toggleSection('tradition')}
            >
              <div className="accordion-title-box">
                <span className="accordion-icon">🏛️</span>
                <div className="accordion-texts">
                  <span className="category-title">Grande Tradition</span>
                  <span className="category-subtitle">{selectedTraditionLabel}</span>
                </div>
              </div>

              <div className="accordion-action-box">
                {isTraditionActive && <span className="active-dot" />}
                <svg
                  className={`chevron-icon ${openSections.tradition ? 'rotated' : ''}`}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </button>

            {openSections.tradition && (
              <div className="accordion-expanded-content">
                <div className="drawer-pills-wrap">
                  <button
                    type="button"
                    className={`drawer-pill ${filters.traditionId === 'all' ? 'active' : ''}`}
                    onClick={() =>
                      onFilterChange({ traditionId: 'all', branchId: 'all', page: 1 })
                    }
                  >
                    Toutes les traditions
                  </button>
                  {traditions.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={`drawer-pill ${filters.traditionId === t.id ? 'active' : ''}`}
                      onClick={() =>
                        onFilterChange({
                          traditionId: t.id,
                          branchId: 'all',
                          page: 1,
                        })
                      }
                    >
                      {t.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* =========================================================================
              2. COURANT & CONFRÉRIE
             ========================================================================= */}
          <div className={`drawer-accordion-card ${isBranchActive ? 'is-filtered' : ''}`}>
            <button
              type="button"
              className={`accordion-trigger ${openSections.branch ? 'is-open' : ''}`}
              onClick={() => toggleSection('branch')}
            >
              <div className="accordion-title-box">
                <span className="accordion-icon">📿</span>
                <div className="accordion-texts">
                  <span className="category-title">Courant &amp; Confrérie</span>
                  <span className="category-subtitle">{selectedBranchLabel}</span>
                </div>
              </div>

              <div className="accordion-action-box">
                {isBranchActive && <span className="active-dot" />}
                <svg
                  className={`chevron-icon ${openSections.branch ? 'rotated' : ''}`}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </button>

            {openSections.branch && (
              <div className="accordion-expanded-content">
                <div className="drawer-pills-wrap">
                  <button
                    type="button"
                    className={`drawer-pill ${filters.branchId === 'all' ? 'active' : ''}`}
                    onClick={() => onFilterChange({ branchId: 'all', page: 1 })}
                  >
                    Tous les courants
                  </button>
                  {availableBranches.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      className={`drawer-pill ${filters.branchId === b.id ? 'active' : ''}`}
                      onClick={() => onFilterChange({ branchId: b.id, page: 1 })}
                    >
                      {b.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* =========================================================================
              3. TYPE DE DOCUMENT / FORMAT
             ========================================================================= */}
          <div className={`drawer-accordion-card ${isContentActive ? 'is-filtered' : ''}`}>
            <button
              type="button"
              className={`accordion-trigger ${openSections.content ? 'is-open' : ''}`}
              onClick={() => toggleSection('content')}
            >
              <div className="accordion-title-box">
                <span className="accordion-icon">📄</span>
                <div className="accordion-texts">
                  <span className="category-title">Format / Document</span>
                  <span className="category-subtitle">{selectedContentLabel}</span>
                </div>
              </div>

              <div className="accordion-action-box">
                {isContentActive && <span className="active-dot" />}
                <svg
                  className={`chevron-icon ${openSections.content ? 'rotated' : ''}`}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </button>

            {openSections.content && (
              <div className="accordion-expanded-content">
                <div className="drawer-pills-wrap">
                  <button
                    type="button"
                    className={`drawer-pill ${filters.contentType === 'all' ? 'active' : ''}`}
                    onClick={() => onFilterChange({ contentType: 'all', page: 1 })}
                  >
                    Tous les formats
                  </button>
                  {RELIGION_CONTENT_TYPES.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      className={`drawer-pill ${filters.contentType === type.id ? 'active' : ''}`}
                      onClick={() => onFilterChange({ contentType: type.id, page: 1 })}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* =========================================================================
              4. AUTEURS ET FIGURES SPIRITUELLES (Avec barre de recherche rapide)
             ========================================================================= */}
          <div className={`drawer-accordion-card ${isAuthorActive ? 'is-filtered' : ''}`}>
            <button
              type="button"
              className={`accordion-trigger ${openSections.author ? 'is-open' : ''}`}
              onClick={() => toggleSection('author')}
            >
              <div className="accordion-title-box">
                <span className="accordion-icon">👤</span>
                <div className="accordion-texts">
                  <span className="category-title">Auteurs &amp; Figures</span>
                  <span className="category-subtitle">{selectedAuthorLabel}</span>
                </div>
              </div>

              <div className="accordion-action-box">
                {isAuthorActive && <span className="active-dot" />}
                <svg
                  className={`chevron-icon ${openSections.author ? 'rotated' : ''}`}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </button>

            {openSections.author && (
              <div className="accordion-expanded-content">
                {/* Recherche rapide dans la liste des auteurs */}
                <div className="drawer-search-box">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    className="drawer-search-input"
                    placeholder="Filtrer un auteur (Bamba, Malick Sy...)"
                    value={authorSearch}
                    onChange={(e) => setAuthorSearch(e.target.value)}
                  />
                  {authorSearch && (
                    <button
                      type="button"
                      className="drawer-search-clear"
                      onClick={() => setAuthorSearch('')}
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="drawer-pills-wrap author-pills-wrap">
                  <button
                    type="button"
                    className={`drawer-pill ${filters.author === 'all' ? 'active' : ''}`}
                    onClick={() => onFilterChange({ author: 'all', page: 1 })}
                  >
                    Tous les auteurs
                  </button>
                  {filteredAuthors.map((author) => (
                    <button
                      key={author}
                      type="button"
                      className={`drawer-pill ${filters.author === author ? 'active' : ''}`}
                      onClick={() => onFilterChange({ author, page: 1 })}
                    >
                      {author}
                    </button>
                  ))}
                  {filteredAuthors.length === 0 && (
                    <p className="no-author-found">Aucun auteur correspondant</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* =========================================================================
              5. ÉPOQUE / PÉRIODE
             ========================================================================= */}
          <div className={`drawer-accordion-card ${isEpochActive ? 'is-filtered' : ''}`}>
            <button
              type="button"
              className={`accordion-trigger ${openSections.epoch ? 'is-open' : ''}`}
              onClick={() => toggleSection('epoch')}
            >
              <div className="accordion-title-box">
                <span className="accordion-icon">⏳</span>
                <div className="accordion-texts">
                  <span className="category-title">Époque / Siècle</span>
                  <span className="category-subtitle">{selectedEpochLabel}</span>
                </div>
              </div>

              <div className="accordion-action-box">
                {isEpochActive && <span className="active-dot" />}
                <svg
                  className={`chevron-icon ${openSections.epoch ? 'rotated' : ''}`}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </button>

            {openSections.epoch && (
              <div className="accordion-expanded-content">
                <div className="drawer-pills-wrap">
                  {EPOCH_OPTIONS.map((epoch) => (
                    <button
                      key={epoch.value}
                      type="button"
                      className={`drawer-pill ${filters.year === epoch.value ? 'active' : ''}`}
                      onClick={() => onFilterChange({ year: epoch.value, page: 1 })}
                    >
                      {epoch.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* =========================================================================
              6. FORMULE D'ACCÈS
             ========================================================================= */}
          <div className={`drawer-accordion-card ${isPlanActive ? 'is-filtered' : ''}`}>
            <button
              type="button"
              className={`accordion-trigger ${openSections.access ? 'is-open' : ''}`}
              onClick={() => toggleSection('access')}
            >
              <div className="accordion-title-box">
                <span className="accordion-icon">💎</span>
                <div className="accordion-texts">
                  <span className="category-title">Formule d’accès</span>
                  <span className="category-subtitle">{selectedPlanLabel}</span>
                </div>
              </div>

              <div className="accordion-action-box">
                {isPlanActive && <span className="active-dot" />}
                <svg
                  className={`chevron-icon ${openSections.access ? 'rotated' : ''}`}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </button>

            {openSections.access && (
              <div className="accordion-expanded-content">
                <div className="drawer-pills-wrap">
                  <button
                    type="button"
                    className={`drawer-pill ${filters.requiredPlan === 'all' ? 'active' : ''}`}
                    onClick={() => onFilterChange({ requiredPlan: 'all', page: 1 })}
                  >
                    Toutes les formules
                  </button>
                  {RELIGION_ACCESS_PLANS.map((plan) => {
                    const isSelected = filters.requiredPlan === plan.key;
                    return (
                      <button
                        key={plan.key}
                        type="button"
                        className={`drawer-pill ${isSelected ? 'active' : ''}`}
                        onClick={() => onFilterChange({ requiredPlan: plan.key, page: 1 })}
                      >
                        <span
                          className="plan-dot"
                          style={{ background: plan.dotColor }}
                        />
                        <span>{plan.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* =========================================================================
              7. ORDRE DE TRI
             ========================================================================= */}
          <div className={`drawer-accordion-card ${isSortActive ? 'is-filtered' : ''}`}>
            <button
              type="button"
              className={`accordion-trigger ${openSections.sort ? 'is-open' : ''}`}
              onClick={() => toggleSection('sort')}
            >
              <div className="accordion-title-box">
                <span className="accordion-icon">↕️</span>
                <div className="accordion-texts">
                  <span className="category-title">Ordre de tri</span>
                  <span className="category-subtitle">{selectedSortLabel}</span>
                </div>
              </div>

              <div className="accordion-action-box">
                {isSortActive && <span className="active-dot" />}
                <svg
                  className={`chevron-icon ${openSections.sort ? 'rotated' : ''}`}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </button>

            {openSections.sort && (
              <div className="accordion-expanded-content">
                <div className="drawer-pills-wrap">
                  {SORT_OPTIONS.map((sort) => (
                    <button
                      key={sort.value}
                      type="button"
                      className={`drawer-pill ${filters.sortBy === sort.value ? 'active' : ''}`}
                      onClick={() => onFilterChange({ sortBy: sort.value, page: 1 })}
                    >
                      {sort.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pied de page collant avec bouton d'application */}
        <div className="drawer-footer">
          <button
            type="button"
            className="btn-primary drawer-apply-btn"
            onClick={onClose}
          >
            Afficher les {totalResults} document{totalResults > 1 ? 's' : ''}
          </button>
        </div>
      </div>

      <style jsx>{`
        .drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          z-index: 9999;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          animation: fade-in 0.2s ease-out;
        }

        .drawer-sheet {
          background: #ffffff;
          width: 100%;
          max-width: 540px;
          max-height: 88vh;
          border-radius: 24px 24px 0 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.25);
          animation: slide-up 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .drawer-handle {
          width: 42px;
          height: 5px;
          border-radius: 9999px;
          background: #cbd5e1;
          margin: 12px auto 6px;
          flex-shrink: 0;
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px 14px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.85);
          flex-shrink: 0;
        }

        .drawer-title-wrap {
          display: flex;
          align-items: baseline;
          gap: 12px;
        }

        .drawer-title {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .drawer-reset-link {
          background: transparent;
          border: none;
          font-size: 13px;
          font-weight: 700;
          color: #4f46e5;
          cursor: pointer;
          padding: 0;
          transition: opacity 0.15s;
        }

        .drawer-reset-link:hover {
          opacity: 0.8;
          text-decoration: underline;
        }

        .drawer-close-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .drawer-close-btn:hover {
          color: #0f172a;
          background: #f1f5f9;
        }

        .drawer-body {
          padding: 16px 18px;
          overflow-y: auto;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #f8fafc;
        }

        /* Cartes d'accordéon */
        .drawer-accordion-card {
          background: #ffffff;
          border: 1.5px solid rgba(226, 232, 240, 0.9);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .drawer-accordion-card.is-filtered {
          border-color: rgba(99, 102, 241, 0.4);
          background: #ffffff;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.06);
        }

        .accordion-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 13px 16px;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: background 0.15s ease;
        }

        .accordion-trigger:hover {
          background: #fafaff;
        }

        .accordion-title-box {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 0;
        }

        .accordion-icon {
          font-size: 18px;
          flex-shrink: 0;
        }

        .accordion-texts {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .category-title {
          font-size: 13px;
          font-weight: 700;
          color: #1e293b;
          line-height: 1.2;
        }

        .category-subtitle {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .drawer-accordion-card.is-filtered .category-subtitle {
          color: #4f46e5;
          font-weight: 700;
        }

        .accordion-action-box {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          margin-left: 8px;
        }

        .active-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #6366f1;
        }

        .chevron-icon {
          color: #94a3b8;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .chevron-icon.rotated {
          transform: rotate(180deg);
          color: #4f46e5;
        }

        /* Contenu déplié */
        .accordion-expanded-content {
          padding: 12px 16px 16px;
          border-top: 1px solid rgba(241, 245, 249, 0.95);
          background: #ffffff;
          animation: accordion-down 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes accordion-down {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .drawer-pills-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .author-pills-wrap {
          max-height: 240px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .drawer-search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 7px 12px;
          margin-bottom: 12px;
        }

        .drawer-search-box:focus-within {
          border-color: #4f46e5;
          background: #ffffff;
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.12);
        }

        .drawer-search-input {
          width: 100%;
          border: none;
          background: transparent;
          font-size: 13px;
          color: #0f172a;
          outline: none;
        }

        .drawer-search-clear {
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 12px;
          cursor: pointer;
        }

        .no-author-found {
          font-size: 12.5px;
          color: #94a3b8;
          padding: 8px 0;
          margin: 0;
          width: 100%;
          text-align: center;
        }

        .drawer-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          font-weight: 500;
          color: #334155;
          background: #f8fafc;
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 9999px;
          padding: 6px 13px;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
        }

        .drawer-pill:hover {
          background: #f1f5f9;
          border-color: rgba(99, 102, 241, 0.3);
          color: #4f46e5;
        }

        .drawer-pill:active {
          transform: scale(0.97);
        }

        .drawer-pill.active {
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #9333ea 100%);
          color: #ffffff;
          border-color: transparent;
          font-weight: 700;
          box-shadow: 0 3px 12px -2px rgba(99, 102, 241, 0.4);
        }

        .plan-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          display: inline-block;
        }

        .drawer-pill.active .plan-dot {
          box-shadow: 0 0 0 1.5px rgba(255, 255, 255, 0.9);
        }

        .drawer-footer {
          padding: 14px 20px 20px;
          border-top: 1px solid rgba(226, 232, 240, 0.85);
          background: #ffffff;
          flex-shrink: 0;
        }

        .drawer-apply-btn {
          width: 100%;
          justify-content: center;
          padding: 13px 20px;
          font-size: 14.5px;
          font-weight: 700;
          border-radius: 12px;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
