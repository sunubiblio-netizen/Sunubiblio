'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { CameraCaptureModal, CameraCaptureResult } from '@/components/camera/CameraCaptureModal';

export type CommunityPostFormat = 'publication' | 'image' | 'video' | 'ressource';

export interface CreateCommunityPostInput {
  content: string;
  format: CommunityPostFormat;
  mediaUrl?: string;
  videoThumbnailUrl?: string;
  videoDuration?: string;
  sharedResource?: {
    title: string;
    type: 'cours' | 'concours' | 'livre' | 'fiche' | 'exercice';
    metaText?: string;
    thumbnailUrl?: string;
    href: string;
  };
  locationTag?: string;
}

interface CreateCommunityPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCommunityPostInput) => void;
  initialFormat?: CommunityPostFormat;
}

export const CreateCommunityPostModal: React.FC<CreateCommunityPostModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialFormat = 'publication',
}) => {
  useLockBodyScroll(isOpen);

  const [format, setFormat] = useState<CommunityPostFormat>(initialFormat);
  const [content, setContent] = useState('');
  const [locationTag, setLocationTag] = useState('Dans Discussion générale');

  // Médias
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [showImageUrlField, setShowImageUrlField] = useState(false);

  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [showVideoUrlField, setShowVideoUrlField] = useState(false);

  // Ressource
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceType, setResourceType] = useState<'cours' | 'concours' | 'livre' | 'fiche' | 'exercice'>('cours');
  const [resourceFileName, setResourceFileName] = useState<string | null>(null);

  // Caméra en direct
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState<'photo' | 'video'>('photo');

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFormat(initialFormat || 'publication');
    }
  }, [isOpen, initialFormat]);

  // Fermeture par touche Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Import Image par fichier
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
        setImageUrlInput('');
      };
      reader.readAsDataURL(file);
    }
  };

  // Import Vidéo par fichier
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      setVideoUrlInput('');
    }
  };

  // Import Document / Ressource
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResourceFileName(file.name);
      if (!resourceTitle.trim()) {
        const autoName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        setResourceTitle(autoName);
      }
    }
  };

  // Capture directe Caméra (Photo ou Vidéo)
  const handleCameraCapture = (result: CameraCaptureResult) => {
    if (result.type === 'photo') {
      setImagePreview(result.dataUrl);
      setFormat('image');
    } else {
      setVideoPreview(result.dataUrl);
      setFormat('video');
    }
    setIsCameraOpen(false);
  };

  const handleApplyImageUrl = () => {
    if (imageUrlInput.trim()) {
      setImagePreview(imageUrlInput.trim());
      setShowImageUrlField(false);
    }
  };

  const handleApplyVideoUrl = () => {
    if (videoUrlInput.trim()) {
      setVideoPreview(videoUrlInput.trim());
      setShowVideoUrlField(false);
    }
  };

  const canPublish =
    Boolean(content.trim()) ||
    Boolean(imagePreview) ||
    Boolean(videoPreview) ||
    Boolean(resourceTitle.trim() || resourceFileName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canPublish) return;

    let finalContent = content.trim();
    if (!finalContent) {
      if (format === 'ressource') {
        finalContent = `Partage de la ressource : ${resourceTitle || resourceFileName || 'Document d’étude'}`;
      } else if (format === 'image') {
        finalContent = 'Partage d’une photo avec la communauté.';
      } else if (format === 'video') {
        finalContent = 'Partage d’une vidéo explicative.';
      } else {
        finalContent = 'Nouvelle publication communautaire.';
      }
    }

    onSubmit({
      content: finalContent,
      format,
      locationTag,
      mediaUrl: format === 'image' ? (imagePreview || undefined) : format === 'video' ? (videoPreview || undefined) : undefined,
      videoThumbnailUrl: format === 'video' ? (videoPreview || '/vid_bac.jpg') : undefined,
      videoDuration: format === 'video' ? 'Vidéo communautaire' : undefined,
      sharedResource:
        format === 'ressource' && (resourceTitle.trim() || resourceFileName)
          ? {
              title: resourceTitle.trim() || resourceFileName || 'Document d’étude',
              type: resourceType,
              metaText: `${resourceType.toUpperCase()} • Partagé avec la communauté`,
              thumbnailUrl: '/vid_math.jpg',
              href: '/education',
            }
          : undefined,
    });

    // Réinitialisation
    setContent('');
    setImagePreview(null);
    setImageUrlInput('');
    setShowImageUrlField(false);
    setVideoPreview(null);
    setVideoUrlInput('');
    setShowVideoUrlField(false);
    setResourceTitle('');
    setResourceFileName(null);
    onClose();
  };

  return (
    <div
      className="pub-modal-floating-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="community-modal-title"
    >
      <div
        className="pub-modal-floating-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête épuré : Point violet + Titre + Bouton ✕ */}
        <div className="pub-modal-floating-header">
          <div className="pub-modal-header-left">
            <span className="pub-modal-dot-purple" aria-hidden="true" />
            <h2 id="community-modal-title" className="pub-modal-floating-title">
              {format === 'image'
                ? 'Partager une photo'
                : format === 'video'
                ? 'Partager une vidéo'
                : format === 'ressource'
                ? 'Partager une ressource'
                : 'Publier dans la communauté'}
            </h2>
          </div>
          <button
            type="button"
            className="pub-modal-floating-close-btn"
            onClick={onClose}
            aria-label="Fermer la boîte"
          >
            ✕
          </button>
        </div>

        {/* 4 Onglets Formats : Publication, Image, Vidéo, Ressource */}
        <div className="pub-modal-format-pills" role="tablist">
          {[
            { id: 'publication', label: 'Texte', icon: '📝' },
            { id: 'image', label: 'Image', icon: '🖼️' },
            { id: 'video', label: 'Vidéo', icon: '🎥' },
            { id: 'ressource', label: 'Ressource', icon: '📚' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              className={`pub-modal-format-pill ${format === item.id ? 'active' : ''}`}
              onClick={() => setFormat(item.id as CommunityPostFormat)}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Formulaire épuré */}
        <form onSubmit={handleSubmit} className="pub-modal-floating-body">
          {/* Zone de texte principale */}
          <div className="pub-modal-input-group">
            <textarea
              className="pub-modal-textarea"
              placeholder={
                format === 'image'
                  ? 'Ajoutez une légende pour cette image...'
                  : format === 'video'
                  ? 'Décrivez le contenu de cette vidéo explicative...'
                  : format === 'ressource'
                  ? 'Pourquoi recommandez-vous cette ressource aux membres ?'
                  : 'Que souhaitez-vous partager avec la communauté ?'
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              autoFocus
            />
          </div>

          {/* 1. MODULE IMAGE : Photo directe Caméra OU Fichier OU URL */}
          {format === 'image' && (
            <div className="pub-modal-media-slot">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />

              {imagePreview ? (
                <div className="pub-modal-preview-box">
                  <img src={imagePreview} alt="Aperçu photo" className="pub-modal-img-preview" />
                  <div className="pub-modal-preview-actions">
                    <button
                      type="button"
                      className="pub-modal-action-link"
                      onClick={() => {
                        setCameraMode('photo');
                        setIsCameraOpen(true);
                      }}
                    >
                      📸 Reprendre une photo
                    </button>
                    <span className="pub-dot-separator">·</span>
                    <button
                      type="button"
                      className="pub-modal-action-link"
                      onClick={() => imageInputRef.current?.click()}
                    >
                      📁 Choisir un fichier
                    </button>
                    <span className="pub-dot-separator">·</span>
                    <button
                      type="button"
                      className="pub-modal-remove-preview-btn"
                      onClick={() => setImagePreview(null)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pub-modal-upload-container">
                  {/* Option A : Prendre une photo directe */}
                  <button
                    type="button"
                    className="pub-modal-camera-trigger"
                    onClick={() => {
                      setCameraMode('photo');
                      setIsCameraOpen(true);
                    }}
                  >
                    <span className="pub-modal-camera-icon">📸</span>
                    <span className="pub-modal-camera-text">Prendre une photo en direct</span>
                  </button>

                  {/* Option B : Fichier local */}
                  <button
                    type="button"
                    className="pub-modal-upload-trigger"
                    onClick={() => imageInputRef.current?.click()}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                      <circle cx="9" cy="9" r="2"/>
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    </svg>
                    <span className="pub-modal-upload-main-text">Choisir une image depuis l'appareil</span>
                    <span className="pub-modal-upload-sub-text">PNG, JPG, WebP</span>
                  </button>

                  {/* Option C : URL */}
                  <div className="pub-modal-sub-option">
                    {!showImageUrlField ? (
                      <button
                        type="button"
                        className="pub-modal-link-btn"
                        onClick={() => setShowImageUrlField(true)}
                      >
                        🔗 Ou coller l'URL d'une image web
                      </button>
                    ) : (
                      <div className="pub-modal-url-input-wrap">
                        <input
                          type="url"
                          placeholder="https://exemple.com/image.jpg"
                          value={imageUrlInput}
                          onChange={(e) => setImageUrlInput(e.target.value)}
                          className="pub-modal-text-input"
                        />
                        <button
                          type="button"
                          className="pub-modal-url-apply-btn"
                          onClick={handleApplyImageUrl}
                        >
                          Valider
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. MODULE VIDÉO : Enregistrement direct Vidéo OU Fichier OU URL */}
          {format === 'video' && (
            <div className="pub-modal-media-slot">
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                style={{ display: 'none' }}
              />

              {videoPreview ? (
                <div className="pub-modal-preview-box">
                  <video src={videoPreview} controls className="pub-modal-vid-preview" />
                  <div className="pub-modal-preview-actions">
                    <button
                      type="button"
                      className="pub-modal-action-link"
                      onClick={() => {
                        setCameraMode('video');
                        setIsCameraOpen(true);
                      }}
                    >
                      🎥 Réenregistrer
                    </button>
                    <span className="pub-dot-separator">·</span>
                    <button
                      type="button"
                      className="pub-modal-action-link"
                      onClick={() => videoInputRef.current?.click()}
                    >
                      📁 Choisir un fichier
                    </button>
                    <span className="pub-dot-separator">·</span>
                    <button
                      type="button"
                      className="pub-modal-remove-preview-btn"
                      onClick={() => setVideoPreview(null)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pub-modal-upload-container">
                  {/* Option A : Enregistrer directement une vidéo */}
                  <button
                    type="button"
                    className="pub-modal-camera-trigger"
                    onClick={() => {
                      setCameraMode('video');
                      setIsCameraOpen(true);
                    }}
                  >
                    <span className="pub-modal-camera-icon">🎥</span>
                    <span className="pub-modal-camera-text">Enregistrer une vidéo en direct</span>
                  </button>

                  {/* Option B : Fichier local */}
                  <button
                    type="button"
                    className="pub-modal-upload-trigger"
                    onClick={() => videoInputRef.current?.click()}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2">
                      <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/>
                      <rect x="2" y="6" width="14" height="12" rx="2"/>
                    </svg>
                    <span className="pub-modal-upload-main-text">Choisir un fichier vidéo (MP4, WebM)</span>
                    <span className="pub-modal-upload-sub-text">Jusqu’à 100 Mo</span>
                  </button>

                  {/* Option C : URL */}
                  <div className="pub-modal-sub-option">
                    {!showVideoUrlField ? (
                      <button
                        type="button"
                        className="pub-modal-link-btn"
                        onClick={() => setShowVideoUrlField(true)}
                      >
                        🔗 Ou coller un lien vidéo
                      </button>
                    ) : (
                      <div className="pub-modal-url-input-wrap">
                        <input
                          type="url"
                          placeholder="https://exemple.com/video.mp4"
                          value={videoUrlInput}
                          onChange={(e) => setVideoUrlInput(e.target.value)}
                          className="pub-modal-text-input"
                        />
                        <button
                          type="button"
                          className="pub-modal-url-apply-btn"
                          onClick={handleApplyVideoUrl}
                        >
                          Valider
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. MODULE RESSOURCE : Document PDF/Word & Type */}
          {format === 'ressource' && (
            <div className="pub-modal-resource-slot">
              <input
                ref={documentInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.epub"
                onChange={handleDocumentChange}
                style={{ display: 'none' }}
              />

              <div className="pub-modal-field-row">
                <label className="pub-modal-field-label">Titre du document / cours :</label>
                <input
                  type="text"
                  className="pub-modal-text-input"
                  placeholder="Ex : Guide de révision Électrostatique Terminale"
                  value={resourceTitle}
                  onChange={(e) => setResourceTitle(e.target.value)}
                />
              </div>

              <div className="pub-modal-field-row">
                <label className="pub-modal-field-label">Type de document :</label>
                <select
                  className="pub-modal-select"
                  value={resourceType}
                  onChange={(e) => setResourceType(e.target.value as any)}
                >
                  <option value="cours">Cours & Synthèse</option>
                  <option value="exercice">Exercices & Corrigés</option>
                  <option value="concours">Concours & Annales</option>
                  <option value="fiche">Fiche méthode</option>
                  <option value="livre">Livre de référence</option>
                </select>
              </div>

              {resourceFileName ? (
                <div className="pub-modal-file-attached">
                  <div className="pub-modal-file-info">
                    <span className="pub-modal-file-icon">📄</span>
                    <span className="pub-modal-file-name">{resourceFileName}</span>
                  </div>
                  <button
                    type="button"
                    className="pub-modal-remove-file-btn"
                    onClick={() => {
                      setResourceFileName(null);
                      if (documentInputRef.current) documentInputRef.current.value = '';
                    }}
                  >
                    Changer
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="pub-modal-upload-trigger"
                  onClick={() => documentInputRef.current?.click()}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <span className="pub-modal-upload-main-text">Joindre un document (PDF, Word, EPUB)</span>
                </button>
              )}
            </div>
          )}

          {/* Espace communautaire de destination */}
          <div className="pub-modal-field-row">
            <label className="pub-modal-field-label">Lieu de publication :</label>
            <select
              className="pub-modal-select"
              value={locationTag}
              onChange={(e) => setLocationTag(e.target.value)}
            >
              <option value="Dans Discussion générale">Discussion générale</option>
              <option value="Dans Préparation Bac S1 2027">Préparation Bac S1 2027</option>
              <option value="Dans Club Mathématiques & Olympiades">Club Mathématiques & Olympiades</option>
              <option value="Dans Concours FASTEF / ENA">Concours FASTEF / ENA</option>
            </select>
          </div>

          {/* Pied de la modale flottante : Annuler & Publier */}
          <div className="pub-modal-floating-footer">
            <button
              type="button"
              className="pub-modal-btn-cancel"
              onClick={onClose}
            >
              Annuler
            </button>

            <button
              type="submit"
              className="pub-modal-btn-publish"
              disabled={!canPublish}
            >
              Publier
            </button>
          </div>
        </form>
      </div>

      {/* Caméra en direct : Photo ou Vidéo */}
      {isCameraOpen && (
        <CameraCaptureModal
          isOpen={isCameraOpen}
          initialMode={cameraMode}
          onClose={() => setIsCameraOpen(false)}
          onCapture={handleCameraCapture}
        />
      )}
    </div>
  );
};
