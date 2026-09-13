'use client';

import React from 'react';
import { PdfPageModel } from './types';

interface PdfPageThumbnailsProps {
  pages: PdfPageModel[];
  currentPage: number;
  onSelectPage: (pageNumber: number) => void;
  onRotatePage: (pageNumber: number) => void;
  onDeletePage: (pageNumber: number) => void;
  onRestorePage: (pageNumber: number) => void;
  onAddPage: () => void;
}

export const PdfPageThumbnails: React.FC<PdfPageThumbnailsProps> = ({
  pages,
  currentPage,
  onSelectPage,
  onRotatePage,
  onDeletePage,
  onRestorePage,
  onAddPage,
}) => {
  const activePages = pages.filter((p) => !p.isDeleted);

  return (
    <aside className="pdf-pro-sidebar" aria-label="Explorateur de pages">
      <div className="sidebar-top-bar">
        <div className="sidebar-count-label">
          <span>Pages</span>
          <span className="sidebar-count-badge">
            {activePages.length} / {pages.length}
          </span>
        </div>
      </div>

      <div className="sidebar-thumbnails-scroll">
        {pages.map((p) => {
          const isActive = p.pageNumber === currentPage;
          const isDeleted = p.isDeleted;

          return (
            <div
              key={p.pageNumber}
              className={`pdf-thumb-item ${isActive ? 'is-active' : ''} ${isDeleted ? 'is-deleted' : ''}`}
            >
              {/* Miniature cliquable */}
              <button
                type="button"
                className="thumb-sheet-btn"
                disabled={isDeleted}
                onClick={() => onSelectPage(p.pageNumber)}
                title={`Aller à la page ${p.pageNumber} : ${p.title}`}
              >
                <div
                  className="thumb-sheet-mockup"
                  style={{ transform: `rotate(${p.rotation}deg)` }}
                >
                  <div className="thumb-header-stripe" />
                  <div className="thumb-lines-stack">
                    <div className="thumb-line w-80" />
                    <div className="thumb-line w-95" />
                    <div className="thumb-line w-60" />
                    <div className="thumb-line w-90" />
                    <div className="thumb-line w-75" />
                  </div>
                  {isDeleted && <div className="thumb-deleted-mask">Supprimée</div>}
                </div>
              </button>

              {/* Barre d'état de la miniature */}
              <div className="thumb-meta-footer">
                <span className="thumb-page-index">Page {p.pageNumber}</span>

                <div className="thumb-actions-bar">
                  {!isDeleted ? (
                    <>
                      <button
                        type="button"
                        className="thumb-action-icon-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRotatePage(p.pageNumber);
                        }}
                        title="Pivoter la page de 90°"
                        aria-label={`Pivoter la page ${p.pageNumber}`}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="23 4 23 10 17 10" />
                          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        className="thumb-action-icon-btn delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePage(p.pageNumber);
                        }}
                        title="Supprimer cette page"
                        aria-label={`Supprimer la page ${p.pageNumber}`}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="thumb-restore-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRestorePage(p.pageNumber);
                      }}
                      title="Restaurer la page"
                    >
                      Restaurer
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bouton Ajouter une page */}
      <div className="sidebar-bottom-actions">
        <button
          type="button"
          className="add-page-btn"
          onClick={onAddPage}
          title="Ajouter une nouvelle page vierge au document"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Ajouter une page</span>
        </button>
      </div>
    </aside>
  );
};
