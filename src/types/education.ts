/**
 * Sunubiblio — Types stricts du module Éducation
 * Prévu pour être connecté ultérieurement au schéma relationnel PostgreSQL / Supabase
 * Hiérarchie : Cycle → Domaine → Filière → Matière → Ressources
 */

export type EducationCycleId =
  | 'prescolaire'
  | 'primaire'
  | 'college'
  | 'lycee'
  | 'universite'
  | 'formation_pro';

export interface EducationLevelCard {
  id: EducationCycleId;
  title: string;
  subtitle: string;
  description: string;
  slug: string;
  grades: string[];
  route: string;
  iconBg: string;
  iconColor: string;
  badge: string;
  isAvailable: boolean;
}

/** Entité Domaine (ex: Informatique & Numérique, Sciences & Mathématiques, etc.) */
export interface EducationDomain {
  id: string;
  cycleId: EducationCycleId;
  title: string;
  slug: string;
  description: string;
  iconName: string;
  color: string;
  bgColor: string;
  orderIndex: number;
}

/** Entité Filière / Série / Spécialité (ex: Licence Informatique, Master Génie Logiciel, Terminale S2, etc.) */
export interface EducationFiliere {
  id: string;
  domainId: string;
  cycleId: EducationCycleId;
  title: string;
  slug: string;
  degreeLevel?: string; // ex: 'Licence 1, 2, 3', 'Master 1 & 2', 'Doctorat', 'Baccalauréat'
  description: string;
  orderIndex: number;
}

/** Entité Matière rattachée à la filière (ex: Algorithmique, Droit Constitutionnel, etc.) */
export interface EducationHierarchySubject {
  id: string;
  filiereId: string;
  domainId: string;
  cycleId: EducationCycleId;
  name: string;
  slug: string;
  code?: string; // ex: 'INFO-101', 'DROIT-201'
  description: string;
  orderIndex: number;
}

export interface EducationSubject {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  color: string;
  bgColor: string;
  description: string;
}

export type EducationResourceType =
  | 'cours'
  | 'exercice'
  | 'revision'
  | 'annale'
  | 'livre'
  | 'support';

export interface EducationResourceTypeOption {
  id: EducationResourceType | 'all';
  label: string;
  iconName: string;
}

export type EducationAccessStatus = 'gratuit' | 'abonnement' | 'gold';

export interface EducationResource {
  id: string;
  title: string;
  description: string;
  type: EducationResourceType;
  typeLabel: string;
  subject: string;
  subjectSlug: string;
  level: EducationCycleId;
  levelLabel: string;
  // Relationnel hiérarchique optionnel pour rétrocompatibilité
  domainId?: string;
  domainTitle?: string;
  filiereId?: string;
  filiereTitle?: string;
  subjectId?: string;
  grade?: string;
  year?: number;
  isPremium: boolean;
  accessStatus: EducationAccessStatus;
  requiredPlan?: string;
  coverGradient: string;
  downloadsCount?: number;
  pagesCount?: number;
  featured?: boolean;
}

export interface EducationFilterState {
  searchQuery: string;
  level: EducationCycleId | 'all';
  grade: string; // 'all' or specific grade e.g. 'Licence 1', 'Master', 'Terminale S'
  domainId?: string; // 'all' or domain id
  filiereId?: string; // 'all' or filiere id
  subject: string; // 'all' or subject slug/id
  type: EducationResourceType | 'all';
  year: string; // 'all' or specific year e.g. '2024'
  accessStatus: 'all' | EducationAccessStatus;
  sortBy: 'pertinence' | 'recent' | 'titre';
}
