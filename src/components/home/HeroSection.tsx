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
          {/* Pill Badge au-dessus du titre, centré */}
          <div className="badge-pill hero-badge">
            <span className="badge-dot" />
            <span>Votre réussite, notre priorité</span>
          </div>

          {/* Titre monumental centré */}
          <h1 className="hero-title">
            La bibliothèque numérique{' '}
            <span className="hero-title-accent">
              pour tous vos objectifs
            </span>
          </h1>

          {/* Description centrée */}
          <p className="hero-description">
            Accédez à des milliers de ressources éducatives, de concours,
            d'exercices et de documents pour réussir vos études et atteindre
            vos objectifs professionnels.
          </p>

          {/* Barre de recherche universelle centrée (comme sur la page Bibliothèque) */}
          <form onSubmit={handleSubmit} className="hero-search-capsule">
            <div className="search-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              className="hero-search-input"
              placeholder="Rechercher un livre, un cours, une annale, un document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Rechercher"
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
    </section>
  );
};
