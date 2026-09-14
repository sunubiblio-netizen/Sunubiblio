'use client';

import React from 'react';

interface ReligionEmptyStateProps {
  message?: string;
  onReset?: () => void;
  hasFilter?: boolean;
}

export const ReligionEmptyState: React.FC<ReligionEmptyStateProps> = ({
  message = 'Aucune ressource disponible pour le moment.',
  onReset,
  hasFilter = false,
}) => {
  return (
    <div className="religion-empty-state">
      <div className="empty-state-icon-wrap">
        <svg
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <line x1="9" y1="9" x2="15" y2="9" />
          <line x1="9" y1="13" x2="13" y2="13" />
        </svg>
      </div>

      <h3 className="empty-state-title">{message}</h3>
      <p className="empty-state-desc">
        {hasFilter
          ? 'Aucun document ne correspond à ce filtre thématique pour ce courant. Vous pouvez réinitialiser pour voir toutes les catégories disponibles.'
          : 'Les documents et traités authentiques relatifs à ce thème sont en cours de référencement et de validation patrimoniale.'}
      </p>

      {hasFilter && onReset && (
        <button
          type="button"
          className="btn-secondary empty-state-reset-btn"
          onClick={onReset}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          <span>Afficher toutes les catégories</span>
        </button>
      )}
    </div>
  );
};
