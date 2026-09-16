'use client';

import React from 'react';
import { Contest } from '@/types/contest';

interface ContestsShowcaseSectionProps {
  contests: (Contest & { testsCount: number })[];
  selectedCompetitionId?: string;
  onSelectCompetition: (competitionId: string) => void;
}

export const ContestsShowcaseSection: React.FC<ContestsShowcaseSectionProps> = ({
  contests,
  selectedCompetitionId,
  onSelectCompetition,
}) => {
  if (!contests || contests.length === 0) return null;

  return (
    <section className="contests-showcase-section" aria-label="Concours disponibles">
      <div className="section-head-wrap">
        <div className="section-badge-top">
          <span className="badge-spark">🏆</span>
          <span>Priorité Concours & Examens</span>
        </div>
        <h2 className="section-main-heading">Préparez vos concours</h2>
        <p className="section-sub-heading">
          Entraînez-vous avec des tests, des livres et des ressources adaptés à chaque concours officiel.
        </p>
      </div>

      <div className="contests-cards-grid">
        {contests.slice(0, 6).map((contest) => {
          const isSelected = selectedCompetitionId === contest.id;
          const subjectsCount = contest.subjects?.length || 3;

          return (
            <article
              key={contest.id}
              className={`contest-showcase-card ${isSelected ? 'is-selected' : ''}`}
            >
              {/* En-tête de la carte avec dégradé et logo */}
              <div
                className="contest-card-banner"
                style={{ background: contest.coverGradient || 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' }}
              >
                <div className="banner-top-row">
                  <span className="contest-diploma-tag">{contest.diplomaLabel || 'Diplôme requis'}</span>
                  {contest.sessionYear && (
                    <span className="contest-year-pill">Session {contest.sessionYear}</span>
                  )}
                </div>

                <div className="banner-title-box">
                  <h3 className="contest-sigle">{contest.name}</h3>
                  <p className="contest-org">{contest.organization?.slice(0, 42)}</p>
                </div>
              </div>

              {/* Corps de la carte */}
              <div className="contest-card-body">
                <p className="contest-desc">
                  {contest.shortDescription || 'Préparation complète aux épreuves écrites et orales.'}
                </p>

                {/* Métriques clés */}
                <div className="contest-metrics-row">
                  <div className="metric-box">
                    <span className="metric-icon">📝</span>
                    <div className="metric-text">
                      <strong>{contest.testsCount || 'Tests'}</strong>
                      <span>tests réels</span>
                    </div>
                  </div>

                  <div className="metric-box">
                    <span className="metric-icon">📚</span>
                    <div className="metric-text">
                      <strong>{contest.resourcesCount || 40}+</strong>
                      <span>ressources</span>
                    </div>
                  </div>

                  <div className="metric-box">
                    <span className="metric-icon">🎓</span>
                    <div className="metric-text">
                      <strong>{subjectsCount}</strong>
                      <span>épreuves</span>
                    </div>
                  </div>
                </div>

                {/* Bouton d'action */}
                <button
                  type="button"
                  className={`contest-cta-btn ${isSelected ? 'cta-active' : ''}`}
                  onClick={() => onSelectCompetition(isSelected ? 'all' : contest.id)}
                >
                  <span>{isSelected ? 'Filtre appliqué ✓' : 'Préparer ce concours'}</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
