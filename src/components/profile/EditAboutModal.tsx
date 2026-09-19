'use client';

import React, { useState, useEffect } from 'react';
import { ProfileUser } from '@/types/profile';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

interface EditAboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: ProfileUser;
  onSave: (updatedUser: Partial<ProfileUser>) => void;
}

export const EditAboutModal: React.FC<EditAboutModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const [bio, setBio] = useState(user.bio);
  const [school, setSchool] = useState(user.school);
  const [subject, setSubject] = useState(user.subject);
  const [level, setLevel] = useState(user.level);
  const [city, setCity] = useState(user.city);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    setTimeout(() => {
      onSave({
        bio: bio.trim(),
        school: school.trim(),
        subject: subject.trim(),
        level: level.trim(),
        city: city.trim(),
      });
      setLoading(false);
      onClose();
    }, 500);
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
            <span className="add-video-icon">ℹ️</span>
            <h3>Modifier les informations du profil</h3>
          </div>
          <button type="button" className="video-player-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-video-form">
          <div className="form-group-item">
            <label className="form-label-txt">Bio & Présentation</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="form-textarea-field"
            />
          </div>

          <div className="form-row-two-cols">
            <div className="form-group-item">
              <label className="form-label-txt">Établissement / École</label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="form-input-field"
              />
            </div>

            <div className="form-group-item">
              <label className="form-label-txt">Matière principale</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="form-input-field"
              />
            </div>
          </div>

          <div className="form-row-two-cols">
            <div className="form-group-item">
              <label className="form-label-txt">Niveaux d'enseignement</label>
              <input
                type="text"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="form-input-field"
              />
            </div>

            <div className="form-group-item">
              <label className="form-label-txt">Ville & Région</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="form-input-field"
              />
            </div>
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
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
