'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';
import { ReligionHero } from '@/components/religion/ReligionHero';
import { TraditionsOverview } from '@/components/religion/TraditionsOverview';
import { SenegalReligionsSection } from '@/components/religion/SenegalReligionsSection';
import { ReligionBreadcrumb } from '@/components/religion/ReligionBreadcrumb';
import { ReligionResourceCard } from '@/components/religion/ReligionResourceCard';
import { ReligionEmptyState } from '@/components/religion/ReligionEmptyState';
import { ReligionFilters } from '@/components/religion/ReligionFilters';
import { MobileReligionFilterDrawer } from '@/components/religion/MobileReligionFilterDrawer';
import { ReligionResourceModal } from '@/components/religion/ReligionResourceModal';
import { ReligionCTA } from '@/components/religion/ReligionCTA';
import { religionService } from '@/services/religionService';
import {
  ReligionTradition,
  ReligionBranch,
  ReligionThemeCategory,
  ReligionResource,
  ReligionFilterState,
  ReligionTraditionId,
  ReligionBranchId,
  ReligionThemeCategoryId,
} from '@/types/religion';
import {
  RELIGION_TRADITIONS,
  RELIGION_BRANCHES,
  RELIGION_THEME_CATEGORIES,
  INITIAL_RELIGION_RESOURCES,
} from '@/data/mockReligion';

const DEFAULT_FILTERS: ReligionFilterState = {
  searchQuery: '',
  traditionId: 'all',
  branchId: 'all',
  themeCategoryId: 'all',
  contentType: 'all',
  author: 'all',
  year: 'all',
  requiredPlan: 'all',
  sortBy: 'pertinence',
  page: 1,
  perPage: 9,
};

