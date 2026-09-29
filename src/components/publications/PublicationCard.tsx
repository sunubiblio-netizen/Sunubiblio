'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PublicationItem } from '@/types/publication';
import { SocialActions } from '@/components/social/SocialActions';

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
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

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
      {/* 1. En-tête : Avatar, Nom, Badge Professionnel, Date, Visibilité et Menu ... */}
      <div className="pub-card-header">
        <div className="pub-card-author-info">
          <div className="pub-author-avatar-wrap">
            <Image
              src={publication.authorAvatar || '/avatar_mamadou.jpg'}
              alt={publication.authorName}
              width={46}
              height={46}
              className="pub-author-avatar-img"
            />
          </div>
          <div className="pub-author-meta">
            <div className="pub-author-name-row">
              <h3 className="pub-author-name">{publication.authorName}</h3>

              {/* Badge professionnel si disponible */}
              {publication.authorBadge && (
                <span className="pub-badge-pro" title="Statut vérifié">
                  {publication.authorBadge}
                </span>
              )}

              {publication.visibility === 'abonnes' && (
                <span className="pub-badge-visibility pub-badge-sub" title="Réservé aux abonnés">
                  ⭐ Abonnés
                </span>
              )}
              {publication.visibility === 'prive' && (
                <span className="pub-badge-visibility pub-badge-private" title="Publication privée">
                  🔒 Privé
                </span>
              )}
            </div>
            <div className="pub-author-subtitle">
              <span>{publication.authorRole}</span>
              <span className="pub-dot-separator">•</span>
              <time dateTime={publication.createdAt}>{publication.timeAgo}</time>
            </div>
          </div>
        </div>

        {/* Menu d'options ... */}
        <div className="pub-card-more-wrap">
          <button
            type="button"
            className="pub-card-more-btn"
            onClick={() => setShowMoreMenu((prev) => !prev)}
            aria-label="Options supplémentaires de la publication"
            aria-expanded={showMoreMenu}
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
                <span>↗</span> Copier le lien
              </button>
              <button
                type="button"
                className="pub-more-dropdown-item"
                onClick={() => {
                  onSave(publication.id);
                  setShowMoreMenu(false);
                }}
              >
                <span>🔖</span> {publication.isSaved ? 'Retirer des favoris' : 'Enregistrer'}
              </button>
              <button
                type="button"
                className="pub-more-dropdown-item text-muted"
                onClick={() => setShowMoreMenu(false)}
              >
                <span>👁️</span> Masquer cette publication
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Contenu texte */}
      <div className="pub-card-content">
        <p className="pub-text-body">{publication.content}</p>
      </div>

      {/* 3. Média : Images (simples ou multiples) ou Vidéo */}
      {mediaList.length > 0 && (
        <div className="pub-card-media">
          {publication.format === 'video' ? (
            <div className="pub-video-container">
              {isVideoPlaying ? (
                <div className="pub-video-active-box">
                  <video
                    src={mediaList[0].url}
                    controls
                    autoPlay
                    className="pub-video-element"
                  >
                    Votre navigateur ne supporte pas la balise vidéo.
                  </video>
                  <button
                    type="button"
                    className="pub-video-close-btn"
                    onClick={() => setIsVideoPlaying(false)}
                  >
                    Fermer la vidéo
                  </button>
                </div>
              ) : (
                <div
                  className="pub-video-poster"
                  onClick={() => setIsVideoPlaying(true)}
                  role="button"
                  tabIndex={0}
                  aria-label="Lancer la vidéo"
                >
                  <img
                    src={mediaList[0].thumbnailUrl || mediaList[0].url}
                    alt={mediaList[0].caption || 'Aperçu vidéo'}
                    className="pub-media-img"
                  />
                  <div className="pub-video-play-overlay">
                    <span className="pub-play-circle" aria-hidden="true">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </span>
                    {mediaList[0].duration && (
                      <span className="pub-video-duration">{mediaList[0].duration}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Affichage Image(s) : simple ou grille */
            <div className={`pub-image-grid pub-grid-${Math.min(mediaList.length, 4)}`}>
              {mediaList.map((m, idx) => (
                <div key={m.id || idx} className="pub-image-item-wrap">
                  <img
                    src={m.url}
                    alt={m.caption || `Image ${idx + 1}`}
                    className="pub-media-img"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Ressource / document attaché si présent */}
      {publication.sharedResource && (
        <div className="pub-shared-resource-box">
          <div className="pub-resource-icon-wrap" aria-hidden="true">
            {publication.sharedResource.type === 'concours' ? '🏛️' :
             publication.sharedResource.type === 'livre' ? '📚' :
             publication.sharedResource.type === 'exercice' ? '📝' : '📄'}
          </div>
          <div className="pub-resource-details">
            <div className="pub-resource-header-row">
              <span className="pub-resource-type-pill">
                {publication.sharedResource.badge || publication.sharedResource.type.toUpperCase()}
              </span>
              {publication.sharedResource.subject && (
                <span className="pub-resource-subject">
                  {publication.sharedResource.subject}
                </span>
              )}
            </div>
            <h4 className="pub-resource-title">{publication.sharedResource.title}</h4>
            <Link
              href={publication.sharedResource.href}
              className="pub-resource-cta-link"
            >
              Consulter la ressource →
            </Link>
          </div>
        </div>
      )}

      {/* 5. Barre d'actions compacte standardisée : ❤️ 56   💬 50   ↗ 12 ................. 🔖 */}
      <SocialActions
        likesCount={publication.likesCount}
        commentsCount={
          publication.comments && publication.comments.length > 0
            ? publication.comments.length
            : publication.commentsCount || 0
        }
        sharesCount={publication.sharesCount || 0}
        isLiked={publication.isLiked}
        isSaved={publication.isSaved}
        isCommentsActive={showComments}
        onLike={() => onLike(publication.id)}
        onComment={() => setShowComments((prev) => !prev)}
        onShare={() => onShare(publication)}
        onSave={() => onSave(publication.id)}
      />

      {/* 8. Toggle et liste des commentaires */}
      {comments.length > 0 && (
        <button
          type="button"
          className="insta-view-comments-btn"
          onClick={() => setShowComments((prev) => !prev)}
        >
          {showComments
            ? 'Masquer les commentaires'
            : `Afficher les ${comments.length} commentaire${comments.length > 1 ? 's' : ''}`}
        </button>
      )}

      {/* 9. Formulaire d'ajout de commentaire inline instantané */}
      <form onSubmit={handleCommentSubmit} className="insta-comment-inline-form">
        <input
          type="text"
          className="insta-comment-inline-input"
          placeholder="Ajouter un commentaire..."
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
        />
        {newCommentText.trim().length > 0 && (
          <button type="submit" className="insta-comment-inline-submit">
            Publier
          </button>
        )}
      </form>

      {/* Liste déroulée des commentaires si showComments */}
      {showComments && (
        <div className="pub-comments-section" aria-label="Commentaires de la publication">
          <div className="pub-comments-list">
            {comments.map((comm) => (
              <div key={comm.id} className="pub-comment-item">
                <div className="pub-comment-avatar-wrap">
                  <Image
                    src={comm.authorAvatar || '/avatar_mamadou.jpg'}
                    alt={comm.authorName}
                    width={30}
                    height={30}
                    className="pub-comment-avatar"
                  />
                </div>
                <div className="pub-comment-bubble">
                  <div className="pub-comment-top">
                    <strong className="pub-comment-author">{comm.authorName}</strong>
                    <span className="pub-comment-time">{comm.timeAgo}</span>
                  </div>
                  <p className="pub-comment-text">{comm.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
