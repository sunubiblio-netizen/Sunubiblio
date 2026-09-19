'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ProfileVideo } from '@/types/profile';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

interface VideoPlayerModalProps {
  video: ProfileVideo | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, onClose }) => {
  const [likesCount, setLikesCount] = useState<number>(video ? video.likesCount : 0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Verrouillage absolu de l'arrière-plan
  useLockBodyScroll(!!video);

  useEffect(() => {
    if (video) {
      setLikesCount(video.likesCount);
      setHasLiked(false);
      setIsPlaying(false);
    }
  }, [video]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (video) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [video, onClose]);

  if (!video) return null;

  const handleToggleLike = () => {
    setHasLiked((prev) => {
      const next = !prev;
      setLikesCount((c) => (next ? c + 1 : c - 1));
      return next;
    });
  };

  return (
    <div
      className="video-player-modal-backdrop"
      onClick={onClose}
      onTouchMove={(e) => { if (e.target === e.currentTarget) e.preventDefault(); }}
    >
      <div
        className="video-player-modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header de la modale */}
        <div className="video-player-modal-header">
          <div className="video-player-title-cluster">
            <span className="video-category-tag">{video.category}</span>
            <h3 className="video-player-modal-title">{video.title}</h3>
          </div>
          <button
            type="button"
            className="video-player-close-btn"
            onClick={onClose}
            aria-label="Fermer la vidéo"
          >
            ✕
          </button>
        </div>

        {/* Écran Vidéo Player */}
        <div className="video-player-screen-wrap">
          {video.videoUrl && isPlaying ? (
            <video
              src={video.videoUrl}
              controls
              autoPlay
              className="video-player-native-element"
            />
          ) : (
            <div className="video-player-poster-wrap">
              <Image
                src={video.thumbnailUrl}
                alt={video.title}
                fill
                className="video-player-poster-img"
                sizes="(max-width: 768px) 100vw, 800px"
              />
              <div className="video-player-play-overlay">
                <button
                  type="button"
                  onClick={() => setIsPlaying(true)}
                  className="video-big-play-btn"
                  aria-label="Lancer la lecture"
                >
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="#ffffff">
                    <polygon points="6 3 20 12 6 21 6 3" />
                  </svg>
                </button>
              </div>
              <span className="video-player-duration-badge">{video.duration}</span>
            </div>
          )}
        </div>

        {/* Détails & Métadonnées sous la vidéo */}
        <div className="video-player-details-bar">
          <div className="video-author-row">
            <Image
              src={video.authorAvatar}
              alt={video.authorName}
              width={40}
              height={40}
              className="video-author-mini-avatar"
            />
            <div className="video-author-texts">
              <strong className="video-author-name">{video.authorName}</strong>
              <span className="video-time-ago">{video.timeAgo} • Enseignant certifié</span>
            </div>
          </div>

          <div className="video-interactions-cluster">
            <button
              type="button"
              onClick={handleToggleLike}
              className={`video-interact-btn ${hasLiked ? 'liked' : ''}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={hasLiked ? '#ef4444' : 'none'} stroke={hasLiked ? '#ef4444' : 'currentColor'} strokeWidth="2">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              <span>{likesCount}</span>
            </button>

            <span className="video-stat-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>{video.viewsCount} vues</span>
            </span>

            <span className="video-stat-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>{video.commentsCount}</span>
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="video-player-description-box">
          <p>{video.description}</p>
        </div>
      </div>
    </div>
  );
};
