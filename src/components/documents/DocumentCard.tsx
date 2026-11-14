'use client';

import React, { useState } from 'react';
import { UsefulDocument } from '@/types/document';

interface DocumentCardProps {
  document: UsefulDocument;
  onViewDetails: (doc: UsefulDocument) => void;
  onDownload?: (doc: UsefulDocument) => void;
  onToggleFavorite?: (docId: string, isFav: boolean) => void;
}

// Gradients élégants par catégorie si aucune image de couverture n'est spécifiée
const CATEGORY_GRADIENTS: Record<string, string> = {
  administratifs: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 55%, #60a5fa 100%)',
  guides: 'linear-gradient(135deg, #065f46 0%, #059669 55%, #34d399 100%)',
  formulaires: 'linear-gradient(135deg, #9a3412 0%, #ea580c 55%, #fb923c 100%)',
  'textes-officiels': 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 55%, #a78bfa 100%)',
  scolaires: 'linear-gradient(135deg, #831843 0%, #db2777 55%, #f472b6 100%)',
  professionnels: 'linear-gradient(135deg, #0f172a 0%, #334155 55%, #64748b 100%)',
  modeles: 'linear-gradient(135deg, #155e75 0%, #0891b2 55%, #22d3ee 100%)',
  autres: 'linear-gradient(135deg, #854d0e 0%, #d97706 55%, #facc15 100%)',
};

