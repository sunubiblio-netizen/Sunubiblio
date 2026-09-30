'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import {
  PublicationFormat,
  PublicationVisibility,
  CreatePublicationInput,
} from '@/types/publication';
import { CameraCaptureModal, CameraCaptureResult } from '@/components/camera/CameraCaptureModal';

interface CreatePublicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePublicationInput) => void;
  initialFormat?: PublicationFormat;
}

const ESSENTIAL_CATEGORIES = [
  { value: 'general', label: '🌐 Général & Actualités' },
  { value: 'education', label: '🎓 Éducation & Cours' },
  { value: 'concours', label: '🏛️ Concours & Examens' },
  { value: 'sciences', label: '📐 Sciences & Mathématiques' },
  { value: 'lettres', label: '📖 Lettres & Philosophie' },
  { value: 'religion', label: '🕌 Religion & Spiritualité' },
  { value: 'ia', label: '🤖 IA & Nouvelles Technologies' },
  { value: 'bibliotheque', label: '📚 Bibliothèque & Littérature' },
];

const QUICK_LIBRARY_RESOURCES: Array<{
  id: string;
  title: string;
  type: 'cours' | 'concours' | 'livre' | 'document' | 'exercice';
  href: string;
  badge: string;
}> = [
  {
    id: 'res-maths-bac',
    title: 'Mathématiques — Cours complet & 300 Exercices résolus (Bac S1/S2)',
    type: 'cours',
    href: '/bibliotheque/res-1',
    badge: 'Terminale S',
  },
  {
    id: 'res-annales-bac',
    title: 'Annales Baccalauréat S1 & S2 — Épreuves et Corrigés 2015-2024',
    type: 'concours',
    href: '/bibliotheque/res-2',
    badge: 'Annales',
  },
  {
    id: 'res-ena',
    title: 'Préparation Concours ENA — Culture Générale & Droit Public',
    type: 'concours',
    href: '/bibliotheque/res-3',
    badge: 'ENA Sénégal',
  },
  {
    id: 'res-svt-tle',
    title: 'Sciences de la Vie et de la Terre (SVT) — Schémas-clés & Synthèses',
    type: 'cours',
    href: '/education',
    badge: 'SVT Bac',
  },
  {
    id: 'res-philo-tle',
    title: 'Philosophie Terminale — Citations, Auteurs & Méthodologie Dissertation',
    type: 'livre',
    href: '/education',
    badge: 'Philo L/S',
  },
  {
    id: 'res-pc-tle',
    title: 'Physique-Chimie — Synthèse des Formules & Exercices Types Bac',
    type: 'exercice',
    href: '/education',
    badge: 'PC Bac',
  },
];

