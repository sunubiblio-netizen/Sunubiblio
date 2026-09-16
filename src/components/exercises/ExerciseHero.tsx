'use client';

import React from 'react';

interface ExerciseHeroProps {
  onStartRandom?: () => void;
  onExplore?: () => void;
}

export const ExerciseHero: React.FC<ExerciseHeroProps> = ({
  onStartRandom,
  onExplore,
}) => {
  return (
    <section className="exercise-hero-section">
      <div className="container exercise-hero-container">
        {/* Centered Badge */}
        <div className="exercise-hero-badge">
          <span className="hero-badge-dot" />
          <span>Espace Entraînement & Pédagogie</span>
        </div>

        {/* Strictly Centered Title */}
        <h1 className="exercise-hero-title">
          <span className="exercise-hero-title-text">Exercices</span>
        </h1>

        {/* Strictly Centered Subtitle */}
        <p className="exercise-hero-subtitle">
          Entraînez-vous, testez vos connaissances et progressez à votre rythme.
        </p>

        {/* Optional Subtext Context */}
        <p className="exercise-hero-desc">
          Des QCM interactifs, exercices d’application et annales de concours pour vous préparer efficacement à vos examens officiels.
        </p>

        {/* Actions */}
        <div className="exercise-hero-actions">
          <button
            type="button"
            className="btn-primary exercise-cta-btn"
            onClick={onStartRandom}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>Commencer un exercice</span>
          </button>

          <button
            type="button"
            className="btn-secondary exercise-sec-btn"
            onClick={onExplore}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span>Explorer les exercices</span>
          </button>
        </div>
      </div>
    </section>
  );
};
