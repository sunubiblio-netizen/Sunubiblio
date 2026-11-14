'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { AuthModal } from '@/components/ui/AuthModal';
import { DocumentsHero } from '@/components/documents/DocumentsHero';
import { DocumentsFilters } from '@/components/documents/DocumentsFilters';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { DocumentDetailModal } from '@/components/documents/DocumentDetailModal';
import { DocumentsEmptyState } from '@/components/documents/DocumentsEmptyState';
import { documentService } from '@/services/documentService';
import {
  DocumentCategory,
  DocumentCategoryInfo,
  DocumentFilterState,
  UsefulDocument,
} from '@/types/document';
import { DOCUMENT_CATEGORIES, INITIAL_DOCUMENTS } from '@/data/mockDocuments';
import {
  getPublishedAdminItems,
  mapAdminItemToUsefulDocument,
  ADMIN_CATALOG_UPDATED_EVENT,
} from '@/lib/adminCatalogStore';

const DEFAULT_FILTERS: DocumentFilterState = {
  searchQuery: '',
  category: 'all',
  format: 'all',
  year: 'all',
  accessLevel: 'all',
  sortBy: 'pertinence',
  page: 1,
  perPage: 9,
};

export default function DocumentsPage() {
  const router = useRouter();

  // State with instant initial data
  const [filters, setFilters] = useState<DocumentFilterState>(DEFAULT_FILTERS);
  const [categories, setCategories] = useState<DocumentCategoryInfo[]>(DOCUMENT_CATEGORIES);
  const [adminDocuments, setAdminDocuments] = useState<UsefulDocument[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Modals state
  const [selectedDoc, setSelectedDoc] = useState<UsefulDocument | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [downloadToast, setDownloadToast] = useState<{
    message: string;
    type: 'success' | 'warning' | 'error';
  } | null>(null);

  // 1. Synchronisation automatique avec le Back-Office Administrateur
  // Récupère tout document publié (même 1 ou 2 pages, rapports, modèles, guides)
  // en excluant uniquement les fascicules spécifiques aux concours.
  useEffect(() => {
    const syncAdminDocs = () => {
      const items = getPublishedAdminItems()
        .filter((item) => !(item.destination === 'concours' && item.documentKind === 'fascicule'))
        .map(mapAdminItemToUsefulDocument);
      setAdminDocuments(items);
    };

    syncAdminDocs();
    window.addEventListener(ADMIN_CATALOG_UPDATED_EVENT, syncAdminDocs);
    return () => window.removeEventListener(ADMIN_CATALOG_UPDATED_EVENT, syncAdminDocs);
  }, []);

  // 2. Fusion de la base documentaire (Admin + Initiale)
  const allUsefulDocuments = useMemo(() => {
    return [...adminDocuments, ...INITIAL_DOCUMENTS];
  }, [adminDocuments]);

  // Distinct years available
  const availableYears = useMemo(() => {
    const yearsSet = new Set<number>(allUsefulDocuments.map((d) => d.year));
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [allUsefulDocuments]);

  // Load categories
  useEffect(() => {
    documentService.getCategories().then((cats) => {
      setCategories(cats);
    });
  }, []);

  // 3. Filtrage en mémoire ultra-réactif
  const filteredAndSortedDocuments = useMemo(() => {
    let result = [...allUsefulDocuments];

    // Favoris uniquement
    if (onlyFavorites) {
      result = result.filter((d) => favorites.includes(d.id));
    }

    // Recherche texte
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter((d) => {
        const matchTitle = d.title.toLowerCase().includes(q);
        const matchDesc = d.description.toLowerCase().includes(q);
        const matchType = d.type.toLowerCase().includes(q);
        const matchIssuer = d.issuer ? d.issuer.toLowerCase().includes(q) : false;
        const matchTags = d.tags ? d.tags.some((t) => t.toLowerCase().includes(q)) : false;
        return matchTitle || matchDesc || matchType || matchIssuer || matchTags;
      });
    }

    // Filtre Catégorie
    if (filters.category !== 'all') {
      result = result.filter((d) => d.category === filters.category);
    }

    // Filtre Format
    if (filters.format !== 'all') {
      const fmt = filters.format.toUpperCase();
      result = result.filter((d) => d.format.toUpperCase() === fmt);
    }

    // Filtre Année
    if (filters.year !== 'all') {
      result = result.filter((d) => d.year === filters.year);
    }

    // Filtre Niveau d'accès
    if (filters.accessLevel !== 'all') {
      result = result.filter((d) => d.accessLevel === filters.accessLevel);
    }

    // Tri
    switch (filters.sortBy) {
      case 'recent':
        result.sort((a, b) => (b.year || 0) - (a.year || 0));
        break;
      case 'downloads':
        result.sort((a, b) => (b.downloadsCount || 0) - (a.downloadsCount || 0));
        break;
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'pertinence':
      default:
        result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
        break;
    }

    return result;
  }, [allUsefulDocuments, filters, onlyFavorites, favorites]);

  // Pagination
  const totalResults = filteredAndSortedDocuments.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / filters.perPage));
  const paginatedDocuments = useMemo(() => {
    const start = (filters.page - 1) * filters.perPage;
    return filteredAndSortedDocuments.slice(start, start + filters.perPage);
  }, [filteredAndSortedDocuments, filters.page, filters.perPage]);

  // Handler helpers
  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleFilterChange = (newFilters: Partial<DocumentFilterState>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1,
    }));
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setOnlyFavorites(false);
  };

  const handleToggleFavorite = (docId: string, isFav: boolean) => {
    setFavorites((prev) => {
      if (isFav) {
        return prev.includes(docId) ? prev : [...prev, docId];
      } else {
        return prev.filter((id) => id !== docId);
      }
    });
  };

  // Secure download handler with server authorization check
  const handleDownload = async (doc: UsefulDocument) => {
    try {
      setDownloadToast({
        message: `Vérification des droits d'accès pour « ${doc.title} »...`,
        type: 'warning',
      });

      const res = await fetch(`/api/documents/download?id=${encodeURIComponent(doc.id)}`);
      const data = await res.json();

      if (!res.ok || !data.authorized) {
        if (data.requiresSubscription) {
          setDownloadToast({
            message:
              'Ce document officiel nécessite un abonnement actif. Redirection vers les formules...',
            type: 'warning',
          });
          setTimeout(() => {
            router.push('/tarifs');
          }, 1800);
          return;
        }

        setDownloadToast({
          message: data.message || 'Accès non autorisé pour ce téléchargement.',
          type: 'error',
        });
        setTimeout(() => setDownloadToast(null), 4000);
        return;
      }

      // Authorization granted
      setDownloadToast({
        message: `Téléchargement autorisé ! Préparation du fichier ${doc.format} (${doc.fileSize || 'Standard'})...`,
        type: 'success',
      });

      setTimeout(() => {
        setDownloadToast({
          message: `Document « ${doc.title} » téléchargé avec succès.`,
          type: 'success',
        });
        setTimeout(() => setDownloadToast(null), 3500);
      }, 1200);
    } catch (err) {
      console.error('Erreur téléchargement document:', err);
      setDownloadToast({
        message: 'Impossible de joindre le serveur de téléchargement.',
        type: 'error',
      });
      setTimeout(() => setDownloadToast(null), 4000);
    }
  };

  return (
    <div className="documents-page-root">
      {/* Universal Header */}
      <Navbar activePage="documents" onOpenAuth={handleOpenAuth} />

      <main className="documents-page-main">
        {/* Floating Toast Notification */}
        {downloadToast && (
          <div className={`doc-global-toast ${downloadToast.type}`}>
            <div className="doc-toast-content">
              {downloadToast.type === 'success' && <span className="doc-toast-icon">✓</span>}
              {downloadToast.type === 'warning' && <span className="doc-toast-icon">ℹ</span>}
              {downloadToast.type === 'error' && <span className="doc-toast-icon">⚠</span>}
              <span className="doc-toast-text">{downloadToast.message}</span>
            </div>
          </div>
        )}

        {/* 1. Hero Section & Sticky Search Capsule (Exactement comme Bibliothèque) */}
        <DocumentsHero
          initialSearch={filters.searchQuery}
          onSearch={(query) => handleFilterChange({ searchQuery: query, page: 1 })}
          totalDocuments={totalResults}
        />

        {/* Container for Content */}
        <div className="container documents-catalog-container">
          {/* 2. Unified Search & Filters */}
          <DocumentsFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            categories={categories}
            availableYears={availableYears}
            totalResults={totalResults}
          />

          {/* 3. Document Grid or Empty State with 3D Book Cover Cards */}
          <section className="documents-results-section" aria-live="polite">
            {paginatedDocuments.length === 0 ? (
              <DocumentsEmptyState
                searchQuery={filters.searchQuery}
                categoryLabel={
                  filters.category !== 'all'
                    ? categories.find((c) => c.id === filters.category)?.label
                    : undefined
                }
                onResetFilters={handleResetFilters}
              />
            ) : (
              <>
                <div className="documents-cards-grid">
                  {paginatedDocuments.map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      document={{
                        ...doc,
                        isFavorite: favorites.includes(doc.id),
                      }}
                      onViewDetails={(item) => setSelectedDoc(item)}
                      onDownload={handleDownload}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="documents-pagination">
                    <button
                      type="button"
                      className="pagination-btn"
                      disabled={filters.page <= 1}
                      onClick={() => handleFilterChange({ page: filters.page - 1 })}
                    >
                      ← Précédent
                    </button>
                    <span className="pagination-info">
                      Page <strong>{filters.page}</strong> sur <strong>{totalPages}</strong>
                    </span>
                    <button
                      type="button"
                      className="pagination-btn"
                      disabled={filters.page >= totalPages}
                      onClick={() => handleFilterChange({ page: filters.page + 1 })}
                    >
                      Suivant →
                    </button>
                  </div>
                )}
              </>
            )}
          </section>

          {/* Practical Info Banner */}
          <section className="documents-info-banner">
            <div className="info-banner-left">
              <div className="info-banner-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <h4 className="info-banner-title">Conformité et authenticité des documents</h4>
                <p className="info-banner-desc">
                  Tous les modèles de lettres et démarches administratives sont mis en conformité avec les usages des institutions et de l'enseignement au Sénégal. Les fichiers protégés sont distribués via des protocoles chiffrés sécurisés.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="btn-secondary info-banner-btn"
              onClick={() => router.push('/contact')}
            >
              Proposer un modèle
            </button>
          </section>
        </div>
      </main>

      {/* Modal Consultation & Aperçu */}
      {selectedDoc && (
        <DocumentDetailModal
          document={selectedDoc}
          onClose={() => setSelectedDoc(null)}
          onDownload={handleDownload}
          onOpenAuth={handleOpenAuth}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
      />

      {/* Universal Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      <style jsx>{`
        .documents-page-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #ffffff !important;
          position: relative;
        }

        .documents-page-main {
          flex: 1;
          background: #ffffff !important;
        }

        .documents-catalog-container {
          padding-top: 24px;
          padding-bottom: 60px;
          max-width: 1360px;
        }

        .documents-results-section {
          margin-top: 20px;
        }

        .documents-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        @media (max-width: 1080px) and (min-width: 641px) {
          .documents-cards-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 18px;
          }
        }

        @media (max-width: 640px) {
          .documents-cards-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .documents-catalog-container {
            padding-top: 16px;
            padding-bottom: 80px;
          }
        }

        .documents-pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 36px;
        }

        .pagination-btn {
          padding: 8px 18px;
          border-radius: 9999px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #1e293b;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #fffbeb;
          border-color: #f59e0b;
          color: #b45309;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-info {
          font-size: 13px;
          color: #64748b;
        }

        .documents-info-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          background: #fffbeb;
          border: 1px solid rgba(245, 158, 11, 0.25);
          border-radius: 18px;
          padding: 24px 28px;
          margin-top: 48px;
        }

        .info-banner-left {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .info-banner-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(245, 158, 11, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .info-banner-title {
          font-size: 15px;
          font-weight: 700;
          color: #92400e;
          margin: 0 0 4px 0;
        }

        .info-banner-desc {
          font-size: 13px;
          color: #78350f;
          line-height: 1.5;
          margin: 0;
          max-width: 780px;
        }

        .info-banner-btn {
          flex-shrink: 0;
          padding: 10px 20px;
          font-size: 13.5px;
          font-weight: 700;
          background: #ffffff;
          border: 1px solid rgba(245, 158, 11, 0.4);
          color: #b45309;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .info-banner-btn:hover {
          background: #f59e0b;
          color: #ffffff;
        }

        @media (max-width: 768px) {
          .documents-info-banner {
            flex-direction: column;
            align-items: stretch;
            padding: 20px;
          }
          .info-banner-btn {
            align-self: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
