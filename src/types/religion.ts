/**
 * Modèle de données universel et hiérarchique pour le module Religion de Sunubiblio.
 * Prêt pour PostgreSQL / Supabase :
 * traditions -> branches -> theme_categories -> resources
 */

export type ReligionTraditionId =
  | 'islam'
  | 'christianisme'
  | 'judaisme'
  | 'hindouisme'
  | 'bouddhisme'
  | 'sikhisme'
  | 'taoisme'
  | 'religions-traditionnelles-africaines'
  | 'autres-traditions';

export type ReligionBranchId =
  // Islam
  | 'mouride-touba'
  | 'tidiane-tivaouane'
  | 'niassene'
  | 'layene'
  | 'islam-autres'
  // Christianisme
  | 'catholicisme'
  | 'protestantisme'
  | 'orthodoxie'
  | 'autres-traditions-chretiennes'
  // Judaïsme
  | 'judaisme-rabbinique'
  // Hindouisme
  | 'hindouisme-vedique'
  // Bouddhisme
  | 'bouddhisme-general'
  // Sikhisme
  | 'sikhisme-gurmat'
  // Taoïsme
  | 'taoisme-philosophique'
  // Spiritualités traditionnelles africaines
  | 'afrique-cosmogonies'
  // Autres sagesses
  | 'autres-sagesses'
  | string;

export type ReligionThemeCategoryId =
  | 'livres'
  | 'enseignements'
  | 'histoire'
  | 'figures'
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

export type ReligionResourceStatus = 'disponible' | 'en_numerisation' | 'archive';

export type ReligionPlanRequired = 'gratuit' | 'simple' | 'recommande' | 'gold';

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
  isSenegalPriority?: boolean;
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
  titre: string;
  description: string;
  auteur: string;
  auteurBio?: string;
  traditionId: ReligionTraditionId;
  branchId: ReligionBranchId;
  themeCategoryId: ReligionThemeCategoryId;
  contentType: ReligionResourceType;
  year?: number;
  period?: string;
  language: string;
  couverture?: string;
  coverPattern?:
    | 'geometric-amber'
    | 'geometric-indigo'
    | 'geometric-emerald'
    | 'geometric-slate'
    | 'geometric-cyan'
    | 'geometric-purple'
    | 'geometric-rose';
  fileUrl?: string;
  pagesCount?: number;
  fileSize?: string;
  status: ReligionResourceStatus;
  requiredPlan: ReligionPlanRequired;
  publishedAt: string;
  viewsCount: number;
  downloadsCount: number;
  summary?: string[];
  tags: string[];
  source: string;
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
  requiredPlan: 'all' | ReligionPlanRequired;
  sortBy: 'pertinence' | 'recent' | 'titre' | 'auteur';
  page: number;
  perPage: number;
}
