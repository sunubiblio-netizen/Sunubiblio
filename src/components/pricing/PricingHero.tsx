'use client';

import React from 'react';

interface PricingHeroProps {
  onScrollToPlans?: () => void;
}

export const PricingHero: React.FC<PricingHeroProps> = ({ onScrollToPlans }) => {
  return (
    <section className="pricing-hero">
      <div className="container">
        {/* Background ambient lighting */}
        <div className="hero-ambient" aria-hidden="true">
          <div className="ambient-blob blob-purple" />
          <div className="ambient-blob blob-blue" />
          <div className="ambient-blob blob-rose" />
        </div>

        <div className="hero-content">
          {/* Header pill badge */}
          <div className="badge-pill hero-badge">
            <span className="badge-dot" />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>Formules & Abonnements Sunubiblio</span>
          </div>

          <h1 className="hero-title">
            Choisissez la formule qui{' '}
            <span className="gradient-hero-text">vous correspond</span>
          </h1>

          <p className="hero-punchline">
            Apprenez plus. Progressez plus vite.
          </p>

          <p className="hero-subtitle">
            Accédez aux manuels scolaires conformes, annales de concours corrigées, exercices interactifs et à votre tuteur IA pour booster votre réussite au Sénégal.
          </p>

          {/* Quick reassurance pills */}
          <div className="hero-reassurance-row">
            <div className="reassurance-chip">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Sans engagement, liberté totale</span>
            </div>
            <div className="reassurance-chip">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Activation immédiate par Wave & OM</span>
            </div>
            <div className="reassurance-chip">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Paiement 100% sécurisé</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .pricing-hero {
          position: relative;
          padding: 64px 0 32px 0;
          overflow: hidden;
          text-align: center;
        }

        .hero-ambient {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .ambient-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.45;
        }

        .blob-purple {
          width: 380px;
          height: 380px;
          top: -60px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(147, 51, 234, 0.15);
        }

        .blob-blue {
          width: 320px;
          height: 320px;
          top: 40px;
          left: 15%;
          background: rgba(59, 130, 246, 0.12);
        }

        .blob-rose {
          width: 280px;
          height: 280px;
          top: 60px;
          right: 15%;
          background: rgba(236, 72, 153, 0.12);
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 820px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero-badge {
          margin-bottom: 20px;
          border: 1px solid rgba(99, 102, 241, 0.2);
          background: rgba(238, 242, 255, 0.85);
          color: var(--primary);
        }

        .hero-title {
          font-size: clamp(30px, 4.5vw, 48px);
          font-weight: 800;
          color: var(--text-heading);
          line-height: 1.15;
          letter-spacing: -0.025em;
          margin-bottom: 12px;
        }

        .hero-punchline {
          font-size: clamp(17px, 2.2vw, 22px);
          font-weight: 700;
          color: #6366f1;
          margin-bottom: 16px;
          letter-spacing: -0.01em;
        }

        .hero-subtitle {
          font-size: clamp(15px, 1.8vw, 17px);
          color: var(--text-body);
          line-height: 1.6;
          max-width: 680px;
          margin-bottom: 28px;
        }

        .hero-reassurance-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .reassurance-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          font-size: 13px;
          font-weight: 600;
          color: var(--text-heading);
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
          backdrop-filter: blur(8px);
        }

        @media (max-width: 640px) {
          .pricing-hero {
            padding: 40px 0 24px 0;
          }

          .hero-reassurance-row {
            gap: 8px;
          }

          .reassurance-chip {
            padding: 6px 12px;
            font-size: 12px;
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};
