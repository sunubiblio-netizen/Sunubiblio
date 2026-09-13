'use client';

import React from 'react';
import Link from 'next/link';

interface AboutHeroProps {
  onExploreClick?: () => void;
}

export const AboutHero: React.FC<AboutHeroProps> = ({ onExploreClick }) => {
  return (
    <section className="about-hero">
      <div className="container">
        {/* Ambient atmospheric glow */}
        <div className="hero-ambient" aria-hidden="true">
          <div className="ambient-blob blob-purple" />
          <div className="ambient-blob blob-blue" />
          <div className="ambient-blob blob-rose" />
        </div>

        <div className="hero-grid">
          {/* Left: Texts */}
          <div className="hero-text-col">
            <div className="badge-pill hero-badge">
              <span className="badge-dot" />
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>À propos de Sunubiblio</span>
            </div>

            <h1 className="hero-title">
              Apprendre devrait être <br className="br-desktop" />
              <span className="title-highlight">plus simple.</span> <br />
              <span className="gradient-hero-text">Sunubiblio est là pour ça.</span>
            </h1>

            <p className="hero-subtitle">
              Une bibliothèque numérique pensée pour accompagner les apprenants dans leurs études, leurs révisions et la préparation de leurs concours au Sénégal.
            </p>

            <div className="hero-actions">
              <Link href="/bibliotheque" className="btn-primary hero-btn-primary">
                <span>Explorer la bibliothèque</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <a href="#histoire" className="btn-secondary hero-btn-secondary">
                <span>Découvrir notre histoire</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </a>
            </div>

            {/* Micro reassurance metric badges */}
            <div className="hero-features-chips">
              <div className="feature-chip">
                <span className="chip-dot" />
                <span>Ressources centralisées</span>
              </div>
              <div className="feature-chip">
                <span className="chip-dot" />
                <span>Pédagogie adaptée</span>
              </div>
              <div className="feature-chip">
                <span className="chip-dot" />
                <span>Fièrement sénégalais 🇸🇳</span>
              </div>
            </div>
          </div>

          {/* Right: Abstract Graphic Composition around Sunubiblio Logo */}
          <div className="hero-visual-col" aria-hidden="true">
            <div className="visual-stage">
              {/* Outer decorative orbit rings */}
              <div className="orbit-ring ring-1" />
              <div className="orbit-ring ring-2" />

              {/* Central Core: The 4-petal Sunubiblio emblem */}
              <div className="central-emblem-wrapper">
                <div className="emblem-backdrop" />
                <svg width="120" height="120" viewBox="6 6 88 88" fill="none" className="central-logo-svg">
                  <path d="M 0,-6 C 12,-28 28,-36 36,-28 C 44,-20 36,-4 14,0 Z" fill="#3B82F6" transform="translate(50,50)" />
                  <path d="M 6,0 C 28,12 36,28 28,36 C 20,44 4,36 0,14 Z" fill="#06B6D4" transform="translate(50,50)" />
                  <path d="M 0,6 C -12,28 -28,36 -36,28 C -44,20 -36,4 -14,0 Z" fill="#EC4899" transform="translate(50,50)" />
                  <path d="M -6,0 C -28,-12 -36,-28 -28,-36 C -20,-44 -4,-36 0,-14 Z" fill="#9333EA" transform="translate(50,50)" />
                </svg>
              </div>

              {/* Floating Card 1: Books & Knowledge */}
              <div className="floating-card float-card-top-left">
                <div className="fcard-icon icon-blue">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
                <div className="fcard-text">
                  <span className="fcard-title">Manuels & Cours</span>
                  <span className="fcard-sub">Programmes officiels</span>
                </div>
              </div>

              {/* Floating Card 2: Exams & Success */}
              <div className="floating-card float-card-bottom-right">
                <div className="fcard-icon icon-purple">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                    <circle cx="12" cy="8" r="7" />
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                  </svg>
                </div>
                <div className="fcard-text">
                  <span className="fcard-title">Annales Concours</span>
                  <span className="fcard-sub">FASTEF, ENA, Bac...</span>
                </div>
              </div>

              {/* Floating Card 3: Check & Progress */}
              <div className="floating-card float-card-bottom-left">
                <div className="fcard-icon icon-emerald">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.6">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="fcard-text">
                  <span className="fcard-title">Entraînement régulier</span>
                  <div className="fcard-progress-bar">
                    <div className="progress-fill" />
                  </div>
                </div>
              </div>

              {/* Floating Element: Stars & Excellence */}
              <div className="floating-badge float-badge-top-right">
                <span className="star-symbol">★</span>
                <span>Excellence & Réussite</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .about-hero {
          position: relative;
          padding: 60px 0 70px 0;
          overflow: hidden;
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
          opacity: 0.35;
        }

        .blob-purple {
          width: 380px;
          height: 380px;
          top: -40px;
          right: 10%;
          background: rgba(147, 51, 234, 0.16);
        }

        .blob-blue {
          width: 320px;
          height: 320px;
          top: 60px;
          left: 5%;
          background: rgba(59, 130, 246, 0.12);
        }

        .blob-rose {
          width: 260px;
          height: 260px;
          bottom: 20px;
          right: 35%;
          background: rgba(236, 72, 153, 0.1);
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 48px;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .hero-text-col {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .hero-badge {
          margin-bottom: 20px;
          border: 1px solid rgba(99, 102, 241, 0.25);
          background: rgba(238, 242, 255, 0.9);
          color: var(--primary);
        }

        .hero-title {
          font-size: clamp(32px, 4.2vw, 48px);
          font-weight: 800;
          color: var(--text-heading);
          line-height: 1.18;
          letter-spacing: -0.025em;
          margin-bottom: 18px;
        }

        .title-highlight {
          color: var(--text-heading);
        }

        .hero-subtitle {
          font-size: clamp(16px, 1.8vw, 18px);
          color: var(--text-body);
          line-height: 1.6;
          max-width: 580px;
          margin-bottom: 32px;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 36px;
        }

        .hero-btn-primary {
          padding: 12px 26px;
          font-size: 15px;
          box-shadow: 0 4px 18px rgba(99, 102, 241, 0.35);
        }

        .hero-btn-secondary {
          padding: 12px 22px;
          font-size: 15px;
        }

        .hero-features-chips {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .feature-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-muted);
        }

        .chip-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6366f1;
        }

        /* Right Visual Stage */
        .hero-visual-col {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .visual-stage {
          position: relative;
          width: 100%;
          max-width: 440px;
          height: 440px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .orbit-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px dashed rgba(99, 102, 241, 0.2);
          pointer-events: none;
        }

        .ring-1 {
          width: 320px;
          height: 320px;
        }

        .ring-2 {
          width: 420px;
          height: 420px;
          border-color: rgba(236, 72, 153, 0.15);
        }

        .central-emblem-wrapper {
          position: relative;
          width: 160px;
          height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 20px 48px -8px rgba(99, 102, 241, 0.25);
          border: 1px solid rgba(226, 232, 240, 0.8);
          z-index: 2;
        }

        .emblem-backdrop {
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
          filter: blur(8px);
        }

        .central-logo-svg {
          position: relative;
          z-index: 3;
          animation: subtleBreathe 4s ease-in-out infinite alternate;
        }

        @keyframes subtleBreathe {
          0% { transform: scale(0.98); }
          100% { transform: scale(1.02); }
        }

        /* Floating Cards */
        .floating-card {
          position: absolute;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: var(--radius-lg);
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 10px 28px -4px rgba(15, 23, 42, 0.08);
          z-index: 3;
          transition: transform 0.3s ease;
        }

        .floating-card:hover {
          transform: translateY(-4px);
        }

        .float-card-top-left {
          top: 30px;
          left: -10px;
        }

        .float-card-bottom-right {
          bottom: 40px;
          right: -10px;
        }

        .float-card-bottom-left {
          bottom: 25px;
          left: 10px;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
          width: 180px;
        }

        .fcard-icon {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .icon-blue {
          background: #eff6ff;
          color: #2563eb;
        }

        .icon-purple {
          background: #f5f3ff;
          color: #7c3aed;
        }

        .icon-emerald {
          background: #ecfdf5;
          color: #10b981;
        }

        .fcard-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .fcard-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-heading);
          white-space: nowrap;
        }

        .fcard-sub {
          font-size: 11px;
          color: var(--text-muted);
        }

        .fcard-progress-bar {
          width: 100%;
          height: 6px;
          border-radius: 999px;
          background: #f1f5f9;
          overflow: hidden;
        }

        .progress-fill {
          width: 78%;
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #10b981, #06b6d4);
        }

        .floating-badge {
          position: absolute;
          top: 45px;
          right: 15px;
          background: linear-gradient(135deg, #1e1b4b, #312e81);
          color: #ffffff;
          border-radius: var(--radius-full);
          padding: 8px 14px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          box-shadow: 0 8px 20px rgba(49, 46, 129, 0.25);
          z-index: 3;
        }

        .star-symbol {
          color: #f59e0b;
          font-size: 14px;
        }

        @media (max-width: 960px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 40px;
            text-align: center;
          }

          .hero-text-col {
            align-items: center;
          }

          .hero-subtitle {
            margin-left: auto;
            margin-right: auto;
          }

          .hero-actions {
            justify-content: center;
          }

          .hero-features-chips {
            justify-content: center;
          }

          .br-desktop {
            display: none;
          }
        }

        @media (max-width: 540px) {
          .about-hero {
            padding: 40px 0 40px 0;
          }

          .hero-title {
            font-size: 28px;
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

          .visual-stage {
            height: 360px;
            max-width: 320px;
          }

          .ring-1 {
            width: 260px;
            height: 260px;
          }

          .ring-2 {
            display: none;
          }

          .float-card-top-left {
            left: 0;
            top: 10px;
          }

          .float-card-bottom-right {
            right: 0;
            bottom: 10px;
          }

          .float-card-bottom-left {
            display: none;
          }
        }
      `}</style>
    </section>
  );
};
