'use client';

import React from 'react';
import Link from 'next/link';

export const AboutCTA: React.FC = () => {
  return (
    <section className="about-cta-section">
      <div className="container">
        <div className="about-cta-box">
          {/* Ambient lighting spots */}
          <div className="cta-ambient" aria-hidden="true">
            <div className="cta-glow glow-blue" />
            <div className="cta-glow glow-pink" />
          </div>

          <div className="cta-content">
            <div className="badge-pill cta-badge">
              <span className="badge-dot" />
              <span>Votre Avenir Commence Ici</span>
            </div>

            <h2 className="cta-title">
              Prêt à commencer votre parcours ?
            </h2>

            <p className="cta-subtitle">
              Découvrez les ressources disponibles sur Sunubiblio et commencez à apprendre à votre rythme, en toute autonomie.
            </p>

            <div className="cta-actions">
              <Link href="/bibliotheque" className="btn-primary cta-primary-btn">
                <span>Explorer la bibliothèque</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>

              <Link href="/concours" className="btn-secondary cta-secondary-btn">
                <span>Découvrir les concours</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .about-cta-section {
          padding: 30px 0 70px 0;
          position: relative;
        }

        .about-cta-box {
          position: relative;
          background: linear-gradient(135deg, #1e1b4b 0%, #2e1065 50%, #4a044e 100%);
          border-radius: var(--radius-2xl);
          overflow: hidden;
          padding: 64px 32px;
          text-align: center;
          box-shadow: 0 20px 48px -10px rgba(79, 70, 229, 0.25);
          border: 1px solid rgba(139, 92, 246, 0.3);
        }

        .cta-ambient {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .cta-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          opacity: 0.35;
        }

        .glow-blue {
          width: 320px;
          height: 320px;
          top: -60px;
          left: 10%;
          background: #3b82f6;
        }

        .glow-pink {
          width: 340px;
          height: 340px;
          bottom: -60px;
          right: 10%;
          background: #ec4899;
        }

        .cta-content {
          position: relative;
          z-index: 2;
          max-width: 680px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .cta-badge {
          margin-bottom: 20px;
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .cta-title {
          font-size: clamp(26px, 3.5vw, 40px);
          font-weight: 800;
          color: #ffffff;
          line-height: 1.2;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }

        .cta-subtitle {
          font-size: clamp(15px, 2vw, 17px);
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .cta-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .cta-primary-btn {
          padding: 13px 28px;
          font-size: 15px;
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
        }

        .cta-secondary-btn {
          padding: 13px 24px;
          font-size: 15px;
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: var(--radius-full);
          backdrop-filter: blur(10px);
          font-weight: 600;
          transition: all var(--transition-normal);
        }

        .cta-secondary-btn:hover {
          background: #ffffff;
          color: #1e1b4b;
          border-color: #ffffff;
          transform: translateY(-1px);
        }

        @media (max-width: 640px) {
          .about-cta-box {
            padding: 40px 20px;
          }

          .cta-actions {
            flex-direction: column;
            width: 100%;
          }

          .cta-primary-btn,
          .cta-secondary-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};
