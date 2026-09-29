'use client';

import React from 'react';

export interface SocialActionsProps {
  /** Nombre de mentions J'aime */
  likesCount: number;
  /** Nombre de commentaires */
  commentsCount: number;
  /** Nombre de partages */
  sharesCount?: number;

  /** État actif du like */
  isLiked?: boolean;
  /** État actif de la sauvegarde / favori */
  isSaved?: boolean;
  /** Si le panneau de commentaires est ouvert/actif */
  isCommentsActive?: boolean;

  /** Événement au clic sur J'aime */
  onLike: () => void;
  /** Événement au clic sur Commentaire */
  onComment?: () => void;
  /** Événement au clic sur Partager */
  onShare?: () => void;
  /** Événement au clic sur Enregistrer */
  onSave?: () => void;

  /** Masquer le bouton enregistrer si non applicable (par défaut: true) */
  showSave?: boolean;
  /** Action additionnelle optionnelle à droite (ex: Story) */
  extraRightAction?: React.ReactNode;
  /** Classe CSS additionnelle */
  className?: string;
}

/**
 * Composant universel de barre d'actions sociales pour Sunubiblio.
 * Format standardisé :
 * GAUCHE : ❤️ 56   💬 50   ↗ 12
 * DROITE : 🔖
 */
export const SocialActions: React.FC<SocialActionsProps> = ({
  likesCount,
  commentsCount,
  sharesCount = 0,
  isLiked = false,
  isSaved = false,
  isCommentsActive = false,
  onLike,
  onComment,
  onShare,
  onSave,
  showSave = true,
  extraRightAction,
  className = '',
}) => {
  return (
    <div className={`social-actions-bar ${className}`.trim()}>
      {/* 1. Groupe d'actions gauche : ❤️ 56   💬 50   ↗ 12 */}
      <div className="social-action-left">
        {/* ❤️ Cœur / Like : icône + nombre uniquement */}
        <button
          type="button"
          className={`social-action-btn social-action-like ${isLiked ? 'is-liked' : ''}`}
          onClick={onLike}
          aria-label={isLiked ? "Je n'aime plus" : "J'aime"}
          title={isLiked ? "Je n'aime plus" : "J'aime"}
        >
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill={isLiked ? '#ef4444' : 'none'}
            stroke={isLiked ? '#ef4444' : 'currentColor'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="social-action-icon-svg"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          <span className="social-action-count">{likesCount}</span>
        </button>

        {/* 💬 Commentaire : icône + nombre uniquement */}
        {onComment && (
          <button
            type="button"
            className={`social-action-btn social-action-comment ${isCommentsActive ? 'is-active-tab' : ''}`}
            onClick={onComment}
            aria-label="Commentaires"
            title="Commentaires"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="social-action-icon-svg"
            >
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
            </svg>
            <span className="social-action-count">{commentsCount}</span>
          </button>
        )}

        {/* ↗ Partage : icône + nombre uniquement */}
        {onShare && (
          <button
            type="button"
            className="social-action-btn social-action-share"
            onClick={onShare}
            aria-label="Partager"
            title="Partager"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="social-action-icon-svg"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            <span className="social-action-count">{sharesCount}</span>
          </button>
        )}
      </div>

      {/* 2. Groupe d'actions droite : 🔖 Enregistrer (icône seule) + extras */}
      <div className="social-action-right">
        {extraRightAction}

        {showSave && onSave && (
          <button
            type="button"
            className={`social-action-btn social-action-save ${isSaved ? 'is-saved' : ''}`}
            onClick={onSave}
            aria-label={isSaved ? 'Retirer des favoris' : 'Enregistrer'}
            title={isSaved ? 'Retirer des favoris' : 'Enregistrer'}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill={isSaved ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="social-action-icon-svg"
            >
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
