'use client';

import React, { useState, useEffect } from 'react';

interface EducationHeroProps {
  initialSearch?: string;
  onSearch: (query: string) => void;
  onExploreClick?: () => void;
}

export const EducationHero: React.FC<EducationHeroProps> = ({
  initialSearch = '',
  onSearch,
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
    <section className="edu-hero-wrapper">
      {/* Visual background accents harmonisés blanc et ambre doux (identique à la Bibliothèque) */}
      <div className="edu-hero-ambient" aria-hidden="true">
        <div className="ambient-blob blob-sun" />
      </div>

      <div className="container edu-hero-container">
        {/* Badge officiel harmonisé */}
        <div className="edu-hero-badge">
          <span className="badge-pulse-dot" />
          <span>Programmes officiels du Sénégal</span>
        </div>

        {/* Title Centered & Harmonisé */}
        <h1 className="edu-hero-title">
          Votre <span className="edu-title-accent">parcours scolaire</span> commence ici
        </h1>

        {/* Subtitle Centered */}
        <p className="edu-hero-subtitle">
          Explorez les niveaux d’études, découvrez chaque matière et trouvez les ressources adaptées à vos objectifs, conformément aux programmes scolaires officiels du Sénégal.
        </p>

        {/* Search Bar Capsule */}
        <form onSubmit={handleSubmit} className="edu-search-capsule">
          <div className="edu-search-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            type="text"
            className="edu-search-input"
            placeholder="Rechercher..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Rechercher dans les ressources éducatives"
          />
          {query && (
            <button
              type="button"
              className="edu-search-clear"
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
          <button type="submit" className="edu-search-btn">
            <span>Rechercher</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </form>
      </div>

      <style jsx>{`
        .edu-hero-wrapper {
          position: relative;
          padding: 48px 0 36px 0;
          background: #ffffff;
          border-bottom: none;
        }

        .edu-hero-ambient {
          display: none;
        }

        .edu-hero-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 920px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .edu-hero-badge {
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

        .edu-hero-title {
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 800;
          color: #0f172a;
          line-height: 1.18;
          letter-spacing: -0.03em;
          margin-bottom: 14px;
        }

        .edu-title-accent {
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .edu-hero-subtitle {
          font-size: clamp(15px, 2vw, 17px);
          color: #64748b;
          line-height: 1.55;
          max-width: 680px;
          margin-bottom: 28px;
        }

        /* Search Capsule */
        .edu-search-capsule {
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
          transition: all var(--transition-normal);
        }

        .edu-search-capsule:focus-within {
          border-color: rgba(245, 158, 11, 0.6);
          box-shadow: 0 12px 32px -4px rgba(245, 158, 11, 0.12), 0 0 0 3px rgba(254, 240, 138, 0.35);
          transform: translateY(-1px);
        }

        .edu-search-icon {
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .edu-search-input {
          flex: 1;
          font-size: 15px;
          font-weight: 500;
          color: #0f172a;
          background: transparent;
          min-width: 0;
          border: none;
          outline: none;
        }

        .edu-search-input::placeholder {
          color: #94a3b8;
          font-weight: 400;
        }

        .edu-search-clear {
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

        .edu-search-clear:hover {
          color: #0f172a;
          background: #f1f5f9;
        }

        .edu-search-btn {
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
          transition: all var(--transition-normal);
        }

        .edu-search-btn:hover {
          background: linear-gradient(135deg, #fbbf24 0%, #ea580c 100%) !important;
          box-shadow: 0 6px 18px rgba(217, 119, 6, 0.45) !important;
          transform: translateY(-1px);
        }

        @media (max-width: 640px) {
          .edu-hero-wrapper {
            padding: 24px 0 20px 0;
          }

          .edu-hero-title {
            font-size: 24px;
            margin-bottom: 8px;
          }

          .edu-hero-subtitle {
            font-size: 14px;
            margin-bottom: 20px;
          }

          .edu-search-capsule {
            padding: 5px 6px 5px 16px;
            min-height: 50px;
            gap: 8px;
            border-radius: 9999px;
          }

          .edu-search-input {
            font-size: 14px;
          }

          .edu-search-btn span {
            display: none;
          }

          .edu-search-btn {
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
            box-shadow: 0 4px 12px rgba(217, 119, 6, 0.32) !important;
          }
        }
      `}</style>
    </section>
  );
};
