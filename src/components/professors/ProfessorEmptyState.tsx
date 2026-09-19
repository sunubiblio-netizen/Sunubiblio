'use client';

import React from 'react';

interface ProfessorEmptyStateProps {
  query?: string;
  onResetFilters: () => void;
}

export const ProfessorEmptyState: React.FC<ProfessorEmptyStateProps> = ({
  query,
  onResetFilters,
}) => {
  return (
    <div className="professors-empty-state-card">
      <div className="empty-icon-wrap">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </div>

      <h3 className="empty-title">
        {query ? `Aucun enseignant trouvé pour « ${query} »` : 'Aucun professeur ne correspond à ces critères'}
      </h3>

      <p className="empty-subtitle">
        Essayez d’élargir vos filtres de recherche. Beaucoup de nos enseignants certifiés proposent également des cours en <strong>Visio en direct</strong> accessibles partout au Sénégal.
      </p>

      <div className="empty-suggestions-box">
        <span className="suggestions-title">Conseils pour trouver un professeur :</span>
        <ul className="suggestions-list">
          <li>Vérifiez l’orthographe de la matière ou du mot-clé recherché.</li>
          <li>Sélectionnez le mode « Visio en direct » pour accéder aux enseignants de toutes les régions.</li>
          <li>Élargissez la tranche tarifaire ou le niveau sélectionné.</li>
        </ul>
      </div>

      <button
        type="button"
        className="btn-reset-empty-filters"
        onClick={onResetFilters}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        <span>Afficher tous les professeurs disponibles</span>
      </button>
    </div>
  );
};
