'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { StoryTargetPayload, StoryPrivacy, ProfileStoryItem } from '@/types/profile';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

interface AddToStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: StoryTargetPayload | null;
  authorName: string;
  authorAvatar: string;
  onPublishStory: (newStory: ProfileStoryItem) => void;
}

export const AddToStoryModal: React.FC<AddToStoryModalProps> = ({
  isOpen,
  onClose,
  target,
  authorName,
  authorAvatar,
  onPublishStory,
}) => {
  useLockBodyScroll(isOpen);

  const [caption, setCaption] = useState('');
  const [privacy, setPrivacy] = useState<StoryPrivacy>('public');
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Réinitialiser les champs à chaque ouverture
  useEffect(() => {
    if (isOpen) {
      setCaption('');
      setPrivacy('public');
      setIsPublishing(false);
      setShowSuccess(false);
    }
  }, [isOpen, target]);

  if (!isOpen || !target) return null;

  const handlePublish = () => {
    setIsPublishing(true);

    const now = Date.now();
    const expires = now + 24 * 3600 * 1000; // Exactement 24 heures

    const newStory: ProfileStoryItem = {
      id: `story-${now}-${Math.random().toString(36).slice(2, 6)}`,
      contentType: target.contentType,
      contentId: target.contentId,
      caption: caption.trim() || undefined,
      privacy,
      createdAt: new Date(now).toISOString(),
      expiresAt: new Date(expires).toISOString(),
      authorName: authorName || target.authorName,
      authorAvatar: authorAvatar || target.authorAvatar,
      payload: target,
    };

    setTimeout(() => {
      setIsPublishing(false);
      setShowSuccess(true);
      setTimeout(() => {
        onPublishStory(newStory);
        onClose();
      }, 700);
    }, 450);
  };

  const getContentTypeLabel = () => {
    switch (target.contentType) {
      case 'publication':
        return 'Publication';
      case 'image':
        return 'Image & Schéma';
      case 'video':
        return 'Vidéo de cours';
      case 'ressource':
        return 'Document & Ressource';
      default:
        return 'Contenu';
    }
  };

  return (
    <div
      className="video-player-modal-backdrop add-story-modal-backdrop"
      onClick={onClose}
      onTouchMove={(e) => { if (e.target === e.currentTarget) e.preventDefault(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Ajouter à la story"
    >
      <div
        className="add-story-modal-card"
        onClick={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        {/* En-tête de la modale */}
        <div className="add-story-modal-header">
          <div className="add-story-title-row">
            <div className="add-story-icon-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
              </svg>
            </div>
            <div>
              <h3 className="add-story-modal-title">Ajouter à la story</h3>
              <p className="add-story-modal-subtitle">
                Partagez cette {getContentTypeLabel().toLowerCase()} avec vos apprenants pendant 24h.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="video-player-close-btn"
            onClick={onClose}
            aria-label="Fermer la fenêtre de story"
            title="Fermer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Corps avec Aperçu 9:16 en direct */}
        <div className="add-story-modal-body">
          {/* Écran d'aperçu vertical type Story Instagram/WhatsApp */}
          <div className="story-preview-screen-wrapper">
            <div className="story-preview-screen">
              {/* Barre de progression story */}
              <div className="story-preview-progress-bar">
                <div className="story-preview-progress-segment active" />
                <div className="story-preview-progress-segment" />
              </div>

              {/* En-tête interne de la story */}
              <div className="story-preview-author-bar">
                <div className="story-author-info">
                  <Image
                    src={authorAvatar || target.authorAvatar}
                    alt={authorName || target.authorName}
                    width={28}
                    height={28}
                    className="story-preview-avatar"
                  />
                  <div className="story-preview-author-text">
                    <span className="story-preview-name">{authorName || target.authorName}</span>
                    <span className="story-preview-badge-pill">Story • 24h</span>
                  </div>
                </div>

                <div className="story-preview-privacy-tag">
                  {privacy === 'public' && '🌐 Public'}
                  {privacy === 'abonnes' && '👥 Abonnés'}
                  {privacy === 'prive' && '🔒 Privé'}
                </div>
              </div>

              {/* Contenu principal adapté au type */}
              <div className="story-preview-main-content">
                {target.contentType === 'image' && (
                  <div className="story-media-image-pane">
                    {target.mediaUrl && (
                      <img
                        src={target.mediaUrl}
                        alt={target.title}
                        className="story-full-media-img"
                      />
                    )}
                    {target.badge && (
                      <span className="story-media-badge">{target.badge}</span>
                    )}
                  </div>
                )}

                {target.contentType === 'video' && (
                  <div className="story-media-video-pane">
                    {target.mediaUrl && (
                      <img
                        src={target.mediaUrl}
                        alt={target.title}
                        className="story-video-thumb-img"
                      />
                    )}
                    <div className="story-video-play-overlay">
                      <div className="story-play-circle">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="#6366f1">
                          <polygon points="6 3 20 12 6 21 6 3" />
                        </svg>
                      </div>
                    </div>
                    {target.badge && (
                      <span className="story-video-category-badge">{target.badge}</span>
                    )}
                    {target.metaText && (
                      <span className="story-video-duration-badge">{target.metaText}</span>
                    )}
                  </div>
                )}

                {target.contentType === 'publication' && (
                  <div className="story-card-publication-pane">
                    <div className="story-pub-card">
                      <div className="story-pub-card-top">
                        <span className="story-pub-type-pill">📝 Publication partagée</span>
                        {target.badge && <span className="story-pub-tag">{target.badge}</span>}
                      </div>
                      <p className="story-pub-card-text">{target.description || target.title}</p>
                      {target.mediaUrl && (
                        <div className="story-pub-card-image-wrap">
                          <img src={target.mediaUrl} alt="Aperçu publication" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {target.contentType === 'ressource' && (
                  <div className="story-card-resource-pane">
                    <div className="story-res-card">
                      <div className="story-res-icon-circle">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                          <path d="M8 7h6" />
                          <path d="M8 11h8" />
                        </svg>
                      </div>
                      <div className="story-res-badges">
                        <span className="story-res-format">{target.badge || 'PDF'}</span>
                        {target.metaText && <span className="story-res-meta">{target.metaText}</span>}
                      </div>
                      <h4 className="story-res-title">{target.title}</h4>
                      {target.subtitle && <p className="story-res-sub">{target.subtitle}</p>}
                      <div className="story-res-call-btn">
                        <span>Consulter la ressource</span>
                        <span>→</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sticker de texte personnalisé en direct */}
                {caption.trim() && (
                  <div className="story-live-caption-sticker">
                    <p>{caption.trim()}</p>
                  </div>
                )}
              </div>

              {/* Pied de story avec indication expiration */}
              <div className="story-preview-footer">
                <span className="story-footer-swipe-hint">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                  Glisser pour voir le contenu
                </span>
              </div>
            </div>
          </div>

          {/* Formulaire de configuration */}
          <div className="story-controls-form">
            {/* Champ de légende optionnelle */}
            <div className="story-input-group">
              <label htmlFor="story-caption" className="story-form-label">
                <span>Message ou conseil (optionnel)</span>
                <span className="story-char-count">{caption.length}/120</span>
              </label>
              <input
                id="story-caption"
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value.slice(0, 120))}
                placeholder="Ex : À réviser pour le bac, très important !"
                className="story-caption-field"
                maxLength={120}
              />
            </div>

            {/* Sélecteur de confidentialité */}
            <div className="story-input-group">
              <label className="story-form-label">Confidentialité de la story</label>
              <div className="story-privacy-selector-row">
                <button
                  type="button"
                  className={`story-privacy-option-btn ${privacy === 'public' ? 'active' : ''}`}
                  onClick={() => setPrivacy('public')}
                >
                  <span className="privacy-option-icon">🌐</span>
                  <div className="privacy-option-texts">
                    <span className="privacy-option-title">Public</span>
                    <span className="privacy-option-desc">Tous les membres</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`story-privacy-option-btn ${privacy === 'abonnes' ? 'active' : ''}`}
                  onClick={() => setPrivacy('abonnes')}
                >
                  <span className="privacy-option-icon">👥</span>
                  <div className="privacy-option-texts">
                    <span className="privacy-option-title">Abonnés</span>
                    <span className="privacy-option-desc">Vos abonnés</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`story-privacy-option-btn ${privacy === 'prive' ? 'active' : ''}`}
                  onClick={() => setPrivacy('prive')}
                >
                  <span className="privacy-option-icon">🔒</span>
                  <div className="privacy-option-texts">
                    <span className="privacy-option-title">Privé</span>
                    <span className="privacy-option-desc">Moi seul</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Information sur l'expiration 24h */}
            <div className="story-expiration-notice-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>
                Cette story sera visible pendant <strong>24 heures</strong> puis expirera automatiquement.
              </span>
            </div>
          </div>
        </div>

        {/* Pied d'action de la modale */}
        <div className="add-story-modal-footer">
          <button
            type="button"
            className="btn-cancel-modal"
            onClick={onClose}
            disabled={isPublishing}
          >
            Annuler
          </button>

          <button
            type="button"
            className={`btn-publish-story-action ${showSuccess ? 'success' : ''}`}
            onClick={handlePublish}
            disabled={isPublishing || showSuccess}
          >
            {showSuccess ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Story publiée !</span>
              </>
            ) : isPublishing ? (
              <span>Publication...</span>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                </svg>
                <span>Partager dans ma story</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
