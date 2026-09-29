'use client';

import React from 'react';
import Image from 'next/image';
import { PublicationFormat } from '@/types/publication';

interface PublicationsComposerProps {
  onOpenCreate: (initialFormat?: PublicationFormat) => void;
  userAvatar?: string;
}

export const PublicationsComposer: React.FC<PublicationsComposerProps> = ({
  onOpenCreate,
  userAvatar = '/avatar_mamadou.jpg',
}) => {
  return (
    <section className="pub-composer-card" aria-label="Créer une publication">
      {/* 1. Ligne principale : Avatar + Déclencheur texte + Bouton (+) sur mobile */}
      <div className="pub-composer-top">
        <div className="pub-composer-avatar-wrap">
          <Image
            src={userAvatar}
            alt="Votre avatar"
            width={44}
            height={44}
            className="pub-composer-avatar"
          />
        </div>
        <button
          type="button"
          className="pub-composer-trigger-btn"
          onClick={() => onOpenCreate('text')}
          aria-label="Que souhaitez-vous partager ?"
        >
          <span>Que souhaitez-vous partager ?</span>
        </button>
        <button
          type="button"
          className="pub-composer-mobile-plus-btn"
          onClick={() => onOpenCreate('text')}
          aria-label="Créer une publication"
        >
          +
        </button>
      </div>

      {/* 2. Ligne des actions rapides + Bouton Publier (Desktop & Mobile) */}
      <div className="pub-composer-actions-bar">
        <div className="pub-composer-quick-formats">
          <button
            type="button"
            className="pub-composer-format-btn format-btn-image"
            onClick={() => onOpenCreate('image')}
            title="Ajouter une ou plusieurs images"
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
            className="pub-composer-format-btn format-btn-video"
            onClick={() => onOpenCreate('video')}
            title="Ajouter une vidéo de cours ou d'explication"
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
            className="pub-composer-format-btn format-btn-resource"
            onClick={() => onOpenCreate('resource')}
            title="Partager un cours, sujet ou document"
          >
            <span className="pub-composer-format-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
                <path d="M6 6h10"/>
                <path d="M6 10h10"/>
              </svg>
            </span>
            <span className="pub-composer-format-text">Ressource</span>
          </button>

          <button
            type="button"
            className="pub-composer-format-btn format-btn-text"
            onClick={() => onOpenCreate('text')}
            title="Écrire une publication texte"
          >
            <span className="pub-composer-format-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
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
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
          <span>Publier</span>
        </button>
      </div>
    </section>
  );
};
