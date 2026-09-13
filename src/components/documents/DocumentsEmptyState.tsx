'use client';

import React from 'react';

interface DocumentsEmptyStateProps {
  searchQuery?: string;
  categoryLabel?: string;
  onResetFilters: () => void;
}

export const DocumentsEmptyState: React.FC<DocumentsEmptyStateProps> = ({
  searchQuery,
  categoryLabel,
  onResetFilters,
}) => {
  return (
    <div className="doc-empty-state-card" role="status">
      <div className="doc-empty-icon-wrap">
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6366f1"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      </div>

      <h3 className="doc-empty-title">Aucun document disponible pour le moment</h3>
      
      <p className="doc-empty-description">
        {searchQuery ? (
          <>
            Aucun résultat ne correspond à votre recherche « <strong>{searchQuery}</strong> ».
            Vérifiez l’orthographe ou essayez un mot-clé plus général.
          </>
        ) : categoryLabel ? (
          <>
            Les documents officiels et modèles pour la catégorie « <strong>{categoryLabel}</strong> »
            sont en cours de validation pédagogique et juridique.
          </>
        ) : (
          <>Aucun document ne correspond aux filtres sélectionnés.</>
        )}
      </p>

      <div className="doc-empty-actions">
        <button type="button" className="btn-primary doc-empty-btn" onClick={onResetFilters}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          <span>Afficher tous les documents</span>
        </button>
      </div>
    </div>
  );
};
