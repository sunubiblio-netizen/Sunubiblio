'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { PublicationStory } from '@/types/publication';

interface PublicationStoryViewerProps {
  isOpen: boolean;
  stories: PublicationStory[];
  initialIndex: number;
  onClose: () => void;
  onStoryChange?: (index: number) => void;
}

export const PublicationStoryViewer: React.FC<PublicationStoryViewerProps> = ({
  isOpen,
  stories,
  initialIndex,
  onClose,
  onStoryChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setProgress(0);
  }, [initialIndex, isOpen]);

  const currentStory = stories[currentIndex];

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setProgress(0);
      onStoryChange?.(nextIdx);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose, onStoryChange]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      setProgress(0);
      onStoryChange?.(prevIdx);
    }
  }, [currentIndex, onStoryChange]);

  // Timer automatique de 6 secondes par story
  useEffect(() => {
    if (!isOpen || !currentStory) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 2; // 50 ticks ~ 5-6 secondes
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, currentIndex, currentStory, handleNext]);

  // Gestion des touches clavier
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  if (!isOpen || !currentStory) return null;

  // Calcul du temps restant avant expiration 24h
  const expiresDate = new Date(currentStory.expiresAt);
  const now = new Date();
  const hoursLeft = Math.max(1, Math.round((expiresDate.getTime() - now.getTime()) / (1000 * 3600)));

  return (
    <div className="story-viewer-overlay" onClick={onClose} role="dialog" aria-modal="true">
      {/* Bouton précédent desktop (visible uniquement sur grand écran) */}
      {currentIndex > 0 && (
        <button
          type="button"
          className="story-viewer-desktop-nav story-viewer-desktop-prev"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          aria-label="Story précédente"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* Conteneur principal de la Story */}
      <div className="story-viewer-container" onClick={(e) => e.stopPropagation()}>
        {/* Barres de progression pour chaque story */}
        <div className="story-viewer-progress-bars">
          {stories.map((s, idx) => {
            let widthPercent = 0;
            if (idx < currentIndex) widthPercent = 100;
            else if (idx === currentIndex) widthPercent = progress;

            return (
              <div key={s.id} className="story-progress-track">
                <div
                  className="story-progress-fill"
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* En-tête de la Story (Auteur + Expiration) */}
        <div className="story-viewer-header">
          <div className="story-viewer-author">
            <div className="story-viewer-avatar-wrap">
              <Image
                src={currentStory.authorAvatar || '/avatar_mamadou.jpg'}
                alt={currentStory.authorName}
                width={38}
                height={38}
                className="story-viewer-avatar"
              />
            </div>
            <div>
              <div className="story-viewer-name">{currentStory.authorName}</div>
              <div className="story-viewer-timer">Expire dans {hoursLeft} h</div>
            </div>
          </div>

          <button
            type="button"
            className="story-viewer-close-btn"
            onClick={onClose}
            aria-label="Fermer la story"
          >
            ✕
          </button>
        </div>

        {/* Contenu visuel */}
        <div className="story-viewer-media-wrapper">
          {currentStory.mediaUrl ? (
            <img
              src={currentStory.mediaUrl}
              alt={currentStory.caption || 'Story media'}
              className="story-viewer-image"
            />
          ) : (
            <div className="story-viewer-text-only">
              <p>{currentStory.caption}</p>
            </div>
          )}

          {/* Légende superposée */}
          {currentStory.caption && currentStory.mediaUrl && (
            <div className="story-viewer-caption-box">
              <p>{currentStory.caption}</p>
            </div>
          )}

          {/* Zones tactiles gauche/droite pour naviguer */}
          <button
            type="button"
            className="story-tap-zone story-tap-prev"
            onClick={handlePrev}
            aria-label="Story précédente"
          />
          <button
            type="button"
            className="story-tap-zone story-tap-next"
            onClick={handleNext}
            aria-label="Story suivante"
          />
        </div>
      </div>

      {/* Bouton suivant desktop (visible uniquement sur grand écran) */}
      {currentIndex < stories.length - 1 && (
        <button
          type="button"
          className="story-viewer-desktop-nav story-viewer-desktop-next"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          aria-label="Story suivante"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}
    </div>
  );
};
