'use client';

import React from 'react';

interface EmptyStateProps {
  onResetFilters: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onResetFilters }) => {
  return (
    <div className="empty-state-card">
      <div className="empty-icon-wrap">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <circle cx="16" cy="9" r="3" stroke="#ec4899" strokeWidth="2" />
          <line x1="18.5" y1="11.5" x2="21" y2="14" stroke="#ec4899" strokeWidth="2" />
        </svg>
      </div>

      <h3 className="empty-title">Aucune ressource trouvée</h3>
      <p className="empty-desc">
        Aucun document ne correspond à vos critères actuels. Essayez de modifier vos filtres,
        votre niveau scolaire ou vos mots-clés de recherche.
      </p>

      <button
        type="button"
        className="btn-primary empty-btn"
        onClick={onResetFilters}
      >
        <span>Réinitialiser les filtres</span>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
      </button>

      <style jsx>{`
        .empty-state-card {
          background: #ffffff;
          border: 1.5px dashed rgba(226, 232, 240, 0.9);
          border-radius: var(--radius-xl);
          padding: 48px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin: 32px 0;
        }

        .empty-icon-wrap {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(236, 72, 153, 0.08) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }

        .empty-title {
          font-size: 19px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .empty-desc {
          font-size: 14.5px;
          color: #64748b;
          max-width: 460px;
          line-height: 1.5;
          margin-bottom: 22px;
        }

        .empty-btn {
          padding: 10px 22px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};