const CATEGORY_LABELS: Record<string, string> = {
  administratifs: 'Administratif',
  guides: 'Guide pratique',
  formulaires: 'Formulaire',
  'textes-officiels': 'Texte officiel',
  scolaires: 'Scolaire',
  professionnels: 'Professionnel',
  modeles: 'Modèle type',
  autres: 'Document utile',
};

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onViewDetails,
  onToggleFavorite,
}) => {
  const [isFavorite, setIsFavorite] = useState(document.isFavorite || false);

  const handleFavClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isFavorite;
    setIsFavorite(nextState);
    if (onToggleFavorite) {
      onToggleFavorite(document.id, nextState);
    }
  };

  const gradient =
    document.coverGradient ||
    CATEGORY_GRADIENTS[document.category] ||
    CATEGORY_GRADIENTS.administratifs;

  const categoryLabel = CATEGORY_LABELS[document.category] || document.category;
  const rating = document.rating || 4.9;

  const getAccessBadge = () => {
    switch (document.accessLevel) {
      case 'premium':
        return (
          <span
            className="access-badge sub"
            style={{
              fontSize: '9.5px',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '5px',
              color: '#b45309',
              background: '#fef3c7',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              whiteSpace: 'nowrap',
              lineHeight: 1.2,
            }}
          >
            Abonnement
          </span>
        );
      case 'free':
      default:
        return (
          <span
            className="access-badge free"
            style={{
              fontSize: '9.5px',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '5px',
              color: '#d97706',
              background: '#fffbeb',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              whiteSpace: 'nowrap',
              lineHeight: 1.2,
            }}
          >
            Gratuit
          </span>
        );
    }
  };

  return (
    <article
      className="document-card"
      onClick={() => onViewDetails(document)}
      aria-label={document.title}
    >
      {/* Visual Cover Top Banner with Upright Book Silhouette (Style Bibliothèque) */}
      <div className="cover-banner">
        {/* Top Controls Row */}
        <div className="cover-top-row">
          <div className="badges-group">
            <span className="cover-category-badge">{categoryLabel}</span>
            <span className={`cover-format-badge format-${document.format.toLowerCase()}`}>
              {document.format}
            </span>
          </div>

          {/* Favorite Toggle Button */}
          <button
            type="button"
            className={`fav-btn ${isFavorite ? 'active' : ''}`}
            onClick={handleFavClick}
            aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <svg
              width="14"
              height="14"
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
              background: document.coverImage
                ? `url(${document.coverImage}) center / cover no-repeat`
                : gradient,
            }}
          >
            <div className="book-spine-crease" />
            <div className="book-pages-edge" />
            {!document.coverImage ? (
              <>
                <div className="book-texture-dots" />
                <div className="book-emblem-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <div className="book-mini-title">
                  <span>{document.title.slice(0, 36)}...</span>
                </div>
              </>
            ) : (
              <div className="book-real-gloss" />
            )}
          </div>
        </div>

        {/* Floating Rating Pill */}
        <div className="cover-rating-pill">
          <svg width="10.5" height="10.5" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span className="cover-rating-num">{rating.toFixed(1)}</span>
        </div>

        {/* Hover Action Overlay */}
        <div className="cover-hover-action">
          <button type="button" className="hover-view-btn">
            <span>Consulter</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>

      {/* Card Content & Essentials */}
      <div className="card-body">
        <h3 className="card-title" title={document.title}>
          {document.title}
        </h3>

        <p className="card-author" title={document.issuer || document.author || 'BAAT Éditions'}>
          <span className="author-name">{document.issuer || document.author || 'BAAT Documents'}</span>
          {document.year && <span className="author-institution"> · {document.year}</span>}
        </p>

        {/* Essentials Footer: Type/Pages & Access Side-by-Side */}
        <div className="card-footer">
          <span className="grade-pill">
            {document.pageCount ? `${document.pageCount} page${document.pageCount > 1 ? 's' : ''}` : document.type}
          </span>
          {getAccessBadge()}
        </div>
      </div>

      <style jsx>{`
        .document-card {
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
          padding: 0 !important;
        }

        .document-card:hover {
          transform: translateY(-4px);
          border-color: rgba(245, 158, 11, 0.45);
          box-shadow: 0 14px 30px -6px rgba(217, 119, 6, 0.14), 0 4px 10px -2px rgba(15, 23, 42, 0.04);
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

        .badges-group {
          display: flex;
          align-items: center;
          gap: 6px;
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
          border-radius: 9999px;
          text-transform: uppercase;
        }

        .cover-format-badge {
          font-size: 8.5px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 6px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border: 1px solid transparent;
        }

        .format-pdf {
          background: #fef2f2;
          color: #dc2626;
          border-color: rgba(239, 68, 68, 0.25);
        }

        .format-docx {
          background: #fef3c7;
          color: #b45309;
          border-color: rgba(245, 158, 11, 0.3);
        }

        .format-xlsx {
          background: #f0fdf4;
          color: #16a34a;
          border-color: rgba(34, 197, 94, 0.25);
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
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 0;
        }

        .fav-btn:hover {
          transform: scale(1.1);
          background: #ffffff;
        }

        .fav-btn.active {
          background: #fdf2f8;
          border-color: #fbcfe8;
        }

        /* Upright Book 3D Cover Silhouette */
        .book-cover-stage {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 24px;
          perspective: 900px;
          pointer-events: none;
        }

        .book-3d-spine {
          position: relative;
          width: 106px;
          height: 136px;
          border-radius: 3px 8px 8px 3px;
          box-shadow: -4px 6px 14px rgba(15, 23, 42, 0.25), 0 1px 3px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
          transform: rotateY(-8deg) rotateX(4deg);
        }

        .document-card:hover .book-3d-spine {
          transform: rotateY(0deg) rotateX(0deg) translateY(-3px) scale(1.03);
          box-shadow: 0 14px 26px -4px rgba(15, 23, 42, 0.3), 0 2px 6px rgba(0, 0, 0, 0.08);
        }

        .book-spine-crease {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 9px;
          background: linear-gradient(90deg, rgba(0,0,0,0.35) 0%, rgba(255,255,255,0.18) 50%, rgba(0,0,0,0.2) 100%);
          z-index: 3;
        }

        .book-pages-edge {
          position: absolute;
          top: 3px;
          right: 0;
          bottom: 3px;
          width: 5px;
          background: repeating-linear-gradient(
            to bottom,
            #ffffff 0px,
            #ffffff 1px,
            #e2e8f0 1.5px,
            #cbd5e1 2.5px
          );
          border-radius: 0 3px 3px 0;
          box-shadow: -1px 0 2px rgba(0,0,0,0.2);
          z-index: 2;
        }

        .book-texture-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px);
          background-size: 8px 8px;
          opacity: 0.6;
        }

        .book-emblem-icon {
          position: relative;
          z-index: 2;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(2px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 6px;
        }

        .book-mini-title {
          position: relative;
          z-index: 2;
          padding: 0 8px;
          text-align: center;
          font-size: 9px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.95);
          line-height: 1.2;
          text-shadow: 0 1px 2px rgba(0,0,0,0.4);
        }

        .book-real-gloss {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 60%);
          pointer-events: none;
        }

        .cover-rating-pill {
          position: absolute;
          right: 12px;
          bottom: 12px;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 3.5px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(4px);
          padding: 2.5px 7px;
          border-radius: 9999px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.05);
        }

        .cover-rating-num {
          font-size: 11px;
          font-weight: 700;
          color: #1e293b;
          line-height: 1;
        }

        /* Hover Action Overlay (Exactement identique à Bibliothèque) */
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

        .document-card:hover .cover-hover-action {
          opacity: 1;
        }

        .hover-view-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7.5px 18px;
          font-size: 12.5px;
          font-weight: 700;
          color: #ffffff;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          border: 1px solid rgba(255, 255, 255, 0.35);
          box-shadow: 0 6px 18px rgba(217, 119, 6, 0.45);
          border-radius: 9999px;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }

        .hover-view-btn:hover {
          background: linear-gradient(135deg, #fbbf24 0%, #ea580c 100%);
          transform: scale(1.05);
          box-shadow: 0 8px 24px rgba(217, 119, 6, 0.6);
        }

        /* Card Content (Compact, Équilibré comme Bibliothèque) */
        .card-body {
          padding: 10px 11px 11px;
          display: flex;
          flex-direction: column;
          flex: 1;
          background: #ffffff;
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
          transition: color 0.15s ease;
        }

        .document-card:hover .card-title {
          color: #b45309;
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

        /* Badges Footer: Level/Pages à gauche, Badge Accès complètement à droite */
        .card-footer {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 6px;
          padding-top: 2px;
          border-top: none;
        }

        .grade-pill {
          font-size: 9.5px;
          font-weight: 700;
          color: #475569;
          background: #f1f5f9;
          border: 1px solid rgba(203, 213, 225, 0.8);
          padding: 2px 6px;
          border-radius: 5px;
          white-space: nowrap;
          line-height: 1.2;
          flex-shrink: 0;
        }

        .access-badge {
          font-size: 9.5px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 5px;
          white-space: nowrap;
          line-height: 1.2;
          margin-left: auto;
          flex-shrink: 0;
        }

        .access-badge.free {
          color: #d97706;
          background: #fffbeb;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .access-badge.sub {
          color: #b45309;
          background: #fef3c7;
          border: 1px solid rgba(245, 158, 11, 0.35);
        }
      `}</style>
    </article>
  );
};
