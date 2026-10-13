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
    <article className="contest-card" onClick={() => onSelectContest(contest)}>
      {/* Top Banner with official image / emblem */}
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

        <div className="banner-top-meta">
          <span className="domain-pill">{getDomainLabel(contest.domain)}</span>
          <span className={`status-tag ${contest.status}`}>
            {contest.status === 'open' ? '● En cours' : contest.status === 'upcoming' ? '○ À venir' : '✕ Fermé'}
          </span>
        </div>

        <div className="banner-bottom-meta">
          <span className="session-tag">Session {contest.sessionYear}</span>
        </div>
      </div>

      {/* Body */}
      <div className="card-body">
        <div className="title-row">
          <div className="contest-title-cluster">
            <h3 className="contest-name">{contest.name}</h3>
            <CountryFlag country={contest.country} size="sm" />
          </div>
          <span className="level-badge">{contest.diplomaLabel}</span>
        </div>

        <p className="contest-desc" title={contest.fullName}>
          {contest.fullName}
        </p>

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

        {/* Action button */}
        <div className="card-action">
          <button type="button" className="view-contest-btn">
            <span>Voir le concours</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        .contest-card {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.85);
          border-radius: var(--radius-xl);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.03);
          transition: all var(--transition-normal);
          cursor: pointer;
        }

        .contest-card:hover {
          transform: translateY(-4px);
          border-color: rgba(245, 158, 11, 0.45);
          box-shadow: 0 14px 32px -6px rgba(217, 119, 6, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.04);
        }

        .card-banner {
          height: 142px;
          padding: 10px 14px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          background: #f8fafc;
          border-bottom: 1px solid rgba(226, 232, 240, 0.85);
          overflow: hidden;
        }

        .banner-image-wrapper {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px 18px;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
        }

        .contest-cover-media {
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .contest-card:hover .contest-cover-media {
          transform: scale(1.06);
        }

        .contest-cover-media.media-contain {
          max-height: 94px;
          max-width: 88%;
          object-fit: contain;
          filter: drop-shadow(0 2px 8px rgba(15, 23, 42, 0.05));
        }

        .contest-cover-media.media-cover {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .banner-fallback {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .banner-top-meta {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .banner-bottom-meta {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: flex-end;
        }

        .domain-pill {
          font-size: 10.5px;
          font-weight: 700;
          color: #0f172a;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(10px);
          padding: 3px 9px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(226, 232, 240, 0.95);
          box-shadow: 0 1px 4px rgba(15, 23, 42, 0.08);
        }

        .status-tag {
          font-size: 10.5px;
          font-weight: 800;
          padding: 3px 9px;
          border-radius: var(--radius-full);
          backdrop-filter: blur(10px);
          box-shadow: 0 1px 4px rgba(15, 23, 42, 0.08);
        }

        .status-tag.open {
          background: rgba(16, 185, 129, 0.92);
          color: #ffffff;
        }

        .status-tag.upcoming {
          background: rgba(59, 130, 246, 0.92);
          color: #ffffff;
        }

        .status-tag.closed {
          background: rgba(100, 116, 139, 0.92);
          color: #ffffff;
        }

        .emblem-box {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .emblem-initials {
          font-size: 14px;
          font-weight: 900;
          color: #ffffff;
          letter-spacing: 0.05em;
        }

        .session-tag {
          font-size: 11px;
          font-weight: 700;
          color: #475569;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(8px);
          padding: 2px 8px;
          border-radius: 6px;
          border: 1px solid rgba(226, 232, 240, 0.95);
          box-shadow: 0 1px 4px rgba(15, 23, 42, 0.06);
        }

        /* Body */
        .card-body {
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
          gap: 8px;
        }

        .contest-title-cluster {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-width: 0;
          flex-shrink: 0;
        }

        .contest-name {
          font-size: 19px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin: 0;
          line-height: 1.2;
          flex-shrink: 0;
        }

        .level-badge {
          font-size: 11px;
          font-weight: 700;
          color: #4f46e5;
          background: #eef2ff;
          padding: 2px 7px;
          border-radius: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 180px;
        }

        .contest-desc {
          font-size: 13px;
          color: #64748b;
          line-height: 1.45;
          margin-bottom: 14px;
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
          margin-bottom: 18px;
          padding-top: 10px;
          border-top: 1px solid rgba(226, 232, 240, 0.65);
        }

        .spec-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #475569;
          font-weight: 600;
        }

        .card-action {
          margin-top: auto;
          display: flex;
          justify-content: center;
          padding-top: 6px;
        }

        .view-contest-btn {
          width: auto;
          min-width: 160px;
          height: 38px;
          padding: 0 22px;
          font-size: 13px;
          font-weight: 700;
          border-radius: 9999px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
          color: #ffffff !important;
          border: none !important;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(217, 119, 6, 0.25) !important;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .view-contest-btn:hover {
          background: linear-gradient(135deg, #fbbf24 0%, #ea580c 100%) !important;
          box-shadow: 0 6px 16px rgba(217, 119, 6, 0.4) !important;
          transform: translateY(-1px);
        }
      `}</style>
    </article>
  );
};
