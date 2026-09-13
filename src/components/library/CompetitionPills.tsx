'use client';

import React from 'react';
import { COMPETITION_TAGS } from '@/data/mockLibrary';

interface CompetitionPillsProps {
  selectedCompetition?: string;
  onSelectCompetition: (tagId: string) => void;
}

export const CompetitionPills: React.FC<CompetitionPillsProps> = ({
  selectedCompetition,
  onSelectCompetition,
}) => {
  return (
    <div className="comp-pills-card">
      <div className="comp-header">
        <div className="comp-title-wrap">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
            <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
          </svg>
          <span className="comp-title">Préparation aux Concours & Examens Nationaux</span>
        </div>
        {selectedCompetition && (
          <button
            type="button"
            className="comp-reset-btn"
            onClick={() => onSelectCompetition('')}
          >
            Tous les concours
          </button>
        )}
      </div>

      <div className="comp-pills-list">
        {COMPETITION_TAGS.map((comp) => {
          const isActive = selectedCompetition === comp.id;
          return (
            <button
              key={comp.id}
              type="button"
              className={`comp-chip ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCompetition(isActive ? '' : comp.id)}
            >
              <span className="comp-chip-label">{comp.label}</span>
              <span className="comp-chip-count">{comp.count}</span>
            </button>
          );
        })}
      </div>

      <style jsx>{`
        .comp-pills-card {
          background: #ffffff;
          border: 1px solid rgba(236, 72, 153, 0.2);
          border-radius: var(--radius-lg);
          padding: 14px 18px;
          margin-bottom: 24px;
          box-shadow: 0 4px 16px -2px rgba(236, 72, 153, 0.04);
        }

        .comp-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .comp-title-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .comp-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #0f172a;
        }

        .comp-reset-btn {
          font-size: 12px;
          font-weight: 600;
          color: #ec4899;
          background: rgba(236, 72, 153, 0.08);
          padding: 3px 9px;
          border-radius: var(--radius-full);
          transition: all 0.15s ease;
        }

        .comp-reset-btn:hover {
          background: rgba(236, 72, 153, 0.15);
        }

        .comp-pills-list {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .comp-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: var(--radius-full);
          background: #faf8ff;
          border: 1px solid rgba(226, 232, 240, 0.85);
          font-size: 12.5px;
          font-weight: 600;
          color: #475569;
          transition: all 0.2s ease;
        }

        .comp-chip:hover {
          border-color: rgba(236, 72, 153, 0.4);
          color: #ec4899;
          transform: translateY(-1px);
        }

        .comp-chip.active {
          background: linear-gradient(135deg, #ec4899 0%, #d946ef 100%);
          color: #ffffff;
          border-color: transparent;
          box-shadow: 0 2px 8px rgba(236, 72, 153, 0.3);
        }

        .comp-chip-count {
          font-size: 11px;
          background: rgba(0, 0, 0, 0.06);
          padding: 1px 6px;
          border-radius: 9999px;
          font-weight: 700;
        }

        .comp-chip.active .comp-chip-count {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }
      `}</style>
    </div>
  );
};
