'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  CommunityActivityPost,
  FeedFilterChip,
  FeedSortOption,
} from '@/types/community';
import { SocialActions } from '@/components/social/SocialActions';
import {
  CreateCommunityPostModal,
  CommunityPostFormat,
  CreateCommunityPostInput,
} from './CreateCommunityPostModal';

interface CommunityFeedViewProps {
  posts: CommunityActivityPost[];
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onCreatePost: (
    content: string,
    type: 'publication' | 'ressource' | 'image' | 'video' | 'question',
    options?: {
      mediaUrl?: string;
      videoThumbnailUrl?: string;
      videoDuration?: string;
      sharedResource?: {
        title: string;
        type: 'cours' | 'concours' | 'livre' | 'fiche' | 'exercice';
        metaText?: string;
        thumbnailUrl?: string;
        href: string;
      };
      locationTag?: string;
    }
  ) => void;
}

export const CommunityFeedView: React.FC<CommunityFeedViewProps> = ({
  posts,
  onToggleLike,
  onAddComment,
  onCreatePost,
}) => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postModalFormat, setPostModalFormat] = useState<CommunityPostFormat>('publication');

  const [filterChip, setFilterChip] = useState<FeedFilterChip>('tout');
  const [sortOption, setSortOption] = useState<FeedSortOption>('recent');
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({
    'post-feed-1': true,
  });
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [activeVideoPlayer, setActiveVideoPlayer] = useState<string | null>(null);
  const [shareToast, setShareToast] = useState<string | null>(null);

  const handleOpenModal = (format: CommunityPostFormat = 'publication') => {
    setPostModalFormat(format);
    setIsPostModalOpen(true);
  };

  const handleModalSubmit = (data: CreateCommunityPostInput) => {
    onCreatePost(data.content, data.format, {
      mediaUrl: data.mediaUrl,
      videoThumbnailUrl: data.videoThumbnailUrl,
      videoDuration: data.videoDuration,
      sharedResource: data.sharedResource,
      locationTag: data.locationTag,
    });
    setShareToast('Publication partagée avec succès dans la communauté !');
    setTimeout(() => setShareToast(null), 3000);
  };

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCommentSubmit = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    onAddComment(postId, text.trim());
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const handleShare = (post: CommunityActivityPost) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareToast('Lien de la publication copié dans le presse-papiers !');
      setTimeout(() => setShareToast(null), 3000);
    }
  };

  const [savedPostIds, setSavedPostIds] = useState<Record<string, boolean>>({});

  const handleToggleSave = (postId: string) => {
    setSavedPostIds((prev) => {
      const isCurrentlySaved = !!prev[postId];
      const next = { ...prev, [postId]: !isCurrentlySaved };
      setShareToast(
        !isCurrentlySaved
          ? 'Publication enregistrée dans vos favoris !'
          : 'Publication retirée des favoris'
      );
      setTimeout(() => setShareToast(null), 3000);
      return next;
    });
  };

  // Filtrage des publications
  const filteredPosts = posts.filter((post) => {
    if (filterChip === 'tout') return true;
    if (filterChip === 'publications') return post.type === 'publication' || post.type === 'question';
    if (filterChip === 'images') return post.type === 'image';
    if (filterChip === 'videos') return post.type === 'video';
    if (filterChip === 'ressources') return post.type === 'ressource';
    return true;
  });

  // Tri des publications
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortOption === 'populaire') {
      return (b.likesCount + b.commentsCount) - (a.likesCount + a.commentsCount);
    }
    return 0; // Défaut récent
  });

  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu de tri au clic extérieur
  useEffect(() => {
    if (!isSortOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSortOpen]);

  return (
    <div className="communaute-center-column">
      {/* Toast notification de partage */}
      {shareToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#0f172a',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: 999999,
            fontSize: '13px',
            fontWeight: '600',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          ✅ {shareToast}
        </div>
      )}

      {/* 1. Boîte de création rapide communautaire compacte */}
      <div className="communaute-composer-card">
        <div className="communaute-composer-top">
          <div className="composer-user-avatar">SB</div>
          <button
            type="button"
            className="composer-trigger-button"
            onClick={() => handleOpenModal('publication')}
            aria-label="Que souhaitez-vous partager avec la communauté ?"
          >
            <span>Que souhaitez-vous partager avec la communauté ?</span>
          </button>
        </div>

        <div className="communaute-composer-bottom">
          <div className="composer-actions-group">
            <button
              type="button"
              className="composer-attach-btn"
              onClick={() => handleOpenModal('image')}
              title="Ajouter une photo ou prendre une photo en direct"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              <span>Image</span>
            </button>

            <button
              type="button"
              className="composer-attach-btn"
              onClick={() => handleOpenModal('video')}
              title="Ajouter une vidéo ou filmer en direct"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="6 3 20 12 6 21 6 3" />
              </svg>
              <span>Vidéo</span>
            </button>

            <button
              type="button"
              className="composer-attach-btn"
              onClick={() => handleOpenModal('ressource')}
              title="Partager un cours ou document"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span>Ressource</span>
            </button>
          </div>

          <button
            type="button"
            className="composer-publish-btn"
            onClick={() => handleOpenModal('publication')}
          >
            <span>Publier</span>
          </button>
        </div>
      </div>

      {/* 2. Barre d'outils unifiée : Filtres rapides & Menu de tri harmonisé style /profil */}
      <div className="communaute-toolbar-row">
        {/* Pilules de filtres défilables */}
        <div className="communaute-filter-chips" role="tablist">
          {([
            { id: 'tout', label: 'Tout' },
            { id: 'ressources', label: '📚 Ressources' },
            { id: 'publications', label: '💬 Questions' },
            { id: 'images', label: '🖼️ Images' },
            { id: 'videos', label: '🎬 Vidéos' },
          ] as { id: FeedFilterChip; label: string }[]).map((chip) => (
            <button
              key={chip.id}
              type="button"
              className={`communaute-chip ${filterChip === chip.id ? 'active' : ''}`}
              onClick={() => setFilterChip(chip.id)}
              role="tab"
              aria-selected={filterChip === chip.id}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Menu déroulant de tri haut de gamme avec popover (identique à /profil) */}
        <div className="communaute-sort-dropdown-wrap" ref={sortMenuRef}>
          <button
            type="button"
            className="communaute-sort-pill-trigger"
            onClick={() => setIsSortOpen((prev) => !prev)}
            aria-expanded={isSortOpen}
            aria-label="Trier les publications"
          >
            <span className="sort-pill-icon">⇅</span>
            <span className="sort-pill-label">
              {sortOption === 'recent' && 'Plus récent'}
              {sortOption === 'populaire' && 'Plus populaire'}
              {sortOption === 'pertinent' && 'Pertinent'}
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className={`sort-pill-chevron ${isSortOpen ? 'rotated' : ''}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {isSortOpen && (
            <div className="communaute-sort-menu-panel" role="menu">
              {[
                { value: 'recent', label: 'Plus récent', icon: '⇅' },
                { value: 'populaire', label: 'Plus populaire', icon: '❤️' },
                { value: 'pertinent', label: 'Plus pertinent', icon: '⭐' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`sort-menu-item ${sortOption === opt.value ? 'active' : ''}`}
                  onClick={() => {
                    setSortOption(opt.value as FeedSortOption);
                    setIsSortOpen(false);
                  }}
                  role="menuitem"
                >
                  <span className="sort-item-icon">{opt.icon}</span>
                  <span className="sort-item-text">{opt.label}</span>
                  {sortOption === opt.value && (
                    <svg className="sort-check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Liste des cartes d'activité */}
      <div className="communaute-feed-list">
        {sortedPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
            <p>Aucune publication ne correspond à ce filtre.</p>
          </div>
        ) : (
          sortedPosts.map((post) => {
            const isCommentsOpen = !!expandedComments[post.id];
            const badgeClass =
              post.authorBadge?.toLowerCase().includes('enseignant')
                ? 'enseignant'
                : post.authorBadge?.toLowerCase().includes('étudiant')
                ? 'etudiante'
                : '';

            return (
              <article key={post.id} className="feed-activity-card">
                {/* En-tête auteur */}
                <div className="feed-card-header">
                  <div className="feed-card-author-left">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="feed-author-avatar-img"
                    />
                    <div className="feed-author-meta">
                      <div className="feed-author-name-row">
                        <span className="feed-author-name">{post.authorName}</span>
                        {post.authorBadge && (
                          <span className={`feed-role-badge ${badgeClass}`}>
                            {post.authorBadge}
                          </span>
                        )}
                      </div>
                      <span className="feed-card-time-location">
                        {post.timeAgo} • {post.locationTag}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="feed-card-options-btn"
                    title="Options"
                    aria-label="Options de la publication"
                  >
                    •••
                  </button>
                </div>

                {/* Corps de texte */}
                <p className="feed-card-body-text">{post.content}</p>

                {/* Pièce jointe / Ressource rattachée */}
                {post.sharedResource && (
                  <Link href={post.sharedResource.href} className="feed-shared-resource-box">
                    <img
                      src={post.sharedResource.thumbnailUrl || '/vid_math.jpg'}
                      alt={post.sharedResource.title}
                      className="feed-resource-thumb"
                    />
                    <div className="feed-resource-details">
                      <span className="feed-resource-pill">Ressource</span>
                      <h4 className="feed-resource-title">{post.sharedResource.title}</h4>
                      {post.sharedResource.metaText && (
                        <span className="feed-resource-meta">
                          {post.sharedResource.metaText}
                        </span>
                      )}
                    </div>
                  </Link>
                )}

                {/* Image rattachée */}
                {post.type === 'image' && post.mediaUrl && (
                  <div className="feed-shared-image-box">
                    <img
                      src={post.mediaUrl}
                      alt="Image partagée"
                      className="feed-shared-img"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Vidéo rattachée */}
                {post.type === 'video' && post.mediaUrl && (
                  <div className="feed-shared-video-box">
                    {activeVideoPlayer === post.id ? (
                      <div className="feed-video-player-container">
                        <video src={post.mediaUrl} controls autoPlay />
                      </div>
                    ) : (
                      <div
                        className="feed-video-thumb-overlay"
                        onClick={() => setActiveVideoPlayer(post.id)}
                      >
                        <img
                          src={post.videoThumbnailUrl || '/vid_bac.jpg'}
                          alt="Miniature vidéo"
                        />
                        <div className="feed-video-play-btn-circle" aria-label="Lire la vidéo">
                          ▶
                        </div>
                      </div>
                    )}
                    <div className="feed-video-meta-bar">
                      <span className="feed-video-title">
                        {post.content.length > 50 ? `${post.content.slice(0, 50)}...` : post.content || 'Vidéo explicative'}
                      </span>
                      <span className="feed-video-duration">
                        {post.videoDuration || 'Vidéo communautaire'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Barre d'actions standardisée Sunubiblio : ❤️ 56   💬 50   ↗ 12                         🔖 */}
                <SocialActions
                  likesCount={post.likesCount}
                  commentsCount={post.commentsCount}
                  sharesCount={post.sharesCount || 0}
                  isLiked={post.isLiked}
                  isSaved={savedPostIds[post.id] || false}
                  isCommentsActive={isCommentsOpen}
                  onLike={() => onToggleLike(post.id)}
                  onComment={() => toggleComments(post.id)}
                  onShare={() => handleShare(post)}
                  onSave={() => handleToggleSave(post.id)}
                />

                {/* Volet de commentaires */}
                {isCommentsOpen && (
                  <div className="feed-comments-drawer">
                    <div className="feed-comments-list">
                      {(post.comments || []).map((comm) => (
                        <div key={comm.id} className="feed-comment-bubble">
                          <img
                            src={comm.authorAvatar}
                            alt={comm.authorName}
                            className="feed-comment-avatar"
                          />
                          <div className="feed-comment-content-box">
                            <div className="feed-comment-author-line">
                              <span className="feed-comment-author-name">{comm.authorName}</span>
                              <span className="feed-comment-time">{comm.timeAgo}</span>
                            </div>
                            <p style={{ margin: 0 }}>{comm.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Saisie d'un nouveau commentaire */}
                    <div className="feed-comment-input-row">
                      <input
                        type="text"
                        placeholder="Écrire une réponse bienveillante..."
                        value={commentInputs[post.id] || ''}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCommentSubmit(post.id);
                        }}
                      />
                      <button
                        type="button"
                        className="feed-comment-send-btn"
                        onClick={() => handleCommentSubmit(post.id)}
                      >
                        Envoyer
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {/* Modale de création communautaire unifiée & caméra directe */}
      <CreateCommunityPostModal
        isOpen={isPostModalOpen}
        initialFormat={postModalFormat}
        onClose={() => setIsPostModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};
