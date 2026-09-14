'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';
import { ReligionHero } from '@/components/religion/ReligionHero';
import { ReligionBreadcrumb } from '@/components/religion/ReligionBreadcrumb';
import { IslamSenegalSection } from '@/components/religion/IslamSenegalSection';
import { TraditionsOverview } from '@/components/religion/TraditionsOverview';
import { ReligionFilters } from '@/components/religion/ReligionFilters';
import { MobileReligionFilterDrawer } from '@/components/religion/MobileReligionFilterDrawer';
import { ReligionHierarchyNavigator } from '@/components/religion/ReligionHierarchyNavigator';
import { ReligionPopularResources } from '@/components/religion/ReligionPopularResources';
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
  perPage: 12,
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
  const [popularResources, setPopularResources] = useState<ReligionResource[]>([]);
  const [totalResources, setTotalResources] = useState(INITIAL_RELIGION_RESOURCES.length);

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
    } catch (err) {
      console.error('Erreur lors du chargement des ressources religion:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResources(filters);
  }, [filters, loadResources]);

  useEffect(() => {
    religionService.getPopularResources().then(setPopularResources);
  }, []);

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

    const el = document.getElementById('hierarchie-religion');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectBranch = (branchId: ReligionBranchId) => {
    setSelectedBranchId(branchId);
    setSelectedThemeCategoryId('all');

    const branch = branches.find((b) => b.id === branchId);
    if (branch) {
      setSelectedTraditionId(branch.traditionId);
    }

    setFilters((prev) => ({
      ...prev,
      traditionId: branch ? branch.traditionId : prev.traditionId,
      branchId: branchId || 'all',
      themeCategoryId: 'all',
      page: 1,
    }));

    const el = document.getElementById('hierarchie-religion');
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

  // Reset vers la racine Religion
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

  // Gestion des filtres
  const handleFilterChange = (newFilters: Partial<ReligionFilterState>) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters, page: newFilters.page || 1 };

      if (newFilters.traditionId !== undefined) {
        setSelectedTraditionId(newFilters.traditionId === 'all' ? null : newFilters.traditionId);
      }
      if (newFilters.branchId !== undefined) {
        setSelectedBranchId(newFilters.branchId === 'all' ? null : newFilters.branchId);
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
    if (filters.year !== 'all') count++;
    if (filters.requiredPlan !== 'all') count++;
    return count;
  }, [filters]);

  const handleHeroSearchSubmit = () => {
    const el = document.getElementById('hierarchie-religion');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="religion-page-wrapper">
      {/* 1. Header existant */}
      <Navbar onOpenAuth={handleOpenAuth} activePage="religion" />

      <main className="religion-main-content">
        {/* 2. Breadcrumb : Accueil → Religion */}
        <ReligionBreadcrumb
          tradition={currentTraditionObj}
          branch={currentBranchObj}
          themeCategory={currentThemeObj}
          onNavigateRoot={handleResetNavigation}
          onNavigateTradition={() => {
            if (selectedTraditionId) handleSelectTradition(selectedTraditionId);
          }}
          onNavigateBranch={() => {
            if (selectedBranchId) handleSelectBranch(selectedBranchId);
          }}
        />

        {/* 3. Hero Section avec Titre « Religion », texte explicatif et recherche */}
        <ReligionHero
          searchQuery={filters.searchQuery}
          onSearchChange={(q) => handleFilterChange({ searchQuery: q })}
          onSearchSubmit={handleHeroSearchSubmit}
          totalCount={INITIAL_RELIGION_RESOURCES.length}
        />

        {/* 4. Section prioritaire : Islam au Sénégal */}
        <IslamSenegalSection
          branches={branches}
          selectedBranchId={selectedBranchId}
          onSelectBranch={handleSelectBranch}
        />

        {/* 5. Section des 8 Grandes Traditions Religieuses */}
        <TraditionsOverview
          traditions={traditions}
          selectedTraditionId={selectedTraditionId}
          onSelectTradition={handleSelectTradition}
        />

        {/* 6. Barre de Recherche et Filtres transversaux */}
        <section className="religion-search-section">
          <div className="container">
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

        {/* 7. Navigateur Hiérarchique Central :
             Religion → Tradition → Courant / Branche → Sous-catégorie → Ressources */}
        <ReligionHierarchyNavigator
          traditions={traditions}
          branches={branches}
          themeCategories={themeCategories}
          resources={resources}
          selectedTraditionId={selectedTraditionId}
          selectedBranchId={selectedBranchId}
          selectedThemeCategoryId={selectedThemeCategoryId}
          onSelectTradition={handleSelectTradition}
          onSelectBranch={handleSelectBranch}
          onSelectThemeCategory={handleSelectThemeCategory}
          onConsultResource={(res) => setSelectedResource(res)}
          onResetNavigation={handleResetNavigation}
          isLoading={isLoading}
        />

        {/* 8. Ressources Phares & Populaires réelles */}
        <ReligionPopularResources
          resources={popularResources}
          onConsultResource={(res) => setSelectedResource(res)}
        />

        {/* 9. CTA vers la bibliothèque générale */}
        <ReligionCTA />
      </main>

      {/* 10. Footer existant */}
      <Footer />

      {/* 11. Tiroir mobile de filtres */}
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

      {/* 12. Modale de Consultation de ressource sécurisée */}
      <ReligionResourceModal
        resource={selectedResource}
        tradition={traditions.find((t) => t.id === selectedResource?.traditionId)}
        branch={branches.find((b) => b.id === selectedResource?.branchId)}
        onClose={() => setSelectedResource(null)}
        onOpenAuth={handleOpenAuth}
      />

      {/* 13. Modale d'authentification */}
      <AuthModal
        isOpen={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
      />
    </div>
  );
}
