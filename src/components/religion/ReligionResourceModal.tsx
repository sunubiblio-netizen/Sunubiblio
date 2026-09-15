'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { ReligionResource, ReligionBranch, ReligionTradition } from '@/types/religion';
import { religionService } from '@/services/religionService';
import { PRICING_PLANS } from '@/data/pricingPlans';

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
  const [isVerifying, setIsVerifying] = useState(false);
  const [accessResult, setAccessResult] = useState<{
    authorized: boolean;
    signedDownloadUrl?: string;
    error?: string;
    requiredPlanName?: string;
    requiredPlanPrice?: string;
  } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (resource) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setAccessResult(null);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [resource, onClose]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!resource || !mounted || typeof document === 'undefined' || !document.body) return null;

  // Récupération dynamique du nom et tarif du plan requis sans jamais coder les prix en dur
  const requiredPlanObj = PRICING_PLANS.find(
    (p) =>
      (resource.requiredPlan === 'gratuit' && p.id === 'plan_gratuit') ||
      (resource.requiredPlan === 'simple' && p.id === 'plan_simple') ||
      (resource.requiredPlan === 'recommande' && p.id === 'plan_recommande') ||
      (resource.requiredPlan === 'gold' && p.id === 'plan_gold')
  );

  const handleAccessCheck = async () => {
    setIsVerifying(true);
    try {
      // Simulation avec plan par défaut (ou profil utilisateur connecté)
      const res = await religionService.verifyResourceAccess(resource.id, 'gratuit');
      setAccessResult(res);
      if (res.authorized && res.signedDownloadUrl) {
        window.open(res.signedDownloadUrl, '_blank');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return createPortal(
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 9999999 }}>
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
            <span className="modal-access-badge">
              {requiredPlanObj ? requiredPlanObj.name : resource.requiredPlan}
            </span>
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
            {resource.titre}
          </h2>

          <div className="religion-modal-author-box">
            <div className="author-avatar-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <div className="author-name">{resource.auteur}</div>
              {resource.auteurBio && (
                <div className="author-bio">{resource.auteurBio}</div>
              )}
            </div>
          </div>

          {/* Grille de métadonnées réelles */}
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
              <span className="cell-label">Pages / Taille</span>
              <span className="cell-value">
                {resource.pagesCount ? `${resource.pagesCount} pages` : 'Texte intégral'}{' '}
                {resource.fileSize ? `(${resource.fileSize})` : ''}
              </span>
            </div>
            <div className="meta-cell">
              <span className="cell-label">Consultations réelles</span>
              <span className="cell-value">{resource.viewsCount} vues &bull; {resource.downloadsCount} téléchargements</span>
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

          {/* Source et authenticité */}
          <div className="modal-section">
            <h4 className="modal-section-title">Source patrimoniale certifiée</h4>
            <p className="modal-description-text text-muted">{resource.source}</p>
          </div>

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

          {/* Alerte sécurité serveur si accès refusé */}
          {accessResult && !accessResult.authorized && (
            <div className="modal-access-warning">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div>
                <strong>{accessResult.error}</strong>
                <p>
                  Formule requise : {accessResult.requiredPlanName} ({accessResult.requiredPlanPrice})
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="religion-modal-footer">
          {resource.requiredPlan !== 'gratuit' ? (
            <div className="modal-premium-action-wrap">
              <div className="premium-note">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#d97706">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>
                  Cette ressource complète requiert la formule {requiredPlanObj?.name} (
                  {requiredPlanObj?.formattedPrice}/mois).
                </span>
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
                  Découvrir les offres
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
                onClick={handleAccessCheck}
                disabled={isVerifying}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                <span>{isVerifying ? 'Vérification serveur...' : 'Consulter le document'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
