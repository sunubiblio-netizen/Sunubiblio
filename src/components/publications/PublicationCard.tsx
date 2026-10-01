'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PublicationItem } from '@/types/publication';

interface PublicationCardProps {
  publication: PublicationItem;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onAddComment: (id: string, text: string) => void;
  onShare: (publication: PublicationItem) => void;
}

export const PublicationCard: React.FC<PublicationCardProps> = ({
  publication,
  onLike,
  onSave,
  onAddComment,
  onShare,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    onAddComment(publication.id, newCommentText.trim());
    setNewCommentText('');
  };

  const comments = publication.comments || [];
  const mediaList = publication.media || [];

  return (
    <article className="pub-card" id={`publication-${publication.id}`}>
      {/* 1. En-tête : Avatar, Nom, Badge Professionnel, Date · Lieu, et Menu ... */}
      <div className="pub-card-header">
        <div className="pub-card-author-info">
          <div className="pub-author-avatar-wrap">
            <Image
              src={publication.authorAvatar || '/avatar_mamadou.jpg'}
              alt={publication.authorName}
              width={44}
              height={44}
              className="pub-author-avatar-img"
            />
          </div>
          <div className="pub-author-meta">
            <div className="pub-author-name-row">
              <h3 className="pub-author-name">{publication.authorName}</h3>

              {publication.authorBadge && (
                <span className="pub-badge-pill" title={publication.authorBadge}>
                  {publication.authorBadge}
                </span>
              )}
            </div>
            <div className="pub-author-subtitle">
              <span>{publication.timeAgo || 'Il y a 2 heures'}</span>
              <span className="pub-dot-separator">·</span>
              <span>{publication.authorRole}</span>
            </div>
          </div>
        </div>

        {/* Menu d'options ... */}
        <div className="pub-card-more-wrap">
          <button
            type="button"
            className="pub-card-more-btn"
            onClick={() => setShowMoreMenu((prev) => !prev)}
            aria-label="Options"
          >
            •••
          </button>
          {showMoreMenu && (
            <div className="pub-more-dropdown" onMouseLeave={() => setShowMoreMenu(false)}>
              <button
                type="button"
                className="pub-more-dropdown-item"
                onClick={() => {
                  onShare(publication);
                  setShowMoreMenu(false);
                }}
              >
                Partager
              </button>
              <button
                type="button"
                className="pub-more-dropdown-item"
                onClick={() => {
                  onSave(publication.id);
                  setShowMoreMenu(false);
                }}
              >
                {publication.isSaved ? 'Retirer des favoris' : 'Enregistrer'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Contenu texte */}
      <div className="pub-card-content">
        <p className="pub-text-body">{publication.content}</p>
      </div>

      {/* 3. Média Image ou Vidéo */}
      {mediaList.length > 0 && (
        <div className="pub-card-media">
          {mediaList[0].type === 'video' || publication.format === 'video' ? (
            <video
              src={mediaList[0].url}
              controls
              className="pub-media-video"
              playsInline
            />
          ) : (
            <img
              src={mediaList[0].url}
              alt={mediaList[0].caption || 'Aperçu'}
              className="pub-media-img"
              loading="lazy"
            />
          )}
        </div>
      )}

      {/* 4. Ressource partagée (comme Philosophie avec bouton Télécharger) */}
      {publication.sharedResource && (
        <div className="pub-resource-card">
          {publication.sharedResource.thumbnailUrl && (
            <div className="pub-resource-thumb-wrap">
              <img
                src={publication.sharedResource.thumbnailUrl}
                alt={publication.sharedResource.title}
                className="pub-resource-thumb-img"
              />
            </div>
          )}

          <div className="pub-resource-info">
            <h4 className="pub-resource-title">{publication.sharedResource.title}</h4>
            <div className="pub-resource-meta-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span>{publication.sharedResource.badge || 'PDF · 245 pages · 3,2 Mo'}</span>
            </div>
          </div>

          <a
            href={publication.sharedResource.href || '#'}
            className="pub-resource-download-btn"
            download
            onClick={(e) => {
              // Si pas de lien externe, simule un téléchargement sans bloquer l'interface
              if (!publication.sharedResource?.href || publication.sharedResource.href === '#') {
                e.preventDefault();
              }
            }}
            title={`Télécharger : ${publication.sharedResource.title}`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Télécharger</span>
          </a>
        </div>
      )}

      {/* 5. Barre d'actions : ❤️ 48   💬 12   🔗 Partager        🔖 Enregistrer */}
      <div className="pub-card-action-bar">
        <div className="pub-action-left">
          {/* Like */}
          <button
            type="button"
            className={`pub-action-btn ${publication.isLiked ? 'liked' : ''}`}
            onClick={() => onLike(publication.id)}
            aria-label="J'aime"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={publication.isLiked ? '#ef4444' : '#ef4444'}
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <span className="pub-action-count">{publication.likesCount}</span>
          </button>

          {/* Comment */}
          <button
            type="button"
            className="pub-action-btn"
            onClick={() => setShowComments((prev) => !prev)}
            aria-label="Commentaires"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
            </svg>
            <span className="pub-action-count">
              {comments.length > 0 ? comments.length : publication.commentsCount || 0}
            </span>
          </button>

          {/* Share */}
          <button
            type="button"
            className="pub-action-btn"
            onClick={() => onShare(publication)}
            aria-label="Partager"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            <span className="pub-action-label">Partager</span>
          </button>
        </div>

        {/* Save */}
        <div className="pub-action-right">
          <button
            type="button"
            className={`pub-action-btn ${publication.isSaved ? 'saved' : ''}`}
            onClick={() => onSave(publication.id)}
            aria-label="Enregistrer"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={publication.isSaved ? '#2563eb' : 'none'}
              stroke={publication.isSaved ? '#2563eb' : '#64748b'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
            </svg>
            <span className="pub-action-label">Enregistrer</span>
          </button>
        </div>
      </div>

      {/* Commentaires déroulants si ouvert */}
      {showComments && (
        <div className="pub-comments-section">
          {comments.length > 0 && (
            <div className="pub-comments-list">
              {comments.map((c) => (
                <div key={c.id} className="pub-comment-item">
                  <span className="pub-comment-author">{c.authorName} : </span>
                  <span className="pub-comment-text">{c.content}</span>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleCommentSubmit} className="pub-comment-input-form">
            <input
              type="text"
              placeholder="Écrire un commentaire..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="pub-comment-input"
            />
            <button type="submit" className="pub-comment-submit-btn">
              Envoyer
            </button>
          </form>
        </div>
      )}
    </article>
  );
};
