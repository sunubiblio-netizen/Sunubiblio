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
        {/* Title Centered */}
        <h1 className="edu-hero-title">
          Votre parcours scolaire commence ici
        </h1>

        {/* Subtitle Centered */}
        <p className="edu-hero-subtitle">
          Explorez les niveaux d’études, découvrez chaque matière et trouvez les ressources adaptées à vos objectifs, conformément aux programmes scolaires officiels du Sénégal.
        </p>

        {/* Search Bar Capsule (Identique exacte à la Bibliothèque) */}
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
          overflow: hidden;
          background: linear-gradient(180deg, transparent 0%, rgba(254, 249, 195, 0.15) 70%, transparent 100%);
          border-bottom: none;
        }

        .edu-hero-ambient {
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

        .edu-hero-title {
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 800;
          color: #0f172a;
          line-height: 1.18;
          letter-spacing: -0.03em;
          margin-bottom: 14px;
        }

        .edu-hero-subtitle {
          font-size: clamp(15px, 2vw, 17px);
          color: #64748b;
          line-height: 1.55;
          max-width: 680px;
          margin-bottom: 28px;
        }

        /* Search Capsule (Exacte réplique de Bibliothèque) */
        .edu-search-capsule {
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

        .edu-search-capsule:focus-within {
          border-color: rgba(234, 179, 8, 0.5);
          box-shadow: 0 12px 32px -4px rgba(234, 179, 8, 0.12), 0 0 0 3px rgba(254, 240, 138, 0.35);
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
          gap: 8px;
          padding: 10px 22px;
          font-size: 14px;
          font-weight: 600;
          border-radius: var(--radius-full);
          background: #0f172a !important;
          color: #ffffff !important;
          border: none !important;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15) !important;
          cursor: pointer;
          transition: all var(--transition-normal);
        }

        .edu-search-btn:hover {
          background: #1e293b !important;
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
            padding: 6px 8px 6px 14px;
            gap: 6px;
          }

          .edu-search-input {
            font-size: 14px;
          }

          .edu-search-btn span {
            display: none;
          }

          .edu-search-btn {
            padding: 9px 12px;
            border-radius: 50%;
          }
        }
      `}</style>
    </section>
  );
};
