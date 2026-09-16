/**
 * Sunubiblio — Configuration Centralisée du App Launcher (Menu Applications)
 * 
 * Organisé rigoureusement selon les 7 grandes catégories de l'écosystème :
 * 1. APPRENDRE
 * 2. SAVOIRS & FORMATIONS
 * 3. COMMUNAUTÉ
 * 4. VISIO & RENDEZ-VOUS
 * 5. OUTILS & PRODUCTIVITÉ
 * 6. ASSISTANTS & UTILITAIRES
 * 7. COMMERCE
 */

export type AppCategoryKey = 
  | 'apprendre'
  | 'savoirs'
  | 'communaute'
  | 'visio_rdv'
  | 'outils'
  | 'assistants'
  | 'commerce';

export interface AppLauncherItemData {
  id: string;
  name: string;
  shortDescription?: string;
  href: string;
  iconId: string;
  category: AppCategoryKey;
  order: number;
  badge?: {
    text: string;
    variant: 'ai' | 'new' | 'popular' | 'pro';
  };
  enabled: boolean;
  available?: boolean;
}

export interface AppCategoryData {
  key: AppCategoryKey;
  title: string;
  description: string;
}

export const APP_LAUNCHER_CATEGORIES: AppCategoryData[] = [
  {
    key: 'apprendre',
    title: 'APPRENDRE',
    description: 'Bibliothèque, parcours scolaires, concours et entraînement',
  },
  {
    key: 'savoirs',
    title: 'SAVOIRS & FORMATIONS',
    description: 'Cours approfondis, ressources académiques et traditions',
  },
  {
    key: 'communaute',
    title: 'COMMUNAUTÉ',
    description: 'Réseau collaboratif, échanges, groupes et profils',
  },
  {
    key: 'visio_rdv',
    title: 'VISIO & RENDEZ-VOUS',
    description: 'Salons d’étude en direct, tutorat et planning',
  },
  {
    key: 'outils',
    title: 'OUTILS & PRODUCTIVITÉ',
    description: 'Espace personnel, documents, téléchargements et notes',
  },
  {
    key: 'assistants',
    title: 'ASSISTANTS & UTILITAIRES',
    description: 'Intelligence artificielle Sunubiblio, recherche et outils documentaires',
  },
  {
    key: 'commerce',
    title: 'COMMERCE',
    description: 'Marketplace d’ouvrages, achat et vente de résumés certifiés',
  },
];

