/**
 * Sunubiblio — Configuration Centralisée du App Launcher (Menu 9 points)
 * 
 * Architecture modulaire inspirée du modèle Google Apps avec identité 100% Sunubiblio.
 * Regroupe les 7 catégories de l'écosystème et leurs applications associées.
 */

export type AppCategoryKey = 
  | 'apprendre'
  | 'savoirs'
  | 'outils'
  | 'assistants'
  | 'communaute'
  | 'boutique'
  | 'mon_espace';

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
  requiredPlan?: 'free' | 'student' | 'premium' | 'gold';
}

export interface AppCategoryData {
  key: AppCategoryKey;
  title: string;
  shortDescription?: string;
}

export const APP_LAUNCHER_CATEGORIES: AppCategoryData[] = [
  {
    key: 'apprendre',
    title: 'Apprendre',
    shortDescription: 'Bibliothèque, parcours scolaires, concours et évaluations',
  },
  {
    key: 'savoirs',
    title: 'Savoirs & Formations',
    shortDescription: 'Cours approfondis, ressources académiques et traditions',
  },
  {
    key: 'outils',
    title: 'Outils & Productivité',
    shortDescription: 'Organisation du temps, gestion documentaire et fichiers',
  },
  {
    key: 'assistants',
    title: 'Assistants & Utilitaires',
    shortDescription: 'Intelligence artificielle SunuIA, recherche et traitement',
  },
  {
    key: 'communaute',
    title: 'Communauté & Échange',
    shortDescription: 'Réseau collaboratif, visio-conférences et partages',
  },
  {
    key: 'boutique',
    title: 'Boutique & Création',
    shortDescription: 'Marketplace de fiches, publication et monétisation',
  },
  {
    key: 'mon_espace',
    title: 'Mon Espace',
    shortDescription: 'Gestion du compte, favoris, historique et abonnements',
  },
];

