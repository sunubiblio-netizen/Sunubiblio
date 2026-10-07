'use client';

import React from 'react';
import Link from 'next/link';

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

        {/* Panneau Maître des 3 Fonctions Clés */}
        <div className="exercise-generation-hub">
          {/* 1. Carte Principale : Générer des exercices */}
          <Link href="/ia/exercices" className="gen-card gen-main-card">
            <div className="gen-card-badge">IA Pédagogique</div>
            <div className="gen-icon-wrap">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="gen-text-content">
              <h2 className="gen-main-title">Générer des exercices</h2>
              <p className="gen-main-subtitle">Exercices adaptés au niveau et à la matière</p>
            </div>
            <div className="gen-action-arrow">
              <span>Lancer</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </Link>

          {/* 2 sous-options : 1. Générer des QCM, 2. Corriger */}
          <div className="gen-sub-options-grid">
            <Link href="/ia/qcm" className="gen-card gen-sub-card">
              <div className="sub-icon-wrap icon-qcm">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>
              <div className="sub-text-meta">
                <h3 className="gen-sub-title">1. Générer des QCM</h3>
                <p className="gen-sub-desc">Questionnaires interactifs par chapitre</p>
              </div>
            </Link>

            <Link href="/ia/corriger" className="gen-card gen-sub-card">
              <div className="sub-icon-wrap icon-corriger">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <div className="sub-text-meta">
                <h3 className="gen-sub-title">2. Corriger</h3>
                <p className="gen-sub-desc">Correction détaillée et explications pas-à-pas</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Actions standards */}
        <div className="exercise-hero-actions">
          <button
            type="button"
            className="btn-primary exercise-cta-btn"
            onClick={onStartRandom}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>Commencer un exercice aléatoire</span>
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
            <span>Explorer la bibliothèque d’exercices</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .exercise-generation-hub {
          width: 100%;
          max-width: 820px;
          margin: 28px auto 32px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          text-align: left;
        }

        .gen-card {
          text-decoration: none;
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.05);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .gen-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px -4px rgba(37, 99, 235, 0.12);
          border-color: #93c5fd;
        }

        .gen-main-card {
          position: relative;
          padding: 20px 24px;
          background: linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%);
          border: 1.5px solid #bfdbfe;
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .gen-card-badge {
          position: absolute;
          top: -10px;
          right: 24px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #ffffff;
          font-size: 0.6875rem;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 9999px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .gen-icon-wrap {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
        }

        .gen-text-content {
          flex: 1;
        }

        .gen-main-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px;
        }

        .gen-main-subtitle {
          font-size: 0.875rem;
          color: #3b82f6;
          font-weight: 600;
          margin: 0;
        }

        .gen-action-arrow {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          font-size: 0.875rem;
          color: #1d4ed8;
          padding: 8px 16px;
          border-radius: 10px;
          background: #dbeafe;
          transition: background 0.15s ease;
        }

        .gen-main-card:hover .gen-action-arrow {
          background: #2563eb;
          color: #ffffff;
        }

        .gen-sub-options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .gen-sub-card {
          padding: 16px 18px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .sub-icon-wrap {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .icon-qcm {
          background: #eff6ff;
          color: #2563eb;
        }

        .icon-corriger {
          background: #fef2f2;
          color: #dc2626;
        }

        .gen-sub-title {
          font-size: 0.9375rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 2px;
        }

        .gen-sub-desc {
          font-size: 0.75rem;
          color: #64748b;
          margin: 0;
        }

        @media (max-width: 640px) {
          .gen-sub-options-grid {
            grid-template-columns: 1fr;
          }
          .gen-main-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .gen-action-arrow {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};
