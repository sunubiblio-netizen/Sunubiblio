'use client';

import React from 'react';

interface PdfEditorHeaderProps {
  documentName: string;
  currentPage: number;
  totalPages: number;
  zoomLevel: number;
  isSaving: boolean;
  saveStatus: 'idle' | 'saving' | 'saved';
  isThumbnailsOpen: boolean;
  onPageChange: (page: number) => void;
  onZoomChange: (delta: number) => void;
  onResetZoom: () => void;
  onToggleThumbnails: () => void;
  onSavePdf: () => void;
}

export const PdfEditorHeader: React.FC<PdfEditorHeaderProps> = ({
  documentName,
  currentPage,
  totalPages,
  zoomLevel,
  isSaving,
  saveStatus,
  isThumbnailsOpen,
  onPageChange,
  onZoomChange,
  onResetZoom,
  onToggleThumbnails,
  onSavePdf,
}) => {
  return (
    <div className="pdf-pro-header">
      {/* 1. Titre & Métadonnées du document */}
      <div className="pdf-pro-header-meta">
        <button
          type="button"
          className={`pdf-toggle-sidebar-btn ${isThumbnailsOpen ? 'active' : ''}`}
          onClick={onToggleThumbnails}
          title="Afficher/Masquer les miniatures de pages"
          aria-label="Afficher/Masquer les miniatures de pages"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
          </svg>
          <span className="btn-label-desktop">Pages</span>
        </button>

        <div className="pdf-doc-title-group">
          <div className="pdf-doc-title-row">
            <span className="pdf-format-badge">PDF</span>
            <span className="pdf-doc-name" title={documentName}>
              {documentName}
            </span>
          </div>
          <span className="pdf-doc-subtitle">Document académique certifié • {totalPages} pages</span>
        </div>
      </div>

      {/* 2. Pagination & Contrôle du Zoom */}
      <div className="pdf-pro-header-controls">
        {/* Pagination */}
        <div className="pdf-pagination-pill">
          <button
            type="button"
            className="pdf-page-nav-btn"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            title="Page précédente"
            aria-label="Page précédente"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span className="pdf-page-display">
            Page <strong>{currentPage}</strong> sur <strong>{totalPages}</strong>
          </span>
          <button
            type="button"
            className="pdf-page-nav-btn"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            title="Page suivante"
            aria-label="Page suivante"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Zoom */}
        <div className="pdf-zoom-group">
          <button
            type="button"
            className="pdf-zoom-btn"
            onClick={() => onZoomChange(-10)}
            disabled={zoomLevel <= 70}
            title="Zoom arrière (Zoom -)"
            aria-label="Zoom arrière"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </button>

          <button
            type="button"
            className="pdf-zoom-val-btn"
            onClick={onResetZoom}
            title="Réinitialiser le zoom à 100%"
          >
            {zoomLevel}%
          </button>

          <button
            type="button"
            className="pdf-zoom-btn"
            onClick={() => onZoomChange(10)}
            disabled={zoomLevel >= 150}
            title="Zoom avant (Zoom +)"
            aria-label="Zoom avant"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </button>
        </div>
      </div>

      {/* 3. Action d'enregistrement & téléchargement */}
      <div className="pdf-pro-header-actions">
        <button
          type="button"
          className={`pdf-save-cta-btn ${saveStatus === 'saved' ? 'is-saved' : ''}`}
          disabled={isSaving}
          onClick={onSavePdf}
        >
          {saveStatus === 'saving' ? (
            <>
              <div className="pdf-spinner-mini" />
              <span>Enregistrement...</span>
            </>
          ) : saveStatus === 'saved' ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>PDF enregistré ✓</span>
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              <span>Enregistrer et télécharger le PDF</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
