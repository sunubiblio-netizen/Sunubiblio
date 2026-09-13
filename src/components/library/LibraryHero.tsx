'use client';

import React, { useState } from 'react';

interface LibraryHeroProps {
  initialSearch?: string;
  onSearch: (query: string) => void;
  onSelectPopularTag: (tag: string) => void;
}

const POPULAR_SEARCHES = [
  'Mathématiques',
  'Annales',
  'Baccalauréat',
  'Informatique',
  'Sciences',
  'Français',
];

export const LibraryHero: React.FC<LibraryHeroProps> = ({
  initialSearch = '',
  onSearch,
  onSelectPopularTag,
}) => {
  const [query, setQuery] = useState(initialSearch);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <section className="lib-hero-wrapper">
      {/* Abstract visual background accents inspired by Sunubiblio logo */}
      <div className="lib-hero-ambient" aria-hidden="true">
        <div className="ambient-blob blob-blue" />
        <div className="ambient-blob blob-purple" />
        <div className="ambient-blob blob-rose" />
        <div className="ambient-pattern" />
      </div>

      <div className="container lib-hero-container">
        {/* Compact Breadcrumb / Pill */}
        <div className="badge-pill lib-badge">
          <span className="badge-dot" />
          <span>Bibliothèque Universelle & Savoirs</span>
        </div>

        {/* Title & Subtitle */}
        <h1 className="lib-hero-title">
          Explorez la bibliothèque <span className="gradient-hero-text">Sunubiblio</span>
        </h1>
        <p className="lib-hero-subtitle">
          Des milliers de livres, cours, annales, exercices et documents pour apprendre,
          réviser et progresser à votre propre rythme.
        </p>

        {/* Big Search Bar Capsule */}
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

        {/* Popular Searches Row */}
        <div className="popular-row">
          <span className="popular-title">Recherches populaires :</span>
          <div className="popular-tags-list">
            {POPULAR_SEARCHES.map((tag) => (
              <button
                key={tag}
                type="button"
                className="popular-tag-btn"
                onClick={() => {
                  setQuery(tag);
                  onSelectPopularTag(tag);
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .lib-hero-wrapper {
          position: relative;
          padding: 48px 0 32px 0;
          overflow: hidden;
          background: linear-gradient(180deg, rgba(248, 250, 252, 0.6) 0%, rgba(250, 248, 255, 0.95) 100%);
          border-bottom: 1px solid rgba(226, 232, 240, 0.75);
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
          opacity: 0.45;
        }

        .blob-blue {
          width: 380px;
          height: 380px;
          top: -120px;
          left: 5%;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%);
        }

        .blob-purple {
          width: 440px;
          height: 440px;
          top: -80px;
          right: 8%;
          background: radial-gradient(circle, rgba(147, 51, 234, 0.2) 0%, transparent 70%);
        }

        .blob-rose {
          width: 320px;
          height: 320px;
          bottom: -60px;
          left: 45%;
          background: radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%);
        }

        .ambient-pattern {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(99, 102, 241, 0.08) 1px, transparent 1px);
          background-size: 24px 24px;
          opacity: 0.6;
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
          border: 1.5px solid rgba(99, 102, 241, 0.25);
          box-shadow: 0 12px 36px -6px rgba(79, 70, 229, 0.12), 0 2px 8px rgba(15, 23, 42, 0.04);
          transition: all var(--transition-normal);
        }

        .lib-search-capsule:focus-within {
          border-color: #6366f1;
          box-shadow: 0 16px 40px -4px rgba(99, 102, 241, 0.22), 0 0 0 3px rgba(99, 102, 241, 0.15);
          transform: translateY(-1px);
        }

        .lib-search-icon {
          color: #6366f1;
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
        }

        /* Popular searches */
        .popular-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 20px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .popular-title {
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
        }

        .popular-tags-list {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .popular-tag-btn {
          font-size: 12.5px;
          font-weight: 600;
          color: #475569;
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(226, 232, 240, 0.85);
          padding: 5px 13px;
          border-radius: var(--radius-full);
          transition: all 0.2s ease;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
        }

        .popular-tag-btn:hover {
          color: #4f46e5;
          border-color: rgba(99, 102, 241, 0.4);
          background: #ffffff;
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(79, 70, 229, 0.08);
        }

        @media (max-width: 640px) {
          .lib-hero-wrapper {
            padding: 28px 0 24px 0;
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

          .popular-row {
            margin-top: 16px;
            gap: 8px;
          }
        }
      `}</style>
    </section>
  );
};
