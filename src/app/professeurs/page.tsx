'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';
import { ProfessorHero } from '@/components/professors/ProfessorHero';
import { ProfessorFiltersBar } from '@/components/professors/ProfessorFiltersBar';
import { MobileProfessorFilterDrawer } from '@/components/professors/MobileProfessorFilterDrawer';
import { ProfessorCard } from '@/components/professors/ProfessorCard';
import { ProfessorEmptyState } from '@/components/professors/ProfessorEmptyState';
import { ProfessorBookingModal } from '@/components/professors/ProfessorBookingModal';
import { BecomeProfessorModal } from '@/components/professors/BecomeProfessorModal';
import { professorService } from '@/services/professorService';
import { ProfessorFilterState, ProfessorProfile } from '@/types/professor';

const PAGE_SIZE = 6;

const DEFAULT_FILTERS: ProfessorFilterState = {
  query: '',
  subject: 'all',
  level: 'all',
  country: 'all',
  city: 'all',
  mode: 'all',
  priceRange: 'all',
  availability: 'all',
  language: 'all',
  minExperience: 'all',
  sort: 'pertinence',
};

export default function ProfesseursPage() {
  const [filters, setFilters] = useState<ProfessorFilterState>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [bookingProf, setBookingProf] = useState<ProfessorProfile | null>(null);
  const [isBecomeTeacherOpen, setIsBecomeTeacherOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isSearching, setIsSearching] = useState(false);

  // Tous les professeurs de base
  const allProfessors = useMemo(() => {
    return professorService.getAllProfessors();
  }, []);

  // Filtrage et tri des résultats
  const { filteredItems, totalCount } = useMemo(() => {
    const result = professorService.filterProfessors(allProfessors, filters);
    return {
      filteredItems: result.items,
      totalCount: result.totalCount,
    };
  }, [allProfessors, filters]);

  // Réinitialiser la page courante quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
    setIsSearching(true);
    const timer = setTimeout(() => setIsSearching(false), 200);
    return () => clearTimeout(timer);
  }, [filters]);

  // Pagination progressive
  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;
  const paginatedProfessors = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredItems.slice(start, start + PAGE_SIZE);
  }, [filteredItems, currentPage]);

  const handleFilterChange = (patch: Partial<ProfessorFilterState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  return (
    <div className="professors-page-wrapper">
      {/* Navigation globale */}
      <Navbar
        activePage="professeurs"
        onOpenAuth={handleOpenAuth}
      />

      <main className="professors-main-content">
        {/* 1. Hero Section avec grande recherche */}
        <ProfessorHero
          searchQuery={filters.query}
          onSearchChange={(q) => handleFilterChange({ query: q })}
          onOpenBecomeTeacher={() => setIsBecomeTeacherOpen(true)}
          totalTeachersCount={allProfessors.length}
        />

        {/* 2. Barre de filtres interactive */}
        <section className="container professors-results-section" id="professeurs-catalogue">
          <ProfessorFiltersBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
            totalResults={totalCount}
          />

          {/* 3. Grille des résultats ou État vide */}
          {isSearching ? (
            <div className="professors-loading-state">
              <div className="loading-spinner-ring" />
              <p>Recherche des enseignants les plus qualifiés...</p>
            </div>
          ) : totalCount === 0 ? (
            <ProfessorEmptyState
              query={filters.query}
              onResetFilters={handleResetFilters}
            />
          ) : (
            <>
              <div className="professors-cards-grid">
                {paginatedProfessors.map((professor) => (
                  <ProfessorCard
                    key={professor.id}
                    professor={professor}
                    onBookCourse={(prof) => setBookingProf(prof)}
                  />
                ))}
              </div>

              {/* 4. Pagination */}
              {totalPages > 1 && (
                <div className="professors-pagination-wrap">
                  <button
                    type="button"
                    className="pagination-arrow-btn"
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    aria-label="Page précédente"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    <span>Précédent</span>
                  </button>

                  <div className="pagination-numbers-list">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        className={`pagination-num-btn ${pageNum === currentPage ? 'active' : ''}`}
                        onClick={() => {
                          setCurrentPage(pageNum);
                          window.scrollTo({ top: 400, behavior: 'smooth' });
                        }}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="pagination-arrow-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    aria-label="Page suivante"
                  >
                    <span>Suivant</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* Tiroir mobile de filtres */}
      <MobileProfessorFilterDrawer
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        totalResults={totalCount}
      />

      {/* Modal de réservation de cours */}
      <ProfessorBookingModal
        isOpen={Boolean(bookingProf)}
        professor={bookingProf}
        onClose={() => setBookingProf(null)}
      />

      {/* Modal « Devenir enseignant/formateur » */}
      <BecomeProfessorModal
        isOpen={isBecomeTeacherOpen}
        onClose={() => setIsBecomeTeacherOpen(false)}
      />

      {/* Modal d'authentification */}
      <AuthModal
        isOpen={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
      />

      {/* Footer officiel Sunubiblio */}
      <Footer />
    </div>
  );
}
