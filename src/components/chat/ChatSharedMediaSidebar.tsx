'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { SharedItem } from '@/types/chat';

interface ChatSharedMediaSidebarProps {
  items: SharedItem[];
  onClose: () => void;
  onOpenItem?: (item: SharedItem) => void;
}

export const ChatSharedMediaSidebar: React.FC<ChatSharedMediaSidebarProps> = ({
  items,
  onClose,
  onOpenItem,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'images' | 'videos' | 'files'>('all');
  const [isImagesOpen, setIsImagesOpen] = useState(true);
  const [isVideosOpen, setIsVideosOpen] = useState(true);
  const [isFilesOpen, setIsFilesOpen] = useState(true);

  const imageItems = items.filter((i) => i.type === 'image');
  const videoItems = items.filter((i) => i.type === 'video');
  const fileItems = items.filter((i) => i.type === 'file');

  return (
    <aside className="chat-shared-sidebar-root" aria-label="Médias et documents partagés">
      {/* 1. En-tête : Titre « Partagés » + Bouton ✕ */}
      <div className="chat-shared-header">
        <h3 className="chat-shared-title">Partagés</h3>
        <button
          type="button"
          className="chat-shared-close-btn"
          onClick={onClose}
          aria-label="Fermer le volet partagés"
          title="Fermer"
        >
          ✕
        </button>
      </div>

      {/* 2. Filtres en pilules : Tous, Images, Vidéos, Fichiers */}
      <div className="chat-shared-filters-pills" role="tablist">
        {[
          { id: 'all', label: 'Tous' },
          { id: 'images', label: 'Images' },
          { id: 'videos', label: 'Vidéos' },
          { id: 'files', label: 'Fichiers' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            className={`chat-shared-filter-pill ${activeFilter === f.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(f.id as any)}
          >
            <span>{f.label}</span>
          </button>
        ))}
      </div>

      {/* 3. Contenu défilable */}
      <div className="chat-shared-content-area">
        {/* Section IMAGES */}
        {(activeFilter === 'all' || activeFilter === 'images') && (
          <div className="chat-shared-section">
            <button
              type="button"
              className="chat-shared-section-header"
              onClick={() => setIsImagesOpen(!isImagesOpen)}
            >
              <div className="section-header-title">
                <span className="section-icon">📷</span>
                <span>Images ({imageItems.length + 3})</span>
              </div>
              <svg
                className={`chat-shared-chevron ${isImagesOpen ? 'open' : ''}`}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2.5"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {isImagesOpen && (
              <div className="chat-shared-images-grid">
                {imageItems.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="chat-shared-img-card"
                    onClick={() => onOpenItem?.(item)}
                    title={item.title}
                  >
                    <Image
                      src={item.url}
                      alt={item.title}
                      width={80}
                      height={80}
                      className="chat-shared-thumb"
                    />
                  </div>
                ))}
                {/* Carte +3 */}
                <div
                  className="chat-shared-img-card more-card"
                  onClick={() => setActiveFilter('images')}
                  title="Voir plus d'images"
                >
                  <span className="more-count">+3</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section VIDÉOS */}
        {(activeFilter === 'all' || activeFilter === 'videos') && (
          <div className="chat-shared-section">
            <button
              type="button"
              className="chat-shared-section-header"
              onClick={() => setIsVideosOpen(!isVideosOpen)}
            >
              <div className="section-header-title">
                <span className="section-icon">📹</span>
                <span>Vidéos ({videoItems.length})</span>
              </div>
              <svg
                className={`chat-shared-chevron ${isVideosOpen ? 'open' : ''}`}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2.5"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {isVideosOpen && (
              <div className="chat-shared-videos-grid">
                {videoItems.map((item) => (
                  <div
                    key={item.id}
                    className="chat-shared-vid-card"
                    onClick={() => onOpenItem?.(item)}
                    title={item.title}
                  >
                    <Image
                      src={item.thumbnailUrl || item.url}
                      alt={item.title}
                      width={120}
                      height={70}
                      className="chat-shared-vid-thumb"
                    />
                    <div className="vid-play-overlay">
                      <span className="vid-play-icon">▶</span>
                    </div>
                    {item.duration && (
                      <span className="vid-duration-badge">{item.duration}</span>
                    )}
                  </div>
                ))}

                {/* Bouton d'ajout rapide */}
                <div className="chat-shared-vid-add-box" title="Ajouter une vidéo">
                  <span className="vid-plus-icon">+</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section FICHIERS / DOCUMENTS */}
        {(activeFilter === 'all' || activeFilter === 'files') && (
          <div className="chat-shared-section">
            <button
              type="button"
              className="chat-shared-section-header"
              onClick={() => setIsFilesOpen(!isFilesOpen)}
            >
              <div className="section-header-title">
                <span className="section-icon">📄</span>
                <span>Fichiers ({fileItems.length})</span>
              </div>
              <svg
                className={`chat-shared-chevron ${isFilesOpen ? 'open' : ''}`}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2.5"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {isFilesOpen && (
              <div className="chat-shared-files-list">
                {fileItems.map((item) => {
                  const isPdf = item.extension === 'pdf' || item.title.endsWith('.pdf');
                  return (
                    <div key={item.id} className="chat-shared-file-item">
                      <div className={`file-format-badge ${isPdf ? 'pdf' : 'docx'}`}>
                        <span>{isPdf ? 'PDF' : 'DOC'}</span>
                      </div>

                      <div className="file-item-info">
                        <span className="file-item-title" title={item.title}>
                          {item.title}
                        </span>
                        <span className="file-item-meta">
                          {item.size || '2,4 Mo'} • {item.time}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="file-item-more-btn"
                        title="Options"
                        aria-label="Options du fichier"
                      >
                        ⋮
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
