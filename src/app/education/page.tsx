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
          position: relative;
          background: #f8fafc;
          overflow-x: hidden;
        }

        /* Ambiance Bleu Ciel Nuageux Doux & Vaporeux */
        .education-page-wrapper::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 0;
          background:
            /* Lueur haute droite : Azur ciel aéré doux */
            radial-gradient(circle at 85% 12%, rgba(186, 230, 253, 0.52) 0%, rgba(224, 242, 254, 0.28) 35%, transparent 65%),
            /* Lueur latérale gauche : Nuage vaporeux bleu pastel */
            radial-gradient(circle at 10% 42%, rgba(199, 210, 254, 0.32) 0%, rgba(224, 242, 254, 0.25) 30%, transparent 60%),
            /* Lueur basse droite : Reflet ciel pur feutré */
            radial-gradient(circle at 85% 75%, rgba(186, 230, 253, 0.42) 0%, rgba(240, 249, 255, 0.22) 40%, transparent 70%),
            /* Dégradé de fond ciel nuageux très subtil */
            linear-gradient(180deg, #f0f7ff 0%, #f8fafc 42%, #f0f7ff 100%);
        }

        .education-main {
          flex: 1;
          position: relative;
          z-index: 1;
        }
      `}</style>
    </div>
  );
}
