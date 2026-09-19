'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ProfilePost } from '@/types/profile';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (newPost: ProfilePost) => void;
  authorName: string;
  authorAvatar: string;
}

interface ImageUploadItem {
  id: string;
  url: string;
  name: string;
  size: number;
  type: string;
  caption: string;
}

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 Mo
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
  authorName,
  authorAvatar,
}) => {
  const [content, setContent] = useState('');
  const [groupTag, setGroupTag] = useState('Terminale S1 / S2 — Révisions Bac');
  const [images, setImages] = useState<ImageUploadItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replaceTargetId, setReplaceTargetId] = useState<string | null>(null);

  // Verrouillage absolu de l'arrière-plan
  useLockBodyScroll(isOpen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  // Traitement des fichiers sélectionnés
  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMsg(null);

    const availableSlots = 6 - images.length;
    if (files.length > availableSlots) {
      setErrorMsg(`Vous ne pouvez ajouter que ${availableSlots} image(s) supplémentaire(s) (limite max : 6).`);
      return;
    }

    Array.from(files).forEach((file) => {
      // 1. Contrôle du format
      if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
        setErrorMsg(`Le fichier "${file.name}" n’est pas une image supportée. Formats autorisés : JPG, PNG, WebP, GIF.`);
        return;
      }

      // 2. Contrôle de la taille
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        setErrorMsg(`L'image "${file.name}" (${sizeMb} Mo) dépasse la limite autorisée de 5 Mo.`);
        return;
      }

      // 3. Lecture en dataURL
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          const newItem: ImageUploadItem = {
            id: `upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            url: dataUrl,
            name: file.name,
            size: file.size,
            type: file.type,
            caption: '',
          };
          setImages((prev) => [...prev, newItem]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleUpdateCaption = (id: string, caption: string) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, caption } : img))
    );
  };

  const handleTriggerReplace = (id: string) => {
    setReplaceTargetId(id);
    if (replaceInputRef.current) {
      replaceInputRef.current.click();
    }
  };

  const handleReplaceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !replaceTargetId) return;

    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      setErrorMsg(`Format d'image non autorisé (${file.type}).`);
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setErrorMsg(`L'image dépasse la limite de 5 Mo.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (dataUrl) {
        setImages((prev) =>
          prev.map((img) =>
            img.id === replaceTargetId
              ? {
                  ...img,
                  url: dataUrl,
                  name: file.name,
                  size: file.size,
                  type: file.type,
                }
              : img
          )
        );
      }
    };
    reader.readAsDataURL(file);

    if (replaceInputRef.current) replaceInputRef.current.value = '';
    setReplaceTargetId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setErrorMsg('Veuillez renseigner une description pour votre publication.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      // Appel de l'API de validation serveur
      const response = await fetch('/api/publications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          groupTag,
          images: images.map((img) => ({
            id: img.id,
            url: img.url,
            caption: img.caption,
            name: img.name,
            size: img.size,
            type: img.type,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de la validation serveur.');
      }

      // Succès
      onPostCreated(data.post);
      setContent('');
      setImages([]);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur inattendue.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return `${Math.round(bytes / 1024)} Ko`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  };

  return (
    <div
      className="video-player-modal-backdrop"
      onClick={onClose}
      onTouchMove={(e) => { if (e.target === e.currentTarget) e.preventDefault(); }}
    >
      <div
        className="create-post-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* En-tête de la modale */}
        <div className="create-post-modal-header">
          <div className="create-post-modal-title-cluster">
            <span className="create-post-modal-badge-icon">✍️</span>
            <div>
              <h3 className="create-post-modal-heading">Créer une publication</h3>
              <p className="create-post-modal-sub">Partagez vos réflexions, exercices ou fiches illustrées</p>
            </div>
          </div>
          <button
            type="button"
            className="video-player-close-btn"
            onClick={onClose}
            disabled={loading}
          >
            ✕
          </button>
        </div>

        {/* Message d'erreur */}
        {errorMsg && (
          <div className="create-post-error-alert" role="alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-post-modal-form">
          {/* Info Auteur & Audience */}
          <div className="post-modal-author-row">
            <Image
              src={authorAvatar}
              alt={authorName}
              width={42}
              height={42}
              className="post-modal-avatar"
            />
            <div className="post-modal-author-meta">
              <strong className="post-modal-author-name">{authorName}</strong>
              <div className="post-modal-audience-select-wrap">
                <select
                  value={groupTag}
                  onChange={(e) => setGroupTag(e.target.value)}
                  className="post-modal-audience-select"
                >
                  <option value="Terminale S1 / S2 — Révisions Bac">📐 Terminale S1/S2 — Révisions Bac</option>
                  <option value="Prépa Concours FASTEF">🎓 Prépa Concours FASTEF</option>
                  <option value="Internat & Études Médicales UCAD">🩺 Études Médicales UCAD</option>
                  <option value="Communauté Sunubiblio">🌍 Tout public (Communauté)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Zone de texte de la publication */}
          <div className="post-modal-textarea-container">
            <textarea
              rows={4}
              placeholder="Que souhaitez-vous partager avec vos apprenants et collègues ? (cours, astuces, questions...)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="post-modal-main-textarea"
              maxLength={2500}
            />
            <span className="post-modal-char-counter">{content.length} / 2500</span>
          </div>

          {/* Zone d'aperçu des images ajoutées */}
          {images.length > 0 && (
            <div className="post-modal-images-preview-section">
              <div className="images-preview-header">
                <span className="images-count-label">
                  🖼️ {images.length} image{images.length > 1 ? 's' : ''} ajoutée{images.length > 1 ? 's' : ''} (max 6)
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-add-more-photos"
                  disabled={images.length >= 6}
                >
                  + Ajouter une autre photo
                </button>
              </div>

              <div className="images-preview-grid">
                {images.map((img, idx) => (
                  <div key={img.id} className="image-preview-card">
                    <div className="image-preview-thumbnail-wrap">
                      <img
                        src={img.url}
                        alt={img.name}
                        className="image-preview-thumbnail"
                      />
                      <div className="image-preview-overlay-actions">
                        <button
                          type="button"
                          onClick={() => handleTriggerReplace(img.id)}
                          className="btn-img-action replace"
                          title="Remplacer cette image"
                        >
                          🔄
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.id)}
                          className="btn-img-action delete"
                          title="Supprimer cette image"
                        >
                          ✕
                        </button>
                      </div>
                      <span className="image-preview-size-tag">
                        {formatFileSize(img.size)}
                      </span>
                    </div>

                    {/* Champ de légende pour cette image */}
                    <div className="image-caption-input-wrap">
                      <input
                        type="text"
                        placeholder={`Légende image #${idx + 1}...`}
                        value={img.caption}
                        onChange={(e) => handleUpdateCaption(img.id, e.target.value)}
                        className="image-caption-input"
                        maxLength={250}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Zone de Dépôt / Ajout de Fichiers (si aucune image ou pour en ajouter plus) */}
          {images.length === 0 && (
            <div
              className={`post-modal-dropzone ${isDragOver ? 'drag-over' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
            >
              <div className="dropzone-icon">📷</div>
              <div className="dropzone-texts">
                <strong>Glissez-déposez des photos ici ou cliquez pour parcourir</strong>
                <span>Formats JPG, PNG, WebP, GIF • 5 Mo max par image • Jusqu’à 6 photos</span>
              </div>
            </div>
          )}

          {/* Inputs de fichiers cachés */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          <input
            ref={replaceInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleReplaceFileChange}
            style={{ display: 'none' }}
          />

          {/* Boutons d'actions du bas */}
          <div className="create-post-modal-footer">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-quick-add-photo-bottom"
              title="Ajouter des images"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              <span className="btn-add-photos-label-desktop">{images.length > 0 ? 'Ajouter d’autres photos' : 'Ajouter des photos'}</span>
              <span className="btn-add-photos-label-mobile">Photos</span>
            </button>

            <div className="modal-submit-buttons-cluster">
              <button
                type="button"
                onClick={onClose}
                className="btn-cancel-modal"
                disabled={loading}
              >
                Annuler
              </button>

              <button
                type="submit"
                className="btn-submit-publication"
                disabled={loading || !content.trim()}
              >
                {loading ? 'Validation & Publication...' : 'Publier'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
