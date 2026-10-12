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
      <div className="container lib-hero-container">
        {/* Pill Badge matching Image 2 */}
        <div className="lib-hero-badge">
          <span className="badge-pulse-dot" />
          <span>Bibliothèque numérique universelle</span>
        </div>

        {/* Title with warm golden-amber gradient accent */}
        <h1 className="lib-hero-title">
          Explorez la <span className="lib-title-accent">bibliothèque</span> Sunubiblio
        </h1>

        {/* Catchy subtitle */}
        <p className="lib-hero-subtitle">
          Découvrez des milliers d’ouvrages, cours, annales et documents certifiés conformes pour enrichir vos connaissances et progresser à votre rythme.
        </p>

        {/* Search Bar Capsule */}
        <form onSubmit={handleSubmit} className="lib-search-capsule">
          <div className="lib-search-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            type="text"
            className="lib-search-input"
            placeholder="Rechercher par titre, auteur, matière..."
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
          <button type="submit" className="lib-search-btn">
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
          padding: 48px 0 36px 0;
          background: #ffffff;
          border-bottom: none;
        }

        .lib-hero-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 920px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .lib-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: rgba(245, 158, 11, 0.08);
          border: 1px solid rgba(245, 158, 11, 0.25);
          border-radius: 9999px;
          font-size: 12.5px;
          font-weight: 700;
          color: #b45309;
          margin-bottom: 16px;
        }

        .badge-pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #f59e0b;
          box-shadow: 0 0 8px rgba(245, 158, 11, 0.6);
        }

        .lib-hero-title {
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 800;
          color: #0f172a;
          line-height: 1.18;
          letter-spacing: -0.03em;
          margin-bottom: 14px;
        }

        .lib-title-accent {
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
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
          max-width: 720px;
          display: flex;
          align-items: center;
          gap: 12px;
          background: #ffffff;
          padding: 6px 8px 6px 22px;
          min-height: 56px;
          border-radius: 9999px;
          border: 1.5px solid rgba(226, 232, 240, 0.95);
          box-shadow: 0 10px 30px -4px rgba(15, 23, 42, 0.05), 0 2px 8px rgba(15, 23, 42, 0.02);
          transition: all 0.2s ease;
        }

        .lib-search-capsule:focus-within {
          border-color: rgba(245, 158, 11, 0.6);
          box-shadow: 0 12px 32px -4px rgba(245, 158, 11, 0.12), 0 0 0 3px rgba(254, 240, 138, 0.35);
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
          border: none;
          outline: none;
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
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .lib-search-clear:hover {
          color: #0f172a;
          background: #f1f5f9;
        }

        .lib-search-btn {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 44px;
          padding: 0 22px;
          font-size: 14px;
          font-weight: 700;
          border-radius: 9999px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
          color: #ffffff !important;
          border: none !important;
          box-shadow: 0 4px 14px rgba(217, 119, 6, 0.35) !important;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .lib-search-btn:hover {
          background: linear-gradient(135deg, #fbbf24 0%, #ea580c 100%) !important;
          box-shadow: 0 6px 18px rgba(217, 119, 6, 0.45) !important;
          transform: translateY(-1px);
        }

        @media (max-width: 640px) {
          .lib-hero-wrapper {
            padding: 28px 0 20px 0;
          }

          .lib-hero-badge {
            font-size: 11.5px;
            padding: 4px 12px;
            margin-bottom: 12px;
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
            padding: 4px 6px 4px 14px;
            min-height: 50px;
            gap: 8px;
            border-radius: 9999px;
          }

          .lib-search-input {
            font-size: 14px;
          }

          .lib-search-btn span {
            display: none;
          }

          .lib-search-btn {
            width: 40px;
            height: 40px;
            min-width: 40px;
            max-width: 40px;
            padding: 0 !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            aspect-ratio: 1 / 1;
          }
        }
      `}</style>
    </section>
  );
};
