'use client';

import React from 'react';

interface DocumentsHeroProps {
  totalDocuments: number;
}

export const DocumentsHero: React.FC<DocumentsHeroProps> = ({ totalDocuments }) => {
  return (
    <section className="documents-hero-section">
      <div className="container">
        {/* Badge Pill in standard site theme */}
        <div className="documents-hero-badge-wrap">
          <div className="documents-hero-badge">
            <span className="badge-dot" />
            <span>Espace Documents & Modèles Officiels</span>
          </div>
          <span className="documents-hero-count">
            {totalDocuments} ressource{totalDocuments > 1 ? 's' : ''} vérifiée{totalDocuments > 1 ? 's' : ''}
          </span>
        </div>

        <h1 className="documents-hero-title">
          Documents <span className="gradient-hero-text">utiles</span>
        </h1>
        <p className="documents-hero-subtitle">
          Retrouvez facilement les documents dont vous avez besoin : démarches administratives,
          guides pratiques, formulaires types, textes réglementaires et modèles de référence.
        </p>
      </div>
    </section>
  );
};
