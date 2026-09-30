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
  | 'commerce'
  | 'services';

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
  {
    key: 'services',
    title: 'MON COMPTE & SERVICES',
    description: 'Abonnements, formules d’accès et offres',
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
  {
    id: 'professeurs',
    name: 'Professeurs',
    shortDescription: 'Enseignants & tuteurs',
    href: '/professeurs',
    iconId: 'professeurs',
    category: 'apprendre',
    order: 5,
    badge: { text: 'Nouveau', variant: 'new' },
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
  // 3. VISIO & RENDEZ-VOUS
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
    id: 'agenda',
    name: 'Agenda',
    shortDescription: 'Rendez-vous, cours & planning',
    href: '/agenda',
    iconId: 'agenda',
    category: 'visio_rdv',
    order: 2,
    badge: { text: 'Nouveau', variant: 'new' },
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

  // ==========================================
  // 8. MON COMPTE & SERVICES
  // ==========================================
  {
    id: 'tarifs',
    name: 'Formules & Tarifs',
    shortDescription: 'Choisissez la formule adaptée à vos besoins',
    href: '/tarifs',
    iconId: 'tarifs',
    category: 'services',
    order: 1,
    badge: { text: 'Offres', variant: 'popular' },
    enabled: true,
    available: true,
  },
];