export const APP_LAUNCHER_ITEMS: AppLauncherItemData[] = [
  // ==========================================
  // 1. APPRENDRE
  // ==========================================
  {
    id: 'bibliotheque',
    name: 'Bibliothèque',
    shortDescription: 'Livres et thèses',
    href: '/bibliotheque',
    iconId: 'book',
    category: 'apprendre',
    order: 1,
    enabled: true,
    available: true,
  },
  {
    id: 'education',
    name: 'Éducation',
    shortDescription: 'Du primaire au doctorat',
    href: '/education',
    iconId: 'education',
    category: 'apprendre',
    order: 2,
    enabled: true,
    available: true,
  },
  {
    id: 'concours',
    name: 'Concours',
    shortDescription: 'Annales officielles',
    href: '/concours',
    iconId: 'concours',
    category: 'apprendre',
    order: 3,
    badge: { text: 'Populaire', variant: 'popular' },
    enabled: true,
    available: true,
  },
  {
    id: 'exercices',
    name: 'Exercices',
    shortDescription: 'QCM et évaluations',
    href: '/exercices',
    iconId: 'exercices',
    category: 'apprendre',
    order: 4,
    enabled: true,
    available: true,
  },

  // ==========================================
  // 2. SAVOIRS & FORMATIONS
  // ==========================================
  {
    id: 'cours',
    name: 'Cours',
    shortDescription: 'Modules structurés',
    href: '/education',
    iconId: 'cours',
    category: 'savoirs',
    order: 1,
    enabled: true,
    available: true,
  },
  {
    id: 'ressources',
    name: 'Ressources',
    shortDescription: 'Supports d’archives',
    href: '/bibliotheque',
    iconId: 'ressources',
    category: 'savoirs',
    order: 2,
    enabled: true,
    available: true,
  },
  {
    id: 'documents',
    name: 'Documents',
    shortDescription: 'Documents certifiés',
    href: '/documents',
    iconId: 'documents',
    category: 'savoirs',
    order: 3,
    enabled: true,
    available: true,
  },
  {
    id: 'religion',
    name: 'Religion',
    shortDescription: 'Textes et traditions',
    href: '/religion',
    iconId: 'religion',
    category: 'savoirs',
    order: 4,
    enabled: true,
    available: true,
  },

  // ==========================================
  // 3. COMMUNAUTÉ
  // ==========================================
  {
    id: 'communaute',
    name: 'Communauté',
    shortDescription: 'Espace d’entraide',
    href: '/communaute',
    iconId: 'communaute',
    category: 'communaute',
    order: 1,
    enabled: true,
    available: true,
  },
  {
    id: 'profil',
    name: 'Profil',
    shortDescription: 'Espace personnel',
    href: '/profil',
    iconId: 'profil',
    category: 'communaute',
    order: 2,
    enabled: true,
    available: true,
  },
  {
    id: 'publications',
    name: 'Publications',
    shortDescription: 'Articles et partages',
    href: '/communaute',
    iconId: 'publications',
    category: 'communaute',
    order: 3,
    enabled: true,
    available: true,
  },
  {
    id: 'groupes',
    name: 'Groupes',
    shortDescription: 'Salons thématiques',
    href: '/communaute',
    iconId: 'groupes',
    category: 'communaute',
    order: 4,
    enabled: true,
    available: true,
  },
  {
    id: 'discussions',
    name: 'Discussions',
    shortDescription: 'Échanges en direct',
    href: '/communaute',
    iconId: 'discussions',
    category: 'communaute',
    order: 5,
    enabled: true,
    available: true,
  },

  // ==========================================
  // 4. VISIO & RENDEZ-VOUS
  // ==========================================
  {
    id: 'visio',
    name: 'Visio',
    shortDescription: 'Salons d’étude live',
    href: '/visio',
    iconId: 'visio',
    category: 'visio_rdv',
    order: 1,
    badge: { text: 'Nouveau', variant: 'new' },
    enabled: true,
    available: true,
  },
  {
    id: 'mes-rendez-vous',
    name: 'Mes rendez-vous',
    shortDescription: 'Séances de révision',
    href: '/agenda',
    iconId: 'rendez_vous',
    category: 'visio_rdv',
    order: 2,
    enabled: true,
    available: true,
  },
  {
    id: 'calendrier',
    name: 'Calendrier',
    shortDescription: 'Dates des concours',
    href: '/agenda',
    iconId: 'calendrier',
    category: 'visio_rdv',
    order: 3,
    enabled: true,
    available: true,
  },
  {
    id: 'emploi-du-temps',
    name: 'Emploi du temps',
    shortDescription: 'Planning hebdomadaire',
    href: '/agenda',
    iconId: 'emploi_du_temps',
    category: 'visio_rdv',
    order: 4,
    enabled: true,
    available: true,
  },

  // ==========================================
  // 5. OUTILS & PRODUCTIVITÉ
  // ==========================================
  {
    id: 'mes-documents',
    name: 'Mes documents',
    shortDescription: 'Fichiers enregistrés',
    href: '/documents',
    iconId: 'mes_documents',
    category: 'outils',
    order: 1,
    enabled: true,
    available: true,
  },
  {
    id: 'telechargements',
    name: 'Téléchargements',
    shortDescription: 'Fichiers hors-ligne',
    href: '/documents',
    iconId: 'telechargements',
    category: 'outils',
    order: 2,
    enabled: true,
    available: true,
  },
  {
    id: 'favoris',
    name: 'Favoris',
    shortDescription: 'Ressources sauvegardées',
    href: '/favoris',
    iconId: 'favoris',
    category: 'outils',
    order: 3,
    enabled: true,
    available: true,
  },
  {
    id: 'historique',
    name: 'Historique',
    shortDescription: 'Dernières lectures',
    href: '/profil',
    iconId: 'historique',
    category: 'outils',
    order: 4,
    enabled: true,
    available: true,
  },
  {
    id: 'notes',
    name: 'Notes',
    shortDescription: 'Bloc-notes personnel',
    href: '/documents',
    iconId: 'notes',
    category: 'outils',
    order: 5,
    enabled: true,
    available: true,
  },

  // ==========================================
  // 6. ASSISTANTS & UTILITAIRES
  // ==========================================
  {
    id: 'sunubiblio-ai',
    name: 'Sunubiblio AI',
    shortDescription: 'Assistant intelligent',
    href: '/ia',
    iconId: 'sunubiblio_ai',
    category: 'assistants',
    order: 1,
    badge: { text: 'Populaire', variant: 'popular' },
    enabled: true,
    available: true,
  },
  {
    id: 'recherche',
    name: 'Recherche',
    shortDescription: 'Catalogue unifié',
    href: '/bibliotheque',
    iconId: 'recherche',
    category: 'assistants',
    order: 2,
    enabled: true,
    available: true,
  },
  {
    id: 'assistant',
    name: 'Assistant',
    shortDescription: 'Tuteur pas-à-pas',
    href: '/ia',
    iconId: 'assistant',
    category: 'assistants',
    order: 3,
    enabled: true,
    available: true,
  },
  {
    id: 'outils-documentaires',
    name: 'Outils doc.',
    shortDescription: 'PDF & conversions',
    href: '/documents',
    iconId: 'outils_doc',
    category: 'assistants',
    order: 4,
    enabled: true,
    available: true,
  },

  // ==========================================
  // 7. COMMERCE
  // ==========================================
  {
    id: 'marketplace',
    name: 'Marketplace',
    shortDescription: 'Achat & vente',
    href: '/marketplace',
    iconId: 'marketplace',
    category: 'commerce',
    order: 1,
    enabled: true,
    available: true,
  },
  {
    id: 'vendre-un-livre',
    name: 'Vendre un livre',
    shortDescription: 'Déposer une annonce',
    href: '/marketplace',
    iconId: 'vendre_livre',
    category: 'commerce',
    order: 2,
    enabled: true,
    available: true,
  },
  {
    id: 'mes-ventes',
    name: 'Mes ventes',
    shortDescription: 'Commandes reçues',
    href: '/marketplace',
    iconId: 'mes_ventes',
    category: 'commerce',
    order: 3,
    enabled: true,
    available: true,
  },
  {
    id: 'mes-achats',
    name: 'Mes achats',
    shortDescription: 'Ouvrages acquis',
    href: '/marketplace',
    iconId: 'mes_achats',
    category: 'commerce',
    order: 4,
    enabled: true,
    available: true,
  },
];
