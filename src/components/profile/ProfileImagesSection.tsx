'use client';

import React, { useState } from 'react';
import { ProfileGalleryImage, ProfilePostImage, StoryTargetPayload } from '@/types/profile';
import { AddImageModal } from './AddImageModal';
import { ImageLightboxModal } from './ImageLightboxModal';

interface ProfileImagesSectionProps {
  initialImages: ProfileGalleryImage[];
  authorName?: string;
  authorAvatar?: string;
  onAddToStory?: (target: StoryTargetPayload) => void;
}

export const ProfileImagesSection: React.FC<ProfileImagesSectionProps> = ({
  initialImages,
  authorName,
  authorAvatar,
  onAddToStory,
}) => {
  const [images, setImages] = useState<ProfileGalleryImage[]>(initialImages);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeLightboxImage, setActiveLightboxImage] = useState<ProfilePostImage | null>(null);

  const filters = [
    { id: 'all', label: 'Tout' },
    { id: 'Schéma', label: 'Schémas & Géométrie' },
    { id: 'Fiche', label: 'Fiches de cours' },
    { id: 'Tableau', label: 'Tableaux' },
  ];

  const handleAddImage = (newImg: ProfileGalleryImage) => {
    setImages([newImg, ...images]);
  };

  const filteredImages = images.filter((img) => {
    if (selectedFilter === 'all') return true;
    return img.category === selectedFilter;
  });

  return (
    <section className="profile-images-section" aria-label="Galerie d’images">
      {/* En-tête avec titre et bouton « + Ajouter une image » */}
      <div className="profile-section-header-bar">
        <div className="profile-section-title-cluster">
          <div className="section-title-icon-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
          <div className="section-title-text-group">
            <h2 className="section-main-heading">Mes images & Schémas</h2>
            <p className="section-sub-heading">
              Supports graphiques, fiches manuscrites et schémas d’exercices partagés.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="btn-add-publication-action"
          aria-label="Ajouter une image"
          title="Ajouter une image"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="btn-action-text-desktop">Ajouter une image</span>
        </button>
      </div>

      {/* Barre de filtres */}
      <div className="images-filter-bar">
        <div className="video-category-pills-row">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelectedFilter(f.id)}
              className={`video-category-chip ${selectedFilter === f.id ? 'active' : ''}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grille de la galerie d'images */}
      {images.length === 0 ? (
        <div className="profile-empty-tab-state">
          <div className="empty-state-icon">🖼️</div>
          <h4>Aucune image publiée</h4>
          <p>Ajoutez vos premiers schémas de cours, fiches ou graphiques d’exercices.</p>
          <button
            type="button"
            className="btn-empty-reset"
            onClick={() => setIsAddModalOpen(true)}
          >
            + Ajouter une image
          </button>
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="profile-empty-tab-state">
          <div className="empty-state-icon">🖼️</div>
          <h4>Aucune image dans cette catégorie</h4>
          <p>Vous n’avez pas encore ajouté de schéma ou fiche correspondant à ce filtre.</p>
          <button
            type="button"
            className="btn-empty-reset"
            onClick={() => setSelectedFilter('all')}
          >
            Afficher toutes les images
          </button>
        </div>
      ) : (
        <div className="profile-gallery-grid-three-cols">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className="gallery-card-item"
              onClick={() =>
                setActiveLightboxImage({
                  id: img.id,
                  url: img.url,
                  caption: img.caption || img.title,
                })
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter')
                  setActiveLightboxImage({
                    id: img.id,
                    url: img.url,
                    caption: img.caption || img.title,
                  });
              }}
            >
              <div className="gallery-card-thumb-wrap">
                <img
                  src={img.url}
                  alt={img.title}
                  className="gallery-card-img"
                />
                {img.category && (
                  <span className="gallery-badge-category">{img.category}</span>
                )}
                <div className="gallery-card-hover-zoom">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </div>
              </div>

              <div className="gallery-card-details">
                <h4 className="gallery-card-title">{img.title}</h4>
                {img.caption && (
                  <p className="gallery-card-caption-snippet">{img.caption}</p>
                )}

                <div className="gallery-card-footer-row">
                  <span className="gallery-card-date">{img.date}</span>
                  <div className="gallery-card-stats">
                    <span className="gallery-stat">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      {img.viewsCount}
                    </span>
                    <span className="gallery-stat">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                      {img.likesCount}
                    </span>

                    {onAddToStory && (
                      <button
                        type="button"
                        className="gallery-card-story-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToStory({
                            contentType: 'image',
                            contentId: img.id,
                            title: img.title,
                            description: img.caption,
                            mediaUrl: img.url,
                            badge: img.category || 'Schéma',
                            metaText: img.date,
                            authorName: authorName || 'Mamadou Diop',
                            authorAvatar: authorAvatar || '/avatar_mamadou.jpg',
                            sharedHref: '/profil',
                          });
                        }}
                        title="Ajouter à la story (24h)"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                          <circle cx="12" cy="12" r="3" fill="currentColor" />
                        </svg>
                        <span className="gallery-story-btn-text">Story</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modale d'ajout d'image */}
      <AddImageModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddImage={handleAddImage}
      />

      {/* Visionneuse Lightbox au clic */}
      <ImageLightboxModal
        image={activeLightboxImage}
        onClose={() => setActiveLightboxImage(null)}
      />
    </section>
  );
};
