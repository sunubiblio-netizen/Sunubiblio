/**
 * Sunubiblio — Types Professionnels & Professeurs
 * 
 * Modèle de données unifié :
 * Un utilisateur possède UN SEUL compte Sunubiblio.
 * Les statuts et badges professionnels (Enseignant, Formateur, Auteur, Vendeur)
 * sont rattachés au profil et contrôlés côté serveur.
 */

import { UserPlanSlug } from '@/services/subscriptionAccessService';

export type TeachingMode = 'visio' | 'presentiel' | 'domicile';

export type AcademicLevel = 
  | 'primaire' 
  | 'college' 
  | 'lycee' 
  | 'superieur' 
  | 'concours_prepa';

export type ProfessionalBadgeType = 
  | 'enseignant_verifie'
  | 'formateur_certifie'
  | 'auteur'
  | 'vendeur';

export type AvailabilityStatus = 'disponible' | 'limitee' | 'occupe';

export interface AvailabilitySlot {
  day: string; // Ex: 'Lundi', 'Mercredi', 'Samedi'
  hours: string; // Ex: '16h00 - 19h00'
}

export interface ProfessorReview {
  id: string;
  studentName: string;
  studentAvatar?: string;
  rating: number; // 1 à 5
  comment: string;
  courseSubject: string;
  courseMode: TeachingMode;
  date: string;
  isVerifiedSession: boolean; // Preuve de cours réellement effectué
}

export interface ProfessorProfile {
  id: string;
  userId: string;
  fullName: string;
  headline: string; // Ex: "Professeur certifié FASTEF de Mathématiques & Physique"
  bio: string;
  avatarUrl: string;
  verified: boolean;
  badges: ProfessionalBadgeType[];
  subscriptionPlan: UserPlanSlug; // Utilisé pour le calcul de visibilité pondéré
  subjects: string[]; // Ex: ['Mathématiques', 'Physique-Chimie', 'Sciences']
  levels: AcademicLevel[];
  city: string; // Ex: 'Dakar', 'Thiès', 'Saint-Louis'
  country: string; // Ex: 'Sénégal', 'Côte d\'Ivoire', 'France', 'Maroc'
  zones: string[]; // Ex: ['Plateau', 'Fann', 'Mermoz', 'En ligne']
  modes: TeachingMode[];
  hourlyRate: number; // Tarif en FCFA
  currency: string; // Toujours 'FCFA'
  experienceYears: number;
  education: string; // Ex: 'Master Didactique des Sciences (FASTEF / UCAD)'
  languages: string[]; // Ex: ['Français', 'Wolof', 'Anglais']
  rating: number; // Note moyenne (sur 5)
  reviewCount: number; // Nombre d'avis vérifiés
  reviews?: ProfessorReview[];
  availabilityStatus: AvailabilityStatus;
  availabilityNote: string; // Ex: 'Disponible cette semaine'
  availableSlots: AvailabilitySlot[];
  isTopTutor?: boolean;
}

export type ProfessorSortOption = 
  | 'pertinence'
  | 'availability'
  | 'rating_desc'
  | 'price_asc'
  | 'price_desc'
  | 'experience_desc';

export interface ProfessorFilterState {
  query: string;
  subject: string;
  level: string;
  country: string; // 'all' ou nom du pays
  city: string;
  mode: string;
  priceRange: string; // 'all' | 'lt_5000' | '5000_10000' | 'gt_10000'
  availability: string; // 'all' | 'disponible' | 'semaine' | 'weekend'
  language: string;
  minExperience: string; // 'all' | '1' | '3' | '5'
  sort: ProfessorSortOption;
}

export interface BookingFormState {
  professorId: string;
  professorName: string;
  subject: string;
  mode: TeachingMode;
  date: string;
  timeSlot: string;
  durationHours: number;
  studentName: string;
  studentPhone: string;
  notes?: string;
}

export interface BecomeProfessorApplication {
  fullName: string;
  phone: string;
  headline: string;
  subjects: string[];
  levels: AcademicLevel[];
  modes: TeachingMode[];
  country: string;
  city: string;
  experienceYears: number;
  diplomaOrInstitution: string;
  hourlyRate: number;
  presentation: string;
}
