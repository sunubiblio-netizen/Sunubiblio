'use client';

import React, { useState, useEffect } from 'react';
import { RotatingResourcesCylinder } from './RotatingResourcesCylinder';

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

        {/* 3D Rotating Cylinder Carousel of Frosted Glass Resource Cards */}
        <RotatingResourcesCylinder />
      </div>

      <style jsx>{`
        .hero-eclipse-section {
          position: relative;
          padding: 10px 0 20px 0;
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
          margin-bottom: 14px;
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
          margin: 0 0 26px 0;
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

        @media (max-width: 640px) {
          .hero-eclipse-section {
            padding: 6px 0 12px 0;
          }

          .hero-center-container {
            padding: 0 12px;
          }

          .hero-brand-badge {
            margin-bottom: 6px;
            gap: 3px;
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
            margin-bottom: 14px;
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
        }
      `}</style>
    </section>
  );
};
