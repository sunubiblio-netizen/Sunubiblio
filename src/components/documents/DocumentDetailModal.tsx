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
      setToastMessage('Lien du document copié dans le presse-papier !');
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
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="modal-toast-bubble">
            <span className="toast-dot">✓</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal Top Decorative Banner */}
        <div
          className="modal-cover"
          style={{
            background: doc.coverGradient || 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          }}
        >
          <div className="modal-cover-pattern" />

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Fermer les détails"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="modal-cover-top">
            <span className="modal-cat-badge">{doc.category.toUpperCase()}</span>
            <span className="modal-format-badge">{doc.format}</span>
            <span className={`modal-access-glow ${doc.accessLevel === 'premium' ? 'glow-premium' : 'glow-free'}`}>
              {doc.accessLevel === 'premium' ? '⭐ Réservé Abonnés' : '✓ Accès Gratuit'}
            </span>
          </div>

          <h2 id="modal-doc-title" className="modal-title-white">
            {doc.title}
          </h2>

          <p className="modal-sub-white">
            {doc.issuer ? `Émis par : ${doc.issuer}` : doc.author ? `Par ${doc.author}` : 'Sunubiblio Documents Officiels'}
          </p>
        </div>

        {/* Specs Strip */}
        <div className="specs-strip">
          <div className="spec-tile">
            <span className="spec-lbl">Format</span>
            <span className="spec-data">{doc.format}</span>
          </div>
          <div className="spec-tile">
            <span className="spec-lbl">Année</span>
            <span className="spec-data">{doc.year}</span>
          </div>
          <div className="spec-tile">
            <span className="spec-lbl">Taille</span>
            <span className="spec-data">{doc.fileSize || 'Standard'}</span>
          </div>
          <div className="spec-tile">
            <span className="spec-lbl">Téléchargements</span>
            <span className="spec-data">{doc.downloadsCount.toLocaleString()}</span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="modal-body-scroll">
          {/* Description */}
          <div className="doc-desc-block">
            <h4 className="doc-section-heading">Description & Portée</h4>
            <p className="doc-modal-desc">{doc.description}</p>
          </div>

          {/* Issuer / Source */}
          {doc.issuer && (
            <div className="doc-issuer-box">
              <div className="doc-issuer-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
              <h4 className="doc-section-heading">Structure du document</h4>
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

          {/* Legal Note */}
          <div className="doc-legal-note">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>
              Les documents officiels et modèles types fournis par Sunubiblio sont certifiés conformes.
              L’accès est sécurisé conformément aux règles d'authenticité et de propriété intellectuelle.
            </span>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="modal-footer-actions">
          <button type="button" className="btn-share" onClick={handleShare}>
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
              className="btn-download primary"
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
              className="btn-download restricted"
              onClick={() => onDownload(doc)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>S'abonner pour débloquer le téléchargement</span>
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fade-in 0.2s ease-out;
        }

        .modal-dialog {
          position: relative;
          background: #ffffff;
          border-radius: 20px;
          width: 100%;
          max-width: 660px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 60px -12px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.15);
          animation: pop-in 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .modal-toast-bubble {
          position: absolute;
          top: 14px;
          left: 50%;
          transform: translateX(-50%);
          background: #0f172a;
          color: #ffffff;
          padding: 8px 18px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 100;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }

        .toast-dot {
          color: #10b981;
          font-weight: 800;
        }

        .modal-cover {
          position: relative;
          padding: 28px 24px 22px;
          color: #ffffff;
          overflow: hidden;
        }

        .modal-cover-pattern {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px);
          background-size: 16px 16px;
          pointer-events: none;
        }

        .modal-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #ffffff;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .modal-close-btn:hover {
          background: rgba(0, 0, 0, 0.45);
          transform: rotate(90deg) scale(1.05);
        }

        .modal-cover-top {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }

        .modal-cat-badge, .modal-format-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 700;
          color: #ffffff;
        }

        .modal-access-glow {
          padding: 4px 11px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .glow-free {
          background: #dcfce7;
          color: #15803d;
        }

        .glow-premium {
          background: #fef3c7;
          color: #92400e;
        }

        .modal-title-white {
          font-size: 20px;
          font-weight: 800;
          line-height: 1.35;
          margin: 0 0 6px 0;
          color: #ffffff;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .modal-sub-white {
          font-size: 13.5px;
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
        }

        .specs-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          padding: 12px 24px;
          gap: 12px;
        }

        .spec-tile {
          display: flex;
          flex-direction: column;
        }

        .spec-lbl {
          font-size: 10.5px;
          font-weight: 600;
          text-transform: uppercase;
          color: #64748b;
        }

        .spec-data {
          font-size: 12.5px;
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .modal-body-scroll {
          padding: 20px 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .doc-section-heading {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #64748b;
          margin: 0 0 8px 0;
        }

        .doc-modal-desc {
          font-size: 14px;
          line-height: 1.6;
          color: #334155;
          margin: 0;
        }

        .doc-issuer-box {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #fffdf5;
          border: 1px solid rgba(245, 158, 11, 0.25);
          border-radius: 12px;
          padding: 12px 16px;
        }

        .doc-issuer-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #fef3c7;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .doc-issuer-label {
          font-size: 11px;
          font-weight: 600;
          color: #92400e;
          text-transform: uppercase;
        }

        .doc-issuer-name {
          font-size: 13.5px;
          font-weight: 700;
          color: #78350f;
          margin: 2px 0 0 0;
        }

        .doc-outline-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .doc-outline-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          background: #f8fafc;
          border-radius: 8px;
          font-size: 13px;
          color: #1e293b;
        }

        .doc-outline-num {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          background: #e2e8f0;
          color: #475569;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .doc-advice-box {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 12px;
          padding: 14px 16px;
        }

        .doc-advice-icon {
          font-size: 20px;
          line-height: 1;
        }

        .doc-advice-title {
          font-size: 13px;
          font-weight: 700;
          color: #166534;
          display: block;
          margin-bottom: 3px;
        }

        .doc-advice-text {
          font-size: 12.5px;
          color: #15803d;
          line-height: 1.5;
          margin: 0;
        }

        .doc-legal-note {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 11.5px;
          color: #64748b;
          line-height: 1.5;
          background: #f8fafc;
          border-radius: 10px;
          padding: 10px 14px;
        }

        .modal-footer-actions {
          padding: 14px 24px;
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .btn-share {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #475569;
          font-size: 13px;
          font-weight: 600;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-share:hover {
          background: #f8fafc;
          color: #0f172a;
          border-color: #94a3b8;
        }

        .btn-download {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          font-size: 13.5px;
          font-weight: 700;
          border-radius: 9999px;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }

        .btn-download.primary {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(217, 119, 6, 0.35);
        }

        .btn-download.primary:hover {
          background: linear-gradient(135deg, #fbbf24 0%, #ea580c 100%);
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(217, 119, 6, 0.45);
        }

        .btn-download.restricted {
          background: #f59e0b;
          color: #ffffff;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pop-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (max-width: 640px) {
          .specs-strip {
            grid-template-columns: repeat(2, 1fr);
          }
          .modal-footer-actions {
            flex-direction: column;
          }
          .btn-share, .btn-download {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};
