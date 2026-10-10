'use client';

import React, { useState, useEffect } from 'react';

interface HeroSectionProps {
  onSearch?: (query: string) => void;
  onTagClick?: (tag: string) => void;
}

const SEARCH_PHRASES = [
  'Rechercher un livre, un cours, un concours...',
  'Une première au Sénégal',
  'Bibliothèque numérique complète',
  'Des milliers d’ouvrages à explorer',
  'Préparez vos examens & concours...',
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect on the search bar placeholder
  useEffect(() => {
    if (searchQuery) return;

    const currentPhrase = SEARCH_PHRASES[phraseIndex % SEARCH_PHRASES.length];
    let timer: NodeJS.Timeout;

    if (!isDeleting && displayText === currentPhrase) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
    } else if (isDeleting && displayText === '') {
      timer = setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % SEARCH_PHRASES.length);
      }, 400);
    } else {
      const speed = isDeleting ? 30 : 60;
      timer = setTimeout(() => {
        const nextText = isDeleting
          ? currentPhrase.substring(0, displayText.length - 1)
          : currentPhrase.substring(0, displayText.length + 1);
        setDisplayText(nextText);
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, phraseIndex, searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <section className="hero-eclipse-section">
      <div className="container hero-center-container">
        {/* Brandmark pill at top */}
        <div className="hero-brand-badge">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="brand-flower-icon">
            <rect x="2" y="2" width="9" height="9" rx="3" fill="#f97316" />
            <rect x="13" y="2" width="9" height="9" rx="3" fill="#ea580c" />
            <rect x="2" y="13" width="9" height="9" rx="3" fill="#ea580c" />
            <rect x="13" y="13" width="9" height="9" rx="3" fill="#f97316" />
          </svg>
          <span className="hero-brand-name">SUNUBIBLIO</span>
        </div>

        {/* Title — Clean bold modern font: "Explorez" in pure white + "le savoir" in warm fiery orange */}
        <h1 className="hero-eclipse-title">
          Explorez <span className="hero-title-accent">le savoir</span>
        </h1>

        {/* Subtitle / Description */}
        <p className="hero-eclipse-subtitle">
          Des milliers d’ouvrages, cours et annales
        </p>

        {/* Search Capsule dark & warm amber glow */}
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
            placeholder={searchQuery ? '' : displayText}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Rechercher un livre, un cours, un concours"
          />
          <button
            type="submit"
            className="hero-action-orange-btn"
            aria-label="Lancer la recherche"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </form>

        {/* Tagline under search capsule */}
        <div className="hero-tags-motto">
          <span>Apprendre</span>
          <span className="motto-dot">•</span>
          <span>Explorer</span>
          <span className="motto-dot">•</span>
          <span>Réussir</span>
        </div>

        {/* Bottom Resources & Partners Strip */}
        <div className="hero-bottom-resources">
          <span className="resources-heading">NOS RESSOURCES ET PARTENAIRES</span>
          <div className="resources-grid">
            <div className="resource-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span>Bibliothèques numériques</span>
            </div>

            <div className="resource-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
              <span>Cours en ligne</span>
            </div>

            <div className="resource-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span>Annales & Concours</span>
            </div>

            <div className="resource-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Ressources éducatives</span>
            </div>

            <div className="resource-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>Accès hors ligne</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-eclipse-section {
          position: relative;
          padding: 20px 0 30px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        .hero-center-container {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 980px;
          padding: 0 16px;
          width: 100%;
        }

        .hero-brand-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          margin-bottom: 16px;
        }

        .hero-brand-name {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.35em;
          color: #a1a1aa;
          text-transform: uppercase;
        }

        .hero-eclipse-title {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          font-size: clamp(38px, 5.5vw, 68px);
          font-weight: 800;
          color: #ffffff;
          line-height: 1.1;
          letter-spacing: -0.025em;
          margin: 0 0 12px 0;
          text-align: center;
        }

        .hero-title-accent {
          background: linear-gradient(135deg, #ff9a3d 0%, #ea580c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-eclipse-subtitle {
          font-size: clamp(14px, 1.8vw, 17px);
          font-weight: 450;
          color: #a1a1aa;
          line-height: 1.4;
          margin: 0 0 28px 0;
          text-align: center;
        }

        /* Search Capsule dark & warm amber glow */
        .hero-search-capsule {
          position: relative;
          width: 100%;
          max-width: 660px;
          display: flex;
          align-items: center;
          padding: 6px 8px 6px 20px;
          border-radius: var(--radius-full);
          background: rgba(22, 18, 16, 0.76);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow:
            0 14px 40px -8px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(234, 88, 12, 0.25);
          transition: all 0.25s ease;
        }

        .hero-search-capsule:focus-within {
          border-color: rgba(249, 115, 22, 0.6);
          box-shadow:
            0 20px 50px -8px rgba(0, 0, 0, 0.8),
            0 0 25px rgba(234, 88, 12, 0.35),
            0 0 0 2px rgba(249, 115, 22, 0.3);
          transform: translateY(-1px);
        }

        .search-icon-wrap {
          color: #71717a;
          margin-right: 12px;
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .hero-search-input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 15px;
          font-weight: 500;
          color: #ffffff;
          outline: none;
          min-width: 0;
        }

        .hero-search-input::placeholder {
          color: #71717a;
        }

        .hero-action-orange-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #ffffff;
          box-shadow: 0 4px 16px rgba(234, 88, 12, 0.5);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          flex-shrink: 0;
        }

        .hero-action-orange-btn:hover {
          transform: scale(1.06);
          box-shadow: 0 6px 20px rgba(234, 88, 12, 0.7);
        }

        .hero-action-orange-btn:active {
          transform: scale(0.96);
        }

        .hero-tags-motto {
          margin-top: 22px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13.5px;
          font-weight: 500;
          color: #71717a;
        }

        .motto-dot {
          color: #52525b;
          font-size: 10px;
        }

        /* Bottom Resources Strip */
        .hero-bottom-resources {
          margin-top: 50px;
          width: 100%;
          max-width: 960px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
        }

        .resources-heading {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.25em;
          color: #71717a;
          text-transform: uppercase;
        }

        .resources-grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 36px;
          width: 100%;
        }

        .resource-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #a1a1aa;
          font-size: 13.5px;
          font-weight: 500;
          transition: color 0.15s ease;
        }

        .resource-item:hover {
          color: #f97316;
        }

        @media (max-width: 768px) {
          .hero-bottom-resources {
            margin-top: 36px;
          }

          .resources-grid {
            gap: 20px 24px;
          }
        }

        @media (max-width: 640px) {
          .hero-eclipse-section {
            padding: 8px 0 16px 0;
          }

          .hero-center-container {
            padding: 0 12px;
          }

          .hero-brand-badge {
            margin-bottom: 8px;
            gap: 4px;
          }

          .hero-brand-name {
            font-size: 10px;
            letter-spacing: 0.3em;
          }

          .hero-eclipse-title {
            font-size: clamp(26px, 7.5vw, 34px);
            margin-bottom: 6px;
          }

          .hero-eclipse-subtitle {
            font-size: 12.5px;
            margin-bottom: 16px;
          }

          .hero-search-capsule {
            padding: 4px 6px 4px 14px;
          }

          .hero-search-input {
            font-size: 13.5px;
          }

          .hero-action-orange-btn {
            width: 36px;
            height: 36px;
          }

          .hero-tags-motto {
            font-size: 11.5px;
            gap: 8px;
            margin-top: 12px;
          }

          .hero-bottom-resources {
            margin-top: 20px;
            gap: 12px;
          }

          .resources-heading {
            font-size: 10px;
            letter-spacing: 0.2em;
          }

          .resources-grid {
            gap: 8px 12px;
          }

          .resource-item {
            font-size: 11px;
            gap: 5px;
          }

          .resource-item svg {
            width: 15px;
            height: 15px;
          }
        }
      `}</style>
    </section>
  );
};
