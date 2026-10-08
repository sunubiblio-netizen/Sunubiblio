'use client';

import React, { useState } from 'react';
import { Resource } from '@/types/library';

interface ResourceCardProps {
  resource: Resource;
  onOpenResource?: (resource: Resource) => void;
  onToggleFavorite?: (resourceId: string, isFav: boolean) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  onOpenResource,
  onToggleFavorite,
}) => {
  const [isFavorite, setIsFavorite] = useState(resource.isFavorite || false);

  const handleFavClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isFavorite;
    setIsFavorite(nextState);
    if (onToggleFavorite) {
      onToggleFavorite(resource.id, nextState);
    }
  };

  const getAccessBadge = () => {
    switch (resource.accessLevel) {
      case 'premium':
        return <span className="access-badge premium">Gold Premium</span>;
      case 'subscription':
        return <span className="access-badge sub">Abonnement</span>;
      case 'free':
      default:
        return <span className="access-badge free">Gratuit</span>;
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'qcm':
        return (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polyline points="9 11 12 14 22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        );
      case 'cours':
        return (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        );
      default:
        return (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        );
    }
  };

  return (
    <article
      className="resource-card"
      onClick={() => onOpenResource && onOpenResource(resource)}
    >
      {/* Visual Cover Top Banner with Upright Book Silhouette */}
      <div className="cover-banner">
        {/* Top Controls Row */}
        <div className="cover-top-row">
          <span className="cover-category-badge">
            {resource.category.toUpperCase()}
          </span>

          {/* Favorite Toggle Button */}
          <button
            type="button"
            className={`fav-btn ${isFavorite ? 'active' : ''}`}
            onClick={handleFavClick}
            aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill={isFavorite ? '#ec4899' : 'none'}
              stroke={isFavorite ? '#ec4899' : 'rgba(100, 116, 139, 0.85)'}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* Upright Book 3D Cover */}
        <div className="book-cover-stage">
          <div
            className="book-3d-spine"
            style={{ background: resource.coverGradient }}
          >
            <div className="book-spine-crease" />
            <div className="book-texture-dots" />
            <div className="book-emblem-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <span className="book-spine-grade">{resource.level.grade}</span>
          </div>
        </div>

        {/* Hover Action Overlay */}
        <div className="cover-hover-action">
          <button type="button" className="btn-primary hover-view-btn">
            <span>Lire</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>

      {/* Card Content & Precise Details */}
      <div className="card-body">
        {/* Meta tags: Level & Access Status */}
        <div className="card-meta-header">
          <span className="grade-badge">{resource.level.grade}</span>
          {getAccessBadge()}
        </div>

        {/* Title */}
        <h3 className="card-title" title={resource.title}>
          {resource.title}
        </h3>

        {/* Author */}
        <p className="card-author" title={`${resource.author}${resource.institution ? ` · ${resource.institution}` : ''}`}>
          <span className="author-name">{resource.author}</span>
          {resource.institution && (
            <span className="author-institution"> · {resource.institution}</span>
          )}
        </p>

        {/* Subtle Divider */}
        <div className="card-divider" />

        {/* Card Footer: format, pages count, year, rating */}
        <div className="card-footer">
          <div className="format-info">
            <svg
              className="format-doc-icon"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span className="format-text">
              {resource.resourceType.toUpperCase()} · {resource.pagesCount} p.
              {resource.year ? ` · ${resource.year}` : ' · 2024'}
            </span>
          </div>

          <div className="rating-info">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="rating-num">{resource.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .resource-card {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 2px 10px -2px rgba(15, 23, 42, 0.04);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          position: relative;
        }

        .resource-card:hover {
          transform: translateY(-4px);
          border-color: rgba(99, 102, 241, 0.35);
          box-shadow: 0 14px 30px -6px rgba(79, 70, 229, 0.12), 0 4px 10px -2px rgba(15, 23, 42, 0.04);
        }

        /* Cover Area */
        .cover-banner {
          position: relative;
          background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
          padding: 10px 10px 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          height: 148px;
        }

        .cover-top-row {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .cover-category-badge {
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.04em;
          background: rgba(255, 255, 255, 0.9);
          color: #475569;
          border: 1px solid rgba(226, 232, 240, 0.9);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
          padding: 2px 7px;
          border-radius: var(--radius-full);
        }

        .fav-btn {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.85);
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .fav-btn:hover {
          background: #ffffff;
          transform: scale(1.1);
          border-color: rgba(236, 72, 153, 0.3);
        }

        .fav-btn.active {
          background: #ffffff;
          border-color: #fbcfe8;
          box-shadow: 0 2px 8px rgba(236, 72, 153, 0.25);
        }

        /* 3D Book Silhouette Stage */
        .book-cover-stage {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          margin-top: 2px;
        }

        .book-3d-spine {
          width: 74px;
          height: 98px;
          border-radius: 3px 6px 6px 3px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 6px;
          box-shadow:
            -2px 0 3px rgba(0, 0, 0, 0.12),
            4px 8px 18px -2px rgba(15, 23, 42, 0.24);
          transition: transform 0.25s ease;
        }

        .resource-card:hover .book-3d-spine {
          transform: scale(1.05) rotate(-1deg);
        }

        .book-spine-crease {
          position: absolute;
          left: 5px;
          top: 0;
          bottom: 0;
          width: 1.5px;
          background: rgba(255, 255, 255, 0.3);
          box-shadow: 1px 0 2px rgba(0, 0, 0, 0.15);
        }

        .book-texture-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px);
          background-size: 10px 10px;
          border-radius: 3px 6px 6px 3px;
          pointer-events: none;
        }

        .book-emblem-icon {
          position: relative;
          z-index: 2;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.16);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .book-spine-grade {
          position: relative;
          z-index: 2;
          font-size: 9.5px;
          font-weight: 800;
          color: #ffffff;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
          max-width: 90%;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Hover Overlay */
        .cover-hover-action {
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.35);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s ease;
          z-index: 5;
        }

        .resource-card:hover .cover-hover-action {
          opacity: 1;
        }

        .hover-view-btn {
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 700;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
          border-radius: var(--radius-full);
        }

        /* Body Area */
        .card-body {
          padding: 10px 12px 12px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .card-meta-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
          gap: 6px;
        }

        .grade-badge {
          font-size: 10px;
          font-weight: 700;
          color: #4f46e5;
          background: #eef2ff;
          padding: 2px 6px;
          border-radius: 5px;
          white-space: nowrap;
        }

        .access-badge {
          font-size: 9.5px;
          font-weight: 800;
          text-transform: capitalize;
          letter-spacing: 0.02em;
          padding: 2px 6px;
          border-radius: 5px;
          white-space: nowrap;
        }

        .access-badge.free {
          color: #059669;
          background: #ecfdf5;
        }

        .access-badge.sub {
          color: #2563eb;
          background: #eff6ff;
        }

        .access-badge.premium {
          color: #b45309;
          background: #fef3c7;
        }

        .card-title {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.32;
          margin-bottom: 3px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 35px;
        }

        .card-author {
          font-size: 11px;
          color: #64748b;
          margin-bottom: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .author-name {
          font-weight: 600;
          color: #475569;
        }

        .author-institution {
          color: #64748b;
        }

        /* Footer */
        .card-footer {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 8px;
          border-top: 1px solid rgba(226, 232, 240, 0.7);
          gap: 4px;
        }

        .format-info {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #64748b;
          white-space: nowrap;
        }

        .format-type {
          display: inline-flex;
          align-items: center;
          gap: 2.5px;
          font-weight: 600;
          color: #334155;
        }

        .rating-info {
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .rating-num {
          font-size: 11.5px;
          font-weight: 700;
          color: #1e293b;
        }

        /* Desktop Adjustments */
        @media (min-width: 768px) {
          .cover-banner {
            height: 160px;
            padding: 12px 14px;
          }

          .book-3d-spine {
            width: 82px;
            height: 110px;
          }

          .card-body {
            padding: 12px 14px 14px;
          }

          .card-title {
            font-size: 14px;
            min-height: 37px;
          }

          .card-author {
            font-size: 11.5px;
            margin-bottom: 10px;
          }

          .grade-badge {
            font-size: 11px;
          }

          .access-badge {
            font-size: 10px;
          }
        }
      `}</style>
    </article>
  );
};
