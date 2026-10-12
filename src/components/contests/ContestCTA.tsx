'use client';

import React from 'react';
import Link from 'next/link';

interface ContestCTAProps {
  onExploreClick?: () => void;
  onOpenPricing?: () => void;
}

export const ContestCTA: React.FC<ContestCTAProps> = ({
  onExploreClick,
  onOpenPricing,
}) => {
  return (
    <section className="contest-cta-section">
      <div className="container">
        <div className="contest-cta-box">
          {/* Subtle warm amber ambient glow */}
          <div className="cta-ambient" aria-hidden="true">
            <div className="cta-glow glow-amber" />
          </div>

          <div className="cta-content">
            {/* Pill Badge matching Image 2 */}
            <div className="cta-badge-pill">
              <span className="badge-pulse-dot" />
              <span>Réussite & Excellence aux Concours</span>
            </div>

            {/* Title with golden amber gradient accent */}
            <h2 className="cta-title">
              Prêt à réussir votre <span className="cta-title-accent">concours</span> ?
            </h2>

            <p className="cta-subtitle">
              Accédez aux programmes officiels, sujets corrigés et QCM interactifs pour vous entraîner en conditions réelles et maximiser vos chances d'admission.
            </p>

            <div className="cta-actions">
              <button
                type="button"
                className="cta-primary-btn"
                onClick={onExploreClick}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '9px',
                  height: '46px',
                  padding: '0 26px',
                  fontSize: '14.5px',
                  fontWeight: 700,
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#ffffff',
                  border: 'none',
                  outline: 'none',
                  boxShadow: '0 4px 14px rgba(217, 119, 6, 0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <span>Explorer les concours</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>

              <Link
                href="/#tarifs"
                className="cta-secondary-btn"
                onClick={onOpenPricing}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '46px',
                  padding: '0 24px',
                  fontSize: '14.5px',
                  fontWeight: 600,
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(10px)',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                Voir les formules d’abonnement
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .contest-cta-section {
          padding: 40px 0 70px 0;
        }

        .contest-cta-box {
          position: relative;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #334155 100%);
          border-radius: 28px;
          overflow: hidden;
          padding: 56px 40px;
          text-align: center;
          box-shadow: 0 20px 40px -12px rgba(15, 23, 42, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .cta-ambient {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .cta-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.25;
        }

        .glow-amber {
          width: 420px;
          height: 420px;
          top: -120px;
          left: 50%;
          transform: translateX(-50%);
          background: radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, rgba(217, 119, 6, 0.1) 50%, transparent 70%);
        }

        .cta-content {
          position: relative;
          z-index: 2;
          max-width: 660px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .cta-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 9999px;
          font-size: 12.5px;
          font-weight: 700;
          color: #fbbf24;
          margin-bottom: 18px;
        }

        .badge-pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #f59e0b;
          box-shadow: 0 0 8px rgba(245, 158, 11, 0.7);
        }

        .cta-title {
          font-size: clamp(26px, 3.5vw, 36px);
          font-weight: 800;
          color: #ffffff;
          line-height: 1.22;
          margin-bottom: 14px;
          letter-spacing: -0.025em;
        }

        .cta-title-accent {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline;
        }

        .cta-subtitle {
          font-size: clamp(15px, 2vw, 16.5px);
          color: #cbd5e1;
          line-height: 1.6;
          margin-bottom: 30px;
        }

        .cta-actions {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .cta-primary-btn:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg, #fbbf24 0%, #ea580c 100%) !important;
          box-shadow: 0 6px 20px rgba(217, 119, 6, 0.52) !important;
        }

        .cta-secondary-btn:hover {
          background: #ffffff !important;
          color: #0f172a !important;
          border-color: #ffffff !important;
          transform: translateY(-2px);
        }

        @media (max-width: 640px) {
          .contest-cta-box {
            padding: 36px 20px;
            border-radius: 20px;
          }

          .cta-actions {
            flex-direction: column;
            width: 100%;
          }

          .cta-primary-btn, .cta-secondary-btn {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </section>
  );
};
