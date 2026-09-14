'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ReligionResource, ReligionBranch, ReligionTradition } from '@/types/religion';

interface ReligionResourceModalProps {
  resource: ReligionResource | null;
  tradition?: ReligionTradition | null;
  branch?: ReligionBranch | null;
  onClose: () => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export const ReligionResourceModal: React.FC<ReligionResourceModalProps> = ({
  resource,
  tradition,
  branch,
  onClose,
  onOpenAuth,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (resource) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [resource, onClose]);

  if (!resource) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container religion-resource-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-res-title"
      >
        {/* Header de la modale */}
        <div className="religion-modal-header">
          <div className="modal-header-meta">
            {tradition && (
              <span
                className="modal-cat-tag"
                style={{
                  backgroundColor: tradition.bgLight,
                  color: tradition.accentColor,
                }}
              >
                {tradition.title}
              </span>
            )}
            {branch && (
              <span className="modal-subcat-badge">{branch.title}</span>
            )}
            <span className="modal-type-badge">{resource.contentType}</span>
            {resource.accessLevel === 'premium' ? (
              <span className="modal-access-badge premium">Accès Premium</span>
            ) : (
              <span className="modal-access-badge free">Ressource Libre &amp; Gratuite</span>
            )}
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Fermer la modale"
          >
            ✕
          </button>
        </div>

        {/* Corps de la modale */}
        <div className="religion-modal-body">
          {/* Titre et auteur */}
          <h2 id="modal-res-title" className="religion-modal-title">
            {resource.title}
          </h2>

          <div className="religion-modal-author-box">
            <div className="author-avatar-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <div className="author-name">{resource.author}</div>
              {resource.authorBio && (
                <div className="author-bio">{resource.authorBio}</div>
              )}
            </div>
          </div>

          {/* Grille de métadonnées */}
          <div className="modal-meta-grid">
            <div className="meta-cell">
              <span className="cell-label">Époque / Année</span>
              <span className="cell-value">
                {resource.year ? `${resource.year}` : 'Non précisé'} {resource.period ? `(${resource.period})` : ''}
              </span>
            </div>
            <div className="meta-cell">
              <span className="cell-label">Langue(s)</span>
              <span className="cell-value">{resource.language}</span>
            </div>
            <div className="meta-cell">
              <span className="cell-label">Volume / Format</span>
              <span className="cell-value">
                {resource.pagesCount ? `${resource.pagesCount} pages` : resource.duration || 'Texte intégral'}
              </span>
            </div>
            <div className="meta-cell">
              <span className="cell-label">Statut &amp; Source</span>
              <span className="cell-value">{resource.source}</span>
            </div>
          </div>

          {/* Présentation / Description */}
          <div className="modal-section">
            <h4 className="modal-section-title">Présentation de l'œuvre</h4>
            <p className="modal-description-text">{resource.description}</p>
          </div>

          {/* Thèmes clés / Sommaire */}
          {resource.summary && resource.summary.length > 0 && (
            <div className="modal-section">
              <h4 className="modal-section-title">Axes et enseignements clés</h4>
              <ul className="modal-summary-list">
                {resource.summary.map((point, index) => (
                  <li key={index} className="modal-summary-item">
                    <span className="summary-bullet">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          <div className="modal-section">
            <h4 className="modal-section-title">Mots-clés associés</h4>
            <div className="modal-tags-wrap">
              {resource.tags.map((tag) => (
                <span key={tag} className="modal-tag-pill">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="religion-modal-footer">
          {resource.accessLevel === 'premium' ? (
            <div className="modal-premium-action-wrap">
              <div className="premium-note">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#d97706">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>Cette ressource patrimoniale complète nécessite un abonnement actif.</span>
              </div>
              <div className="modal-action-buttons">
                <button
                  type="button"
                  className="btn-secondary modal-btn"
                  onClick={onClose}
                >
                  Fermer
                </button>
                <Link href="/tarifs" className="btn-primary modal-btn-cta">
                  Découvrir les offres (dès 3 000 FCFA)
                </Link>
              </div>
            </div>
          ) : (
            <div className="modal-free-action-wrap">
              <button
                type="button"
                className="btn-secondary modal-btn"
                onClick={onClose}
              >
                Fermer
              </button>
              <button
                type="button"
                className="btn-primary modal-btn-cta"
                onClick={() => {
                  alert(`Ouverture de la lecture authentique pour "${resource.title}".`);
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                <span>Lire le document</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
