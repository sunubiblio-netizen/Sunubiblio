'use client';

import React, { useState } from 'react';
import { CameraCaptureModal, CameraCaptureResult } from '@/components/camera/CameraCaptureModal';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

interface AddPublicationStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (caption: string, mediaUrl: string) => void;
}

const STORY_PRESETS = [
  { label: 'Révision Mathématiques', url: '/vid_fonctions.jpg' },
  { label: 'Méthodologie Bac', url: '/vid_bac.jpg' },
  { label: 'Campus Sunubiblio', url: '/math_bac_s1.jpg' },
  { label: 'Sciences & Nature', url: '/livre_philosophie.jpg' },
];

export const AddPublicationStoryModal: React.FC<AddPublicationStoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  useLockBodyScroll(isOpen);
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
    <div
      className="pub-modal-floating-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="pub-modal-floating-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pub-modal-floating-header">
          <div className="pub-modal-header-left">
            <span className="pub-modal-dot-purple" aria-hidden="true" />
            <h2 className="pub-modal-floating-title">Ajouter une Story</h2>
          </div>
          <button
            type="button"
            className="pub-modal-floating-close-btn"
            onClick={onClose}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="pub-modal-floating-body">
          {/* Action Caméra Directe */}
          <button
            type="button"
            className="pub-modal-upload-trigger"
            onClick={() => setIsCameraOpen(true)}
            style={{ padding: '0.85rem' }}
          >
            <span style={{ fontSize: '1.25rem' }}>📸</span>
            <span>{isCustomCapture ? 'Reprendre une photo/vidéo' : 'Ouvrir la caméra pour la Story'}</span>
          </button>

          {/* Aperçu */}
          {isCustomCapture ? (
            <div className="pub-modal-preview-box">
              <img src={selectedMedia} alt="Aperçu Story" className="pub-modal-img-preview" />
              <button
                type="button"
                className="pub-modal-remove-preview-btn"
                onClick={() => {
                  setIsCustomCapture(false);
                  setSelectedMedia(STORY_PRESETS[0].url);
                }}
              >
                Changer
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b' }}>
                Ou choisissez parmi nos visuels suggérés :
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.35rem' }}>
                {STORY_PRESETS.map((p) => (
                  <button
                    key={p.url}
                    type="button"
                    onClick={() => setSelectedMedia(p.url)}
                    style={{
                      border: selectedMedia === p.url ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      height: '60px',
                      padding: 0,
                      cursor: 'pointer',
                      background: '#f8fafc',
                    }}
                  >
                    <img src={p.url} alt={p.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Légende */}
          <div className="pub-modal-input-group">
            <input
              type="text"
              className="pub-modal-text-input"
              placeholder="Ajouter une légende (optionnel)..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

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
            >
              Partager en Story
            </button>
          </div>
        </form>
      </div>

      {/* Caméra Capture Modal si activée */}
      {isCameraOpen && (
        <CameraCaptureModal
          isOpen={isCameraOpen}
          initialMode="photo"
          onClose={() => setIsCameraOpen(false)}
          onCapture={handleCameraCapture}
        />
      )}
    </div>
  );
};
