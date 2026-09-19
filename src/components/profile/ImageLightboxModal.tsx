'use client';

import React, { useEffect } from 'react';
import { ProfilePostImage } from '@/types/profile';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

interface ImageLightboxModalProps {
  image: ProfilePostImage | null;
  onClose: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({ image, onClose }) => {
  // Verrouillage absolu de l'arrière-plan
  useLockBodyScroll(!!image);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (image) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [image, onClose]);

  if (!image) return null;

  return (
    <div
      className="image-lightbox-backdrop"
      onClick={onClose}
      onTouchMove={(e) => { if (e.target === e.currentTarget) e.preventDefault(); }}
    >
      <button
        type="button"
        className="image-lightbox-close-btn"
        onClick={onClose}
        aria-label="Fermer l'aperçu"
      >
        ✕
      </button>

      <div className="image-lightbox-container" onClick={(e) => e.stopPropagation()}>
        <div className="image-lightbox-wrapper">
          <img
            src={image.url}
            alt={image.caption || image.name || 'Image de publication'}
            className="image-lightbox-img"
          />
        </div>

        {image.caption && (
          <div className="image-lightbox-caption-bar">
            <p>{image.caption}</p>
          </div>
        )}
      </div>
    </div>
  );
};
