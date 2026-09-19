/**
 * Sunubiblio — Service Métier des Professeurs & Formateurs
 * 
 * Centralise :
 * - Le moteur de recherche et filtrage multi-critères
 * - L'algorithme de classement par pertinence académique et facteur de visibilité
 * - Le contrôle d'éligibilité pour devenir enseignant (abonnement >= 3 000 FCFA)
 * - La préparation des demandes de réservation
 */

import {
  ProfessorProfile,
  ProfessorFilterState,
  TeachingMode,
  BookingFormState,
  BecomeProfessorApplication,
} from '@/types/professor';
import { INITIAL_PROFESSORS } from '@/data/mockProfessors';
import { PRICING_PLANS } from '@/data/pricingPlans';
import { UserPlanSlug } from '@/services/subscriptionAccessService';

/**
 * Coefficients de visibilité configurables côté serveur selon le niveau d'abonnement.
 * Ne s'appliquent QUE SI le profil est pertinent par rapport à la recherche.
 */
export const SUBSCRIPTION_VISIBILITY_MULTIPLIERS: Record<UserPlanSlug, number> = {
  gratuit: 1.0,
  simple: 1.08,      // 3 000 FCFA
  recommande: 1.18,  // 5 000 FCFA
  gold: 1.28,        // 9 000 FCFA
};

/**
 * Seuil minimum d'abonnement pour postuler comme enseignant / formateur certifié
 */
export const MIN_SUBSCRIPTION_PRICE_FOR_TEACHER = 3000; // 3 000 FCFA

