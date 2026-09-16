'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollNavigation } from '@/components/shared/ScrollNavigation';
import { AuthModal } from '@/components/ui/AuthModal';

import { ExerciseHero } from '@/components/exercises/ExerciseHero';
import { ContestsShowcaseSection } from '@/components/exercises/ContestsShowcaseSection';
import { ContestBooksSection } from '@/components/exercises/ContestBooksSection';
import { SimulationsSection } from '@/components/exercises/SimulationsSection';
import { ExerciseDifficultyTabs } from '@/components/exercises/ExerciseDifficultyTabs';
import { ExerciseSearchFilters } from '@/components/exercises/ExerciseSearchFilters';
import { ExerciseCard } from '@/components/exercises/ExerciseCard';
import { ExerciseResumeBanner } from '@/components/exercises/ExerciseResumeBanner';
import { ExerciseProgressSection } from '@/components/exercises/ExerciseProgressSection';
import { ExerciseAISection } from '@/components/exercises/ExerciseAISection';

import {
  Exercise,
  ExerciseFilterQuery,
  ExerciseSession,
  ExerciseUserProgress,
} from '@/types/exercise';
import { Contest } from '@/types/contest';
import { Resource } from '@/types/library';
import { exerciseService } from '@/services/exerciseService';

// Import synchrone pour rendu SSR immédiat sans flash
import { MOCK_EXERCISES } from '@/data/mockExercises';
import { MOCK_CONTESTS } from '@/data/mockContests';
import { MOCK_RESOURCES } from '@/data/mockLibrary';

