/**
 * Sunubiblio Pro — Magasin de synchronisation du Catalogue Administrateur & des Abonnements/Paiements
 * Persiste les ouvrages, fascicules, annales et documents importés depuis `/admin`
 * ainsi que les abonnements et paiements encaissés (Wave, Orange Money, Carte bancaire).
 */

import { AnalyzedStagingItem } from './smartDocumentAnalyzer';
import { Resource, EducationCycle, ResourceFormat } from '@/types/library';
import { EducationResource } from '@/types/education';

const STORAGE_KEY = 'sunubiblio_pro_admin_catalog_v1';
const SUBSCRIPTIONS_STORAGE_KEY = 'sunubiblio_pro_subscriptions_v1';
export const ADMIN_CATALOG_UPDATED_EVENT = 'sunubiblio-admin-catalog-updated';
export const ADMIN_SUBSCRIPTIONS_UPDATED_EVENT = 'sunubiblio-admin-subscriptions-updated';

export interface AdminSubscriptionPayment {
  id: string;
  subscriberName: string;
  subscriberEmail: string;
  avatarUrl: string;
  planId: 'simple' | 'recommande' | 'gold';
  planLabel: string;
  amountFcfa: number;
  paymentMethod: 'Wave' | 'Orange Money' | 'Carte Visa';
  dateFormatted: string;
  timeFormatted: string;
  status: 'Payé' | 'En attente' | 'Renouvelé';
  growthHint: string;
  isNew?: boolean;
}

export const INITIAL_SUBSCRIPTION_PAYMENTS: AdminSubscriptionPayment[] = [
  {
    id: 'sub-pay-101',
    subscriberName: 'Cheikh Tidiane Sy',
    subscriberEmail: 'cheikh.sy@ucad.edu.sn',
    avatarUrl: '/images/user-profile-logo.png',
    planId: 'gold',
    planLabel: 'Formule Gold Illimitée',
    amountFcfa: 9000,
    paymentMethod: 'Wave',
    dateFormatted: '10 Nov 2026',
    timeFormatted: '20:45',
    status: 'Payé',
    growthHint: 'Wave Sénégal • Instantané',
    isNew: true,
  },
  {
    id: 'sub-pay-102',
    subscriberName: 'Aïssatou Ndiaye',
    subscriberEmail: 'aissatou.ndiaye@sunubiblio.sn',
    avatarUrl: '/images/user-profile-logo.png',
    planId: 'recommande',
    planLabel: 'Formule Recommandée',
    amountFcfa: 5000,
    paymentMethod: 'Orange Money',
    dateFormatted: '10 Nov 2026',
    timeFormatted: '18:12',
    status: 'Payé',
    growthHint: 'Orange Money • Certifié',
    isNew: true,
  },
  {
    id: 'sub-pay-103',
    subscriberName: 'Ousmane Diallo',
    subscriberEmail: 'ousmane.diallo@ugb.sn',
    avatarUrl: '/images/user-profile-logo.png',
    planId: 'gold',
    planLabel: 'Formule Gold Illimitée',
    amountFcfa: 9000,
    paymentMethod: 'Carte Visa',
    dateFormatted: '09 Nov 2026',
    timeFormatted: '14:30',
    status: 'Renouvelé',
    growthHint: 'Visa 3D Secure • Mensuel',
  },
  {
    id: 'sub-pay-104',
    subscriberName: 'Fatou Kiné Fall',
    subscriberEmail: 'fatou.fall@fastef.sn',
    avatarUrl: '/images/user-profile-logo.png',
    planId: 'simple',
    planLabel: 'Formule Simple',
    amountFcfa: 3000,
    paymentMethod: 'Wave',
    dateFormatted: '09 Nov 2026',
    timeFormatted: '11:05',
    status: 'Payé',
    growthHint: 'Wave Sénégal • Instantané',
  },
  {
    id: 'sub-pay-105',
    subscriberName: 'Moustapha Mbaye',
    subscriberEmail: 'm.mbaye@ena.sn',
    avatarUrl: '/images/user-profile-logo.png',
    planId: 'gold',
    planLabel: 'Formule Gold Illimitée',
    amountFcfa: 9000,
    paymentMethod: 'Orange Money',
    dateFormatted: '08 Nov 2026',
    timeFormatted: '16:20',
    status: 'Payé',
    growthHint: 'Orange Money • Certifié',
  },
  {
    id: 'sub-pay-106',
    subscriberName: 'Marième Diop',
    subscriberEmail: 'marieme.diop@esp.sn',
    avatarUrl: '/images/user-profile-logo.png',
    planId: 'recommande',
    planLabel: 'Formule Recommandée',
    amountFcfa: 5000,
    paymentMethod: 'Wave',
    dateFormatted: '08 Nov 2026',
    timeFormatted: '09:50',
    status: 'Payé',
    growthHint: 'Wave Sénégal • Instantané',
  },
];

export function getAdminSubscriptions(): AdminSubscriptionPayment[] {
  if (typeof window === 'undefined') return INITIAL_SUBSCRIPTION_PAYMENTS;
  try {
    const raw = window.localStorage.getItem(SUBSCRIPTIONS_STORAGE_KEY);
    if (raw === null) return INITIAL_SUBSCRIPTION_PAYMENTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_SUBSCRIPTION_PAYMENTS;
  } catch {
    return INITIAL_SUBSCRIPTION_PAYMENTS;
  }
}

export function saveAdminSubscriptions(items: AdminSubscriptionPayment[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SUBSCRIPTIONS_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(ADMIN_SUBSCRIPTIONS_UPDATED_EVENT));
  } catch {
    // ignore storage error
  }
}

