'use client';

import React from 'react';
import { PublicationFormat } from '@/types/publication';

interface PublicationsComposerProps {
  onOpenCreate: (initialFormat?: PublicationFormat) => void;
  userInitials?: string;
}

export const PublicationsComposer: React.FC<PublicationsComposerProps> = ({
  onOpenCreate,
  userInitials = 'SB',
}) => {
  return (
    <section className="pub-composer-card" aria-label="Créer une publication">
      {/* 1. Ligne principale : Avatar initiales 'SB' + Champ de texte arrondi */}
      <div className="pub-composer-top">
        <div className="pub-composer-avatar-circle" title="Votre profil">
          <span>{userInitials}</span>
        </div>
        <button
          type="button"
          className="pub-composer-trigger-btn"
          onClick={() => onOpenCreate('text')}
          aria-label="Que souhaitez-vous partager ?"
        >
          <span>Que souhaitez-vous partager ?</span>
        </button>
      </div>

      {/* 2. Ligne des actions rapides + Bouton Publier */}
      <div className="pub-composer-actions-bar">
        <div className="pub-composer-quick-formats">
          <button
            type="button"
            className="pub-composer-format-btn"
            onClick={() => onOpenCreate('image')}
            title="Ajouter une image"
          >
            <span className="pub-composer-format-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
            </span>
            <span className="pub-composer-format-text">Image</span>
          </button>

          <button
            type="button"
            className="pub-composer-format-btn"
            onClick={() => onOpenCreate('video')}
            title="Ajouter une vidéo"
          >
            <span className="pub-composer-format-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/>
                <rect x="2" y="6" width="14" height="12" rx="2"/>
              </svg>
            </span>
            <span className="pub-composer-format-text">Vidéo</span>
          </button>

          <button
            type="button"
            className="pub-composer-format-btn"
            onClick={() => onOpenCreate('resource')}
            title="Partager un document ou cours"
          >
            <span className="pub-composer-format-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
                <path d="M8 7h6"/>
                <path d="M8 11h8"/>
              </svg>
            </span>
            <span className="pub-composer-format-text">Ressource</span>
          </button>

          <button
            type="button"
            className="pub-composer-format-btn"
            onClick={() => onOpenCreate('text')}
            title="Écrire un texte"
          >
            <span className="pub-composer-format-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 7 4 4 20 4 20 7"/>
                <line x1="9" y1="20" x2="15" y2="20"/>
                <line x1="12" y1="4" x2="12" y2="20"/>
              </svg>
            </span>
            <span className="pub-composer-format-text">Texte</span>
          </button>
        </div>

        <button
          type="button"
          className="pub-composer-publish-btn"
          onClick={() => onOpenCreate('text')}
        >
          <span>Publier</span>
        </button>
      </div>
    </section>
  );
};
