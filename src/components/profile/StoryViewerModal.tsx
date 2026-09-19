'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProfileStoryItem } from '@/types/profile';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

interface StoryViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  stories: ProfileStoryItem[];
  initialIndex?: number;
  onDeleteStory?: (storyId: string) => void;
  onOpenContent?: (story: ProfileStoryItem) => void;
}

const STORY_DURATION_MS = 6000; // 6 secondes par story

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  isOpen,
  onClose,
  stories,
  initialIndex = 0,
  onDeleteStory,
  onOpenContent,
}) => {
  useLockBodyScroll(isOpen);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0); // 0 à 100
  const [isPaused, setIsPaused] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Synchroniser l'index à l'ouverture
  useEffect(() => {
    if (isOpen) {
      const idx = Math.min(Math.max(0, initialIndex), Math.max(0, stories.length - 1));
      setCurrentIndex(idx);
      setProgress(0);
      setIsPaused(false);
    }
  }, [isOpen, initialIndex, stories.length]);

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  // Clavier (Flèche Gauche, Flèche Droite, Échap)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  // Progression automatique
  useEffect(() => {
    if (!isOpen || isPaused || stories.length === 0) return;

    const stepMs = 50;
    const increment = (stepMs / STORY_DURATION_MS) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isOpen, isPaused, currentIndex, handleNext, stories.length]);

  if (!isOpen || stories.length === 0) return null;

  const currentStory = stories[currentIndex] || stories[0];

  // Calcul du temps restant avant expiration (24h)
  const calculateRemainingTime = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return 'Expirée';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getPrivacyLabel = (privacy: string) => {
    switch (privacy) {
      case 'abonnes':
        return '👥 Abonnés';
      case 'prive':
        return '🔒 Privé';
      default:
        return '🌐 Public';
    }
  };

  return (
    <div
      className="video-player-modal-backdrop story-viewer-backdrop"
      onClick={onClose}
      onTouchMove={(e) => { if (e.target === e.currentTarget) e.preventDefault(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Visionneuse de story"
    >
      <div
        className="story-viewer-frame-container"
        onClick={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Navigation Tactile Gauche & Droite */}
        <div
          className="story-touch-nav-zone left"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          title="Story précédente"
        />
        <div
          className="story-touch-nav-zone right"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          title="Story suivante"
        />

        {/* Boutons Flèches Desktop */}
        {currentIndex > 0 && (
          <button
            type="button"
            className="story-nav-desktop-arrow prev"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Story précédente"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {currentIndex < stories.length - 1 && (
          <button
            type="button"
            className="story-nav-desktop-arrow next"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Story suivante"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}

        {/* Cadre vertical 9:16 de la story */}
        <div className="story-viewer-screen">
          {/* Barres de progression segments */}
          <div className="story-viewer-segments-row">
            {stories.map((story, i) => (
              <div key={story.id} className="story-segment-track">
                <div
                  className="story-segment-fill"
                  style={{
                    width:
                      i < currentIndex
                        ? '100%'
                        : i === currentIndex
                        ? `${progress}%`
                        : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Barre haute de la story (Auteur, Expire dans, Confidentialité, Fermer) */}
          <div className="story-viewer-top-bar">
            <div className="story-viewer-author-meta">
              <Image
                src={currentStory.authorAvatar}
                alt={currentStory.authorName}
                width={36}
                height={36}
                className="story-viewer-avatar"
              />
              <div className="story-viewer-author-texts">
                <div className="story-viewer-name-row">
                  <span className="story-author-name">{currentStory.authorName}</span>
                  <span className="story-expiration-countdown">
                    ⏱️ {calculateRemainingTime(currentStory.expiresAt)}
                  </span>
                </div>
                <span className="story-privacy-badge">
                  {getPrivacyLabel(currentStory.privacy)}
                </span>
              </div>
            </div>

            <div className="story-viewer-actions-cluster">
              {onDeleteStory && (
                <button
                  type="button"
                  className="story-btn-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Supprimer cette story ?')) {
                      onDeleteStory(currentStory.id);
                    }
                  }}
                  title="Supprimer cette story"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              )}

              <button
                type="button"
                className="story-viewer-close-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                aria-label="Fermer la story"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Zone de contenu immersif */}
          <div className="story-viewer-body-content">
            {/* 1. Image */}
            {currentStory.contentType === 'image' && (
              <div className="story-viewer-image-layout">
                {currentStory.payload.mediaUrl && (
                  <img
                    src={currentStory.payload.mediaUrl}
                    alt={currentStory.payload.title}
                    className="story-viewer-main-img"
                  />
                )}
                {currentStory.payload.badge && (
                  <span className="story-viewer-tag">{currentStory.payload.badge}</span>
                )}
                <h3 className="story-viewer-title-overlay">{currentStory.payload.title}</h3>
              </div>
            )}

            {/* 2. Vidéo */}
            {currentStory.contentType === 'video' && (
              <div className="story-viewer-video-layout">
                {currentStory.payload.mediaUrl && (
                  <img
                    src={currentStory.payload.mediaUrl}
                    alt={currentStory.payload.title}
                    className="story-viewer-video-bg-thumb"
                  />
                )}
                <div className="story-viewer-play-center">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="#6366f1">
                    <polygon points="6 3 20 12 6 21 6 3" />
                  </svg>
                </div>
                <div className="story-viewer-video-info">
                  {currentStory.payload.badge && (
                    <span className="story-viewer-tag">{currentStory.payload.badge}</span>
                  )}
                  <h3 className="story-viewer-title-overlay">{currentStory.payload.title}</h3>
                  {currentStory.payload.metaText && (
                    <span className="story-viewer-duration">Durée : {currentStory.payload.metaText}</span>
                  )}
                </div>
              </div>
            )}

            {/* 3. Publication */}
            {currentStory.contentType === 'publication' && (
              <div className="story-viewer-publication-layout">
                <div className="story-viewer-pub-card">
                  <div className="story-pub-header-row">
                    <span className="story-pub-icon">📝</span>
                    <span className="story-pub-meta-title">Publication Sunubiblio</span>
                  </div>
                  <p className="story-viewer-pub-text">
                    « {currentStory.payload.description || currentStory.payload.title} »
                  </p>
                  {currentStory.payload.mediaUrl && (
                    <div className="story-viewer-pub-img-wrap">
                      <img src={currentStory.payload.mediaUrl} alt="Illustration publication" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 4. Ressource */}
            {currentStory.contentType === 'ressource' && (
              <div className="story-viewer-resource-layout">
                <div className="story-viewer-res-card">
                  <div className="story-viewer-res-icon-wrap">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                      <path d="M8 7h6" />
                      <path d="M8 11h8" />
                    </svg>
                  </div>
                  <div className="story-res-pills-row">
                    <span className="story-res-format-pill">{currentStory.payload.badge || 'PDF'}</span>
                    {currentStory.payload.metaText && (
                      <span className="story-res-grade-pill">{currentStory.payload.metaText}</span>
                    )}
                  </div>
                  <h3 className="story-viewer-res-title">{currentStory.payload.title}</h3>
                  {currentStory.payload.subtitle && (
                    <p className="story-viewer-res-subtitle">{currentStory.payload.subtitle}</p>
                  )}
                </div>
              </div>
            )}

            {/* Légende personnalisée flottante si présente */}
            {currentStory.caption && (
              <div className="story-viewer-floating-caption">
                <p>{currentStory.caption}</p>
              </div>
            )}
          </div>

          {/* Pied interactif : redirection directe vers le contenu source */}
          <div className="story-viewer-bottom-action-bar">
            {onOpenContent ? (
              <button
                type="button"
                className="btn-story-direct-content"
                onClick={() => {
                  onClose();
                  onOpenContent(currentStory);
                }}
              >
                <span>Accéder au contenu complet</span>
                <span className="direct-content-arrow">→</span>
              </button>
            ) : currentStory.payload.sharedHref ? (
              <Link
                href={currentStory.payload.sharedHref}
                className="btn-story-direct-content"
                onClick={onClose}
              >
                <span>Accéder au contenu complet</span>
                <span className="direct-content-arrow">→</span>
              </Link>
            ) : (
              <button
                type="button"
                className="btn-story-direct-content"
                onClick={onClose}
              >
                <span>Voir sur le profil</span>
                <span className="direct-content-arrow">→</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
