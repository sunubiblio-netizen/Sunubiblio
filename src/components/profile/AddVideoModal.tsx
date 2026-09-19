'use client';

import React, { useState, useEffect } from 'react';
import { ProfileVideo, VideoCategory } from '@/types/profile';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVideo: (video: ProfileVideo) => void;
}

export const AddVideoModal: React.FC<AddVideoModalProps> = ({
  isOpen,
  onClose,
  onAddVideo,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<VideoCategory>('Cours');
  const [duration, setDuration] = useState('10:00');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Verrouillage absolu de l'arrière-plan
  useLockBodyScroll(isOpen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setTimeout(() => {
      const newVideo: ProfileVideo = {
        id: `vid-user-${Date.now()}`,
        title: title.trim(),
        description: description.trim() || 'Vidéo éducative partagée par l’enseignant sur Sunubiblio.',
        duration: duration || '08:30',
        category,
        viewsCount: 1,
        likesCount: 0,
        commentsCount: 0,
        sharesCount: 0,
        thumbnailUrl: '/vid_math.jpg',
        authorName: 'Mamadou Diop',
        authorAvatar: '/avatar_mamadou.jpg',
        timeAgo: 'À l’instant',
      };
      onAddVideo(newVideo);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setTitle('');
        setDescription('');
        onClose();
      }, 1200);
    }, 800);
  };

  return (
    <div
      className="video-player-modal-backdrop"
      onClick={onClose}
      onTouchMove={(e) => { if (e.target === e.currentTarget) e.preventDefault(); }}
    >
      <div
        className="add-video-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="add-video-modal-header">
          <div className="add-video-header-title">
            <span className="add-video-icon">📹</span>
            <h3>Ajouter une vidéo éducative</h3>
          </div>
          <button type="button" className="video-player-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {success ? (
          <div className="add-video-success-banner">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <p>Votre vidéo a été publiée avec succès sur votre profil !</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="add-video-form">
            <div className="form-group-item">
              <label className="form-label-txt">Titre de la vidéo *</label>
              <input
                type="text"
                required
                placeholder="Ex: Théorème de Pythagore appliqué aux concours..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input-field"
              />
            </div>

            <div className="form-row-two-cols">
              <div className="form-group-item">
                <label className="form-label-txt">Catégorie</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as VideoCategory)}
                  className="form-select-field"
                >
                  <option value="Cours">Cours</option>
                  <option value="Conseils">Conseils</option>
                  <option value="Exercices">Exercices</option>
                  <option value="Présentation">Présentation</option>
                  <option value="Technologie">Technologie</option>
                  <option value="Motivation">Motivation</option>
                </select>
              </div>

              <div className="form-group-item">
                <label className="form-label-txt">Durée estimée</label>
                <input
                  type="text"
                  placeholder="Ex: 12:45"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="form-input-field"
                />
              </div>
            </div>

            <div className="form-group-item">
              <label className="form-label-txt">Description courte</label>
              <textarea
                rows={3}
                placeholder="Expliquez brièvement les notions abordées dans cette vidéo..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-textarea-field"
              />
            </div>

            <div className="add-video-modal-actions">
              <button
                type="button"
                className="btn-cancel-modal"
                onClick={onClose}
                disabled={loading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn-submit-video"
                disabled={loading || !title.trim()}
              >
                {loading ? 'Publication...' : 'Publier la vidéo'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
