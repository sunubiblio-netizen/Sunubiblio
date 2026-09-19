'use client';

import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';
import { EducationHero } from '@/components/education/EducationHero';
import { EducationLevelsSection } from '@/components/education/EducationLevelsSection';
import { EducationSubjectsSection } from '@/components/education/EducationSubjectsSection';
import { EducationSearchFilter } from '@/components/education/EducationSearchFilter';
import { EducationResourceGrid } from '@/components/education/EducationResourceGrid';
import { EducationCTA } from '@/components/education/EducationCTA';
import { EducationResourceModal } from '@/components/education/EducationResourceModal';
import { INITIAL_EDUCATION_RESOURCES } from '@/data/educationData';
import {
  EducationFilterState,
  EducationResource,
  EducationCycleId,
} from '@/types/education';

const INITIAL_FILTERS: EducationFilterState = {
  searchQuery: '',
  level: 'all',
  grade: 'all',
  domainId: 'all',
  filiereId: 'all',
  subject: 'all',
  type: 'all',
  year: 'all',
  accessStatus: 'all',
  sortBy: 'pertinence',
};

export default function EducationPage() {
  const [filters, setFilters] = useState<EducationFilterState>(INITIAL_FILTERS);
  const [selectedResource, setSelectedResource] = useState<EducationResource | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleFilterChange = (newFilters: Partial<EducationFilterState>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  // Smooth scroll helper
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Compute filtered resources
  const filteredResources = useMemo(() => {
    return INITIAL_EDUCATION_RESOURCES.filter((res) => {
      // 1. Search Query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const mTitle = res.title.toLowerCase().includes(q);
        const mDesc = res.description.toLowerCase().includes(q);
        const mSub = res.subject.toLowerCase().includes(q);
        const mLvl = res.levelLabel.toLowerCase().includes(q);
        const mGrd = res.grade ? res.grade.toLowerCase().includes(q) : false;
        const mDom = res.domainTitle ? res.domainTitle.toLowerCase().includes(q) : false;
        const mFil = res.filiereTitle ? res.filiereTitle.toLowerCase().includes(q) : false;
        if (!mTitle && !mDesc && !mSub && !mLvl && !mGrd && !mDom && !mFil) return false;
      }

      // 2. Level filter (Cycle: universite, lycee, etc.)
      if (filters.level !== 'all' && res.level !== filters.level) {
        return false;
      }

      // 3. Domain filter
      if (filters.domainId && filters.domainId !== 'all' && res.domainId !== filters.domainId) {
        return false;
      }

      // 4. Filiere filter
      if (filters.filiereId && filters.filiereId !== 'all' && res.filiereId !== filters.filiereId) {
        return false;
      }

      // 5. Sub-level / Grade filter (Licence 1, Licence 2, Licence 3, Master, Doctorat, etc.)
      if (filters.grade && filters.grade !== 'all') {
        if (!res.grade || !res.grade.toLowerCase().includes(filters.grade.toLowerCase())) {
          return false;
        }
      }

      // 6. Subject filter
      if (filters.subject !== 'all' && res.subjectSlug !== filters.subject && res.subjectId !== filters.subject) {
        return false;
      }

      // 7. Resource Type
      if (filters.type !== 'all' && res.type !== filters.type) {
        return false;
      }

      // 8. Year
      if (filters.year !== 'all' && res.year?.toString() !== filters.year) {
        return false;
      }

      // 9. Access Status
      if (filters.accessStatus !== 'all' && res.accessStatus !== filters.accessStatus) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.level !== 'all' ||
      (Boolean(filters.grade) && filters.grade !== 'all') ||
      (Boolean(filters.domainId) && filters.domainId !== 'all') ||
      (Boolean(filters.filiereId) && filters.filiereId !== 'all') ||
      filters.subject !== 'all' ||
      filters.type !== 'all' ||
      filters.year !== 'all' ||
      filters.accessStatus !== 'all' ||
      Boolean(filters.searchQuery.trim())
    );
  }, [filters]);

  return (
    <div className="page-wrapper education-page-wrapper">
      {/* Global Header */}
      <Navbar onOpenAuth={handleOpenAuth} activePage="education" />

      {/* Main Content */}
      <main>
        {/* 1. Hero Section */}
        <EducationHero
          onExploreClick={() => scrollToSection('niveaux')}
          onSearchClick={() => {
            scrollToSection('ressources');
            const searchInput = document.getElementById('education-search-input');
            if (searchInput) searchInput.focus();
          }}
        />

        {/* 2. Explore by Level */}
        <EducationLevelsSection
          selectedLevel={filters.level}
          onSelectLevel={(levelId) => {
            handleFilterChange({ level: levelId, grade: 'all', subject: 'all' });
            scrollToSection('ressources');
          }}
        />

        {/* 3. Explore by Subject (Matières fondamentales) */}
        <EducationSubjectsSection
          selectedSubject={filters.subject}
          onSelectSubject={(subjectSlug) => {
            handleFilterChange({ subject: subjectSlug });
            scrollToSection('ressources');
          }}
        />

        {/* 4. Search & Filters + Educational Resources Grid */}
        <section className="catalog-section" id="ressources">
          <div className="container">
            <div className="catalog-header">
              <div className="badge-pill catalog-badge">
                <span className="badge-dot" />
                <span>Catalogue & Recherche</span>
              </div>
              <h2 className="catalog-title">
                Ressources <span className="gradient-hero-text">éducatives</span>
              </h2>
              <p className="catalog-subtitle">
                Filtrez selon votre niveau, votre matière ou vos besoins d’apprentissage pour trouver
                les documents adaptés.
              </p>
            </div>

            {/* Live Search & Filter Bar */}
            <EducationSearchFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              totalResultsCount={filteredResources.length}
            />

            {/* Results Grid / Honest Empty State */}
            <EducationResourceGrid
              resources={filteredResources}
              onSelectResource={(res) => setSelectedResource(res)}
              onResetFilters={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        </section>

        {/* 7. User Call To Action */}
        <EducationCTA />
      </main>

      {/* Footer */}
      <Footer />

      {/* Designed Pro Resource Detail & Reader Preview Modal */}
      <EducationResourceModal
        resource={selectedResource}
        onClose={() => setSelectedResource(null)}
        onOpenAuth={(mode) => handleOpenAuth(mode)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
      />

      <style jsx>{`
        .page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #ffffff;
        }

        main {
          flex: 1;
        }

        .catalog-section {
          padding: 64px 0 44px;
          background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
          border-top: 1px solid var(--border-subtle, #e2e8f0);
        }

        .catalog-header {
          text-align: center;
          max-width: 680px;
          margin: 0 auto 36px;
        }

        .catalog-badge {
          display: inline-flex;
          margin-bottom: 14px;
        }

        .catalog-title {
          font-size: 34px;
          font-weight: 850;
          color: var(--text-heading, #0f172a);
          line-height: 1.22;
          letter-spacing: -0.025em;
          margin-bottom: 12px;
        }

        .catalog-subtitle {
          font-size: 15.5px;
          line-height: 1.6;
          color: var(--text-body, #64748b);
          margin: 0;
        }

        @media (max-width: 640px) {
          .catalog-section {
            padding: 44px 0 28px;
          }

          .catalog-title {
            font-size: 26px;
          }

          .catalog-subtitle {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}
