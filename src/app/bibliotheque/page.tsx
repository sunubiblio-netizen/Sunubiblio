'use client';

import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';
import { LibraryHero } from '@/components/library/LibraryHero';
import { FilterSidebar } from '@/components/library/FilterSidebar';
import { ResourceGrid } from '@/components/library/ResourceGrid';
import { ResourceDetailModal } from '@/components/library/ResourceDetailModal';
import { MOCK_RESOURCES } from '@/data/mockLibrary';
import { FilterState, Resource } from '@/types/library';

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  category: 'all',
  cycle: 'all',
  grade: undefined,
  subject: 'all',
  resourceType: 'all',
  accessLevel: 'all',
  competition: undefined,
  religionSub: 'all_rel',
  sortBy: 'pertinence',
  page: 1,
  perPage: 9,
};

export default function LibraryPage() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [isDesktopFiltersOpen, setIsDesktopFiltersOpen] = useState(true);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      // reset to page 1 unless page itself was modified
      page: newFilters.page !== undefined ? newFilters.page : 1,
    }));
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setOnlyFavorites(false);
  };

  const handleToggleFavorite = (resourceId: string, isFav: boolean) => {
    setFavorites((prev) => {
      if (isFav) {
        return prev.includes(resourceId) ? prev : [...prev, resourceId];
      } else {
        return prev.filter((id) => id !== resourceId);
      }
    });
  };

  // Active filters count calculation
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.category !== 'all') count++;
    if (filters.cycle !== 'all') count++;
    if (filters.grade) count++;
    if (filters.subject !== 'all') count++;
    if (filters.resourceType !== 'all') count++;
    if (filters.accessLevel !== 'all') count++;
    if (filters.competition) count++;
    if (filters.religionSub && filters.religionSub !== 'all_rel') count++;
    if (onlyFavorites) count++;
    return count;
  }, [filters, onlyFavorites]);

  // Client-side filtering & sorting engine (simulating PostgreSQL query)
  const filteredAndSortedResources = useMemo(() => {
    return MOCK_RESOURCES.filter((res) => {
      // Favorites filter
      if (onlyFavorites && !favorites.includes(res.id)) {
        return false;
      }

      // Search Query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = res.title.toLowerCase().includes(query);
        const matchesAuthor = res.author.toLowerCase().includes(query);
        const matchesSub = (res.subtitle || '').toLowerCase().includes(query);
        const matchesSubject = res.subject.toLowerCase().includes(query);
        const matchesDesc = res.description.toLowerCase().includes(query);
        const matchesGrade = res.level.grade.toLowerCase().includes(query);
        if (!matchesTitle && !matchesAuthor && !matchesSub && !matchesSubject && !matchesDesc && !matchesGrade) {
          return false;
        }
      }

      // Category
      if (filters.category !== 'all') {
        if (filters.category === 'religion') {
          if (res.category !== 'religion') return false;
          if (filters.religionSub && filters.religionSub !== 'all_rel') {
            if (res.subCategory !== filters.religionSub) return false;
          }
        } else if (res.category !== filters.category) {
          return false;
        }
      }

      // Education cycle
      if (filters.cycle !== 'all' && res.level.cycle !== filters.cycle) {
        return false;
      }

      // Grade
      if (filters.grade) {
        if (!res.level.grade.toLowerCase().includes(filters.grade.toLowerCase())) {
          return false;
        }
      }

      // Subject
      if (filters.subject !== 'all' && res.subject !== filters.subject) {
        return false;
      }

      // Resource Type
      if (filters.resourceType !== 'all' && res.resourceType !== filters.resourceType) {
        return false;
      }

      // Access Level
      if (filters.accessLevel !== 'all' && res.accessLevel !== filters.accessLevel) {
        return false;
      }

      // Competition
      if (filters.competition) {
        const comp = filters.competition.toLowerCase();
        const matchesTitle = res.title.toLowerCase().includes(comp);
        const matchesSubCat = (res.subCategory || '').toLowerCase().includes(comp);
        const matchesSlug = res.slug.toLowerCase().includes(comp);
        if (!matchesTitle && !matchesSubCat && !matchesSlug) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'recent') {
        return (b.year || 2024) - (a.year || 2024);
      }
      if (filters.sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (filters.sortBy === 'pages') {
        return b.pagesCount - a.pagesCount;
      }
      // default pertinence: featured first, then rating
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.rating - a.rating;
    });
  }, [filters, onlyFavorites, favorites]);

  // Paginated slice
  const paginatedResources = useMemo(() => {
    const start = (filters.page - 1) * filters.perPage;
    return filteredAndSortedResources.slice(start, start + filters.perPage);
  }, [filteredAndSortedResources, filters.page, filters.perPage]);

  return (
    <div className="library-page-wrapper">
      {/* Header with active link on Bibliothèque */}
      <Navbar onOpenAuth={handleOpenAuth} activePage="bibliotheque" />

      <main className="library-main">
        {/* Compact Hero with Universal Search */}
        <LibraryHero
          initialSearch={filters.searchQuery}
          onSearch={(query) => handleFilterChange({ searchQuery: query })}
        />

        {/* Main Content Area */}
        <div className="container library-content-container">
          <div className="library-layout">
            {/* Colonne Filtres (ouverte sur PC à gauche comme sur l'Image 2, repliable pour aérer la page) */}
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              activeFiltersCount={activeFiltersCount}
              isOpen={filterDrawerOpen}
              onClose={() => setFilterDrawerOpen(false)}
              isDesktopOpen={isDesktopFiltersOpen}
            />

            {/* Colonne droite : Livres et contrôles dans le rectangle tracé par l'utilisateur */}
            <div className="library-right-col">
              <ResourceGrid
                resources={paginatedResources}
                totalCount={filteredAndSortedResources.length}
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                onOpenMobileFilters={() => setFilterDrawerOpen(true)}
                isFiltersOpen={isDesktopFiltersOpen}
                onToggleFilters={() => setIsDesktopFiltersOpen((prev) => !prev)}
                activeFiltersCount={activeFiltersCount}
                onOpenResource={(res) => setSelectedResource(res)}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Institutional Footer */}
      <Footer />

      {/* Document Detail Preview Modal */}
      <ResourceDetailModal
        resource={selectedResource}
        onClose={() => setSelectedResource(null)}
        onOpenAuth={handleOpenAuth}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
      />

      <style jsx>{`
        .library-page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-canvas);
          position: relative;
        }

        .library-main {
          flex: 1;
        }

        .library-content-container {
          padding-top: 24px;
          padding-bottom: 60px;
          max-width: 1360px;
        }

        .library-layout {
          display: flex;
          align-items: flex-start;
          gap: 28px;
          width: 100%;
        }

        .library-right-col {
          flex: 1;
          min-width: 0;
        }

        @media (max-width: 1024px) {
          .library-content-container {
            padding-top: 16px;
            padding-bottom: 80px;
          }

          .library-layout {
            display: block;
          }
        }
      `}</style>
    </div>
  );
}
