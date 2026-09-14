'use client';

import React from 'react';

interface ReligionHeroProps {
  totalCount: number;
  onExploreClick: () => void;
}

export const ReligionHero: React.FC<ReligionHeroProps> = ({
  totalCount,
  onExploreClick,
}) => {
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
            <span>Patrimoine Spirituel &amp; Quête de Sagesse</span>
          </div>
          <span className="religion-hero-count">
            {totalCount} œuvre{totalCount > 1 ? 's' : ''} et traité{totalCount > 1 ? 's' : ''} de référence
          </span>
        </div>

        {/* Titre Principal exact demandé */}
        <h1 className="religion-hero-title">
          Religion, spiritualité <span className="religion-hero-gradient">&amp; connaissance</span>
        </h1>

        {/* Sous-titre exact demandé */}
        <p className="religion-hero-subtitle">
          Découvrez des ressources pour approfondir vos connaissances religieuses, spirituelles et culturelles.
        </p>

        {/* CTA et navigation */}
        <div className="religion-hero-actions">
          <button
            type="button"
            className="btn-primary religion-hero-cta"
            onClick={onExploreClick}
          >
            <span>Explorer les traditions &amp; ressources</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 13l5 5 5-5M12 4v14" />
            </svg>
          </button>
        </div>

        {/* 3 Piliers d'éthique et de neutralité */}
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
