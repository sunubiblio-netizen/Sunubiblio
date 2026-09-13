'use client';

import React from 'react';

interface LibraryPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const LibraryPagination: React.FC<LibraryPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <nav className="pagination-wrapper" aria-label="Pagination de la bibliothèque">
      {/* Previous button */}
      <button
        type="button"
        className="page-nav-btn"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Page précédente"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        <span className="btn-text">Précédent</span>
      </button>

      {/* Pages list */}
      <div className="pages-list">
        {getPageNumbers().map((p, idx) => {
          if (p === '...') {
            return (
              <span key={`ellipsis-${idx}`} className="page-ellipsis">
                …
              </span>
            );
          }

          const pageNum = p as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              type="button"
              className={`page-num-btn ${isActive ? 'active' : ''}`}
              onClick={() => onPageChange(pageNum)}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next button */}
      <button
        type="button"
        className="page-nav-btn"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Page suivante"
      >
        <span className="btn-text">Suivant</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>

      <style jsx>{`
        .pagination-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin: 40px 0 20px 0;
          user-select: none;
        }

        .page-nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: var(--radius-full);
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.85);
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
          transition: all 0.2s ease;
        }

        .page-nav-btn:hover:not(:disabled) {
          border-color: rgba(99, 102, 241, 0.4);
          color: #4f46e5;
          background: #f8fafc;
        }

        .page-nav-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .pages-list {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .page-num-btn {
          min-width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13.5px;
          font-weight: 600;
          color: #475569;
          background: transparent;
          border: 1px solid transparent;
          transition: all 0.15s ease;
        }

        .page-num-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .page-num-btn.active {
          background: #4f46e5;
          color: #ffffff;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(79, 70, 229, 0.35);
        }

        .page-ellipsis {
          padding: 0 6px;
          color: #94a3b8;
          font-weight: 700;
        }

        @media (max-width: 640px) {
          .btn-text {
            display: none;
          }
          .page-nav-btn {
            padding: 8px 10px;
          }
        }
      `}</style>
    </nav>
  );
};
