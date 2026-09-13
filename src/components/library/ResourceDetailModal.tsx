'use client';

import React, { useState, useEffect } from 'react';
import { Resource } from '@/types/library';

interface ResourceDetailModalProps {
  resource: Resource | null;
  onClose: () => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({
  resource,
  onClose,
  onOpenAuth,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'preview' | 'rights'>('details');
  const [isFavorite, setIsFavorite] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

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
    if (resource) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [resource]);

  if (!resource) return null;

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  const handleOpenReader = () => {
    setToastNotice(`Ouverture du document « ${resource.title} » dans le lecteur sécurisé...`);
    setTimeout(() => setToastNotice(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Floating Toast Notification */}
        {toastNotice && (
          <div className="modal-toast-bubble">
            <span className="toast-dot">✓</span>
            <span>{toastNotice}</span>
          </div>
        )}

        {/* Modal Top Decorative Banner */}
        <div className="modal-cover" style={{ background: resource.coverGradient }}>
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
            <span className="modal-cat-badge">{resource.category.toUpperCase()}</span>
            <span className="modal-grade-badge">{resource.level.grade}</span>
            <span className={`modal-access-glow glow-${resource.accessLevel}`}>
              {resource.accessLevel === 'premium'
                ? '⭐ Formule Gold'
                : resource.accessLevel === 'subscription'
                ? '⚡ Abonnement Requis'
                : '✓ Accès Gratuit'}
            </span>
          </div>

          <div className="modal-cover-title-wrap">
            <h2 className="modal-title-white">{resource.title}</h2>
            {resource.subtitle && <p className="modal-sub-white">{resource.subtitle}</p>}
            <div className="modal-meta-source">
              <span className="author-val">{resource.author}</span>
              {resource.institution && <span className="inst-val"> • {resource.institution}</span>}
            </div>
          </div>
        </div>

        {/* Specs Strip */}
        <div className="specs-strip">
          <div className="spec-tile">
            <span className="spec-lbl">Format</span>
            <strong className="spec-data">{resource.resourceType.toUpperCase()}</strong>
          </div>
          <div className="spec-tile">
            <span className="spec-lbl">Volume</span>
            <strong className="spec-data">{resource.pagesCount} pages</strong>
          </div>
          <div className="spec-tile">
            <span className="spec-lbl">Matière</span>
            <strong className="spec-data">{resource.subject}</strong>
          </div>
          <div className="spec-tile">
            <span className="spec-lbl">Évaluation</span>
            <strong className="spec-data">★ {resource.rating.toFixed(1)} ({resource.reviewsCount})</strong>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="modal-tab-bar">
          <button
            type="button"
            className={`tab-item ${activeTab === 'details' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            <span>Présentation & Sommaire</span>
            {activeTab === 'details' && <span className="tab-bar-indicator" />}
          </button>
          <button
            type="button"
            className={`tab-item ${activeTab === 'preview' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            <span>Aperçu de la page 1</span>
            {activeTab === 'preview' && <span className="tab-bar-indicator" />}
          </button>
          <button
            type="button"
            className={`tab-item ${activeTab === 'rights' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('rights')}
          >
            <span>Droits & Consultation</span>
            {activeTab === 'rights' && <span className="tab-bar-indicator" />}
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="modal-body-content">
          {activeTab === 'details' && (
            <div className="tab-pane animate-fade">
              <div className="desc-box">
                <h4 className="box-title">À propos de cette ressource</h4>
                <p className="desc-text">{resource.description}</p>
              </div>

              <div className="features-checklist">
                <h4 className="box-title">Avantages pédagogiques</h4>
                <div className="check-item">
                  <span className="check-icon">✓</span>
                  <span>Document validé conforme au programme en vigueur au Sénégal</span>
                </div>
                <div className="check-item">
                  <span className="check-icon">✓</span>
                  <span>Structure claire avec définitions, schémas et exercices corrigés</span>
                </div>
                <div className="check-item">
                  <span className="check-icon">✓</span>
                  <span>Compatible avec le mode hors-connexion sur smartphone et tablette</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="tab-pane animate-fade">
              <div className="paper-preview">
                <div className="paper-banner">
                  <span>BIBLIOTHÈQUE NUMÉRIQUE SUNUBIBLIO • SPÉCIMEN ACADÉMIQUE</span>
                </div>
                <div className="paper-content">
                  <h3 className="paper-title">{resource.title}</h3>
                  <p className="paper-meta">
                    Discipline : <strong>{resource.subject}</strong> | Cycle : <strong>{resource.level.grade}</strong>
                  </p>
                  <div className="paper-line" />
                  <p className="paper-p">
                    <strong>Extrait de cours :</strong> Les concepts abordés dans cet ouvrage s’inscrivent dans une démarche progressive d’acquisition des savoirs fondamentaux et de maîtrise des outils d’analyse théorique et pratique.
                  </p>
                  <div className="paper-watermark">SUNUBIBLIO</div>
                </div>
                <div className="paper-bottom">
                  <span>Aperçu protégé • Page 1 sur {resource.pagesCount}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rights' && (
            <div className="tab-pane animate-fade">
              <div className="rights-card">
                <h4>Conditions d’accès & Utilisation équitable</h4>
                <p>
                  Cette ressource est mise à la disposition des apprenants pour une consultation individuelle dans le cadre de leurs études. Les reproductions intégrales ou distributions commerciales sont strictement proscrites.
                </p>
                <div className="rights-pill-list">
                  <span className="r-pill">🔒 Filigrane sécurisé</span>
                  <span className="r-pill">📱 Prêt numérique personnel</span>
                  <span className="r-pill">📥 Synchronisation hors-ligne</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="modal-footer-pro">
          <div className="footer-aux">
            <button
              type="button"
              className={`btn-aux ${isFavorite ? 'fav-on' : ''}`}
              onClick={() => setIsFavorite(!isFavorite)}
              title="Ajouter aux favoris"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill={isFavorite ? '#ef4444' : 'none'} stroke={isFavorite ? '#ef4444' : 'currentColor'} strokeWidth="2.2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>{isFavorite ? 'Enregistré' : 'Favoris'}</span>
            </button>

            <button
              type="button"
              className="btn-aux"
              onClick={handleCopy}
              title="Partager"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span>{copiedLink ? 'Copié !' : 'Partager'}</span>
            </button>
          </div>

          <div className="footer-cta-group">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
            >
              Fermer
            </button>

            {resource.accessLevel === 'premium' ? (
              <button
                type="button"
                className="btn-gold-cta"
                onClick={() => {
                  onClose();
                  onOpenAuth && onOpenAuth('register');
                }}
              >
                <span>⭐ Débloquer avec Formule Gold</span>
              </button>
            ) : resource.accessLevel === 'subscription' ? (
              <button
                type="button"
                className="btn-primary-cta"
                onClick={() => {
                  onClose();
                  onOpenAuth && onOpenAuth('register');
                }}
              >
                <span>⚡ Débloquer avec Abonnement (Dès 3 000 FCFA)</span>
              </button>
            ) : (
              <button
                type="button"
                className="btn-primary-cta"
                onClick={handleOpenReader}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                <span>Consulter en ligne (Lecteur HD)</span>
              </button>
            )}
          </div>
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
          max-height: 92vh;
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

        .modal-cat-badge, .modal-grade-badge {
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

        .glow-subscription {
          background: #fef08a;
          color: #854d0e;
        }

        .glow-premium {
          background: #fef3c7;
          color: #92400e;
        }

        .modal-title-white {
          font-size: 21px;
          font-weight: 800;
          line-height: 1.35;
          margin: 0 0 6px 0;
          color: #ffffff;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .modal-sub-white {
          font-size: 13.5px;
          color: rgba(255, 255, 255, 0.9);
          margin: 0 0 8px 0;
        }

        .modal-meta-source {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.85);
          font-weight: 600;
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

        .modal-tab-bar {
          display: flex;
          align-items: center;
          border-bottom: 1px solid #e2e8f0;
          background: #ffffff;
          padding: 0 20px;
        }

        .tab-item {
          position: relative;
          background: none;
          border: none;
          padding: 14px 14px;
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: color 0.2s;
        }

        .tab-item:hover {
          color: #0f172a;
        }

        .tab-item.active-tab {
          color: #4f46e5;
          font-weight: 700;
        }

        .tab-bar-indicator {
          position: absolute;
          bottom: 0;
          left: 14px;
          right: 14px;
          height: 3px;
          background: #4f46e5;
          border-radius: 9999px;
        }

        .modal-body-content {
          padding: 22px;
          overflow-y: auto;
          flex: 1;
        }

        .box-title {
          font-size: 13.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #334155;
          margin: 0 0 8px 0;
        }

        .desc-text {
          font-size: 14px;
          line-height: 1.65;
          color: #475569;
          margin: 0 0 18px 0;
        }

        .features-checklist {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .check-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          padding: 7px 12px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #f1f5f9;
        }

        .check-icon {
          color: #10b981;
          font-weight: 800;
        }

        /* Paper preview */
        .paper-preview {
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          overflow: hidden;
        }

        .paper-banner {
          background: #e2e8f0;
          padding: 6px 12px;
          font-size: 10.5px;
          font-weight: 700;
          color: #475569;
          letter-spacing: 0.05em;
          text-align: center;
        }

        .paper-content {
          position: relative;
          background: #ffffff;
          padding: 24px;
          margin: 12px;
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .paper-title {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px 0;
        }

        .paper-meta {
          font-size: 12px;
          color: #64748b;
          margin: 0 0 10px 0;
        }

        .paper-line {
          height: 1px;
          background: #e2e8f0;
          margin-bottom: 12px;
        }

        .paper-p {
          font-size: 12.5px;
          line-height: 1.6;
          color: #334155;
        }

        .paper-watermark {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 900;
          color: rgba(79, 70, 229, 0.05);
          letter-spacing: 0.2em;
          transform: rotate(-20deg);
          pointer-events: none;
        }

        .paper-bottom {
          padding: 8px 14px;
          font-size: 11px;
          color: #64748b;
          text-align: right;
          border-top: 1px solid #e2e8f0;
        }

        .rights-card {
          padding: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }

        .rights-card h4 {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 6px 0;
        }

        .rights-card p {
          font-size: 13px;
          color: #475569;
          line-height: 1.6;
          margin: 0 0 14px 0;
        }

        .rights-pill-list {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .r-pill {
          padding: 4px 10px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 9999px;
          font-size: 11.5px;
          font-weight: 600;
          color: #334155;
        }

        /* Footer */
        .modal-footer-pro {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 22px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          gap: 12px;
          flex-wrap: wrap;
        }

        .footer-aux {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-aux {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          font-size: 12.5px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-aux:hover {
          background: #f1f5f9;
        }

        .btn-aux.fav-on {
          color: #ef4444;
          border-color: #fca5a5;
          background: #fef2f2;
        }

        .footer-cta-group {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: auto;
        }

        .btn-cancel {
          background: transparent;
          border: none;
          color: #64748b;
          font-size: 13px;
          font-weight: 600;
          padding: 8px 14px;
          border-radius: 8px;
          cursor: pointer;
        }

        .btn-cancel:hover {
          color: #0f172a;
          background: #e2e8f0;
        }

        .btn-primary-cta {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: #ffffff;
          border: none;
          padding: 9px 18px;
          font-size: 13px;
          font-weight: 700;
          border-radius: 9999px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3);
          transition: transform 0.15s;
        }

        .btn-primary-cta:hover {
          transform: translateY(-1px);
        }

        .btn-gold-cta {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #ffffff;
          border: none;
          padding: 9px 18px;
          font-size: 13px;
          font-weight: 700;
          border-radius: 9999px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(217, 119, 6, 0.3);
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pop-in {
          from { opacity: 0; transform: scale(0.96) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .animate-fade {
          animation: fade-in 0.2s ease-out;
        }

        @media (max-width: 640px) {
          .specs-strip {
            grid-template-columns: repeat(2, 1fr);
            padding: 10px 16px;
          }

          .modal-footer-pro {
            flex-direction: column;
            align-items: stretch;
          }

          .footer-cta-group {
            margin-left: 0;
            flex-direction: column;
            width: 100%;
          }

          .btn-primary-cta, .btn-gold-cta, .btn-cancel {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};
