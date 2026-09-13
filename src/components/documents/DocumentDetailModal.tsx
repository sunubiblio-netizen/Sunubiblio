'use client';

import React, { useEffect, useState } from 'react';
import { UsefulDocument } from '@/types/document';

interface DocumentDetailModalProps {
  document: UsefulDocument | null;
  onClose: () => void;
  onDownload: (doc: UsefulDocument) => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
  userHasSubscription?: boolean;
}

export const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({
  document: doc,
  onClose,
  onDownload,
  onOpenAuth,
  userHasSubscription = false,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    if (doc) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [doc]);

  if (!doc) return null;

  const isDownloadAllowed = doc.accessLevel === 'free' || userHasSubscription;

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setToastMessage('Lien de la ressource copié dans le presse-papier !');
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-doc-title"
    >
      <div className="modal-dialog doc-detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* Toast bubble */}
        {toastMessage && (
          <div className="modal-toast-bubble">
            <span className="toast-dot">✓</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal Top Header */}
        <div className="doc-modal-header">
          <div className="doc-modal-tags">
            <span className="doc-category-badge">{doc.category.toUpperCase()}</span>
            <span className="doc-format-badge">{doc.format}</span>
            {doc.accessLevel === 'premium' ? (
              <span className="doc-access-badge premium">Réservé Abonnés</span>
            ) : (
              <span className="doc-access-badge free">Accès Public Gratuit</span>
            )}
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Fermer la fenêtre"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Document Title & Description */}
        <div className="doc-modal-content">
          <h2 id="modal-doc-title" className="doc-modal-title">
            {doc.title}
          </h2>
          <p className="doc-modal-desc">{doc.description}</p>

          {/* Quick Technical Specs Grid */}
          <div className="doc-specs-grid">
            <div className="doc-spec-card">
              <span className="doc-spec-label">Format</span>
              <span className="doc-spec-value">{doc.format}</span>
            </div>
            <div className="doc-spec-card">
              <span className="doc-spec-label">Année</span>
              <span className="doc-spec-value">{doc.year}</span>
            </div>
            <div className="doc-spec-card">
              <span className="doc-spec-label">Taille</span>
              <span className="doc-spec-value">{doc.fileSize || 'Standard'}</span>
            </div>
            <div className="doc-spec-card">
              <span className="doc-spec-label">Téléchargements</span>
              <span className="doc-spec-value">{doc.downloadsCount.toLocaleString()}</span>
            </div>
          </div>

          {/* Issuer / Source */}
          {doc.issuer && (
            <div className="doc-issuer-box">
              <div className="doc-issuer-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <span className="doc-issuer-label">Source & Organisme émetteur</span>
                <p className="doc-issuer-name">{doc.issuer}</p>
              </div>
            </div>
          )}

          {/* Summary / Outline */}
          {doc.summaryOutline && doc.summaryOutline.length > 0 && (
            <div className="doc-outline-section">
              <h4 className="doc-section-heading">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
                <span>Structure du document</span>
              </h4>
              <ul className="doc-outline-list">
                {doc.summaryOutline.map((item, idx) => (
                  <li key={idx} className="doc-outline-item">
                    <span className="doc-outline-num">{idx + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Usage Advice */}
          {doc.usageAdvice && (
            <div className="doc-advice-box">
              <div className="doc-advice-icon">💡</div>
              <div>
                <strong className="doc-advice-title">Conseil pratique d'utilisation</strong>
                <p className="doc-advice-text">{doc.usageAdvice}</p>
              </div>
            </div>
          )}

          {/* Security & Intellectual Property Notice */}
          <div className="doc-legal-note">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>
              Les documents officiels et modèles types fournis par Sunubiblio sont vérifiés et mis à jour régulièrement.
              L’accès est sécurisé côté serveur conformément à nos règles de confidentialité et de propriété intellectuelle.
            </span>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="doc-modal-footer">
          <button type="button" className="btn-secondary doc-modal-share-btn" onClick={handleShare}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            <span>Partager</span>
          </button>

          {isDownloadAllowed ? (
            <button
              type="button"
              className="btn-primary doc-modal-download-btn"
              onClick={() => onDownload(doc)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Télécharger le document ({doc.format})</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary doc-modal-download-btn restricted"
              onClick={() => onDownload(doc)}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>S'abonner pour débloquer le téléchargement</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
