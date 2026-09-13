'use client';

import React from 'react';

interface EducationHeroProps {
  onExploreClick: () => void;
  onSearchClick: () => void;
}

export const EducationHero: React.FC<EducationHeroProps> = ({
  onExploreClick,
  onSearchClick,
}) => {
  return (
    <section className="education-hero">
      {/* Subtle ambient lighting orbs */}
      <div className="hero-orb orb-primary" aria-hidden="true" />
      <div className="hero-orb orb-secondary" aria-hidden="true" />

      <div className="container hero-container">
        <div className="hero-content">
          {/* Badge Pill */}
          <div className="badge-pill hero-badge">
            <span className="badge-dot" />
            <span>Espace Éducation & Savoir</span>
          </div>

          {/* Main Title */}
          <h1 className="hero-title">
            Apprenez, progressez et{' '}
            <span className="gradient-hero-text">préparez votre réussite</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            Retrouvez des ressources éducatives adaptées à votre niveau, de l’école au
            supérieur. Cours, exercices corrigés, annales et fiches de révision conformes aux
            programmes du Sénégal.
          </p>

          {/* Actions */}
          <div className="hero-actions">
            <button
              type="button"
              className="btn-primary hero-btn-primary"
              onClick={onExploreClick}
            >
              <span>Explorer les ressources</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
            </button>

            <button
              type="button"
              className="btn-secondary hero-btn-secondary"
              onClick={onSearchClick}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span>Rechercher une ressource</span>
            </button>
          </div>

          {/* Key Metrics / Highlights */}
          <div className="hero-highlights">
            <div className="highlight-pill">
              <span className="highlight-dot dot-cyan" />
              <span>6 Cycles d’apprentissage</span>
            </div>
            <div className="highlight-pill">
              <span className="highlight-dot dot-indigo" />
              <span>10+ Matières fondamentales</span>
            </div>
            <div className="highlight-pill">
              <span className="highlight-dot dot-purple" />
              <span>Conforme aux programmes sénégalais</span>
            </div>
          </div>
        </div>

        {/* Abstract Vector Graphic (No photos of people) */}
        <div className="hero-graphic desktop-only" aria-hidden="true">
          <div className="graphic-canvas">
            <svg width="340" height="340" viewBox="0 0 340 340" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="eduGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="eduGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="eduLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>

              {/* Concentric rings */}
              <circle cx="170" cy="170" r="140" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="6 6" />
              <circle cx="170" cy="170" r="105" stroke="#cbd5e1" strokeWidth="1.5" />
              <circle cx="170" cy="170" r="70" fill="url(#eduGrad1)" />

              {/* Central Geometric Graduation & Knowledge Symbol */}
              <g transform="translate(170, 170)">
                <path d="M0 -36 L40 -12 L0 12 L-40 -12 Z" fill="#4f46e5" />
                <path d="M-28 0 L0 16 L28 0 L28 14 C28 28 -28 28 -28 14 Z" fill="#6366f1" opacity="0.9" />
                <line x1="32" y1="-8" x2="36" y2="20" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" />
                <circle cx="36" cy="22" r="3.5" fill="#ec4899" />
              </g>

              {/* Satellite nodes */}
              <g transform="translate(70, 90)">
                <circle cx="0" cy="0" r="24" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="18" fill="rgba(14, 165, 233, 0.1)" />
                <path d="M-6 4 L6 4 M-6 -4 L6 -4 M0 -8 L0 8" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
              </g>

              <g transform="translate(265, 85)">
                <circle cx="0" cy="0" r="26" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="20" fill="rgba(147, 51, 234, 0.1)" />
                <polygon points="0,-8 2,-2 8,-2 3,2 5,8 0,4 -5,8 -3,2 -8,-2 -2,-2" fill="#9333ea" />
              </g>

              <g transform="translate(270, 240)">
                <circle cx="0" cy="0" r="25" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="19" fill="rgba(16, 185, 129, 0.1)" />
                <path d="M-6 2 L-2 6 L7 -3" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </g>

              <g transform="translate(65, 245)">
                <circle cx="0" cy="0" r="24" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="18" fill="rgba(245, 158, 11, 0.1)" />
                <path d="M-5 -5 L5 5 M-5 5 L5 -5" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
              </g>
            </svg>
          </div>
        </div>
      </div>

      <style jsx>{`
        .education-hero {
          position: relative;
          padding: 60px 0 44px;
          background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
          border-bottom: 1px solid var(--border-subtle, #e2e8f0);
          overflow: hidden;
        }

        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }

        .orb-primary {
          width: 380px;
          height: 380px;
          background: rgba(99, 102, 241, 0.08);
          top: -80px;
          left: 5%;
        }

        .orb-secondary {
          width: 320px;
          height: 320px;
          background: rgba(236, 72, 153, 0.07);
          top: 40px;
          right: 5%;
        }

        .hero-container {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1.25fr 0.75fr;
          gap: 40px;
          align-items: center;
        }

        .hero-content {
          max-width: 680px;
        }

        .hero-badge {
          margin-bottom: 18px;
        }

        .hero-title {
          font-size: 42px;
          font-weight: 800;
          line-height: 1.18;
          letter-spacing: -0.03em;
          color: var(--text-heading, #0f172a);
          margin-bottom: 16px;
        }

        .hero-subtitle {
          font-size: 16.5px;
          line-height: 1.6;
          color: var(--text-body, #475569);
          margin-bottom: 30px;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }

        .hero-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 26px;
          font-size: 15px;
          font-weight: 700;
          box-shadow: 0 8px 20px -4px rgba(79, 70, 229, 0.35);
        }

        .hero-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 22px;
          font-size: 15px;
          font-weight: 600;
        }

        .hero-highlights {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .highlight-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 9999px;
          font-size: 12.5px;
          font-weight: 600;
          color: #334155;
          box-shadow: 0 2px 5px rgba(15, 23, 42, 0.03);
          transition: all 0.2s ease;
        }

        .highlight-pill:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 10px rgba(15, 23, 42, 0.06);
          transform: translateY(-1px);
        }

        .highlight-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .dot-cyan {
          background: #06b6d4;
          box-shadow: 0 0 6px rgba(6, 182, 212, 0.5);
        }

        .dot-indigo {
          background: #6366f1;
          box-shadow: 0 0 6px rgba(99, 102, 241, 0.5);
        }

        .dot-purple {
          background: #a855f7;
          box-shadow: 0 0 6px rgba(168, 85, 247, 0.5);
        }

        .hero-graphic {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .graphic-canvas {
          background: #ffffff;
          border: 1px solid var(--border-card, rgba(226, 232, 240, 0.8));
          border-radius: 32px;
          padding: 16px;
          box-shadow: 0 20px 45px -12px rgba(15, 23, 42, 0.08);
          animation: floatSlow 6s ease-in-out infinite alternate;
        }

        @keyframes floatSlow {
          from {
            transform: translateY(0px);
          }
          to {
            transform: translateY(-8px);
          }
        }

        @media (max-width: 960px) {
          .hero-container {
            grid-template-columns: 1fr;
            text-align: left;
          }

          .hero-title {
            font-size: 34px;
          }

          .hero-graphic {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .education-hero {
            padding: 40px 0 32px;
          }

          .hero-title {
            font-size: 28px;
          }

          .hero-subtitle {
            font-size: 15px;
          }

          .hero-actions {
            flex-direction: column;
            width: 100%;
          }

          .hero-btn-primary,
          .hero-btn-secondary {
            width: 100%;
            justify-content: center;
          }

          .hero-highlights {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .highlight-separator {
            display: none;
          }
        }
      `}</style>
    </section>
  );
};
