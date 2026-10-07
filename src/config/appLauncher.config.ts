/**
 * Sunubiblio — Configuration Centralisée du App Launcher (Menu Applications)
 * 
 * Organisé rigoureusement selon les exigences de l'écosystème :
 * 1. APPLICATIONS PRINCIPALES (Ordre strict des 16 applications)
 * 2. COMMERCE (Marketplace & gestion marchande)
 * 3. MON COMPTE & SERVICES (Formules & Tarifs)
 */

export type AppCategoryKey = 
  | 'principales'
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
    key: 'principales',
    title: 'APPLICATIONS',
    description: 'Bibliothèque, formation, exercices et assistance IA',
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
  // 1. APPLICATIONS PRINCIPALES (Ordre strict)
  // ==========================================
  {
    id: 'bibliotheque',
    name: 'Bibliothèque',
    shortDescription: 'Livres et thèses',
    href: '/bibliotheque',
    iconId: 'book',
    category: 'principales',
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
    category: 'principales',
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
    category: 'principales',
    order: 3,
    badge: { text: 'Populaire', variant: 'popular' },
    enabled: true,
    available: true,
  },
  {
    id: 'documents',
    name: 'Documents',
    shortDescription: 'Documents certifiés',
    href: '/documents',
    iconId: 'documents',
    category: 'principales',
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
    category: 'principales',
    order: 5,
    badge: { text: 'Nouveau', variant: 'new' },
    enabled: true,
    available: true,
  },
  {
    id: 'etablissements',
    name: 'Établissements',
    shortDescription: 'Écoles, universités & bourses',
    href: '/etablissements',
    iconId: 'etablissements',
    category: 'principales',
    order: 6,
    badge: { text: 'Nouveau', variant: 'new' },
    enabled: true,
    available: true,
  },
  {
    id: 'exercices',
    name: 'Exercice',
    shortDescription: 'QCM, devoirs & corrections',
    href: '/exercices',
    iconId: 'exercices',
    category: 'principales',
    order: 7,
    enabled: true,
    available: true,
  },
  {
    id: 'assistant-ia',
    name: 'Assistant IA',
    shortDescription: 'Résumer, expliquer & tuteur',
    href: '/ia',
    iconId: 'assistant_ia',
    category: 'principales',
    order: 8,
    badge: { text: 'IA', variant: 'ai' },
    enabled: true,
    available: true,
  },
  {
    id: 'antiplagiat',
    name: 'Antiplagiat',
    shortDescription: 'Similarité & intégrité',
    href: '/ia/antiplagiat',
    iconId: 'antiplagiat',
    category: 'principales',
    order: 9,
    badge: { text: 'Pro', variant: 'pro' },
    enabled: true,
    available: true,
  },
  {
    id: 'cours',
    name: 'Cours',
    shortDescription: 'Modules structurés',
    href: '/education',
    iconId: 'cours',
    category: 'principales',
    order: 10,
    enabled: true,
    available: true,
  },
  {
    id: 'visio',
    name: 'Visio',
    shortDescription: 'Salons d’étude live',
    href: '/visio',
    iconId: 'visio',
    category: 'principales',
    order: 11,
    enabled: true,
    available: true,
  },
  {
    id: 'agenda',
    name: 'Agenda',
    shortDescription: 'Planning & rendez-vous',
    href: '/agenda',
    iconId: 'agenda',
    category: 'principales',
    order: 12,
    enabled: true,
    available: true,
  },
  {
    id: 'ressources',
    name: 'Ressources',
    shortDescription: 'Supports d’archives',
    href: '/bibliotheque',
    iconId: 'ressources',
    category: 'principales',
    order: 13,
    enabled: true,
    available: true,
  },
  {
    id: 'mes-documents',
    name: 'Mes documents',
    shortDescription: 'Fichiers enregistrés',
    href: '/documents',
    iconId: 'mes_documents',
    category: 'principales',
    order: 14,
    enabled: true,
    available: true,
  },
  {
    id: 'religion',
    name: 'Religion',
    shortDescription: 'Textes et traditions',
    href: '/religion',
    iconId: 'religion',
    category: 'principales',
    order: 15,
    enabled: true,
    available: true,
  },
  {
    id: 'notes',
    name: 'Notes',
    shortDescription: 'Bloc-notes personnel',
    href: '/documents',
    iconId: 'notes',
    category: 'principales',
    order: 16,
    enabled: true,
    available: true,
  },

  // ==========================================
  // 2. COMMERCE
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
  // 3. MON COMPTE & SERVICES
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