export default function ReligionPage() {
  // Navigation hiérarchique active
  const [selectedTraditionId, setSelectedTraditionId] = useState<ReligionTraditionId | null>('islam');
  const [selectedBranchId, setSelectedBranchId] = useState<ReligionBranchId | null>('mouride-touba');
  const [selectedThemeCategoryId, setSelectedThemeCategoryId] = useState<ReligionThemeCategoryId | 'all'>('all');

  // Filtres de recherche
  const [filters, setFilters] = useState<ReligionFilterState>({
    ...DEFAULT_FILTERS,
    traditionId: 'islam',
    branchId: 'mouride-touba',
  });

  // Données
  const [traditions] = useState<ReligionTradition[]>(RELIGION_TRADITIONS);
  const [branches] = useState<ReligionBranch[]>(RELIGION_BRANCHES);
  const [themeCategories] = useState<ReligionThemeCategory[]>(RELIGION_THEME_CATEGORIES);
  const [resources, setResources] = useState<ReligionResource[]>([]);
  const [totalResources, setTotalResources] = useState(INITIAL_RELIGION_RESOURCES.length);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<ReligionResource | null>(null);

  // Auth modal
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  // Chargement des ressources avec debounce / async
  const loadResources = useCallback(async (currentFilters: ReligionFilterState) => {
    setIsLoading(true);
    try {
      const result = await religionService.getResources(currentFilters);
      setResources(result.resources);
      setTotalResources(result.total);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error('Erreur lors du chargement des ressources religion:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResources(filters);
  }, [filters, loadResources]);

  // Synchronisation de la navigation hiérarchique
  const handleSelectTradition = (traditionId: ReligionTraditionId) => {
    setSelectedTraditionId(traditionId);
    setSelectedBranchId(null);
    setSelectedThemeCategoryId('all');

    setFilters((prev) => ({
      ...prev,
      traditionId: traditionId,
      branchId: 'all',
      themeCategoryId: 'all',
      page: 1,
    }));

    const el = document.getElementById('ressources-religieuses');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectBranch = (traditionId: ReligionTraditionId, branchId: ReligionBranchId) => {
    setSelectedTraditionId(traditionId);
    setSelectedBranchId(branchId);
    setSelectedThemeCategoryId('all');

    setFilters((prev) => ({
      ...prev,
      traditionId: traditionId,
      branchId: branchId || 'all',
      themeCategoryId: 'all',
      page: 1,
    }));

    const el = document.getElementById('ressources-religieuses');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectThemeCategory = (themeId: ReligionThemeCategoryId | 'all') => {
    setSelectedThemeCategoryId(themeId);
    setFilters((prev) => ({
      ...prev,
      themeCategoryId: themeId,
      page: 1,
    }));
  };

  const handleResetNavigation = () => {
    setSelectedTraditionId(null);
    setSelectedBranchId(null);
    setSelectedThemeCategoryId('all');
    setFilters((prev) => ({
      ...prev,
      traditionId: 'all',
      branchId: 'all',
      themeCategoryId: 'all',
      page: 1,
    }));
  };

  const handleFilterChange = (newFilters: Partial<ReligionFilterState>) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };

      if (newFilters.traditionId !== undefined) {
        setSelectedTraditionId(newFilters.traditionId === 'all' ? null : (newFilters.traditionId as ReligionTraditionId));
      }
      if (newFilters.branchId !== undefined) {
        setSelectedBranchId(newFilters.branchId === 'all' ? null : (newFilters.branchId as ReligionBranchId));
      }
      if (newFilters.themeCategoryId !== undefined) {
        setSelectedThemeCategoryId(newFilters.themeCategoryId);
      }

      return updated;
    });
  };

  const handleResetAllFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSelectedTraditionId(null);
    setSelectedBranchId(null);
    setSelectedThemeCategoryId('all');
  };

  // Entités actuelles pour le Fil d'Ariane
  const currentTraditionObj = traditions.find((t) => t.id === selectedTraditionId) || null;
  const currentBranchObj = branches.find((b) => b.id === selectedBranchId) || null;
  const currentThemeObj =
    selectedThemeCategoryId !== 'all'
      ? themeCategories.find((th) => th.id === selectedThemeCategoryId) || null
      : null;

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery.trim()) count++;
    if (filters.traditionId !== 'all') count++;
    if (filters.branchId !== 'all') count++;
    if (filters.themeCategoryId !== 'all') count++;
    if (filters.contentType !== 'all') count++;
    if (filters.author !== 'all') count++;
    if (filters.year !== 'all') count++;
    if (filters.requiredPlan !== 'all') count++;
    return count;
  }, [filters]);

  const handleHeroSearchSubmit = () => {
    const el = document.getElementById('ressources-religieuses');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="religion-page-wrapper">
      {/* Navigation globale Sunubiblio */}
      <Navbar onOpenAuth={handleOpenAuth} activePage="religion" />

      <main className="religion-main-content">
        {/* =========================================================================
            1. HERO : Titre « Religion & Spiritualités », sous-titre & recherche
           ========================================================================= */}
        <ReligionHero
          searchQuery={filters.searchQuery}
          onSearchChange={(q) => handleFilterChange({ searchQuery: q, page: 1 })}
          onSearchSubmit={handleHeroSearchSubmit}
          onSelectTag={(tag) => {
            const branch = branches.find(
              (b) =>
                b.title.toLowerCase().includes(tag.toLowerCase()) ||
                tag.toLowerCase().includes(b.title.toLowerCase())
            );
            if (branch) {
              handleSelectBranch(branch.traditionId, branch.id);
            } else {
              handleFilterChange({ searchQuery: tag, page: 1 });
              handleHeroSearchSubmit();
            }
          }}
          totalCount={INITIAL_RELIGION_RESOURCES.length}
        />

        {/* =========================================================================
            2. LES 8 GRANDES TRADITIONS SPIRITUELLES (Avant le Sénégal)
           ========================================================================= */}
        <TraditionsOverview
          traditions={traditions}
          selectedTraditionId={selectedTraditionId}
          onSelectTradition={handleSelectTradition}
        />

        {/* =========================================================================
            3. RELIGIONS ET SPIRITUALITÉS AU SÉNÉGAL (Islam, Christianisme, Sagesses)
           ========================================================================= */}
        <SenegalReligionsSection
          branches={branches}
          selectedBranchId={selectedBranchId}
          onSelectBranch={handleSelectBranch}
        />

        {/* =========================================================================
            4. RESSOURCES : Hiérarchie, Onglets Thématiques & Grille de Cartes
           ========================================================================= */}
        <section className="religion-resources-section" id="ressources-religieuses">
          <div className="container">
            {/* Breadcrumb dynamique */}
            <div className="resources-breadcrumb-wrap">
              <ReligionBreadcrumb
                tradition={currentTraditionObj}
                branch={currentBranchObj}
                themeCategory={currentThemeObj}
                onNavigateRoot={handleResetNavigation}
                onNavigateTradition={() => {
                  if (selectedTraditionId) handleSelectTradition(selectedTraditionId);
                }}
                onNavigateBranch={() => {
                  if (selectedTraditionId && selectedBranchId) {
                    handleSelectBranch(selectedTraditionId, selectedBranchId);
                  }
                }}
              />
            </div>

            {/* En-tête de la section ressources */}
            <div className="resources-stage-header">
              <div className="resources-stage-titles">
                <span className="stage-badge">
                  {currentBranchObj ? 'Courant sélectionné' : currentTraditionObj ? 'Tradition sélectionnée' : 'Fonds spirituel'}
                </span>
                <h2 className="stage-title">
                  {currentBranchObj
                    ? currentBranchObj.title
                    : currentTraditionObj
                    ? currentTraditionObj.title
                    : 'Ressources & Écrits Authentiques'}
                </h2>
                <p className="stage-subtitle">
                  {currentBranchObj?.description ||
                    currentTraditionObj?.description ||
                    'Consultez les manuscrits, traités historiques, poésies mystiques et cours fondamentaux numérisés.'}
                </p>
              </div>

              {/* Les 8 Catégories Thématiques Universelles sous forme d'onglets Sunubiblio */}
              <div className="theme-pills-scroller">
                <button
                  type="button"
                  className={`theme-tab-pill ${selectedThemeCategoryId === 'all' ? 'active' : ''}`}
                  onClick={() => handleSelectThemeCategory('all')}
                >
                  Toutes les catégories
                </button>
                {themeCategories.map((th) => {
                  const isActive = selectedThemeCategoryId === th.id;
                  return (
                    <button
                      key={th.id}
                      type="button"
                      className={`theme-tab-pill ${isActive ? 'active' : ''}`}
                      onClick={() => handleSelectThemeCategory(th.id)}
                    >
                      {th.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grille de cartes de ressources / Loading / Empty state */}
            {isLoading ? (
              <div className="religion-loading-box">
                <div className="loading-spinner" />
                <p>Chargement des ressources authentiques...</p>
              </div>
            ) : resources.length > 0 ? (
              <div className="religion-cards-grid">
                {resources.map((res) => (
                  <ReligionResourceCard
                    key={res.id}
                    resource={res}
                    onConsult={setSelectedResource}
                  />
                ))}
              </div>
            ) : (
              <ReligionEmptyState
                onReset={handleResetAllFilters}
                hasFilter={Boolean(filters.searchQuery || filters.author !== 'all' || filters.themeCategoryId !== 'all')}
              />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="religion-pagination-bar">
                <button
                  type="button"
                  className="pagination-btn"
                  disabled={filters.page <= 1}
                  onClick={() => handleFilterChange({ page: filters.page - 1 })}
                >
                  ← Précédent
                </button>
                <div className="pagination-pages-indicator">
                  Page <span className="current-page">{filters.page}</span> sur {totalPages} ({totalResources} document{totalResources > 1 ? 's' : ''})
                </div>
                <button
                  type="button"
                  className="pagination-btn"
                  disabled={filters.page >= totalPages}
                  onClick={() => handleFilterChange({ page: filters.page + 1 })}
                >
                  Suivant →
                </button>
              </div>
            )}
          </div>
        </section>

        {/* =========================================================================
            5. RECHERCHE ET FILTRES (Zone multi-critères connectée aux données réelles)
           ========================================================================= */}
        <section className="religion-filters-section" id="filtres-recherche">
          <div className="container">
            <div className="section-header">
              <div className="header-left">
                <div className="section-icon-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <div>
                  <h2 className="section-title">Recherche avancée &amp; filtres</h2>
                  <p className="section-subtitle">
                    Filtrez par tradition, courant, auteur, type de ressource, époque ou formule requise.
                  </p>
                </div>
              </div>
            </div>

            <ReligionFilters
              filters={filters}
              traditions={traditions}
              branches={branches}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetAllFilters}
              onOpenMobileDrawer={() => setMobileDrawerOpen(true)}
              activeFiltersCount={activeFiltersCount}
            />
          </div>
        </section>

        {/* =========================================================================
            6. CTA VERS LA BIBLIOTHÈQUE GÉNÉRALE
           ========================================================================= */}
        <ReligionCTA />
      </main>

      {/* Footer institutionnel global */}
      <Footer />

      {/* Tiroir de filtres pour smartphone */}
      <MobileReligionFilterDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        filters={filters}
        traditions={traditions}
        branches={branches}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetAllFilters}
        totalResults={totalResources}
      />

      {/* Modal de consultation et vérification des droits côté serveur */}
      <ReligionResourceModal
        resource={selectedResource}
        tradition={currentTraditionObj}
        branch={currentBranchObj}
        onClose={() => setSelectedResource(null)}
        onOpenAuth={() => handleOpenAuth('login')}
      />

      {/* Modal d'authentification */}
      <AuthModal
        isOpen={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
      />

      <style jsx>{`
        .religion-page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #ffffff;
        }

        .religion-main-content {
          flex: 1;
        }

        .religion-resources-section {
          padding: 44px 0 52px 0;
          background: #ffffff;
          border-bottom: 1px solid rgba(226, 232, 240, 0.75);
        }

        .resources-breadcrumb-wrap {
          margin-bottom: 24px;
        }

        .resources-stage-header {
          margin-bottom: 28px;
        }

        .stage-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #4f46e5;
          background: #eef2ff;
          padding: 4px 10px;
          border-radius: 9999px;
          margin-bottom: 8px;
        }

        .stage-title {
          font-size: clamp(22px, 3vw, 28px);
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 8px 0;
          letter-spacing: -0.02em;
        }

        .stage-subtitle {
          font-size: 14.5px;
          color: #64748b;
          margin: 0 0 20px 0;
          max-width: 800px;
          line-height: 1.55;
        }

        .theme-pills-scroller {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: thin;
          padding-bottom: 6px;
        }

        .theme-tab-pill {
          display: inline-flex;
          align-items: center;
          padding: 8px 16px;
          border-radius: 9999px;
          border: 1px solid rgba(226, 232, 240, 0.85);
          background: #f8fafc;
          color: #475569;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .theme-tab-pill:hover {
          background: #f1f5f9;
          color: #0f172a;
          border-color: #cbd5e1;
        }

        .theme-tab-pill.active {
          background: #1e1b4b;
          color: #ffffff;
          border-color: #1e1b4b;
          box-shadow: 0 4px 14px rgba(30, 27, 75, 0.18);
        }

        .religion-loading-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          gap: 14px;
          color: #64748b;
          font-size: 14px;
        }

        .loading-spinner {
          width: 36px;
          height: 36px;
          border: 3px solid rgba(99, 102, 241, 0.2);
          border-top-color: #4f46e5;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .religion-pagination-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 36px;
          padding-top: 24px;
          border-top: 1px solid rgba(241, 245, 249, 0.9);
        }

        .pagination-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          border-radius: 10px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          background: #ffffff;
          color: #334155;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pagination-btn:hover:not(:disabled) {
          border-color: #4f46e5;
          color: #4f46e5;
          background: #fafaff;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-pages-indicator {
          font-size: 13.5px;
          color: #64748b;
          font-weight: 500;
        }

        .current-page {
          font-weight: 700;
          color: #0f172a;
        }

        .religion-filters-section {
          padding: 40px 0;
          background: #f8fafc;
          border-bottom: 1px solid rgba(226, 232, 240, 0.75);
        }
      `}</style>
    </div>
  );
}
