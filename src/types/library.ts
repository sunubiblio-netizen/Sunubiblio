/**
 * Sunubiblio — Types stricts du module Bibliothèque
 * Préfigurant les entités de la base de données PostgreSQL de production
 */

export type AccessLevel = 'free' | 'subscription' | 'premium';

export type ResourceFormat = 'pdf' | 'doc' | 'cours' | 'annale' | 'exercice' | 'qcm' | 'livre';

export type EducationCycle = 'primaire' | 'college' | 'lycee' | 'universite';

export interface ResourceLevel {
  cycle: EducationCycle;
  grade: string; // e.g. "Terminale S", "3e", "Licence 1", "CM2"
}

export interface Resource {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  author: string;
  institution?: string; // e.g. "UCAD", "FASTEF", "Ministère de l'Éducation Nationale"
  category: string; // e.g. "Livres", "Cours", "Annales", "Exercices", "Documents", "Concours", "Religion"
  subCategory?: string; // e.g. "Mouride", "Tidiane", "Baccalauréat", "ENA"
  level: ResourceLevel;
  subject: string; // e.g. "Mathématiques", "Physique-Chimie", "Français", "Informatique"
  resourceType: ResourceFormat;
  pagesCount: number;
  rating: number; // 0.0 to 5.0
  reviewsCount: number;
  year?: number;
  accessLevel: AccessLevel;
  featured?: boolean;
  coverGradient: string; // CSS linear gradient for artistic abstract cover
  coverBadgeColor?: string;
  coverImage?: string; // Optional real book cover image URL
  description: string;
  downloadsCount?: number;
  isFavorite?: boolean;
  extractedText?: string;
  keyConcepts?: string[];
}

export interface FilterState {
  searchQuery: string;
  category: string; // 'all' or category id
  cycle: string; // 'all' | 'primaire' | 'college' | 'lycee' | 'universite'
  grade?: string; // specific grade e.g. "Terminale S"
  subject: string; // 'all' or specific subject
  resourceType: string; // 'all' or specific format
  accessLevel: string; // 'all' | 'free' | 'subscription' | 'premium'
  competition?: string; // optional competition filter
  religionSub?: string; // optional religion subcategory
  sortBy: SortOption;
  page: number;
  perPage: number;
}

export type SortOption = 'pertinence' | 'recent' | 'rating' | 'pages';

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export interface GradeItem {
  id: string;
  name: string;
  short: string;
}

export interface CycleItem {
  id: EducationCycle;
  label: string;
  grades: GradeItem[];
}