export const APP_LAUNCHER_ITEMS: AppLauncherItemData[] = [
  // ==========================================
  // 1. APPRENDRE
  // ==========================================
  {
    id: 'bibliotheque',
    name: 'Bibliothèque',
    shortDescription: 'Livres, manuels, thèses et mémoires',
    href: '/bibliotheque',
    iconId: 'book',
    category: 'apprendre',
    order: 1,
    enabled: true,
  },
  {
    id: 'education',
    name: 'Éducation',
    shortDescription: 'Du primaire jusqu’au doctorat',
    href: '/education',
    iconId: 'education',
    category: 'apprendre',
    order: 2,
    enabled: true,
  },
  {
    id: 'concours',
    name: 'Concours',
    shortDescription: 'Annales officielles et programmes',
    href: '/concours',
    iconId: 'concours',
    category: 'apprendre',
    order: 3,
    badge: { text: 'Populaire', variant: 'popular' },
    enabled: true,
  },
  {
    id: 'exercices',
    name: 'Exercices',
    shortDescription: 'Moteur de QCM et évaluations corrigées',
    href: '/exercices',
    iconId: 'exercices',
    category: 'apprendre',
    order: 4,
    enabled: true,
  },

  // ==========================================
  // 2. SAVOIRS & FORMATIONS
  // ==========================================
  {
    id: 'cours',
    name: 'Cours',
    shortDescription: 'Modules structurés et fiches de révision',
    href: '/education',
    iconId: 'cours',
    category: 'savoirs',
    order: 1,
    enabled: true,
  },
  {
    id: 'ressources',
    name: 'Ressources',
    shortDescription: 'Banque d’archives et supports pédagogiques',
    href: '/bibliotheque',
    iconId: 'ressources',
    category: 'savoirs',
    order: 2,
    enabled: true,
  },
  {
    id: 'documents',
    name: 'Documents',
    shortDescription: 'Documents officiels, synthèses et travaux',
    href: '/documents',
    iconId: 'documents',
    category: 'savoirs',
    order: 3,
    enabled: true,
  },
  {
    id: 'religion',
    name: 'Religion',
    shortDescription: 'Traditions, confréries, textes et figures',
    href: '/religion',
    iconId: 'religion',
    category: 'savoirs',
    order: 4,
    enabled: true,
  },

  // ==========================================
  // 3. OUTILS & PRODUCTIVITÉ
  // ==========================================
  {
    id: 'calendrier',
    name: 'Calendrier',
    shortDescription: 'Dates clés d’examens et concours',
    href: '/agenda',
    iconId: 'calendrier',
    category: 'outils',
    order: 1,
    enabled: true,
  },
  {
    id: 'emploi-du-temps',
    name: 'Emploi du temps',
    shortDescription: 'Planning hebdomadaire personnalisé',
    href: '/agenda',
    iconId: 'emploi_du_temps',
    category: 'outils',
    order: 2,
    enabled: true,
  },
  {
    id: 'mes-documents',
    name: 'Mes documents',
    shortDescription: 'Espace personnel de stockage et révision',
    href: '/documents',
    iconId: 'mes_documents',
    category: 'outils',
    order: 3,
    enabled: true,
  },
  {
    id: 'telechargements',
    name: 'Téléchargements',
    shortDescription: 'Accès sécurisé hors-connexion',
    href: '/documents',
    iconId: 'telechargements',
    category: 'outils',
    order: 4,
    enabled: true,
  },

  // ==========================================
  // 4. ASSISTANTS & UTILITAIRES
  // ==========================================
  {
    id: 'sunuai',
    name: 'SunuAI',
    shortDescription: 'Assistant intelligent Sunubiblio',
    href: '/ia',
    iconId: 'sunuai',
    category: 'assistants',
    order: 1,
    badge: { text: 'IA', variant: 'ai' },
    enabled: true,
  },
  {
    id: 'recherche',
    name: 'Recherche',
    shortDescription: 'Moteur de recherche unifié',
    href: '/bibliotheque',
    iconId: 'recherche',
    category: 'assistants',
    order: 2,
    enabled: true,
  },
  {
    id: 'assistant-pedagogique',
    name: 'Assistant pédago',
    shortDescription: 'Tuteur pas-à-pas pour les révisions',
    href: '/ia',
    iconId: 'assistant_pedago',
    category: 'assistants',
    order: 3,
    enabled: true,
  },
  {
    id: 'outils-pdf',
    name: 'Outils PDF',
    shortDescription: 'Conversion, fusion et annotation de fichiers',
    href: '/documents',
    iconId: 'outils_pdf',
    category: 'assistants',
    order: 4,
    enabled: true,
  },

  // ==========================================
  // 5. COMMUNAUTÉ & ÉCHANGE
  // ==========================================
  {
    id: 'communaute',
    name: 'Communauté',
    shortDescription: 'Forum d’entraide et réseau apprenant',
    href: '/communaute',
    iconId: 'communaute',
    category: 'communaute',
    order: 1,
    enabled: true,
  },
  {
    id: 'visio',
    name: 'Visio',
    shortDescription: 'Salons d’étude et tutorat en direct',
    href: '/visio',
    iconId: 'visio',
    category: 'communaute',
    order: 2,
    badge: { text: 'Nouveau', variant: 'new' },
    enabled: true,
  },
  {
    id: 'groupes',
    name: 'Groupes',
    shortDescription: 'Salons de travail thématiques',
    href: '/communaute',
    iconId: 'groupes',
    category: 'communaute',
    order: 3,
    enabled: true,
  },
  {
    id: 'publications',
    name: 'Publications',
    shortDescription: 'Articles, synthèses et actualités partagées',
    href: '/communaute',
    iconId: 'publications',
    category: 'communaute',
    order: 4,
    enabled: true,
  },

  // ==========================================
  // 6. BOUTIQUE & CRÉATION
  // ==========================================
  {
    id: 'vendre',
    name: 'Vendre',
    shortDescription: 'Monétiser ses cours et résumés certifiés',
    href: '/marketplace',
    iconId: 'vendre',
    category: 'boutique',
    order: 1,
    enabled: true,
  },
  {
    id: 'publier',
    name: 'Publier',
    shortDescription: 'Partager une ressource ou un recueil',
    href: '/documents',
    iconId: 'publier',
    category: 'boutique',
    order: 2,
    enabled: true,
  },
  {
    id: 'mes-ventes',
    name: 'Mes ventes',
    shortDescription: 'Suivi des gains et commandes générées',
    href: '/marketplace',
    iconId: 'mes_ventes',
    category: 'boutique',
    order: 3,
    enabled: true,
  },
  {
    id: 'marketplace',
    name: 'Marketplace',
    shortDescription: 'Espace d’achat et vente sécurisé',
    href: '/marketplace',
    iconId: 'marketplace',
    category: 'boutique',
    order: 4,
    badge: { text: 'Pro', variant: 'pro' },
    enabled: true,
  },

  // ==========================================
  // 7. MON ESPACE
  // ==========================================
  {
    id: 'profil',
    name: 'Profil',
    shortDescription: 'Informations personnelles et niveau d’étude',
    href: '/profil',
    iconId: 'profil',
    category: 'mon_espace',
    order: 1,
    enabled: true,
  },
  {
    id: 'favoris',
    name: 'Favoris',
    shortDescription: 'Livres, cours et fiches sauvegardés',
    href: '/favoris',
    iconId: 'favoris',
    category: 'mon_espace',
    order: 2,
    enabled: true,
  },
  {
    id: 'historique',
    name: 'Historique',
    shortDescription: 'Derniers documents et tests consultés',
    href: '/profil',
    iconId: 'historique',
    category: 'mon_espace',
    order: 3,
    enabled: true,
  },
  {
    id: 'abonnement',
    name: 'Abonnement',
    shortDescription: 'Gestion des formules et facturation',
    href: '/tarifs',
    iconId: 'abonnement',
    category: 'mon_espace',
    order: 4,
    enabled: true,
  },
  {
    id: 'parametres',
    name: 'Paramètres',
    shortDescription: 'Préférences de lecture et sécurité',
    href: '/profil',
    iconId: 'parametres',
    category: 'mon_espace',
    order: 5,
    enabled: true,
  },
];
