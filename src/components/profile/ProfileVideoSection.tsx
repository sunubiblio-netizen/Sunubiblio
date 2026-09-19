'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ProfileVideo,
  VideoCategoryFilter,
  VideoSortOption,
  StoryTargetPayload,
} from '@/types/profile';
import { VideoPlayerModal } from './VideoPlayerModal';
import { AddVideoModal } from './AddVideoModal';

interface ProfileVideoSectionProps {
  featuredVideo: ProfileVideo;
  videos: ProfileVideo[];
  onAddToStory?: (target: StoryTargetPayload) => void;
}

export const ProfileVideoSection: React.FC<ProfileVideoSectionProps> = ({
  featuredVideo,
  videos: initialVideos,
  onAddToStory,
}) => {
  const [videosList, setVideosList] = useState<ProfileVideo[]>(initialVideos);
  const [selectedCategory, setSelectedCategory] = useState<VideoCategoryFilter>('tout');
  const [sortOption, setSortOption] = useState<VideoSortOption>('recent');
  const [activeVideoForPlayer, setActiveVideoForPlayer] = useState<ProfileVideo | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  const categories: { id: VideoCategoryFilter; label: string }[] = [
    { id: 'tout', label: 'Tout' },
    { id: 'cours', label: 'Cours' },
    { id: 'conseils', label: 'Conseils' },
    { id: 'exercices', label: 'Exercices' },
    { id: 'presentation', label: 'Présentation' },
  ];

  const handleAddVideo = (newVideo: ProfileVideo) => {
    setVideosList((prev) => [newVideo, ...prev]);
  };

  // Filtrage
  const filteredVideos = videosList.filter((v) => {
    if (selectedCategory === 'tout') return true;
    if (selectedCategory === 'cours') return v.category === 'Cours';
    if (selectedCategory === 'conseils') return v.category === 'Conseils';
    if (selectedCategory === 'exercices') return v.category === 'Exercices';
    if (selectedCategory === 'presentation') return v.category === 'Présentation';
    return true;
  });

  // Tri
  const sortedVideos = [...filteredVideos].sort((a, b) => {
    if (sortOption === 'populaire') return b.likesCount - a.likesCount;
    if (sortOption === 'vues') return b.viewsCount - a.viewsCount;
    return 0; // default recent
  });

  const displayedVideos = sortedVideos.slice(0, visibleCount);

  const formatViews = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace('.', ',') + 'K';
    }
    return num.toString();
  };

  return (
    <section className="profile-videos-section" aria-label="Section Vidéos">
      {/* En-tête de section avec titre et bouton Ajouter */}
      <div className="profile-section-header-bar">
        <div className="profile-section-title-cluster">
          <div className="section-title-icon-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
          </div>
          <div className="section-title-text-group">
            <h2 className="section-main-heading">Mes vidéos</h2>
            <p className="section-sub-heading">
              Partagez vos connaissances à travers des vidéos éducatives.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="btn-add-video-action"
          aria-label="Ajouter une vidéo"
          title="Ajouter une vidéo"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="btn-action-text-desktop">Ajouter une vidéo</span>
        </button>
      </div>

      {/* 1. Vidéo Vedette (Featured Video Card) */}
      {featuredVideo && (
        <div
          className="profile-featured-video-card"
          onClick={() => setActiveVideoForPlayer(featuredVideo)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') setActiveVideoForPlayer(featuredVideo); }}
        >
          <div className="featured-video-thumbnail-wrap">
            <Image
              src={featuredVideo.thumbnailUrl}
              alt={featuredVideo.title}
              fill
              className="featured-video-thumb-img"
              sizes="(max-width: 768px) 100vw, 420px"
            />
            <span className="video-badge-category">{featuredVideo.category}</span>
            <span className="video-badge-duration">{featuredVideo.duration}</span>
            
            <div className="video-play-center-btn">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#ffffff">
                <polygon points="6 3 20 12 6 21 6 3" />
              </svg>
            </div>
          </div>

          <div className="featured-video-content-pane">
            <h3 className="featured-video-title">{featuredVideo.title}</h3>
            <p className="featured-video-desc">{featuredVideo.description}</p>

            <div className="featured-video-author-line">
              <Image
                src={featuredVideo.authorAvatar}
                alt={featuredVideo.authorName}
                width={28}
                height={28}
                className="featured-author-avatar"
              />
              <div className="featured-author-texts">
                <span className="featured-author-name">{featuredVideo.authorName}</span>
                <span className="featured-author-dot">•</span>
                <span className="featured-author-time">{featuredVideo.timeAgo}</span>
              </div>
            </div>

            <div className="featured-video-stats-footer">
              <span className="feat-stat">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {formatViews(featuredVideo.viewsCount)}
              </span>

              <span className="feat-stat">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                {featuredVideo.likesCount}
              </span>

              <span className="feat-stat">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                {featuredVideo.commentsCount}
              </span>

              <button
                type="button"
                className="feat-share-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Lien de la vidéo copié !');
                  }
                }}
                title="Partager la vidéo"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </button>

              {onAddToStory && (
                <button
                  type="button"
                  className="feat-share-btn feat-story-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToStory({
                      contentType: 'video',
                      contentId: featuredVideo.id,
                      title: featuredVideo.title,
                      description: featuredVideo.description,
                      mediaUrl: featuredVideo.thumbnailUrl,
                      badge: featuredVideo.category,
                      metaText: featuredVideo.duration,
                      authorName: featuredVideo.authorName,
                      authorAvatar: featuredVideo.authorAvatar,
                      sharedHref: '/profil',
                    });
                  }}
                  title="Ajouter à la story (24h)"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                  </svg>
                  <span className="feat-story-text">Story</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Sous-section « Toutes les vidéos » & Filtres */}
      <div className="profile-all-videos-header">
        <div className="all-videos-title-and-sort-row">
          <div className="all-videos-title-group">
            <h3 className="all-videos-subtitle">Toutes les vidéos</h3>
            <span className="all-videos-count-badge">{filteredVideos.length}</span>
          </div>

          {/* Menu de tri */}
          <div className="video-sort-dropdown-wrap">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as VideoSortOption)}
              className="video-sort-select"
              aria-label="Trier les vidéos"
            >
              <option value="recent">⇅ Plus récent</option>
              <option value="populaire">❤️ Plus populaire</option>
              <option value="vues">👁️ Plus vues</option>
            </select>
          </div>
        </div>

        {/* Pilules de catégories défilables horizontalement */}
        <div className="video-category-pills-row">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`video-category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Grille des Vidéos (3 colonnes) */}
      {videosList.length === 0 ? (
        <div className="profile-empty-tab-state">
          <div className="empty-state-icon">🎬</div>
          <h4>Aucune vidéo publiée</h4>
          <p>Vous n’avez pas encore ajouté de vidéo éducative pour vos apprenants.</p>
          <button
            type="button"
            className="btn-empty-reset"
            onClick={() => setIsAddModalOpen(true)}
          >
            + Ajouter une vidéo
          </button>
        </div>
      ) : displayedVideos.length === 0 ? (
        <div className="profile-empty-tab-state">
          <div className="empty-state-icon">🎬</div>
          <h4>Aucune vidéo dans cette catégorie</h4>
          <p>L’enseignant n’a pas encore publié de vidéo correspondant à ce filtre.</p>
          <button
            type="button"
            className="btn-empty-reset"
            onClick={() => setSelectedCategory('tout')}
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="profile-video-grid-three-cols">
          {displayedVideos.map((vid) => (
            <div
              key={vid.id}
              className="video-card-item"
              onClick={() => setActiveVideoForPlayer(vid)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') setActiveVideoForPlayer(vid); }}
            >
              <div className="video-card-thumb-wrap">
                <Image
                  src={vid.thumbnailUrl}
                  alt={vid.title}
                  fill
                  className="video-card-img"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 260px"
                />
                <span className="video-badge-category">{vid.category}</span>
                <span className="video-badge-duration">{vid.duration}</span>
                <div className="video-card-hover-play">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff">
                    <polygon points="6 3 20 12 6 21 6 3" />
                  </svg>
                </div>
              </div>

              <div className="video-card-details">
                <h4 className="video-card-title">{vid.title}</h4>

                <div className="video-card-author-line">
                  <Image
                    src={vid.authorAvatar}
                    alt={vid.authorName}
                    width={20}
                    height={20}
                    className="video-card-author-avatar"
                  />
                  <span className="video-card-author-name">{vid.authorName}</span>
                </div>

                <div className="video-card-stats-row">
                  <span className="video-card-stat">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {formatViews(vid.viewsCount)}
                  </span>
                  <span className="video-card-stat">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                    {vid.likesCount}
                  </span>
                  <span className="video-card-stat">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    {vid.commentsCount}
                  </span>

                  {onAddToStory && (
                    <button
                      type="button"
                      className="video-card-stat video-card-story-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToStory({
                          contentType: 'video',
                          contentId: vid.id,
                          title: vid.title,
                          description: vid.description,
                          mediaUrl: vid.thumbnailUrl,
                          badge: vid.category,
                          metaText: vid.duration,
                          authorName: vid.authorName,
                          authorAvatar: vid.authorAvatar,
                          sharedHref: '/profil',
                        });
                      }}
                      title="Ajouter à la story (24h)"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                        <circle cx="12" cy="12" r="3" fill="currentColor" />
                      </svg>
                      <span>Story</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bouton Voir plus de vidéos si nécessaire */}
      {sortedVideos.length > visibleCount && (
        <div className="profile-load-more-row">
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + 6)}
            className="btn-view-more-videos"
          >
            <span>⌄ Voir plus de vidéos ⌄</span>
          </button>
        </div>
      )}

      {/* Modales */}
      <VideoPlayerModal
        video={activeVideoForPlayer}
        onClose={() => setActiveVideoForPlayer(null)}
      />

      <AddVideoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddVideo={handleAddVideo}
      />
    </section>
  );
};
