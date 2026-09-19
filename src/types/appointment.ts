/**
 * Sunubiblio — Types Rendez-vous & Réservations
 *
 * Architecture évolutive :
 * Un rendez-vous est toujours lié à UN utilisateur (étudiant)
 * et à UN profil professeur (userId rattaché au compte Sunubiblio).
 *
 * Les vérifications d'autorisation sont TOUJOURS côté serveur.
 */

import { TeachingMode } from './professor';

export type AppointmentStatus =
  | 'upcoming'    // À venir
  | 'today'       // Aujourd'hui
  | 'pending'     // En attente de confirmation
  | 'completed'   // Terminé
  | 'cancelled';  // Annulé

export type AppointmentType =
  | 'cours'       // Cours particulier
  | 'formation'   // Formation structurée
  | 'rdv';        // Rendez-vous simple (orientation, conseil)

export type AppointmentPeriodFilter =
  | 'all'
  | 'today'
  | 'this_week'
  | 'this_month';

/** Rendez-vous complet */
export interface Appointment {
  id: string;
  studentId: string;           // ID de l'étudiant (= userId Sunubiblio)

  // Enseignant
  professorId: string;
  professorName: string;
  professorAvatar?: string;    // URL relative ou absolue
  professorVerified: boolean;
  professorRating: number;

  // Contenu
  subject: string;             // Ex: 'Mathématiques', 'Philosophie'
  type: AppointmentType;
  mode: TeachingMode;

  // Programmation
  date: string;                // ISO 8601 : '2026-09-17'
  startTime: string;           // Ex: '14:30'
  endTime: string;             // Ex: '16:00'
  durationMinutes: number;

  // Statut
  status: AppointmentStatus;

  // Tarification
  pricePerHour: number;        // FCFA
  totalPrice: number;          // FCFA
  currency: string;            // Toujours 'FCFA'
  isPaid: boolean;

  // Visio
  visioLink?: string;          // URL sécurisée — fournie côté serveur uniquement
  visioAvailable?: boolean;    // True uniquement si la session est réellement ouverte

  // Détails
  description?: string;        // Notes / contexte de la séance
  location?: string;           // Adresse si présentiel/domicile
  notes?: string;              // Notes privées de l'étudiant

  // Méta
  bookedAt: string;            // ISO 8601
  updatedAt?: string;
  hasReview?: boolean;         // L'étudiant a déjà laissé un avis
  canReview?: boolean;         // Le serveur autorise un avis (séance terminée, avis absent)
  canModify?: boolean;         // Modification autorisée (délai non dépassé)
  canCancel?: boolean;         // Annulation autorisée
}

/** État des filtres de la page */
export interface AppointmentFilterState {
  searchQuery: string;
  status: AppointmentStatus | 'all';
  mode: TeachingMode | 'all';
  period: AppointmentPeriodFilter;
  type: AppointmentType | 'all';
}

/** Statistiques calculées à partir des vraies données */
export interface AppointmentStats {
  upcoming: number;
  today: number;
  completed: number;
  pending: number;
  totalSpent: number;          // FCFA — total des séances payées
}
