'use client';

import React, { useState } from 'react';
import { POPULAR_CONTEST_TAGS } from '@/data/mockContests';

interface ContestHeroProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
  onTagClick: (tag: string) => void;
}

export const ContestHero: React.FC<ContestHeroProps> = ({
  initialQuery = '',
  onSearch,
  onTagClick,
}) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <section className="contest-hero-wrapper">
      <div className="container contest-hero-container">
        {/* Pill Badge matching Image 2 */}
        <div className="contest-badge-pill">
          <span className="badge-pulse-dot" />
          <span>Portail officiel des concours nationaux</span>
        </div>

        {/* Centered Title with golden-amber gradient accent */}
        <h1 className="contest-hero-title">
          Préparez vos <span className="contest-title-accent">concours</span> avec méthode
        </h1>

        {/* Subtitle */}
        <p className="contest-hero-subtitle">
          Retrouvez les programmes officiels, annales, corrections détaillées,
          fascicules méthodologiques et QCM interactifs pour réussir vos concours au Sénégal.
        </p>

        {/* Universal Search Capsule */}
        <form onSubmit={handleSubmit} className="contest-search-capsule">
          <div className="search-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            type="text"
            className="contest-search-input"
            placeholder="Rechercher un concours, une école, un diplôme (ex : ENA, FASTEF, Douane)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Rechercher un concours"
          />
          {query && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => {
                setQuery('');
                onSearch('');
              }}
              aria-label="Effacer la recherche"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
          <button type="submit" className="contest-search-btn">
            <span>Rechercher</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </form>

        {/* Popular Contests Tags */}
        <div className="popular-contests-row">
          <span className="popular-label">Concours populaires :</span>
          <div className="popular-tags-list">
            {POPULAR_CONTEST_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                className="popular-contest-chip"
                onClick={() => {
                  setQuery(tag);
                  onTagClick(tag);
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .contest-hero-wrapper {
          position: relative;
          padding: 48px 0 36px 0;
          background: #ffffff;
          border-bottom: none;
        }

        .contest-hero-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 920px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .contest-badge-pill {
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

        .contest-hero-title {
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 800;
          color: #0f172a;
          line-height: 1.18;
          letter-spacing: -0.03em;
          margin-bottom: 14px;
        }

        .contest-title-accent {
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline;
        }

        .contest-hero-subtitle {
          font-size: clamp(15px, 2vw, 17px);
          color: #64748b;
          line-height: 1.55;
          max-width: 680px;
          margin-bottom: 28px;
        }

        /* Search Capsule */
        .contest-search-capsule {
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
          margin-bottom: 22px;
        }

        .contest-search-capsule:focus-within {
          border-color: rgba(245, 158, 11, 0.6);
          box-shadow: 0 12px 32px -4px rgba(245, 158, 11, 0.12), 0 0 0 3px rgba(254, 240, 138, 0.35);
          transform: translateY(-1px);
        }

        .search-icon-wrap {
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .contest-search-input {
          flex: 1;
          font-size: 15px;
          font-weight: 500;
          color: #0f172a;
          background: transparent;
          min-width: 0;
          border: none;
          outline: none;
        }

        .contest-search-input::placeholder {
          color: #94a3b8;
          font-weight: 400;
        }

        .search-clear-btn {
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

        .search-clear-btn:hover {
          color: #0f172a;
          background: #f1f5f9;
        }

        .contest-search-btn {
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

        .contest-search-btn:hover {
          background: linear-gradient(135deg, #fbbf24 0%, #ea580c 100%) !important;
          box-shadow: 0 6px 18px rgba(217, 119, 6, 0.45) !important;
          transform: translateY(-1px);
        }

        /* Popular Tags */
        .popular-contests-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .popular-label {
          font-size: 13.5px;
          font-weight: 600;
          color: #64748b;
        }

        .popular-tags-list {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .popular-contest-chip {
          font-size: 12.5px;
          font-weight: 600;
          color: #475569;
          background: #f8fafc;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 9999px;
          padding: 4px 12px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .popular-contest-chip:hover {
          background: #fffbeb;
          border-color: rgba(245, 158, 11, 0.4);
          color: #b45309;
          transform: translateY(-1px);
        }

        @media (max-width: 640px) {
          .contest-hero-wrapper {
            padding: 28px 0 20px 0;
          }

          .contest-badge-pill {
            font-size: 11.5px;
            padding: 4px 12px;
            margin-bottom: 12px;
          }

          .contest-hero-title {
            font-size: 24px;
            margin-bottom: 8px;
          }

          .contest-hero-subtitle {
            font-size: 14px;
            margin-bottom: 20px;
          }

          .contest-search-capsule {
            padding: 4px 6px 4px 14px;
            min-height: 50px;
            gap: 8px;
            border-radius: 9999px;
            margin-bottom: 16px;
          }

          .contest-search-input {
            font-size: 14px;
          }

          .contest-search-btn span {
            display: none;
          }

          .contest-search-btn {
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

          .popular-contests-row {
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};
