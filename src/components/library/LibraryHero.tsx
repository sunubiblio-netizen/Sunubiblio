'use client';

import React, { useState } from 'react';

interface LibraryHeroProps {
  initialSearch?: string;
  onSearch: (query: string) => void;
  onSelectPopularTag?: (tag: string) => void;
}

export const LibraryHero: React.FC<LibraryHeroProps> = ({
  initialSearch = '',
  onSearch,
}) => {
  const [query, setQuery] = useState(initialSearch);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <section className="lib-hero-wrapper">
      {/* Visual background accents harmonisés blanc et crème de base */}
      <div className="lib-hero-ambient" aria-hidden="true">
        <div className="ambient-blob blob-sun" />
      </div>

      <div className="container lib-hero-container">
        {/* Compact Badge */}
        <div className="badge-pill lib-badge">
          <span className="badge-dot" />
          <span>Bibliothèque Universelle & Savoirs</span>
        </div>

        {/* Title & Condensed Catchy Subtitle */}
        <h1 className="lib-hero-title">
          Explorez la bibliothèque Sunubiblio
        </h1>
        <p className="lib-hero-subtitle">
          Des milliers de ressources pour apprendre et progresser à votre propre rythme.
        </p>

        {/* Search Bar Capsule */}
        <form onSubmit={handleSubmit} className="lib-search-capsule">
          <div className="lib-search-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            type="text"
            className="lib-search-input"
            placeholder="Rechercher un livre, un cours, une annale, un exercice..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Rechercher dans la bibliothèque"
          />
          {query && (
            <button
              type="button"
              className="lib-search-clear"
              onClick={() => {
                setQuery('');
                onSearch('');
              }}
              aria-label="Effacer la recherche"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
          <button type="submit" className="btn-primary lib-search-btn">
            <span>Rechercher</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </form>
      </div>

      <style jsx>{`
        .lib-hero-wrapper {
          position: relative;
          padding: 48px 0 32px 0;
          overflow: hidden;
          background: transparent;
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
        }

        .lib-hero-ambient {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .ambient-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.55;
        }

        .blob-sun {
          width: 520px;
          height: 340px;
          top: -80px;
          left: 50%;
          transform: translateX(-50%);
          background: radial-gradient(circle, rgba(254, 240, 138, 0.35) 0%, rgba(254, 249, 195, 0.2) 50%, transparent 75%);
        }

        .lib-hero-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 920px;
        }

        .lib-badge {
          margin-bottom: 16px;
          background: #ffffff !important;
          border: 1.5px solid #fde047 !important;
          color: #854d0e !important;
          box-shadow: 0 2px 8px rgba(234, 179, 8, 0.08);
        }

        .lib-badge :global(.badge-dot) {
          background-color: #eab308 !important;
          box-shadow: 0 0 8px rgba(234, 179, 8, 0.6) !important;
        }

        .lib-hero-title {
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 800;
          color: #0f172a;
          line-height: 1.18;
          letter-spacing: -0.03em;
          margin-bottom: 14px;
        }

        .lib-hero-subtitle {
          font-size: clamp(15px, 2vw, 17px);
          color: #64748b;
          line-height: 1.55;
          max-width: 680px;
          margin-bottom: 28px;
        }

        /* Search Capsule */
        .lib-search-capsule {
          width: 100%;
          max-width: 760px;
          display: flex;
          align-items: center;
          gap: 10px;
          background: #ffffff;
          padding: 8px 10px 8px 18px;
          border-radius: var(--radius-full);
          border: 1.5px solid rgba(226, 232, 240, 0.9);
          box-shadow: 0 10px 30px -4px rgba(15, 23, 42, 0.05), 0 2px 8px rgba(15, 23, 42, 0.02);
          transition: all var(--transition-normal);
        }

        .lib-search-capsule:focus-within {
          border-color: rgba(234, 179, 8, 0.5);
          box-shadow: 0 12px 32px -4px rgba(234, 179, 8, 0.12), 0 0 0 3px rgba(254, 240, 138, 0.35);
          transform: translateY(-1px);
        }

        .lib-search-icon {
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .lib-search-input {
          flex: 1;
          font-size: 15px;
          font-weight: 500;
          color: #0f172a;
          background: transparent;
          min-width: 0;
        }

        .lib-search-input::placeholder {
          color: #94a3b8;
          font-weight: 400;
        }

        .lib-search-clear {
          color: #94a3b8;
          padding: 6px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .lib-search-clear:hover {
          color: #0f172a;
          background: #f1f5f9;
        }

        .lib-search-btn {
          flex-shrink: 0;
          padding: 10px 22px;
          font-size: 14px;
          background: #0f172a !important;
          color: #ffffff !important;
          border: none !important;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15) !important;
        }

        @media (max-width: 640px) {
          .lib-hero-wrapper {
            padding: 24px 0 20px 0;
          }

          .lib-hero-title {
            font-size: 24px;
            margin-bottom: 8px;
          }

          .lib-hero-subtitle {
            font-size: 14px;
            margin-bottom: 20px;
          }

          .lib-search-capsule {
            padding: 6px 8px 6px 14px;
            gap: 6px;
          }

          .lib-search-input {
            font-size: 14px;
          }

          .lib-search-btn span {
            display: none;
          }

          .lib-search-btn {
            padding: 9px 12px;
            border-radius: 50%;
          }
        }
      `}</style>
    </section>
  );
};
