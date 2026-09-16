/**
 * Sunubiblio — Service Centralisé des Exercices & Entraînements
 * 
 * Découplé et prêt pour PostgreSQL / Supabase.
 * Fournit la recherche multi-critères, la gestion des sessions d'entraînement,
 * et le calcul de progression authentique sans données fictives.
 */

import {
  Exercise,
  ExerciseFilterQuery,
  ExerciseSession,
  ExerciseUserProgress,
} from '@/types/exercise';
import { MOCK_EXERCISES } from '@/data/mockExercises';
import { MOCK_CONTESTS } from '@/data/mockContests';
import { MOCK_RESOURCES } from '@/data/mockLibrary';
import { Contest } from '@/types/contest';
import { Resource } from '@/types/library';

const ACTIVE_SESSION_STORAGE_KEY = 'sunubiblio_active_exercise_session';
const SESSIONS_HISTORY_STORAGE_KEY = 'sunubiblio_exercise_sessions_history';
const FAVORITES_STORAGE_KEY = 'sunubiblio_favorite_exercises';

export const exerciseService = {
  /**
   * Recherche et filtrage multi-critères serveur-compatible
   */
  async getExercises(query: ExerciseFilterQuery = {}): Promise<Exercise[]> {
    return MOCK_EXERCISES.filter((exo) => {
      // 1. Type
      if (query.type && query.type !== 'all' && exo.type !== query.type) {
        return false;
      }

      // 2. Niveau
      if (query.level && query.level !== 'all' && exo.level !== query.level) {
        return false;
      }

      // 3. Difficulté
      if (query.difficulty && query.difficulty !== 'all' && exo.difficulty !== query.difficulty) {
        return false;
      }

      // 4. Matière
      if (query.subject && query.subject !== 'all' && exo.subjectSlug !== query.subject && exo.subject !== query.subject) {
        return false;
      }

      // 5. Concours
      if (query.competition && query.competition !== 'all') {
        if (!exo.competitionId || exo.competitionId !== query.competition) {
          return false;
        }
      }

      // 6. Concours
      if (query.competition && query.competition !== 'all') {
        if (!exo.competitionId || exo.competitionId !== query.competition) {
          return false;
        }
      }

      // 7. Ressource source de la bibliothèque
      if (query.resourceId && query.resourceId !== 'all') {
        if (!exo.resourceId || exo.resourceId !== query.resourceId) {
          return false;
        }
      }

      // 8. Accès (Gratuit / Premium)
      if (query.access && query.access !== 'all') {
        const isPrem = query.access === 'premium';
        if (exo.isPremium !== isPrem) {
          return false;
        }
      }

      // 9. Année
      if (query.year && query.year !== 'all') {
        if (exo.year !== query.year) {
          return false;
        }
      }

      // 10. Recherche textuelle
      if (query.searchQuery && query.searchQuery.trim()) {
        const q = query.searchQuery.toLowerCase().trim();
        const mTitle = exo.title.toLowerCase().includes(q);
        const mDesc = exo.description.toLowerCase().includes(q);
        const mSub = exo.subject.toLowerCase().includes(q);
        const mChap = exo.chapter.toLowerCase().includes(q);
        const mComp = exo.competitionName ? exo.competitionName.toLowerCase().includes(q) : false;
        const mRes = exo.resourceTitle ? exo.resourceTitle.toLowerCase().includes(q) : false;
        const mGrade = exo.grade ? exo.grade.toLowerCase().includes(q) : false;

        if (!mTitle && !mDesc && !mSub && !mChap && !mComp && !mRes && !mGrade) {
          return false;
        }
      }

      return true;
    });
  },

  /**
   * Récupère tous les tests d'entraînement rattachés à une ressource pédagogique
   */
  async getTestsByResourceId(resourceId: string): Promise<Exercise[]> {
    return MOCK_EXERCISES.filter((e) => e.resourceId === resourceId);
  },

  /**
   * Récupère tous les tests d'entraînement rattachés à un concours officiel
   */
  async getTestsByCompetitionId(competitionId: string): Promise<Exercise[]> {
    return MOCK_EXERCISES.filter((e) => e.competitionId === competitionId);
  },

  /**
   * Récupère les concours officiels avec le nombre réel de tests et ressources associés
   */
  async getFeaturedContests(): Promise<(Contest & { testsCount: number })[]> {
    return MOCK_CONTESTS.map((c) => {
      const testsCount = MOCK_EXERCISES.filter((e) => e.competitionId === c.id || e.competitionId === c.slug).length;
      return {
        ...c,
        testsCount,
      };
    });
  },

  /**
   * Récupère les manuels, annales et livres de référence pour la préparation aux concours
   */
  async getContestBooks(): Promise<(Resource & { associatedTestsCount: number })[]> {
    // Filtrer les ressources de type annale, cours ou livre associées à un concours
    const books = MOCK_RESOURCES.filter(
      (r) => r.category === 'annales' || r.category === 'cours' || r.category === 'livres' || r.id === 'res-1' || r.id === 'res-2' || r.id === 'res-3'
    );

    return books.map((b) => {
      const associatedTestsCount = MOCK_EXERCISES.filter((e) => e.resourceId === b.id).length;
      return {
        ...b,
        associatedTestsCount,
      };
    });
  },

  /**
   * Récupère les simulations complètes d'examens et de concours
   */
  async getSimulations(): Promise<Exercise[]> {
    return MOCK_EXERCISES.filter((e) => e.type === 'simulation' || e.difficulty === 'PRO');
  },

  /**
   * Récupère les séries de tests attachées aux ressources de la bibliothèque
   */
  async getResourceSeries(): Promise<{ resourceId: string; resourceTitle: string; tests: Exercise[] }[]> {
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
  },

  /**
   * Récupère un exercice complet par son identifiant ou son slug
   */
  async getExerciseById(idOrSlug: string): Promise<Exercise | null> {
    const exo = MOCK_EXERCISES.find(
      (e) => e.id === idOrSlug || e.slug === idOrSlug
    );
    return exo || null;
  },

  /**
   * Récupère la liste des matières réelles présentes dans les exercices
   */
  async getAvailableSubjects(): Promise<{ slug: string; name: string }[]> {
    const subjectsMap = new Map<string, string>();
    MOCK_EXERCISES.forEach((e) => {
      if (!subjectsMap.has(e.subjectSlug)) {
        subjectsMap.set(e.subjectSlug, e.subject);
      }
    });

    return Array.from(subjectsMap.entries()).map(([slug, name]) => ({
      slug,
      name,
    }));
  },

  /**
   * Récupère la liste des concours réels associés aux exercices
   */
  async getAvailableCompetitions(): Promise<{ id: string; name: string }[]> {
    const compMap = new Map<string, string>();
    MOCK_EXERCISES.forEach((e) => {
      if (e.competitionId && e.competitionName && !compMap.has(e.competitionId)) {
        compMap.set(e.competitionId, e.competitionName);
      }
    });

    return Array.from(compMap.entries()).map(([id, name]) => ({
      id,
      name,
    }));
  },

  // ==========================================
  // GESTION DES SESSIONS (CLIENT / LOCALSTORAGE)
  // ==========================================

  getActiveSession(): ExerciseSession | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);
      if (!raw) return null;
      const session = JSON.parse(raw) as ExerciseSession;
      if (session && session.status === 'in_progress') {
        return session;
      }
      return null;
    } catch {
      return null;
    }
  },

  saveActiveSession(session: ExerciseSession): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Erreur sauvegarde session active', e);
    }
  },

  clearActiveSession(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
    } catch (e) {
      console.error('Erreur suppression session active', e);
    }
  },

  saveCompletedSession(session: ExerciseSession): void {
    if (typeof window === 'undefined') return;
    try {
      // 1. Retirer la session active si elle correspond
      const currentActive = this.getActiveSession();
      if (currentActive && currentActive.id === session.id) {
        this.clearActiveSession();
      }

      // 2. Ajouter à l'historique
      const rawHistory = localStorage.getItem(SESSIONS_HISTORY_STORAGE_KEY);
      const history: ExerciseSession[] = rawHistory ? JSON.parse(rawHistory) : [];
      // Remplacer si déjà présent ou prepend
      const filtered = history.filter((s) => s.id !== session.id);
      filtered.unshift({
        ...session,
        status: 'completed',
        completedAt: session.completedAt || new Date().toISOString(),
      });

      // Limiter aux 50 dernières sessions
      const trimmed = filtered.slice(0, 50);
      localStorage.setItem(SESSIONS_HISTORY_STORAGE_KEY, JSON.stringify(trimmed));
    } catch (e) {
      console.error('Erreur enregistrement session terminée', e);
    }
  },

  /**
   * Calcul précis de la progression de l'utilisateur à partir des sessions terminées
   * Conforme aux 3 niveaux stricts (Débutant, Intermédiaire, Pro)
   */
  getUserProgress(): ExerciseUserProgress {
    const defaultProgress: ExerciseUserProgress = {
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
    };

    if (typeof window === 'undefined') {
      return defaultProgress;
    }

    try {
      const rawHistory = localStorage.getItem(SESSIONS_HISTORY_STORAGE_KEY);
      const history: ExerciseSession[] = rawHistory ? JSON.parse(rawHistory) : [];
      const active = this.getActiveSession();

      if (history.length === 0) {
        return {
          ...defaultProgress,
          activeSession: active,
        };
      }

      const totalCompleted = history.length;
      const totalScoreSum = history.reduce((acc, s) => acc + (s.percentage || 0), 0);
      const avgScore = Math.round(totalScoreSum / totalCompleted);
      const totalTime = history.reduce((acc, s) => acc + (s.timeSpentSeconds || 0), 0);

      const subjectsSet = new Set<string>();
      
      // Statistiques par difficulté
      const diffScores: Record<'BEGINNER' | 'INTERMEDIATE' | 'PRO', number[]> = {
        BEGINNER: [],
        INTERMEDIATE: [],
        PRO: [],
      };

      // Statistiques par matière
      const subjectMap: Record<string, number[]> = {};

      history.forEach((s) => {
        if (s.subject) subjectsSet.add(s.subject);

        // Difficulté
        const diff = s.difficulty || 'INTERMEDIATE';
        if (diff in diffScores) {
          diffScores[diff as 'BEGINNER' | 'INTERMEDIATE' | 'PRO'].push(s.percentage || 0);
        }

        // Matière
        if (s.subject) {
          if (!subjectMap[s.subject]) subjectMap[s.subject] = [];
          subjectMap[s.subject].push(s.percentage || 0);
        }
      });

      const calcAvg = (arr: number[]) => (arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0);

      const bySubject: Record<string, { completed: number; avgScore: number }> = {};
      Object.entries(subjectMap).forEach(([subj, arr]) => {
        bySubject[subj] = {
          completed: arr.length,
          avgScore: calcAvg(arr),
        };
      });

      return {
        totalCompletedSessions: totalCompleted,
        averageScorePercentage: avgScore,
        totalTimeSpentSeconds: totalTime,
        subjectsPracticedCount: subjectsSet.size,
        byDifficulty: {
          beginner: {
            completedCount: diffScores.BEGINNER.length,
            averageScorePercentage: calcAvg(diffScores.BEGINNER),
          },
          intermediate: {
            completedCount: diffScores.INTERMEDIATE.length,
            averageScorePercentage: calcAvg(diffScores.INTERMEDIATE),
          },
          pro: {
            completedCount: diffScores.PRO.length,
            averageScorePercentage: calcAvg(diffScores.PRO),
          },
        },
        bySubject,
        byCompetition: {},
        recentSessions: history.slice(0, 5),
        activeSession: active,
      };
    } catch {
      return defaultProgress;
    }
  },

  // ==========================================
  // GESTION DES FAVORIS
  // ==========================================

  getFavoriteExerciseIds(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  isExerciseFavorite(id: string): boolean {
    const favs = this.getFavoriteExerciseIds();
    return favs.includes(id);
  },

  toggleFavorite(id: string): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const favs = this.getFavoriteExerciseIds();
      const index = favs.indexOf(id);
      let nextFavs: string[];
      let isFav = false;

      if (index >= 0) {
        nextFavs = favs.filter((item) => item !== id);
        isFav = false;
      } else {
        nextFavs = [...favs, id];
        isFav = true;
      }

      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(nextFavs));
      return isFav;
    } catch {
      return false;
    }
  },

  /**
   * Trouve le prochain test logique d'entraînement :
   * 1. Même ressource/série (orderIndex supérieur)
   * 2. Ou même concours officiel (orderIndex supérieur ou difficulté supérieure)
   * 3. Ou même matière et niveau (progression logique)
   */
  getNextExercise(currentExercise: Exercise): Exercise | null {
    if (!currentExercise) return null;

    // 1. Même série / ressource documentaire
    if (currentExercise.resourceId) {
      const sameResourceTests = MOCK_EXERCISES.filter(
        (e) => e.resourceId === currentExercise.resourceId && e.id !== currentExercise.id
      ).sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

      const nextInSeries = sameResourceTests.find(
        (e) => (e.orderIndex || 0) > (currentExercise.orderIndex || 0)
      );
      if (nextInSeries) return nextInSeries;
    }

    // 2. Même concours officiel
    if (currentExercise.competitionId) {
      const sameCompTests = MOCK_EXERCISES.filter(
        (e) => (e.competitionId === currentExercise.competitionId || e.competitionName === currentExercise.competitionName) && e.id !== currentExercise.id
      ).sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

      const nextInComp = sameCompTests.find(
        (e) => (e.orderIndex || 0) > (currentExercise.orderIndex || 0)
      );
      if (nextInComp) return nextInComp;

      // Si aucun avec orderIndex supérieur, chercher par difficulté croissante
      if (sameCompTests.length > 0) {
        const nextDifficulty = sameCompTests.find((e) => {
          if (currentExercise.difficulty === 'BEGINNER') return e.difficulty === 'INTERMEDIATE' || e.difficulty === 'PRO';
          if (currentExercise.difficulty === 'INTERMEDIATE') return e.difficulty === 'PRO';
          return false;
        });
        if (nextDifficulty) return nextDifficulty;
      }
    }

    // 3. Même matière et niveau
    const sameSubjectTests = MOCK_EXERCISES.filter(
      (e) =>
        (e.subjectSlug === currentExercise.subjectSlug || e.subject === currentExercise.subject) &&
        e.level === currentExercise.level &&
        e.id !== currentExercise.id
    );

    if (sameSubjectTests.length > 0) {
      // Priorité à un test de niveau de difficulté croissant
      const nextByDifficulty = sameSubjectTests.find((e) => {
        if (currentExercise.difficulty === 'BEGINNER') return e.difficulty === 'INTERMEDIATE';
        if (currentExercise.difficulty === 'INTERMEDIATE') return e.difficulty === 'PRO';
        return false;
      });
      if (nextByDifficulty) return nextByDifficulty;

      return sameSubjectTests[0];
    }

    return null;
  },
};
