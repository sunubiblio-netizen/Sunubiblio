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
            style={{
              background: resource.coverImage
                ? `url(${resource.coverImage}) center / cover no-repeat`
                : resource.coverGradient,
            }}
          >
            <div className="book-spine-crease" />
            <div className="book-pages-edge" />
            {!resource.coverImage ? (
              <>
                <div className="book-texture-dots" />
                <div className="book-emblem-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
              </>
            ) : (
              <div className="book-real-gloss" />
            )}
          </div>
        </div>

        {/* Floating Rating Pill (Top-right of bottom cover) */}
        <div className="cover-rating-pill">
          <svg width="10.5" height="10.5" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span className="cover-rating-num">{resource.rating.toFixed(1)}</span>
        </div>

        {/* Hover Action Overlay */}
        <div className="cover-hover-action">
          <button type="button" className="btn-primary hover-view-btn">
            <span>Consulter</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>

      {/* Card Content & Essentials (Compact & Clean) */}
      <div className="card-body">
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

        {/* Essentials Footer: Level & Access Side-by-Side */}
        <div className="card-footer">
          <span className="grade-pill">{resource.level.grade}</span>
          {getAccessBadge()}
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

        /* Cover Area — Elevated Presentation */
        .cover-banner {
          position: relative;
          background: linear-gradient(180deg, #f8fafc 0%, #edf2f7 100%);
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
          padding: 12px 12px 14px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          height: 184px;
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
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.05em;
          background: rgba(255, 255, 255, 0.95);
          color: #475569;
          border: 1px solid rgba(226, 232, 240, 0.9);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
          padding: 2.5px 8px;
          border-radius: var(--radius-full);
          text-transform: uppercase;
        }

        .fav-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(226, 232, 240, 0.9);
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

        /* 3D Book Silhouette Stage — Larger & Noble */
        .book-cover-stage {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          padding-top: 4px;
        }

        .book-3d-spine {
          width: 94px;
          height: 130px;
          border-radius: 3px 7px 7px 3px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px;
          box-shadow:
            -3px 0 5px rgba(0, 0, 0, 0.16),
            6px 14px 26px -4px rgba(15, 23, 42, 0.26),
            0 2px 6px rgba(0, 0, 0, 0.06);
          transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s ease;
        }

        .resource-card:hover .book-3d-spine {
          transform: scale(1.04) translateY(-2px) rotate(-1deg);
          box-shadow:
            -3px 0 6px rgba(0, 0, 0, 0.18),
            8px 18px 30px -4px rgba(15, 23, 42, 0.3),
            0 4px 10px rgba(0, 0, 0, 0.08);
        }

        .book-spine-crease {
          position: absolute;
          left: 6px;
          top: 0;
          bottom: 0;
          width: 1.5px;
          background: rgba(255, 255, 255, 0.35);
          box-shadow: 1px 0 2px rgba(0, 0, 0, 0.15);
        }

        .book-pages-edge {
          position: absolute;
          right: -3px;
          top: 4px;
          bottom: 4px;
          width: 3.5px;
          background: repeating-linear-gradient(
            to bottom,
            #f8fafc 0px,
            #e2e8f0 1.5px,
            #ffffff 3px
          );
          border-radius: 0 2px 2px 0;
          box-shadow: 1px 0 2px rgba(0, 0, 0, 0.1);
        }

        .book-texture-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255, 255, 255, 0.14) 1px, transparent 1px);
          background-size: 11px 11px;
          border-radius: 3px 7px 7px 3px;
          pointer-events: none;
        }

        .book-real-gloss {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            115deg,
            rgba(255, 255, 255, 0.28) 0%,
            rgba(255, 255, 255, 0.08) 22%,
            transparent 48%,
            rgba(0, 0, 0, 0.12) 100%
          );
          border-radius: 3px 7px 7px 3px;
          pointer-events: none;
        }

        .book-emblem-icon {
          position: relative;
          z-index: 2;
          width: 38px;
          height: 38px;
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Floating Rating Pill in Cover Banner */
        .cover-rating-pill {
          position: absolute;
          right: 9px;
          bottom: 9px;
          z-index: 4;
          display: inline-flex;
          align-items: center;
          gap: 3px;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(6px);
          padding: 2.5px 6.5px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(226, 232, 240, 0.9);
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08);
        }

        .cover-rating-num {
          font-size: 11px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1;
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
          padding: 7px 16px;
          font-size: 12.5px;
          font-weight: 700;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
          border-radius: var(--radius-full);
        }

        /* Body Area — Compact, Balanced & Breathing (At Red Limit Line) */
        .card-body {
          padding: 10px 11px 11px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .card-title {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.32;
          margin: 0 0 2px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 35px;
          letter-spacing: -0.01em;
        }

        .card-author {
          font-size: 11px;
          color: #64748b;
          margin: 0 0 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .author-name {
          font-weight: 500;
          color: #475569;
        }

        .author-institution {
          color: #94a3b8;
        }

        /* Badges Footer: Level & Access side-by-side (Red Arrow) */
        .card-footer {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 5px;
          flex-wrap: nowrap;
          padding-top: 2px;
        }

        .grade-pill {
          font-size: 10px;
          font-weight: 700;
          color: #4f46e5;
          background: #eef2ff;
          padding: 2px 6.5px;
          border-radius: 6px;
          white-space: nowrap;
          line-height: 1.3;
        }

        .access-badge {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6.5px;
          border-radius: 6px;
          white-space: nowrap;
          line-height: 1.3;
        }

        .access-badge.free {
          color: #059669;
          background: #ecfdf5;
          border: 1px solid rgba(16, 185, 129, 0.25);
        }

        .access-badge.sub {
          color: #2563eb;
          background: #eff6ff;
          border: 1px solid rgba(37, 99, 235, 0.25);
        }

        .access-badge.premium {
          color: #b45309;
          background: #fef3c7;
          border: 1px solid rgba(245, 158, 11, 0.25);
        }

        /* Desktop Adjustments */
        @media (min-width: 768px) {
          .cover-banner {
            height: 205px;
            padding: 14px 16px;
          }

          .cover-rating-pill {
            right: 12px;
            bottom: 12px;
            padding: 3px 8px;
          }

          .book-3d-spine {
            width: 106px;
            height: 148px;
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

          .grade-pill {
            font-size: 10.5px;
            padding: 2.5px 7px;
          }

          .access-badge {
            font-size: 10.5px;
            padding: 2.5px 7px;
          }
        }
      `}</style>
    </article>
  );
};