export default function ExercicesPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  // Initialisation avec données de référence pour rendu SSR immédiat
  const initialContests = useMemo(() => {
    return MOCK_CONTESTS.map((c) => ({
      ...c,
      testsCount: MOCK_EXERCISES.filter((e) => e.competitionId === c.id || e.competitionId === c.slug).length,
    }));
  }, []);

  const initialBooks = useMemo(() => {
    const books = MOCK_RESOURCES.filter(
      (r) => r.category === 'annales' || r.category === 'cours' || r.category === 'livres' || r.id === 'res-1' || r.id === 'res-2' || r.id === 'res-3'
    );
    return books.map((b) => ({
      ...b,
      associatedTestsCount: MOCK_EXERCISES.filter((e) => e.resourceId === b.id).length,
    }));
  }, []);

  const initialSimulations = useMemo(() => {
    return MOCK_EXERCISES.filter((e) => e.type === 'simulation' || e.difficulty === 'PRO');
  }, []);

  const initialSeries = useMemo(() => {
    const seriesMap = new Map<string, { resourceId: string; resourceTitle: string; tests: Exercise[] }>();
    MOCK_EXERCISES.forEach((e) => {
      if (e.resourceId && e.resourceTitle) {
        if (!seriesMap.has(e.resourceId)) {
          seriesMap.set(e.resourceId, {
            resourceId: e.resourceId,
            resourceTitle: e.resourceTitle,
            tests: [],
          });
        }
        seriesMap.get(e.resourceId)!.tests.push(e);
      }
    });
    return Array.from(seriesMap.values());
  }, []);

  // Liste des exercices et filtres
  const [allExercises, setAllExercises] = useState<Exercise[]>(MOCK_EXERCISES);
  const [featuredContests, setFeaturedContests] = useState<(Contest & { testsCount: number })[]>(initialContests);
  const [contestBooks, setContestBooks] = useState<(Resource & { associatedTestsCount: number })[]>(initialBooks);
  const [simulations, setSimulations] = useState<Exercise[]>(initialSimulations);
  const [resourceSeries, setResourceSeries] = useState<{ resourceId: string; resourceTitle: string; tests: Exercise[] }[]>(initialSeries);

  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState<ExerciseFilterQuery>({
    searchQuery: '',
    type: 'all',
    level: 'all',
    subject: 'all',
    competition: 'all',
    resourceId: 'all',
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
    byDifficulty: {
      beginner: { completedCount: 0, averageScorePercentage: 0 },
      intermediate: { completedCount: 0, averageScorePercentage: 0 },
      pro: { completedCount: 0, averageScorePercentage: 0 },
    },
    bySubject: {},
    byCompetition: {},
    recentSessions: [],
    activeSession: null,
  });

  // Favoris
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Référence pour le scroll vers le catalogue
  const catalogRef = useRef<HTMLDivElement>(null);

  // Chargement initial des données
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const [exos, subs, comps, fContests, cBooks, sims, rSeries] = await Promise.all([
        exerciseService.getExercises({}),
        exerciseService.getAvailableSubjects(),
        exerciseService.getAvailableCompetitions(),
        exerciseService.getFeaturedContests(),
        exerciseService.getContestBooks(),
        exerciseService.getSimulations(),
        exerciseService.getResourceSeries(),
      ]);

      setAllExercises(exos);
      setSubjects(subs);
      setCompetitions(comps);
      setFeaturedContests(fContests);
      setContestBooks(cBooks);
      setSimulations(sims);
      setResourceSeries(rSeries);

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
      if (filters.resourceId && filters.resourceId !== 'all' && exo.resourceId !== filters.resourceId) return false;
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
        const mRes = exo.resourceTitle ? exo.resourceTitle.toLowerCase().includes(q) : false;
        if (!mTitle && !mDesc && !mSub && !mChap && !mComp && !mRes) return false;
      }
      return true;
    });
  }, [allExercises, filters]);

  // Compteurs par palier de difficulté
  const difficultyCounts = useMemo(() => {
    return {
      all: allExercises.length,
      beginner: allExercises.filter((e) => e.difficulty === 'BEGINNER').length,
      intermediate: allExercises.filter((e) => e.difficulty === 'INTERMEDIATE').length,
      pro: allExercises.filter((e) => e.difficulty === 'PRO').length,
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

  // Sélection rapide d'un concours depuis la Section 1
  const handleSelectContestQuick = (contestId: string) => {
    setFilters((prev) => ({
      ...prev,
      competition: contestId,
    }));
    scrollToCatalog();
  };

  // Sélection rapide d'un livre depuis la Section 2
  const handleSelectResourceQuick = (resourceId: string) => {
    setFilters((prev) => ({
      ...prev,
      resourceId,
    }));
    scrollToCatalog();
  };

  return (
    <div className="exercises-page-wrapper">
      <Navbar onOpenAuth={handleOpenAuth} activePage="exercices" />

      <main className="exercises-main">
        {/* HERO CENTRÉ */}
        <ExerciseHero
          onStartRandom={handleStartFirstAvailable}
          onExplore={scrollToCatalog}
        />

        <div className="container exercises-content-container">
          {/* SECTION 1 : PRÉPAREZ VOS CONCOURS */}
          <ContestsShowcaseSection
            contests={featuredContests}
            selectedCompetitionId={filters.competition}
            onSelectCompetition={handleSelectContestQuick}
          />

          {/* SECTION 2 : LIVRES POUR PRÉPARER LES CONCOURS */}
          <ContestBooksSection
            books={contestBooks}
            selectedResourceId={filters.resourceId}
            onSelectResource={handleSelectResourceQuick}
          />

          {/* SECTION 3 & 4 : SIMULATIONS DE CONCOURS & TESTS LIÉS AUX RESSOURCES */}
          <SimulationsSection
            simulations={simulations}
            resourceSeries={resourceSeries}
          />

          {/* SECTION 5 : CATALOGUE COMPLET & FILTRES */}
          <div ref={catalogRef} className="exercise-catalog-anchor">
            {/* 5.1 Sélecteur de palier de difficulté */}
            <ExerciseDifficultyTabs
              selectedDifficulty={filters.difficulty || 'all'}
              onSelectDifficulty={(newDiff) => setFilters((prev) => ({ ...prev, difficulty: newDiff }))}
              counts={difficultyCounts}
            />

            {/* 5.2 Barre de filtres CustomDropdowns */}
            <ExerciseSearchFilters
              filters={filters}
              onFilterChange={(newFilters) => setFilters(newFilters)}
              subjects={subjects}
              competitions={competitions}
              totalResults={filteredExercises.length}
            />
          </div>

          {/* Grille des exercices filtrés */}
          <section className="exercises-grid-section" aria-label="Liste des tests disponibles">
            {loading ? (
              <div className="exercises-loading-state">
                <div className="exercises-spinner" />
                <p>Chargement des tests d'entraînement et simulations officielles...</p>
              </div>
            ) : filteredExercises.length === 0 ? (
              <div className="exercises-empty-results">
                <div className="empty-icon-box">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <h3 className="empty-title">Aucun test ne correspond à vos critères</h3>
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
                      resourceId: 'all',
                      difficulty: 'all',
                      access: 'all',
                    })
                  }
                >
                  Réinitialiser tous les filtres
                </button>
              </div>
            ) : (
              <div className="exercises-grid">
                {filteredExercises.map((exo) => {
                  const isCurrent = activeSession?.exerciseId === exo.id || activeSession?.testId === exo.id;
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

          {/* SECTION 6 : MES ENTRAÎNEMENTS (REPRENDRE SESSION ACTIVE) */}
          {activeSession && (
            <div className="active-session-wrapper">
              <ExerciseResumeBanner
                session={activeSession}
                onDiscardSession={handleDiscardSession}
              />
            </div>
          )}

          {/* SECTION 7 : MA PROGRESSION RÉELLE */}
          <div className="exercises-progress-anchor">
            <ExerciseProgressSection
              progress={progress}
              onExploreExercises={scrollToCatalog}
            />
          </div>

          {/* SECTION 8 : IA SUNUBIBLIO (COACH PÉDAGOGIQUE & HUB IA) */}
          <div className="exercises-ai-anchor">
            <ExerciseAISection />
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
