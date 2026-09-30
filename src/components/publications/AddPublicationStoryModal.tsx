'use client';

import React, { useState } from 'react';
import { CameraCaptureModal, CameraCaptureResult } from '@/components/camera/CameraCaptureModal';

interface AddPublicationStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (caption: string, mediaUrl: string) => void;
}

const STORY_PRESETS = [
  { label: 'Révision Mathématiques', url: '/vid_fonctions.jpg' },
  { label: 'Méthodologie Bac', url: '/vid_bac.jpg' },
  { label: 'Campus Sunubiblio', url: '/bac_maths.jpg' },
  { label: 'Sciences & Nature', url: '/svt_cours.jpg' },
];

export const AddPublicationStoryModal: React.FC<AddPublicationStoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [caption, setCaption] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(STORY_PRESETS[0].url);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCustomCapture, setIsCustomCapture] = useState(false);

  if (!isOpen) return null;

  const handleCameraCapture = (result: CameraCaptureResult) => {
    setSelectedMedia(result.dataUrl);
    setIsCustomCapture(true);
    setIsCameraOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(caption, selectedMedia);
    setCaption('');
    setIsCustomCapture(false);
    onClose();
  };

  return (
    <>
      <div className="pub-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
        <div className="pub-modal-content story-modal-box" onClick={(e) => e.stopPropagation()}>
          <div className="pub-modal-header">
            <div className="header-title-box">
              <span className="header-sparkle-dot" aria-hidden="true" />
              <h2 className="pub-modal-title">Ajouter une Story</h2>
            </div>
            <button
              type="button"
              className="pub-modal-close"
              onClick={onClose}
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="pub-modal-form">
            {/* Action Caméra Directe Sunubiblio */}
            <div className="pub-actions-row">
              <button
                type="button"
                className="pub-btn-action pub-btn-create"
                onClick={() => setIsCameraOpen(true)}
                style={{ width: '100%', padding: '0.75rem' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                  <circle cx="12" cy="13" r="3"/>
                </svg>
                <span>{isCustomCapture ? '📸 Reprendre une photo/vidéo' : '📸 Ouvrir la caméra pour la Story'}</span>
              </button>
            </div>

            {/* Aperçu du média personnalisé capturé */}
            {isCustomCapture ? (
              <div className="pub-thumb-wrap" style={{ width: '100%', height: '140px', borderRadius: '10px' }}>
                <img src={selectedMedia} alt="Aperçu Story capturée" className="pub-thumb-img" />
                <button
                  type="button"
                  className="pub-thumb-remove"
                  onClick={() => {
                    setIsCustomCapture(false);
                    setSelectedMedia(STORY_PRESETS[0].url);
                  }}
                  title="Changer"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="pub-story-preset-section">
                <label className="pub-extra-label">Ou choisissez parmi nos arrière-plans :</label>
                <div className="pub-story-preset-grid">
                  {STORY_PRESETS.map((item) => (
                    <button
                      key={item.url}
                      type="button"
                      className={`story-preset-thumb-btn ${selectedMedia === item.url ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedMedia(item.url);
                        setIsCustomCapture(false);
                      }}
                    >
                      <img src={item.url} alt={item.label} className="story-preset-thumb-img" />
                      <span className="story-preset-thumb-label">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pub-input-group">
              <label className="pub-extra-label">Légende (optionnelle) :</label>
              <input
                type="text"
                className="pub-input-text"
                placeholder="Ex: Révision collective ce soir à 20h..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                maxLength={120}
              />
            </div>

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
              >
                Partager en Story (24 h)
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* SYSTÈME CAMÉRA UNIQUE SUNUBIBLIO */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        initialMode="photo"
        allowModeSwitch={true}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />
    </>
  );
};
