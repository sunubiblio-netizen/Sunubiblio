/**
 * Sunubiblio — Service Documents Découplé (Architecture Database-Ready)
 * 
 * Centralise l'accès aux documents administratifs, guides, formulaires et modèles.
 * Prêt pour être raccordé directement sur PostgreSQL / Supabase via RLS.
 */

import {
  DocumentCategory,
  DocumentCategoryInfo,
  DocumentFilterState,
  UsefulDocument,
} from '@/types/document';
import { DOCUMENT_CATEGORIES, INITIAL_DOCUMENTS } from '@/data/mockDocuments';

export const documentService = {
  /**
   * Retourne l'ensemble des catégories configurées
   */
  async getCategories(): Promise<DocumentCategoryInfo[]> {
    return DOCUMENT_CATEGORIES;
  },

  /**
   * Récupère un document par son identifiant unique
   */
  async getDocumentById(id: string): Promise<UsefulDocument | null> {
    const doc = INITIAL_DOCUMENTS.find((d) => d.id === id);
    return doc || null;
  },

  /**
   * Récupère des documents similaires / recommandés
   */
  async getRelatedDocuments(id: string, limit: number = 3): Promise<UsefulDocument[]> {
    const current = INITIAL_DOCUMENTS.find((d) => d.id === id);
    if (!current) return [];

    return INITIAL_DOCUMENTS.filter(
      (d) => d.id !== id && (d.category === current.category || d.format === current.format)
    ).slice(0, limit);
  },

  /**
   * Statistiques globales sur les documents disponibles
   */
  async getDocumentStats(): Promise<{
    totalCount: number;
    categoriesCount: number;
    totalDownloads: number;
  }> {
    const totalCount = INITIAL_DOCUMENTS.length;
    const categoriesCount = DOCUMENT_CATEGORIES.length;
    const totalDownloads = INITIAL_DOCUMENTS.reduce(
      (acc, doc) => acc + (doc.downloadsCount || 0),
      0
    );

    return { totalCount, categoriesCount, totalDownloads };
  },

  /**
   * Filtre et recherche dans les documents selon les critères fournis
   */
  async filterDocuments(
    filters: DocumentFilterState
  ): Promise<{ items: UsefulDocument[]; total: number; page: number; totalPages: number }> {
    let results = [...INITIAL_DOCUMENTS];

    // 1. Recherche textuelle
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      results = results.filter((doc) => {
        const matchTitle = doc.title.toLowerCase().includes(q);
        const matchDesc = doc.description.toLowerCase().includes(q);
        const matchType = doc.type.toLowerCase().includes(q);
        const matchIssuer = doc.issuer ? doc.issuer.toLowerCase().includes(q) : false;
        const matchTags = doc.tags.some((t) => t.toLowerCase().includes(q));
        return matchTitle || matchDesc || matchType || matchIssuer || matchTags;
      });
    }

    // 2. Filtre par Catégorie
    if (filters.category && filters.category !== 'all') {
      results = results.filter((doc) => doc.category === filters.category);
    }

    // 3. Filtre par Format
    if (filters.format && filters.format !== 'all') {
      results = results.filter((doc) => doc.format === filters.format);
    }

    // 4. Filtre par Année
    if (filters.year && filters.year !== 'all') {
      results = results.filter((doc) => doc.year === filters.year);
    }

    // 5. Filtre par Niveau d'Accès
    if (filters.accessLevel && filters.accessLevel !== 'all') {
      results = results.filter((doc) => doc.accessLevel === filters.accessLevel);
    }

    // 6. Tri
    if (filters.sortBy === 'recent') {
      results.sort((a, b) => b.year - a.year);
    } else if (filters.sortBy === 'downloads') {
      results.sort((a, b) => b.downloadsCount - a.downloadsCount);
    } else if (filters.sortBy === 'title') {
      results.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // pertinence : populaires et récents en premier
      results.sort((a, b) => {
        if (a.isPopular && !b.isPopular) return -1;
        if (!a.isPopular && b.isPopular) return 1;
        return b.downloadsCount - a.downloadsCount;
      });
    }

    const total = results.length;
    const perPage = filters.perPage || 9;
    const totalPages = Math.ceil(total / perPage) || 1;
    const validPage = Math.min(Math.max(filters.page, 1), totalPages);

    const startIndex = (validPage - 1) * perPage;
    const paginatedItems = results.slice(startIndex, startIndex + perPage);

    return {
      items: paginatedItems,
      total,
      page: validPage,
      totalPages,
    };
  },
};