export const CreatePublicationModal: React.FC<CreatePublicationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialFormat,
}) => {
  // Verrouille strictement le scroll du body et restaure la position exacte de la page à la fermeture
  useLockBodyScroll(isOpen);

  const [format, setFormat] = useState<PublicationFormat>(initialFormat || 'text');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<PublicationVisibility>('public');
  const [category, setCategory] = useState<string>('general');

  // Système caméra réutilisable
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState<'photo' | 'video'>('photo');

  // Synchroniser le format initial à l'ouverture
  React.useEffect(() => {
    if (isOpen && initialFormat) {
      setFormat(initialFormat);
    }
  }, [isOpen, initialFormat]);

  const handleOpenCamera = (targetMode: 'photo' | 'video') => {
    setCameraMode(targetMode);
    setIsCameraOpen(true);
  };

  const handleCameraCapture = (result: CameraCaptureResult) => {
    if (result.type === 'photo') {
      setSelectedImages((prev) => {
        if (prev.length >= 4) return prev;
        return [...prev, result.dataUrl];
      });
      setFormat('image');
    } else if (result.type === 'video') {
      setVideoUrl(result.dataUrl);
      setFormat('video');
    }
    setIsCameraOpen(false);
  };

  // Multi-images support (Importation réelle ou URL)
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Vidéo support (Importation réelle ou URL)
  const [videoUrl, setVideoUrl] = useState('');

  // Ressource support (Importation de fichier document ou sélection depuis la bibliothèque)
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceType, setResourceType] = useState<'cours' | 'concours' | 'livre' | 'document' | 'exercice'>('cours');
  const [resourceHref, setResourceHref] = useState('/education');
  const [insertedFileName, setInsertedFileName] = useState<string | null>(null);
  const [showCatalogPicker, setShowCatalogPicker] = useState(false);

  // Mode Aperçu avant publication
  const [showPreview, setShowPreview] = useState(false);

  if (!isOpen) return null;

  // Importation réelle de ressource / document depuis l'appareil
  const handleResourceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cleanName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[_-]/g, ' ');

    setResourceTitle(cleanName);
    setInsertedFileName(file.name);
    setResourceType('document');
    setResourceHref('/documents');
    setShowCatalogPicker(false);
    e.target.value = '';
  };

  // Sélection rapide d'une ressource de la bibliothèque Sunubiblio
  const handleSelectCatalogResource = (item: typeof QUICK_LIBRARY_RESOURCES[0]) => {
    setResourceTitle(item.title);
    setResourceType(item.type);
    setResourceHref(item.href);
    setInsertedFileName(null);
    setShowCatalogPicker(false);
  };

  // Importation réelle d'images depuis l'appareil
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (selectedImages.length >= 4) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setSelectedImages((prev) => {
            if (prev.length >= 4) return prev;
            return [...prev, result];
          });
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  // Importation réelle de vidéo depuis l'appareil
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const videoObjUrl = URL.createObjectURL(file);
    setVideoUrl(videoObjUrl);
    e.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSubmit({
      format,
      content,
      visibility,
      category,
      mediaUrls: format === 'image' && selectedImages.length > 0 ? selectedImages : undefined,
      mediaUrl: format === 'video' ? (videoUrl.trim() || undefined) : undefined,
      resourceTitle: format === 'resource' ? resourceTitle.trim() : undefined,
      resourceType: format === 'resource' ? resourceType : undefined,
      resourceHref: format === 'resource' ? resourceHref.trim() : undefined,
    });

    // Réinitialiser
    setContent('');
    setSelectedImages([]);
    setVideoUrl('');
    setResourceTitle('');
    setCategory('general');
    setShowPreview(false);
    onClose();
  };

  return (
    <>
      <div
        className="pub-modal-backdrop"
        onClick={onClose}
        onTouchMove={(e) => {
          if (e.target === e.currentTarget) {
            e.preventDefault();
          }
        }}
        role="dialog"
        aria-modal="true"
      >
        <div className="pub-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* En-tête */}
        <div className="pub-modal-header">
          <div className="pub-modal-title-box">
            <span className="header-sparkle-dot" aria-hidden="true" />
            <h2 className="pub-modal-title">Créer une publication</h2>
          </div>
          <button
            type="button"
            className="pub-modal-close"
            onClick={onClose}
            aria-label="Fermer la fenêtre"
          >
            ✕
          </button>
        </div>

        {/* 4 Formats de publication demandés : 📝 Texte, 🖼️ Image, 🎥 Vidéo, 📚 Ressource */}
        <div className="pub-format-tabs" role="tablist" aria-label="Format de publication">
          <button
            type="button"
            role="tab"
            aria-selected={format === 'text'}
            className={`pub-format-tab ${format === 'text' ? 'active' : ''}`}
            onClick={() => {
              setFormat('text');
              setShowPreview(false);
            }}
          >
            <span className="pub-tab-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
              </svg>
            </span>
            <span className="pub-tab-text">Texte</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={format === 'image'}
            className={`pub-format-tab ${format === 'image' ? 'active' : ''}`}
            onClick={() => {
              setFormat('image');
              setShowPreview(false);
            }}
          >
            <span className="pub-tab-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
            </span>
            <span className="pub-tab-text">Image</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={format === 'video'}
            className={`pub-format-tab ${format === 'video' ? 'active' : ''}`}
            onClick={() => {
              setFormat('video');
              setShowPreview(false);
            }}
          >
            <span className="pub-tab-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/>
                <rect x="2" y="6" width="14" height="12" rx="2"/>
              </svg>
            </span>
            <span className="pub-tab-text">Vidéo</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={format === 'resource'}
            className={`pub-format-tab ${format === 'resource' ? 'active' : ''}`}
            onClick={() => {
              setFormat('resource');
              if (!resourceTitle) setResourceTitle('Fiche Complète : Révisions Bac 2026');
              setShowPreview(false);
            }}
          >
            <span className="pub-tab-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
                <path d="M6 6h10"/>
                <path d="M6 10h10"/>
              </svg>
            </span>
            <span className="pub-tab-text">Ressource</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="pub-modal-form">
          {/* MENU DÉROULANT : AU MÊME NIVEAU POUR CHAQUE CATÉGORIE (AVEC L'ESSENTIEL) */}
          <div className="pub-category-select-row">
            <label className="pub-category-select-label" htmlFor="pub-category-select-input">
              Catégorie :
            </label>
            <select
              id="pub-category-select-input"
              className="pub-select pub-category-dropdown"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Sélectionner la catégorie"
            >
              {ESSENTIAL_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Bascule Édition / Aperçu avant publication */}
          <div className="pub-preview-toggle-bar">
            <button
              type="button"
              className={`pub-toggle-subtab ${!showPreview ? 'active' : ''}`}
              onClick={() => setShowPreview(false)}
            >
              Édition
            </button>
            <button
              type="button"
              className={`pub-toggle-subtab ${showPreview ? 'active' : ''}`}
              onClick={() => setShowPreview(true)}
              disabled={!content.trim()}
            >
              👁️ Aperçu avant publication
            </button>
          </div>

          {!showPreview ? (
            <>
              {/* Zone de saisie principale */}
              <div className="pub-input-group">
                <textarea
                  className="pub-textarea"
                  placeholder={
                    format === 'text'
                      ? 'Partagez une réflexion, une question ou une annonce...'
                      : format === 'image'
                      ? 'Décrivez vos images ou le schéma partagé...'
                      : format === 'video'
                      ? 'Présentez la vidéo ou l’extrait de cours...'
                      : 'Expliquez ce document ou cette ressource éducative...'
                  }
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  required
                  autoFocus
                />
              </div>

              {/* Formulaire spécifique selon le format sélectionné */}

              {/* 1. Format IMAGE : Créer ou insérer une image */}
              {format === 'image' && (
                <div className="pub-format-extra-block">
                  <div className="pub-extra-header-row">
                    <label className="pub-extra-label">
                      Image(s) de la publication ({selectedImages.length}/4) :
                    </label>
                    {selectedImages.length > 0 && (
                      <span className="pub-extra-counter">{selectedImages.length} / 4</span>
                    )}
                  </div>

                  {/* Actions : Créer (Caméra) OU Insérer (Appareil) */}
                  <div className="pub-actions-row">
                    <button
                      type="button"
                      className="pub-btn-action pub-btn-create"
                      title="Ouvrir la caméra pour prendre une photo"
                      onClick={() => handleOpenCamera('photo')}
                      disabled={selectedImages.length >= 4}
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                        <circle cx="12" cy="13" r="3"/>
                      </svg>
                      <span>Caméra (Prendre une photo)</span>
                    </button>

                    <label className="pub-btn-action pub-btn-insert" title="Importer depuis l'appareil">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      <span>Insérer une image</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="pub-file-hidden-input"
                        onChange={handleImageFileUpload}
                        disabled={selectedImages.length >= 4}
                      />
                    </label>
                  </div>

                  {/* Ou coller un lien URL */}
                  <div className="pub-custom-url-row">
                    <input
                      type="url"
                      className="pub-input-text"
                      placeholder="Ou insérer par lien web (https://...)"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                    />
                    <button
                      type="button"
                      className="pub-btn-add-url"
                      onClick={() => {
                        if (customImageUrl.trim() && !selectedImages.includes(customImageUrl.trim())) {
                          setSelectedImages((prev) => [...prev, customImageUrl.trim()]);
                          setCustomImageUrl('');
                        }
                      }}
                      disabled={!customImageUrl.trim() || selectedImages.length >= 4}
                    >
                      Ajouter
                    </button>
                  </div>

                  {/* Vignettes des images sélectionnées */}
                  {selectedImages.length > 0 && (
                    <div className="pub-selected-images-preview">
                      {selectedImages.map((url, i) => (
                        <div key={i} className="pub-thumb-wrap">
                          <img src={url} alt={`Aperçu ${i + 1}`} className="pub-thumb-img" />
                          <button
                            type="button"
                            className="pub-thumb-remove"
                            onClick={() => setSelectedImages((prev) => prev.filter((u) => u !== url))}
                            aria-label="Supprimer cette image"
                            title="Supprimer"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 2. Format VIDÉO : Créer ou insérer une vidéo */}
              {format === 'video' && (
                <div className="pub-format-extra-block">
                  <label className="pub-extra-label">Vidéo de la publication :</label>

                  {/* Actions : Créer (Filmer) OU Insérer (Fichier) */}
                  <div className="pub-actions-row">
                    <button
                      type="button"
                      className="pub-btn-action pub-btn-create"
                      title="Ouvrir la caméra pour filmer une vidéo"
                      onClick={() => handleOpenCamera('video')}
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/>
                        <rect x="2" y="6" width="14" height="12" rx="2"/>
                      </svg>
                      <span>Caméra (Filmer une vidéo)</span>
                    </button>

                    <label className="pub-btn-action pub-btn-insert" title="Importer un fichier vidéo">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      <span>Insérer une vidéo</span>
                      <input
                        type="file"
                        accept="video/*"
                        className="pub-file-hidden-input"
                        onChange={handleVideoFileUpload}
                      />
                    </label>
                  </div>

                  {/* Ou coller un lien URL */}
                  <div className="pub-custom-url-row">
                    <input
                      type="text"
                      className="pub-input-text"
                      placeholder="Ou lien vidéo (YouTube, MP4, extrait de cours...)"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                    />
                    {videoUrl && (
                      <button
                        type="button"
                        className="pub-btn-add-url pub-btn-danger-outline"
                        onClick={() => setVideoUrl('')}
                      >
                        Effacer
                      </button>
                    )}
                  </div>

                  {/* Aperçu vidéo avec option de suppression */}
                  {videoUrl && (
                    <div className="pub-video-preview-box">
                      <video src={videoUrl} controls className="pub-video-preview-player" />
                      <button
                        type="button"
                        className="pub-video-remove-btn"
                        onClick={() => setVideoUrl('')}
                      >
                        ✕ Supprimer cette vidéo
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 3. Format RESSOURCE : Insérer une ressource */}
              {format === 'resource' && (
                <div className="pub-format-extra-block">
                  <div className="pub-extra-header-row">
                    <label className="pub-extra-label">Insérer ou partager une ressource :</label>
                    {resourceTitle && (
                      <span className="pub-extra-counter">✓ Ressource configurée</span>
                    )}
                  </div>

                  {/* Actions : Insérer un fichier (PDF, Doc) OU Choisir dans la bibliothèque */}
                  <div className="pub-actions-row">
                    <label className="pub-btn-action pub-btn-insert" title="Importer un document (PDF, Word, etc.)">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      <span>Insérer un fichier (PDF, Doc)</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.epub,.txt,.ppt,.pptx"
                        className="pub-file-hidden-input"
                        onChange={handleResourceFileUpload}
                      />
                    </label>

                    <button
                      type="button"
                      className={`pub-btn-action pub-btn-create ${showCatalogPicker ? 'active' : ''}`}
                      title="Choisir dans la bibliothèque Sunubiblio"
                      onClick={() => setShowCatalogPicker((prev) => !prev)}
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
                        <path d="M6 6h10"/>
                        <path d="M6 10h10"/>
                      </svg>
                      <span>Bibliothèque Sunubiblio {showCatalogPicker ? '▲' : '▼'}</span>
                    </button>
                  </div>

                  {/* Panneau de sélection de la bibliothèque Sunubiblio si ouvert */}
                  {showCatalogPicker && (
                    <div className="pub-resource-catalog-picker">
                      <div className="pub-catalog-picker-title">
                        <span>Sélectionnez une ressource de la bibliothèque :</span>
                      </div>
                      <div className="pub-catalog-list">
                        {QUICK_LIBRARY_RESOURCES.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            className={`pub-catalog-item ${resourceTitle === item.title ? 'selected' : ''}`}
                            onClick={() => handleSelectCatalogResource(item)}
                          >
                            <span className="pub-catalog-item-icon">
                              {item.type === 'concours' ? '🏛️' : item.type === 'livre' ? '📚' : item.type === 'exercice' ? '📝' : '📄'}
                            </span>
                            <div className="pub-catalog-item-info">
                              <strong className="pub-catalog-item-title">{item.title}</strong>
                              <span className="pub-catalog-item-badge">{item.badge} • {item.type.toUpperCase()}</span>
                            </div>
                            <span className="pub-catalog-item-action">Choisir</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Aperçu de la ressource sélectionnée / fichier inséré */}
                  {resourceTitle && (
                    <div className="pub-resource-selected-card">
                      <span className="pub-resource-selected-icon">
                        {insertedFileName ? '📄' : resourceType === 'concours' ? '🏛️' : resourceType === 'livre' ? '📚' : resourceType === 'exercice' ? '📝' : '📘'}
                      </span>
                      <div className="pub-resource-selected-info">
                        <strong className="pub-resource-selected-title">{resourceTitle}</strong>
                        <span className="pub-resource-selected-meta">
                          {insertedFileName ? `Fichier importé : ${insertedFileName}` : `${resourceType.toUpperCase()} • Sunubiblio`}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="pub-resource-remove-btn"
                        onClick={() => {
                          setResourceTitle('');
                          setInsertedFileName(null);
                        }}
                        title="Retirer la ressource"
                        aria-label="Retirer cette ressource"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* Détails éditables de la ressource */}
                  <div className="pub-resource-fields">
                    <input
                      type="text"
                      className="pub-input-text"
                      placeholder="Titre de la ressource (ex: Synthèse Bac S1 - Mathématiques)"
                      value={resourceTitle}
                      onChange={(e) => {
                        setResourceTitle(e.target.value);
                        setInsertedFileName(null);
                      }}
                      required
                    />
                    <div className="pub-row-two">
                      <select
                        className="pub-select"
                        value={resourceType}
                        onChange={(e) => setResourceType(e.target.value as any)}
                        aria-label="Type de ressource"
                      >
                        <option value="cours">Cours / Fiche</option>
                        <option value="concours">Épreuve / Concours</option>
                        <option value="livre">Livre / Manuel</option>
                        <option value="exercice">Exercice / Sujet</option>
                        <option value="document">Document officiel</option>
                      </select>

                      <input
                        type="text"
                        className="pub-input-text"
                        placeholder="Lien cible (ex: /education)"
                        value={resourceHref}
                        onChange={(e) => setResourceHref(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Visibilité de la publication */}
              <div className="pub-visibility-row">
                <span className="pub-visibility-label">Visibilité :</span>
                <div className="pub-visibility-options">
                  <label className={`pub-vis-chip ${visibility === 'public' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={visibility === 'public'}
                      onChange={() => setVisibility('public')}
                    />
                    🌍 Public
                  </label>

                  <label className={`pub-vis-chip ${visibility === 'abonnes' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="visibility"
                      value="abonnes"
                      checked={visibility === 'abonnes'}
                      onChange={() => setVisibility('abonnes')}
                    />
                    ⭐ Abonnés
                  </label>

                  <label className={`pub-vis-chip ${visibility === 'prive' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="visibility"
                      value="prive"
                      checked={visibility === 'prive'}
                      onChange={() => setVisibility('prive')}
                    />
                    🔒 Privé
                  </label>
                </div>
              </div>
            </>
          ) : (
            /* APERÇU AVANT PUBLICATION */
            <div className="pub-preview-box">
              <div className="pub-preview-header">
                <div className="pub-preview-avatar-wrap">
                  <Image
                    src="/avatar_mamadou.jpg"
                    alt="Votre avatar"
                    width={36}
                    height={36}
                    className="pub-preview-avatar"
                  />
                </div>
                <div>
                  <div className="pub-preview-author-name">
                    Moi
                    <span className="pub-preview-vis-badge">
                      {visibility === 'public' ? '🌍 Public' : visibility === 'abonnes' ? '⭐ Abonnés' : '🔒 Privé'}
                    </span>
                  </div>
                  <div className="pub-preview-time">Aperçu en direct</div>
                </div>
              </div>

              <p className="pub-preview-content">{content}</p>

              {format === 'image' && selectedImages.length > 0 && (
                <div className="pub-preview-media-grid">
                  {selectedImages.map((url, i) => (
                    <img key={i} src={url} alt="Aperçu" className="pub-preview-media-img" />
                  ))}
                </div>
              )}

              {format === 'video' && videoUrl && (
                <div className="pub-preview-video-poster">
                  <video src={videoUrl} controls className="pub-preview-media-img" />
                </div>
              )}

              {format === 'resource' && resourceTitle && (
                <div className="pub-preview-resource-card">
                  <span className="pub-preview-res-icon">📚</span>
                  <div>
                    <strong className="pub-preview-res-title">{resourceTitle}</strong>
                    <div className="pub-preview-res-type">{resourceType.toUpperCase()} • Sunubiblio</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Boutons d'action : Annuler / Publier */}
          <div className="pub-modal-footer">
            <button
              type="button"
              className="pub-btn-cancel"
              onClick={onClose}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="pub-btn-submit"
              disabled={!content.trim() || (format === 'resource' && !resourceTitle.trim())}
            >
              Publier
            </button>
          </div>
        </form>
      </div>
    </div>

    {/* SYSTÈME CAMÉRA UNIQUE ET RÉUTILISABLE SUNUBIBLIO */}
    <CameraCaptureModal
      isOpen={isCameraOpen}
      initialMode={cameraMode}
      onClose={() => setIsCameraOpen(false)}
      onCapture={handleCameraCapture}
    />
  </>
);
};

