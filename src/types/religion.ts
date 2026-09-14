/**
 * Modèle de données hiérarchique pour le module Religion de Sunubiblio.
 * Conçu pour correspondre directement à un schéma PostgreSQL / Supabase :
 * religion_traditions -> religion_branches -> religion_theme_categories -> religion_resources
 */

export type ReligionTraditionId =
  | 'islam'
  | 'christianisme'
  | 'autres-religions';

export type ReligionBranchId =
  | 'mouride-touba'
  | 'tidiane-tivaouane'
  | 'niassene'
  | 'layene'
  | 'islam-autres'
  | 'christianisme-general'
  | 'autres-spiritualites'
  | string;

export type ReligionThemeCategoryId =
  | 'livres'
  | 'enseignements'
  | 'histoire'
  | 'figures-importantes'
  | 'textes'
  | 'conferences'
  | 'documents'
  | 'autres-ressources';

export type ReligionResourceType =
  | 'livre'
  | 'cours'
  | 'document'
  | 'article'
  | 'conference'
  | 'guide'
  | 'texte';

export interface ReligionTradition {
  id: ReligionTraditionId;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  accentColor: string;
  bgLight: string;
  borderColor: string;
  iconName: string;
  branchesCount: number;
  resourceCount: number;
}

export interface ReligionBranch {
  id: ReligionBranchId;
  traditionId: ReligionTraditionId;
  title: string;
  subtitle: string;
  location?: string;
  description: string;
  badge?: string;
  accentColor: string;
  bgLight: string;
  borderColor: string;
  resourceCount: number;
}

export interface ReligionThemeCategory {
  id: ReligionThemeCategoryId;
  label: string;
  description: string;
  iconName: string;
}

export interface ReligionResource {
  id: string;
  slug: string;
  title: string;
  author: string;
  authorBio?: string;
  traditionId: ReligionTraditionId;
  branchId: ReligionBranchId;
  themeCategoryId: ReligionThemeCategoryId;
  contentType: ReligionResourceType;
  year?: number;
  period?: string;
  language: string;
  accessLevel: 'free' | 'premium';
  description: string;
  summary?: string[];
  coverUrl?: string;
  coverPattern?: 'geometric-amber' | 'geometric-indigo' | 'geometric-emerald' | 'geometric-slate' | 'geometric-cyan';
  pagesCount?: number;
  duration?: string;
  source: string;
  tags: string[];
  featured?: boolean;
}

export interface ReligionFilterState {
  searchQuery: string;
  traditionId: ReligionTraditionId | 'all';
  branchId: ReligionBranchId | 'all';
  themeCategoryId: ReligionThemeCategoryId | 'all';
  contentType: ReligionResourceType | 'all';
  author: string | 'all';
  year: string | 'all'; // 'all', 'before-1800', '1800-1950', 'post-1950'
  accessLevel: 'all' | 'free' | 'premium';
  sortBy: 'pertinence' | 'recent' | 'titre' | 'auteur';
  page: number;
  perPage: number;
}
