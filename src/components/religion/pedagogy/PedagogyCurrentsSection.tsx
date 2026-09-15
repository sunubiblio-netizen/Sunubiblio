'use client';

import React from 'react';
import { ReligionCurrentBranch } from '@/types/religion';

interface PedagogyCurrentsSectionProps {
  currents: ReligionCurrentBranch[];
  accentColor: string;
  onSelectCurrent: (branchId: string) => void;
  hideHeader?: boolean;
}

export const PedagogyCurrentsSection: React.FC<PedagogyCurrentsSectionProps> = ({
  currents,
  accentColor,
  onSelectCurrent,
  hideHeader = false,
}) => {
  if (!currents || currents.length === 0) return null;

  return (
    <div className="pedagogy-section-inner">
      {!hideHeader && (
        <div className="section-head">
          <div className="section-num-badge" style={{ backgroundColor: accentColor }}>6</div>
          <div>
            <h2 className="section-title">Courants, Confréries & Traditions</h2>
            <p className="section-subtitle">
              Diversité des expressions spirituelles, enracinement local et grandes écoles de pensée.
            </p>
          </div>
        </div>
      )}

      <div className="currents-grid">
        {currents.map((branch) => (
          <div key={branch.id} className="branch-card">
            <div className="branch-top">
              <span className="branch-badge">Courant Spirituel</span>
              {branch.location && (
                <span className="branch-loc">📍 {branch.location}</span>
              )}
            </div>

            <h3 className="branch-title">{branch.title}</h3>
            <p className="branch-subtitle">{branch.subtitle}</p>
            <p className="branch-desc">{branch.description}</p>

            {branch.figures && branch.figures.length > 0 && (
              <div className="branch-figures-box">
                <span className="figures-label">Figures éminentes :</span>
                <span className="figures-list">{branch.figures.join(' • ')}</span>
              </div>
            )}

            <div className="branch-focus-box">
              <span className="focus-label">Enseignement pivot :</span>
              <span className="focus-text">{branch.teachingsFocus}</span>
            </div>

            <div className="branch-footer">
              <span className="branch-count">
                {branch.resourceCount} ressource{branch.resourceCount > 1 ? 's' : ''} disponible{branch.resourceCount > 1 ? 's' : ''}
              </span>
              <button
                type="button"
                className="branch-filter-btn"
                style={{ color: accentColor }}
                onClick={() => onSelectCurrent(branch.id)}
              >
                <span>Voir les ressources</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .pedagogy-section {
          padding: 44px 0;
          border-bottom: 1px solid rgba(226, 232, 240, 0.85);
        }

        .section-head {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 30px;
        }

        .section-num-badge {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          font-weight: 800;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
          flex-shrink: 0;
        }

        .section-title {
          font-size: 26px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.015em;
          margin-bottom: 4px;
        }

        .section-subtitle {
          font-size: 14.5px;
          color: #64748b;
          font-weight: 500;
        }

        .currents-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .branch-card {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 18px;
          padding: 24px;
          box-shadow: 0 3px 12px rgba(15, 23, 42, 0.03);
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .branch-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
        }

        .branch-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }

        .branch-badge {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #4f46e5;
          background: #eef2ff;
          padding: 3px 10px;
          border-radius: 9999px;
        }

        .branch-loc {
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
        }

        .branch-title {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
        }

        .branch-subtitle {
          font-size: 13.5px;
          font-weight: 600;
          color: #059669;
        }

        .branch-desc {
          font-size: 13.5px;
          line-height: 1.6;
          color: #475569;
        }

        .branch-figures-box {
          background: #f8fafc;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 12.5px;
        }

        .figures-label {
          font-weight: 700;
          color: #1e293b;
          margin-right: 6px;
        }

        .figures-list {
          color: #475569;
        }

        .branch-focus-box {
          background: #fffbeb;
          border-left: 3px solid #d97706;
          border-radius: 0 8px 8px 0;
          padding: 10px 12px;
          font-size: 12.5px;
        }

        .focus-label {
          font-weight: 700;
          color: #92400e;
          display: block;
          margin-bottom: 2px;
        }

        .focus-text {
          color: #78350f;
          line-height: 1.45;
        }

        .branch-footer {
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .branch-count {
          font-size: 12.5px;
          font-weight: 600;
          color: #64748b;
        }

        .branch-filter-btn {
          background: transparent;
          border: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 8px;
          transition: background 0.15s;
        }

        .branch-filter-btn:hover {
          background: #f1f5f9;
        }

        @media (max-width: 768px) {
          .currents-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
