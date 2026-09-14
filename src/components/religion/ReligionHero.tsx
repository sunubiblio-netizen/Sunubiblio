'use client';

import React from 'react';

interface ReligionHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: () => void;
  totalCount: number;
}

export const ReligionHero: React.FC<ReligionHeroProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  totalCount,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit();
    }
  };

  return (
    <section className="religion-hero-section">
      <div className="religion-hero-bg-overlay" />
      <div className="container religion-hero-container">
        {/* Badge supérieur */}
        <div className="religion-hero-badge-wrap">
          <div className="religion-hero-badge">
            <span className="religion-badge-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </span>
            <span>Patrimoine Spirituel, Éthique &amp; Connaissance</span>
          </div>
          <span className="religion-hero-count">
            {totalCount} œuvre{totalCount > 1 ? 's' : ''} et traité{totalCount > 1 ? 's' : ''} de référence
          </span>
        </div>

        {/* Titre Principal exact demandé : « Religion » */}
        <h1 className="religion-hero-title">
          Religion
        </h1>

        {/* Court texte explicatif */}
        <p className="religion-hero-subtitle">
          Explorez les sources authentiques, traités théologiques et sagesses universelles de l'humanité, avec un éclairage privilégié sur le patrimoine spirituel du Sénégal.
        </p>

        {/* Champ de recherche direct dans le Hero */}
        <div className="religion-hero-search-box">
          <div className="hero-search-input-wrap">
            <svg
              className="hero-search-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748b"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="hero-search-input"
              placeholder="Rechercher un livre, auteur, enseignement (ex: Bamba, Malick Sy, Augustin...)..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {searchQuery && (
              <button
                type="button"
                className="hero-search-clear"
                onClick={() => onSearchChange('')}
                title="Effacer"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="button"
            className="btn-primary hero-search-btn"
            onClick={onSearchSubmit}
          >
            <span>Rechercher</span>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Piliers d'intégrité */}
        <div className="religion-hero-pillars">
          <div className="religion-pillar-item">
            <div className="religion-pillar-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <span className="pillar-title">Sources Authentiques</span>
              <span className="pillar-desc">Textes originaux et éditions patrimoniales vérifiées</span>
            </div>
          </div>

          <div className="religion-pillar-item">
            <div className="religion-pillar-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div>
              <span className="pillar-title">Respect &amp; Neutralité</span>
              <span className="pillar-desc">Présentation sobre et digne des différentes traditions</span>
            </div>
          </div>

          <div className="religion-pillar-item">
            <div className="religion-pillar-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <div>
              <span className="pillar-title">Transmission Pédagogique</span>
              <span className="pillar-desc">Ouvrages numérisés pour l'élévation et l'apprentissage</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
