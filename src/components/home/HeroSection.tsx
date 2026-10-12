'use client';

import React, { useState } from 'react';

interface HeroSectionProps {
  onSearch?: (query: string) => void;
  onTagClick?: (tag: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <section className="hero-section">
      <div className="container hero-container">
        <div className="hero-content">
          {/* Pill Badge matching Image 2 */}
          <div className="hero-badge-pill">
            <span className="badge-pulse-dot" />
            <span>La plateforme universelle du savoir</span>
          </div>

          {/* Centered Title with warm golden-amber gradient accent */}
          <h1 className="hero-title">
            La bibliothèque numérique<br />de <span className="hero-title-accent">l’excellence</span>
          </h1>

          {/* Subtitle / Description */}
          <p className="hero-description">
            Accédez à des milliers de ressources éducatives, de concours,
            d’exercices et de documents certifiés conformes pour réussir vos études et atteindre vos objectifs.
          </p>

          {/* Search Bar Capsule matching Image 2 */}
          <form onSubmit={handleSubmit} className="hero-search-capsule">
            <div className="search-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              className="hero-search-input"
              placeholder="Rechercher par mot-clé, cours, annales, concours..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Rechercher dans Sunubiblio"
            />
            {searchQuery && (
              <button
                type="button"
                className="hero-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Effacer la recherche"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
            <button
              type="submit"
              className="hero-search-submit"
              aria-label="Lancer la recherche"
            >
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
        .hero-section {
          padding-top: 48px;
          padding-bottom: 36px;
          background: #ffffff;
          border-bottom: none;
          position: relative;
          width: 100%;
        }

        .hero-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          max-width: 920px;
          margin: 0 auto;
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 860px;
          width: 100%;
        }

        .hero-badge-pill {
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

        .hero-title {
          font-size: clamp(28px, 4.2vw, 44px);
          font-weight: 800;
          line-height: 1.18;
          letter-spacing: -0.03em;
          color: #0f172a;
          margin-bottom: 14px;
          text-align: center;
        }

        .hero-title-accent {
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline;
        }

        .hero-description {
          font-size: clamp(15px, 2vw, 17px);
          line-height: 1.55;
          color: #64748b;
          margin-bottom: 28px;
          font-weight: 400;
          text-align: center;
          max-width: 680px;
        }

        /* Search Capsule */
        .hero-search-capsule {
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 720px;
          background: #ffffff;
          border: 1.5px solid rgba(226, 232, 240, 0.95);
          border-radius: 9999px;
          padding: 6px 8px 6px 22px;
          min-height: 56px;
          box-shadow: 0 10px 30px -4px rgba(15, 23, 42, 0.05), 0 2px 8px rgba(15, 23, 42, 0.02);
          transition: all 0.2s ease;
          margin: 0 auto;
        }

        .hero-search-capsule:focus-within {
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

        .hero-search-input {
          flex: 1;
          min-width: 0;
          font-size: 15px;
          font-weight: 500;
          color: #0f172a;
          background: transparent;
          border: none;
          outline: none;
        }

        .hero-search-input::placeholder {
          color: #94a3b8;
          font-weight: 400;
        }

        .hero-search-clear {
          background: transparent;
          border: none;
          color: #94a3b8;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 50%;
          transition: all 0.15s ease;
        }

        .hero-search-clear:hover {
          color: #0f172a;
          background: #f1f5f9;
        }

        .hero-search-submit {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 44px;
          padding: 0 22px;
          border-radius: 9999px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
          color: #ffffff !important;
          font-size: 14px;
          font-weight: 700;
          border: none !important;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(217, 119, 6, 0.35) !important;
          transition: all 0.2s ease;
        }

        .hero-search-submit:hover {
          background: linear-gradient(135deg, #fbbf24 0%, #ea580c 100%) !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(217, 119, 6, 0.45) !important;
        }

        @media (max-width: 640px) {
          .hero-section {
            padding: 28px 0 20px 0;
          }

          .hero-badge-pill {
            font-size: 11.5px;
            padding: 4px 12px;
            margin-bottom: 12px;
          }

          .hero-title {
            font-size: 24px;
            margin-bottom: 8px;
          }

          .hero-description {
            font-size: 14px;
            margin-bottom: 20px;
          }

          .hero-search-capsule {
            padding: 4px 6px 4px 14px;
            min-height: 50px;
            gap: 8px;
            border-radius: 9999px;
          }

          .hero-search-input {
            font-size: 14px;
          }

          .hero-search-submit span {
            display: none;
          }

          .hero-search-submit {
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
