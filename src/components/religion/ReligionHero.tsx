'use client';

import React, { useState, useEffect } from 'react';

interface ReligionHeroProps {
  initialSearch?: string;
  onSearch: (query: string) => void;
  onExploreClick?: () => void;
}

export const ReligionHero: React.FC<ReligionHeroProps> = ({
  initialSearch = '',
  onSearch,
  onExploreClick,
}) => {
  const [query, setQuery] = useState(initialSearch);

  useEffect(() => {
    setQuery(initialSearch);
  }, [initialSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <>
      <section className="rel-hero-wrapper">
        <div className="rel-hero-ambient" aria-hidden="true">
          <div className="ambient-blob blob-sun" />
        </div>

        <div className="container rel-hero-container">
          {/* Badge officiel harmonisé */}
          <div className="rel-hero-badge">
            <span className="badge-pulse-dot" />
            <span>Bibliothèque Spirituelle Universelle</span>
          </div>

          {/* Title Centered & Harmonisé */}
          <h1 className="rel-hero-title">
            Explorez les <span className="rel-title-accent">patrimoines spirituels</span> &amp; religieux
          </h1>

          {/* Subtitle Centered */}
          <p className="rel-hero-subtitle">
            Découvrez des milliers d’écrits sacrés, ouvrages de référence, traités de sagesse et manuscrits numérisés pour enrichir vos connaissances et nourrir votre réflexion.
          </p>
        </div>
      </section>

      {/* Search Bar Capsule (Sticky au défilement en haut de l'écran) */}
      <div className="rel-search-sticky-stage">
        <div className="container rel-search-sticky-container">
          <form onSubmit={handleSubmit} className="rel-search-capsule">
            <div className="rel-search-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              className="rel-search-input"
              placeholder="Rechercher par titre, auteur, tradition, courant..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Rechercher dans les ressources religieuses et spirituelles"
            />
            {query && (
              <button
                type="button"
                className="rel-search-clear"
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
            <button type="submit" className="rel-search-btn">
              <span>Rechercher</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .rel-hero-wrapper {
          position: relative;
          padding: 64px 0 24px;
          text-align: center;
          overflow: hidden;
          background: #ffffff;
        }

        .rel-hero-ambient {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .ambient-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.45;
        }

        .blob-sun {
          top: -40px;
          left: 50%;
          transform: translateX(-50%);
          width: 520px;
          height: 240px;
          background: radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, rgba(245, 158, 11, 0.08) 60%, transparent 80%);
        }

        .rel-hero-container {
          position: relative;
          z-index: 1;
          max-width: 860px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .rel-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: rgba(245, 158, 11, 0.08);
          border: 1px solid rgba(245, 158, 11, 0.25);
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
          color: #b45309;
          margin-bottom: 20px;
        }

        .badge-pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #f59e0b;
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.7);
        }

        .rel-hero-title {
          font-size: 44px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.2;
          letter-spacing: -0.03em;
          margin: 0 0 16px 0;
        }

        .rel-title-accent {
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
        }

        .rel-hero-subtitle {
          font-size: 16.5px;
          line-height: 1.6;
          color: #475569;
          max-width: 720px;
          margin: 0 0 12px 0;
        }

        /* Sticky Search Capsule Stage */
        .rel-search-sticky-stage {
          position: sticky;
          top: 72px;
          z-index: 40;
          padding: 8px 0 16px;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(241, 245, 249, 0.8);
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.03);
        }

        .rel-search-sticky-container {
          max-width: 780px;
          margin: 0 auto;
        }

        .rel-search-capsule {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 9999px;
          padding: 6px 8px 6px 18px;
          box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.06), 0 8px 10px -6px rgba(15, 23, 42, 0.04);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .rel-search-capsule:focus-within {
          border-color: #f59e0b;
          box-shadow: 0 12px 30px -5px rgba(245, 158, 11, 0.15), 0 0 0 3px rgba(245, 158, 11, 0.15);
        }

        .rel-search-icon {
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .rel-search-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 15px;
          color: #0f172a;
          background: transparent;
          font-weight: 500;
        }

        .rel-search-input::placeholder {
          color: #94a3b8;
          font-weight: 400;
        }

        .rel-search-clear {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.15s ease;
        }

        .rel-search-clear:hover {
          color: #0f172a;
          background: #f1f5f9;
        }

        .rel-search-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #ffffff;
          border: none;
          border-radius: 9999px;
          padding: 10px 22px;
          font-size: 14.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 12px rgba(217, 119, 6, 0.25);
          flex-shrink: 0;
        }

        .rel-search-btn:hover {
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          box-shadow: 0 6px 16px rgba(217, 119, 6, 0.35);
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .rel-hero-wrapper {
            padding: 44px 0 16px;
          }

          .rel-hero-title {
            font-size: 30px;
          }

          .rel-hero-subtitle {
            font-size: 14.5px;
          }

          .rel-search-sticky-stage {
            top: 60px;
            padding: 6px 0 12px;
          }

          .rel-search-capsule {
            padding: 5px 6px 5px 14px;
            gap: 8px;
          }

          .rel-search-input {
            font-size: 13.5px;
          }

          .rel-search-btn {
            padding: 8px 14px;
            font-size: 13px;
          }

          .rel-search-btn span {
            display: none;
          }
        }
      `}</style>
    </>
  );
};
