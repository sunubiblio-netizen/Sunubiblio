/**
 * Sunubiblio — Gestionnaire Intelligent de Navigation Contextuelle des Exercices
 * 
 * Garantit que les retours et les transitions restent toujours dans le contexte
 * utilisateur (concours, matière, niveau, série) et ne renvoient jamais arbitrairement
 * vers une page sans rapport ou vers l'accueil.
 */

import { Exercise } from '@/types/exercise';

const EXERCISE_ORIGIN_KEY = 'sunubiblio_exercise_origin_url';

export const exerciseNavigation = {
  /**
   * Enregistre l'URL d'origine (catalogue, concours, niveau, matière, etc.)
   * N'enregistre que des URLs internes valides et ignore les routes de test directes.
   */
  saveOrigin(url: string): void {
    if (typeof window === 'undefined') return;
    try {
      if (!url || typeof url !== 'string') return;

      // Nettoyer et valider
      const path = url.startsWith('http') ? new URL(url).pathname + new URL(url).search : url;

      // Ne pas enregistrer une page d'épreuve en cours (/exercices/[id]) comme origine
      if (path.startsWith('/exercices/') && path !== '/exercices') {
        return;
      }

      // Ne conserver que les pages internes cohérentes
      if (
        path.startsWith('/exercices') ||
        path.startsWith('/concours') ||
        path.startsWith('/education') ||
        path.startsWith('/bibliotheque') ||
        path.startsWith('/profil') ||
        path.startsWith('/favoris')
      ) {
        sessionStorage.setItem(EXERCISE_ORIGIN_KEY, path);
      }
    } catch {
      // Ignorer silencieusement si sessionStorage n'est pas accessible
    }
  },

  /**
   * Récupère l'URL d'origine mémorisée ou calcule un repli contextuel intelligent
   * basé sur les métadonnées de l'exercice pour préserver concours, matière et niveau.
   */
  getOriginUrl(exercise?: Exercise | null): string {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem(EXERCISE_ORIGIN_KEY);
        if (saved && saved.startsWith('/') && (!saved.startsWith('/exercices/') || saved === '/exercices')) {
          return saved;
        }
      } catch {
        // Fallback
      }
    }

    // Repli contextuel riche sans jamais rediriger arbitrairement vers l'accueil
    if (exercise) {
      if (exercise.competitionId) {
        return `/exercices?competition=${encodeURIComponent(exercise.competitionId)}`;
      }
      if (exercise.subjectSlug) {
        const levelParam = exercise.level ? `&level=${encodeURIComponent(exercise.level)}` : '';
        return `/exercices?subject=${encodeURIComponent(exercise.subjectSlug)}${levelParam}`;
      }
      if (exercise.resourceId) {
        return `/exercices?resourceId=${encodeURIComponent(exercise.resourceId)}`;
      }
    }

    return '/exercices';
  },

  /**
   * Efface l'origine stockée si nécessaire
   */
  clearOrigin(): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.removeItem(EXERCISE_ORIGIN_KEY);
    } catch {
      // noop
    }
  },
};