export function addAdminSubscription(newSub: AdminSubscriptionPayment): AdminSubscriptionPayment[] {
  const existing = getAdminSubscriptions();
  const updated = [newSub, ...existing];
  saveAdminSubscriptions(updated);
  return updated;
}

export function deleteAdminSubscription(id: string): AdminSubscriptionPayment[] {
  const updated = getAdminSubscriptions().filter((item) => item.id !== id);
  saveAdminSubscriptions(updated);
  return updated;
}

export function clearAllAdminSubscriptions(): AdminSubscriptionPayment[] {
  saveAdminSubscriptions([]);
  return [];
}

export function resetAdminSubscriptionsToDefault(): AdminSubscriptionPayment[] {
  saveAdminSubscriptions(INITIAL_SUBSCRIPTION_PAYMENTS);
  return INITIAL_SUBSCRIPTION_PAYMENTS;
}

export function getPublishedAdminItems(): AnalyzedStagingItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function savePublishedAdminItems(items: AnalyzedStagingItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(ADMIN_CATALOG_UPDATED_EVENT));
  } catch (err) {
    console.warn('Quota localStorage atteint, compression des miniatures...', err);
  }
}

export function publishAdminBatch(newItems: AnalyzedStagingItem[]): AnalyzedStagingItem[] {
  const existing = getPublishedAdminItems();
  const publishedNow = newItems.map((item) => ({
    ...item,
    status: 'published' as const,
  }));
  const merged = [...publishedNow, ...existing];
  savePublishedAdminItems(merged);
  return merged;
}

export function deletePublishedAdminItem(id: string): AnalyzedStagingItem[] {
  const existing = getPublishedAdminItems().filter((item) => item.id !== id);
  savePublishedAdminItems(existing);
  return existing;
}

export function clearAllPublishedAdminItems(): AnalyzedStagingItem[] {
  savePublishedAdminItems([]);
  return [];
}

export function updatePublishedAdminItem(updated: AnalyzedStagingItem): AnalyzedStagingItem[] {
  const existing = getPublishedAdminItems().map((item) =>
    item.id === updated.id ? { ...updated, status: 'published' as const } : item
  );
  savePublishedAdminItems(existing);
  return existing;
}

/**
 * Convertit un élément publié dans le Back-Office en `Resource` pour la Bibliothèque (`/bibliotheque`)
 * avec sa Page de Couverture (`coverImage`) affichée au devant de la carte.
 */
export function mapAdminItemToLibraryResource(item: AnalyzedStagingItem): Resource {
  const cycleMap: Record<string, EducationCycle> = {
    prescolaire: 'primaire',
    primaire: 'primaire',
    college: 'college',
    lycee: 'lycee',
    universite: 'universite',
    formation_pro: 'universite',
  };

  const formatMap: Record<string, ResourceFormat> = {
    livre: 'livre',
    fascicule: 'exercice',
    cours: 'cours',
    annale: 'annale',
    document: 'doc',
    ouvrage_religieux: 'livre',
  };

  const categoryMap: Record<string, string> = {
    education: item.documentKind === 'fascicule' ? 'Exercices' : item.documentKind === 'annale' ? 'Annales' : 'Livres',
    bibliotheque: 'Livres',
    concours: 'Concours',
    documents: 'Documents',
    religion: 'religion',
  };

  return {
    id: item.id,
    slug: item.id,
    title: item.title,
    subtitle:
      item.documentKind === 'fascicule'
        ? `Fascicule ${item.subject} • ${item.grade}`
        : `${item.subject} • ${item.grade}`,
    author: item.author,
    institution: item.institution,
    category: categoryMap[item.destination] || 'Livres',
    subCategory: item.competition || item.religionTradition || item.grade,
    level: {
      cycle: cycleMap[item.cycle] || 'lycee',
      grade: item.grade,
    },
    subject: item.subject,
    resourceType: formatMap[item.documentKind] || 'pdf',
    pagesCount: item.pagesCount,
    rating: 4.9,
    reviewsCount: 18,
    year: item.year,
    accessLevel: item.accessLevel,
    featured: true,
    coverGradient: item.coverGradient,
    coverImage: item.coverImage,
    description: item.description,
    downloadsCount: 120,
  };
}

/**
 * Convertit un élément publié dans le Back-Office en `EducationResource` pour l'espace Éducation (`/education`)
 */
export function mapAdminItemToEducationResource(
  item: AnalyzedStagingItem
): EducationResource & { coverImage?: string; author?: string; documentKind?: string } {
  const cycleLabels: Record<string, string> = {
    prescolaire: 'Préscolaire',
    primaire: 'Primaire',
    college: 'Collège',
    lycee: 'Lycée',
    universite: 'Université',
    formation_pro: 'Formation Pro',
  };

  const kindBadgeMap: Record<string, string> = {
    livre: 'Livre scolaire',
    fascicule: 'Fascicule Éducation',
    cours: 'Cours & Synthèse',
    annale: 'Annale & Examen',
    document: 'Document',
    ouvrage_religieux: 'Ouvrage',
  };

  return {
    id: item.id,
    title: item.title,
    description: item.description,
    type: item.educationType,
    typeLabel: kindBadgeMap[item.documentKind] || 'Ressource',
    subject: item.subject,
    subjectSlug: item.subject.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    level: item.cycle,
    levelLabel: cycleLabels[item.cycle] || 'Lycée',
    grade: item.grade,
    year: item.year,
    isPremium: item.accessLevel !== 'free',
    accessStatus: item.accessLevel === 'free' ? 'gratuit' : item.accessLevel === 'premium' ? 'gold' : 'abonnement',
    coverGradient: item.coverGradient,
    coverImage: item.coverImage,
    author: item.author,
    documentKind: item.documentKind,
    pagesCount: item.pagesCount,
    downloadsCount: 95,
    featured: true,
  };
}
