'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';
import { EducationHero } from '@/components/education/EducationHero';
import { EducationLevelsSection } from '@/components/education/EducationLevelsSection';
import { EducationSubjectsSection } from '@/components/education/EducationSubjectsSection';
import { EducationCTA } from '@/components/education/EducationCTA';
import { EducationFilterState, EducationCycleId } from '@/types/education';

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
  const router = useRouter();
  const [filters, setFilters] = useState<EducationFilterState>(INITIAL_FILTERS);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/bibliotheque?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectLevel = (levelId: EducationCycleId | 'all') => {
    setFilters((prev) => ({
      ...prev,
      level: prev.level === levelId ? 'all' : levelId,
    }));
    if (levelId !== 'all') {
      router.push(`/bibliotheque?cycle=${encodeURIComponent(levelId)}`);
    } else {
      router.push('/bibliotheque');
    }
  };

  const handleSelectSubject = (subjectSlug: string) => {
    setFilters((prev) => ({
      ...prev,
      subject: prev.subject === subjectSlug ? 'all' : subjectSlug,
    }));
    // Navigation vers la bibliothèque filtrée pour cette matière
    router.push(`/bibliotheque?subject=${encodeURIComponent(subjectSlug)}`);
  };

  return (
    <div className="education-page-wrapper">
      {/* Global Header */}
      <Navbar onOpenAuth={handleOpenAuth} activePage="education" />

      {/* Main Content */}
      <main className="education-main">
        {/* 1. Hero Section Centré avec Recherche Universelle */}
        <EducationHero
          initialSearch={filters.searchQuery}
          onSearch={handleSearch}
          onExploreClick={() => scrollToSection('niveaux')}
        />

        {/* 2. Explore by Level */}
        <EducationLevelsSection
          selectedLevel={filters.level}
          onSelectLevel={handleSelectLevel}
        />

        {/* 3. Explore by Subject (Matières fondamentales) */}
        <EducationSubjectsSection
          selectedSubject={filters.subject}
          onSelectSubject={handleSelectSubject}
        />

        {/* 4. User Call To Action */}
        <EducationCTA />
      </main>

      {/* Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
      />

      <style jsx>{`
        .education-page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
          position: relative;
        }

        .education-main {
          flex: 1;
          position: relative;
        }
      `}</style>
    </div>
  );
}
