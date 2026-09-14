'use client';

import React from 'react';
import { ReligionResource } from '@/types/religion';

interface ReligionResourceCardProps {
  resource: ReligionResource;
  onConsult: (resource: ReligionResource) => void;
}

export const ReligionResourceCard: React.FC<ReligionResourceCardProps> = ({
  resource,
  onConsult,
}) => {
  const formatContentType = (type: string) => {
    switch (type) {
      case 'livre':
        return 'Livre';
      case 'cours':
        return 'Cours';
      case 'document':
        return 'Document';
      case 'article':
        return 'Article';
      case 'conference':
        return 'Conférence';
      case 'guide':
        return 'Guide';
      case 'texte':
        return 'Texte';
      default:
        return type;
    }
  };

  const getCoverStyles = () => {
    switch (resource.coverPattern) {
      case 'geometric-amber':
        return {
          background: 'linear-gradient(135deg, #78350f 0%, #b45309 60%, #d97706 100%)',
          accent: '#fef3c7',
        };
      case 'geometric-emerald':
        return {
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 60%, #059669 100%)',
          accent: '#d1fae5',
        };
      case 'geometric-indigo':
        return {
          background: 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 60%, #4f46e5 100%)',
          accent: '#e0e7ff',
        };
      case 'geometric-cyan':
        return {
          background: 'linear-gradient(135deg, #164e63 0%, #0e7490 60%, #0891b2 100%)',
          accent: '#cffafe',
        };
      default:
        return {
          background: 'linear-gradient(135deg, #0f172a 0%, #334155 60%, #475569 100%)',
          accent: '#f1f5f9',
        };
    }
  };

  const coverStyle = getCoverStyles();

  return (
    <div className="religion-card">
      {/* Couverture sobre & respectueuse */}
      <div className="religion-card-cover" style={{ background: coverStyle.background }}>
        <div className="religion-card-cover-pattern" />

        {/* Badges Flottants : Type et Accès */}
        <div className="card-top-badges">
          <span className="card-type-badge">
            {formatContentType(resource.contentType)}
          </span>
          {resource.accessLevel === 'premium' ? (
            <span className="card-access-badge premium">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>Premium</span>
            </span>
          ) : (
            <span className="card-access-badge free">
              <span>Gratuit</span>
            </span>
          )}
        </div>

        {/* Motif symbolique épuré au centre */}
        <div className="card-cover-ornament">
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke={coverStyle.accent} strokeWidth="1.2" strokeOpacity="0.4">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3a9 9 0 0 0 9 9" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        </div>

        {/* Année si disponible */}
        {resource.year && (
          <div className="card-cover-year">
            <span>{resource.year > 0 ? resource.year : `${Math.abs(resource.year)} av. J.-C.`}</span>
            {resource.period && <span className="year-period">({resource.period})</span>}
          </div>
        )}
      </div>

      {/* Corps de la carte */}
      <div className="religion-card-body">
        {/* Titre */}
        <h3 className="religion-card-title" title={resource.title}>
          {resource.title}
        </h3>

        {/* Auteur */}
        <p className="religion-card-author">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>{resource.author}</span>
        </p>

        {/* Description */}
        <p className="religion-card-desc">{resource.description}</p>

        {/* Détails techniques : Pages / Langue */}
        <div className="religion-card-specs">
          {resource.pagesCount && (
            <span className="spec-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span>{resource.pagesCount} pages</span>
            </span>
          )}
          {resource.duration && (
            <span className="spec-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{resource.duration}</span>
            </span>
          )}
          <span className="spec-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>{resource.language.split('/')[0].trim()}</span>
          </span>
        </div>

        {/* Bouton d'action Consulter */}
        <div className="religion-card-footer">
          <button
            type="button"
            className="religion-btn-consult"
            onClick={() => onConsult(resource)}
          >
            <span>Consulter</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
