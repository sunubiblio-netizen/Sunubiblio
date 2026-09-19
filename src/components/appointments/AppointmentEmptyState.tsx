'use client';

import React from 'react';
import Link from 'next/link';

interface AppointmentEmptyStateProps {
  hasFilters: boolean;
  onResetFilters: () => void;
}

export const AppointmentEmptyState: React.FC<AppointmentEmptyStateProps> = ({
  hasFilters,
  onResetFilters,
}) => {
  if (hasFilters) {
    return (
      <div className="empty-state-root">
        <div className="empty-icon-wrap empty-icon-filter">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
        </div>
        <h3 className="empty-title">Aucun rendez-vous trouvé</h3>
        <p className="empty-desc">
          Aucun rendez-vous ne correspond à vos filtres actuels.
          <br />
          Modifiez vos critères ou réinitialisez les filtres.
        </p>
        <button type="button" className="empty-reset-btn" onClick={onResetFilters}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-3.51" />
          </svg>
          Réinitialiser les filtres
        </button>

        <style jsx>{`
          .empty-state-root {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 60px 24px;
            gap: 14px;
          }

          .empty-icon-wrap {
            width: 72px;
            height: 72px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 4px;
          }

          .empty-icon-filter {
            background: rgba(79, 70, 229, 0.08);
            color: #4f46e5;
          }

          .empty-title {
            font-size: 18px;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.02em;
          }

          .empty-desc {
            font-size: 14px;
            color: #64748b;
            line-height: 1.6;
            max-width: 340px;
          }

          .empty-reset-btn {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            padding: 10px 20px;
            border-radius: 999px;
            background: rgba(79, 70, 229, 0.08);
            color: #4f46e5;
            font-size: 13.5px;
            font-weight: 700;
            border: 1.5px solid rgba(79, 70, 229, 0.2);
            cursor: pointer;
            transition: all 0.18s ease;
          }

          .empty-reset-btn:hover {
            background: rgba(79, 70, 229, 0.14);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="empty-full-root">
      {/* Illustration décorative */}
      <div className="empty-illustration">
        <div className="empty-orb empty-orb-1" />
        <div className="empty-orb empty-orb-2" />
        <div className="empty-icon-main">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
      </div>

      <div className="empty-text-block">
        <h3 className="empty-full-title">Aucun rendez-vous pour le moment</h3>
        <p className="empty-full-desc">
          Vous n'avez pas encore réservé de cours ou de séance.
          <br />
          Trouvez un professeur qualifié et planifiez votre première séance.
        </p>
      </div>

      <div className="empty-actions">
        <Link href="/professeurs" className="empty-cta-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Trouver un professeur
        </Link>
        <p className="empty-hint">Plus de 50 enseignants vérifiés disponibles</p>
      </div>

      <style jsx>{`
        .empty-full-root {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 60px 24px 80px;
          gap: 28px;
        }

        .empty-illustration {
          position: relative;
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .empty-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(18px);
          opacity: 0.5;
        }

        .empty-orb-1 {
          width: 80px;
          height: 80px;
          background: rgba(79, 70, 229, 0.25);
          top: 0;
          left: 0;
        }

        .empty-orb-2 {
          width: 60px;
          height: 60px;
          background: rgba(124, 58, 237, 0.2);
          bottom: 0;
          right: 0;
        }

        .empty-icon-main {
          position: relative;
          z-index: 1;
          width: 72px;
          height: 72px;
          border-radius: 20px;
          background: linear-gradient(135deg, #eef2ff, #f5f3ff);
          border: 1.5px solid rgba(99, 102, 241, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4f46e5;
        }

        .empty-text-block {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 380px;
        }

        .empty-full-title {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.03em;
        }

        .empty-full-desc {
          font-size: 14.5px;
          color: #64748b;
          line-height: 1.65;
        }

        .empty-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .empty-cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 28px;
          border-radius: 12px;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: #ffffff;
          font-size: 14.5px;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(79, 70, 229, 0.35);
          transition: all 0.2s ease;
        }

        .empty-cta-primary:hover {
          box-shadow: 0 6px 24px rgba(79, 70, 229, 0.45);
          transform: translateY(-2px);
        }

        .empty-hint {
          font-size: 12.5px;
          color: #94a3b8;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};
