'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';
import { ContestHero } from '@/components/contests/ContestHero';
import { PopularContests } from '@/components/contests/PopularContests';
import { ContestFilters } from '@/components/contests/ContestFilters';
import { ContestGrid } from '@/components/contests/ContestGrid';
import { ContestDetailWorkspace } from '@/components/contests/ContestDetailWorkspace';
import { ContestCTA } from '@/components/contests/ContestCTA';
import { MOCK_CONTESTS } from '@/data/mockContests';
import { Contest, ContestFilterState } from '@/types/contest';

const INITIAL_FILTERS: ContestFilterState = {
  searchQuery: '',
  domain: 'all',
  diploma: 'all',
  status: 'all',
  country: 'all',
  sortBy: 'pertinence',
  page: 1,
  perPage: 12,
};

export default function ConcoursPage() {
  const [filters, setFilters] = useState<ContestFilterState>(INITIAL_FILTERS);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleFilterChange = (newFilters: Partial<ContestFilterState>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1,
    }));
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.domain !== 'all') count++;
    if (filters.diploma !== 'all') count++;
    if (filters.status !== 'all') count++;
    if (filters.country !== 'all') count++;
    return count;
  }, [filters]);

  // Filtering engine
  const filteredContests = useMemo(() => {
    return MOCK_CONTESTS.filter((c) => {
      // Search query
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const mName = c.name.toLowerCase().includes(q);
        const mFullName = c.fullName.toLowerCase().includes(q);
        const mOrg = c.organization.toLowerCase().includes(q);
        const mDesc = c.shortDescription.toLowerCase().includes(q);
        if (!mName && !mFullName && !mOrg && !mDesc) return false;
      }

      // Domain
      if (filters.domain !== 'all' && c.domain !== filters.domain) {
        return false;
      }

      // Diploma
      if (filters.diploma !== 'all' && c.requiredDiploma !== filters.diploma) {
        return false;
      }

      // Status
      if (filters.status !== 'all' && c.status !== filters.status) {
        return false;
      }

      // Country
      if (filters.country !== 'all' && c.country !== filters.country) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'recent') {
        return b.sessionYear - a.sessionYear;
      }
      if (filters.sortBy === 'popular') {
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      }
      if (filters.sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      // default pertinence: popular first, then resources count
      if (a.isPopular && !b.isPopular) return -1;
      if (!a.isPopular && b.isPopular) return 1;
      return b.resourcesCount - a.resourcesCount;
    });
  }, [filters]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const contestParam = params.get('id') || params.get('concours');
      if (contestParam) {
        const found = MOCK_CONTESTS.find(
          (c) =>
            c.id.toLowerCase() === contestParam.toLowerCase() ||
            c.slug.toLowerCase().includes(contestParam.toLowerCase())
        );
        if (found) {
          setSelectedContest(found);
        }
      }
    }
  }, []);

  const scrollToCatalog = () => {
    const el = document.getElementById('contests-catalog-anchor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectContest = (contest: Contest) => {
    setSelectedContest(contest);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('id', contest.id);
      window.history.pushState({}, '', url.toString());
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCatalog = () => {
    setSelectedContest(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('id');
      url.searchParams.delete('concours');
      window.history.pushState({}, '', url.toString());
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="concours-page-wrapper">
      {/* Top Navbar with activePage="concours" */}
      <Navbar onOpenAuth={handleOpenAuth} activePage="concours" />

      <main className="concours-main">
        {/* If a contest is selected, show its Dedicated Preparation Workspace */}
        {selectedContest ? (
          <div className="container workspace-container">
            <ContestDetailWorkspace
              contest={selectedContest}
              onBack={handleBackToCatalog}
              onOpenAuth={handleOpenAuth}
            />
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <ContestHero
              initialQuery={filters.searchQuery}
              onSearch={(q) => {
                handleFilterChange({ searchQuery: q });
                scrollToCatalog();
              }}
              onTagClick={(tag) => {
                handleFilterChange({ searchQuery: tag });
                scrollToCatalog();
              }}
            />

            {/* Main Content Container */}
            <div id="contests-catalog-anchor" className="container catalog-container">
              {/* Popular Contests Row */}
              <PopularContests
                contests={MOCK_CONTESTS}
                onSelectContest={handleSelectContest}
              />

              {/* 2-Column Layout: Sidebar Filters + Contest Grid */}
              <div className="catalog-layout">
                <ContestFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onResetFilters={handleResetFilters}
                  activeCount={activeFiltersCount}
                  totalCount={filteredContests.length}
                />

                <ContestGrid
                  contests={filteredContests}
                  totalCount={filteredContests.length}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onResetFilters={handleResetFilters}
                  onSelectContest={handleSelectContest}
                />
              </div>
            </div>

            {/* Big Final CTA */}
            <ContestCTA
              onExploreClick={scrollToCatalog}
              onOpenPricing={() => {
                window.location.href = '/#tarifs';
              }}
            />
          </>
        )}
      </main>

      {/* Institutional Footer */}
      <Footer />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
      />

      <style jsx>{`
        .concours-page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-canvas);
          position: relative;
        }

        .concours-main {
          flex: 1;
        }

        .catalog-container {
          padding-top: 36px;
          padding-bottom: 40px;
        }

        .workspace-container {
          padding-top: 32px;
          padding-bottom: 60px;
        }

        .catalog-layout {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        @media (max-width: 1024px) {
          .catalog-container {
            padding-top: 20px;
            padding-bottom: 70px;
          }

          .workspace-container {
            padding-top: 20px;
            padding-bottom: 80px;
          }
        }

        @media (max-width: 860px) {
          .catalog-container {
            padding-top: 12px;
            padding-bottom: 80px;
          }
        }
      `}</style>
    </div>
  );
}
