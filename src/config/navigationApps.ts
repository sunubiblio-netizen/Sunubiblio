/**
 * Sunubiblio — Configuration Centralisée des Applications de l'Écosystème
 * 
 * Permet d'ajouter, activer ou réorganiser facilement de nouveaux services
 * (Quiz, Examens blancs, Certifications, Podcasts, etc.) sans modifier
 * l'architecture globale du header ou des composants de navigation.
 */

export type AppGroupKey = 'learn' | 'tools' | 'community';

export interface EcosystemApp {
  id: string;
  label: string;
  shortDescription: string;
  href: string;
  iconName: string;
  group: AppGroupKey;
  badge?: {
    text: string;
    variant: 'new' | 'popular' | 'ai' | 'pro';
  };
  enabled: boolean;
  order: number;
}

export interface AppGroup {
  id: AppGroupKey;
  title: string;
  badgeLabel?: string;
}

export const APP_GROUPS: AppGroup[] = [
  {
    id: 'learn',
    title: 'Apprendre',
    badgeLabel: 'Savoirs & Formations',
  },
  {
    id: 'tools',
    title: 'Outils & Productivité',
    badgeLabel: 'Assistants & Utilitaires',
  },
  {
    id: 'community',
    title: 'Communauté & Échange',
    badgeLabel: 'Réseau & Partage',
  },
];

export const ECOSYSTEM_APPS: EcosystemApp[] = [
  // ==========================================
  // GROUPE 1 — APPRENDRE
  // ==========================================
  {
    id: 'bibliotheque',
    label: 'Bibliothèque',
    shortDescription: 'Livres scolaires, thèses, manuels et documents universitaires',
    href: '/bibliotheque',
    iconName: 'book',
    group: 'learn',
    enabled: true,
    order: 1,
  },
  {
    id: 'education',
    label: 'Éducation',
    shortDescription: 'Parcours complet du primaire au doctorat',
    href: '/education',
    iconName: 'graduation-cap',
    group: 'learn',
    enabled: true,
    order: 2,
  },
  {
    id: 'concours',
    label: 'Concours',
    shortDescription: 'Annales officielles, épreuves et programmes détaillés',
    href: '/concours',
    iconName: 'trophy',
    group: 'learn',
    badge: { text: 'Populaire', variant: 'popular' },
    enabled: true,
    order: 3,
  },
  {
    id: 'exercices',
    label: 'Exercices & QCM',
    shortDescription: 'Moteur interactif de tests avec corrections pas à pas',
    href: '/exercices',
    iconName: 'pen-tool',
    group: 'learn',
    enabled: true,
    order: 4,
  },
  {
    id: 'religion',
    label: 'Religion & Savoirs',
    shortDescription: 'Traditions, confréries, textes sacrés et figures spirituelles',
    href: '/religion',
    iconName: 'landmark',
    group: 'learn',
    enabled: true,
    order: 5,
  },

  // ==========================================
  // GROUPE 2 — OUTILS
  // ==========================================
  {
    id: 'ia',
    label: 'SunuIA',
    shortDescription: 'Assistant tuteur, résumés, QCM et explications intelligentes',
    href: '/ia',
    iconName: 'bot',
    group: 'tools',
    badge: { text: 'IA', variant: 'ai' },
    enabled: true,
    order: 1,
  },
  {
    id: 'documents',
    label: 'Documents & Outils',
    shortDescription: 'Convertisseur Word/PDF, annotation et vérificateur officiel',
    href: '/documents',
    iconName: 'file-text',
    group: 'tools',
    enabled: true,
    order: 2,
  },
  {
    id: 'agenda',
    label: 'Agenda',
    shortDescription: 'Calendrier des concours, séances de révision et rappels',
    href: '/agenda',
    iconName: 'calendar',
    group: 'tools',
    badge: { text: 'Nouveau', variant: 'new' },
    enabled: true,
    order: 3,
  },
  {
    id: 'visio',
    label: 'Visio',
    shortDescription: 'Salles de révision en direct et tutorat pédagogique',
    href: '/visio',
    iconName: 'video',
    group: 'tools',
    badge: { text: 'Nouveau', variant: 'new' },
    enabled: true,
    order: 4,
  },

  // ==========================================
  // GROUPE 3 — COMMUNAUTÉ & ÉCHANGE
  // ==========================================
  {
    id: 'communaute',
    label: 'Communauté',
    shortDescription: 'Groupes d’études, entraide et partages entre étudiants',
    href: '/communaute',
    iconName: 'users',
    group: 'community',
    enabled: true,
    order: 1,
  },
  {
    id: 'marketplace',
    label: 'Marketplace',
    shortDescription: 'Achat et vente de fiches certifiées, livres et résumés',
    href: '/marketplace',
    iconName: 'shopping-bag',
    group: 'community',
    badge: { text: 'Pro', variant: 'pro' },
    enabled: true,
    order: 2,
  },
];

export const navigationAppsConfig = {
  getAppsByGroup(group: AppGroupKey): EcosystemApp[] {
    return ECOSYSTEM_APPS.filter((app) => app.group === group && app.enabled).sort(
      (a, b) => a.order - b.order
    );
  },

  getAllEnabledApps(): EcosystemApp[] {
    return ECOSYSTEM_APPS.filter((app) => app.enabled).sort((a, b) => a.order - b.order);
  },
};
