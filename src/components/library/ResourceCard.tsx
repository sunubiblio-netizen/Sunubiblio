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
      {/* Visual Cover Top Banner */}
      <div
        className="cover-banner"
        style={{ background: resource.coverGradient }}
      >
        {/* Subtle geometric pattern overlay */}
        <div className="cover-grid-pattern" />

        {/* Floating Category Pill */}
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
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={isFavorite ? '#ec4899' : 'none'}
              stroke={isFavorite ? '#ec4899' : '#ffffff'}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* Abstract Book / Document Silhouette Emblem */}
        <div className="cover-center-emblem">
          <div className="emblem-inner">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <span className="cover-level-text">{resource.level.grade}</span>
        </div>

        {/* Hover Action Overlay */}
        <div className="cover-hover-action">
          <button type="button" className="btn-primary hover-view-btn">
            <span>Voir le document</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="card-body">
        {/* Meta tags: Level & Access */}
        <div className="card-meta-header">
          <span className="grade-badge">{resource.level.grade}</span>
          {getAccessBadge()}
        </div>

        {/* Title */}
        <h3 className="card-title" title={resource.title}>
          {resource.title}
        </h3>

        {/* Author & Institution */}
        <p className="card-author">
          <span className="author-name">{resource.author}</span>
          {resource.institution && (
            <span className="author-institution"> · {resource.institution}</span>
          )}
        </p>

        {/* Card Footer: format, pages count, year, rating */}
        <div className="card-footer">
          <div className="format-info">
            <span className="format-type">
              {getFormatIcon(resource.resourceType)}
              <span className="format-name">{resource.resourceType.toUpperCase()}</span>
            </span>
            <span className="pages-count">· {resource.pagesCount} p.</span>
            {resource.year && <span className="year-text">· {resource.year}</span>}
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
          border: 1px solid rgba(226, 232, 240, 0.85);
          border-radius: var(--radius-lg);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.03);
          transition: all var(--transition-normal);
          cursor: pointer;
          position: relative;
        }

        .resource-card:hover {
          transform: translateY(-4px);
          border-color: rgba(99, 102, 241, 0.35);
          box-shadow: 0 16px 36px -6px rgba(79, 70, 229, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.04);
        }

        /* Cover */
        .cover-banner {
          position: relative;
          height: 148px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
        }

        .cover-grid-pattern {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px);
          background-size: 16px 16px;
          pointer-events: none;
        }

        .cover-top-row {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cover-category-badge {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.05em;
          background: rgba(0, 0, 0, 0.4);
          color: #ffffff;
          backdrop-filter: blur(8px);
          padding: 3px 8px;
          border-radius: var(--radius-full);
        }

        .fav-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .fav-btn:hover {
          background: rgba(0, 0, 0, 0.5);
          transform: scale(1.1);
        }

        .fav-btn.active {
          background: #ffffff;
          box-shadow: 0 2px 8px rgba(236, 72, 153, 0.4);
        }

        .cover-center-emblem {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          margin-top: 4px;
        }

        .emblem-inner {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cover-level-text {
          font-size: 11px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .cover-hover-action {
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(3px);
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
          padding: 8px 16px;
          font-size: 13px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
        }

        /* Body */
        .card-body {
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .card-meta-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .grade-badge {
          font-size: 11px;
          font-weight: 700;
          color: #4f46e5;
          background: #eef2ff;
          padding: 2px 7px;
          border-radius: 6px;
        }

        .access-badge {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 2px 7px;
          border-radius: var(--radius-full);
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
          color: #7c2d12;
          background: #fef3c7;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .card-title {
          font-size: 14.5px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.35;
          margin-bottom: 6px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 39px;
        }

        .card-author {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 14px;
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

        .card-footer {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 1px solid rgba(226, 232, 240, 0.65);
        }

        .format-info {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          color: #64748b;
        }

        .format-type {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-weight: 600;
          color: #334155;
        }

        .rating-info {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .rating-num {
          font-size: 12px;
          font-weight: 700;
          color: #1e293b;
        }
      `}</style>
    </article>
  );
};
