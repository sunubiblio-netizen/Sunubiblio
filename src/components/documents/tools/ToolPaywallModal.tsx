'use client';

import React from 'react';
import { subscriptionAccessService } from '@/services/subscriptionAccessService';

interface ToolPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  featureTitle?: string;
}

export const ToolPaywallModal: React.FC<ToolPaywallModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  featureTitle = 'Modification avancée de PDF',
}) => {
  if (!isOpen) return null;

  const recommendedPlan = subscriptionAccessService.getRecommendedPlan();
  const upgradeLabel = subscriptionAccessService.getUpgradeActionLabel();

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog tool-paywall-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="paywall-header">
          <div className="paywall-badge-pill">
            <span className="paywall-sparkle">✨</span>
            <span>Accès Réservé</span>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Fermer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="paywall-body">
          <div className="paywall-icon-box">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h3 className="paywall-title">Cette fonctionnalité est disponible avec le forfait recommandé.</h3>
          
          <p className="paywall-desc">
            L’outil <strong>{featureTitle}</strong> (annotations, réorganisation de pages, surlignage et signature) fait partie des outils de création et d’édition avancée de Sunubiblio.
          </p>

          {/* Benefits summary list */}
          <div className="paywall-features-list">
            <div className="paywall-feat-item">
              <span className="feat-check">✓</span>
              <span>Modification et annotation illimitée de tous vos PDF</span>
            </div>
            <div className="paywall-feat-item">
              <span className="feat-check">✓</span>
              <span>Réorganisation, rotation et suppression de pages</span>
            </div>
            <div className="paywall-feat-item">
              <span className="feat-check">✓</span>
              <span>Accès illimité à la bibliothèque et aux corrigés d'annales</span>
            </div>
            <div className="paywall-feat-item">
              <span className="feat-check">✓</span>
              <span>Téléchargements hors connexion sécurisés</span>
            </div>
          </div>
        </div>

        <div className="paywall-footer">
          <button type="button" className="btn-secondary paywall-cancel-btn" onClick={onClose}>
            Continuer plus tard
          </button>
          <button
            type="button"
            className="btn-primary paywall-upgrade-btn"
            onClick={() => {
              onClose();
              onUpgrade();
            }}
          >
            <span>{upgradeLabel}</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
