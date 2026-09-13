'use client';

import React from 'react';
import { UsefulDocument } from '@/types/document';

interface DocumentCardProps {
  document: UsefulDocument;
  onViewDetails: (doc: UsefulDocument) => void;
  onDownload: (doc: UsefulDocument) => void;
  userHasSubscription?: boolean;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onViewDetails,
  onDownload,
  userHasSubscription = false,
}) => {
  const isDownloadAllowed = document.accessLevel === 'free' || userHasSubscription;

  // Visual helper for format badges in standard refined tones
  const getFormatBadgeStyle = (format: string) => {
    switch (format) {
      case 'PDF':
        return { bg: '#fef2f2', color: '#dc2626', border: 'rgba(239, 68, 68, 0.25)' };
      case 'DOCX':
        return { bg: '#eff6ff', color: '#2563eb', border: 'rgba(59, 130, 246, 0.25)' };
      case 'XLSX':
        return { bg: '#f0fdf4', color: '#16a34a', border: 'rgba(34, 197, 94, 0.25)' };
      default:
        return { bg: '#f8fafc', color: '#475569', border: 'rgba(100, 116, 139, 0.25)' };
    }
  };

  const formatStyle = getFormatBadgeStyle(document.format);

  // Category labels helper
  const getCategoryLabel = (cat: string) => {
    const map: Record<string, string> = {
      administratifs: 'Administratif',
      guides: 'Guide pratique',
      formulaires: 'Formulaire',
      'textes-officiels': 'Texte officiel',
      scolaires: 'Scolaire',
      professionnels: 'Professionnel',
      modeles: 'Modèle type',
      autres: 'Ressource utile',
    };
    return map[cat] || cat;
  };

  return (
    <article className="document-card" aria-label={document.title}>
      {/* Card Header : Category & Badges */}
      <div className="doc-card-header">
        <div className="doc-category-badge-wrap">
          <span className="doc-category-badge">{getCategoryLabel(document.category)}</span>
          <span
            className="doc-format-badge"
            style={{
              backgroundColor: formatStyle.bg,
              color: formatStyle.color,
              borderColor: formatStyle.border,
            }}
          >
            {document.format}
          </span>
        </div>

        {/* Access Status Tag (Standard Site Colors: Indigo / Gold) */}
        {document.accessLevel === 'premium' ? (
          <span className="doc-access-badge premium" title="Réservé aux abonnés">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Abonnés</span>
          </span>
        ) : (
          <span className="doc-access-badge free" title="Accès public libre">
            <span>Accès libre</span>
          </span>
        )}
      </div>

      {/* Main Body */}
      <div className="doc-card-body">
        <h3 className="doc-card-title" onClick={() => onViewDetails(document)}>
          {document.title}
        </h3>
        <p className="doc-card-description">{document.description}</p>
      </div>

      {/* Metadata Bar (Type, Year, Size, Issuer) */}
      <div className="doc-card-meta">
        <div className="doc-meta-item" title="Nature du document">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span className="doc-meta-val">{document.type}</span>
        </div>

        <div className="doc-meta-subline">
          <span className="doc-meta-year">{document.year}</span>
          {document.fileSize && (
            <>
              <span className="doc-meta-dot">•</span>
              <span className="doc-meta-size">{document.fileSize}</span>
            </>
          )}
          {document.pageCount && (
            <>
              <span className="doc-meta-dot">•</span>
              <span className="doc-meta-pages">{document.pageCount} page{document.pageCount > 1 ? 's' : ''}</span>
            </>
          )}
        </div>
      </div>

      {/* Actions footer (Standard Site Colors: White outline vs Indigo gradient) */}
      <div className="doc-card-actions">
        {/* Bouton Consulter */}
        <button
          type="button"
          className="doc-btn-consult"
          onClick={() => onViewDetails(document)}
          aria-label={`Consulter les détails de ${document.title}`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span>Consulter</span>
        </button>

        {/* Bouton Télécharger (Couleur normale du site : Indigo #4f46e5 / #6366f1) */}
        {isDownloadAllowed ? (
          <button
            type="button"
            className="doc-btn-download authorized"
            onClick={() => onDownload(document)}
            title={`Télécharger ${document.title}`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Télécharger</span>
          </button>
        ) : (
          <button
            type="button"
            className="doc-btn-download restricted"
            onClick={() => onDownload(document)}
            title="Nécessite un abonnement pour le téléchargement"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Abonnement</span>
          </button>
        )}
      </div>
    </article>
  );
};
