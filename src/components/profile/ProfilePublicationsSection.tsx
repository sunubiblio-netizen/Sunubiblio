'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProfilePost, ProfilePostImage, StoryTargetPayload } from '@/types/profile';
import { CreatePostModal } from './CreatePostModal';
import { ImageLightboxModal } from './ImageLightboxModal';
import { SocialActions } from '@/components/social/SocialActions';

interface ProfilePublicationsSectionProps {
  initialPosts: ProfilePost[];
  authorName: string;
  authorAvatar: string;
  onAddToStory?: (target: StoryTargetPayload) => void;
}

export const ProfilePublicationsSection: React.FC<ProfilePublicationsSectionProps> = ({
  initialPosts,
  authorName,
  authorAvatar,
  onAddToStory,
}) => {
  const [posts, setPosts] = useState<ProfilePost[]>(initialPosts);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeLightboxImage, setActiveLightboxImage] = useState<ProfilePostImage | null>(null);

  const handlePostCreated = (newPost: ProfilePost) => {
    setPosts([newPost, ...posts]);
  };

  const [savedPostIds, setSavedPostIds] = useState<Record<string, boolean>>({});

  const handleToggleSave = (postId: string) => {
    setSavedPostIds((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likesCount: isLiked ? p.likesCount + 1 : p.likesCount - 1,
          };
        }
        return p;
      })
    );
  };

  return (
    <section className="profile-publications-section" aria-label="Publications">
      {/* 1. Barre d'en-tête avec bouton « + Créer une publication » */}
      <div className="profile-section-header-bar">
        <div className="profile-section-title-cluster">
          <div className="section-title-icon-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              <path d="M8 7h6" />
              <path d="M8 11h8" />
            </svg>
          </div>
          <div className="section-title-text-group">
            <h2 className="section-main-heading">Publications & Actualités</h2>
            <p className="section-sub-heading">
              Partagez vos conseils méthodologiques, questions et fiches illustrées.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-add-publication-action"
          aria-label="Créer une publication"
          title="Créer une publication"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="btn-action-text-desktop">Créer une publication</span>
        </button>
      </div>

      {/* 2. Boîte de déclenchement rapide */}
      <div className="profile-quick-trigger-card" onClick={() => setIsCreateModalOpen(true)}>
        <Image
          src={authorAvatar}
          alt={authorName}
          width={40}
          height={40}
          className="quick-trigger-avatar"
        />
        <div className="quick-trigger-fake-input">
          <span>Que souhaitez-vous partager aujourd’hui ? (images, conseils, cours...)</span>
        </div>
        <button type="button" className="quick-trigger-media-btn" title="Ajouter des photos">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        </button>
      </div>

      {/* 3. Fil des publications */}
      {posts.length === 0 ? (
        <div className="profile-empty-tab-state">
          <div className="empty-state-icon">📝</div>
          <h4>Aucune publication pour le moment</h4>
          <p>Partagez votre première publication, astuce ou fiche illustrée avec la communauté.</p>
          <button
            type="button"
            className="btn-empty-reset"
            onClick={() => setIsCreateModalOpen(true)}
          >
            + Créer une publication
          </button>
        </div>
      ) : (
        <div className="profile-posts-feed">
          {posts.map((post) => (
            <article key={post.id} className="profile-post-card">
            {/* Header du post */}
            <div className="post-card-header">
              <Image
                src={post.authorAvatar}
                alt={post.authorName}
                width={44}
                height={44}
                className="post-author-avatar"
              />
              <div className="post-author-meta">
                <div className="post-author-title-row">
                  <h3 className="post-author-name">{post.authorName}</h3>
                  {post.groupTag && (
                    <span className="post-group-badge">{post.groupTag}</span>
                  )}
                </div>
                <div className="post-author-subtitle">
                  <span>{post.authorGrade}</span>
                  <span className="post-meta-separator">•</span>
                  <span>{post.timeAgo}</span>
                </div>
              </div>
            </div>

            {/* Corps du post */}
            <div className="post-card-body">
              <p className="post-text-content">{post.content}</p>

              {/* Rendu des images publiées avec légendes */}
              {post.images && post.images.length > 0 && (
                <div className="post-images-attachment-container">
                  {post.images.length === 1 ? (
                    // Une seule image grand format
                    <div
                      className="post-single-image-item"
                      onClick={() => setActiveLightboxImage(post.images![0])}
                    >
                      <div className="post-image-thumb-wrapper">
                        <img
                          src={post.images[0].url}
                          alt={post.images[0].caption || post.images[0].name || 'Image'}
                          className="post-image-element single"
                        />
                        <div className="post-image-zoom-hint">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            <line x1="11" y1="8" x2="11" y2="14" />
                            <line x1="8" y1="11" x2="14" y2="11" />
                          </svg>
                        </div>
                      </div>
                      {post.images[0].caption && (
                        <p className="post-image-caption-text">
                          <span className="caption-pin">💬</span> {post.images[0].caption}
                        </p>
                      )}
                    </div>
                  ) : post.images.length === 2 ? (
                    // Deux images côte à côte
                    <div className="post-two-images-grid">
                      {post.images.map((img) => (
                        <div
                          key={img.id}
                          className="post-grid-image-item"
                          onClick={() => setActiveLightboxImage(img)}
                        >
                          <div className="post-image-thumb-wrapper">
                            <img
                              src={img.url}
                              alt={img.caption || img.name || 'Image'}
                              className="post-image-element"
                            />
                            <div className="post-image-zoom-hint">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                              </svg>
                            </div>
                          </div>
                          {img.caption && (
                            <p className="post-image-caption-text">
                              <span className="caption-pin">💬</span> {img.caption}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Trois images ou plus en mosaïque
                    <div className="post-mosaic-images-grid">
                      {post.images.map((img) => (
                        <div
                          key={img.id}
                          className="post-mosaic-image-item"
                          onClick={() => setActiveLightboxImage(img)}
                        >
                          <div className="post-image-thumb-wrapper">
                            <img
                              src={img.url}
                              alt={img.caption || img.name || 'Image'}
                              className="post-image-element"
                            />
                            <div className="post-image-zoom-hint">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                              </svg>
                            </div>
                          </div>
                          {img.caption && (
                            <p className="post-image-caption-text">
                              <span className="caption-pin">💬</span> {img.caption}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Ressource partagée si présente */}
              {post.sharedResource && (
                <Link href={post.sharedResource.href} className="post-shared-resource-card">
                  <div className="shared-res-icon-box">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                      <path d="M8 7h6" />
                      <path d="M8 11h8" />
                    </svg>
                  </div>
                  <div className="shared-res-info">
                    <span className="shared-res-type-tag">
                      {post.sharedResource.type.toUpperCase()}
                    </span>
                    <h4 className="shared-res-title">{post.sharedResource.title}</h4>
                  </div>
                  <span className="shared-res-arrow">→</span>
                </Link>
              )}
            </div>

            {/* Actions du post standardisées : ❤️ 56   💬 50   ↗ 12                         🔖 */}
            <SocialActions
              likesCount={post.likesCount}
              commentsCount={post.commentsCount}
              sharesCount={post.sharesCount || 0}
              isLiked={post.isLiked}
              isSaved={savedPostIds[post.id] || false}
              onLike={() => handleToggleLike(post.id)}
              onComment={() => {}}
              onShare={() => {
                if (typeof navigator !== 'undefined' && navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Lien de la publication copié !');
                }
              }}
              onSave={() => handleToggleSave(post.id)}
              extraRightAction={
                onAddToStory ? (
                  <button
                    type="button"
                    className="social-action-btn"
                    onClick={() =>
                      onAddToStory({
                        contentType: 'publication',
                        contentId: post.id,
                        title: `Publication de ${post.authorName}`,
                        description: post.content,
                        mediaUrl: post.images && post.images.length > 0 ? post.images[0].url : undefined,
                        badge: post.groupTag || 'Conseil',
                        metaText: post.timeAgo,
                        authorName: post.authorName,
                        authorAvatar: post.authorAvatar,
                        sharedHref: '/profil',
                      })
                    }
                    title="Partager en story (24h)"
                    aria-label="Partager en story"
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
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="16" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                  </button>
                ) : null
              }
            />
          </article>
        ))}
        </div>
      )}

      {/* Modale de création de publication */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={handlePostCreated}
        authorName={authorName}
        authorAvatar={authorAvatar}
      />

      {/* Visionneuse d'image Lightbox */}
      <ImageLightboxModal
        image={activeLightboxImage}
        onClose={() => setActiveLightboxImage(null)}
      />
    </section>
  );
};