export const professorService = {
  /**
   * Récupère la liste complète des profils professionnels autorisés à être publics
   */
  getAllProfessors(): ProfessorProfile[] {
    return [...INITIAL_PROFESSORS];
  },

  /**
   * Calcule le score de pertinence d'un profil pour une recherche et des filtres donnés
   */
  calculateRelevanceScore(prof: ProfessorProfile, filters: ProfessorFilterState): number {
    let baseScore = 0;
    const q = filters.query.trim().toLowerCase();

    // 1. Recherche textuelle
    if (q) {
      let matchedText = false;
      const name = prof.fullName.toLowerCase();
      const headline = prof.headline.toLowerCase();
      const bio = prof.bio.toLowerCase();
      const education = prof.education.toLowerCase();
      const subjectsStr = prof.subjects.join(' ').toLowerCase();

      if (name.includes(q)) {
        baseScore += 60;
        matchedText = true;
      }
      if (subjectsStr.includes(q)) {
        baseScore += 50;
        matchedText = true;
      }
      if (headline.includes(q)) {
        baseScore += 30;
        matchedText = true;
      }
      if (bio.includes(q)) {
        baseScore += 20;
        matchedText = true;
      }
      if (education.includes(q)) {
        baseScore += 15;
        matchedText = true;
      }

      // Si l'utilisateur a tapé une recherche textuelle mais qu'aucun mot-clé ne concorde
      if (!matchedText) {
        return 0; // Profil disqualifié pour cette recherche textuelle
      }
    } else {
      // Pas de requête textuelle : score de base neutre pour tous
      baseScore += 50;
    }

    // 2. Correspondance matière explicite
    if (filters.subject && filters.subject !== 'all' && filters.subject !== 'Toutes les matières') {
      const matchSubject = prof.subjects.some((s) => 
        s.toLowerCase().includes(filters.subject.toLowerCase()) || 
        filters.subject.toLowerCase().includes(s.toLowerCase())
      );
      if (matchSubject) {
        baseScore += 40;
      } else if (q) {
        // Si la matière demandée ne concorde pas du tout
        return 0;
      }
    }

    // 3. Correspondance niveau explicite
    if (filters.level && filters.level !== 'all') {
      if (prof.levels.includes(filters.level as any)) {
        baseScore += 30;
      } else if (q) {
        return 0;
      }
    }

    // 4. Correspondance mode d'enseignement
    if (filters.mode && filters.mode !== 'all') {
      if (prof.modes.includes(filters.mode as TeachingMode)) {
        baseScore += 25;
      } else {
        return 0; // Mode incompatible
      }
    }

    // 5. Correspondance Pays explicite
    if (filters.country && filters.country !== 'all' && filters.country !== 'Tous les pays') {
      if (prof.country.toLowerCase() === filters.country.toLowerCase()) {
        baseScore += 30;
      } else if (filters.country.includes('International') || filters.country.includes('En ligne')) {
        if (prof.modes.includes('visio')) {
          baseScore += 15;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    }

    // 6. Correspondance Ville / Zone
    if (filters.city && filters.city !== 'all' && filters.city !== 'Toutes les villes') {
      const matchCity = prof.city.toLowerCase().includes(filters.city.toLowerCase()) ||
        prof.zones.some((z) => z.toLowerCase().includes(filters.city.toLowerCase())) ||
        (filters.city.includes('En ligne') && prof.modes.includes('visio'));
      if (matchCity) {
        baseScore += 20;
      } else {
        return 0;
      }
    }

    // 7. Bonus Profil Vérifié & Qualité
    if (prof.verified) {
      baseScore += 15;
    }
    if (prof.badges.includes('formateur_certifie')) {
      baseScore += 10;
    }
    if (prof.isTopTutor) {
      baseScore += 10;
    }

    // 8. Avis réels & Note
    baseScore += (prof.rating || 0) * 4; // jusqu'à 20 pts
    baseScore += Math.min(prof.reviewCount || 0, 40) * 0.5; // jusqu'à 20 pts

    // 9. Expérience
    baseScore += Math.min(prof.experienceYears || 0, 15) * 0.8; // jusqu'à 12 pts

    // 10. Disponibilité
    if (prof.availabilityStatus === 'disponible') {
      baseScore += 10;
    }

    // 11. Facteur de visibilité selon l'abonnement
    // IMPORTANT : ne s'applique qu'en multiplicateur modéré d'un profil déjà pertinent
    const multiplier = SUBSCRIPTION_VISIBILITY_MULTIPLIERS[prof.subscriptionPlan] || 1.0;
    const finalScore = Math.round(baseScore * multiplier);

    return finalScore;
  },

  /**
   * Filtrage et tri de l'ensemble des professeurs
   */
  filterProfessors(
    professors: ProfessorProfile[],
    filters: ProfessorFilterState
  ): { items: ProfessorProfile[]; totalCount: number } {
    // 1. Filtrage strict par critères combinés
    const filtered = professors.filter((prof) => {
      // Filtrage par pays
      if (filters.country && filters.country !== 'all' && filters.country !== 'Tous les pays') {
        if (filters.country === 'International / En ligne') {
          if (!prof.modes.includes('visio')) return false;
        } else if (prof.country.toLowerCase() !== filters.country.toLowerCase()) {
          return false;
        }
      }

      // Filtrage par tarif
      if (filters.priceRange && filters.priceRange !== 'all') {
        if (filters.priceRange === 'lt_5000' && prof.hourlyRate >= 5000) return false;
        if (filters.priceRange === '5000_10000' && (prof.hourlyRate < 5000 || prof.hourlyRate > 10000)) return false;
        if (filters.priceRange === 'gt_10000' && prof.hourlyRate <= 10000) return false;
      }

      // Filtrage par disponibilité
      if (filters.availability && filters.availability !== 'all') {
        if (filters.availability === 'disponible' && prof.availabilityStatus !== 'disponible') return false;
        if (filters.availability === 'weekend') {
          const hasWeekendSlot = prof.availableSlots.some((slot) => 
            slot.day.toLowerCase().includes('samedi') || slot.day.toLowerCase().includes('dimanche')
          );
          if (!hasWeekendSlot) return false;
        }
        if (filters.availability === 'semaine') {
          const hasWeekdaySlot = prof.availableSlots.some((slot) => 
            !slot.day.toLowerCase().includes('samedi') && !slot.day.toLowerCase().includes('dimanche')
          );
          if (!hasWeekdaySlot) return false;
        }
      }

      // Filtrage par langue
      if (filters.language && filters.language !== 'all' && filters.language !== 'Toutes les langues') {
        if (!prof.languages.includes(filters.language)) return false;
      }

      // Filtrage par expérience minimale
      if (filters.minExperience && filters.minExperience !== 'all') {
        const minYears = parseInt(filters.minExperience, 10);
        if (!isNaN(minYears) && prof.experienceYears < minYears) return false;
      }

      // Calcul du score de pertinence
      const score = this.calculateRelevanceScore(prof, filters);
      return score > 0;
    });

    // 2. Tri selon l'option choisie
    const sorted = [...filtered].sort((a, b) => {
      if (filters.sort === 'availability') {
        const order = { disponible: 3, limitee: 2, occupe: 1 };
        const scoreDiff = (order[b.availabilityStatus] || 0) - (order[a.availabilityStatus] || 0);
        if (scoreDiff !== 0) return scoreDiff;
        return b.rating - a.rating;
      }
      if (filters.sort === 'rating_desc') {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.reviewCount - a.reviewCount;
      }
      if (filters.sort === 'price_asc') {
        return a.hourlyRate - b.hourlyRate;
      }
      if (filters.sort === 'price_desc') {
        return b.hourlyRate - a.hourlyRate;
      }
      if (filters.sort === 'experience_desc') {
        return b.experienceYears - a.experienceYears;
      }
      // Par défaut : pertinence pondérée
      const scoreA = this.calculateRelevanceScore(a, filters);
      const scoreB = this.calculateRelevanceScore(b, filters);
      return scoreB - scoreA;
    });

    return {
      items: sorted,
      totalCount: sorted.length,
    };
  },

  /**
   * Récupère un professeur par son identifiant unique
   */
  getProfessorById(id: string): ProfessorProfile | undefined {
    return INITIAL_PROFESSORS.find((p) => p.id === id);
  },

  /**
   * Vérifie si un utilisateur a le droit de postuler comme enseignant/formateur
   * Règle : abonnement actif >= 3 000 FCFA
   */
  checkTeacherEligibility(userPlanSlug: UserPlanSlug = 'gratuit'): {
    eligible: boolean;
    requiredPrice: number;
    currentPlanName: string;
    currentPlanPrice: number;
    message: string;
  } {
    const plan = PRICING_PLANS.find((p) => p.slug === userPlanSlug) || PRICING_PLANS[0];
    const isEligible = plan.price >= MIN_SUBSCRIPTION_PRICE_FOR_TEACHER;

    return {
      eligible: isEligible,
      requiredPrice: MIN_SUBSCRIPTION_PRICE_FOR_TEACHER,
      currentPlanName: plan.name,
      currentPlanPrice: plan.price,
      message: isEligible
        ? 'Votre formule actuelle vous autorise à soumettre votre dossier enseignant.'
        : `Un abonnement actif d'au moins ${MIN_SUBSCRIPTION_PRICE_FOR_TEACHER.toLocaleString('fr-FR')} FCFA/mois est requis pour devenir enseignant vérifié.`,
    };
  },

  /**
   * Soumission d'une demande de réservation de cours (sécurisée)
   */
  submitBooking(data: BookingFormState): { success: boolean; bookingId: string; summary: string } {
    const bookingId = `book_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      success: true,
      bookingId,
      summary: `Réservation enregistrée avec succès pour ${data.professorName} (${data.subject}) le ${data.date} à ${data.timeSlot}.`,
    };
  },

  /**
   * Soumission d'une candidature « Devenir enseignant/formateur »
   */
  submitTeacherApplication(data: BecomeProfessorApplication): { success: boolean; applicationId: string; message: string } {
    const applicationId = `app_prof_${Date.now()}`;
    return {
      success: true,
      applicationId,
      message: 'Votre candidature a bien été reçue. L’équipe pédagogique Sunubiblio l’examinera sous 48h ouvrées.',
    };
  },
};
