'use client';

import React from 'react';

interface ReligionHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: () => void;
  onSelectTag?: (tag: string) => void;
  totalCount: number;
}

const POPULAR_RELIGION_TAGS = [
  'Mouride / Touba',
  'Tidiane / Tivaouane',
  'Niassène',
  'Layène',
  'Saint Augustin',
  'Maïmonide',
  'Lao Tseu',
  'Hampâté Bâ',
];

export const ReligionHero: React.FC<ReligionHeroProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onSelectTag,
  totalCount,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <section className="lib-hero-wrapper religion-hero-wrapper">
      {/* Abstract visual background accents matching Sunubiblio brand */}
      <div className="lib-hero-ambient" aria-hidden="true">
        <div className="ambient-blob blob-blue" />
        <div className="ambient-blob blob-purple" />
        <div className="ambient-blob blob-rose" />
        <div className="ambient-pattern" />
      </div>

      <div className="container lib-hero-container">
        {/* Badge Pill */}
        <div className="badge-pill lib-badge">
          <span className="badge-dot" />
          <span>Traditions Spirituelles, Sagesses &amp; Savoirs</span>
        </div>

        {/* Title & Subtitle exact prompt: Religion & Spiritualités */}
        <h1 className="lib-hero-title">
          Religion &amp; <span className="gradient-hero-text">Spiritualités</span>
        </h1>
        <p className="lib-hero-subtitle">
          Explorez les grandes traditions spirituelles du monde et découvrez les ressources religieuses et spirituelles du Sénégal.
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
            placeholder="Rechercher un livre, enseignement, texte, conférence, document, auteur, tradition..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Rechercher dans les traditions religieuses et spirituelles"
          />
          {searchQuery && (
            <button
              type="button"
              className="lib-search-clear"
              onClick={() => {
                onSearchChange('');
                onSearchSubmit();
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

        {/* Popular Tags Row */}
        <div className="popular-row">
          <span className="popular-label">Suggestions :</span>
          <div className="popular-tags-scroller">
            {POPULAR_RELIGION_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                className="popular-tag-btn"
                onClick={() => {
                  if (onSelectTag) {
                    onSelectTag(tag);
                  } else {
                    onSearchChange(tag);
                    onSearchSubmit();
                  }
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Reassurance Pillars matching Sunubiblio aesthetic */}
        <div className="religion-pillars-strip">
          <div className="pillar-chip">
            <span className="pillar-dot" style={{ background: '#059669' }} />
            <span>Sources patrimoniales authentiques vérifiées</span>
          </div>
          <div className="pillar-chip">
            <span className="pillar-dot" style={{ background: '#4f46e5' }} />
            <span>Respect &amp; neutralité des différentes voies</span>
          </div>
          <div className="pillar-chip">
            <span className="pillar-dot" style={{ background: '#ec4899' }} />
            <span>{totalCount} œuvres et traités numérisés</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .religion-hero-wrapper {
          position: relative;
          padding: 48px 0 36px 0;
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
          position: relative;
          z-index: 2;
        }

        .lib-badge {
          margin-bottom: 16px;
        }

        .lib-hero-title {
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 800;
          color: #0f172a;
          line-height: 1.18;
          letter-spacing: -0.03em;
          margin-bottom: 14px;
        }

        .gradient-hero-text {
          background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 40%, #ec4899 90%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .lib-hero-subtitle {
          font-size: clamp(15px, 2vw, 17px);
          color: #64748b;
          line-height: 1.55;
          max-width: 720px;
          margin-bottom: 28px;
        }

        .lib-search-capsule {
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 680px;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 9999px;
          padding: 6px 8px 6px 20px;
          box-shadow: 0 10px 30px -4px rgba(79, 70, 229, 0.08), 0 2px 8px rgba(15, 23, 42, 0.03);
          transition: all 0.25s ease;
          margin-bottom: 18px;
        }

        .lib-search-capsule:focus-within {
          border-color: rgba(99, 102, 241, 0.6);
          box-shadow: 0 14px 40px -4px rgba(99, 102, 241, 0.18);
          transform: translateY(-1px);
        }

        .lib-search-icon {
          color: #94a3b8;
          display: flex;
          align-items: center;
          margin-right: 12px;
          flex-shrink: 0;
        }

        .lib-search-input {
          flex: 1;
          min-width: 0;
          font-size: 15px;
          color: #0f172a;
          background: transparent;
          border: none;
          outline: none;
        }

        .lib-search-input::placeholder {
          color: #94a3b8;
        }

        .lib-search-clear {
          background: transparent;
          border: none;
          color: #94a3b8;
          padding: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.15s;
          margin-right: 8px;
        }

        .lib-search-clear:hover {
          color: #0f172a;
        }

        .lib-search-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          border-radius: 9999px;
          font-size: 14px;
          font-weight: 700;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .popular-row {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          max-width: 680px;
          margin-bottom: 22px;
        }

        .popular-label {
          font-size: 13px;
          font-weight: 700;
          color: #6366f1;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .popular-tags-scroller {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
          padding: 2px 0;
        }

        .popular-tag-btn {
          font-size: 12.5px;
          font-weight: 500;
          color: #475569;
          background: rgba(241, 245, 249, 0.85);
          border: 1px solid rgba(226, 232, 240, 0.9);
          padding: 4px 12px;
          border-radius: 9999px;
          transition: all 0.2s ease;
          white-space: nowrap;
          cursor: pointer;
        }

        .popular-tag-btn:hover {
          background: rgba(99, 102, 241, 0.1);
          color: #4f46e5;
          border-color: rgba(99, 102, 241, 0.3);
        }

        .religion-pillars-strip {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
          padding-top: 8px;
        }

        .pillar-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          background: rgba(255, 255, 255, 0.75);
          border: 1px solid rgba(226, 232, 240, 0.8);
          padding: 5px 12px;
          border-radius: 9999px;
        }

        .pillar-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        @media (max-width: 640px) {
          .religion-hero-wrapper {
            padding: 32px 0 24px 0;
          }

          .lib-search-capsule {
            padding: 4px 6px 4px 14px;
          }

          .lib-search-input {
            font-size: 13.5px;
          }

          .lib-search-btn {
            padding: 8px 14px;
            font-size: 13px;
          }

          .popular-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }
        }
      `}</style>
    </section>
  );
};
