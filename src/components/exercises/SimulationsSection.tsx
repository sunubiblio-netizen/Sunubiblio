'use client';

import React from 'react';
import Link from 'next/link';
import { Exercise } from '@/types/exercise';

interface SimulationsSectionProps {
  simulations: Exercise[];
  resourceSeries: { resourceId: string; resourceTitle: string; tests: Exercise[] }[];
}

export const SimulationsSection: React.FC<SimulationsSectionProps> = ({
  simulations,
  resourceSeries,
}) => {
  return (
    <section className="simulations-showcase-section" aria-label="Simulations de concours et épreuves">
      <div className="section-head-wrap">
        <div className="section-badge-top">
          <span className="badge-spark">⏱</span>
          <span>Conditions Réelles d'Examen</span>
        </div>
        <h2 className="section-main-heading">Simulations de concours & Épreuves Blanches</h2>
        <p className="section-sub-heading">
          Passez une épreuve complète dans les conditions des jurys : durée chronométrée, barème officiel, aucune réponse divulguée pendant le test et correction détaillée après soumission.
        </p>
      </div>

      {/* 1. Cartes de simulation d'examen */}
      <div className="simulations-cards-grid">
        {simulations.slice(0, 3).map((sim) => (
          <article key={sim.id} className="simulation-highlight-card">
            <div className="sim-card-top">
              <span className="sim-badge-official">Simulation Certificative</span>
              <span className="sim-diff-tag diff-pro">🔴 Pro / Examen</span>
            </div>

            <h3 className="sim-title">{sim.title}</h3>
            <p className="sim-desc">{sim.description}</p>

            <div className="sim-meta-row">
              <span className="sim-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>{sim.durationMinutes} minutes</span>
              </span>

              <span className="sim-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>{sim.questionsCount} questions</span>
              </span>

              {sim.competitionName && (
                <span className="sim-meta-item sim-comp-pill">
                  🏆 {sim.competitionName}
                </span>
              )}
            </div>

            <div className="sim-card-cta-row">
              <Link href={`/exercices/${sim.id}`} className="btn-primary sim-start-btn">
                <span>Commencer la simulation</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* 2. Bloc Séries de tests liées aux livres */}
      {resourceSeries.length > 0 && (
        <div className="resource-series-banner">
          <div className="series-banner-left">
            <span className="series-eyebrow">Parcours Complet Associé</span>
            <h4 className="series-title">
              📚 Série d'entraînement : {resourceSeries[0].resourceTitle}
            </h4>
            <p className="series-desc">
              Cette ressource comprend <strong>{resourceSeries[0].tests.length} tests progressifs</strong> organisés en 3 paliers : Débutant (notions), Intermédiaire (méthodes) et Pro (synthèse).
            </p>
          </div>

          <div className="series-banner-right">
            <div className="series-levels-pills">
              <span className="pill-phase phase-green">
                🟢 {resourceSeries[0].tests.filter((t) => t.difficulty === 'BEGINNER').length} Débutant
              </span>
              <span className="pill-phase phase-orange">
                🟠 {resourceSeries[0].tests.filter((t) => t.difficulty === 'INTERMEDIATE').length} Intermédiaire
              </span>
              <span className="pill-phase phase-red">
                🔴 {resourceSeries[0].tests.filter((t) => t.difficulty === 'PRO').length} Pro / Blanc
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
