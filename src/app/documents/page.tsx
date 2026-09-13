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
import { DocumentToolsSection } from '@/components/documents/tools/DocumentToolsSection';
import { documentService } from '@/services/documentService';
import {
  DocumentCategory,
  DocumentCategoryInfo,
  DocumentFilterState,
  UsefulDocument,
} from '@/types/document';
import { DOCUMENT_CATEGORIES, INITIAL_DOCUMENTS } from '@/data/mockDocuments';

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
  const [documents, setDocuments] = useState<UsefulDocument[]>(
    INITIAL_DOCUMENTS.slice(0, DEFAULT_FILTERS.perPage)
  );
  const [totalDocuments, setTotalDocuments] = useState(INITIAL_DOCUMENTS.length);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(INITIAL_DOCUMENTS.length / DEFAULT_FILTERS.perPage)
  );
  const [isLoading, setIsLoading] = useState(false);

  // Modals state
  const [selectedDoc, setSelectedDoc] = useState<UsefulDocument | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [downloadToast, setDownloadToast] = useState<{
    message: string;
    type: 'success' | 'warning' | 'error';
  } | null>(null);

  // Available distinct years from documents
  const availableYears = useMemo(() => {
    const yearsSet = new Set<number>(INITIAL_DOCUMENTS.map((d) => d.year));
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, []);


  // Load categories
  useEffect(() => {
    documentService.getCategories().then((cats) => {
      setCategories(cats);
    });
  }, []);

  // Load documents on filters change
  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await documentService.filterDocuments(filters);
      setDocuments(res.items);
      setTotalDocuments(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Erreur chargement documents:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

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

      // Simulation of secure signed file trigger
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

        {/* 1. Hero Section */}
        <DocumentsHero totalDocuments={totalDocuments} />

        {/* 2. Suite d'outils pour vos documents (Vérification, Word->PDF, Édition PDF, Mes documents) */}
        <DocumentToolsSection />

        {/* Container for Content */}
        <div className="container documents-catalog-container">
          {/* 2. Unified Search & Filters (Identical to Education module) */}
          <DocumentsFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            categories={categories}
            availableYears={availableYears}
            totalResults={totalDocuments}
          />

          {/* 4. Document Grid or Empty State */}
          <section className="documents-results-section" aria-live="polite">
            {isLoading ? (
              <div className="documents-loading-skeleton">
                <div className="skeleton-spinner" />
                <p>Chargement des documents certifiés...</p>
              </div>
            ) : documents.length === 0 ? (
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
                  {documents.map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      document={doc}
                      onViewDetails={(item) => setSelectedDoc(item)}
                      onDownload={handleDownload}
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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
    </div>
  );
}
