'use client';

import React from 'react';
import { Contest } from '@/types/contest';
import { CountryFlag } from './CountryFlag';

interface ContestCardProps {
  contest: Contest;
  onSelectContest: (contest: Contest) => void;
}

export const ContestCard: React.FC<ContestCardProps> = ({
  contest,
  onSelectContest,
}) => {
  const getDomainLabel = (dom: string) => {
    switch (dom) {
      case 'enseignement':
        return 'Enseignement';
      case 'administration':
        return 'Administration publique';
      case 'defense_securite':
        return 'Défense & Sécurité';
      case 'sante':
        return 'Santé & Médecine';
      case 'finance':
        return 'Douanes & Finances';
      case 'technique':
        return 'Ingénierie & Technique';
      default:
        return 'Concours National';
    }
  };

  return (
    <article
      className="contest-card"
      onClick={() => onSelectContest(contest)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectContest(contest);
        }
      }}
      aria-label={`Sélectionner le concours ${contest.name}`}
    >
      {/* SECTION 1 : Zone Image 100% pure et dégagée (sans flou ni badges par-dessus) */}
      <div className="card-banner">
        {contest.coverImage ? (
          <div className="banner-image-wrapper">
            <img
              src={contest.coverImage}
              alt={contest.name}
              className={`contest-cover-media ${contest.id === 'esp_ept' ? 'media-cover' : 'media-contain'}`}
            />
          </div>
        ) : (
          <div className="banner-fallback" style={{ background: contest.coverGradient }}>
            <div className="emblem-box">
              <span className="emblem-initials">{contest.name.slice(0, 3)}</span>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2 : Zone Informations bien séparée sous l'image */}
      <div className="card-body">
        {/* Catégorie & Statut rangés proprement dans la section infos */}
        <div className="info-meta-top">
          <span className="domain-text">{getDomainLabel(contest.domain)}</span>
          <span className={`status-tag ${contest.status}`}>
            {contest.status === 'open' ? '● En cours' : contest.status === 'upcoming' ? '○ À venir' : '✕ Fermé'}
          </span>
        </div>

        {/* Nom du concours + Drapeau + Diplôme */}
        <div className="title-row">
          <div className="contest-title-cluster">
            <h3 className="contest-name">{contest.name}</h3>
            <CountryFlag country={contest.country} size="sm" />
          </div>
          <span className="level-badge">{contest.diplomaLabel}</span>
        </div>

        {/* Description complète */}
        <p className="contest-desc" title={contest.fullName}>
          {contest.fullName}
        </p>

        {/* Ressources & Dates d'épreuves */}
        <div className="meta-specs">
          <div className="spec-row">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <span className="spec-text">{contest.resourcesCount} ressources préparatoires</span>
          </div>
          {contest.examDate && (
            <div className="spec-row">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="spec-text">Épreuves : {contest.examDate}</span>
            </div>
          )}
        </div>

        {/* Bouton d'action */}
        <div className="card-footer">
          <span className="view-action-label">Voir le concours</span>
          <div className="view-action-arrow">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        </div>
      </div>

      <style jsx>{`
        .contest-card {
          background: #ffffff;
          border: 1.5px solid rgba(226, 232, 240, 0.9);
          border-radius: 18px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.03);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          outline: none;
        }

        .contest-card:hover {
          transform: translateY(-4px);
          border-color: rgba(245, 158, 11, 0.45);
          box-shadow: 0 16px 32px -8px rgba(217, 119, 6, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.04);
        }

        /* SECTION 1 : Zone Image pure et séparée */
        .card-banner {
          height: 165px;
          position: relative;
          background: #ffffff;
          border-bottom: 1px solid rgba(226, 232, 240, 0.85);
          overflow: hidden;
          flex-shrink: 0;
        }

        .banner-image-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px 20px;
          background: #ffffff;
        }

        .contest-cover-media {
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          display: block;
        }

        .contest-card:hover .contest-cover-media {
          transform: scale(1.04);
        }

        .contest-cover-media.media-contain {
          max-height: 136px;
          max-width: 92%;
          width: auto;
          height: auto;
          object-fit: contain;
        }

        .contest-cover-media.media-cover {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .banner-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .emblem-box {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .emblem-initials {
          font-size: 15px;
          font-weight: 900;
          color: #ffffff;
          letter-spacing: 0.05em;
        }

        /* SECTION 2 : Zone Informations */
        .card-body {
          padding: 18px 20px 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
          background: #ffffff;
        }

        .info-meta-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 8px;
        }

        .domain-text {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #64748b;
        }

        .status-tag {
          font-size: 10.5px;
          font-weight: 800;
          padding: 2px 9px;
          border-radius: 9999px;
        }

        .status-tag.open {
          background: rgba(16, 185, 129, 0.12);
          color: #059669;
        }

        .status-tag.upcoming {
          background: rgba(59, 130, 246, 0.12);
          color: #2563eb;
        }

        .status-tag.closed {
          background: rgba(100, 116, 139, 0.12);
          color: #475569;
        }

        .title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 8px;
        }

        .contest-title-cluster {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .contest-name {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.02em;
          line-height: 1.2;
          transition: color 0.2s ease;
        }

        .contest-card:hover .contest-name {
          color: #d97706;
        }

        .level-badge {
          font-size: 11px;
          font-weight: 700;
          color: #b45309;
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.22);
          padding: 2px 8px;
          border-radius: 6px;
        }

        .contest-desc {
          font-size: 13px;
          line-height: 1.45;
          color: #64748b;
          margin: 0 0 14px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 38px;
        }

        .meta-specs {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
          padding: 10px 12px;
          background: #f8fafc;
          border-radius: 10px;
          border: 1px solid #f1f5f9;
        }

        .spec-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .spec-text {
          font-size: 12px;
          font-weight: 600;
          color: #475569;
        }

        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid #f1f5f9;
          margin-top: auto;
        }

        .view-action-label {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          transition: color 0.15s ease;
        }

        .contest-card:hover .view-action-label {
          color: #d97706;
        }

        .view-action-arrow {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(245, 158, 11, 0.12);
          color: #d97706;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .contest-card:hover .view-action-arrow {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(217, 119, 6, 0.35);
          transform: translateX(3px);
        }
      `}</style>
    </article>
  );
};
