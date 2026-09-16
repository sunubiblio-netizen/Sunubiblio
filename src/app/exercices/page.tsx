'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollNavigation } from '@/components/shared/ScrollNavigation';
import { AuthModal } from '@/components/ui/AuthModal';

import { ExerciseHero } from '@/components/exercises/ExerciseHero';
import { ExerciseResumeBanner } from '@/components/exercises/ExerciseResumeBanner';
import { ExerciseTypeShortcuts } from '@/components/exercises/ExerciseTypeShortcuts';
import { ExerciseSearchFilters } from '@/components/exercises/ExerciseSearchFilters';
import { ExerciseCard } from '@/components/exercises/ExerciseCard';
import { ExerciseProgressSection } from '@/components/exercises/ExerciseProgressSection';

import {
  Exercise,
  ExerciseFilterQuery,
  ExerciseSession,
  ExerciseUserProgress,
} from '@/types/exercise';
import { exerciseService } from '@/services/exerciseService';

export default function ExercicesPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  // Liste des exercices et filtres
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<ExerciseFilterQuery>({
    searchQuery: '',
    type: 'all',
    level: 'all',
    subject: 'all',
    competition: 'all',
    difficulty: 'all',
    access: 'all',
  });

  const [subjects, setSubjects] = useState<{ slug: string; name: string }[]>([]);
  const [competitions, setCompetitions] = useState<{ id: string; name: string }[]>([]);

  // Session active & Progression
  const [activeSession, setActiveSession] = useState<ExerciseSession | null>(null);
  const [progress, setProgress] = useState<ExerciseUserProgress>({
    totalCompletedSessions: 0,
    averageScorePercentage: 0,
    totalTimeSpentSeconds: 0,
    subjectsPracticedCount: 0,
    recentSessions: [],
    activeSession: null,
  });

  // Favoris
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Référence pour le scroll vers la grille
  const catalogRef = useRef<HTMLDivElement>(null);

  // Chargement initial des données
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const [exos, subs, comps] = await Promise.all([
        exerciseService.getExercises({}),
        exerciseService.getAvailableSubjects(),
        exerciseService.getAvailableCompetitions(),
      ]);

      setAllExercises(exos);
      setSubjects(subs);
      setCompetitions(comps);

      // Charger session active & progression
      const active = exerciseService.getActiveSession();
      setActiveSession(active);

      const userProg = exerciseService.getUserProgress();
      setProgress(userProg);

      setFavoriteIds(exerciseService.getFavoriteExerciseIds());
      setLoading(false);
    };

    init();
  }, []);

  // Filtrage réactif
  const filteredExercises = useMemo(() => {
    return allExercises.filter((exo) => {
      if (filters.type && filters.type !== 'all' && exo.type !== filters.type) return false;
      if (filters.level && filters.level !== 'all' && exo.level !== filters.level) return false;
      if (filters.difficulty && filters.difficulty !== 'all' && exo.difficulty !== filters.difficulty) return false;
      if (filters.subject && filters.subject !== 'all' && exo.subjectSlug !== filters.subject && exo.subject !== filters.subject) return false;
      if (filters.competition && filters.competition !== 'all' && exo.competitionId !== filters.competition) return false;
      if (filters.access && filters.access !== 'all') {
        const isPrem = filters.access === 'premium';
        if (exo.isPremium !== isPrem) return false;
      }
      if (filters.searchQuery && filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const mTitle = exo.title.toLowerCase().includes(q);
        const mDesc = exo.description.toLowerCase().includes(q);
        const mSub = exo.subject.toLowerCase().includes(q);
        const mChap = exo.chapter.toLowerCase().includes(q);
        const mComp = exo.competitionName ? exo.competitionName.toLowerCase().includes(q) : false;
        if (!mTitle && !mDesc && !mSub && !mChap && !mComp) return false;
      }
      return true;
    });
  }, [allExercises, filters]);

  // Compteurs par type
  const typeCounts = useMemo(() => {
    return {
      qcm: allExercises.filter((e) => e.type === 'qcm').length,
      exercice: allExercises.filter((e) => e.type === 'exercice').length,
      correction: allExercises.filter((e) => e.type === 'correction').length,
    };
  }, [allExercises]);

  const handleToggleFav = (id: string) => {
    const isNowFav = exerciseService.toggleFavorite(id);
    if (isNowFav) {
      setFavoriteIds((prev) => [...prev, id]);
    } else {
      setFavoriteIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleDiscardSession = () => {
    if (window.confirm('Voulez-vous vraiment abandonner la session en cours ? Vos réponses non validées seront perdues.')) {
      exerciseService.clearActiveSession();
      setActiveSession(null);
    }
  };

  const scrollToCatalog = () => {
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartFirstAvailable = () => {
    if (activeSession) {
      window.location.href = `/exercices/${activeSession.exerciseId}`;
    } else if (allExercises.length > 0) {
      window.location.href = `/exercices/${allExercises[0].id}`;
    }
  };

  return (
    <div className="exercises-page-wrapper">
      <Navbar onOpenAuth={handleOpenAuth} activePage="exercices" />

      <main className="exercises-main">
        {/* 1. HERO CENTRÉ */}
        <ExerciseHero
          onStartRandom={handleStartFirstAvailable}
          onExplore={scrollToCatalog}
        />

        <div className="container exercises-content-container">
          {/* 2. REPRENDRE LA SESSION EN COURS (SI EXISTANTE) */}
          {activeSession && (
            <div className="active-session-wrapper">
              <ExerciseResumeBanner
                session={activeSession}
                onDiscardSession={handleDiscardSession}
              />
            </div>
          )}

          {/* 3. RACCOURCIS DES GRANDS FORMATS D'ENTRAÎNEMENT */}
          <section className="exercise-formats-section" aria-label="Formats d'entraînement">
            <ExerciseTypeShortcuts
              selectedType={filters.type || 'all'}
              onSelectType={(newType) => {
                setFilters((prev) => ({ ...prev, type: newType }));
                scrollToCatalog();
              }}
              counts={typeCounts}
            />
          </section>

          {/* 4. BARRE DE RECHERCHE & FILTRES SERVEUR-COMPATIBLES */}
          <div ref={catalogRef} className="exercise-catalog-anchor">
            <ExerciseSearchFilters
              filters={filters}
              onFilterChange={(newFilters) => setFilters(newFilters)}
              subjects={subjects}
              competitions={competitions}
              totalResults={filteredExercises.length}
            />
          </div>

          {/* 5. GRILLE DES EXERCICES */}
          <section className="exercises-grid-section" aria-label="Liste des exercices disponibles">
            {loading ? (
              <div className="exercises-loading-state">
                <div className="exercises-spinner" />
                <p>Chargement des exercices et entraînements pédagogiques...</p>
              </div>
            ) : filteredExercises.length === 0 ? (
              <div className="exercises-empty-results">
                <div className="empty-icon-box">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <h3 className="empty-title">Aucun exercice ne correspond à vos critères</h3>
                <p className="empty-desc">
                  Essayez d'élargir votre recherche, de changer de niveau ou de réinitialiser vos filtres.
                </p>
                <button
                  type="button"
                  className="btn-secondary empty-reset-btn"
                  onClick={() =>
                    setFilters({
                      searchQuery: '',
                      type: 'all',
                      level: 'all',
                      subject: 'all',
                      competition: 'all',
                      difficulty: 'all',
                      access: 'all',
                    })
                  }
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="exercises-grid">
                {filteredExercises.map((exo) => {
                  const isCurrent = activeSession?.exerciseId === exo.id;
                  const isFav = favoriteIds.includes(exo.id);

                  return (
                    <ExerciseCard
                      key={exo.id}
                      exercise={exo}
                      isFavorite={isFav}
                      isCurrentSession={isCurrent}
                      onToggleFavorite={handleToggleFav}
                    />
                  );
                })}
              </div>
            )}
          </section>

          {/* 6. TABLEAU DE BORD DE PROGRESSION RÉELLE */}
          <div className="exercises-progress-anchor">
            <ExerciseProgressSection
              progress={progress}
              onExploreExercises={scrollToCatalog}
            />
          </div>
        </div>
      </main>

      {/* Global Scroll navigation Sunubiblio */}
      <ScrollNavigation />

      {/* Modal d'authentification */}
      <AuthModal
        isOpen={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
      />

      <Footer />
    </div>
  );
}
