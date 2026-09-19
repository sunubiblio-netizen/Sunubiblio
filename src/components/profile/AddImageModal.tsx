'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ProfileGalleryImage } from '@/types/profile';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

interface AddImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddImage: (newImage: ProfileGalleryImage) => void;
}

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 Mo
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

export const AddImageModal: React.FC<AddImageModalProps> = ({
  isOpen,
  onClose,
  onAddImage,
}) => {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState<'Schéma' | 'Fiche' | 'Tableau' | 'Exercice' | 'Autre'>('Schéma');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      setErrorMsg('Format non supporté. Utilisez JPG, PNG, WebP ou GIF.');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setErrorMsg('L’image dépasse la limite de 5 Mo.');
      return;
    }

    setErrorMsg(null);
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreviewUrl(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Le titre de l’image est obligatoire.');
      return;
    }
    if (!previewUrl) {
      setErrorMsg('Veuillez sélectionner une image.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const newImg: ProfileGalleryImage = {
        id: `img-user-${Date.now()}`,
        url: previewUrl,
        title: title.trim(),
        caption: caption.trim() || undefined,
        category,
        date: 'Aujourd’hui',
        viewsCount: 1,
        likesCount: 0,
        size: selectedFile?.size,
      };

      onAddImage(newImg);
      setLoading(false);
      setTitle('');
      setCaption('');
      setSelectedFile(null);
      setPreviewUrl(null);
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
            <span className="add-video-icon">📸</span>
            <h3>Ajouter une image à la galerie</h3>
          </div>
          <button type="button" className="video-player-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="create-post-error-alert">
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-video-form">
          {/* Sélection / Aperçu de l'image */}
          <div className="form-group-item">
            <label className="form-label-txt">Fichier image *</label>
            {previewUrl ? (
              <div className="image-preview-card" style={{ maxWidth: '280px' }}>
                <div className="image-preview-thumbnail-wrap">
                  <img src={previewUrl} alt="Aperçu" className="image-preview-thumbnail" />
                  <div className="image-preview-overlay-actions">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-img-action replace"
                      title="Changer d'image"
                    >
                      🔄
                    </button>
                    <button
                      type="button"
                      onClick={() => { setPreviewUrl(null); setSelectedFile(null); }}
                      className="btn-img-action delete"
                      title="Supprimer"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="post-modal-dropzone"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="dropzone-icon">🖼️</div>
                <div className="dropzone-texts">
                  <strong>Cliquez pour sélectionner une photo ou schéma</strong>
                  <span>JPG, PNG, WebP, GIF • 5 Mo max</span>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>

          <div className="form-row-two-cols">
            <div className="form-group-item">
              <label className="form-label-txt">Titre de l’image *</label>
              <input
                type="text"
                required
                placeholder="Ex: Formules de Taylor-Young..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input-field"
              />
            </div>

            <div className="form-group-item">
              <label className="form-label-txt">Catégorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="form-select-field"
              >
                <option value="Schéma">Schéma & Géométrie</option>
                <option value="Fiche">Fiche synthétique</option>
                <option value="Tableau">Tableau explicatif</option>
                <option value="Exercice">Exercice illustré</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>

          <div className="form-group-item">
            <label className="form-label-txt">Légende explicative (optionnel)</label>
            <textarea
              rows={2}
              placeholder="Expliquez brièvement ce que montre ce schéma ou cette fiche..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
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
              disabled={loading || !title.trim() || !previewUrl}
            >
              {loading ? 'Ajout...' : 'Ajouter à la galerie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
