'use client';

import React from 'react';
import { Contest } from '@/types/contest';

interface PopularContestsProps {
  contests: Contest[];
  onSelectContest: (contest: Contest) => void;
}

export const PopularContests: React.FC<PopularContestsProps> = ({
  contests,
  onSelectContest,
}) => {
  const popularList = contests.filter((c) => c.isPopular);

  return (
    <section className="popular-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <div className="section-dot" />
          <h2 className="section-title">Concours populaires</h2>
        </div>
        <p className="section-subtitle">
          Découvrez les concours nationaux les plus préparés sur Sunubiblio avec leurs annales et corrigés officiels.
        </p>
      </div>

      <div className="popular-grid">
        {popularList.map((contest) => (
          <div
            key={contest.id}
            className="popular-card"
            onClick={() => onSelectContest(contest)}
          >
            {/* Card Header with glowing gradient bar */}
            <div
              className="card-glow-bar"
              style={{ background: contest.coverGradient }}
            />

            <div className="card-top">
              <div className="card-name-row">
                <span className="contest-short-name">{contest.name}</span>
                <span className={`status-pill ${contest.status}`}>
                  {contest.status === 'open' ? '● Ouvert' : '○ À venir'}
                </span>
              </div>
              <h3 className="contest-full-name">{contest.fullName}</h3>
              <span className="contest-diploma-badge">{contest.diplomaLabel}</span>
            </div>

            {/* Preparation Pillars Indicators */}
            <div className="prep-pillars-box">
              <div className="pillar-item">
                <span className="pillar-icon">📚</span>
                <span className="pillar-text">Sujets officiels</span>
              </div>
              <div className="pillar-item">
                <span className="pillar-icon">✓</span>
                <span className="pillar-text">Corrections</span>
              </div>
              <div className="pillar-item">
                <span className="pillar-icon">📝</span>
                <span className="pillar-text">QCM & Tests</span>
              </div>
              <div className="pillar-item">
                <span className="pillar-icon">📖</span>
                <span className="pillar-text">Programme</span>
              </div>
            </div>

            {/* Footer Row */}
            <div className="card-bottom">
              <span className="resources-badge">
                {contest.resourcesCount} ressources
              </span>
              <span className="view-link">
                <span>Voir le concours</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .popular-section {
          margin-bottom: 40px;
        }

        .section-header {
          margin-bottom: 20px;
        }

        .section-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 4px;
        }

        .section-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ec4899;
          box-shadow: 0 0 10px #ec4899;
        }

        .section-title {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .section-subtitle {
          font-size: 14px;
          color: #64748b;
        }

        .popular-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .popular-card {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.85);
          border-radius: var(--radius-xl);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.03);
          transition: all var(--transition-normal);
          cursor: pointer;
          position: relative;
        }

        .popular-card:hover {
          transform: translateY(-4px);
          border-color: rgba(99, 102, 241, 0.35);
          box-shadow: 0 16px 36px -6px rgba(79, 70, 229, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.04);
        }

        .card-glow-bar {
          height: 6px;
          width: 100%;
        }

        .card-top {
          padding: 18px 20px 14px 20px;
          display: flex;
          flex-direction: column;
        }

        .card-name-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .contest-short-name {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .status-pill {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: var(--radius-full);
        }

        .status-pill.open {
          background: #ecfdf5;
          color: #059669;
        }

        .status-pill.upcoming {
          background: #eff6ff;
          color: #2563eb;
        }

        .contest-full-name {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
          line-height: 1.4;
          margin-bottom: 10px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 36px;
        }

        .contest-diploma-badge {
          font-size: 11.5px;
          font-weight: 700;
          color: #4f46e5;
          background: #eef2ff;
          padding: 3px 9px;
          border-radius: 6px;
          width: fit-content;
        }

        /* 4 Pillars */
        .prep-pillars-box {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 6px;
          padding: 10px 20px;
          background: #faf8ff;
          border-top: 1px solid rgba(226, 232, 240, 0.6);
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
        }

        .pillar-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          color: #334155;
          font-weight: 600;
        }

        .pillar-icon {
          color: #4f46e5;
          font-size: 12px;
        }

        /* Bottom */
        .card-bottom {
          padding: 14px 20px;
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .resources-badge {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
        }

        .view-link {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: #4f46e5;
          transition: transform 0.15s ease;
        }

        .popular-card:hover .view-link {
          transform: translateX(3px);
        }

        @media (max-width: 1024px) {
          .popular-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .popular-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};
