'use client';

import React, { useState, useEffect } from 'react';
import { ProfileResource } from '@/types/profile';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddResource: (resource: ProfileResource) => void;
}

export const AddResourceModal: React.FC<AddResourceModalProps> = ({
  isOpen,
  onClose,
  onAddResource,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'Cours' | 'Exercices' | 'Livre' | 'Document' | 'QCM'>('Cours');
  const [subject, setSubject] = useState('Mathématiques');
  const [level, setLevel] = useState('Terminale S');
  const [isPremium, setIsPremium] = useState(false);
  const [pagesCount, setPagesCount] = useState(12);
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
    if (!title.trim()) return;

    setLoading(true);
    setTimeout(() => {
      const newRes: ProfileResource = {
        id: `res-user-${Date.now()}`,
        title: title.trim(),
        type,
        subject,
        level,
        isPremium,
        viewsCount: 1,
        downloadCount: 0,
        fileFormat: 'PDF',
        pagesCount: Number(pagesCount) || 10,
        href: '/bibliotheque',
      };
      onAddResource(newRes);
      setLoading(false);
      setTitle('');
      onClose();
    }, 600);
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
            <span className="add-video-icon">📚</span>
            <h3>Ajouter une ressource pédagogique</h3>
          </div>
          <button type="button" className="video-player-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-video-form">
          <div className="form-group-item">
            <label className="form-label-txt">Titre de la ressource *</label>
            <input
              type="text"
              required
              placeholder="Ex: Fiche Méthode : Probabilités conditionnelles..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input-field"
            />
          </div>

          <div className="form-row-two-cols">
            <div className="form-group-item">
              <label className="form-label-txt">Type de document</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="form-select-field"
              >
                <option value="Cours">Cours</option>
                <option value="Exercices">Exercices corrigés</option>
                <option value="Livre">Livre / Manuel</option>
                <option value="Document">Fiche / Document</option>
                <option value="QCM">QCM d’entraînement</option>
              </select>
            </div>

            <div className="form-group-item">
              <label className="form-label-txt">Matière</label>
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
              <label className="form-label-txt">Niveau scolaire</label>
              <input
                type="text"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="form-input-field"
              />
            </div>

            <div className="form-group-item">
              <label className="form-label-txt">Nombre de pages</label>
              <input
                type="number"
                min={1}
                max={999}
                value={pagesCount}
                onChange={(e) => setPagesCount(Number(e.target.value))}
                className="form-input-field"
              />
            </div>
          </div>

          <div className="form-group-item">
            <label className="form-label-txt" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isPremium}
                onChange={(e) => setIsPremium(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#6366f1' }}
              />
              <span>Ressource réservée aux abonnés Gold / Premium</span>
            </label>
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
              {loading ? 'Ajout...' : 'Ajouter la ressource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
