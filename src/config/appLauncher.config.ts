/**
 * Sunubiblio — Configuration Centralisée du App Launcher (Menu Applications)
 * 
 * Organisé rigoureusement selon les 6 sections thématiques validées :
 * 1. APPLICATIONS PRINCIPALES (Bibliothèque, Éducation, Concours, Documents, Professeurs, Établissements)
 * 2. ENTRAÎNEMENT & IA (Exercice, Assistant IA, Antiplagiat)
 * 3. COURS & RENDEZ-VOUS (Cours, Visio, Agenda)
 * 4. RESSOURCES & DOCUMENTS (Ressources, Mes documents, Religion, Notes)
 * 5. COMMERCE (Marketplace, Vendre un livre, Mes ventes, Mes achats)
 * 6. MON COMPTE & SERVICES (Formules & Tarifs)
 */

export type AppCategoryKey = 
  | 'principales'
  | 'entrainement_ia'
  | 'cours_rdv'
  | 'ressources_doc'
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
    title: 'APPLICATIONS PRINCIPALES',
    description: 'Bibliothèque numérique, cycles scolaires, concours officiels et établissements',
  },
  {
    key: 'entrainement_ia',
    title: 'ENTRAÎNEMENT & IA',
    description: 'Génération d’exercices, QCM, corrections, tuteur intelligent et antiplagiat',
  },
  {
    key: 'cours_rdv',
    title: 'COURS & RENDEZ-VOUS',
    description: 'Modules d’apprentissage, salons d’étude en direct et gestion du planning',
  },
  {
    key: 'ressources_doc',
    title: 'RESSOURCES & ESPACE PERSONNEL',
    description: 'Archives académiques, documents enregistrés, textes de tradition et notes',
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
  // 1. APPLICATIONS PRINCIPALES
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

  // ==========================================
  // 2. ENTRAÎNEMENT & IA
  // ==========================================
  {
    id: 'exercices',
    name: 'Exercice',
    shortDescription: 'QCM, devoirs & corrections',
    href: '/exercices',
    iconId: 'exercices',
    category: 'entrainement_ia',
    order: 1,
    enabled: true,
    available: true,
  },
  {
    id: 'assistant-ia',
    name: 'Assistant IA',
    shortDescription: 'Résumer, expliquer & tuteur',
    href: '/ia',
    iconId: 'assistant_ia',
    category: 'entrainement_ia',
    order: 2,
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
    category: 'entrainement_ia',
    order: 3,
    badge: { text: 'Pro', variant: 'pro' },
    enabled: true,
    available: true,
  },

  // ==========================================
  // 3. COURS & RENDEZ-VOUS (3 seulement)
  // ==========================================
  {
    id: 'cours',
    name: 'Cours',
    shortDescription: 'Modules structurés',
    href: '/education',
    iconId: 'cours',
    category: 'cours_rdv',
    order: 1,
    enabled: true,
    available: true,
  },
  {
    id: 'visio',
    name: 'Visio',
    shortDescription: 'Salons d’étude live',
    href: '/visio',
    iconId: 'visio',
    category: 'cours_rdv',
    order: 2,
    enabled: true,
    available: true,
  },
  {
    id: 'agenda',
    name: 'Agenda',
    shortDescription: 'Planning & rendez-vous',
    href: '/agenda',
    iconId: 'agenda',
    category: 'cours_rdv',
    order: 3,
    enabled: true,
    available: true,
  },

  // ==========================================
  // 4. RESSOURCES & ESPACE PERSONNEL
  // ==========================================
  {
    id: 'ressources',
    name: 'Ressources',
    shortDescription: 'Supports d’archives',
    href: '/bibliotheque',
    iconId: 'ressources',
    category: 'ressources_doc',
    order: 1,
    enabled: true,
    available: true,
  },
  {
    id: 'mes-documents',
    name: 'Mes documents',
    shortDescription: 'Fichiers enregistrés',
    href: '/documents',
    iconId: 'mes_documents',
    category: 'ressources_doc',
    order: 2,
    enabled: true,
    available: true,
  },
  {
    id: 'religion',
    name: 'Religion',
    shortDescription: 'Textes et traditions',
    href: '/religion',
    iconId: 'religion',
    category: 'ressources_doc',
    order: 3,
    enabled: true,
    available: true,
  },
  {
    id: 'notes',
    name: 'Notes',
    shortDescription: 'Bloc-notes personnel',
    href: '/documents',
    iconId: 'notes',
    category: 'ressources_doc',
    order: 4,
    enabled: true,
    available: true,
  },

  // ==========================================
  // 5. COMMERCE
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
  // 6. MON COMPTE & SERVICES
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
