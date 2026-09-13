/**
 * Sunubiblio — Types stricts du module Concours
 * Préfigurant les tables PostgreSQL de préparation aux concours
 */

export type ContestStatus = 'open' | 'upcoming' | 'closed';

export type ContestDomain =
  | 'enseignement'
  | 'administration'
  | 'defense_securite'
  | 'sante'
  | 'finance'
  | 'technique'
  | 'autre';

export type RequiredDiploma =
  | 'bfem'
  | 'bac'
  | 'bac_plus_2'
  | 'bac_plus_3'
  | 'bac_plus_4'
  | 'bac_plus_5';

export interface ContestSubject {
  id: string;
  name: string;
  description: string;
  resourcesCount: number;
  subjectsCount: number;
  exercisesCount: number;
  iconName: string; // e.g. 'calculator', 'book', 'globe', 'feather'
}

export interface ContestCondition {
  id: string;
  title: string;
  description: string;
  category: 'age' | 'diploma' | 'nationality' | 'documents' | 'particular';
  isMandatory: boolean;
}

export interface ContestPaperResource {
  id: string;
  title: string;
  year: number;
  subjectName: string;
  type: 'sujet' | 'correction' | 'fascicule';
  format: 'pdf' | 'doc' | 'qcm';
  pagesCount: number;
  accessLevel: 'free' | 'subscription' | 'premium';
  authorOrSource?: string;
  hasCorrection?: boolean;
}

export interface ContestProgressData {
  globalPercentage: number;
  completedSubjects: number;
  totalSubjects: number;
  completedExercises: number;
  totalExercises: number;
  completedQuizzes: number;
  totalQuizzes: number;
  studyHours: number;
}

export interface Contest {
  id: string;
  slug: string;
  name: string; // e.g. "FASTEF"
  fullName: string; // e.g. "Faculté des Sciences et Technologies de l'Éducation et de la Formation"
  shortDescription: string;
  longDescription: string;
  organization: string; // e.g. "Université Cheikh Anta Diop (UCAD) / Ministère de l'Éducation"
  domain: ContestDomain;
  requiredDiploma: RequiredDiploma;
  diplomaLabel: string; // e.g. "Licence 3 (Bac +3)"
  country: 'senegal' | 'international';
  status: ContestStatus;
  statusLabel: string;
  sessionYear: number;
  applicationDeadline?: string;
  examDate?: string;
  resourcesCount: number;
  isPopular: boolean;
  coverGradient: string;
  badgeColor: string;
  subjects: ContestSubject[];
  conditions: ContestCondition[];
  papers: ContestPaperResource[];
  sampleProgress?: ContestProgressData;
}

export interface ContestFilterState {
  searchQuery: string;
  domain: string; // 'all' or specific domain
  diploma: string; // 'all' or specific diploma
  status: string; // 'all' | 'open' | 'upcoming' | 'closed'
  country: string; // 'all' | 'senegal' | 'international'
  sortBy: 'pertinence' | 'recent' | 'popular' | 'name';
  page: number;
  perPage: number;
}
