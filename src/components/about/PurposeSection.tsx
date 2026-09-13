'use client';

import React from 'react';

export const PurposeSection: React.FC = () => {
  return (
    <section className="purpose-section">
      <div className="container">
        <div className="purpose-box">
          <div className="purpose-badge-row">
            <span className="purpose-badge">Notre Engagement</span>
          </div>

          <h2 className="purpose-title">
            Une plateforme construite pour répondre à un <span className="gradient-hero-text">besoin réel</span>
          </h2>

          <p className="purpose-text">
            Sunubiblio n’est pas le résultat d’un exercice théorique, mais la réponse directe aux difficultés concrètes vécues par des générations d’apprenants : l’accès difficile aux manuels de cours récents, la rareté des annales officielles avec de véritables corrigés, et l’isolement lors des révisions d’examens ou de concours.
          </p>

          <p className="purpose-subtext">
            Notre engagement est de bâtir, jour après jour, un outil fiable, utile, rigoureux et durable qui donne à chaque élève, étudiant et candidat les meilleures chances d’accomplir son plein potentiel.
          </p>

          <div className="purpose-commitments">
            <div className="commitment-chip">
              <span className="check-icon">✓</span>
              <span>100% centré sur l’apprenant</span>
            </div>
            <div className="commitment-chip">
              <span className="check-icon">✓</span>
              <span>Ressources vérifiées & méthodologiques</span>
            </div>
            <div className="commitment-chip">
              <span className="check-icon">✓</span>
              <span>Amélioration continue au quotidien</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .purpose-section {
          padding: 20px 0 50px 0;
          position: relative;
        }

        .purpose-box {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-2xl);
          padding: 48px 40px;
          text-align: center;
          max-width: 900px;
          margin: 0 auto;
          box-shadow: var(--shadow-sm);
        }

        .purpose-badge-row {
          display: flex;
          justify-content: center;
          margin-bottom: 16px;
        }

        .purpose-badge {
          font-size: 11.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #4f46e5;
          background: #eef2ff;
          padding: 4px 14px;
          border-radius: var(--radius-full);
        }

        .purpose-title {
          font-size: clamp(24px, 3.2vw, 34px);
          font-weight: 800;
          color: var(--text-heading);
          letter-spacing: -0.02em;
          line-height: 1.25;
          margin-bottom: 20px;
        }

        .purpose-text {
          font-size: 16px;
          color: var(--text-body);
          line-height: 1.7;
          max-width: 760px;
          margin: 0 auto 16px auto;
        }

        .purpose-subtext {
          font-size: 14.5px;
          color: var(--text-muted);
          line-height: 1.65;
          max-width: 720px;
          margin: 0 auto 28px auto;
        }

        .purpose-commitments {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .commitment-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--surface-subtle);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 700;
          color: var(--text-heading);
        }

        .check-icon {
          color: #10b981;
          font-weight: 800;
        }

        @media (max-width: 640px) {
          .purpose-box {
            padding: 32px 20px;
          }

          .purpose-commitments {
            flex-direction: column;
            gap: 8px;
          }

          .commitment-chip {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};
